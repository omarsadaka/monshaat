import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CommonFormButton from '../../components/CommonFormButton';
import NewHeader from '../../components/NewHeader';
import * as attendanceAction from '../../redux/action/AttendanceAction';
import * as loadingAction from '../../redux/action/loadingAction';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';

const AttendanceList = props => {
  let mToday = new Date();
  let mPastDate = new Date();

  mPastDate.setDate(mPastDate.getDate() - 1);
  mToday.setDate(mToday.getDate());
  const [date1, setDate1] = useState(mPastDate);
  const [date2, setDate2] = useState(mToday);
  const [state, setState] = useState({
    dateFrom: moment(mPastDate).format('DD/MM/YYYY'),
    dateTo: moment(mToday).format('DD/MM/YYYY'),
    dateOne: mPastDate,
    dateTwo: mToday,
    showList: false,
    allAttendanceData: [],
    userId: 0,
    visible1: false,
    visible2: false,
  });
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);

  const [isDatePickerVisibleTwo, setDatePickerVisibilitytwo] = useState(false);

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const mAttendanceList = useSelector(
    state => state.AttendanceReducer.attendanceList,
  );

  //console.log("mAttendanceList", mAttendanceList);

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Attendance_Screen');
    }
  }, [isFocused]);

  const getUserId = async () => {
    const userID = await AsyncStorage.getItem('userid');
    setState({
      ...state,
      userId: userID,
    });
  };

  useEffect(() => {
    // console.log("mAttendanceList",mAttendanceList);
    getUserId();
    if (typeof mAttendanceList === 'object' && mAttendanceList.length) {
      setState({
        ...state,
        showList: true,
        allAttendanceData: mAttendanceList,
      });
    }
  }, [mAttendanceList]);

  const onDateChange = (date, type) => {
    let a = moment(date).format('DD/MM/YYYY');
    if (date > state.dateTwo) {
      setState({
        ...state,
        dateFrom: a,
        dateTo: a,
        dateOne: date,
        dateTwo: date,
      });
      setDate1(date);
      setDate2(date);
    } else {
      setState({
        ...state,
        dateFrom: a,
        dateOne: date,
        visible1: false,
      });
      setDate1(date);
    }
  };
  const onDateChangeTwo = (date, type) => {
    let a = moment(date).format('DD/MM/YYYY');
    if (date < state.dateOne) {
      setState({
        ...state,
        dateFrom: a,
        dateTo: a,
        dateOne: date,
        dateTwo: date,
      });
      setDate1(date);
      setDate2(date);
    } else {
      setState({ ...state, dateTo: a, dateTwo: date, visible2: false });
      setDate2(date);
    }
  };

  const showDatePickerone = () => {
    setDatePickerVisibilityone(true);
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const handleConfirmone = date => {
    hideDatePickerone();
    let a = moment(date).format('DD/MM/YYYY');
    if (date > state.dateTwo) {
      setState({
        ...state,
        dateFrom: a,
        dateTo: a,
        dateOne: date,
        dateTwo: date,
      });
    } else {
      setState({ ...state, dateFrom: a, dateOne: date });
    }
  };

  const showTimePicker = () => {
    setDatePickerVisibilitytwo(true);
  };

  const hideTimePicker = () => {
    setDatePickerVisibilitytwo(false);
  };

  const handleConfirmTwo = date => {
    hideTimePicker();
    let a = moment(date).format('DD/MM/YYYY');
    if (date < state.dateOne) {
      setState({
        ...state,
        dateFrom: a,
        dateTo: a,
        dateOne: date,
        dateTwo: date,
      });
    } else {
      setState({ ...state, dateTo: a, dateTwo: date });
    }
  };
  const renderSeparator = () => (
    <View
      style={{
        backgroundColor: '#eeeeee',
        height: 0.4,
        marginTop: 3,
      }}
    />
  );

  useEffect(() => {
    getAttendanceHistory();
  }, [accessToken]);

  const getAttendanceHistory = () => {
    dispatch(loadingAction.commonLoader(true));
    let { dateFrom, dateTo } = state;
    if (dateFrom && dateTo) {
      let data = {
        dateFrom,
        dateTo,
        date1,
        date2,
      };
      // dispatch(attendanceAction.getAttendanceList(data, accessToken));
      dispatch(attendanceAction.getAttendance(data, accessToken));
    }
  };

  const renderAttendanceList = item => {
    console.log('item', item);

    if (item && item.length > 0) {
      let sign_out_time,
        sign_in_time = '--:--';
      let has_signin,
        has_signout = false;
      item.some(function(entry, i) {
        if (entry.action == 'sign_in') {
          has_signin = true;
        }
      });
      item.some(function(entry, i) {
        if (entry.action == 'sign_out') {
          has_signout = true;
        }
      });
      if (has_signin) {
        let sign_in = item[0];
        sign_in_time = moment(sign_in.name).format('HH:mm:ss');
        sign_out_time = '  --:--  ';
      }
      if (has_signout) {
        let sign_out = item[has_signin ? 1 : 0];
        sign_out_time = moment(sign_out.name).format('HH:mm:ss');
      }

      let date = moment(item[0].name).format('DD-MM-YYYY');
      return (
        <View style={styles.attendanceItemContainer}>
          <Text style={{ fontFamily: '29LTAzer-Regular', textAlign: 'center' }}>
            {sign_out_time}
          </Text>
          <Text style={{ fontFamily: '29LTAzer-Regular', textAlign: 'center' }}>
            {sign_in_time}
          </Text>
          <Text style={{ fontFamily: '29LTAzer-Regular', textAlign: 'center' }}>
            {date}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F8F8F8',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <NewHeader
          {...props}
          back={true}
          style={styles.titleFont}
          title="الحضور والانصراف"
        />

        {/* <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View style={{ width: 180, marginVertical: -16 }}>
            <CommonFormButton
              {...props}
              buttonText="تسجيل الحضور"
              onPress={() => {
                dispatch(
                  attendanceAction.attendanceCheckIn(accessToken, state.userId)
                );
              }}
            />
            <CommonFormButton
              {...props}
              buttonText="تسجيل الانصراف"
              onPress={() => {
                attendanceAction.attendanceCheckOut(accessToken, state.userId);
              }}
            />
          </View>
          {isLoading ? <Loader /> : null}
        </View> */}

        <View style={{ paddingHorizontal: 16, marginTop: -16 }}>
          <View style={styles.heading}>
            <Text style={{ fontFamily: '29LTAzer-Regular', marginTop: 18 }}>
              تاريخ البداية
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              // onPress={showDatePickerone}
              onPress={() => setState({ ...state, visible1: true })}
              style={[
                styles.dateStyle,
                {
                  borderColor: state.dateoneErr ? 'red' : '#e2e2e2',
                  alignSelf: 'center',
                  padding: 13,
                  borderRadius: 5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 58,
                },
              ]}
            >
              <Image
                style={{ height: 25, width: 25, tintColor: '#007598' }}
                source={require('./../../assets/images/Calendar.png')}
                tintColor="#007598"
              />
              <Text style={styles.dateText}>{state.dateFrom}</Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={state.visible1}
              hardwareAccelerated={true}
            >
              <TouchableWithoutFeedback
                onPress={() => setState({ ...state, visible1: false })}
              >
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    alignSelf: 'center',
                    padding: 10,
                    borderRadius: 15,
                    // backgroundColor: "white",
                    backgroundColor: 'rgba(0, 117,152, 0.97)',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    position: 'absolute',

                    // top: 262
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      top: 220,
                    }}
                  >
                    <CalendarPicker
                      // startFromSunday={true}
                      maxDate={new Date()}
                      weekdays={[
                        'الأحد',
                        'الأثنين',
                        'الثلاثاء',
                        'الاربعاء',
                        'الخميس',
                        'الجمعة',
                        'السبت',
                      ]}
                      months={[
                        'يناير',
                        'فبراير',
                        'مارس',
                        'ابريل',
                        'مايو',
                        'يونيو',
                        'يوليو',
                        'اغسطس',
                        'سبتمبر',
                        'اكتوبر',
                        'نوفمبر',
                        'ديسمبر',
                      ]}
                      previousTitle="السابق"
                      nextTitle="التالي"
                      todayBackgroundColor="#e6ffe6"
                      selectedDayColor="#66ff33"
                      selectedDayTextColor="#000000"
                      // scaleFactor={375}
                      textStyle={{
                        fontFamily: '29LTAzer-Regular',
                        color: '#000000',
                      }}
                      // scrollable={true}
                      // horizontal={true}
                      // enableDateChange={true}
                      onDateChange={onDateChange}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
          <View style={styles.heading}>
            <Text style={{ fontFamily: '29LTAzer-Regular' }}>
              تاريخ النهاية
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              onPress={() => setState({ ...state, visible2: true })}
              style={[
                styles.dateStyle,
                {
                  borderColor: state.dateoneErr ? 'red' : '#e2e2e2',
                  alignSelf: 'center',
                  padding: 13,
                  borderRadius: 5,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 58,
                },
              ]}
            >
              <Image
                style={{ height: 25, width: 25, tintColor: '#007598' }}
                source={require('./../../assets/images/Calendar.png')}
                tintColor="#007598"
              />
              <Text style={styles.dateText}>{state.dateTo}</Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              visible={state.visible2}
              hardwareAccelerated={true}
            >
              <TouchableWithoutFeedback
                onPress={() => setState({ ...state, visible2: false })}
              >
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    alignSelf: 'center',
                    padding: 10,
                    borderRadius: 15,
                    // backgroundColor: "white",
                    backgroundColor: 'rgba(0, 117,152, 0.97)',

                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    position: 'absolute',

                    // top: 262
                  }}
                >
                  <View style={{ width: '100%', height: '100%', top: 220 }}>
                    <CalendarPicker
                      // startFromSunday={true}
                      // allowRangeSelection={true}
                      maxDate={mToday}
                      // maxDate={new Date(2050, 6, 3)}
                      weekdays={[
                        'الأحد',
                        'الأثنين',
                        'الثلاثاء',
                        'الاربعاء',
                        'الخميس',
                        'الجمعة',
                        'السبت',
                      ]}
                      months={[
                        'يناير',
                        'فبراير',
                        'مارس',
                        'ابريل',
                        'مايو',
                        'يونيو',
                        'يوليو',
                        'اغسطس',
                        'سبتمبر',
                        'اكتوبر',
                        'نوفمبر',
                        'ديسمبر',
                      ]}
                      previousTitle="السابق"
                      nextTitle="التالي"
                      todayBackgroundColor="#e6ffe6"
                      selectedDayColor="#66ff33"
                      selectedDayTextColor="#000000"
                      // scaleFactor={375}
                      textStyle={{
                        fontFamily: '29LTAzer-Regular',
                        color: '#000000',
                      }}
                      // scrollable={true}
                      // enableDateChange={true}
                      onDateChange={onDateChangeTwo}
                    />
                  </View>
                  {/* <TouchableOpacity
                  onPress={() => {
                    setState({ ...state, visible2: false });
                  }}
                  style={{
                    position: "absolute",
                    left: 315,
                    top: -30,
                    backgroundColor: "#c00e0e",
                    alignSelf: "center",
                    borderRadius: 50,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff" }}>X</Text>
                </TouchableOpacity> */}
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
        {!isLoading && mAttendanceList.length < 1 ? (
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              marginVertical: 32,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#626262',
                textAlign: 'center',
                fontFamily: '29LTAzer-Regular',
              }}
            >
              لا توجد بيانات
            </Text>
          </View>
        ) : null}
        {!isLoading && mAttendanceList.length > 0 ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#ffffff',
                borderTopRightRadius: 6,
                borderTopLeftRadius: 6,
                paddingVertical: 4,
              }}
            >
              <View style={[styles.flatlistHeader, { flex: 0.5 }]}>
                <Text style={styles.textStyle}> وقت الخروج</Text>
              </View>
              <View style={[styles.flatlistHeader, { flex: 0.5 }]}>
                <Text style={styles.textStyle}> وقت الدخول</Text>
              </View>

              <View style={[styles.flatlistHeader, { flex: 0.6 }]}>
                <Text style={styles.textStyle}> تاريخ البصمة</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          flexGrow: 1,
        }}
      >
        {!isLoading && mAttendanceList.length > 0 ? (
          <View
            style={{ height: '100%', width: '100%', paddingHorizontal: 16 }}
          >
            <FlatList
              style={{
                backgroundColor: '#ffffff',
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              }}
              data={mAttendanceList}
              extraData={mAttendanceList}
              renderItem={({ item }) => renderAttendanceList(item)}
              ItemSeparatorComponent={renderSeparator}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : null}
      </View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 180, marginVertical: -16 }}>
          <CommonFormButton
            {...props}
            buttonText="عرض"
            onPress={getAttendanceHistory}
          />
        </View>
        {isLoading ? (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{ width: 30, height: 30, top: -260, position: 'absolute' }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default AttendanceList;

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginVertical: hp('2%'),
  },
  loginWithBtns: {
    width: '50%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: hp('1.4%'),
  },
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    paddingRight: wp('4%'),
    marginBottom: hp('0.5%'),
  },
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 6,
  },
  dateText: {
    marginLeft: 5,
    marginTop: 4,
    textAlign: 'right',
    width: '85%',
    // height: "85%",
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
  },

  timeText: {
    marginLeft: 5,
    marginTop: 4,
    textAlign: 'right',
    width: '95%',
  },
  textStyle: {
    // fontWeight: "bold",
    color: '#007598',
    textAlign: 'left',
    fontFamily: '29LTAzer-Regular',
  },
  flatlistHeader: {
    marginVertical: 5,
    textAlign: 'center',
    alignItems: 'center',
  },
  itemtextStyle: {
    color: 'grey',
  },
  attendanceItemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 3,
  },
  titleFont: {
    fontFamily: '29LTAzer-Regular',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
