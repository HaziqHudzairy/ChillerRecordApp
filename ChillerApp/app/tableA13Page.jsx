import { useState, useEffect, useRef, useMemo } from 'react';
import { Animated, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import tableData from "./js/tableA-13Calculation";

const ThermoTable = () => {

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
                <Text style={styles.headerText}>Table A-13</Text>
                <Text style={styles.headerSubtitle}>Superheated refrigerant-134a</Text>
            </LinearGradient>
            {/* Table Content */}
            <FlatList
                data={tableData}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginBottom: 80, paddingBottom: 10 }}
                renderItem={({ item: table }) => (
                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>
                            P = {table.pressure} MPa (Tsat {table.T_sat}°C)
                        </Text>
                        <View style={styles.lineContainer}>
                            <View style={styles.whiteLine} />
                        </View>

                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerItem}>T (°C)</Text>
                            <Text style={styles.headerItem}>h (kJ/kg)</Text>
                            <Text style={styles.headerItem}>s (kJ/kg.K)</Text>
                        </View>

                        {/* Sorted Data */}
                        <FlatList
                            data={Object.keys(table.for_T)
                                .map((temp) => ({
                                    T: parseFloat(temp),
                                    h: table.for_T[temp].h,
                                    s: table.for_T[temp].s,
                                }))
                                .sort((a, b) => a.T - b.T)}
                            keyExtractor={(item) => item.T.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableItem}>{item.T}</Text>
                                    <Text style={styles.tableItem}>{item.h}</Text>
                                    <Text style={styles.tableItem}>{item.s}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            />

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
        paddingVertical: 10,
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
        paddingLeft: 30,
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
