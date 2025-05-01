import tableData from '../json/table_A12.json';

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
  if (actualT > TempNormalized) {
    const h_final = interpolate(lower.hg, upper.hg, TempNormalized);
    const s_final = interpolate(lower.sg, upper.sg, TempNormalized);

    return { h_final, s_final, TempNormalized };
  }
  else if (actualT < TempNormalized) {

    const h_final = interpolate(lower.hf, upper.hf, TempNormalized);
    const s_final = interpolate(lower.sf, upper.sf, TempNormalized);

    return { h_final, s_final, TempNormalized };
  }
  else {
    const h_final = interpolate(lower.hg, upper.hg, TempNormalized);
    const s_final = interpolate(lower.sg, upper.sg, TempNormalized);

    return { h_final, s_final, TempNormalized };
  }
};

export function CalcEV(actualT, TNormalized) {
  const group = findTemperatureGroup(TNormalized);
  const TempNormalized = normalize(actualT, group.lowerGroup.Tsat, group.upperGroup.Tsat);

  if (actualT > TempNormalized) {
    const s_final = interpolate(group.lowerGroup.sg, group.upperGroup.sg, TempNormalized);

    return { s_final };
  }
  else if (actualT < TempNormalized) {

    const s_final = interpolate(group.lowerGroup.sf, group.upperGroup.sf, TempNormalized);

    return { s_final };
  }
  else {
    const s_final = interpolate(group.lowerGroup.sg, group.upperGroup.sg, TempNormalized);
    
    return { s_final };
  }
}

function normalize(input, lower, upper){
  return ((upper - input) / (upper - lower));
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


