import { conclusionCalculationTable } from './conclusionCalculationTable'; // adjust path

export const transformCopData = (rawData) => {
  return rawData.map(({ hour, state1H, state2H, state2sH, state3H, state4H }) => {
    const results = conclusionCalculationTable(state1H, state2H, state2sH, state3H, state4H);
    return {
      time: hour,
      cop: results.COP
    };
  });
};
