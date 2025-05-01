import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConclusionTable = ({ data }) => {
  if (!data) return null;

  const tableData = [
    { label: 'Qin (kJ/kg)', value: data.Q_in },
    { label: 'Wc (kJ/kg)', value: data.Wc },
    { label: 'Wcs (kJ/kg)', value: data.Wcs },
    { label: 'Qout (kJ/kg)', value: data.Q_out },
    { label: 'ηc (%)', value: data.ηc},
    { label: 'COP', value: data.COP },
    { label: 'EER', value: data.EER },
  ];

  return (
    <View style={styles.table}>
      <Text style={styles.title}>Conclusion Table</Text>
      {tableData.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cellLabel}>{item.label}</Text>
          <Text style={styles.cellValue}>{item.value.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 16,
  },
});

export default ConclusionTable;
