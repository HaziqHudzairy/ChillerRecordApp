import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView } from 'react-native';
import { fetchChillerRecords } from './database/DBService.js';
import { CalcCond, CalcEV, FindTemperatureFromPressure, CalcCondEVAlt } from './js/tableA-12Calculation.js';
import { calcEvap, calcComp, calcComp2s } from './js/tableA-13Calculation.js';
import { router } from 'expo-router';
import { FontAwesome, FontAwesome5  } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DailyCopTable from './js/DailyCopTable';
import TCOPGraph from './js/TCOPGraph.js';






const MainPage = () => {
    const [copData, setCopData] = useState([]);
    useEffect(() => {
        const fetchAndProcessData = async () => {
            const data = await fetchChillerRecords();
            const today = new Date().toISOString().split('T')[0];

            const timeSlots = [];
            for (let i = 8; i <= 22; i++) {
                const hour = i > 12 ? i - 12 : i;
                const period = i >= 12 ? 'PM' : 'AM';
                timeSlots.push({ time: `${hour}:00 ${period}` });
            }

            const processed = [];

            for (const slot of timeSlots) {
    const record = data.find(r => r.time === slot.time && r.date === today);

    if (!record) {
        processed.push({
            hour: slot.time,
            state1H: '-',
            state2H: '-',
            state2sH: '-',
            state3H: '-',
            state4H: '-',
        });
        continue;
    }

    const {
        Te, Pe, Tc, Pcom, Tcon, Pcon, Tev,
        isTconCalculated, isTevCalculated
    } = record;

    const Pe_Mpa = Pe / 1000;
    const Pcom_Mpa = Pcom / 1000;

    try {
        // State 1 - Evaporator
        const evapProps = calcEvap(Pe_Mpa, Te);
        const state1H = evapProps?.h_final.toFixed(2);
        const evapS = evapProps?.s_final;

        // State 2 - Compressor
        const compProps = calcComp(Pcom_Mpa, Tc);
        const state2H = compProps?.h_final.toFixed(2);

        // State 2s - Isentropic Compression
        const comp2sProps = calcComp2s(Pcom_Mpa, evapS);
        const state2sH = comp2sProps?.h_final.toFixed(2);

        // State 3 - Condenser
        let conProps, state3H;
        if (isTconCalculated === 1) {
            conProps = CalcCondEVAlt(Pcon);
        } else {
            conProps = CalcCond(Pcon, Tcon);
        }
        state3H = conProps?.h_final.toFixed(2);

        // State 4 - Expansion Valve
        let state4H = state3H;

        processed.push({
            hour: slot.time,
            state1H,
            state2H,
            state2sH,
            state3H,
            state4H
        });

    } catch (e) {
        console.warn(`Error processing time slot ${slot.time}:`, e);
        processed.push({
            hour: slot.time,
            state1H: '-',
            state2H: '-',
            state2sH: '-',
            state3H: '-',
            state4H: '-',
        });
    }
}


            setCopData(processed);
        };

        fetchAndProcessData();
    }, []);

    // console.log("Raw data sent" ,copData)

    return (
        <ScrollView>
        <LinearGradient
            colors={['#0047bb', '#00c6ff', '#0072ff']}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1e1e2d" />

            {/* Header */}
            <View style={styles.header}>
                <Image source={require('./assets/coolIcon.png')} style={styles.logo} />
                <Text style={styles.appName}>CoolThermoTrack</Text>
            </View>

            {/* Feature Card */}
            <TouchableOpacity style={styles.featureCard} onPress={() => router.replace('./recordPage')}>
                <View style={styles.iconContainer}>
                    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.featureIconCircle}>
                        <FontAwesome name="thermometer-half" size={24} color="#fff" />
                    </LinearGradient>
                </View>
                <View>
                    <Text style={styles.featureTitle}>Chiller Records and Analyzation</Text>
                    <Text style={styles.featureSubtitleMain}>Track, analyze, and optimize your chiller system data easily.</Text>
                </View>
            </TouchableOpacity>

            {/* Table Buttons Grid */}
            <View style={styles.gridContainer}>
                <TouchableOpacity style={[styles.tableCard, { backgroundColor: '#d4f4fd' }]} onPress={() => router.replace('./tableA12Page')}>
                    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.tableIconCircle}>
                        <FontAwesome name="table" size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.tableTitle}>Table A-12</Text>
                    <Text style={styles.featureSubtitle}>Saturated refrigerant-134a—Pressure table</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.tableCard, { backgroundColor: '#e0f8ff' }]} onPress={() => router.replace('./tableA13Page')}>
                    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.tableIconCircle}>
                        <FontAwesome name="book" size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.tableTitle}>Table A-13</Text>
                    <Text style={styles.featureSubtitle}>Superheated refrigerant-134a</Text>
                </TouchableOpacity>



            </View>

            <View style={styles.bottomContainer}>

            </View>
                    <Text style={[styles.title, {fontSize: 26}]}>Daily Analysis</Text>
                    <View style={styles.underline} />

                <DailyCopTable data={copData} />

                <Text style={styles.title}>Time vs COP Graph</Text>
                <View style={[styles.underline, {marginBottom:20}]} />

                <View style={{ padding: 5, marginBottom: -80 }}>
                    <TCOPGraph data={copData} />
                </View>

                <Text style={[{textAlign:'center', marginBottom:20}]}>© 2025 CoolThermoTrack</Text>


        </LinearGradient>
        </ScrollView>
    );
};

export default MainPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
        position: 'relative',
    },
    header: {
        justifyContent: 'center',
        height: 100,
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    featureCard: {
        backgroundColor: '#fefefe',
        flexDirection: 'row',
        alignItems: 'center',
        height: 120,
        padding: 20,
        borderRadius: 25,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        zIndex: 2,


    },
    iconContainer: {
        marginRight: 15,
    },
    featureIconCircle: {
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e1e2d',
    },
    featureSubtitleMain: {
        textAlign: 'left',
        width: '80%',
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        paddingRight: 10,
        flexWrap: 'wrap',  // This will ensure the text wraps if it's too long
        flexDirection: 'row',  // Ensure the direction is set for wrapping
    },
    featureSubtitle: {
        textAlign: 'center',
        width: '80%',
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    tableCard: {
        flex: 0.48,
        borderRadius: 25,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    tableIconCircle: {
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    tableTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e1e2d',
        marginBottom: 2,
    },

    bottomContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '88%',
        zIndex: 0, // set to 0 or a positive value
        elevation: 0, // optional: make sure it doesn't overlap
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    title:{
        marginTop:45,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00377e',
    },
    underline: {
  width: '100%',
  height: 0.5,
  backgroundColor: '#00377e',
  marginTop: 6,
  borderRadius: 1,
},


});
