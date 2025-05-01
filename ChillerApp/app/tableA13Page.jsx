import React from "react";
import { View, Text, FlatList } from "react-native";
import tableData from "./js/tableA-13Calculation";

const ThermoTable = () => {
    return (
        <FlatList
            data={tableData}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 10, marginTop: 50, marginBottom: 80, paddingBottom: 100 }}
            ListHeaderComponent={
                <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 15 }}>
                    Table A-13 (Superheated)
                </Text>
            }
            renderItem={({ item: table }) => (
                <View style={{ width: '80%', backgroundColor: '#ffffff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, alignSelf:'center'}}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                        P = {table.pressure} MPa (Tsat {table.T_sat}°C)
                    </Text>

                    {/* Table Header */}
                    <View style={{ flexDirection: "row", borderBottomWidth: 1, paddingVertical: 5, justifyContent: 'center' }}>
                        <Text style={{ width: 80, fontWeight: "bold", textAlign: "center" }}>T (°C)</Text>
                        <Text style={{ width: 100, fontWeight: "bold", textAlign: "center" }}>h (kJ/kg)</Text>
                        <Text style={{ width: 100, fontWeight: "bold", textAlign: "center" }}>s (kJ/kg.K)</Text>
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
                            <View style={{ flexDirection: "row", paddingVertical: 5, justifyContent: 'center' }}>
                                <Text style={{ width: 80, textAlign: "center" }}>{item.T}</Text>
                                <Text style={{ width: 100, textAlign: "center" }}>{item.h}</Text>
                                <Text style={{ width: 100, textAlign: "center" }}>{item.s}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        />
    );
};

export default ThermoTable;
