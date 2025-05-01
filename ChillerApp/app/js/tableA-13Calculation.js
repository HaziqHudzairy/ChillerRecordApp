import tableData from '../json/table_A13.json';

export default tableData;

export function calcEvap(inputPressure, actualTemp){
    return findPressureBounds(inputPressure, actualTemp);
}

export function calcComp(inputPressure, actualTemp){
    return findPressureBounds(inputPressure, actualTemp);
}

export function calcComp2s(inputPressure, evapS){
    return findPressureBounds2s(inputPressure, evapS);
}

function findPressureBounds(inputPressure, actualTemp) {
    if (!Array.isArray(tableData)) {
        console.error("Error: JSON data is not an array.");
        return null;
    }

    //sort to find in between (find section)
    const pressures = tableData.map(entry => entry.pressure).sort((a, b) => a - b);
    let lowerP = null, upperP = null;
    let lowerIndex = -1, upperIndex = -1;
    for (let i = 0; i < pressures.length - 1; i++) {
        if (pressures[i] <= inputPressure && inputPressure <= pressures[i + 1]) {
            lowerP = pressures[i];
            upperP = pressures[i + 1];
            lowerIndex = i;
            upperIndex = i + 1;
            break;
        }
    }

    //error handling 
    if (lowerP === null || upperP === null) {
        console.warn("Input pressure is out of range.");
        return null;
    }
    //find full data based on the table (find line)
    const tempBounds = findTemperatureBounds(actualTemp, lowerP, upperP);

    //find P saturated
    const Pnormalized = calculateNormalized(inputPressure, lowerP, upperP);

    //find interpolate stage
    const finalBounds = interpolateHS(Pnormalized, tempBounds);

    //find T saturatedd
    const Tnormalized = calculateNormalized(actualTemp, tempBounds.lowerP_T.Tlower, tempBounds.lowerP_T.Tupper);

    //find final h and s
    const { h_final, s_final } = interpolateFinalHS(Tnormalized, finalBounds);

    return {
        h_final,
        s_final
    };


}

function findPressureBounds2s(inputPressure, evapS) {
    if (!Array.isArray(tableData)) {
        console.error("Error: JSON data is not an array.");
        return null;
    }
    //sort to find in between (find section)
    const pressures = tableData.map(entry => entry.pressure).sort((a, b) => a - b);
    let lowerP = null, upperP = null;
    let lowerIndex = -1, upperIndex = -1;

    for (let i = 0; i < pressures.length - 1; i++) {
        if (pressures[i] <= inputPressure && inputPressure <= pressures[i + 1]) {
            lowerP = pressures[i];
            upperP = pressures[i + 1];
            lowerIndex = i;
            upperIndex = i + 1;
            break;
        }
    }

    //find in between temperature based on entropy evaporator
    const tempBounds = findTemperatureFromEntropy(evapS, lowerP, upperP);

    //find p saturated
    const Pnormalized = calculateNormalized(inputPressure, lowerP, upperP);

    //find interpolate stage
    const finalBounds = interpolateHS2(Pnormalized, tempBounds);

    //find actual temperature state 2s
    const temperature2s = interpolate(evapS, finalBounds.s_Tlower, finalBounds.s_Tupper, tempBounds.lowerP_T.Tlower, tempBounds.lowerP_T.Tupper);

    //find h for state 2s
    const h_final = interpolate(temperature2s, tempBounds.lowerP_T.Tlower, tempBounds.lowerP_T.Tupper, finalBounds.h_Tlower, finalBounds.h_Tupper);

    return { temperature2s, h_final };
}

const interpolate = (x, x0, x1, y0, y1) => {
    return y0 + ((y1 - y0) * ((x - x0) / (x1 - x0)));
};

function findTemperatureBounds(actualTemp, lowerP, upperP) {
    if (!Array.isArray(tableData)) {
        console.error("Error: JSON data is not an array.");
        return null;
    }

    const lowerPData = tableData.find(entry => entry.pressure === lowerP);
    const upperPData = tableData.find(entry => entry.pressure === upperP);

    if (!lowerPData || !upperPData) {
        console.error("Error: Could not find pressure data in JSON.");
        return null;
    }

    const lowerPTemps = Object.keys(lowerPData.for_T).map(Number).sort((a, b) => a - b);
    const upperPTemps = Object.keys(upperPData.for_T).map(Number).sort((a, b) => a - b);

    let Tlower_LP = null, Tupper_LP = null;
    for (let i = 0; i < lowerPTemps.length - 1; i++) {
        if (lowerPTemps[i] <= actualTemp && actualTemp <= lowerPTemps[i + 1]) {
            Tlower_LP = lowerPTemps[i];
            Tupper_LP = lowerPTemps[i + 1];
            break;
        }
    }

    let Tlower_UP = null, Tupper_UP = null;
    for (let i = 0; i < upperPTemps.length - 1; i++) {
        if (upperPTemps[i] <= actualTemp && actualTemp <= upperPTemps[i + 1]) {
            Tlower_UP = upperPTemps[i];
            Tupper_UP = upperPTemps[i + 1];
            break;
        }
    }

    const h_s_LP_lower = lowerPData.for_T[Tlower_LP] || null;
    const h_s_LP_upper = lowerPData.for_T[Tupper_LP] || null;

    const h_s_UP_lower = upperPData.for_T[Tlower_UP] || null;
    const h_s_UP_upper = upperPData.for_T[Tupper_UP] || null;

    if (!h_s_LP_lower || !h_s_LP_upper || !h_s_UP_lower || !h_s_UP_upper) {
        console.warn("Warning: Temperature is out of range.");
        return null;
    }

    return {
        lowerP_T: {
            Tlower: Tlower_LP, Tupper: Tupper_LP,
            h_s_LP_lower, h_s_LP_upper
        },
        upperP_T: {
            Tlower: Tlower_UP,
            Tupper: Tupper_UP,
            h_s_UP_lower,
            h_s_UP_upper
        }
    };
}

