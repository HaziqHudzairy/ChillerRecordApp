import { conclusionCalculationTable } from './conclusionCalculationTable.js';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

export const DailyCopTable = ({ data }) => {

    const formatNumber = (value) => {
        return (typeof value === 'number' && !isNaN(value)) ? value.toFixed(2) : '-';
    };

    // Compute the transformed table data once
    const calculatedData = data.map(({ hour, state1H, state2H, state2sH, state3H, state4H }) => {
        const results = conclusionCalculationTable(state1H, state2H, state2sH, state3H, state4H);
        return { hour, ...results };
    });

    const totalCOP = calculatedData.reduce((sum, item) => sum + (item.COP || 0), 0);
    const totalEER = calculatedData.reduce((sum, item) => sum + (item.EER || 0), 0);
    const count = calculatedData.length;

    const averageCOP = count > 0 ? totalCOP / count : 0;
    const averageEER = count > 0 ? totalEER / count : 0;


    return (
        <View style={styles.shadowWrapper}>
        <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
                <Text style={[styles.cell, styles.tableHeader]}>Hour</Text>
                <Text style={[styles.cell, styles.tableHeader]}>Q_in</Text>
                <Text style={[styles.cell, styles.tableHeader]}>Wc</Text>
                <Text style={[styles.cell, styles.tableHeader]}>Wcs</Text>
                <Text style={[styles.cell, styles.tableHeader]}>Q_out</Text>
                <Text style={[styles.cell, styles.tableHeader]}>ηc</Text>
                <Text style={[styles.cell, styles.tableHeader]}>COP</Text>
                <Text style={[styles.cell, styles.tableHeader]}>EER</Text>
            </View>

            <View style={{ maxHeight: 150 }}>
                <ScrollView nestedScrollEnabled={true}>
                    {calculatedData.map((item, index) => (
                        <View
                            key={index}
                            style={[styles.tableRow, index % 2 === 1 && styles.altRow]}
                        >
                            <Text style={[styles.cell, styles.smallCellText]}>{item.hour}</Text>
                            <Text style={styles.cell}>{formatNumber(item.Q_in)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.Wc)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.Wcs)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.Q_out)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.ηc)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.COP)}</Text>
                            <Text style={styles.cell}>{formatNumber(item.EER)}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.tableRow, styles.averageRow]}>
                {/* Merged cell for the "Average" title across 6 columns */}
                <View style={[styles.averageLabelContainer]}>
                    <Text style={[styles.averageLabel]}>Total</Text>
                </View>

                {/* Average COP */}
                <Text style={[styles.cell, styles.averageValue]}>
                    {formatNumber(totalCOP)}
                </Text>

                {/* Average EER */}
                <Text style={[styles.cell, styles.averageValue, {borderBottomRightRadius:10}]}>
                    {formatNumber(totalEER)}
                </Text>
            </View>

            <View style={[styles.tableRow, styles.averageRow]}>
                {/* Merged cell for the "Average" title across 6 columns */}
                <View style={[styles.averageLabelContainer, {backgroundColor:'#0072ff'}]}>
                    <Text style={styles.averageLabel}>Average</Text>
                </View>

                {/* Average COP */}
                <Text style={[styles.cell, styles.averageValue]}>
                    {formatNumber(averageCOP)}
                </Text>

                {/* Average EER */}
                <Text style={[styles.cell, styles.averageValue]}>
                    {formatNumber(averageEER)}
                </Text>
            </View>




        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tableContainer: {
    borderRadius: 10,
    overflow: 'hidden', // This is key to clip shadows inside
    backgroundColor: '#fff',

    shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        zIndex: 2,
},

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#333',
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#0072ff',
    },


    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#0099ff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 8,
        elevation: 2, // for Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    tableHeader: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        color: '#ffffff',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        // borderBottomWidth: 1,
        // borderBottomColor: '#e0e0e0',
        // borderLeftWidth: 1, // Left border width
        // borderLeftColor: '#e0e0e0', // Left border color
        // borderRightWidth: 1, // Right border width
        // borderRightColor: '#e0e0e0', // Right border color
        backgroundColor: '#fff',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    smallCellText: {
        fontSize: 10,  // or whatever smaller size you want
    },
    altRow: {
        backgroundColor: '#E8F3FE',
    },


    averageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
    },

    averageLabelContainer: {
        width: '73%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0099ff', // Change this to your desired color
        minWidth: 0,
        
    },

    averageLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 10,
        color: '#fff', // Optional: darker text for contrast

    },

    averageValue: {
        paddingVertical: 8,
        flex: 1,
        color: '#1B4F72',
        fontWeight: 'bold',
        textAlign: 'center',
    },


    shadowWrapper: {
  borderRadius: 10,
  backgroundColor: '#fff', // for iOS shadow visibility
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
  }),
  marginTop: 20,
  marginBottom: 15,
},

});

export default DailyCopTable;
