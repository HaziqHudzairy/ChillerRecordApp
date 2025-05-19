import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import tableData2 from "./js/tableA-12Calculation"; // Import the new table data

//console.log(tableData2); // Log the imported data to check its structure



const ThermoTable = () => {

    const [selectedRow, setSelectedRow] = useState(null);

    const inflateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(inflateAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    // Custom transform from bottom-left
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
        <View style={{ flex: 1, padding: 0 }}>
            <LinearGradient
                colors={['#00c6ff', '#0072ff']} // Apply two-color gradient to the header
                style={styles.headerContainer}
            >
                <Text style={styles.headerText}>Table A-12</Text>
                <Text style={styles.headerSubtitle}>Saturated refrigerant-134a—Pressure table</Text>
            </LinearGradient>

            <View style={styles.tableContainerA12}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={styles.tableHeaderA12}>
                            <Text style={styles.headerItem}>P (kPa)</Text>
                            <Text style={styles.headerItem}>Tsat (°C)</Text>
                            <Text style={styles.headerItem}>hf (kJ/kg)</Text>
                            <Text style={styles.headerItem}>sf (kJ/kg.K)</Text>
                            <Text style={styles.headerItem}>hg (kJ/kg)</Text>
                            <Text style={styles.headerItem}>sg (kJ/kg.K)</Text>
                        </View>
                        <FlatList
                            data={tableData2}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                const isSelected = index === selectedRow;
                                return (
                                    <TouchableOpacity
                                        onPress={() => setSelectedRow(index)}
                                        style={[
                                            styles.tableRow,
                                            isSelected && { backgroundColor: '#E8F3FE' }, // Highlight color for selected row
                                        ]}
                                    >
                                        <Text style={styles.tableItem}>{item.Pressure}</Text>
                                        <Text style={styles.tableItem}>{item.Tsat}</Text>
                                        <Text style={styles.tableItem}>{item.hf}</Text>
                                        <Text style={styles.tableItem}>{item.sf}</Text>
                                        <Text style={styles.tableItem}>{item.hg}</Text>
                                        <Text style={styles.tableItem}>{item.sg}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </ScrollView>

            </View>


            <Animated.View style={[styles.backButtonContainer, inflateFromBottomLeftStyle]}>
                <TouchableOpacity
                    onPress={() => {
                        router.replace('./mainPage');
                    }}
                    style={styles.backButton}
                >
                    <FontAwesome5
                        name="arrow-left"
                        size={28}
                        color="#007bff"
                        solid
                        style={{
                            paddingTop: 20,
                            paddingLeft: 0,
                            textAlign: 'left',
                        }}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default ThermoTable;

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        marginTop: 50,
        fontSize: 26,
        fontWeight: "bold",
        color: '#ffffff',
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: "center",
    },
    tableContainerA12: {
        width: '80%',
        backgroundColor: '#ffffff',
        padding: 15,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 10,
        marginBottom: 250,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignSelf: 'center',
    },
    tableHeaderA12: {
        flexDirection: 'row',
        backgroundColor: '#0099ff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 2, // for Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        justifyContent: 'center',
        height: 50,
    },
    tableContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        padding: 15,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignSelf: 'center',
    },

    tableTitle: {
        paddingTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#0099ff',
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        color: "#fff",
        paddingBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0099ff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,

        elevation: 2, // for Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        justifyContent: 'center',
    },
    headerItem: {
        color: "#fff",
        width: 100,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 15,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableItem: {
        width: 100,
        textAlign: "center",
    },
    backButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        // Make sure it's on top of other views
    },
    backButton: {
        backgroundColor: '#fff',
        width: 120,
        height: 120,
        borderTopRightRadius: 120,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    backButtonIcon: {
        paddingTop: 20,
        paddingLeft: 20,
        textAlign: 'left',
    },
    lineContainer: {
        backgroundColor: '#0099ff', // Outer background color

        height: 4, // Height of the line container
        justifyContent: 'center', // Centers the inner white line
        width: '100%',
        alignSelf: 'center',
    },

    whiteLine: {
        backgroundColor: '#ffffff', // White line color
        height: 2, // Height of the inner white line
        width: '80%', // Adjust width of the white line
        alignSelf: 'center',
    }



});
