import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert,Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { fetchChillerRecords, insertChillerRecord, insertSampleData } from './database/DBService.js';
import { calcEvap, calcComp, calcComp2s } from './js/tableA-13Calculation.js';
import { CalcCond, CalcEV } from './js/tableA-12Calculation.js';
import { conclusionCalculationTable } from './js/conclusionCalculationTable.js';
import ConclusionTable from './js/conclusionTable.js';

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
const [xValuesState3, setXValuesState3] = useState([]);
const [yValuesState3, setYValuesState3] = useState([]);
const [xValuesState4, setXValuesState4] = useState([]);
const [yValuesState4, setYValuesState4] = useState([]);

const [state1h, setState1h] = useState(null);
const [state2h, setState2h] = useState(null);
const [state2sH, setState2sH] = useState(null);
const [state3h, setState3h] = useState(null);
const [state4h, setState4h] = useState(null);



  const onChange = (event, date) => {
    setShowPicker(false); // Hide the picker
    if (date) {
      setSelectedDate(date); // Update state if a date was selected
    }
  };

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
  
    if (!isNaN(evapP) && !isNaN(evapT) && !isNaN(compP) && !isNaN(compT) && !isNaN(conP) && !isNaN(conT)) {
      const evapProperties = calcEvap(evapP, evapT);
      const evapH_final = evapProperties?.h_final;
      const evapS_final = evapProperties?.s_final;
  
      const compProperties = calcComp(compP, compT);
      const compH_final = compProperties?.h_final;
      const compS_final = compProperties?.s_final;
  
      const comp2sProperties = calcComp2s(compP, evapS_final);
      const temp2s = comp2sProperties?.temperature2s;
      const comp2sH_final = comp2sProperties?.h_final;
  
      const conProperties = CalcCond(conP, conT);
      const conH_final = conProperties?.h_final;
      const conS_final = conProperties?.s_final;
  
      const EVProperties = CalcEV(evT, conProperties?.TempNormalized);
      const EVS_final = EVProperties?.s_final;
  
      // Set results for all stages
      setEvapResult({
        h_final: evapH_final?.toFixed(2),
        s_final: evapS_final?.toFixed(4),
      });
  
      setCompResult({
        h_final: compH_final?.toFixed(2),
        s_final: compS_final?.toFixed(4),
      });
  
      setComp2sResult({
        temp: temp2s?.toFixed(1),
        h_final: comp2sH_final?.toFixed(2)
      });
  
      setConResult({
        h_final: conH_final?.toFixed(2),
        s_final: conS_final?.toFixed(4),
      });
  
      setEVResult({
        s_final: EVS_final?.toFixed(4),
      });
    } else {
      console.error("❌ Missing data for calculation.");
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
      console.log('Updated States: ', {
        state1h,
        state2h,
        state2sH,
        state3h,
        state4h,
      });
    }
  }, [evapResult, compResult, comp2sResult, conResult]);
  
  // Use useEffect to trigger setGraphValues after state updates
  useEffect(() => {
    if (evapResult && compResult && conResult && EVResult) {
      setGraphValues();  // This will only be called after all results are set
    }
  }, [evapResult, compResult, conResult, EVResult]); // Watch for changes to these values
  


  const fetchRecords = async () => {
    const data = await fetchChillerRecords(); 
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const timeSlots = [];
    for (let i = 8; i <= 20; i++) {
      let hour = i > 12 ? i - 12 : i;
      let period = i >= 12 ? 'PM' : 'AM';
      timeSlots.push({ time: `${hour}:00 ${period}`, record: null });
    }

    const mergedData = timeSlots.map(slot => {
      const record = data.find(r => r.time === slot.time && r.date === selectedDateString);
      return {
        time: slot.time,
        record_time: record ? record.record_time : null, // Include record_time
        evaporator: record ? { Te: record.Te, Pe: record.Pe } : { Te: "No Data", Pe: "No Data" },
        compressor: record ? { Tc: record.Tc, Pcom: record.Pcom } : { Tc: "No Data", Pcom: "No Data" },
        condenser: record ? { Tcon: record.Tcon, Pcon: record.Pcon } : { Tcon: "No Data", Pcon: "No Data" },
        expansionValve: record ? { Tev: record.Tev } : { Tev: "No Data" },
      };
    });


    setRecords(mergedData);
  };

  const handleAddRecord = async () => {
    if (!selectedRecord) {
      console.error("❌ No selected record.");
      return;
    }

    try {
      const currentDate = selectedDate.toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString(); 

      await insertChillerRecord(
        currentDate,
        selectedRecord.time, 
        currentTime,
        parseFloat(newRecord.Te),
        parseFloat(newRecord.Pe),
        parseFloat(newRecord.Tc),
        parseFloat(newRecord.Pcom),
        parseFloat(newRecord.Tcon),
        parseFloat(newRecord.Pcon),
        parseFloat(newRecord.Tev)
      );

      await fetchRecords();
      setModalVisible(false);
      setNewRecord({ Te: '', Pe: '', Tc: '', Pcom: '', Tcon: '', Pcon: '', Tev: '' });
      console.log("✅ New record added with correct timestamps.");
    } catch (error) {
      console.error("❌ Error adding record:", error);
    }
  };

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    console.log('Record:', record);
  
    // Trigger the calculation if the results are missing
    if (!evapResult || !compResult || !conResult || !EVResult) {
      console.log('test');
      
      // Wait for the calculation to finish before proceeding
      await handleCalculate(); // Ensure the calculation is done before proceeding
    }
  
  
    setModalVisible(true);
  };
  
  

  const setGraphValues = () => {
    if (evapResult && compResult && conResult && EVResult) {
      setXValuesState1([evapResult?.s_final, compResult?.s_final]);
      setYValuesState1([selectedRecord.evaporator.Te, selectedRecord.compressor.Tc]);
  
      setXValuesState2([compResult?.s_final, conResult?.s_final]);
      setYValuesState2([selectedRecord.compressor.Tc, selectedRecord.condenser.Tcon]);
  
      setXValuesState3([conResult?.s_final, EVResult?.s_final]);
      setYValuesState3([selectedRecord.condenser.Tcon, selectedRecord.expansionValve.Tev]);
  
      setXValuesState4([EVResult?.s_final, evapResult?.s_final]);
      setYValuesState4([selectedRecord.expansionValve.Tev, selectedRecord.evaporator.Te]);
  
      // Optionally, log the updated values for debugging
      console.log('xValuesState1:', xValuesState1);
      console.log('yValuesState1:', yValuesState1);
      console.log('xValuesState2:', xValuesState2);
      console.log('yValuesState2:', yValuesState2);
      console.log('xValuesState3:', xValuesState3);
      console.log('yValuesState3:', yValuesState3);
      console.log('xValuesState4:', xValuesState4);
      console.log('yValuesState4:', yValuesState4);
    } else {
      console.error("❌ Missing data for calculations.");
    }
  };
  
  const results = conclusionCalculationTable(state1h, state2h, state2sH, state3h, state4h);
  

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainHeader}>Chiller Data</Text>

      {/* Date Picker Section */}
      <View style={{ alignItems: 'center', marginBottom: 15 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Choose Date:</Text>
            <Button title="Pick Date" onPress={() => setShowPicker(true)} />
              {showPicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </Text>
      </View>

      {/* Data Table */}
      <View style={styles.tableContainer}>
        {records.map((record, index) => (
          <View key={index} style={styles.recordRow}>
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
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Evaporator</Text>
                <Text style={[styles.tableCell, record.evaporator.Te === "No Data" && styles.noDataText]}>
                  {record.evaporator.Te}
                </Text>
                <Text style={[styles.tableCell, record.evaporator.Pe === "No Data" && styles.noDataText]}>
                  {record.evaporator.Pe}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Compressor</Text>
                <Text style={[styles.tableCell, record.evaporator.Te === "No Data" && styles.noDataText]}>
                  {record.compressor.Tc}
                </Text>
                <Text style={[styles.tableCell, record.evaporator.Pe === "No Data" && styles.noDataText]}>
                  {record.compressor.Pcom}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Condenser</Text>
                <Text style={[styles.tableCell, record.evaporator.Te === "No Data" && styles.noDataText]}>
                  {record.condenser.Tcon}
                </Text>
                <Text style={[styles.tableCell, record.evaporator.Pe === "No Data" && styles.noDataText]}>
                  {record.condenser.Pcon}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Expansion Valve</Text>
                <Text style={[styles.tableCell, record.evaporator.Pe === "No Data" && styles.noDataText]}>
                  {record.expansionValve.Tev}
                </Text>
                <Text style={styles.tableCell}>-</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal : Popup*/}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record for {selectedRecord?.time}</Text>
            
            {/* If no data available*/}
            {selectedRecord?.evaporator.Te === "No Data" ? (
              <>
                <Text style={styles.noDataText}>Current Time: {currentTime}</Text>
                <View style={styles.line} />
                {/* Evaporator */}
                <Text style={[styles.textBold]}>Evaporator</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Temperature:</Text>
                  <TextInput placeholder="Te (°C)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Te: text })} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Pressure:</Text>
                  <TextInput placeholder="Pe (kPa)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Pe: text })} />
                </View>
                <View style={styles.line} />

                {/* Compressor */}
                <Text style={[styles.textBold]}>Compressor</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Temperature:</Text>
                  <TextInput placeholder="Tcom (°C)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Tc: text })} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Pressure:</Text>
                  <TextInput placeholder="Pcom (kPa)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Pcom: text })} />
                </View>
                <View style={styles.line} />

                {/* Condenser */}
                <Text style={[styles.textBold]}>Condenser</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Temperature:</Text>
                  <TextInput placeholder="Tcon (°C)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Tcon: text })} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Pressure:</Text>
                  <TextInput placeholder="Pcon (kPa)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Pcon: text })} />
                </View>
                <View style={styles.line} />

                {/* Expansion Valve */}
                <Text style={[styles.textBold]}>Expansion Valve</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Temperature:</Text>
                  <TextInput placeholder="Tev (°C)" style={styles.input} onChangeText={(text) => setNewRecord({ ...newRecord, Tev: text })} />
                </View>
                <View style={styles.line} />

                <Button title="Add Record" onPress={handleAddRecord} />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            ) : (
              <>

                {/* When data already available */}
                {selectedRecord ? (
                    <ScrollView>
                  <View style={styles.table}>
                    <Text style={styles.modalText}>
                      Recorded at: {selectedRecord?.record_time || "Unknown Time"}
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
                      <Text style={styles.tableCell}>{selectedRecord.evaporator.Te}</Text>
                      <Text style={styles.tableCell}>{selectedRecord.evaporator.Pe}</Text>
                      <Text style={styles.tableCell}>{evapResult?.h_final ?? '-'}</Text>
                      <Text style={styles.tableCell}>{evapResult?.s_final ?? '-'}</Text>
                    </View>

                    {/* Compressor */}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>2</Text>
                      <Text style={styles.tableCell}>{selectedRecord.compressor.Tc}</Text>
                      <Text style={styles.tableCell}>{selectedRecord.compressor.Pcom}</Text>
                      <Text style={styles.tableCell}>{compResult?.h_final ?? '-'}</Text>
                      <Text style={styles.tableCell}>{compResult?.s_final ?? '-'}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>2s</Text>
                      <Text style={styles.tableCell}>{comp2sResult?.temp ?? '-'}</Text>
                      <Text style={styles.tableCell}>{selectedRecord.compressor.Pcom}</Text>
                      <Text style={styles.tableCell}>{comp2sResult?.h_final ?? '-'}</Text>
                      <Text style={styles.tableCell}>{evapResult?.s_final ?? '-'}</Text>
                    </View>

                    {/* Condenser */}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>3</Text>
                      <Text style={styles.tableCell}>{selectedRecord.condenser.Tcon}</Text>
                      <Text style={styles.tableCell}>{selectedRecord.condenser.Pcon}</Text>
                      <Text style={styles.tableCell}>{conResult?.h_final ?? '-'}</Text>
                      <Text style={styles.tableCell}>{conResult?.s_final ?? '-'}</Text>
                    </View>

                    {/* Expansion Valve */}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { fontSize: 12, flex: 0.5 }]}>4</Text>
                      <Text style={styles.tableCell}>{selectedRecord.expansionValve.Tev}</Text>
                      <Text style={styles.tableCell}>{selectedRecord.evaporator.Pe}</Text>
                      <Text style={styles.tableCell}>{conResult?.h_final ?? '-'}</Text>
                      <Text style={styles.tableCell}>{EVResult?.s_final ?? '-'}</Text>
                    </View>

                    {/* <Text style={styles.header}>T-S Graph</Text> */}
                    <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 20,marginBottom: -30, fontWeight: 'bold' }}>
                              T-s Diagram{'\n'}(Temperature vs Entropy)
                            </Text>

                    <TSGraph 
                        xValuesState1={xValuesState1}
                        yValuesState1={yValuesState1}
                        xValuesState2={xValuesState2}
                        yValuesState2={yValuesState2}
                        xValuesState3={xValuesState3}
                        yValuesState3={yValuesState3}
                        xValuesState4={xValuesState4}
                        yValuesState4={yValuesState4}
                    />

                    <ConclusionTable data={results} />

                  </View>
                  </ScrollView>
                ) : (
                  <Text>No Data Available</Text>
                )}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
              
            )}
          </View>
        </View>
      </Modal>


    </ScrollView>
  );
};

export default ChillerDataPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 100,
    paddingBottom: 90,
    backgroundColor: '#f4f4f4',
  },
  mainHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
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
    marginTop: 20,
  },
  recordRow: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
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
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
    marginBottom: 5,
    backgroundColor: 'lightgrey',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 18, marginBottom: 10 },
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
});
