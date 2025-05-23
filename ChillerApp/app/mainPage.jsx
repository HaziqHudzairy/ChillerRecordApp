import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView } from 'react-native';
import { fetchChillerRecords } from './database/DBService.js';
import { CalcCond, CalcEV, FindTemperatureFromPressure, CalcCondEVAlt } from './js/tableA-12Calculation.js';
import { calcEvap, calcComp, calcComp2s } from './js/tableA-13Calculation.js';
import { router } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DailyCopTable from './js/DailyCopTable';
import TCOPGraph from './js/TCOPGraph.js';
import TWGraph from './js/TWGraph.js';
import Icon from 'react-native-vector-icons/FontAwesome';






const MainPage = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [copData, setCopData] = useState([]);
    useEffect(() => {
        const fetchAndProcessData = async () => {
            const data = await fetchChillerRecords();
            const dateStr = selectedDate.toISOString().split('T')[0];

            const timeSlots = [];
            for (let i = 8; i <= 22; i++) {
                const hour = i > 12 ? i - 12 : i;
                const period = i >= 12 ? 'PM' : 'AM';
                timeSlots.push({ time: `${hour}:00 ${period}` });
            }

            const processed = [];

            for (const slot of timeSlots) {
                const record = data.find(r => r.time === slot.time && r.date === dateStr);

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

                const { Te, Pe, Tc, Pcom, Tcon, Pcon, Tev, isTconCalculated, isTevCalculated } = record;
                const Pe_Mpa = Pe / 1000;
                const Pcom_Mpa = Pcom / 1000;

                try {
                    const evapProps = calcEvap(Pe_Mpa, Te);
                    const state1H = evapProps?.h_final.toFixed(2);
                    const evapS = evapProps?.s_final;

                    const compProps = calcComp(Pcom_Mpa, Tc);
                    const state2H = compProps?.h_final.toFixed(2);

                    const comp2sProps = calcComp2s(Pcom_Mpa, evapS);
                    const state2sH = comp2sProps?.h_final.toFixed(2);

                    let conProps;
                    if (isTconCalculated === 1) {
                        conProps = CalcCondEVAlt(Pcon);
                    } else {
                        conProps = CalcCond(Pcon, Tcon);
                    }
                    const state3H = conProps?.h_final.toFixed(2);

                    const state4H = state3H;

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
    }, [selectedDate]); // <== trigger effect when selectedDate changes


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
                <View style={styles.underline} />
                <Text style={[styles.title, { fontSize: 26 }]}>Daily Analysis</Text>
                <View style={styles.underlineContainer}>
  <Icon name="snowflake-o" size={16} color="#0099ff" />
  <View style={styles.underlineSmall} />
  <Icon name="snowflake-o" size={16} color="#0099ff" />
</View>

                <View style={styles.datePickerWrapper}>


                    <View style={styles.dateNavContainer}>
                        <TouchableOpacity onPress={goToPreviousDate}>
                            <FontAwesome name="chevron-left" size={24} color="#0072ff" />
                        </TouchableOpacity>

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

                        <TouchableOpacity onPress={goToNextDate}>
                            <FontAwesome name="chevron-right" size={24} color="#0072ff" />
                        </TouchableOpacity>
                    </View>





                </View>
                <DailyCopTable data={copData} />

                <View style={{ padding: 0, marginBottom: -80 }}>
                    <TCOPGraph data={copData} />
                </View>

                <View style={{ padding: 0, marginBottom: -80 }}>
                    <TWGraph data={copData} />
                </View>

                <Text style={[{ textAlign: 'center', marginBottom: 20 }]}>© 2025 CoolThermoTrack</Text>


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
        flexWrap: 'wrap',
        flexDirection: 'row',
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
        height: '89%',
        zIndex: 0,
        elevation: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    title: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#045cc8',
    },
    underline: {
        width: '100%',
        height: 0.3,
        backgroundColor: '#0099ff',
        marginTop: 18,
        borderRadius: 1,
    },
    underlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },

    underlineSmall: {
        width: '50%',
        height: 0.5,
        backgroundColor: '#0099ff',
        borderRadius: 1,
        marginHorizontal: 10,
    },

    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0099ff',
    },

    selectedDateContainer: {
        flex: 1,
        alignItems: 'center',
    },
    datePickerWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateNavContainer: {
        width: '85%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    navButton: {
        fontSize: 24,
        color: '#0099ff',
        paddingHorizontal: 15,
    },
    weekdayText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#045cc8',
    },
    dateText: {
        fontSize: 16,
        color: '#045cc8',
    },

    textBold: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },

});
