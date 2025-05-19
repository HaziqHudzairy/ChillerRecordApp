import { Animated, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { fetchChillerRecords, insertChillerRecord, insertSampleData, updateChillerRecord } from './database/DBService.js';
import { calcEvap, calcComp, calcComp2s } from './js/tableA-13Calculation.js';
import { CalcCond, CalcEV, FindTemperatureFromPressure, CalcCondEVAlt } from './js/tableA-12Calculation.js';
import { conclusionCalculationTable } from './js/conclusionCalculationTable.js';
import ConclusionTable from './js/conclusionTable.js';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { resetDatabase } from './database/database.js';





// Example of x and y values for each state
// const xValuesState1 = [0.1, 0.2, 0.3, 0.4];  // Replace with actual values
// const yValuesState1 = [30, 40, 50, 60];

// const xValuesState2 = [0.1, 0.2, 0.3, 0.4];  // Replace with actual values
// const yValuesState2 = [20, 30, 40, 50];

// const xValuesState3 = [0.1, 0.2, 0.3, 0.4];  // Replace with actual values
// const yValuesState3 = [10, 20, 30, 40];

// const xValuesState4 = [0.1, 0.2, 0.3, 0.4];  // Replace with actual values
// const yValuesState4 = [5, 15, 25, 35];

import TSGraph from './js/TSGraph';
// import data from './js/tableDataExport'; // Import data

const ChillerDataPage = () => {


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    date: '',
    time: '',
    record_time: '',
    Te: '',
    Pe: '',
    Tc: '',
    Pcom: '',
    Tcon: '',
    Pcon: '',
    Tev: '',
  });
  const [xValuesState1, setXValuesState1] = useState([]);
  const [yValuesState1, setYValuesState1] = useState([]);
  const [xValuesState2, setXValuesState2] = useState([]);
  const [yValuesState2, setYValuesState2] = useState([]);
  const [xValuesState2s, setXValuesState2s] = useState([]);
  const [temp2sState, setTemp2sState] = useState(null);
  const [yValuesState2s, setYValuesState2s] = useState([]);
  const [xValuesState3, setXValuesState3] = useState([]);
  const [yValuesState3, setYValuesState3] = useState([]);
  const [xValuesState4, setXValuesState4] = useState([]);
  const [yValuesState4, setYValuesState4] = useState([]);

  const [state1h, setState1h] = useState(null);
  const [state2h, setState2h] = useState(null);
  const [state2sH, setState2sH] = useState(null);
  const [state3h, setState3h] = useState(null);
  const [state4h, setState4h] = useState(null);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);


  useEffect(() => {
    fetchRecords();
  }, [selectedDate]);

  useEffect(() => {
    if (
      selectedRecord &&
      selectedRecord.evaporator.Te !== "No Data" &&
      selectedRecord.evaporator.Te !== undefined
    ) {

      handleCalculate();
    }
  }, [selectedRecord]);
  const [isEditing, setIsEditing] = useState(false);

  const [evapResult, setEvapResult] = useState(null);
  const [compResult, setCompResult] = useState(null);
  const [comp2sResult, setComp2sResult] = useState(null);
  const [conResult, setConResult] = useState(null);
  const [EVResult, setEVResult] = useState(null);

  const handleCalculate = () => {
    if (!selectedRecord) return;



    const evapP = (parseFloat(selectedRecord.evaporator.Pe) / 1000).toFixed(5);
    const evapT = parseFloat(selectedRecord.evaporator.Te);
    const compP = (parseFloat(selectedRecord.compressor.Pcom) / 1000).toFixed(5);
    const compT = parseFloat(selectedRecord.compressor.Tc);
    const conP = parseFloat(selectedRecord.condenser.Pcon);
    const conT = parseFloat(selectedRecord.condenser.Tcon);
    const evP = parseFloat(selectedRecord.evaporator.Pe);
    const evT = parseFloat(selectedRecord.expansionValve.Tev);
    const isTconCalculated = selectedRecord.isTconCalculated;
    const isTevCalculated = selectedRecord.isTevCalculated;

    // console.log('selectedRecord:', selectedRecord);
    // console.log('selectedRecord.isTconCalculated:', selectedRecord?.isTconCalculated);


    //  console.log('istconcalc' + selectedRecord.isTconCalculated);

    // console.log("Evaporator Pressure:", evapP);
    // console.log("Evaporator Temperature:", evapT);
    // console.log("Compressor Pressure:", compP);
    // console.log("Compressor Temperature:", compT);
    // console.log("Condenser Pressure:", conP);
    // console.log("Condenser Temperature:", conT);
    // console.log("Expansion Valve Temperature:", evT);
    // console.log("Expansion Valve Pressure:", evP);
    // console.log("Selected Record:", selectedRecord);
    // console.log("Selected Record Time:", selectedRecord.record_time);

    if (!isNaN(evapP) && !isNaN(evapT) && !isNaN(compP) && !isNaN(compT) && !isNaN(conP) && !isNaN(conT)) {
      // if(!evT)
      // {
      //   const EVProperties = CalcEV(evT, conProperties?.TempNormalized);
      //   const EVS_final = EVProperties?.s_final;
      // }
      const evapProperties = calcEvap(evapP, evapT);
      const evapH_final = evapProperties?.h_final;
      const evapS_final = evapProperties?.s_final;
      const evapSuperheated = evapProperties?.isSubcooled;


      const compProperties = calcComp(compP, compT);
      const compH_final = compProperties?.h_final;
      const compS_final = compProperties?.s_final;
      const compSuperheated = compProperties?.isSubcooled;

      const comp2sProperties = calcComp2s(compP, evapS_final);
      const temp2s = comp2sProperties?.temperature2s;
      setTemp2sState(temp2s);
      const comp2sH_final = comp2sProperties?.h_final;



      let conProperties;
      let conH_final;
      let conS_final;
      let conSuperheated;

      const conPropForSH = CalcCondEVAlt(conP);

      // console.log('isTconCalculated' + isTconCalculated);

      if (isTconCalculated === 1) {
        conProperties = CalcCondEVAlt(conP);
        conH_final = conProperties?.h_final;
        conS_final = conProperties?.s_final;
        conSuperheated = conProperties?.isSuperheated;


      } else if (isTconCalculated === 0) {
        conProperties = CalcCond(conP, conT);
        conH_final = conProperties?.h_final;
        conS_final = conProperties?.s_final;
        conSuperheated = conProperties?.isSuperheated;

      } else {
        // console.log("Error: isTconCalculated is not 0 or 1");
      }


      let EVProperties;
      let EVS_final;
      let EVSuperheated;

      // console.log('isTconCalculated' + isTevCalculated);

      if (isTevCalculated === 1) {
        // console.log('Pressure EV: ' + evapP*1000);
        EVProperties = CalcCondEVAlt(evapP * 1000);
        EVS_final = EVProperties?.s_final;
        EVSuperheated = EVProperties?.isSuperheated;
      }
      else if (isTevCalculated === 0) {
        EVProperties = CalcEV(evT, conProperties?.TempNormalized);
        EVS_final = EVProperties?.s_final;
        EVSuperheated = EVProperties?.isSuperheated;
      }
      else {
        console.log("Error: isTconCalculated is not 0 or 1");
      }




      // Set results for all stages
      setEvapResult({
        h_final: evapH_final?.toFixed(2),
        s_final: evapS_final?.toFixed(4),
        isSubcooled: evapSuperheated,
      });

      setCompResult({
        h_final: compH_final?.toFixed(2),
        s_final: compS_final?.toFixed(4),
        isSubcooled: compSuperheated,
      });

      setComp2sResult({
        temp: temp2s?.toFixed(2),
        h_final: comp2sH_final?.toFixed(2)
      });

      setConResult({
        h_final: conH_final?.toFixed(2),
        s_final: conS_final?.toFixed(4),
        isSuperheated: conSuperheated,
      });

      setEVResult({
        s_final: EVS_final?.toFixed(4),
        isSuperheated: EVSuperheated,
      });

      const states = {
        evaporator: evapProperties?.isSubcooled ? 'subcooled' : 'normal',
        compressor: compProperties?.isSubcooled ? 'subcooled' : 'normal',
        condenser: conProperties?.isSuperheated ? 'superheated' : 'normal',
        expansionValve: EVProperties?.isSuperheated ? 'superheated' : 'normal'
      };

      const warnings = [];

      if (states.evaporator === 'subcooled') {
        warnings.push('Evaporator is in a saturated state.');
      }
      if (states.compressor === 'subcooled') {
        warnings.push('Compressor is in a saturated state.');
      }
      if (states.condenser === 'superheated') {
        warnings.push('Condenser is in a superheated state.');
      }
      if (states.expansionValve === 'superheated') {
        warnings.push('Expansion valve is in a superheated state.');
      }

      if (
        states.evaporator === 'subcooled' &&
        states.compressor === 'subcooled' &&
        states.condenser === 'superheated' &&
        states.expansionValve === 'superheated'
      ) {
        Alert.alert(
          'Critical Warning',
          'All components are in abnormal states:\n' +
          '- Evaporator & Compressor are saturated\n' +
          '- Condenser & Expansion Valve are superheated\n\n' +
          'Please check your components.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (warnings.length > 0) {
        Alert.alert(
          'Warning',
          warnings.join('\n') + '\n\nPlease check your component(s).',
          [{ text: 'OK' }]
        );
      }








    } else {
      console.log("Data fetching");
    }
  };

  // Update the state1h, state2h, etc. values after the result states are set
  useEffect(() => {
    if (evapResult && compResult && comp2sResult && conResult) {
      setState1h(evapResult?.h_final);
      setState2h(compResult?.h_final);
      setState2sH(comp2sResult?.h_final);
      setState3h(conResult?.h_final);
      setState4h(conResult?.h_final);

      // Log the updated states after they have been set
      // console.log('Updated States: ', {
      //   state1h,
      //   state2h,
      //   state2sH,
      //   state3h,
      //   state4h,
      // });
    }
  }, [evapResult, compResult, comp2sResult, conResult]);

  // Use useEffect to trigger setGraphValues after state updates
  useEffect(() => {
    if (evapResult && compResult && conResult && EVResult) {
      setGraphValues(temp2sState.toFixed(1));  // This will only be called after all results are set
    }
  }, [evapResult, compResult, conResult, EVResult]); // Watch for changes to these values



  const fetchRecords = async () => {
    const data = await fetchChillerRecords();
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    // console.log(selectedDateString);
    // console.log(data);


    const timeSlots = [];
    for (let i = 8; i <= 22; i++) {
      let hour = i > 12 ? i - 12 : i;
      let period = i >= 12 ? 'PM' : 'AM';
      timeSlots.push({ time: `${hour}:00 ${period}`, record: null });
    }

    const mergedData = timeSlots.map(slot => {
      const record = data.find(r => r.time === slot.time && r.date === selectedDateString);
      return {
        id: record ? record.record_id : null, // ✅ Include record ID
        time: slot.time,
        record_time: record ? record.record_time : null,
        evaporator: record ? { Te: record.Te, Pe: record.Pe } : { Te: "No Data", Pe: "No Data" },
        compressor: record ? { Tc: record.Tc, Pcom: record.Pcom } : { Tc: "No Data", Pcom: "No Data" },
        condenser: record ? { Tcon: record.Tcon, Pcon: record.Pcon } : { Tcon: "No Data", Pcon: "No Data" },
        expansionValve: record ? { Tev: record.Tev } : { Tev: "No Data" },
        isTconCalculated: record ? record.isTconCalculated : null,
        isTevCalculated: record ? record.isTevCalculated : null,
      };
    });

    setRecords(mergedData);
  };


  const goToPreviousDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const goToNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };


  const handleAddRecord = async () => {
    // Check if required fields (except Tcon and Tev) are empty
    if (
      !newRecord.Te ||
      !newRecord.Pe ||
      !newRecord.Tc ||
      !newRecord.Pcom ||
      !newRecord.Pcon
    ) {
      alert('Please fill in all required* fields before submitting.');
      return;
    }

    // Parse pressure inputs as floats
    const Pe = parseFloat(newRecord.Pe);
    const Pcom = parseFloat(newRecord.Pcom);
    const Pcon = parseFloat(newRecord.Pcon);

    // Check pressure ranges
    const isPeInvalid = Pe < 60.0 || Pe > 1600.0;
    const isPcomInvalid = Pcom < 60.0 || Pcom > 1600.0;
    const isPconInvalid = Pcon < 60.0 || Pcon > 3000.0;

    // Compose alert message
    if (isPeInvalid && isPcomInvalid && isPconInvalid) {
      alert('Pressure for Evaporator/Compressor out of range for Table A-13, Pressure for Condenser out of range for Table A-12');
      return;
    } else if (isPeInvalid && isPcomInvalid) {
      alert('Pressure for Evaporator and Compressor out of range for Table A-13');
      return;
    } else if ((isPeInvalid || isPcomInvalid) && isPconInvalid) {
      alert('Pressure for Evaporator/Compressor out of range for Table A-13, Pressure for Condenser out of range for Table A-12');
      return;
    } else if (isPeInvalid) {
      alert('Pressure for Evaporator out of range for Table A-13');
      return;
    } else if (isPcomInvalid) {
      alert('Pressure for Compressor out of range for Table A-13');
      return;
    } else if (isPconInvalid) {
      alert('Pressure for Condenser out of range for Table A-12');
      return;
    }

    if (!selectedRecord) {
      console.error("❌ No selected record.");
      return;
    }

    try {
      const currentDate = selectedDate.toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString();

      const isTconCalculated = !newRecord.Tcon || newRecord.Tcon === '-';
      const isTevCalculated = !newRecord.Tev || newRecord.Tev === '-';

      const TconValue = isTconCalculated
        ? parseFloat(FindTemperatureFromPressure(Pcon, false).toFixed(2))
        : parseFloat(newRecord.Tcon).toFixed(2);

      const TevValue = isTevCalculated
        ? parseFloat(FindTemperatureFromPressure(Pe, false).toFixed(2))
        : parseFloat(newRecord.Tev).toFixed(2);


      // console.log({
      //   date: currentDate,
      //   recordTime: selectedRecord.time,
      //   entryTime: currentTime,
      //   Te: parseFloat(newRecord.Te).toFixed(2),
      //   Pe,
      //   Tc: parseFloat(newRecord.Tc).toFixed(2),
      //   Pcom,
      //   Tcon: TconValue,
      //   isTconCalculated: isTconCalculated ? '1' : '0',
      //   Pcon,
      //   Tev: TevValue,
      //   isTevCalculated: isTevCalculated ? '1' : '0',
      // });


      await insertChillerRecord(
        currentDate,
        selectedRecord.time,
        currentTime,
        parseFloat(newRecord.Te).toFixed(2),
        Pe,
        parseFloat(newRecord.Tc).toFixed(2),
        Pcom,
        TconValue,
        Pcon,
        TevValue,
        isTconCalculated ? '1' : '0',
        isTevCalculated ? '1' : '0'
      );


      await fetchRecords();

      setModalVisible(false);
      setNewRecord({ Te: '', Pe: '', Tc: '', Pcom: '', Tcon: '', Pcon: '', Tev: '' });
      console.log("✅ New record added with correct timestamps.");
    } catch (error) {
      console.error("❌ Error adding record:", error);
    }
  };

  const handleUpdateRecord = async () => {
    // ✅ Check if required fields are filled
    if (
      !newRecord.Te ||
      !newRecord.Pe ||
      !newRecord.Tc ||
      !newRecord.Pcom ||
      !newRecord.Pcon
    ) {
      alert('Please fill in all required* fields before updating.');
      return;
    };

    // console.log("🔄 Updated record data:", JSON.stringify(newRecord, null, 2));

    // ✅ Parse pressure values
    const Pe = parseFloat(newRecord.Pe);
    const Pcom = parseFloat(newRecord.Pcom);
    const Pcon = parseFloat(newRecord.Pcon);

    // ✅ Validate pressure ranges
    const isPeInvalid = Pe < 60.0 || Pe > 1600.0;
    const isPcomInvalid = Pcom < 60.0 || Pcom > 1600.0;
    const isPconInvalid = Pcon < 60.0 || Pcon > 3000.0;

    if (isPeInvalid && isPcomInvalid && isPconInvalid) {
      alert('Pressure for Evaporator/Compressor out of range for Table A-13, Pressure for Condenser out of range for Table A-12');
      return;
    } else if (isPeInvalid && isPcomInvalid) {
      alert('Pressure for Evaporator and Compressor out of range for Table A-13');
      return;
    } else if ((isPeInvalid || isPcomInvalid) && isPconInvalid) {
      alert('Pressure for Evaporator/Compressor out of range for Table A-13, Pressure for Condenser out of range for Table A-12');
      return;
    } else if (isPeInvalid) {
      alert('Pressure for Evaporator out of range for Table A-13');
      return;
    } else if (isPcomInvalid) {
      alert('Pressure for Compressor out of range for Table A-13');
      return;
    } else if (isPconInvalid) {
      alert('Pressure for Condenser out of range for Table A-12');
      return;
    }

    if (!selectedRecord) {
      console.error("❌ No selected record to update.");
      return;
    }

    try {
      const isTconCalculated = !newRecord.Tcon || newRecord.Tcon === '-';
      const isTevCalculated = !newRecord.Tev || newRecord.Tev === '-';


      const TconValue = isTconCalculated
        ? parseFloat(FindTemperatureFromPressure(Pcon, false).toFixed(2))
        : parseFloat(newRecord.Tcon).toFixed(2);

      const TevValue = isTevCalculated
        ? parseFloat(FindTemperatureFromPressure(Pe, false).toFixed(2))
        : parseFloat(newRecord.Tev).toFixed(2);

      // console.log(TevValue);

      const updated = {
        id: selectedRecord.id,
        date: selectedDate.toISOString().split('T')[0], // consistent with addRecord
        time: selectedRecord.time,
        record_time: selectedRecord.time,
        Te: parseFloat(newRecord.Te).toFixed(2),
        Pe,
        Tc: parseFloat(newRecord.Tc).toFixed(2),
        Pcom,
        Tcon: TconValue,
        Pcon,
        Tev: TevValue,
        isTconCalculated: isTconCalculated ? '1' : '0',
        isTevCalculated: isTevCalculated ? '1' : '0',
      };

      // console.log("🔄 Updated record data:", JSON.stringify(updated, null, 2));

      // ✅ Update in local state
      setRecords((prev) =>
        prev.map((record) =>
          record.id === selectedRecord.id ? updated : record
        )
      );

      // ✅ Update in SQLite
      await updateChillerRecord(
        updated.id,
        updated.date,
        updated.time,
        updated.record_time,
        updated.Te,
        updated.Pe,
        updated.Tc,
        updated.Pcom,
        updated.Tcon,
        updated.Pcon,
        updated.Tev,
        updated.isTconCalculated,
        updated.isTevCalculated
      );


      await fetchRecords();
      setModalVisible(false);
      setIsEditing(false);
      setNewRecord({ Te: '', Pe: '', Tc: '', Pcom: '', Tcon: '', Pcon: '', Tev: '' });
      console.log("✅ Record updated successfully.");
    } catch (error) {
      console.error("❌ Failed to update record in database:", error);
    }
  };









  // useEffect(() => {
  //   const updateTime = () => {
  //     const now = new Date();
  //     setCurrentTime(now.toLocaleTimeString());
  //   };
  //   updateTime();
  //   const interval = setInterval(updateTime, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleInputChange = (category, name, value) => {
    setInputs({
      ...inputs,
      [category]: { ...inputs[category], [name]: value }
    });
  };



  const getTimeIcon = (time) => {
    // Extract hour and period (AM/PM)
    const [hourStr, period] = time.split(' ');
    let hour = parseInt(hourStr.split(':')[0]); // Get the hour part

    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) hour += 12; // Convert PM hours
    if (period === 'AM' && hour === 12) hour = 0; // Convert 12 AM to 0

    // Assign the correct icon
    if (hour >= 8 && hour < 11) return { name: 'sunrise', color: '#FFA500' }; // Sunrise 🌅
    if (hour >= 11 && hour < 16) return { name: 'sun', color: '#FFD700' }; // Midday ☀️
    if (hour >= 16 && hour < 19) return { name: 'sunset', color: '#FF8C00' }; // Sunset 🌇
    return { name: 'moon', color: '#87CEFA' }; // Evening 🌙
  };



  const handleTimeSlotClick = async (record) => {
    setSelectedRecord({
      ...record,
      record_time: record.record_time || "Unknown Time",
    });

    // Log the record to check the values when clicked
    //console.log('Record:', record);

    // Trigger the calculation if the results are missing
    if (!evapResult || !compResult || !conResult || !EVResult) {
      // console.log('test');

      // Wait for the calculation to finish before proceeding
      await handleCalculate(); // Ensure the calculation is done before proceeding


    }


    setModalVisible(true);
  };



  const setGraphValues = (temp2s) => {
    if (evapResult && compResult && conResult && EVResult) {
      setXValuesState1([evapResult?.s_final, compResult?.s_final]);
      setYValuesState1([selectedRecord.evaporator.Te, selectedRecord.compressor.Tc]);

      setXValuesState2([compResult?.s_final, evapResult?.s_final]);
      setYValuesState2([selectedRecord.compressor.Tc, temp2s]);

      setXValuesState2s([evapResult?.s_final, conResult?.s_final]);
      // console.log('test', xValuesState2s);
      setYValuesState2s([temp2s, selectedRecord.condenser.Tcon]);
      // console.log('test2', yValuesState2s);

      setXValuesState3([conResult?.s_final, EVResult?.s_final]);
      setYValuesState3([selectedRecord.condenser.Tcon, selectedRecord.expansionValve.Tev]);

      setXValuesState4([EVResult?.s_final, evapResult?.s_final]);
      setYValuesState4([selectedRecord.expansionValve.Tev, selectedRecord.evaporator.Te]);

      // Optionally, log the updated values for debugging
      // console.log('xValuesState1:', xValuesState1);
      // console.log('yValuesState1:', yValuesState1);
      // console.log('xValuesState2:', xValuesState2);
      // console.log('yValuesState2:', yValuesState2);
      // console.log('xValuesState3:', xValuesState3);
      // console.log('yValuesState3:', yValuesState3);
      // console.log('xValuesState4:', xValuesState4);
      // console.log('yValuesState4:', yValuesState4);
    } else {

    }
  };

  const results = conclusionCalculationTable(state1h, state2h, state2sH, state3h, state4h);

  const animationValues = useMemo(
    () => records.map(() => new Animated.Value(0)),
    [records.length] // important to recreate on change
  );

  const triggerAnimations = () => {
    const animations = animationValues.map((animValue, index) => {
      animValue.setValue(0); // Reset animation value before replaying
      return Animated.timing(animValue, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      });
    });
    Animated.parallel(animations).start();
  };

  useEffect(() => {
    triggerAnimations();
  }, [records]); // initial animation


  const onChange = (event, selectedDateVal) => {
    if (event.type === 'set' && selectedDateVal) {
      setSelectedDate(selectedDateVal);
      triggerAnimations();
    }
    setShowPicker(false); // Always hide after interaction
  };

  const inflateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(inflateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  });

  const inflateFromBottomLeftStyle = {
    transform: [
      {
        scale: inflateAnim,
      },
      {
        translateX: inflateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-400, 0], // Left to Right
        }),
      },
      {
        translateY: inflateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Bottom to Top
        }),
      },
    ],
    opacity: inflateAnim,
  };





  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>

      <LinearGradient
        colors={['#00c6ff', '#0072ff']} // Two-color gradient
        style={styles.datePickerContainer}
      >
        {/* Date Picker Section */}



        <Text style={styles.mainHeader}>Chiller Records</Text>
        <View style={styles.datePickerWrapper}>


          <View style={styles.dateNavContainer}>
            <TouchableOpacity onPress={goToPreviousDate}>
              <FontAwesome name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.dateAndIconContainer}>
              <View style={styles.selectedDateContainer}>
                <Text style={styles.weekdayText}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.iconButton}>
                <FontAwesome name="calendar" size={30} color="#ffffff" />
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>


            <TouchableOpacity onPress={goToNextDate}>
              <FontAwesome name="chevron-right" size={24} color="#ffffff" />
            </TouchableOpacity>


          </View>




        </View>

      </LinearGradient>



      <ScrollView contentContainerStyle={styles.container}>
        {/* Data Table */}
        <View style={styles.tableContainer}>
          {records.map((record, index) => {
            const animValue = animationValues[index];

            if (!animValue) return null; // fallback safety

            const scaleAndFade = {
              opacity: animValue,
              transform: [
                {
                  scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            };

            return (
              <Animated.View key={index} style={[styles.recordRow, scaleAndFade]}>

                <TouchableOpacity onPress={() => handleTimeSlotClick(record)}>
                  <View style={styles.timeRow}>
                    <Text style={styles.recordText}>{record.time}</Text>
                    <Icon
                      name={getTimeIcon(record.time).name}
                      size={24}
                      color={getTimeIcon(record.time).color}
                      style={styles.icon}
                    />
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableHeader}>Component</Text>
                    <Text style={styles.tableHeader}>Temperature (°C)</Text>
                    <Text style={styles.tableHeader}>Pressure (kPa)</Text>
                  </View>

                  {/* Evaporator */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Evaporator</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.evaporator?.Te === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.evaporator?.Te ?? "N/A"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.evaporator?.Pe === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.evaporator?.Pe ?? "N/A"}
                    </Text>
                  </View>

                  {/* Compressor */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Compressor</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.compressor?.Tc === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.compressor?.Tc ?? "N/A"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.compressor?.Pcom === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.compressor?.Pcom ?? "N/A"}
                    </Text>
                  </View>

                  {/* Condenser */}
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Condenser</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.condenser?.Tcon === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.condenser?.Tcon ?? "N/A"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.condenser?.Pcon === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.condenser?.Pcon ?? "N/A"}
                    </Text>
                  </View>

                  {/* Expansion Valve */}
                  <View style={[styles.tableRow, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                    <Text style={styles.tableCell}>Expansion Valve</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        record.expansionValve?.Tev === "No Data" && styles.noDataText,
                      ]}
                    >
                      {record.expansionValve?.Tev ?? "N/A"}
                    </Text>
                    <Text style={styles.tableCell}>-</Text>
                  </View>

                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Modal : Popup*/}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chiller Record for {selectedRecord?.time}</Text>
              <View style={styles.line} />


              {/* If no data available*/}
              {selectedRecord?.evaporator.Te === "No Data" || isEditing ? (
                <>
                  <ScrollView style={{ padding: 10 }}>
                    <Text style={styles.modalText}>
                      Enter Data:
                    </Text>
                    {/* <Text style={styles.noDataText}>Current Time: {currentTime}</Text> */}

                    {/* Evaporator */}
                    <View style={styles.sectionEvaporator}>
                      <Text style={styles.sectionHeader}>Evaporator</Text>
                      <View style={styles.inputRowEvaporator}>
                        <Text style={styles.inputLabel}>Temperature <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                          placeholder="Te (°C)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Te}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Te: text })}
                        />
                      </View>
                      <View style={styles.inputRowEvaporator}>
                        <Text style={styles.inputLabel}>Pressure <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                          placeholder="Pe (kPa)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Pe}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Pe: text })}
                        />
                      </View>
                    </View>

                    {/* Compressor */}
                    <View style={styles.sectionCompressor}>
                      <Text style={styles.sectionHeader}>Compressor</Text>
                      <View style={styles.inputRowCompressor}>
                        <Text style={styles.inputLabel}>Temperature <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                          placeholder="Tcom (°C)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Tc}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Tc: text })}
                        />
                      </View>
                      <View style={styles.inputRowCompressor}>
                        <Text style={styles.inputLabel}>Pressure <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                          placeholder="Pcom (kPa)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Pcom}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Pcom: text })}
                        />
                      </View>
                    </View>

                    {/* Condenser */}
                    <View style={styles.sectionCondenser}>
                      <Text style={styles.sectionHeader}>Condenser</Text>
                      <View style={styles.inputRowCondenser}>
                        <Text style={styles.inputLabel}>Temperature</Text>
                        <TextInput
                          placeholder="Tcon (°C)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Tcon}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Tcon: text })}
                        />
                      </View>
                      <View style={styles.inputRowCondenser}>
                        <Text style={styles.inputLabel}>Pressure <Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                          placeholder="Pcon (kPa)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Pcon}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Pcon: text })}
                        />
                      </View>
                    </View>

                    {/* Expansion Valve */}
                    <View style={styles.sectionExpansionValve}>
                      <Text style={styles.sectionHeader}>Expansion Valve</Text>
                      <View style={styles.inputRowExpansionValve}>
                        <Text style={styles.inputLabel}>Temperature</Text>
                        <TextInput
                          placeholder="Tev (°C)"
                          placeholderTextColor="#B0B0B0"
                          style={styles.inputField}
                          keyboardType="numbers-and-punctuation"
                          value={newRecord.Tev}
                          onChangeText={(text) => setNewRecord({ ...newRecord, Tev: text })}
                        />
                      </View>
                    </View>

                  </ScrollView>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      marginTop: 20
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setNewRecord({
                          Te: '',
                          Pe: '',
                          Tc: '',
                          Pcom: '',
                          Tcon: '',
                          Pcon: '',
                          Tev: '',
                        });
                        if (!isEditing) {
                          setModalVisible(false);

                        }
                        setIsEditing(false);
                      }}


                      style={{
                        backgroundColor: '#D66A62',
                        width: '45%',
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        justifyContent: 'center',

                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={isEditing ? handleUpdateRecord : handleAddRecord}
                      style={{
                        width: '45%',
                        backgroundColor: isEditing ? '#2196F3' : '#2196F3',
                        paddingVertical: 10,
                        borderRadius: 8,
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                        {isEditing ? 'Update Record' : 'Add Record'}
                      </Text>
                    </TouchableOpacity>

                  </View>


                </>
              ) : (
                <>

                  {/* When data already available */}
                  {selectedRecord ? (
                    <ScrollView>
                      <View style={styles.table}>


                        <Text style={styles.modalText}>
                          State Data
                        </Text>
                        {/* Table Header */}
                        <View style={styles.tableHeaderRow}>
                          <Text style={[styles.tableHeader, styles.boldText, { fontSize: 12, flex: 0.5 }]}>State</Text>
                          <Text style={[styles.tableHeader, styles.boldText, { fontSize: 12 }]}>T (°C)</Text>
                          <Text style={[styles.tableHeader, styles.boldText, { fontSize: 12 }]}>P (kPa)</Text>
                          <Text style={[styles.tableHeader, styles.boldText, { fontSize: 12 }]}>Enthalpy,{'\n'}h (kJ/kg)</Text>
                          <Text style={[styles.tableHeader, styles.boldText, { fontSize: 12 }]}>Entropy,{'\n'}s (kJ/kg .K)</Text>
                        </View>


                        {/* Evaporator */}
                        <View style={styles.tableRow}>
                          <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>1</Text>
                          <Text style={styles.tableCell}>
                            <Text style={styles.tableCell}>
                              {selectedRecord.evaporator.Te}
                            </Text>
                            {evapResult?.isSubcooled && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontSize: 10 }}>
                                  {" "} {/* Add a space between text */}
                                </Text>
                                <FontAwesome5
                                  name="snowflake"
                                  size={12}
                                  color="blue"
                                  style={{ marginLeft: 0 }} // Creates gap
                                />
                              </View>
                            )}
                          </Text>
                          <Text style={styles.tableCell}>{selectedRecord.evaporator.Pe}</Text>
                          <Text style={styles.tableCell}>
                            {Number(evapResult?.h_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>T out of bounds</Text>
                            ) : (
                              evapResult?.h_final ?? '-'
                            )}
                          </Text>
                          <Text style={styles.tableCell}>
                            {Number(evapResult?.s_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>T out of bounds</Text>
                            ) : (
                              evapResult?.s_final ?? '-'
                            )}
                          </Text>
                        </View>

                        {/* Compressor */}
                        <View style={styles.tableRow}>
                          <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>2</Text>
                          <Text style={styles.tableCell}>
                            <Text style={styles.tableCell}>
                              {selectedRecord.compressor.Tc}
                            </Text>
                            {compResult?.isSubcooled && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontSize: 10 }}>
                                  {" "} {/* Add a space between text */}
                                </Text>
                                <FontAwesome5
                                  name="snowflake"
                                  size={12}
                                  color="blue"
                                  style={{ marginLeft: 0 }} // Creates gap
                                />
                              </View>
                            )}
                          </Text>
                          <Text style={styles.tableCell}>{selectedRecord.compressor.Pcom}</Text>
                          <Text style={styles.tableCell}>
                            {Number(compResult?.h_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>T out of bounds</Text>
                            ) : (
                              compResult?.h_final ?? '-'
                            )}
                          </Text>

                          <Text style={styles.tableCell}>
                            {Number(compResult?.s_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>T out of bounds</Text>
                            ) : (
                              compResult?.s_final ?? '-'
                            )}
                          </Text>
                        </View>

                        <View style={styles.tableRow}>
                          <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>2s</Text>
                          <Text style={styles.tableCell}>
                            {Number(comp2sResult?.temp) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>Unable to Calculate</Text>
                            ) : (
                              comp2sResult?.temp ?? '-'
                            )}
                          </Text>
                          <Text style={styles.tableCell}>{selectedRecord.compressor.Pcom}</Text>
                          <Text style={styles.tableCell}>
                            {Number(comp2sResult?.h_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>Unable to Calculate</Text>
                            ) : (
                              comp2sResult?.h_final ?? '-'
                            )}
                          </Text>

                          <Text style={styles.tableCell}>
                            {Number(comp2sResult?.h_final) === 0 ? (
                              <Text style={{ color: 'red', fontSize: 10 }}>Unable to Calculate</Text>
                            ) : (
                              evapResult?.s_final ?? '-'
                            )}
                          </Text>
                        </View>

                        {/* Condenser */}
                        <View style={styles.tableRow}>
                          <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>3</Text>
                          <Text style={styles.tableCell}>

                            <Text style={styles.tableCell}>
                              {selectedRecord.condenser.Tcon}
                            </Text>
                            {conResult?.isSuperheated && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontSize: 10 }}>
                                  {" "} {/* Add a space between text */}
                                </Text>
                                <FontAwesome5
                                  name="fire"
                                  size={12}
                                  color="red"
                                  style={{ marginLeft: 0 }} // Creates gap
                                />
                              </View>
                            )}


                          </Text>
                          <Text style={styles.tableCell}>{selectedRecord.condenser.Pcon}</Text>
                          <Text style={styles.tableCell}>{conResult?.h_final ?? '-'}</Text>
                          <Text style={styles.tableCell}>{conResult?.s_final ?? '-'}</Text>
                        </View>

                        {/* Expansion Valve */}
                        <View style={[styles.tableRow, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                          <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>4</Text>
                          <Text style={styles.tableCell}>
                            <Text style={styles.tableCell}>
                              {selectedRecord.expansionValve.Tev}
                            </Text>
                            {EVResult?.isSuperheated && (
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'red', fontSize: 10 }}>
                                  {" "} {/* Add a space between text */}
                                </Text>
                                <FontAwesome5
                                  name="fire"
                                  size={12}
                                  color="red"
                                  style={{ marginLeft: 0 }} // Creates gap
                                />
                              </View>
                            )}
                          </Text>
                          <Text style={styles.tableCell}>{selectedRecord.evaporator.Pe}</Text>
                          <Text style={styles.tableCell}>{conResult?.h_final ?? '-'}</Text>
                          <Text style={styles.tableCell}>{EVResult?.s_final ?? '-'}</Text>
                        </View>


                        {/* <Text style={styles.header}>T-S Graph</Text> */}
                        <Text style={{ textAlign: 'center', fontSize: 15, marginTop: 20, marginBottom: -50, fontWeight: 'bold' }}>
                          T-s Diagram{'\n'}(Temperature vs Entropy)
                        </Text>

                        <TSGraph
                          xValuesState1={xValuesState1}
                          yValuesState1={yValuesState1}
                          xValuesState2={xValuesState2}
                          yValuesState2={yValuesState2}
                          xValuesState2s={xValuesState2s}
                          yValuesState2s={yValuesState2s}
                          xValuesState3={xValuesState3}
                          yValuesState3={yValuesState3}
                          xValuesState4={xValuesState4}
                          yValuesState4={yValuesState4}
                        />

                        <ConclusionTable data={results} />
                        <Text style={styles.modalSubtitle}>
                          Recorded at: {selectedRecord?.record_time || "Unknown Time"}
                        </Text>

                      </View>
                    </ScrollView>
                  ) : (
                    <Text>No Data Available</Text>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{
                        backgroundColor: '#D66A62',
                        width: '45%',
                        paddingVertical: 10,
                        borderRadius: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                        Close
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        // Set fields with existing data and switch to edit mode
                        setNewRecord({
                          Te: selectedRecord.evaporator.Te?.toString() ?? '',
                          Pe: selectedRecord.evaporator.Pe?.toString() ?? '',
                          Tc: selectedRecord.compressor.Tc?.toString() ?? '',
                          Pcom: selectedRecord.compressor.Pcom?.toString() ?? '',
                          Tcon: selectedRecord.condenser.Tcon?.toString() ?? '',
                          Pcon: selectedRecord.condenser.Pcon?.toString() ?? '',
                          Tev: selectedRecord.expansionValve.Tev?.toString() ?? '',
                        });

                        setIsEditing(true);
                      }}
                      style={{
                        backgroundColor: '#A9A9A9',
                        width: '45%',
                        paddingVertical: 10,
                        borderRadius: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>

              )}
            </View>
          </View>
        </Modal>


      </ScrollView>
      <Animated.View style={[styles.animatedWrapper, inflateFromBottomLeftStyle]}>
        <TouchableOpacity
          onPress={() => { router.replace('./mainPage') }}
          style={styles.backButton}
        >
          <FontAwesome5
            name="arrow-left"
            size={28}
            color="#007bff"
            solid
            style={{
              paddingTop: 20,
              paddingLeft: 30,
              textAlign: 'left',
            }}
          />
        </TouchableOpacity>
      </Animated.View>



    </View>
  );
};

