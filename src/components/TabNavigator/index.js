import React, { useEffect, useState } from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';

import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export default React.memo(
  ({
    label1 = 'label one',
    label2 = 'label two',
    onNavChange = () => {},
    baseColor = '#5399E6',
    paddingVertical = 10,
    active = null,
    index,
  }) => {
    const [activeTab, setActiveTab] = useState(index ? index : 0);
    function handleCHage(v) {
      'worklet';
      runOnJS(onNavChange)(v);
    }

    useEffect(() => {
      if (active != null) {
        setActiveTab(active);
        offset.value = active;
      }
    }, [active]);

    const styles = StyleSheet.create({
      wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '85%',
        // borderRadius: 8,
      },
      btnNav: {
        flex: 1,
        alignItems: 'center',
        // flexDirection: 'row',
        // borderRadius,
        paddingVertical,
        justifyContent: 'center',
      },
      label: {
        color: 'white',
        fontSize: hp('2%'),
        fontFamily: '29LTAzer-Medium',
      },
      line: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
      },
    });
    const offset = useSharedValue(0);

    const firstNavTabStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: offset.value == 1 ? baseColor : '#fff',
      };
    });
    const firstNavTabTextStyle = useAnimatedStyle(() => {
      return {
        color: offset.value == 1 ? 'white' : baseColor,
      };
    });

    const secondNavTabStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: offset.value == 0 ? baseColor : '#fff',
      };
    });
    const secondNavTabTextStyle = useAnimatedStyle(() => {
      return {
        color: offset.value == 0 ? 'white' : baseColor,
      };
    });
    return (
      <>
        <Animated.View style={styles.wrapper}>
          <TapGestureHandler
            onGestureEvent={useAnimatedGestureHandler({
              onActive: () => {
                runOnJS(setActiveTab)(1);
                offset.value = 1;
                //
              },
              onEnd: () => {
                handleCHage(offset.value);
              },
            })}
          >
            {/* backgroundColor: offset.value == 1 ? baseColor : '#fff' */}
            <Animated.View style={[styles.btnNav, { backgroundColor: '#fff' }]}>
              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: activeTab == 0 ? '#A9A9A9' : baseColor,
                  },
                ]}
              >
                {label1}
              </Animated.Text>
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: activeTab === 0 ? '#A9A9A9' : baseColor,
                    height: activeTab === 0 ? 1 : 4,
                  },
                ]}
              />
            </Animated.View>
          </TapGestureHandler>

          <TapGestureHandler
            onGestureEvent={useAnimatedGestureHandler({
              onActive: () => {
                offset.value = 0;
                runOnJS(setActiveTab)(0);

                //
              },

              onEnd: () => {
                handleCHage(offset.value);
              },
            })}
          >
            {/* backgroundColor: offset.value == 0 ? baseColor : '#fff' */}
            <Animated.View style={[styles.btnNav, { backgroundColor: '#fff' }]}>
              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: activeTab === 1 ? '#A9A9A9' : baseColor,
                  },
                ]}
              >
                {label2}
              </Animated.Text>
              <Animated.View
                style={[
                  styles.line,
                  {
                    backgroundColor: activeTab === 1 ? '#A9A9A9' : baseColor,
                    height: activeTab === 1 ? 1 : 4,
                  },
                ]}
              />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </>
    );
  },
);
