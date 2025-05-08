import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConclusionTable = ({ data }) => {
  if (!data) return null;

  const tableData = [
    { label: 'Qin (kJ/kg)', value: data.Q_in },
    { label: 'Wc (kJ/kg)', value: data.Wc },
    { label: 'Wcs (kJ/kg)', value: data.Wcs },
    { label: 'Qout (kJ/kg)', value: data.Q_out },
    { label: 'ηc (%)', value: data.ηc },
    { label: 'COP', value: data.COP },
    { label: 'EER', value: data.EER },
  ];

  return (
    <View style={styles.table}>
      <Text style={styles.title}>COP Table</Text>
      {tableData.map((item, index) => (
        <View
          key={index}
          style={[
            styles.row,
            index === tableData.length - 1 && styles.lastRow, // Apply style to the last row
          ]}
        >
          <Text style={styles.cellLabel}>{item.label}</Text>
          <Text style={styles.cellValue}>{item.value.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    margin: 0,
    padding: 0,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
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
    color: '#fff',
  },

  
  row: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  lastRow: {
    borderBottomLeftRadius: 15, // Apply bottom-left radius
    borderBottomRightRadius: 15, // Apply bottom-right radius
  },

  cellLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 14,
  },
});

export default ConclusionTable;
