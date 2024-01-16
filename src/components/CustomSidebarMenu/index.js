import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import JournyIcon from '../../assets/images/journy.png';
import LogoutIcon from '../../assets/images/Logout.png';
import TimeIcon from '../../assets/images/TimeCircle.png';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonPopup from '../../components/CommonPopup';
import * as loginActions from '../../redux/action/loginActions';
import { baseUrl, msgServer } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import Loader from '../loader';
const CustomSidebarMenu = (props) => {
  const [state, setState] = useState({ profileData: [], imageLoading: true });
  const dispatch = useDispatch();
  const [modal2, setModal2] = useState(false);

  const profileData = useSelector((state) => state.ProfileReducer.profileData);

  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  useEffect(() => {
    if (profileData.length) {
      setState({ ...state, profileData: profileData });
    }
  }, [profileData]);

  const clearAll = async () => {
    try {
      const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
      let item = JSON.parse(ReleaseNotes);
      // await AsyncStorage.clear();
      await AsyncStorage.removeItem('userToken');
      if (item) {
        await AsyncStorage.setItem(
          'ReleaseNotes',
          JSON.stringify({
            item: item,
          }),
        );
      }
    } catch (e) {
      // console.log('AsyncStorage clearAll Error: ' + e.message);
    }
  };

  const logout = async () => {
    setModal2(false);
    // const fcmToken = await AsyncStorage.getItem('fcmToken');
    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userId: userProfileData[0].id.toString(),
    //     token: fcmToken,
    //   }),
    // };

    // fetch(`${msgServer}logout`, requestOptions)
    //   .then(response => response.json())
    //   .then(data => console.log('regestration', data));
    // const userID = await AsyncStorage.getItem('userid');
    // const url = `${baseUrl}/api/user_registration?user_id=${userID}&registration_id=null`;
    // let secretUrl = await EncryptUrl(url, true);
    // fetch(secretUrl, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: 'Bearer ' + accessToken,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    // })
    //   .then(async response => {
    //     dispatch(loginActions.storeUserToken(null));
    //     dispatch(loginActions.emptyLoginData());
    //     dispatch({ type: 'logout-action', payload: null });
    //     await AsyncStorage.removeItem('userToken');
    //   })
    //   .catch(async e => {
    //     dispatch(loginActions.storeUserToken(null));
    //     dispatch(loginActions.emptyLoginData());
    //     dispatch({ type: 'logout-action', payload: null });
    //   });

    dispatch(loginActions.storeUserToken(null));
    dispatch(loginActions.emptyLoginData());
    dispatch({ type: 'logout-action', payload: null });
    dispatch({
      type: 'ITSM_TOKEN',
      value: null,
    });
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('ITSMTOKEN');
    await clearAll();
  };

  return isLoading ? (
    <Loader />
  ) : (
    <ImageBackground
      source={require('../../assets/images/sidebg.png')}
      style={styles.container}
    >
      <View>
        {userProfileData[0] ? (
          <View style={styles.subContainer}>
            <View style={{ width: '100%', paddingLeft: wp('2%') }}>
              <TouchableOpacity
                style={{
                  width: '15%',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => props.navigation.toggleDrawer()}
              >
                <Icon3 name="angle-left" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Profile', {
                  profileData: userProfileData[0],
                  comeFfrom: 'loogeduser',
                });
                props.navigation.closeDrawer();
              }}
              style={{ alignItems: 'center' }}
            >
              {userProfileData.length ? (
                userProfileData[0].image ? (
                  <FastImage
                    source={{
                      uri: `data:image/jpeg;base64,${userProfileData[0].image}`,
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: 'white',
                    }}
                    resizeMode="cover"
                    onError={() => setState({ ...state, imageLoading: false })}
                  />
                ) : (
                  <FastImage
                    source={require('../../assets/images/user.png')}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: 'white',
                    }}
                    resizeMode="cover"
                  />
                )
              ) : (
                <FastImage
                  source={require('../../assets/images/user.png')}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                  }}
                  resizeMode="cover"
                />
              )}
              <View
                style={[
                  AppStyle.employeeStatus,
                  {
                    marginTop: 10,
                    paddingHorizontal: 25,
                    backgroundColor:
                      userProfileData[0].attendance_state === 'onduty'
                        ? '#d2f7f1'
                        : userProfileData[0].attendance_state === 'holidays'
                        ? '#ffe9e9'
                        : userProfileData[0].attendance_state === 'deputation'
                        ? '#ffeed3'
                        : userProfileData[0].attendance_state === 'training'
                        ? '#e9f4f8'
                        : userProfileData[0].attendance_state ===
                          'distance_work'
                        ? '#ebffd8'
                        : userProfileData[0].attendance_state === 'absence'
                        ? '#ffe9e9'
                        : userProfileData[0].attendance_state ===
                          'authorization'
                        ? '#ffe9e9'
                        : '',
                  },
                ]}
              >
                <Text
                  style={[AppStyle.h3, styles.textStyleThree]}
                  numberOfLines={1}
                >
                  {userProfileData[0].attendance_state === 'onduty'
                    ? 'متواجد'
                    : userProfileData[0].attendance_state === 'holidays'
                    ? 'اجازة'
                    : userProfileData[0].attendance_state === 'deputation'
                    ? 'انتداب'
                    : userProfileData[0].attendance_state === 'training'
                    ? 'تدريب'
                    : userProfileData[0].attendance_state === 'distance_work'
                    ? 'عمل عن بعد'
                    : userProfileData[0].attendance_state === 'absence'
                    ? 'غياب'
                    : userProfileData[0].attendance_state === 'authorization'
                    ? 'استئذان'
                    : ''}
                </Text>
              </View>
              {userProfileData.length ? (
                <Text style={[styles.textStyle, { fontSize: 16 }]}>
                  {userProfileData[0].complete_name}
                </Text>
              ) : null}
              <Text style={styles.textStyle}>
                {userProfileData ? userProfileData[0].job_id[1] : '-'}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#26A5AC',
                borderBottomWidth: 0.5,
                width: wp('65%'),
                paddingVertical: 8,
                marginBottom: 8,
              }}
            />
          </View>
        ) : (
          <View />
        )}
        <View style={{ alignItems: 'flex-end', marginRight: wp('6%') }}>
          <TouchableOpacity
            style={styles.itemsView}
            onPress={() => {
              props.navigation.navigate('AttendanceList');
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.textStyletwo}>الحضور والانصراف</Text>
            <FastImage
              source={TimeIcon}
              style={styles.icons}
              resizeMode="contain"
              tintColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemsView}
            onPress={() => {
              props.navigation.navigate('EmployeJourny');
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.textStyletwo}>رحلة الموظف</Text>
            <FastImage
              source={JournyIcon}
              style={styles.icons}
              resizeMode="contain"
              tintColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemsView}
            onPress={() => {
              props.navigation.navigate('QuestForm');
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.textStyletwo}>الاستبيانات </Text>
            <Icon
              name="wallet-giftcard"
              size={25}
              color="white"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.itemsView}
            onPress={() => {
              props.navigation.navigate('QuestBank');
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.textStyletwo}>بنك الأفكار </Text>
            <Icon2
              name="lightbulb-on-outline"
              size={25}
              color="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModal2(true)}>
            <View style={styles.itemsView}>
              <Text style={styles.textStyletwo}>تسجيل خروج</Text>
              <FastImage
                source={LogoutIcon}
                style={styles.icons}
                resizeMode="contain"
                tintColor="white"
              />
            </View>
          </TouchableOpacity>
        </View>
        <CommonPopup
          visible={modal2}
          text={'انت على وشك تسجيل الخروج، هل انت متأكد؟'}
          onClose={() => {
            if (!modal2) {
              return;
            }
            logout();
          }}
          onCancel={() => {
            setModal2(false);
          }}
        />
      </View>
      <View
        style={{ padding: 16, flexDirection: 'row', justifyContent: 'center' }}
      >
        <Text style={{ color: '#d1dfea' }}>v 1.0.94</Text>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  textStyle: {
    color: 'white',
    paddingVertical: hp('0.5%'),
    fontFamily: '29LTAzer-Regular',
  },
  textStyletwo: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    paddingRight: 5,
    fontFamily: '29LTAzer-Regular',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  iconStyle: {
    paddingLeft: wp('2%'),
  },
  itemsView: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'center',
    paddingTop: hp('1%'),
  },
  icons: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  textStyleThree: {
    color: '#7b9eb8',
    fontFamily: '29LTAzer-Regular',
    fontSize: 12,
  },
});
export default CustomSidebarMenu;

class ImageBackground extends Component {
  render() {
    const { children, style = {}, imageStyle, imageRef, ...props } = this.props;

    return (
      <View style={style} ref={this._captureRef}>
        <FastImage
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              width: style.width,
              height: style.height,
            },
            imageStyle,
          ]}
        />
        {children}
      </View>
    );
  }
}
