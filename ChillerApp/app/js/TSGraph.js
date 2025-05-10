import React, { useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Svg, { Line, Text as SvgText, Path, G, Rect, Polygon } from 'react-native-svg';
import tableData from '../json/graph_plot.json';

const { width: screenWidth } = Dimensions.get('window');

const yScaleFactor = 0.6;
const graphPaddingTop = 20;
const paddingLeft = 60;
const paddingRight = 20;

const normalize = (value, min, max, scaleMin, scaleMax) => {
  return scaleMin + ((value - min) * (scaleMax - scaleMin)) / (max - min);
};

const TSGraphSVG = ({ xValuesState1, yValuesState1, xValuesState2, yValuesState2, xValuesState2s, yValuesState2s, xValuesState3, yValuesState3, xValuesState4, yValuesState4 }) => {

  const shouldDrawLine = xValuesState1.length > 0 && xValuesState2.length > 1 && xValuesState1[0] > xValuesState2[0];


  // console.log('xValuesState1:', xValuesState1);
  // console.log('yValuesState1:', yValuesState1);
  // console.log('xValuesState2:', xValuesState2);
  // console.log('yValuesState2:', yValuesState2);
  // console.log('xValuesState2s:', xValuesState2s);
  // console.log('yValuesState2s:', yValuesState2s);
  // console.log('xValuesState3:', xValuesState3);
  // console.log('yValuesState3:', yValuesState3);
  // console.log('xValuesState4:', xValuesState4);
  // console.log('yValuesState4:', yValuesState4);

  const [labelType, setLabelType] = useState('label');
  const toggleLabel = (label) => {
    setLabelType(label);
  };


  const graphWidth = screenWidth - 20 + paddingRight + 200;
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
    label: '1'
  }));

  const state2 = xValuesState2.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState2[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState2[index] : null, // Store only the first temperature value
    label: '2'
  }));

  const state2s = xValuesState2s.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState2s[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState2s[index] : null, // Store only the first temperature value
    label: '2s'
  }));

  const state3 = xValuesState3.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState3[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState3[index] : null, // Store only the first temperature value
    label: '3'
  }));

  const state4 = xValuesState4.map((xValue, index) => ({
    x: paddingLeft + normalize(xValue, entropyMin, entropyMax, 0, graphWidth - paddingLeft),
    y: graphPaddingTop + (graphHeight - normalize(yValuesState4[index], tempMin, tempMax, 0, graphHeight)),
    temp: index === 0 ? yValuesState4[index] : null, // Store only the first temperature value
    label: '4'
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



  const drawArrowHead = (from, to, color = 'black') => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const size = 6;

    const arrowPoint1 = {
      x: to.x - size * Math.cos(angle - Math.PI / 6),
      y: to.y - size * Math.sin(angle - Math.PI / 6),
    };

    const arrowPoint2 = {
      x: to.x - size * Math.cos(angle + Math.PI / 6),
      y: to.y - size * Math.sin(angle + Math.PI / 6),
    };

    return (
      <Polygon
        points={`${to.x},${to.y} ${arrowPoint1.x},${arrowPoint1.y} ${arrowPoint2.x},${arrowPoint2.y}`}
        fill={color}
      />
    );
  };

  return (
    <View style={styles.BigView}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => toggleLabel('label')}>
          <View style={[styles.buttonContainer, labelType === 'label' ? styles.buttonActive : styles.buttonInactive]}>
            <Text style={styles.buttonText}>View State</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleLabel('t')}>
          <View style={[styles.buttonContainer, labelType === 't' ? styles.buttonActive : styles.buttonInactive]}>
            <Text style={styles.buttonText}>View T (°C)</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: 'blue' }]} />
          <Text style={styles.legendLabel}>s Liq</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: 'orange' }]} />
          <Text style={styles.legendLabel}>s Vap</Text>
        </View>
      </View>

      <ScrollView horizontal style={{ borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingTop: 50, paddingBottom: 40 }}>


        <View style={{ padding: 20 }}>

          <View style={{ position: 'relative', padding: 10 }}>
            <Svg width={graphWidth} height={fullHeight + 40}>
              <G>
                {/* Background */}
                <Rect x="60" y="20" width={graphWidth - paddingLeft} height={fullHeight - graphPaddingTop} fill="#f4faff" />

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
                {state1.length >= 2 && drawArrowHead(state1[state1.length - 2], state1[state1.length - 1], 'lightblue')}
                <Path d={toPath(state2)} stroke="red" strokeWidth="2" fill="none" />
                {state2.length >= 2 && drawArrowHead(state2[state2.length - 2], state2[state2.length - 1], 'red')}
                <Path d={toPath(state2s)} stroke="grey" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                {state2s.length >= 2 && drawArrowHead(state2s[state2s.length - 2], state2s[state2s.length - 1], 'grey')}
                <Path d={toPath(state3)} stroke="green" strokeWidth="2" fill="none" />
                {state3.length >= 2 && drawArrowHead(state3[state3.length - 2], state3[state3.length - 1], 'green')}
                <Path d={toPath(state4)} stroke="purple" strokeWidth="2" fill="none" />

                {shouldDrawLine && (
                  <Line
                    x1={state1[0].x}
                    y1={state1[0].y}
                    x2={state2[1].x}
                    y2={state2[1].y}
                    stroke="grey"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                )}



                {state1.map((point, index) => (
                  index === 0 && (
                    <SvgText key={`state1-label-${index}`} x={point.x + 15} y={point.y} fontSize="12" fill="grey" textAnchor="middle">
                      {labelType === 'label' ? point.label : point.temp}
                    </SvgText>
                  )
                ))}
                {state2.map((point, index) => (
                  index === 0 && (
                    <SvgText key={`state2-label-${index}`} x={point.x} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                      {labelType === 'label' ? point.label : point.temp}
                    </SvgText>
                  )
                ))}
                {state2s.map((point, index) => (
                  index === 0 && (
                    <SvgText key={`state2s-label-${index}`} x={point.x - 5} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                      {labelType === 'label' ? point.label : point.temp}
                    </SvgText>
                  )
                ))}
                {state3.map((point, index) => (
                  index === 0 && (
                    <SvgText key={`state3-label-${index}`} x={point.x - 15} y={point.y - 5} fontSize="12" fill="grey" textAnchor="middle">
                      {labelType === 'label' ? point.label : point.temp}
                    </SvgText>
                  )
                ))}
                {state4.map((point, index) => (
                  index === 0 && (
                    <SvgText key={`state4-label-${index}`} x={point.x - 15} y={point.y} fontSize="12" fill="grey" textAnchor="middle">
                      {labelType === 'label' ? point.label : point.temp}
                    </SvgText>
                  )
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
    </View>
  );
};

const styles = StyleSheet.create({
  BigView: {
    marginTop: -80,

  },
  toggleContainer: {
    top: 470,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    zIndex: 1,
  },
  buttonContainer: {
    top: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: '#0072ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 150,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
  },

  buttonInactive: {
    backgroundColor: '#89d0ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 150,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 14,
    color: 'black',
  },
  legendContainer: {
    position: 'absolute',
    top: 145,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    gap: 20, // Optional: space between the items
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

export default TSGraphSVG;
