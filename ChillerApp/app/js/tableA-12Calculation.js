import tableData from '../json/table_A12.json';

export default tableData;



export function CalcCond(actualP, actualT) {

  //sorting
  const sortedData = tableData.sort((a, b) => a.Pressure - b.Pressure);
  let lower, upper;
  for (let i = 0; i < sortedData.length - 1; i++) {
    const curr = sortedData[i];
    const next = sortedData[i + 1];
    if (actualP >= curr.Pressure && actualP <= next.Pressure) {
      lower = curr;
      upper = next;
      break;
    }
  }

  //error handling
  if (!lower || !upper) {
    console.error('Pressure out of bounds');
    return null;
  }

  //calculate T saturation
  const TempNormalized = normalize(actualT, lower.Tsat, upper.Tsat);

  //check condition for condenser
  if (actualT > upper.Tsat) {
    const h_final = interpolate(lower.hg, upper.hg, TempNormalized);
    const s_final = interpolate(lower.sg, upper.sg, TempNormalized);
    const isSuperheated = true;
    // console.log("Tcond greater than upper tsat");

    return { h_final, s_final, TempNormalized, isSuperheated };
  }
  else if (actualT < upper.Tsat && actualT > lower.Tsat) {

    const h_final = interpolate(lower.hf, upper.hf, TempNormalized);
    const s_final = interpolate(lower.sf, upper.sf, TempNormalized);
    const isSuperheated = false;
    // console.log("Tcond greater than lower tsat and less than upper tsat");

    return { h_final, s_final, TempNormalized, isSuperheated };
  }
  else {
    const h_final = interpolate(lower.hg, upper.hg, TempNormalized);
    const s_final = interpolate(lower.sg, upper.sg, TempNormalized);
    const isSuperheated = false;
    // console.log("Tcond lower than lower tsat");

    return { h_final, s_final, TempNormalized, isSuperheated };
  }
};

export function CalcEV(actualT, TNormalized) {
  const group = findTemperatureGroup(TNormalized);
  if (group === null) {
    // console.error('Temperature out of bounds');
    return 0;
  }
  const TempNormalized = normalize(actualT, group.lowerGroup.Tsat, group.upperGroup.Tsat);

  if (actualT > group.upperGroup.Tsat) {
    const s_final = interpolate(group.lowerGroup.sg, group.upperGroup.sg, TempNormalized);
    const isSuperheated = true;
    // console.log("Tev greater than upper tsat");

    return { s_final, isSuperheated };
  }
  else if (actualT < group.upperGroup.Tsat && actualT > group.lowerGroup.Tsat) {

    const s_final = interpolate(group.lowerGroup.sf, group.upperGroup.sf, TempNormalized);
    const isSuperheated = false;
    // console.log("Tev greater than lower tsat and less than upper tsat");


    return { s_final, isSuperheated };
  }
  else {
    const s_final = interpolate(group.lowerGroup.sf, group.upperGroup.sf, TempNormalized);
    const isSuperheated = false;
    // console.log("Tev lower than lower tsat");
    return { s_final, isSuperheated };
  }
}
export function CalcCondEVAlt(actualP) {
  const calc = true;
  return FindTemperatureFromPressure(actualP, calc);
}

export function FindTemperatureFromPressure(actualP, calc) {
  // console.log("Input Pressure:", actualP);

  // Sort data by Pressure
  const sortedData = tableData.sort((a, b) => a.Pressure - b.Pressure);
  // console.log("Sorted Data:", sortedData);

  let lower, upper;
  for (let i = 0; i < sortedData.length - 1; i++) {
    const curr = sortedData[i];
    const next = sortedData[i + 1];
    if (actualP >= curr.Pressure && actualP <= next.Pressure) {
      lower = curr;
      upper = next;
      // console.log("Lower bound:", lower);
      // console.log("Upper bound:", upper);
      break;
    }
  }

  // Error handling
  if (!lower || !upper) {
    // console.error('Pressure out of bounds:', actualP);
    return null;
  }

  // Calculate normalized position of actualP between lower.Pressure and upper.Pressure
  const TempNormalized = normalizeAuto(actualP, lower.Pressure, upper.Pressure);
  // console.log("Normalized Pressure Position:", TempNormalized);

  // Interpolate temperature based on normalized value
  const T_final = interpolateAuto(lower.Tsat, upper.Tsat, TempNormalized);
  // console.log("Interpolated Temperature:", T_final);

  if (calc) {
    const TNormalized = normalizeAuto(parseFloat(T_final.toFixed(2)), lower.Tsat, upper.Tsat);


    // console.log('lower.Tsat: '+ lower.Tsat);
    // console.log('upper.Tsat: '+ upper.Tsat);

    // console.log('T normalized: '+ TNormalized);

    // console.log('lower hf' + lower.hf);
    // console.log('upper hf' + upper.hf);
    const h_final = interpolateAuto(lower.hf, upper.hf, TNormalized);
    const s_final = interpolateAuto(lower.sf, upper.sf, TNormalized);

    return { h_final, s_final };

  }

  return T_final;
}


function normalize(input, lower, upper) {
  return ((upper - input) / (upper - lower));
}

function normalizeAuto(input, lower, upper) {
  // console.log(input+ '-' + lower + '/' + upper + '-' + lower)
  return ((input - lower) / (upper - lower));
}

const interpolateAuto = (y0, y1, x) => {
  return (y0 + ((y1 - y0) * x))
}


const interpolate = (y0, y1, x) => {
  return (y1 + ((y1 - y0) * x))
}

function findTemperatureGroup(temp) {
  for (let i = 0; i < tableData.length - 1; i++) {
    const current = tableData[i];
    const next = tableData[i + 1];

    if (current.Tsat < temp && temp < next.Tsat) {
      return {
        lowerGroup: current,
        upperGroup: next
      };
    }
  }

  console.warn("Temperature is out of bounds.");

  return null;
}


