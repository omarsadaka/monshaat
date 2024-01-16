import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform,
  Modal
} from 'react-native';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Timeline from 'react-native-timeline-flatlist';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import IconFe from 'react-native-vector-icons/Feather';

const EmployeJourny = (props) => {
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const [timelineData, setTimelineData] = useState([]);
  const [raisesData, setRaisesDate] = useState([]);
  const [timelineDataFinal, setTimelineDataFinal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollViewRef = useRef();
  const [selectedItem, setSelectedItem] = useState(0);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const filterLabels = [
    { indexF: 0, nameF: 'الكل' },
    { indexF: 1, nameF: 'إجازات' },
    { indexF: 2, nameF: 'انتدابات' },
    { indexF: 3, nameF: 'تدريب' },
    { indexF: 4, nameF: 'علاوات' },
    { indexF: 5, nameF: 'ترقيات' },
  ];
  // model_name
  const filterKeys = [
    'all',
    'hr.holidays',
    'hr.deputation',
    'hr.training.request',
    'hr.raise',
    'hr.promotion',
  ];

  DATA1 = [
    { id: 1, title: 'يناير' },
    { id: 2, title: 'فبراير' },
    { id: 3, title: 'مارس' },
    { id: 4, title: 'أبريل' },
  ];
  DATA2 = [
    { title: '90 % معدل رضا المستفيدين عن تجربة الإستخدام' },
    { title: '15 عدد المقابلات التي يتم عملها لقياس قابلية الاستخدام' },
    { title: '5 عدد الاستبيانات التي تم نشرها لتحليل ودراسة سلوك المستخدم' },
  ];
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Employee_Journey_Screen');
    }
  }, [isFocused]);

  var sortBy = (function () {
    var toString = Object.prototype.toString,
      parse = function (x) {
        return x;
      },
      getItem = function (x) {
        var isObject = x != null && typeof x === 'object';
        var isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
      };

    return function sortby(array, cfg) {
      if (!(array instanceof Array && array.length)) {
        return [];
      }
      if (toString.call(cfg) !== '[object Object]') {
        cfg = {};
      }
      if (typeof cfg.parser !== 'function') {
        cfg.parser = parse;
      }
      cfg.desc = cfg.desc ? -1 : 1;
      return array.sort(function (a, b) {
        a = getItem.call(cfg, a);
        b = getItem.call(cfg, b);
        return cfg.desc * (a < b ? -1 : +(a > b));
      });
    };
  })();

  useEffect(() => {
    if (timelineData.length) {
      var xxx = timelineData.map((obj) => ({
        ...obj,
        startDate: obj['start date'],
      }));

      let arr = [...raisesData, ...xxx];

      // console.log('ARRAY BEFORE SORT', arr);
      let sortedArray = arr.sort((a, b) => {
        let dateA = a.startDate;
        let dateB = b.startDate;
        return new Date(dateA) - new Date(dateB);
      });
      var dateSorted = sortBy(sortedArray, {
        prop: 'startDate',
        desc: false,
        parser: function (item) {
          return new Date(item);
        },
      });
      // console.log('sortedArray data', dateSorted);

      let arrayObj = dateSorted.map((item) => {
        return {
          time: item.label,
          title:
            (item['start day'] || item.startDay) +
            ' ' +
            (item['start date'] || item.startDate),

          description:
            item['end date'] || item.endDate
              ? ' من ' +
                (item['start date'] || item.startDate) +
                ' إلى ' +
                (item['end date'] || item.endDate)
              : null,
          labelDescription: item.labelDescription,
          model_name: item.model_name,
        };
      });
      let start = { time: 'البداية' };
      let end = { time: 'النهاية' };
      arrayObj.unshift(start);
      arrayObj.push(end);
      setTimelineDataFinal(arrayObj);
    }
  }, [timelineData, raisesData]);

  useEffect(() => {
    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      getJourny(accessToken, mEmpID);
      // getRaises(accessToken, mEmpID);
    });
    AsyncStorage.getItem('empNumber').then(async (number) => {
      getRaises(number);
    });
    // console.log('aRRRRRRAYLENGTH', timelineDataFinal.length);
  }, [accessToken]);

  function renderDetail(rowData, sectionID, rowID) {
    return (
      <View style={{ marginTop: -10 }}>
        {/* {rowData.title && (
          <View
            style={{
              width: 6,
              height: 6,
              backgroundColor: '#707070',
              position: 'absolute',
              left: 5,
              top: 4,
              borderRadius: 50,
              zIndex: 99,
            }}
          />
        )} */}
        {rowData.title ? (
          <Text
            style={{
              color: '#4B4B4B',
              fontFamily: '29LTAzer-Regular',
              backgroundColor: 'white',
              textAlign: 'center',
              paddingVertical: 8,
              borderRadius: 5,
              overflow: 'hidden',
              zIndex: 15,
              fontSize: 12,
              borderColor: '#327394',
              borderWidth: 0.5,
              marginHorizontal: '6%',
            }}
          >
            {rowData.title}
          </Text>
        ) : (
          <View style={{ marginVertical: 15 }}></View>
        )}
      </View>
    );
  }

  function renderTime(rowData, sectionID, rowID) {
    return (
      <View style={{ flex: 1.2, marginTop: -10, marginVertical: 5 }}>
        {/* {rowData.time && (
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: 'white',
              position: 'absolute',
              left: 5,
              top: 5,
              borderRadius: 50,
              zIndex: 99,
            }}
          />
        )} */}
        {rowData.time ? (
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: '29LTAzer-Bold',
              backgroundColor: '#008AC5',
              textAlign: 'right',
              paddingVertical: 5,
              borderRadius: 5,
              fontSize: 12,
              paddingHorizontal: 5,
              overflow: 'hidden',
              zIndex: 15,
            }}
          >
            {rowData.time == 'تاريخ التوظيف' ? 'التعيين' : rowData.time}
          </Text>
        ) : (
          <View style={{ marginVertical: 5 }}></View>
        )}
        {rowData.labelDescription ? (
          <Text
            style={{
              backgroundColor: '#F2F2F2',
              color: '#4B4B4B',
              fontFamily: '29LTAzer-light',
              textAlign: 'right',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginVertical: 2,
              marginTop: -5,
              overflow: 'scroll',
              alignSelf: 'flex-end',
              fontSize: 11,
              width: '90%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              marginBottom: 7,
            }}
          >
            {rowData.labelDescription}
          </Text>
        ) : (
          <View style={{ marginVertical: 5 }}></View>
        )}
        {rowData.description ? (
          <Text
            style={{
              backgroundColor: '#F2F2F2',
              color: '#4B4B4B',
              fontFamily: '29LTAzer-light',
              textAlign: 'right',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginVertical: 10,
              marginTop: -13,
              overflow: 'scroll',
              alignSelf: 'flex-end',
              fontSize: 11,
              width: '90%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              marginBottom: 25,
            }}
          >
            {rowData.description}
          </Text>
        ) : (
          <View style={{ marginVertical: 5 }}></View>
        )}
        {rowData.time === 'البداية' ? (
          <Text
            style={{
              backgroundColor: '#F2F2F2',
              color: '#4B4B4B',
              fontFamily: '29LTAzer-light',
              textAlign: 'right',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginVertical: 20,
              marginTop: -20,
              overflow: 'scroll',
              alignSelf: 'flex-end',
              paddingTop: 10,
              fontSize: 11,
              width: '90%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              marginBottom: 25,
            }}
          >
            هنا بدأت رحلة الابداع
          </Text>
        ) : (
          <View style={{ marginVertical: 5 }}></View>
        )}
        {rowData.time === 'النهاية' ? (
          <Text
            style={{
              backgroundColor: '#F2F2F2',
              color: '#4B4B4B',
              fontFamily: '29LTAzer-light',
              textAlign: 'right',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginVertical: 10,
              marginTop: -30,
              overflow: 'scroll',
              alignSelf: 'flex-end',
              // borderRadius: 10,
              paddingTop: 10,
              fontSize: 11,
              width: '90%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            مازالت رحلة الابداع مستمرة
          </Text>
        ) : (
          <View style={{ marginVertical: 2 }}></View>
        )}
        {rowData.time === 'تاريخ التوظيف' ? (
          <Text
            style={{
              backgroundColor: '#F2F2F2',
              color: '#4B4B4B',
              fontFamily: '29LTAzer-light',
              textAlign: 'right',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginVertical: 20,
              marginTop: -35,
              overflow: 'scroll',
              alignSelf: 'flex-end',
              paddingTop: 10,
              fontSize: 11,
              width: '90%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              marginBottom: 25,
            }}
          >
            بداية التوظيف
          </Text>
        ) : (
          <View style={{ marginVertical: -2 }}></View>
        )}
      </View>
    );
  }

  const [filtredTimeLineData, setFilteredTimeLineData] =
    useState(timelineDataFinal);

  const applyFilterAll = (index) => {
    // console.log('FILTERKEYS---LENGTH', filterKeys.length - 6);
    setSelectedIndex(index);
    let filtered = [];
    filtered = timelineDataFinal.filter((item) => {
      if (filterKeys[index] === 'all') {
        return timelineDataFinal;
      } else {
        return item.model_name === filterKeys[index];
      }
    });
    setFilteredTimeLineData(filtered);
  };

  useEffect(() => {
    applyFilterAll(filterKeys.length - 6);
  }, [timelineDataFinal]);

  const buttons = (item) => {
    return (
      <Button
        title={item.nameF}
        onPress={(index) => {
          applyFilterAll(item.indexF);
          if (item.indexF >= 3) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          } else {
            scrollViewRef.current.scrollToIndex({ animated: true, index: 0 });
          }
        }}
        containerStyle={{
          height: 40,
          width: 70,
          margin: 2,
          color: 'gray',
        }}
        buttonStyle={{
          borderRadius: 20,
          backgroundColor: selectedIndex === item.indexF ? '#007598' : 'white',
        }}
        titleStyle={{
          fontFamily: '29LTAzer-Regular',
          color: selectedIndex === item.indexF ? 'white' : 'gray',
        }}
        selectedButtonStyle={{
          backgroundColor: '#007598',
        }}
      />
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: '95%',
          flexDirection: 'row',
          marginVertical: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            marginHorizontal: 5,
          }}
        >
          <Text style={[styles.text, { color: '#000' }]}>
            {'محلل تصميم حلول رقمية'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.text, { color: '#000', fontSize: 15 }]}>
              {'2 سنة'}
            </Text>
            <View style={styles.dot2} />
            <Text style={[styles.text, { color: '#000', fontSize: 15 }]}>
              {'حتى الأن-2022'}
            </Text>
          </View>
        </View>
        <View style={[styles.dot, { marginTop: '3%' }]} />
      </View>
    );
  };
  const renderItem2 = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer2}
        onPress={() => setSelectedItem(item.id)}
      >
        <View style={{ flexDirection: 'row' }}>
          <IconFe
            name={selectedItem == item.id ? 'chevron-up' : 'chevron-down'}
            size={23}
            color={'#007598'}
            style={{ alignSelf: 'flex-start' }}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}
          >
            <Text style={[styles.text, { color: '#007598' }]}>
              {'تحسين تجربة المستخدم للحلول الرقمية'}
            </Text>
            <Text style={[styles.text, { color: '#007598', fontSize: 15 }]}>
              {'ينتهي في 2022'}
            </Text>
          </View>
        </View>
        {selectedItem == item.id ? (
          <View style={{ width: '100%', marginTop: 2, alignItems: 'flex-end' }}>
            {DATA2.map((item) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.text2}>{item.title}</Text>
                  <View style={styles.dot2} />
                </View>
              );
            })}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#d5e6ed', '#d5e6ed']}
      style={{ flex: 1, alignItems: 'center' }}
    >
      <NewHeader
        {...props}
        back={true}
        style={styles.titleFont}
        title="رحلة الموظف"
      />
      <View style={styles.container}>
        <>
          {/* <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignSelf: 'center',
            }}
          >
            {!loading && (
              <FlatList
                ref={scrollViewRef}
                data={filterLabels}
                renderItem={({ item }) => buttons(item)}
                horizontal={true}
                inverted={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View> */}
          <View
            style={{
              width: '100%',
              // height: '10%',
              alignItems: 'center',
              marginBottom: '6%',
            }}
          >
            <View style={styles.periodContainer}>
              <Text style={[styles.text, { color: 'white' }]}>{'      '}</Text>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      fontSize: Dimensions.get('window').height * 0.03,
                    },
                  ]}
                >
                  {day}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      // marginTop:
                      //   Platform.OS == 'android'
                      //     ? -Dimensions.get('window').height * 0.015
                      //     : -Dimensions.get('window').height * 0.005,
                    },
                  ]}
                >
                  يوم
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      fontSize: Dimensions.get('window').height * 0.03,
                    },
                  ]}
                >
                  {month}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      // marginTop:
                      //   Platform.OS == 'android'
                      //     ? -Dimensions.get('window').height * 0.015
                      //     : -Dimensions.get('window').height * 0.005,
                    },
                  ]}
                >
                  أشهر
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      fontSize: Dimensions.get('window').height * 0.03,
                    },
                  ]}
                >
                  {year}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {
                      color: '#2A4372',
                      // marginTop:
                      //   Platform.OS == 'android'
                      //     ? -Dimensions.get('window').height * 0.015
                      //     : -Dimensions.get('window').height * 0.005,
                    },
                  ]}
                >
                  سنة
                </Text>
              </View>
              <Text style={[styles.text, { color: 'white' }]}>خلال</Text>
            </View>
          </View>

          {timelineDataFinal.length > 0 && (
            <Timeline
              listViewContainerStyle={{ paddingTop: 40 }}
              renderDetail={renderDetail}
              renderTime={renderTime}
              data={
                filtredTimeLineData.length === 0 && filterKeys === 0
                  ? timelineDataFinal
                  : filtredTimeLineData
              }
              circleSize={20}
              circleStyle={{ borderWidth: 2, borderColor: '#265E9D' }}
              circleColor="#ffffff"
              lineColor="#d1d3d4"
              innerCircle={'dot'}
              lineWidth={5}
              timeStyle={{
                color: '#20547a',
                width: 140,
                backgroundColor: '#fff',
                fontFamily: '29LTAzer-Regular',
                padding: 10,
                borderRadius: 8,
                marginTop: -10,
              }}
            />
          )}
          {/* <View style={styles.newContainer}>
            <View style={styles.periodContainer}>
              <Text style={[styles.text, { color: 'white' }]}>كنت</Text>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    { color: '#007598', fontWeight: 'bold' },
                  ]}
                >
                  1
                </Text>
                <Text
                  style={[styles.text, { color: '#007598', marginTop: -8 }]}
                >
                  يوم
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    { color: '#007598', fontWeight: 'bold' },
                  ]}
                >
                  3
                </Text>
                <Text
                  style={[styles.text, { color: '#007598', marginTop: -8 }]}
                >
                  أشهر
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.text,
                    { color: '#007598', fontWeight: 'bold' },
                  ]}
                >
                  4
                </Text>
                <Text
                  style={[styles.text, { color: '#007598', marginTop: -8 }]}
                >
                  سنة
                </Text>
              </View>
              <Text style={[styles.text, { color: 'white' }]}>خلال</Text>
            </View>
            <FlatList
              style={{
                width: '100%',
                marginTop: 10,
              }}
              data={DATA1}
              showsVerticalScrollIndicator={false}
              // nestedScrollEnabled
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <View
              style={{ width: '90%', height: 1, backgroundColor: 'gray' }}
            />
            <Text style={styles.text3}>الأهداف ومؤشرات الأداء</Text>
            <FlatList
              style={{
                width: '90%',
                marginTop: 5,
              }}
              data={DATA1}
              showsVerticalScrollIndicator={false}
              // nestedScrollEnabled
              renderItem={renderItem2}
              keyExtractor={item => item.id}
            />
          </View> */}
        </>
      </View>
      {Platform.OS == 'android' ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isLoading}
            onRequestClose={() => {}}
          >
            <Loader />
          </Modal>
        ) : (
          isLoading && <Loader />
        )}
    </LinearGradient>
  );
  async function getJourny(accessToken, id) {
    dispatch({ type: 'COMMON_LOADER', value: true });
    let url =
      baseUrl +
      `/api/call/all.requests/get_employee_journey?kwargs={"employee_id": ${id}}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setTimelineData(responseData);
        // console.log('journy', responseData);
        setDay(responseData[0].days)
        setMonth(responseData[0].months)
        setYear(responseData[0].years)
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  }
  async function getRaises(number) {
    let url = `http://demo6761654.mockable.io/employee-history-service/${number}`;
    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setRaisesDate(responseData.data);
      })
      .catch((err) => {});
  }
};

export default EmployeJourny;

const styles = StyleSheet.create({
  titleFont: {
    fontFamily: '29LTAzer-Regular',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '93%',
    height: '90%',
    backgroundColor: '#fff',
    elevation: 3,
    shadowOpacity: 0.2,
    borderRadius: 8,
    marginVertical: 25,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
  },
  newContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
  },
  periodContainer: {
    width: '100%',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#265E9D',
    paddingHorizontal: '5%',
    borderRadius: 5,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    marginTop: 10,
    paddingVertical: 5,
  },
  text: {
    fontFamily: '29LTAzer-Bold',
    fontSize: 17,
  },
  text2: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 15,
    color: '#000',
  },
  text3: {
    width: '90%',
    color: '#000',
    marginTop: 5,
    fontSize: 25,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontWeight: '500',
  },
  textContainer: {
    // height: Dimensions.get('window').height * 0.07,
    width: '22%',
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    paddingVertical: Platform.OS == 'ios' ? 5 : 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: 'gray',
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  itemContainer2: {
    width: '100%',
    marginVertical: 8,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 8,
    borderColor: '#007598',
    borderWidth: 1,
    alignItems: 'center',
  },
});