function calculateNormalized(actualX, lowerX, upperX) {
    if (lowerX === null || upperX === null || lowerX === upperX) {
        console.error("Error: Invalid pressure bounds.");
        return null;
    }
    const Xnormalized = (actualX - lowerX) / (upperX - lowerX);

    return Xnormalized;
}

function interpolateHS(Pnormalized, tempBounds) {
    if (!tempBounds) {
        console.error("Error: Temperature bounds data is missing.");
        return null;
    }

    const { h_s_LP_lower, h_s_LP_upper } = tempBounds.lowerP_T;
    const { h_s_UP_lower, h_s_UP_upper } = tempBounds.upperP_T;

    const h_Tlower = h_s_LP_lower.h + Pnormalized * (h_s_UP_lower.h - h_s_LP_lower.h);
    const s_Tlower = h_s_LP_lower.s + Pnormalized * (h_s_UP_lower.s - h_s_LP_lower.s);

    const h_Tupper = h_s_LP_upper.h + Pnormalized * (h_s_UP_upper.h - h_s_LP_upper.h);
    const s_Tupper = h_s_LP_upper.s + Pnormalized * (h_s_UP_upper.s - h_s_LP_upper.s);


    return {
        h_Tlower,
        s_Tlower,
        h_Tupper,
        s_Tupper
    };
}

function interpolateHS2(Pnormalized, tempBounds) {
    if (!tempBounds) {
        console.error("Error: Temperature bounds data is missing.");
        return null;
    }

    const { h_s_LowerT: h_s_LP_lower, h_s_UpperT: h_s_LP_upper } = tempBounds.lowerP_T;
    const { h_s_LowerT: h_s_UP_lower, h_s_UpperT: h_s_UP_upper } = tempBounds.upperP_T;

    const h_Tlower = h_s_LP_lower.h + Pnormalized * (h_s_UP_lower.h - h_s_LP_lower.h);
    const s_Tlower = h_s_LP_lower.s + Pnormalized * (h_s_UP_lower.s - h_s_LP_lower.s);

    const h_Tupper = h_s_LP_upper.h + Pnormalized * (h_s_UP_upper.h - h_s_LP_upper.h);
    const s_Tupper = h_s_LP_upper.s + Pnormalized * (h_s_UP_upper.s - h_s_LP_upper.s);

    return {
        h_Tlower,
        s_Tlower,
        h_Tupper,
        s_Tupper
    };
}

function interpolateFinalHS(Tnormalized, finalBounds) {
    if (!finalBounds) {
        console.error("Error: Final bounds data is missing.");
        return null;
    }

    const { h_Tlower, h_Tupper, s_Tlower, s_Tupper } = finalBounds;

    const h_final = h_Tlower + Tnormalized * (h_Tupper - h_Tlower);
    const s_final = s_Tlower + Tnormalized * (s_Tupper - s_Tlower);

    return { h_final, s_final };
}

function findTemperatureFromEntropy(evapS, lowerP, upperP) {

    if (!Array.isArray(tableData)) {
        console.error("Error: JSON data is not an array.");
        return null;
    }

    const lowerPData = tableData.find(entry => entry.pressure === lowerP);

    if (!lowerPData) {
        console.error("Error: Could not find pressure data for lowerP in JSON.");
        return null;
    }

    const findTemperatureRangeForLowerP = (evapS, pressureData) => {
        const tempKeys = Object.keys(pressureData.for_T).map(Number).sort((a, b) => a - b);
        let lowerT = null, upperT = null;

        for (let i = 0; i < tempKeys.length - 1; i++) {
            const s1 = pressureData.for_T[tempKeys[i]].s;
            const s2 = pressureData.for_T[tempKeys[i + 1]].s;

            if (s1 <= evapS && evapS <= s2) {
                lowerT = tempKeys[i];
                upperT = tempKeys[i + 1];
                break;
            }
        }

        if (lowerT === null || upperT === null) {
            console.warn("No valid temperature range found for the given entropy.");
            return null;
        }

        return { lowerT, upperT };
    };

    const lowerPRange = findTemperatureRangeForLowerP(evapS, lowerPData);

    if (!lowerPRange) {
        console.error("Error: Could not find temperature range for lower pressure.");
        return null;
    }

    const lowerP_LowerT = lowerPData.for_T[lowerPRange.lowerT];
    const lowerP_UpperT = lowerPData.for_T[lowerPRange.upperT];

    const upperPData = tableData.find(entry => entry.pressure === upperP);

    if (!upperPData) {
        console.error("Error: Could not find pressure data for upperP in JSON.");
        return null;
    }

    const upperP_LowerT = upperPData.for_T[lowerPRange.lowerT];
    const upperP_UpperT = upperPData.for_T[lowerPRange.upperT];

    return {
        lowerP_T: {
            Tlower: lowerPRange.lowerT,
            Tupper: lowerPRange.upperT,
            h_s_LowerT: lowerP_LowerT,
            h_s_UpperT: lowerP_UpperT,
        },
        upperP_T: {
            Tlower: lowerPRange.lowerT,
            Tupper: lowerPRange.upperT,
            h_s_LowerT: upperP_LowerT,
            h_s_UpperT: upperP_UpperT,
        }
    };
}










