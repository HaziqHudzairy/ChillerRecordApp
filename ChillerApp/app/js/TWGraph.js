import React from 'react';
import { conclusionCalculationTable } from './conclusionCalculationTable.js';
import { View, ScrollView, Dimensions, StyleSheet, Text, Platform } from 'react-native';
import Svg, { Line, Text as SvgText, Circle, Path, Rect } from 'react-native-svg';

const TWGraph = ({ data }) => {

    const formatNumber = (value) => {
        return (typeof value === 'number' && !isNaN(value)) ? value.toFixed(2) : '-';
    };

    const resultData = (data || []).map(({ hour, state1H, state2H, state2sH, state3H, state4H }) => {
        const results = conclusionCalculationTable(state1H, state2H, state2sH, state3H, state4H);
        return { hour, ...results };
    });

    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 20;
    const graphHeight = 300;
    const topPadding = 20;
    const svgHeight = graphHeight + 25 + topPadding;
    const graphWidth = resultData.length * 60 + 70;

    const validWcData = resultData.filter(d => typeof d.Wc === 'number' && !isNaN(d.Wc));
    const validWcsData = resultData.filter(d => typeof d.Wcs === 'number' && !isNaN(d.Wcs));

    // Adjust the following based on the range of Wc values
    const minWc = 10;
    const maxWc = 25;
    const yScale = graphHeight / (maxWc - minWc);
    const xStep = 60;



    const linePath = validWcData
        .map((point, index) => {
            const x = index * xStep + 30 + horizontalPadding + 60;
            const y = graphHeight - (point.Wc - minWc) * yScale + topPadding;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');

    const linePathWcs = validWcsData
        .map((point, index) => {
            const x = index * xStep + 30 + horizontalPadding + 60;
            const y = graphHeight - (point.Wcs - minWc) * yScale + topPadding;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');

    const yAxisLabels = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];


    return (
        <View style={styles.tableContainer}>
            <Text style={styles.title}>Work Compressor vs Time Graph</Text>
            <View style={styles.container}>

                <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                          <View style={[styles.legendBox, { backgroundColor: '#e76f51' }]} />
                          <Text style={styles.legendLabel}>W2a</Text>
                        </View>
                        <View style={styles.legendItem}>
                          <View style={[styles.legendBox, { backgroundColor: '#06768D' }]} />
                          <Text style={styles.legendLabel}>W2s</Text>
                        </View>
                      </View>

                <ScrollView horizontal contentContainerStyle={{ width: graphWidth + 40, paddingBottom: 60, position: 'relative' }}>
                    <Svg height={svgHeight} width={graphWidth + 10}>
                        <Rect x={30 + horizontalPadding} y="20" width={graphWidth + 30} height={graphHeight} fill="#f4faff" />

                        {yAxisLabels.map((value, index) => {
                            const y = graphHeight - (value - minWc) * yScale + topPadding;
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

                        {[...resultData, {}].map((point, index) => {
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

                        {/* Y-axis label: Wc */}
                        <SvgText
                            x={-15}
                            y={graphHeight / 2 + topPadding}
                            transform={`rotate(-90, 0, ${graphHeight / 2})`}
                            fontSize="12"
                            fill="black"
                            fontWeight="bold"
                            textAnchor="middle"
                        >
                            Work of Compressor (Wc)
                        </SvgText>

                        <Line x1={30 + horizontalPadding} y1="10" x2={30 + horizontalPadding} y2={graphHeight + topPadding} stroke="black" strokeWidth="2" />
                        <Line x1={30 + horizontalPadding} y1={graphHeight + topPadding} x2={graphWidth + 10} y2={graphHeight + topPadding} stroke="black" strokeWidth="2" />

                        {yAxisLabels.map((value, index) => {
                            const y = graphHeight - (value - minWc) * yScale + topPadding;
                            return (
                                <SvgText key={index} x={10 + horizontalPadding} y={y + 4} fontSize="10" fill="black">
                                    {value}
                                </SvgText>
                            );
                        })}

                        <Path d={linePath} fill="none" stroke="#06768D" strokeWidth="2" />

                        {resultData.map((point, index) => {
                            const x = index * xStep + 30 + 60 + horizontalPadding;
                            const y = graphHeight - (point.Wc - minWc) * yScale + topPadding;
                            return <Circle key={index} cx={x} cy={y} r="3" fill="#06768D" />;
                        })}

                        <Path d={linePathWcs} fill="none" stroke="#e76f51" strokeWidth="2" />

                        {validWcsData.map((point, index) => {
                            const x = index * xStep + 30 + horizontalPadding + 60;
                            const y = graphHeight - (point.Wcs - minWc) * yScale + topPadding;
                            return <Circle key={`wcs-${index}`} cx={x} cy={y} r="3" fill="#e76f51" />;
                        })}


                        {validWcData.map((point, index) => {
                            const x = index * xStep + 30 + horizontalPadding + 60;
                            const y = graphHeight - (point.Wc - minWc) * yScale + topPadding;
                            return (
                                <SvgText
                                    key={`wc-label-${index}`}
                                    x={x}
                                    y={y - 8}
                                    fontSize="10"
                                    fill="#06768D"
                                    textAnchor="middle"
                                >
                                    {formatNumber(point.Wc)}
                                </SvgText>
                            );
                        })}

                        {validWcsData.map((point, index) => {
                            const x = index * xStep + 30 + horizontalPadding + 60;
                            const y = graphHeight - (point.Wcs - minWc) * yScale + topPadding;
                            return (
                                <SvgText
                                    key={`wcs-label-${index}`}
                                    x={x}
                                    y={y - 8}
                                    fontSize="10"
                                    fill="#e76f51"
                                    textAnchor="middle"
                                >
                                    {formatNumber(point.Wcs)}
                                </SvgText>
                            );
                        })}


                        <Rect x={30 + horizontalPadding} y={graphHeight + topPadding + 1.5} width={graphWidth - 40} height={100} fill="white" />

                        {resultData.map((point, index) => (
                            <SvgText
                                key={index}
                                x={index * xStep + 30 + horizontalPadding + 60}
                                y={graphHeight + 20 + topPadding}
                                fontSize="10"
                                fill="black"
                                textAnchor="middle"
                            >
                                {point.hour}
                            </SvgText>
                        ))}
                    </Svg>

                    <Text style={styles.xAxisLabel}>
                        Time
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
};

export default TWGraph;

const styles = StyleSheet.create({
    title: {
        marginTop: 25,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#045cc8',
    },
    tableContainer: {
        paddingHorizontal: 15,
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

    legendContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    gap: 20,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

    legendBox: {
    width: 16,
    height: 16,
    marginRight: 5,
    borderRadius: 2,
  },

  legendLabel: {
    fontSize: 14,
    color: 'black',
  },
});