export default ChillerDataPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    paddingTop: 10,
    paddingBottom: 90,
    backgroundColor: '#f4f4f4',
  },

  backButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    width: 120,
    height: 120,
    borderTopRightRadius: 120,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',

    elevation: 5,  // Android shadow effect
    shadowColor: '#000',  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },  // iOS shadow position
    shadowOpacity: 0.1,  // iOS shadow transparency
    shadowRadius: 5,  // iOS shadow blur radius
  },



  backButtonText: {
    paddingTop: 20,
    paddingLeft: 30,
    textAlign: 'left',
    color: '#0072ff', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },

  mainHeader: {
    marginTop: 40,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff', // Text color for the header
  },


  pickDateButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  pickDateButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 14,
  },


  // Date Picker Container
  datePickerContainer: {
    marginTop: 0,
    backgroundColor: '#f9f9f9',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  // Date Picker Wrapper to Center content
  datePickerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Row Layout for label and button
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  // Date Picker Label
  datePickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#ffffff', // Text color for label
  },

  // Styled Text for the selected date
  selectedDate: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff', // Blue color for the date
    textAlign: 'center',
  },

  dateAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
  },

  selectedDateContainer: {
    flex: 1,
  },

  iconButton: {
    marginLeft: 10,
  },

  selectedDateContainer: {
    alignItems: 'center',
  },
  dateNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  navButton: {
    fontSize: 24,
    color: '#ffffff',
    paddingHorizontal: 15,
  },
  weekdayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
  },

  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  noDataText: {
    color: 'lightgrey',
  },
  tableContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  recordRow: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    // shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    marginLeft: 10,
    right: 0,
    bottom: 10,
  },
  recordText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0099ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 8,
    elevation: 2, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tableHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderLeftWidth: 1, // Left border width
    borderLeftColor: '#e0e0e0', // Left border color
    borderRightWidth: 1, // Right border width
    borderRightColor: '#e0e0e0', // Right border color
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 22, marginBottom: 10, color: '#0099ff', fontWeight: 'bold', textAlign: 'center' },
  modalSubtitle: { fontSize: 14, marginBottom: 10, textAlign: 'center', marginTop: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },

  sectionEvaporator: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,

    // Shadow for both Android and iOS
    elevation: 5,  // Android shadow effect
    shadowColor: '#000',  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },  // iOS shadow position
    shadowOpacity: 0.1,  // iOS shadow transparency
    shadowRadius: 5,  // iOS shadow blur radius
  },

  sectionCompressor: {
    marginBottom: 20,

    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    // Shadow for both Android and iOS
    elevation: 5,  // Android shadow effect
    shadowColor: '#000',  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },  // iOS shadow position
    shadowOpacity: 0.1,  // iOS shadow transparency
    shadowRadius: 5,  // iOS shadow blur radius
  },
  sectionCondenser: {
    marginBottom: 20,

    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    // Shadow for both Android and iOS
    elevation: 5,  // Android shadow effect
    shadowColor: '#000',  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },  // iOS shadow position
    shadowOpacity: 0.1,  // iOS shadow transparency
    shadowRadius: 5,  // iOS shadow blur radius
  },
  sectionExpansionValve: {
    marginBottom: 20,

    borderBottomColor: '#ddd',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    // Shadow for both Android and iOS
    elevation: 5,  // Android shadow effect
    shadowColor: '#000',  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },  // iOS shadow position
    shadowOpacity: 0.1,  // iOS shadow transparency
    shadowRadius: 5,  // iOS shadow blur radius
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputRowEvaporator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputRowCompressor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputRowCondenser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputRowExpansionValve: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    width: '40%',
  },
  inputField: {
    width: '55%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#fff',
  },
});
