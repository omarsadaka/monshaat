import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import CommonFormButton from '../../components/CommonFormButton';
import Header from '../../components/Header';
import Loader from '../../components/loader';
import * as AttendanceActionPost from '../../redux/action/AttendanceAction';
import * as loadingAction from '../../redux/action/loadingAction';

const AttandanceSystem = props => {
  const [state, setState] = useState({
    activeTab: 'In',
    dateoneErr: false,
    time: moment(new Date()).format('HH:MM'),
    timeErr: false,
    dateone: moment(new Date()).format('DD/MM/YYYY'),
  });
  const dispatch = useDispatch();

  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);

  const [isDatePickerVisibleTwo, setDatePickerVisibilitytwo] = useState(false);

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const attandanceResponse = useSelector(
    state => state.AttendanceReducer.attandanceResponse,
  );

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  useEffect(() => {
    if (typeof attandanceResponse === 'object' && attandanceResponse.length) {
      dispatch(AttendanceActionPost.emptyAttendanceRequest());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'success',
        message: 'نجاح',
      });

      props.navigation.goBack();
    } else if (
      typeof attandanceResponse === 'object' &&
      Object.keys(attandanceResponse).length
    ) {
      dispatch(AttendanceActionPost.emptyAttendanceRequest());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: attandanceResponse.message.replace('None', ''),
      });
    }
  }, [attandanceResponse]);

  const showDatePickerone = () => {
    setDatePickerVisibilityone(true);
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const showTimePicker = () => {
    setDatePickerVisibilitytwo(true);
  };

  const hideTimePicker = () => {
    setDatePickerVisibilitytwo(false);
  };

  const handleConfirmTwo = date => {
    var a = moment(date).format('HH:mm');
    setState({ ...state, time: a, timeErr: false });

    hideTimePicker();
  };

  const handleAttandanceSystem = async () => {
    let { dateone, time, activeTab, dateoneErr, timeErr } = state;
    let userId = await AsyncStorage.getItem('userid');

    if (!dateone) {
      dateoneErr = true;
    }

    if (!time) {
      timeErr = true;
    }

    if (dateone && time) {
      let data = {
        employee_id: userId,
        name: dateone + ' ' + time,
      };
      if (activeTab === 'In') {
        data.action = 'sign_in';
      } else {
        data.action = 'sign_out';
      }
      timeErr = false;
      dateoneErr = false;
      dispatch(AttendanceActionPost.submitAttandance(data, accessToken));
      dispatch(loadingAction.commaonLoader(true));
    }
    setState({ ...state, timeErr, dateoneErr });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View>
        <Header back={true} cross={true} {...props} />
      </View>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '90%' }}>
            <View style={styles.container1}>
              <TouchableOpacity
                style={[
                  styles.loginWithBtns,
                  {
                    backgroundColor:
                      state.activeTab == 'Out' ? '#007598' : 'white',
                  },
                ]}
                onPress={() => setState({ ...state, activeTab: 'Out' })}
              >
                <Text
                  style={{
                    color: state.activeTab == 'Out' ? 'white' : 'black',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  خارج
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.loginWithBtns,
                  {
                    backgroundColor:
                      state.activeTab == 'In' ? '#007598' : 'white',
                  },
                ]}
                onPress={() => setState({ ...state, activeTab: 'In' })}
              >
                <Text
                  style={{
                    color: state.activeTab == 'In' ? 'white' : 'black',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  في
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heading}>
              <Text>تاريخ</Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                onPress={showDatePickerone}
                style={[
                  styles.dateStyle,
                  { borderColor: state.dateoneErr ? 'red' : '#e2e2e2' },
                ]}
              >
                <Image
                  style={{ height: 25, width: 25, tintColor: '#007598' }}
                  source={require('./../../assets/images/Calendar.png')}
                  tintColor="#007598"
                />
                <Text style={styles.dateText}>{state.dateone}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                style={{ fontFamily: '29LTAzer-Regular' }}
                locale="ar"
                headerTextIOS="إختر التاريخ"
                cancelTextIOS="إلغاء"
                confirmTextIOS="إختيار"
                // isVisible={isDatePickerVisibleone}
                maximumDate={new Date()}
                mode="date"
                //  onConfirm={handleConfirmone}
                onCancel={hideDatePickerone}
              />
            </View>

            <View style={styles.heading}>
              <Text>زمن</Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                onPress={showTimePicker}
                style={[
                  styles.dateStyle,
                  { borderColor: state.dateoneErr ? 'red' : '#e2e2e2' },
                ]}
              >
                <Icon
                  style={{ tintColor: '#007598' }}
                  size={25}
                  name="clock-o"
                  tintColor="#007598"
                  color="#007598"
                />
                <Text style={styles.timeText}>{state.time}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                style={{ fontFamily: '29LTAzer-Regular' }}
                locale="ar"
                headerTextIOS="إختر التاريخ"
                cancelTextIOS="إلغاء"
                confirmTextIOS="إختيار"
                isVisible={isDatePickerVisibleTwo}
                mode="time"
                onConfirm={handleConfirmTwo}
                onCancel={hideTimePicker}
                maximumDate={new Date()}
              />
            </View>
          </View>
          <View style={{ width: '80%' }}>
            <CommonFormButton onPress={handleAttandanceSystem} {...props} />
          </View>
        </View>
      </ScrollView>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default AttandanceSystem;

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
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
  },

  timeText: {
    marginLeft: 5,
    marginTop: 4,
    textAlign: 'right',
    width: '95%',
    paddingRight: 20,
  },
});
