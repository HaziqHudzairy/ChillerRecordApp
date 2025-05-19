export function conclusionCalculationTable(state1H, state2H,state2sH, state3H, state4H) {
    //calculate Q in
    const Q_in = state1H - state4H;
    //calculate Wc
    const Wc = state2H - state1H;
    //calculate Wcs
    const Wcs = state2sH - state1H;
    //calculate Q out
    const Q_out = state2H - state3H;
    //calculate ηc
    let ηc = Wcs / Wc * 100;

        if (state2H < state2sH) {
            ηc = Wc / Wcs * 100;
        } else if (state2H > state2sH) {
            ηc = Wcs / Wc * 100;
        }

    
    //calculate COP
    const COP = Q_in / Wc;
    //convert to EER
    const EER = COP * 3.412; 
    
    return { Q_in, Wc, Wcs, Q_out, ηc, COP, EER };
}




