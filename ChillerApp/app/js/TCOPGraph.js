// TCOPGraph.js
import React from 'react';
import { conclusionCalculationTable } from './conclusionCalculationTable.js';
import { View, ScrollView, Dimensions, StyleSheet, Text, Platform } from 'react-native';
import Svg, { Line, Text as SvgText, Circle, Path, Rect } from 'react-native-svg';

const TCOPGraph = ({ data }) => {

    const formatNumber = (value) => {
        return (typeof value === 'number' && !isNaN(value)) ? value.toFixed(2) : '-';
    };

    const COPdata = (data || []).map(({ hour, state1H, state2H, state2sH, state3H, state4H }) => {
        const results = conclusionCalculationTable(state1H, state2H, state2sH, state3H, state4H);
        return { hour, ...results };
    });
    // console.log("Raw data received:", data);

    // console.log("Transformed data:", COPdata);



    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 20;
    const graphHeight = 300;
    const topPadding = 20;
    const svgHeight = graphHeight + 40 + topPadding;
    const graphWidth = COPdata.length * 60 + 70;

    const validCOPData = COPdata.filter(d => typeof d.COP === 'number' && !isNaN(d.COP));
    const minCOP = 8;
    const maxCOP = 14;
    const yScale = graphHeight / (maxCOP - minCOP);

    const xStep = 60;

    const linePath = validCOPData
        .map((point, index) => {
            const x = index * xStep + 30 + horizontalPadding + 60;
            const y = graphHeight - (point.COP - minCOP) * yScale + topPadding;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');



    const yAxisLabels = [8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0];



    return (


            <View style={styles.tableContainer}>
                <Text style={styles.title}>COP vs Time Graph</Text>
                <View style={styles.container}>
                    <ScrollView horizontal contentContainerStyle={{ width: graphWidth + 40, paddingBottom: 60, paddingLeft:20, position: 'relative', }}>
                        <Svg height={graphHeight + 40} width={graphWidth + 10}>

                            <Rect x={30 + horizontalPadding} y="20" width={graphWidth + 30} height={graphHeight} fill="#f4faff" />

                            {yAxisLabels.map((value, index) => {
                                const y = graphHeight - (value - minCOP) * yScale + topPadding;
                                return (
                                    <Line
                                        key={`h-grid-${index}`}
                                        x1={30 + horizontalPadding}
                                        y1={y}
                                        x2={graphWidth + 10}
                                        y2={y}
                                        stroke="#999"
                                        strokeDasharray="2,2"
                                        strokeWidth="1"
                                    />
                                );
                            })}

                            {[...COPdata, {}].map((point, index) => {
                                const x = index * xStep + 30;
                                return (
                                    <Line
                                        key={`v-grid-${index}`}
                                        x1={x + horizontalPadding}
                                        y1={topPadding}
                                        x2={x + horizontalPadding}
                                        y2={graphHeight + topPadding}
                                        stroke="#999"
                                        strokeDasharray="2,2"
                                        strokeWidth="1"
                                    />
                                );
                            })}


                            {/* Y-axis label: COP */}
                            <SvgText
                                x={-15}
                                y={graphHeight / 2 + topPadding - 10}
                                transform={`rotate(-90, 0, ${graphHeight / 2})`}
                                fontSize="12"
                                fill="black"
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                Coefficient of Performnace (COP)
                            </SvgText>


                            <Line x1={30 + horizontalPadding} y1="10" x2={30 + horizontalPadding} y2={graphHeight + topPadding} stroke="black" strokeWidth="2" />
                            <Line x1={30 + horizontalPadding} y1={graphHeight + topPadding} x2={graphWidth + 10} y2={graphHeight + topPadding} stroke="black" strokeWidth="2" />

                            {yAxisLabels.map((value, index) => {
                                const y = graphHeight - (value - minCOP) * yScale + topPadding;
                                return (
                                    <SvgText key={index} x={horizontalPadding} y={y + 4} fontSize="10" fill="black">
                                        {value.toFixed(1)}
                                    </SvgText>
                                );
                            })}




                            <Path d={linePath} fill="none" stroke="#06768D" strokeWidth="2" />

                            {COPdata.map((point, index) => {
                                const x = index * xStep + 30 + 60 + horizontalPadding;
                                const y = graphHeight - (point.COP - minCOP) * yScale + topPadding;
                                return <Circle key={index} cx={x} cy={y} r="3" fill="#06768D" />;
                            })}


                            {validCOPData.map((point, index) => {
                                const x = index * xStep + 30 + horizontalPadding + 60;
                                const y = graphHeight - (point.COP - minCOP) * yScale + topPadding;

                                return (
                                    <SvgText
                                        key={`cop-label-${index}`}
                                        x={x}
                                        y={y - 8}
                                        fontSize="10"
                                        fill="#06768D"
                                        textAnchor="middle"
                                    >
                                        {formatNumber(point.COP)}
                                    </SvgText>
                                );
                            })}

                            <Rect x={30 + horizontalPadding} y={graphHeight + topPadding + 1.5} width={graphWidth - 40} height={100} fill="white" />

                            {COPdata.map((point, index) => (
                                <SvgText
                                    key={index}
                                    x={index * xStep + 30 + horizontalPadding + 60}
                                    y={graphHeight + 20 + topPadding}
                                    fontSize="10"
                                    fill="black"
                                    textAnchor="middle"
                                >
                                    {point.hour}  {/* use hour, not time */}
                                </SvgText>

                            ))}


                        </Svg>
                        {/* X-axis label: Time */}
                        {/* <SvgText
                        x={100}
                        y={-graphHeight}
                        fontSize="12"
                        fill="black"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        Time
                    </SvgText>
                 */}

                        <Text style={styles.xAxisLabel}>
                            Time
                        </Text>

                    </ScrollView>
                </View>
            </View>
    );
};

export default TCOPGraph;

const styles = StyleSheet.create({

    title: {
        marginTop: 25,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#045cc8',
    },
    tableContainer: {
        paddingHorizontal:15,
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
        borderRadius: 10,
        // overflow: 'hidden',
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        zIndex: 2,
        borderWidth: 1,
        marginBottom: 100,
        borderColor: '#0099ff',
    },

    container: {
        paddingTop: 10,
        paddingBottom: 0,
        position: 'relative',
    },
    xAxisLabel: {
        position: 'absolute',
        bottom: 30,
        elevation: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
        zIndex: 1000,
    },



});
