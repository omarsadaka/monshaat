import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CommonFormButton from '../../components/CommonFormButton';
import Header from '../../components/Header';
import Loader from '../../components/loader';
import * as attandanceAction from '../../redux/action/AttendanceAction';

const AttandanceList = props => {
  const [state, setState] = useState({
    dateFrom: '',
    dateTo: '',
    showList: false,
    allAttandanceData: [],
  });
  const dispatch = useDispatch();

  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);

  const [isDatePickerVisibleTwo, setDatePickerVisibilitytwo] = useState(false);

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const attandanceList = useSelector(
    state => state.AttendanceReducer.attandanceList,
  );

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  useEffect(() => {
    // console.warn(attandanceList, 'hi');
    if (typeof attandanceList === 'object' && attandanceList.length) {
      setState({ ...state, showList: true, allAttandanceData: attandanceList });
    } else if (
      typeof attandanceList === 'object' &&
      Object.keys(attandanceList).length
    ) {
    }
  }, [attandanceList]);

  const showDatePickerone = () => {
    setDatePickerVisibilityone(true);
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const handleConfirmone = date => {
    var a = moment(date).format('DD/MM/YYYY');
    setState({ ...state, dateFrom: a });
    hideDatePickerone();
  };

  const showTimePicker = () => {
    setDatePickerVisibilitytwo(true);
  };

  const hideTimePicker = () => {
    setDatePickerVisibilitytwo(false);
  };

  const handleConfirmTwo = date => {
    var a = moment(date).format('DD/MM/YYYY');
    setState({ ...state, dateTo: a, showList: true });

    hideTimePicker();
  };
  const renderSeparator = () => (
    <View
      style={{
        backgroundColor: 'grey',
        height: 0.4,
        marginTop: 3,
      }}
    />
  );

  useEffect(() => {
    let { dateFrom, dateTo } = state;
    if (dateFrom && dateTo) {
      let data = {
        dateFrom,
        dateTo,
      };
      dispatch(attandanceAction.getAttandanceList(data, accessToken));
    }
  }, [state.dateFrom, state.dateTo]);

  const renderAttandanceList = item => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.flatlistHeader}>
          <Text style={styles.itemtextStyle}>{item.hours_supp}</Text>
        </View>
        <View style={styles.flatlistHeader}>
          <Text style={styles.itemtextStyle}>{item.hour_start}</Text>
        </View>
        <View style={styles.flatlistHeader}>
          <Text style={[styles.itemtextStyle, { paddingLeft: 4 }]}>
            {item.hour_stop}
          </Text>
        </View>
        <View style={styles.flatlistHeader}>
          <Text style={styles.itemtextStyle}>{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View>
        <Header back={true} cross={true} {...props} />
      </View>
      <View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '90%' }}>
            <View style={styles.heading}>
              {/* <Text>تاريخ البداية</Text> */}
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
                <Text style={styles.dateText}>{state.dateFrom}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                locale="ar"
                headerTextIOS="إختر التاريخ"
                cancelTextIOS="إلغاء"
                confirmTextIOS="إختيار"
                isVisible={isDatePickerVisibleone}
                maximumDate={new Date()}
                mode="date"
                onConfirm={handleConfirmone}
                onCancel={hideDatePickerone}
              />
            </View>

            <View style={styles.heading}>
              <Text>تاريخ النهاية</Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                onPress={showTimePicker}
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
                <Text style={styles.dateText}>{state.dateTo}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                locale="ar"
                headerTextIOS="إختر التاريخ"
                cancelTextIOS="إلغاء"
                confirmTextIOS="إختيار"
                isVisible={isDatePickerVisibleTwo}
                mode="date"
                onConfirm={handleConfirmTwo}
                onCancel={hideTimePicker}
                maximumDate={new Date()}
              />
            </View>
            <View
              style={{
                marginTop: hp('2%'),
                padding: wp('2%'),
                backgroundColor: 'white',
                borderRadius: 9,
                marginHorizontal: wp('0.1%'),
              }}
            >
              {state.showList === true ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={[styles.flatlistHeader, { paddingLeft: 4 }]}>
                    <Text style={styles.textStyle}>تأخير</Text>
                  </View>
                  <View style={styles.flatlistHeader}>
                    <Text style={styles.textStyle}> خارج</Text>
                  </View>
                  <View style={styles.flatlistHeader}>
                    <Text style={styles.textStyle}>في</Text>
                  </View>
                  <View style={[styles.flatlistHeader, { paddingLeft: 4 }]}>
                    <Text style={styles.textStyle}> تاريخ</Text>
                  </View>
                </View>
              ) : null}
              {state.showList === true ? (
                <View style={{ height: Dimensions.get('window').height / 2.5 }}>
                  <FlatList
                    data={state.allAttandanceData}
                    renderItem={({ item }) => renderAttandanceList(item)}
                    ItemSeparatorComponent={renderSeparator}
                  />
                </View>
              ) : null}
            </View>
          </View>
          {state.showList === true ? (
            <View style={{ width: '80%' }}>
              <CommonFormButton {...props} buttonText="طباعة" />
            </View>
          ) : null}
        </View>
      </View>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

export default AttandanceList;

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
  },
  textStyle: {
    fontWeight: 'bold',
    color: '#007598',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'left',
  },
  flatlistHeader: {
    width: '25%',
    marginVertical: 5,
  },
  itemtextStyle: {
    color: 'grey',
  },
});
