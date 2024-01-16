import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import IconFe from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Collapsible from 'react-native-collapsible';
import OrderViewItem2 from '../../components/OrderViewItem2';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl } from '../../services';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import moment from 'moment';
import Loader from '../../components/loader';

const MyDataPanel = (props) => {
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const [selectedItem, setSelectedItem] = useState(0);
  const [selectedmyDataPanel, setSelectedmyDataPanel] = useState(0);
  const [empID, setEmpID] = useState('1');
  const [stockData, setStokData] = useState({});
  const [stockDetails, setStokDetails] = useState([]);
  const [empGoals, setEmpGoals] = useState([]);
  const [empGoalsDetails, setEmpGoalsDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading_view, setLoading_view] = useState(false);
  const [title, setTitle] = useState('');
  const flatlistRef = useRef(null);
  const flatlistRef2 = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getEmpID();
  }, []);

  const getEmpID = async () => {
    let mEmpID = await AsyncStorage.getItem('empID');
    setEmpID(mEmpID);
    getEmployeeStocks(mEmpID);
    getEmployeeGoals(mEmpID);
  };

  const getEmployeeStocks = (empId) => {
    if (!accessToken) {
      return;
    }
    dispatch({ type: 'COMMON_LOADER', value: true });
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_stocks?kwargs={"employee_id": ${empId}}`;
    console.log('url url', url);
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('getEmployeeStocks', responseData);
        setStokData(responseData);
        dispatch({ type: 'COMMON_LOADER', value: false });
      })
      .catch((err) => {
        remoteLog(url, err);
        // console.log('getEmployeeStocks error', err);
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };

  const getStockDetails = (model) => {
    if (!accessToken || empID == '1') {
      return;
    }
    setLoading(true);
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_hr_requests_details?kwargs={"employee_id": ${empID},"model_name": "${model}"}`;
      console.log('adadfsf', url)
      console.log('accessToken', accessToken)
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('getStockDetails', responseData);
        setStokDetails(responseData);
        setLoading(false);
      })
      .catch((err) => {
        remoteLog(url, err);
        // console.log('getStockDetails error', err);
        setLoading(false);
      });
  };

  const getEmployeeGoals = (empId) => {
    if (!accessToken) {
      return;
    }
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_goals?kwargs={"employee_id": ${empId}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('getEmployeeGoals', responseData);
        setEmpGoals(responseData);
      })
      .catch((err) => {
        remoteLog(url, err);
        // console.log('getEmployeeGoals error', err);
      });
  };

  const getEmployeeGoalsDetails = (goalId) => {
    if (!accessToken || empID == '1') {
      return;
    }
    setLoading2(true);
    const url =
      baseUrl +
      `/api/call/all.requests/get_indicator_ids?kwargs={"goal_id": ${goalId}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('getEmployeeGoalsDetails', responseData);
        setEmpGoalsDetails(responseData);
        setLoading2(false);
      })
      .catch((err) => {
        remoteLog(url, err);
        // console.log('getEmployeeGoalsDetails error', err);
        setLoading2(false);
      });
  };

  const myDataPanel = [
    {
      title: 'الاجازات',
      id: 1,
      subtitle1: 'يوم',
      value1: stockData.token_holidays_sum,
      subtitle2: 'متبقي',
      value2:stockData.holidays_available_stock?
        (stockData.holidays_available_stock).toFixed(2):'0' ,
      selected: true,
      model_name: 'hr.holidays',
    },
    {
      title: 'الاستئذان',
      id: 2,
      subtitle1: 'مجموع ساعات الاستئذان للشهر الحالي',
      value1: stockData.token_auth_sum,
      subtitle2: 'متبقي',
      value2: stockData.current_authorization_stock,
      selected: false,
      model_name: 'hr.authorization',
    },
    {
      title: 'العمل عن بعد',
      id: 3,
      subtitle1: 'يوم',
      value1: stockData.token_distance_work_sum,
      subtitle2: 'متبقي هذا الشهر',
      value2: parseInt(stockData.current_distance_work_stock),
      selected: true,
      model_name: 'hr.distance.work',
    },
    {
      title: 'الدورات الداخلية',
      id: 4,
      subtitle1: 'عدد الدورات',
      value1: stockData.no_of_trainings,
      selected: false,
      model_name: 'hr.training.request',
    },
    // {
    //   title: 'طلبات الشراء',
    //   id: 5,
    //   subtitle1: 'عدد الطلبات',
    //   value1: '4',
    //   selected: false,
    //   model_name: '',
    // },
    {
      title: 'الانتدابات',
      id: 6,
      subtitle1: 'عدد الطلبات',
      value1: stockData.no_of_deputations,
      selected: false,
      model_name: 'hr.deputation',
    },
  ];

  const renderObojectiveDetails = ({ item }) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width * 0.8,
          backgroundColor: '#FFFFFF',
          justifyContent: 'space-evenly',
          padding: 10,
          borderRadius: 6,
          marginHorizontal: Dimensions.get('window').width * 0.011,
          elevation: 2,
          shadowOpacity: 0.1,
          shadowOffset: { width: 1, height: 1 },
          margin: 1,
        }}
      >
        <Text
          style={{
            color: '#2367AB',
            fontFamily: '29LTAzer-Medium',
            fontSize: Dimensions.get('window').width * 0.03,
            textAlign: 'center',
            transform: [{ rotateY: '180deg' }],
          }}
        >
          {title}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <View
            style={{
              alignItems: 'flex-start',
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row-reverse',
                height: Dimensions.get('window').height * 0.04,
              }}
            >
              <Text
                style={{
                  color: '#4B4B4B',
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 12,
                  marginHorizontal: 3,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'%'}
                {item.weight}
              </Text>
              <Text
                style={{
                  color: '#BFD8E0',
                  fontFamily: '29LTAzer-Medium',
                  fontSize: 12,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'وزن المؤشر:'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
              }}
            >
              <Text
                style={{
                  color: '#4B4B4B',
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 12,
                  marginHorizontal: 3,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {item.goal_method ? item.goal_method : '--'}
              </Text>
              <Text
                style={{
                  color: '#BFD8E0',
                  fontFamily: '29LTAzer-Medium',
                  fontSize: 12,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'نوع المستهدف:'}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', flex: 1.2 }}>
            <View
              style={{
                flexDirection: 'row-reverse',
                height: Dimensions.get('window').height * 0.04,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: '#4B4B4B',
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 12,
                  marginHorizontal: 3,
                  textAlign: 'right',
                  transform: [{ rotateY: '180deg' }],
                }}
                numberOfLines={2}
              >
                {item.scale}
              </Text>
              <Text
                style={{
                  color: '#BFD8E0',
                  fontFamily: '29LTAzer-Medium',
                  fontSize: 12,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'مقياس المؤشر:'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
                // height: 40,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: '#4B4B4B',
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 12,
                  marginHorizontal: 3,
                  textAlign: 'right',
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {item.goals}
              </Text>
              <Text
                style={{
                  color: '#BFD8E0',
                  fontFamily: '29LTAzer-Medium',
                  fontSize: 12,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'المستهدف:'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderItem2 = ({ item }) => {
    return (
      <View style={styles.itemContainer2}>
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => {
            item.id == selectedItem
              ? setSelectedItem(0)
              : setSelectedItem(item.id);
            if (setSelectedItem != item.id) getEmployeeGoalsDetails(item.id);
            setTitle(item.sub_goal_level3_id);
          }}
        >
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={styles.text2}>وزن الهدف</Text>
            <View style={styles.weightContainer}>
              <Text style={styles.weight}>
                {'%'}
                {item.weight}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={[
                styles.text,
                { color: '#A0A0A0', fontSize: 10, textAlign: 'right' },
              ]}
            >
              {item.sub_goal_level3_id}
            </Text>
            <Text style={[styles.text2, { textAlign: 'right', marginTop: 5 }]}>
              {item.goal_single_id}
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: 5,
              }}
            >
              {/* <Text style={[styles.text4, { flex: 1 }]}>{'ينتهي في 2022'}</Text> */}
              <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 5 }}>
                <Text style={styles.date}>فترة القياس</Text>
                <Text
                  style={[
                    styles.date,
                    {
                      backgroundColor: '#E4E4E4',
                      padding: 6,
                      borderRadius: 5,
                      overflow: 'hidden',
                      color: '#666666',
                    },
                  ]}
                >
                  {item.period_measure_id[0][1]}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 5 }}>
                <Text style={styles.date}> نهاية تحقيق الهدف</Text>
                <Text
                  style={[
                    styles.date,
                    {
                      backgroundColor: '#E4E4E4',
                      padding: 6,
                      borderRadius: 5,
                      overflow: 'hidden',
                      color: '#666666',
                    },
                  ]}
                >
                  {item.date_end ? item.date_end : '--'}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.date}> بداية تحقيق الهدف</Text>
                <Text
                  style={[
                    styles.date,
                    {
                      backgroundColor: '#E4E4E4',
                      padding: 6,
                      borderRadius: 5,
                      overflow: 'hidden',
                      color: '#666666',
                    },
                  ]}
                >
                  {item.date_start ? item.date_start : '--'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#A9A9A9',
            marginVertical: 10,
          }}
        />

        {selectedItem == item.id && (
          <View
            style={{
              width: Dimensions.get('window').width * 0.9,
              backgroundColor: '#F5F5F5',
              paddingHorizontal: 15,
              paddingVertical: 20,
              alignItems: 'center',
              transform: [{ rotateY: '180deg' }],
            }}
          >
            {loading2 ? (
              <ActivityIndicator size={'small'} color={'#3C88C0'} />
            ) : (
              <SwiperFlatList
                index={0}
                showPagination
                paginationDefaultColor={'#CECECE'}
                paginationActiveColor={'#2262A4'}
                paginationStyleItemActive={styles.active}
                paginationStyleItemInactive={styles.inActive}
                paginationStyle={{
                  width: 100,
                  marginBottom: -5,
                }}
                paginationStyleItem={{ marginHorizontal: 2 }}
                data={empGoalsDetails}
                renderItem={renderObojectiveDetails}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            item.id == selectedItem
              ? setSelectedItem(0)
              : setSelectedItem(item.id);
            if (setSelectedItem != item.id) getEmployeeGoalsDetails(item.id);
            setTitle(item.sub_goal_level3_id);
          }}
        >
          <IconFe
            name={selectedItem == item.id ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={'#4B4B4B'}
          />
          <Text
            style={[
              styles.text2,
              {
                color: '#4B4B4B',
                fontFamily: '29LTAzer-Bold',
                fontSize: Dimensions.get('window').width * 0.032,
              },
            ]}
          >
            عرض التفاصيل
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  function convertNumToTime(number) {
    // Check sign of given number
    var sign = number >= 0 ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    if (minute.length < 2) {
      minute = '0' + minute;
    }

    // Add Sign in final result
    sign = sign == 1 ? '' : '-';

    // Concate hours and minutes
    time = sign + hour + ':' + minute;

    return time;
  }

  const handleOpenDetails = (item) => {
    let navigation = props.navigation;
    if (item.res_model === 'hr.holidays') {
      navigation.navigate('NewLeaveRequest', {
        comeFrom: 'MyRequest',
        item: item,
        viewType: 'MyRequest',
      });
    } else if (item.res_model === 'hr.deputation') {
      navigation.navigate('MandateRequest', {
        item: item,
        viewType: 'MyRequest',
      });
    } else if (item.res_model === 'hr.authorization') {
      navigation.navigate('LeaveRequest', {
        item: item,
        viewType: 'MyRequest',
      });
    } else if (item.res_model === 'hr.distance.work') {
      navigation.navigate('RemoteRequest', {
        item: item,
        viewType: 'MyRequest',
      });
    } else if (item.res_model === 'hr.training.request') {
      navigation.navigate('TrainingRequest', {
        item: item,
        viewType: 'MyRequest',
      });
    } else if (item.res_model === 'hr.training.public') {
      navigation.navigate('FormInternalCourses', {
        item: item,
        viewType: 'MyRequest',
      });
    }
  };
  const RenderDetailTypeOne = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleOpenDetails(item)}
        style={{
          // width: Dimensions.get('window').width * 0.78,
          width: Dimensions.get('window').width * 0.8,
          backgroundColor: '#FFFFFF',
          padding: 10,
          borderRadius: 12,
          // marginEnd:
          //   Platform.OS == 'android'
          //     ? Dimensions.get('window').width * 0.05
          //     : Dimensions.get('window').width * 0.057,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            // flex: 1,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}
        >
          {item.res_model == 'hr.deputation' ||
          item.res_model == 'hr.authorization' ? (
            <View
              style={{
                flex: 1,
              }}
            >
              <OrderViewItem2
                title1={
                  item.res_model == 'hr.deputation' ? 'النوع' : 'نوع الإستئذان'
                }
                title2={
                  item.res_model == 'hr.deputation'
                    ? item.deputation_type[1]
                    : item.type_id[1].split(']')[1]
                }
                icon={require('../../assets/images/order/type.png')}
                title2Style={{
                  backgroundColor: '#F5F5F5',
                  textAlign: 'center',
                  borderRadius: 15,
                  overflow: 'hidden',
                  transform: [{ rotateY: '180deg' }],
                }}
              />
            </View>
          ) : null}

          {item.res_model != 'hr.distance.work' ? (
            <View
              style={{
                flex: 1,
                // backgroundColor: 'gray',
                marginHorizontal: 5,
              }}
            >
              <OrderViewItem2
                title1={
                  item.res_model == 'hr.holidays'
                    ? 'نوع الأجازة'
                    : item.res_model == 'hr.authorization'
                    ? 'تاريخ الإستئذان'
                    : item.res_model == 'hr.training.public' ||
                      item.res_model == 'hr.training.request'
                    ? 'النوع'
                    : item.res_model == 'hr.deputation'
                    ? 'مكان الإنتداب'
                    : ''
                }
                title2={
                  item.res_model == 'hr.holidays'
                    ? item?.holiday_status_id[1]
                    : item.res_model == 'hr.training.public' ||
                      item.res_model == 'hr.training.request'
                    ? item.type == 'international'
                      ? 'دولى'
                      : 'محلى'
                    : item.res_model == 'hr.authorization'
                    ? item.date
                      ? moment(item.date).format('YYYY-MM-DD')
                      : moment(item.create_date).format('YYYY-MM-DD')
                    : item.res_model == 'hr.deputation'
                    ? item?.city_id[1]
                      ? item?.city_id[1]
                      : '--'
                    : ''
                }
                icon={
                  item.res_model == 'hr.training.request' ||
                  item.res_model == 'hr.training.public'
                    ? require('../../assets/images/order/type.png')
                    : require('../../assets/images/order/id.png')
                }
                title2Style={{
                  backgroundColor: '#F5F5F5',
                  textAlign: 'center',
                  borderRadius: 15,
                  overflow: 'hidden',
                  transform: [{ rotateY: '180deg' }],
                }}
              />
            </View>
          ) : null}

          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              alignItems: 'flex-start',
            }}
          >
            <OrderViewItem2
              title1={
                item.res_model == 'hr.training.public' ||
                item.res_model == 'hr.training.request'
                  ? 'مسمى الدورة'
                  : 'رقم الطلب'
              }
              title2={
                item.res_model == 'hr.deputation'
                  ? item.seq_number
                  : item.res_model == 'hr.training.public' ||
                    item.res_model == 'hr.training.request'
                  ? item.name?item.name:item.training_id? item.training_id[1]:'--'
                  : item?.name
              }
              icon={require('../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#F5F5F5',
                textAlign: 'center',
                borderRadius: 15,
                overflow: 'hidden',
                transform: [{ rotateY: '180deg' }],
              }}
            />
          </View>
        </View>

        {item.res_model == 'hr.distance.work' ? (
          <View style={{}}>
            <View style={styles.textContainer}>
              <Text
                selectable={true}
                style={{
                  fontSize: Dimensions.get('window').width * 0.027,
                  color: 'gray',
                  fontFamily: '29LTAzer-Regular',
                  marginVertical: 2,
                  marginHorizontal: 5,
                  textAlign: 'right',
                  flex: 1,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {'ملاحظات'}
              </Text>
              <Image
                resizeMode="stretch"
                source={props.icon}
                style={{
                  width: 14,
                  height: 17,
                  tintColor: '#bfd8e0',
                }}
              />
            </View>
            <Text
              selectable={true}
              style={{
                color: '#20547a',
                fontFamily: '29LTAzer-Regular',
                fontSize: Dimensions.get('window').width * 0.027,
                paddingVertical: 5,
                backgroundColor: '#F5F5F5',
                textAlign: 'center',
                borderRadius: 15,
                overflow: 'hidden',
                transform: [{ rotateY: '180deg' }],
              }}
            >
              {item.description}
            </Text>
          </View>
        ) : null}

        <View style={styles.textContainer}>
          <Text style={styles.text1}>
            {item.res_model == 'hr.authorization' ? 'الوقت' : 'التاريخ'}
          </Text>
          <Image
            resizeMode="stretch"
            source={require('../../assets/images/order/date.png')}
            style={styles.icon}
          />
        </View>

        <View
          style={{
            // flex: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F5F5F5',
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 6,
          }}
        >
          <Text style={styles.value}>
            {item.res_model == 'hr.authorization'
              ? item.hour_to && item.hour_from
                ? convertNumToTime(item.hour_to - item.hour_from)
                : // parseFloat(item.hour_to - item.hour_from)
                  //     .toFixed(2)
                  //     .replace('.', ':')
                  '--'
              : item?.duration
              ? item?.duration
              : item.number_of_days}
            {'  '}
            {item.res_model == 'hr.authorization' ? 'ساعة' : 'أيام'}
          </Text>
          <Text style={styles.label}>المدة</Text>
          <Text style={styles.value}>
            {item.res_model == 'hr.authorization'
              ? item.hour_to
                ? convertNumToTime(item.hour_to)
                : // parseFloat(item.hour_to)
                  //     .toFixed(2)
                  //     .replace('.', ':')
                  '--'
              : item.date_to}
          </Text>
          <Text style={styles.label}>
            {' '}
            {item.res_model == 'hr.authorization'
              ? 'وقت النهاية'
              : 'تاريخ النهاية'}
          </Text>
          <Text style={styles.value}>
            {item.res_model == 'hr.authorization'
              ? item.hour_from
                ? convertNumToTime(item.hour_from)
                : // parseFloat(item.hour_from)
                  //     .toFixed(2)
                  //     .replace('.', ':')
                  '--'
              : item.date_from}
          </Text>
          <Text style={styles.label}>
            {item.res_model == 'hr.authorization'
              ? 'وقت البداية'
              : 'تاريخ البداية'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderDataPanel = ({ item }) => {
    return (
      <View
        style={{
          marginVertical: 10,
          borderRadius: 25,
          width: '99%',
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              borderBottomLeftRadius: selectedmyDataPanel != item.id ? 10 : 1,
              borderBottomRightRadius: selectedmyDataPanel != item.id ? 10 : 1,
            },
          ]}
          onPress={() => {
            selectedmyDataPanel == item.id
              ? setSelectedmyDataPanel(0)
              : setSelectedmyDataPanel(item.id);
            if (selectedmyDataPanel != item.id) {
              getStockDetails(item.model_name);
            }
          }}
        >
          <Text
            style={{
              width: '98%',
              fontSize: Dimensions.get('window').width * 0.036,
              textAlign: 'right',
              marginRight: 15,
              color: '#4B4B4B',
              fontFamily: '29LTAzer-Bold',
            }}
          >
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              width: '95%',
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                selectedmyDataPanel == item.id
                  ? setSelectedmyDataPanel(0)
                  : setSelectedmyDataPanel(item.id);
                if (selectedmyDataPanel != item.id) {
                  getStockDetails(item.model_name);
                }
              }}
            >
              <IconFe
                name={
                  selectedmyDataPanel == item.id ? 'chevron-up' : 'chevron-down'
                }
                size={20}
                color={'#4B4B4B'}
              />
              <Text
                style={{
                  fontFamily: '29LTAzer-Bold',
                  fontSize: Dimensions.get('window').width * 0.032,
                  alignSelf: 'center',
                  color: '#4B4B4B',
                }}
              >
                عرض التفاصيل
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 5,
              }}
            >
              {item.subtitle2 && item.model_name != 'hr.authorization' && (
                <>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 35,
                      height: 30,
                      borderColor: '#3C88C0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.032,
                        color: '#244A76',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      {item.value2 ? item.value2 : '0'}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: '#244A76',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontFamily: '29LTAzer-Regular',
                      marginHorizontal:
                        item.model_name == 'hr.distance.work' ? 0 : 7,
                      marginStart: 8,
                      alignSelf: 'center',
                      fontSize: Dimensions.get('window').width * 0.03,
                    }}
                  >
                    {item.subtitle2}
                  </Text>
                </>
              )}
              {item.model_name != 'hr.distance.work' ? (
                <>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                      width: 35,
                      height: 30,
                      borderColor: '#3C88C0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Dimensions.get('window').width * 0.032,
                        color: '#244A76',
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      {item.value1 ? item.value1 : '0'}
                    </Text>
                  </View>
                  <Text
                    style={{
                      width:
                        item.model_name == 'hr.training.request' ||
                        item.model_name == 'hr.deputation'
                          ? '23%'
                          : item.model_name == 'hr.authorization'
                          ? '67%'
                          : '10%',
                      marginLeft: 15,
                      textAlignVertical: 'center',
                      textAlign: 'right',
                      color: '#244A76',
                      fontFamily: '29LTAzer-Regular',
                      alignSelf: 'center',
                      fontSize: Dimensions.get('window').width * 0.028,
                    }}
                  >
                    {item.subtitle1}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
        {/* {selectedmyDataPanel != item.id}
        <Collapsible collapsed={selectedmyDataPanel != item.id}> */}
        {selectedmyDataPanel == item.id ? (
          <View
            style={{
              flex: 1,
              backgroundColor: '#f5f5f5',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              paddingVertical: 10,
              // paddingHorizontal: 5,
              transform: [{ rotateY: '180deg' }],
            }}
          >
            {loading ? (
              <ActivityIndicator size={'small'} color={'#3C88C0'} />
            ) : (
              <SwiperFlatList
                style={{
                  width: Dimensions.get('window').width * 0.8,
                  alignSelf: 'center',
                }}
                index={0}
                showPagination
                paginationDefaultColor={'#CECECE'}
                paginationActiveColor={'#2262A4'}
                paginationStyleItemActive={styles.active}
                paginationStyleItemInactive={styles.inActive}
                paginationStyle={{
                  width: 100,
                  marginBottom: -15,
                }}
                paginationStyleItem={{ marginHorizontal: 2 }}
                data={stockDetails}
                renderItem={RenderDetailTypeOne}
                onMomentumScrollEnd={() => {}}
              />
            )}
          </View>
        ) : null}
        {/* </Collapsible> */}
      </View>
    );
  };
  return (
    <View style={{ height: '100%' }}>
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
      <View style={styles.container}>
        <View
          style={{
            width: '95%',
            alignItems: 'center',
          }}
        >
          <FlatList
            style={{
              width: '100%',
              marginTop: 5,
            }}
            data={myDataPanel}
            showsVerticalScrollIndicator={false}
            renderItem={renderDataPanel}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={{ flex: 1, width: '95%', marginBottom: 150 }}>
          <Text style={styles.text3}>الأهداف ومؤشرات الأداء</Text>
          <FlatList
            style={{
              width: '100%',
              marginTop: 5,
            }}
            data={empGoals}
            showsVerticalScrollIndicator={false}
            // nestedScrollEnabled
            renderItem={renderItem2}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => {
              return <Text style={styles.text3}>لا يوجد بيانات </Text>;
            }}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  );
};
export default MyDataPanel;
const styles = StyleSheet.create({
  containerScrollView: {
    flex: 1,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    padding: 8,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 80,
    backgroundColor: '#FCFCFC',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,

    elevation: 3,
    paddingHorizontal: 7,
    marginHorizontal: 1,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
  },
  itemContainer2: {
    width: '100%',
    backgroundColor: '#FCFCFC',
    borderRadius: 10,
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 7,
    marginHorizontal: 1,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  text3: {
    width: '98%',
    color: '#4B4B4B',
    marginTop: 5,
    fontSize: hp('2%'),
    textAlign: 'right',
    fontFamily: '29LTAzer-Bold',
  },
  text: {
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2'),
    color: '#2367AB',
  },
  text4: {
    fontFamily: '29LTAzer-Regular',
    color: '#2367AB',
    fontSize: Dimensions.get('window').width * 0.03,
  },
  text2: {
    fontFamily: '29LTAzer-Medium',
    fontSize: Dimensions.get('window').width * 0.027,
    color: '#2367AB',
    // marginVertical: 2,
  },
  weight: {
    color: '#4B4B4B',
    textAlign: 'center',
    fontSize: Dimensions.get('window').width * 0.03,
    fontFamily: '29LTAzer-Regular',
  },
  weightContainer: {
    width: 38,
    height: 38,
    borderRadius: 4,
    borderColor: '#3C88C0',
    borderWidth: 1,
    backgroundColor: '#E4E4E4',
    marginTop: Dimensions.get('window').height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.025,
    color: '#A9A9A9',
  },
  objectivetext: {
    textAlign: 'center',
    fontSize: hp('.9'),
    alignSelf: 'center',
    fontFamily: '29LTAzer-Medium',
  },
  containerObjective: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  label: {
    color: '#B7CFD7',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.025,
    transform: [{ rotateY: '180deg' }],
  },
  value: {
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.025,
    transform: [{ rotateY: '180deg' }],
  },
  textContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: '#bfd8e0',
  },
  text1: {
    fontSize: Dimensions.get('window').width * 0.025,
    color: '#B7CFD7',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    marginHorizontal: 5,
    textAlign: 'right',
    flex: 1,
    transform: [{ rotateY: '180deg' }],
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CECECE',
    marginHorizontal: 2,
  },
  active: {
    width: 13,
    height: 6,
    borderRadius: 3,
  },
  inActive: {
    width: Dimensions.get('window').width * 0.01,
    height: Dimensions.get('window').width * 0.01,
    borderRadius: (Dimensions.get('window').width * 0.01) / 2,
  },
});
