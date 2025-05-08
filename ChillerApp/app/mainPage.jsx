import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MainPage = () => {
  return (
    
    <LinearGradient
    colors={['#0047bb','#00c6ff', '#0072ff']}
    style={styles.container}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
  >
    <StatusBar barStyle="light-content" backgroundColor="#1e1e2d" />

    {/* Header */}
    <View style={styles.header}>
      {/* <Image source={require('./assets/icon.png')} style={styles.logo} /> */}
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
      <TouchableOpacity style={[styles.tableCard, { backgroundColor: '#e0d9f9' }]} onPress={() => router.replace('./tableA12Page')}>
        <LinearGradient colors={['#a18cd1', '#fbc2eb']} style={styles.tableIconCircle}>
          <FontAwesome name="table" size={24} color="#fff" />
        </LinearGradient>
        <Text style={styles.tableTitle}>Table A-12</Text>
        <Text style={styles.featureSubtitle}>Saturated refrigerant-134a—Pressure table</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tableCard, { backgroundColor: '#ffe0d8' }]} onPress={() => router.replace('./tableA13Page')}>
        <LinearGradient colors={['#fbc2eb', '#a6c1ee']} style={styles.tableIconCircle}>
          <FontAwesome name="book" size={24} color="#fff" />
        </LinearGradient>
        <Text style={styles.tableTitle}>Table A-13</Text>
        <Text style={styles.featureSubtitle}>Superheated refrigerant-134a</Text>
      </TouchableOpacity>

      

    </View>

    <View style={styles.bottomContainer}>
    
    </View>
  </LinearGradient>
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
    width: 60,
    height: 60,
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
    height: '80%',
    zIndex: 0, // set to 0 or a positive value
    elevation: 0, // optional: make sure it doesn't overlap
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  
  
  
});
