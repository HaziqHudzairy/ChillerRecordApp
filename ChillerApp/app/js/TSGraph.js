import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Svg, { Line, Text as SvgText, Path, G, Rect } from 'react-native-svg';
import tableData from '../json/graph_plot.json';

const { width: screenWidth } = Dimensions.get('window');

const yScaleFactor = 0.6;
const graphPaddingTop = 20;
const paddingLeft = 60;
const paddingRight = 20;

const normalize = (value, min, max, scaleMin, scaleMax) => {
  return scaleMin + ((value - min) * (scaleMax - scaleMin)) / (max - min);
};

const TSGraphSVG = ({ xValuesState1, yValuesState1, xValuesState2, yValuesState2, xValuesState3, yValuesState3, xValuesState4, yValuesState4 }) => {
  const graphWidth = screenWidth - 20 + paddingRight;
  const graphHeight = 300;
  const fullHeight = graphHeight + graphPaddingTop;

  const entropyMin = 0;
  const entropyMax = 1.2;
  const tempMin = -60;
  const tempMax = 120;

  const state1 = xValuesState1.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState1[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState1[index] : null, // Store only the first temperature value
  }));
  
  const state2 = xValuesState2.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState2[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState2[index] : null, // Store only the first temperature value
  }));
  
  const state3 = xValuesState3.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState3[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState3[index] : null, // Store only the first temperature value
  }));
  
  const state4 = xValuesState4.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState4[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState4[index] : null, // Store only the first temperature value
  }));
  

  const sLiqPoints = tableData.map(entry => ({
    x: paddingLeft + normalize(entry['S-Liq'], entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + normalize(tempMax - entry.temperature, 0, tempMax - tempMin, 0, graphHeight),
  }));
  const sVapPoints = tableData.map(entry => ({
    x: paddingLeft + normalize(entry['S-Vap'], entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + normalize(tempMax - entry.temperature, 0, tempMax - tempMin, 0, graphHeight),
  }));

  const toPath = (points) =>
    points.reduce((acc, point, i) => (i === 0 ? `M${point.x},${point.y}` : `${acc} L${point.x},${point.y}`), '');

  const getXLabel = (value) =>
    paddingLeft + normalize(value, entropyMin, entropyMax, 0, graphWidth - paddingLeft);

  const getYLabel = (value) =>
    graphPaddingTop + normalize(tempMax - value, 0, tempMax - tempMin, 0, graphHeight);

  return (
    <ScrollView horizontal>
      <View style={{ padding: 20 }}>

        <View style={{ position: 'relative', padding: 10 }}>
          <Svg width={graphWidth} height={fullHeight + 40}>
            <G>
              {/* Background */}
              <Rect x="60" y="20" width={graphWidth -paddingLeft } height={fullHeight - graphPaddingTop} fill="#f0f0f0" />

              {/* Axes */}
              <Line x1={paddingLeft} y1={graphPaddingTop} x2={paddingLeft} y2={graphHeight + graphPaddingTop} stroke="black" />
              <Line x1={paddingLeft} y1={graphHeight + graphPaddingTop} x2={graphWidth} y2={graphHeight + graphPaddingTop} stroke="black" />

              {/* Y-axis ticks, labels, and grid lines */}
              {Array.from({ length: 10 }).map((_, i) => {
                const temp = tempMax - i * 20;
                const y = getYLabel(temp);
                return (
                  <React.Fragment key={`y-${i}`}>
                    <Line x1={paddingLeft - 5} y1={y} x2={paddingLeft} y2={y} stroke="black" />
                    <SvgText x={paddingLeft - 10} y={y + 4} fontSize="12" fill="black" textAnchor="end">
                      {temp}
                    </SvgText>
                    <Line x1={paddingLeft} y1={y} x2={graphWidth} y2={y} stroke="#ccc" strokeDasharray="4 2" />
                  </React.Fragment>
                );
              })}

              {/* X-axis ticks, labels, and grid lines */}
              {Array.from({ length: 7 }).map((_, i) => {
                const entropy = entropyMin + i * 0.2;
                const x = getXLabel(entropy);
                return (
                  <React.Fragment key={`x-${i}`}>
                    <Line x1={x} y1={graphHeight + graphPaddingTop} x2={x} y2={graphHeight + graphPaddingTop + 5} stroke="black" />
                    <SvgText
                      x={x}
                      y={graphHeight + graphPaddingTop + 20}
                      fontSize="12"
                      fill="black"
                      textAnchor={i === 6 ? 'end' : 'middle'}
                    >
                      {entropy.toFixed(1)}
                    </SvgText>
                    <Line x1={x} y1={graphPaddingTop} x2={x} y2={graphHeight + graphPaddingTop} stroke="#ccc" strokeDasharray="4 2" />
                  </React.Fragment>
                );
              })}

              {/* Curves */}
              <Path d={toPath(sLiqPoints)} stroke="blue" strokeWidth="2" fill="none" />
              <Path d={toPath(sVapPoints)} stroke="orange" strokeWidth="2" fill="none" />
              <Path d={toPath(state1)} stroke="lightblue" strokeWidth="2" fill="none" />
              <Path d={toPath(state2)} stroke="red" strokeWidth="2" fill="none" />
              <Path d={toPath(state3)} stroke="green" strokeWidth="2" fill="none" />
              <Path d={toPath(state4)} stroke="purple" strokeWidth="2" fill="none" />
              
              {/* Add temperature labels */}
              {state1.map((point, index) => (
                <SvgText key={`state1-temp-${index}`} x={point.x + 15} y={point.y -5} fontSize="12" fill="grey" textAnchor="middle">
                  {point.temp}
                </SvgText>
              ))}
              {state2.map((point, index) => (
                <SvgText key={`state2-temp-${index}`} x={point.x} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                  {point.temp}
                </SvgText>
              ))}
              {state3.map((point, index) => (
                <SvgText key={`state3-temp-${index}`} x={point.x -15} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                  {point.temp}
                </SvgText>
              ))}
              {state4.map((point, index) => (
                <SvgText key={`state4-temp-${index}`}  x={point.x - 15} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                  {point.temp}
                </SvgText>
              ))}
            </G>
          </Svg>

          {/* Axis Labels */}
          <Text
            style={[
              styles.axisLabel,
              {
                top: fullHeight + 30,
                left: paddingLeft + (graphWidth - paddingLeft) / 2 - 50,
              },
            ]}
          >
            S (kJ/kg.K)
          </Text>

          <Text
            style={[
              styles.axisLabel,
              {
                position: 'absolute',
                top: fullHeight / 2 - 40,
                left: 0,
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          >
            T (°C)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  axisLabel: {
    position: 'absolute',
    fontSize: 14,
    color: 'black',
  },
});

export default TSGraphSVG;
