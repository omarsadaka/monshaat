import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Alert,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import CombinedIcon from '../../assets/images/announcement_white.png';
import calendarIcon from '../../assets/images/Calendar.png';
import chatIcon from '../../assets/images/Chat.png';
import HomeIcon from '../../assets/images/Home.png';
import SearchIcon from '../../assets/images/Search.png';
import ProfileIcon from '../../assets/images/user2.png';
import SearchIcon2 from '../../assets/images/users2.png';

import { showMessage } from 'react-native-flash-message';
import CommonPopup from '../CommonPopup';
// const NavItems = [
//   { title: 'الملف الشخصي', icon: ProfileIcon, to: 'Profile' },
//   { title: 'المحادثات', icon: chatIcon, to: 'Chat' },
//   { title: 'الرئيسية', icon: HomeIcon, to: 'Home' },
//   { title: 'دليل الموظفين', icon: SearchIcon2, to: 'Search' },
//   { title: 'التقويم', icon: calendarIcon, to: 'Calendar' },
// ];
const NavItems = [
  { title: 'دليل الموظفين', icon: SearchIcon2, to: 'Search' },
  { title: 'الملف الشخصي', icon: ProfileIcon, to: 'Profile' },
  { title: 'الرئيسية', icon: HomeIcon, to: 'Home' },
  { title: 'التقويم', icon: calendarIcon, to: 'Calendar' },
  { title: 'المحادثات', icon: chatIcon, to: 'Chat' },
];

const defaultPadding = 3;
const BarHeight = Dimensions.get('window').height / 17;
const BarWidth = Dimensions.get('window').width * 0.32;

const ImageSize = 22;

const NavItemStyle = {
  borderRadius: 30,
  padding: defaultPadding,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.02,
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  activeNavItem: {
    ...NavItemStyle,
    backgroundColor: 'red',
  },
  notActiveNavItem: {
    ...NavItemStyle,
  },
  labelStyle: {
    paddingRight: 5,
    color: '#1F9AAF',
    fontFamily: '29LTAzer-Medium',
    fontWeight: '500',
    fontSize: Dimensions.get('window').width * 0.035,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  buttonContainer: {
    backgroundColor: '#007598',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
  },
  hr: {
    height: 1,
    width: '50%',
    alignSelf: 'flex-end',
    backgroundColor: '#007598',
    marginTop: -15,
    marginBottom: 20,
  },
});

const BootomTabsNavigation = ({ navigation, unViewdCount }) => {
  const [isConnected, setIsConnected] = useState(true);
  const activeIndex = useSharedValue(2);
  const nav = useSelector((state) => state.NavigateTo.navigeteTo);
  useEffect(() => {
    console.log('nav', nav);
    if (nav.index !== 2) {
      navigation.navigate(NavItems[nav.index].to, nav);
      activeIndex.value = nav.index;
    }
    // setTimeout(() => {
    //   store.dispatch({ type: 'reset-navigate-to' });
    // }, 1000);
  }, [activeIndex.value, nav, navigation]);

  useEffect(() => {
    const backAction = () => {
      // alert(activeIndex.value);
      // alert(nav.index);
      activeIndex.value = nav.index;
      navigation.navigate(NavItems[nav.index].to, nav);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   () => true,
    // );
    // return () => backHandler.remove();
  }, [activeIndex.value, nav, navigation]);

  return (
    <Animated.View style={styles.wrapper}>
      {NavItems.map((item, i) => {
        return (
          <TapGestureHandler
            key={i}
            onGestureEvent={useAnimatedGestureHandler({
              onActive: () => {
                runOnJS(navigation.navigate)(item.to);
                activeIndex.value = i;
              },
            })}
          >
            <Animated.View
              style={[
                styles.notActiveNavItem,
                useAnimatedStyle(() => {
                  return {
                    height: BarHeight,
                    backgroundColor:
                      activeIndex.value == i ? 'rgba(207,235,239,1)' : '#fff',
                    width: withTiming(activeIndex.value == i ? BarWidth : 40, {
                      duration: 100,
                      easing: Easing.bounce,
                    }),
                  };
                }),
              ]}
            >
              <Animated.Text
                style={[
                  styles.labelStyle,
                  useAnimatedStyle(() => {
                    return {
                      opacity: activeIndex.value == i ? 1 : 0,
                      width: withTiming(
                        activeIndex.value == i ? undefined : 0,
                        {
                          duration: 100,
                          easing: Easing.bounce,
                        },
                      ),
                    };
                  }),
                ]}
              >
                {item.title}
              </Animated.Text>
              <View>
                <Animated.Image
                  source={item.icon}
                  style={[
                    {
                      width: ImageSize,
                      height: ImageSize,
                      tintColor: '#007598',
                    },
                  ]}
                  resizeMode="contain"
                />
                {i == 4 && unViewdCount > 0 && (
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 10,
                      backgroundColor: 'red',
                      marginTop: -22,
                      marginLeft: 15,
                      marginRight: -5,
                    }}
                  >
                    {/* <Text>{unViewdCount}</Text> */}
                  </View>
                )}
              </View>
            </Animated.View>
          </TapGestureHandler>
        );
      })}
    </Animated.View>
  );
};

export default React.memo(BootomTabsNavigation);
