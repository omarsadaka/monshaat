import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../../assets/style/AppStyle';
import CommonDropdown from '../../../components/CommonDropdown';
import CommonFormButton from '../../../components/CommonFormButton';
import CommonPopup from '../../../components/CommonPopup';
import CommonTextInput from '../../../components/CommonTextInput';
import Loader from '../../../components/loader';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewAttatchment from '../../../components/OrderViewAttatchment';
import OrderViewItem from '../../../components/OrderViewItem';
import OrderDateViewItem from '../../../components/OrderDateViewItem';

import * as loadingAction from '../../../redux/action/loadingAction';
import * as MandateRequestActionPost from '../../../redux/action/MandateRequestSubmitAction';
import * as trainingActions from '../../../redux/action/trainingAction';
import { DEPUTATION_TRAVEL_DURATION } from '../../../redux/reducer/MandateTypeReducer';
import { baseUrl, getStatus } from '../../../services';
import { pick } from '../../../services/AttachmentPicker';
import { CheckAltEmp } from '../../../services/checkAltEmp';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../../utils/clearPushNotification';

let item = null;
let viewType = 'new';
const MandateRequest = (props) => {
  let { item } = props;
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [isDatePickerVisibletwo, setDatePickerVisibilitytwo] = useState(false);
  const [multiCities, setMultiCities] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [height3, setHeight3] = useState(40);
  const [height4, setHeight4] = useState(40);
  const [height5, setHeight5] = useState(40);
  const [height6, setHeight6] = useState(40);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [id4, setId4] = useState(0);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    dateone: '',
    datetwo: '',
    taskName: '',
    distance: 0,
    allAvailableCities: [],
    allMandateTypesData: [],
    travelDaysSettingTypes: [
      { label: 'بعد الانتداب', value: 'after_deputation' },
      {
        label: 'قبل الانتداب',
        value: 'before_deputation',
      },
    ],
    citySelected: '',
    citySelectedName: '',
    cityId: '',
    countryId: '',
    countrySelected: '',
    countryList: [],
    deputationSelected: '',
    deputationID: '',
    fillOne: false,
    fillTwo: false,
    fillThree: false,
    transportation_type: 'overland',
    type: 'internal',
    fillFour: false,
    placeholderDeputation: '',
    placeholderCity: '',
    showModal: false,
    filename: [],
    description: '',
    travel_days: 0,
    travel_days_setting: '',
    duration: 0,
    alternateEmployeeData: [],
    alternateEmployeeSelected: '',
    alternateEmployeeSelectedId: '',
    mDeputationLocation: '',
    arrayData: [],
    reason: null,
    isValidated: false,
    visible1: false,
    visible2: false,
    visible3: false,
  });
  const [timelineData, setTimelineData] = useState('');

  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const deputationLocation = useSelector(
    (state) => state.MandateTypeReducer.deputationLocation,
  );
  const deputationTravelDays = useSelector(
    (state) => state.MandateTypeReducer.deputationTravelDuration,
  );

  const mandateRequestResponse = useSelector(
    (state) => state.MandateTypeReducer.mandateRequestResponse,
  );
  const allCities = useSelector((state) => state.TrainingReducer.allCities);

  const allMandateTypes = useSelector(
    (state) => state.MandateTypeReducer.deputationTypes,
  );

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const allCountries = useSelector(
    (state) => state.TrainingReducer.allCountries,
  );

  const allAternateEmployeeData = useSelector(
    (state) => state.TrainingReducer.allAternateEmployeeData,
  );

  const deptId = useSelector((state) => state.LoginReducer.deptId);
  const managerID = useSelector((state) => state.LoginReducer.managerId);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Mandate_Request_Screen');
    }
  }, [isFocused]);

  const getHistoryApprove = async () => {
    if (item) {
      setLoading(true);
      try {
        let url = `${baseUrl}/api/read/last_update?res_model=hr.deputation&res_id=${item.id}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const data = await response.json();
        let newdata = finalArray(data);
        setTimelineData(newdata);
        setLoading(false);
        setModalVisible(true);
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
    }
  };

  const finalArray = (data) => {
    return data.map((obj) => {
      return {
        time: moment(obj.create_date).format('D-MM-Y hh:mm:ss'),
        title: obj.old_value_char == 'طلب' ? ' صاحب الطلب' : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };

  useEffect(() => {
    dispatch({ type: DEPUTATION_TRAVEL_DURATION, value: 1 });
    // const unsubscribe = props.navigation.addListener('focus', () => {
    if (item) {
      // console.log('itemitemitem', item);
      let fillOne = false;
      let fillTwo = false;
      let fillThree = false;
      let fillFour = false;
      if (item.type === 'internal') {
        fillTwo = true;
      }
      if (item.type === 'external') {
        fillOne = true;
      }
      if (item.transportation_type === 'air_travel') {
        fillThree = true;
      } else {
        fillFour = true;
      }
      setState({
        ...state,
        fillOne,
        fillTwo,
        fillFour,
        fillThree,
        type: item.type,
        transportation_type: item.transportation_type,
        placeholderDeputation: item.deputation_type[1],
        deputationID: item.deputation_type[1],
        citySelected: item.city_id[1],
        description: item.note,
        travel_days: item.travel_days.toString(),
        duration: item.duration,
        placeholderCity: item.city_id[1],
        countrySelected: item.country_id ? item.country_id[1] : '',
        taskName: item.task_name,
        dateone: item.date_from,
        datetwo: item.date_to,
        attachment_ids: item.attachment_ids,
        alternateEmployeeSelectedId: item.substitute_employee_id[1],
        reason: item.reason ? item.reason : '',
        distance: item.distance,
        cancel_reason: item.cancel_reason ? item.cancel_reason : '',
      });
      viewType = props.viewType;
      if (item.location_ids)
        dispatch(MandateRequestActionPost.getLocation(accessToken, item.id));
    } else {
      dispatch(MandateRequestActionPost.getMandateType(accessToken));
      dispatch(trainingActions.getCountries(accessToken, null));
      dispatch(trainingActions.getCities(accessToken, null));
      if (deptId)
        dispatch(
          trainingActions.getAlternateEmployee(
            accessToken,
            deptId[0]['department_id'][0],
            managerID[0].parent_id[0],
          ),
        );
    }
    // });

    // return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (typeof deputationLocation === 'object' && deputationLocation.length) {
      setState({ ...state, mDeputationLocation: deputationLocation[0] });
    }
  }, [deputationLocation]);
  useEffect(() => {
    if (
      typeof allAternateEmployeeData === 'object' &&
      allAternateEmployeeData.length
    ) {
      let data = [];
      allAternateEmployeeData.map((item) => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.complete_name,
        });
      });
      setState({
        ...state,
        alternateEmployeeData: data,
        alternateEmployeeSelected: null,
      });
    }
  }, [allAternateEmployeeData]);

  useEffect(() => {
    if (
      typeof mandateRequestResponse === 'object' &&
      mandateRequestResponse.length
    ) {
      dispatch(MandateRequestActionPost.emptyMandateRequest());
      setState({ ...state, showModal: true });
    } else if (
      typeof mandateRequestResponse === 'object' &&
      Object.keys(mandateRequestResponse).length
    ) {
      dispatch(MandateRequestActionPost.emptyMandateRequest());
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: mandateRequestResponse.message
          ? mandateRequestResponse.message.replace('None', '')
          : 'حصل خطأ ما حاول مرة أخرى',
      });
    }
  }, [mandateRequestResponse]);

  useEffect(() => {
    if (typeof allMandateTypes === 'object' && allMandateTypes.length) {
      let data = [];
      allMandateTypes.map((item) => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        allMandateTypesData: data,
        deputationSelected: null,
      });
    }
  }, [allMandateTypes]);

  useEffect(() => {
    if (typeof allCountries === 'object' && allCountries.length) {
      let data = [];
      allCountries.map((item) => {
        data.push({ id: item.id, value: item.id, label: item.display_name });
      });
      setState({
        ...state,
        countryList: data,
        countrySelected: null,
      });
    }
  }, [allCountries]);

  const handleOnCountrySelect = async (value, index) => {
    //console.log("bvalue", value, state.countryList);
    // if (index) {
    setId3(index);
    setState({
      ...state,
      countrySelected: value,
      countryId: value,
    });
    if (value) {
      dispatch(trainingActions.getCities(accessToken, value));
      dispatch(
        MandateRequestActionPost.getTravelDays({
          accessToken: accessToken,
          country_id: value,
          employee_id: await AsyncStorage.getItem('empID'),
        }),
      );
    }
    // }
  };

  useEffect(() => {
    if (deputationTravelDays) {
      setState({
        ...state,
        travel_days:
          state.citySelected || state.countrySelected
            ? deputationTravelDays
            : 0,
      });
    }
  }, [deputationTravelDays]);

  useEffect(() => {
    if (typeof allCities === 'object' && allCities.length) {
      let data = [];
      allCities.map((item) => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.name,
          country_id: item.country_id ? item.country_id[0] : 0,
        });
      });
      setState({
        ...state,
        allAvailableCities: data,
        citySelected: null,
      });
    } else if (allCities.length < 1) {
      setState({
        ...state,
        allAvailableCities: [],
        citySelected: null,
      });
    }
  }, [allCities]);

  const handleConfirmone = (date) => {
    let a = moment(date).format('MM/DD/YYYY');
    setDate1(date);
    setDate2('');
    setState({
      ...state,
      dateone: a,
      datetwo: '',
      duration: '1',
      visible2: false,
      endDateDisabled: false,
    });
    // hideDatePickerone();
  };

  const handleConfirmtwo = (date) => {
    let b = moment(date).format('MM/DD/YYYY');
    setDate2(date);

    setState({ ...state, datetwo: b, visible3: false });
    // hideDatePickertwo();
  };

  const handleMandateRequest = async () => {
    if (isLoading) {
      return;
    }
    setModal2(false);
    let location_ids = [];
    multiCities.forEach((el) => {
      let item = [
        0,
        0,
        { country_id: el.country, city_name: el.citySelectedName },
      ];
      location_ids.push(item);
    });
    setState({ ...state, isValidated: true });
    dispatch(loadingAction.commonLoader(true));
    let empID = await AsyncStorage.getItem('empID');
    if (
      date1 &&
      date2 &&
      state.duration &&
      state.duration > 0 &&
      state.taskName.length &&
      state.deputationID &&
      // (state.type === 'external' ? state.travel_days_setting : true) &&
      // (state.type === 'external' && state.travel_days == '1'
      //   ? state.travel_days_setting
      //   : true) &&
      (state.type === 'internal' ? state.cityId : multiCities.length)
    ) {
      let {
        taskName,
        deputationID,
        cityId,
        countryId,
        type,
        duration,
        travel_days,
        travel_days_setting,
        alternateEmployeeSelectedId,
        transportation_type,
        description,
        citySelectedName,
        arrayData,
        distance,
      } = state;

      let data = null;
      if (state.type === 'internal') {
        data = {
          values: {
            employee_id: empID,
            task_name: taskName,
            salary_grid_type_id: '1',
            deputation_type: deputationID,
            travel_days: travel_days.toString(),
            travel_days_setting: travel_days_setting,
            order_date: moment().format('MM/DD/YYYY'),
            type: type,
            duration: duration,
            transportation_type: transportation_type,
            date_from: moment(date1).format('MM/DD/YYYY'),
            date_to: moment(date2).format('MM/DD/YYYY'),
            location_ids: [
              [0, 0, { country_id: countryId, city_name: citySelectedName }],
            ],
            city_id: cityId,
            note: description,
            distance: distance,
            is_from_mobile: true,
          },
          accessToken: accessToken,
          cityName: citySelectedName,
          countryId: countryId,
        };
      } else {
        data = {
          values: {
            employee_id: empID,
            task_name: taskName,
            salary_grid_type_id: '1',
            deputation_type: deputationID,
            order_date: moment().format('MM/DD/YYYY'),
            type: type,
            duration: duration,
            travel_days: travel_days.toString(),
            travel_days_setting: travel_days_setting,
            transportation_type: transportation_type,
            date_from: moment(date1).format('MM/DD/YYYY'),
            date_to: moment(date2).format('MM/DD/YYYY'),
            city_id: cityId,
            country_id: countryId,
            location_ids: location_ids,
            note: description,
            substitute_employee_id: alternateEmployeeSelectedId,
            distance: distance,
            is_from_mobile: true,
          },
          accessToken: accessToken,
          cityName: citySelectedName,
        };
      }
      if (arrayData) {
        data['attachments'] = arrayData;
      }
      const res = await CheckAltEmp(data.values, accessToken, date1, date2);

      if (res == null) {
        setModal2(false);
        dispatch(loadingAction.commonLoader(true));
        dispatch(MandateRequestActionPost.MandateRequestSubmit(data));
      } else {
        dispatch(loadingAction.commonLoader(false));
        // console.log('res.warning', res.warning);
        showMessage({
          style: { alignItems: 'flex-end' },
          type: 'danger',
          message: res.warning.message ? res.warning.message : 'حصل خطأ ما ',
        });
      }
    } else {
      dispatch(loadingAction.commonLoader(false));
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }
    setModal2(false);
  };

  const handleCities = (value, index) => {
    if (index == 0) {
      setState({
        ...state,
        citySelected: value,
        cityId: value,
        travel_days: '1',
      });
      return;
    }
    setId2(index);

    setState({
      ...state,
      citySelected: value,
      cityId: value,
      citySelectedName: index && state.allAvailableCities[index - 1].label,
      countryId: index && state.allAvailableCities[index - 1].country_id,
      travel_days: '1',
    });
  };

  const handleMultiCities = () => {
    if (!state.countryId) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب اختيار الدولة اولاً',
      });
      return;
    }
    // if (!state.citySelectedName.trim().length) {
    //   showMessage({
    //     style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
    //     type: 'danger',
    //     message: 'يجب اختيار المدينة اولاً',
    //   });
    //   return;
    // }
    let item = {};
    item.cityId = state.cityId;
    item.citySelectedName = state.citySelectedName;
    item.country = state.countryId;
    let arr = multiCities;
    arr.push(item);
    setMultiCities(arr);
    setState({
      ...state,
      citySelected: 'الدولة *',
      // cityId: "الدولة *",
      citySelectedName: '',
      countrySelected: 'الدولة *',
      countryId: 'الدولة *',
    });
  };

  const deleteCity = (item) => {
    let arr = multiCities.filter(
      (el) =>
        el.citySelectedName !== item.citySelectedName ||
        el.country !== item.country,
    );
    setMultiCities(arr);
  };

  const handlemandateTypes = (value, index) => {
    // if (index) {
    setId1(index);
    setState({
      ...state,
      deputationSelected: value,
      deputationID: value,
    });
    // }
  };

  const handleAlternateEmployee = (value, index) => {
    // if (index) {
    setState({
      ...state,
      alternateEmployeeSelected: value,
      alternateEmployeeSelectedId: value,
    });
    // }
  };

  useEffect(() => {
    if (date1 && date2) {
      let now = moment(date1); //todays date
      let end = moment(date2); // another date
      let duration = moment.duration(end.diff(now));
      let days = duration.asDays() + 1;
      let diff = Math.round(days).toString();
      // console.log('diff', diff);
      setState({ ...state, duration: diff });
    }
  }, [date1, date2]);
  const addFile = async () => {
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        arrayData.push(mFile);
        filename.push({ name: mFile.name });
        setState({ ...state, arrayData, filename });
      }
    } catch (err) {
      throw err;
    }
  };

  const removeFile = (name) => {
    if (name) {
      let arrayData = [...state.arrayData];
      let filename = [...state.filename];
      let i = filename.indexOf(name);
      if (i > -1) {
        arrayData.splice(i, 1);
        filename.splice(i, 1);
        setState({ ...state, arrayData, filename });
      }
    }
  };

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    if (groupIds.indexOf(21) > -1 && item.state === 'hr_master') {
      mAction = 'hr_master_accept';
    } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
      mAction = 'action_vp_hr_master';
    } else if (groupIds.indexOf(20) > -1 && item.state === 'gm_humain') {
      mAction = 'action_gm_humain';
    } else if (groupIds.indexOf(95) > -1 && item.state === 'sm') {
      mAction = 'action_sm';
    } else if (groupIds.indexOf(19) > -1 && item.state === 'audit') {
      mAction = 'action_audit';
    }
    if (mAction) {
      let data = {
        id: item.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(MandateRequestActionPost.approve(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'ليس لديك الإذن',
      });
    }
  };

  const rejectRequest = () => {
    setReasonInputVisible(true);
  };

  const rejectConfirm = () => {
    if (state.reason) {
      setReasonInputVisible(false);
      let data = {
        id: item.id,
        reason: { refuse_reason: state.reason },
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(MandateRequestActionPost.reject(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
          }}
        >
          <View style={{ width: '90%', marginBottom: 16 }}>
            {item ? (
              <OrderViewItem
                title1="رقم الطلب"
                title2={item.seq_number}
                icon={require('../../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}
            {item ? (
              <OrderViewItem
                title1="تاريخ الطلب"
                title2={moment(item.order_date).format('D-MM-Y')}
                icon={require('../../../assets/images/order/date.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}

            {item ? (
              <OrderViewItem
                title1="الحالة"
                title2={getStatus('Mandate', item.state)['statusText']}
                icon={require('../../../assets/images/order/type.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}
            {item && item.refuse_reason ? (
              <OrderViewItem
                title1="سبب الرفض"
                title2={item.refuse_reason}
                icon={require('../../../assets/images/order/subject.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}
            {item && item.cancel_reason ? (
              <OrderViewItem
                title1="سبب الإلغاء"
                title2={item.cancel_reason}
                icon={require('../../../assets/images/order/subject.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}
            {false !== true ? (
              // && viewType === "approval"
              item ? (
                <OrderViewItem
                  title1="صاحب الطلب"
                  title2={item.employee_id[1].split(']')[1]}
                  icon={require('../../../assets/images/order/category2.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null
            ) : null}
            <View style={styles.heading}>
              <Text
                style={{ color: '#20547A', fontFamily: '29LTAzer-Regular' }}
              >
                مكان الانتداب
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[
                  styles.mandateTypebtn,
                  {
                    backgroundColor:
                      item.type === 'external' ? '#008AC5' : '#FFFFFF',
                  },
                ]}
                onPress={() =>
                  false
                    ? setState({
                        ...state,
                        type: 'external',
                        citySelectedName: '',
                        allAvailableCities: [],
                        travel_days: 0,
                        travel_days_setting: '',
                        countrySelected: '',
                      })
                    : null
                }
              >
                <Text
                  style={[
                    styles.mandateTypeText,
                    {
                      color: item.type == 'external' ? '#FCFCFC' : 'gray', //E4E4E4
                    },
                  ]}
                >
                  خارجي
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mandateTypebtn,
                  {
                    backgroundColor:
                      item.type === 'internal' ? '#008AC5' : '#ffffff',
                  },
                ]}
                onPress={() => {
                  if (false) {
                    setState({
                      ...state,
                      type: 'internal',
                      citySelectedName: '',
                      travel_days: 0,
                      travel_days_setting: '',
                      countrySelected: '',
                    });
                    dispatch(trainingActions.getCities(accessToken, null));
                  }
                }}
              >
                <Text
                  style={[
                    styles.mandateTypeText,
                    {
                      color: item.type === 'internal' ? '#FCFCFC' : 'gray',
                    },
                  ]}
                >
                  داخلي
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heading}>
              <Text
                style={{ color: '#20547A', fontFamily: '29LTAzer-Regular' }}
              >
                وسيلة النقل
              </Text>
            </View>
            <View style={[styles.rowContainer, { marginBottom: 8 }]}>
              <TouchableOpacity
                style={[
                  styles.mandateTypebtn,
                  {
                    backgroundColor:
                      item.transportation_type === 'air_travel'
                        ? '#008AC5'
                        : '#ffffff',
                  },
                ]}
                onPress={() =>
                  false
                    ? setState({
                        ...state,
                        transportation_type: 'air_travel',
                      })
                    : null
                }
              >
                <Text
                  style={[
                    styles.mandateTypeText,
                    {
                      color:
                        item.transportation_type === 'air_travel'
                          ? '#FCFCFC'
                          : 'gray',
                    },
                  ]}
                >
                  عن طريق الجو
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mandateTypebtn,
                  {
                    backgroundColor:
                      item.transportation_type === 'overland'
                        ? '#008AC5'
                        : '#ffffff',
                  },
                ]}
                onPress={() =>
                  false
                    ? setState({
                        ...state,
                        transportation_type: 'overland',
                      })
                    : null
                }
              >
                <Text
                  style={[
                    styles.mandateTypeText,
                    {
                      color:
                        item.transportation_type === 'overland'
                          ? '#FCFCFC'
                          : 'gray',
                    },
                  ]}
                >
                  براً
                </Text>
              </TouchableOpacity>
            </View>

            <OrderViewItem
              title1="نوع الانتداب"
              title2={item.deputation_type[1]}
              icon={require('../../../assets/images/order/category.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />

            {false ? (
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  onPress={
                    editableData
                      ? () => setState({ ...state, visible2: true })
                      : null
                  }
                  style={[
                    styles.dateStyle,
                    {
                      borderColor:
                        state.isValidated && !date1 ? 'red' : '#e2e2e2',
                    },
                  ]}
                >
                  <Image
                    style={{ height: 25, width: 25, tintColor: '#c2c2c2' }}
                    source={require('./../../../assets/images/date2.png')}
                  />
                  <Text style={styles.dateText}>
                    {date1
                      ? moment(date1).format('DD/MM/YYYY')
                      : 'تاريخ البداية *'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType={'slide'}
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
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          top: 220,
                        }}
                      >
                        <CalendarPicker
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
                          onDateChange={handleConfirmone}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                {/* <DateTimePickerModal
                    // minimumDate={new Date()}
                    style={{ fontFamily: "29LTAzer-Regular" }}
                    locale="ar"
                    headerTextIOS="إختر التاريخ"
                    cancelTextIOS="إلغاء"
                    confirmTextIOS="إختيار"
                    isVisible={isDatePickerVisibleone}
                    mode="date"
                    onConfirm={handleConfirmone}
                    onCancel={hideDatePickerone}
                    date={date1 ? new Date(date1) : new Date()}
                  /> */}
              </View>
            ) : (
              <OrderDateViewItem
                title1="التاريخ"
                startDate={moment(item.date_from).format('DD-MM-YYYY')}
                endDate={moment(item.date_to).format('DD-MM-YYYY')}
                duration={item.duration}
                icon={require('../../../assets/images/order/date.png')}
              />
            )}
            {false ? (
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  onPress={
                    editableData
                      ? () => setState({ ...state, visible3: true })
                      : null
                  }
                  style={[
                    styles.dateStyle,
                    {
                      borderColor:
                        state.isValidated && !date2 ? 'red' : '#e2e2e2',
                    },
                  ]}
                  disabled={state.endDateDisabled}
                >
                  <Image
                    style={{ height: 25, width: 25, tintColor: '#c2c2c2' }}
                    source={require('./../../../assets/images/date2.png')}
                  />
                  <Text style={styles.dateText}>
                    {date2
                      ? moment(date2).format('DD/MM/YYYY')
                      : 'تاريخ النهاية *'}
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType={'slide'}
                  transparent={true}
                  visible={state.visible3}
                  hardwareAccelerated={true}
                >
                  <TouchableWithoutFeedback
                    onPress={() => setState({ ...state, visible3: false })}
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
                          // enableDateChange={true}
                          // startFromSunday={true}
                          minDate={date1 ? new Date(date1) : new Date()}
                          initialDate={date1 ? new Date(date1) : new Date()}
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
                          onDateChange={handleConfirmtwo}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
                {/* <DateTimePickerModal
                    locale="ar"
                    headerTextIOS="إختر التاريخ"
                    cancelTextIOS="إلغاء"
                    confirmTextIOS="إختيار"
                    isVisible={isDatePickerVisibletwo}
                    mode="date"
                    onConfirm={handleConfirmtwo}
                    onCancel={hideDatePickertwo}
                    date={date2 ? new Date(date2) : new Date()}
                    minimumDate={date1 ? new Date(date1) : new Date()}
                  /> */}
              </View>
            ) : null}
            {false ? (
              <View
                style={{
                  flexDirection: 'row-reverse',
                }}
              >
                <View style={[styles.inputContainer, { width: '100%' }]}>
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height + 3 }]}
                    placeholder="المدة الزمنية"
                    keyboardType="numeric"
                    value={state.duration}
                    editable={false}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
                <Text
                  style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    right: 10,
                    width: 40,
                    marginHorizontal: 5,
                    color: '#18ab91',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  أيام
                </Text>
              </View>
            ) : null}
            {state.type === 'external' ? (
              <View>
                {false ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderColor:
                          state.isValidated && !multiCities.length
                            ? 'red'
                            : '#e3e3e3',
                        borderRadius: 6,
                        borderWidth: 1,
                        backgroundColor: 'white',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={state.countryList}
                      onValueChange={(value, index) =>
                        handleOnCountrySelect(value, index)
                      }
                      value={state.countrySelected}
                      placeholderText={'الدولة *'}
                      disabled={!editableData}
                    />
                  </View>
                ) : (
                  <OrderViewItem
                    title1="الدولة"
                    title2={
                      state.mDeputationLocation.country_id
                        ? state.mDeputationLocation.country_id[1]
                        : '-'
                    }
                    on={require('../../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}

                <OrderViewItem
                  title1="المدينة"
                  title2={item.city_id[1] ? item.city_id[1] : '-'}
                  icon={require('../../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {false && (
                  <View style={styles.multiCitiesContainer}>
                    <TouchableOpacity
                      onPress={handleMultiCities}
                      style={{
                        alignSelf: 'flex-end',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.cityText}>إضافة مكان الإنتداب</Text>
                      <MaterialCommunityIcons
                        name="plus"
                        size={25}
                        color="#fff"
                        style={{
                          backgroundColor: '#c2c2c2',
                          borderRadius: 5,
                          marginHorizontal: 15,
                        }}
                      />
                    </TouchableOpacity>
                    {multiCities.length > 0 && (
                      <View style={styles.multiCitiesTitles}>
                        <Text style={styles.cityText}>المدينة</Text>
                        <Text style={styles.cityText}>البلاد</Text>
                      </View>
                    )}
                    {multiCities.map((item) => (
                      <View style={styles.multiCitiesdata}>
                        <Text style={{ fontFamily: '29LTAzer-Regular' }}>
                          {item.citySelectedName}
                        </Text>
                        <Text style={{ fontFamily: '29LTAzer-Regular' }}>
                          {
                            state.countryList.filter(
                              (el) => el.value === item.country,
                            )[0].label
                          }
                        </Text>
                        <TouchableOpacity
                          style={styles.deleteCity}
                          onPress={() => {
                            deleteCity(item);
                          }}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={25}
                            color="#fff"
                            style={{
                              backgroundColor: 'red',
                              borderRadius: 10,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View>
                {false ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderColor:
                          state.isValidated && !state.citySelected
                            ? 'red'
                            : '#e3e3e3',
                        borderRadius: 6,
                        borderWidth: 1,
                        backgroundColor: 'white',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={state.allAvailableCities}
                      onValueChange={(value, index) =>
                        handleCities(value, index)
                      }
                      value={state.citySelected}
                      disabled={!editableData}
                      placeholderText={
                        state.placeholderCity
                          ? state.placeholderCity
                          : 'المدينة *'
                      }
                    />
                  </View>
                ) : (
                  <OrderViewItem
                    title1="المدينة"
                    title2={
                      state.mDeputationLocation.city_name
                        ? state.mDeputationLocation.city_name
                        : '-'
                    }
                    icon={require('../../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}
              </View>
            )}
            <View>
              {false ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: 'white',
                      height: 'auto',
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor:
                        state.isValidated && !state.taskName.length
                          ? 'red'
                          : '#e2e2e2',
                    },
                  ]}
                >
                  <CommonTextInput
                    placeholder="المهمة *"
                    customStyle={true}
                    customStyleData={[styles.input, { height: height3 }]}
                    changeText={(e) => setState({ ...state, taskName: e })}
                    value={state.taskName}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight3(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="المهمة"
                  title2={item.task_name}
                  icon={require('../../../assets/images/order/category.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
            </View>
            {false ? (
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: 'white',
                    height: 'auto',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#e2e2e2',
                  },
                ]}
              >
                <CommonTextInput
                  customStyle={true}
                  customStyleData={[styles.input, { height: height4 }]}
                  changeText={(e) => setState({ ...state, description: e })}
                  value={state.description}
                  editable={editableData}
                  placeholder="تفاصيل المهمة"
                  multiline={true}
                  onContentSizeChange={(e) =>
                    setHeight4(e.nativeEvent.contentSize.height)
                  }
                />
              </View>
            ) : (
              <OrderViewItem
                title1="تفاصيل المهمة"
                title2={item.note}
                icon={require('../../../assets/images/order/category.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            )}
            {state.transportation_type == 'overland' && (
              <View>
                <OrderViewItem
                  title1="عدد الكيلومترات"
                  title2={item.distance}
                  icon={require('../../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </View>
            )}
            <OrderViewItem
              title1="أيام السفر"
              title2={
                state.travel_days
                  ? state.travel_days + ' أيام'
                  : item?.travel_days
                  ? item?.travel_days + ' أيام'
                  : '--'
              }
              // ___________________________________________
              icon={require('../../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
            {/* {state.travel_days === 1 ? ( */}
            {state.type === 'external' && state.travel_days == '1' ? (
              false ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor:
                        state.isValidated && !state.travel_days_setting
                          ? 'red'
                          : '#e3e3e3',
                      borderRadius: 6,
                      borderWidth: 1,
                      backgroundColor: 'white',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.travelDaysSettingTypes}
                    onValueChange={(value, index) => {
                      setId4(index);
                      setState({ ...state, travel_days_setting: value });
                    }}
                    value={state.travel_days_setting}
                    disabled={true}
                    placeholderText="تحديد يوم السفر *"
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="تحديد يوم السفر"
                  title2={state.travel_days_setting}
                  icon={require('../../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )
            ) : null}
            {state.type === 'external' ? (
              <View>
                {false ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderColor: '#e3e3e3',
                        // state.isValidated && !state.alternateEmployeeSelected
                        //   ? "red"
                        //   : "#ffffff",
                        borderRadius: 6,
                        borderWidth: 1,
                        backgroundColor: 'white',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={state.alternateEmployeeData}
                      onValueChange={(value, index) =>
                        handleAlternateEmployee(value, index)
                      }
                      value={state.alternateEmployeeSelected}
                      placeholderText="الموظف البديل"
                      disabled={true}
                    />
                  </View>
                ) : (
                  <OrderViewItem
                    title1="الموظف البديل"
                    title2={state.alternateEmployeeSelectedId}
                    icon={require('../../../assets/images/order/category2.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}
              </View>
            ) : null}
            <View>
              {false ? (
                <View>
                  {state.filename.length
                    ? state.filename.map((item, index) => (
                        <View
                          style={{
                            flexDirection: 'row-reverse',
                            marginBottom: 10,
                          }}
                          key={index}
                        >
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              backgroundColor: '#efefef',
                              alignSelf: 'stretch',
                              flexGrow: 1,
                              borderRadius: 6,
                            }}
                          >
                            <View style={{ flexGrow: 1, flex: 1 }}>
                              <Text
                                style={{
                                  padding: 10,
                                  width: '100%',
                                  overflow: 'hidden',
                                  textAlign: 'right',
                                  fontFamily: '29LTAzer-Regular',
                                }}
                                numberOfLines={1}
                              >
                                {item.name}
                              </Text>
                            </View>
                            <IconFe
                              name="paperclip"
                              size={20}
                              color={'#007598'}
                              style={{
                                marginRight: 8,
                                padding: 10,
                              }}
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              removeFile(item);
                            }}
                          >
                            <IconFe
                              name="x"
                              size={20}
                              color={'red'}
                              style={{
                                marginRight: 8,
                                padding: 10,
                                backgroundColor: '#efefef',
                                borderRadius: 6,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                    : null}
                  <TouchableOpacity
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}
                    onPress={false ? addFile : null}
                  >
                    <MaterialCommunityIcons
                      name="arrow-collapse-up"
                      size={20}
                      color="#c2c2c2"
                      style={{ paddingLeft: 16 }}
                    />
                    <Text
                      style={{
                        alignSelf: 'stretch',
                        color: '#99b4c8',
                        fontFamily: '29LTAzer-Regular',
                        flexGrow: 1,
                        padding: 10,
                        textAlign: 'right',
                        alignSelf: 'center',
                      }}
                    >
                      المرفقات
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : item.attachment_ids && item.attachment_ids.length > 0 ? (
                <OrderViewAttatchment
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={item.attachment_ids}
                />
              ) : (
                <OrderViewItem
                  title1="المرفقات"
                  title2="لا يوجد مرفق"
                  icon={require('../../../assets/images/order/attatchments.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              <View style={{ flex: 1, marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    getHistoryApprove();
                  }}
                  style={{
                    alignSelf: 'center',
                    padding: 8,
                    width: '55%',

                    alignItems: 'center',
                    flexDirection: 'row-reverse',
                    justifyContent: 'center',
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: '#008AC5',
                    marginTop: 22,
                  }}
                >
                  {/* <Icon2
                          name="archive"
                          size={25}
                          color="white"
                          resizeMode="stretch"
                          style={{ right: -90 }}
                        /> */}
                  {loading ? (
                    <>
                      <Loader />
                      <Text
                        style={{
                          color: '#008AC5',
                          fontFamily: '29LTAzer-Medium',
                          fontSize: hp('2%'),
                          width: '100%',
                          marginRight: 10,
                          paddingRight: 16,
                          textAlign: 'center',
                          marginHorizontal: 10,
                        }}
                      >
                        سجل الموافقات{' '}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={{
                        color: '#008AC5',
                        fontFamily: '29LTAzer-Medium',
                        fontSize: hp('2%'),
                        width: '100%',
                        marginRight: 10,
                        paddingRight: 16,
                        textAlign: 'center',
                        marginHorizontal: 10,
                      }}
                    >
                      سجل الموافقات{' '}
                    </Text>
                  )}
                </TouchableOpacity>
                <Modal3
                  isVisible={isModalVisible}
                  onBackdropPress={() => setModalVisible(false)}
                  hasBackdrop={true}
                  backdropOpacity={0.8}
                  backdropColor="black"
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                >
                  <KeyboardAvoidingView behavior="position" enabled>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        top: 90,
                        alignSelf: 'center',
                        overflow: 'hidden',
                        marginTop: -20,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderColor: '#e3e3e3',
                          justifyContent: 'center',
                          marginVertical: 5,
                          width: '100%',
                          height: '80%',
                          top: 0,
                          paddingLeft: 15,
                          paddingRight: 15,
                          alignSelf: 'center',
                          borderRadius: 20,
                          paddingTop: 20,
                          paddingBottom: 40,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            marginVertical: 10,
                            color: '#008AC5',
                            fontFamily: '29LTAzer-Medium',
                            fontSize: 18,
                          }}
                        >
                          سجل الموافقات
                        </Text>
                        {timelineData.length ? (
                          <Timeline
                            data={timelineData}
                            circleSize={20}
                            circleColor="#008AC5"
                            lineColor="#008AC5"
                            // innerCircle={'dot'}
                            descriptionStyle={{
                              color: '#008AC5',
                              fontFamily: '29LTAzer-Medium',
                              textAlign: 'right',
                              fontSize: 17,
                            }}
                            titleStyle={{
                              color: '#898C8E',
                              fontFamily: '29LTAzer-Regular',
                              textAlign: 'right',
                              fontSize: 13,
                            }}
                            timeStyle={{
                              color: '#008AC5',
                              width: 140,
                              fontFamily: '29LTAzer-Light',
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 20,
                              fontFamily: '29LTAzer-Regular',
                            }}
                          >
                            لا يوجد سجل لهذا الطلب...
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 20,
                        }}
                      >
                        <IconFe name="x-circle" size={23} color={'#E23636'} />
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                  {/* </TouchableWithoutFeedback> */}
                </Modal3>
              </View>
            </View>
            {viewType === 'approval' ? null : state.reason ? (
              <OrderViewItem
                title1="تعليق"
                title2={state.reason ? state.reason : '-'}
                icon={require('../../../assets/images/order/id.png')}
              />
            ) : null}
          </View>
          <View style={{ width: '80%' }}>
            {false ? (
              <CommonFormButton
                disabled={
                  state.type === 'external' && state.travel_days == '1'
                    ? !(
                        date1 &&
                        date2 &&
                        state.duration &&
                        state.duration > 0 &&
                        state.taskName.length &&
                        state.deputationID &&
                        id1 &&
                        state.travel_days_setting
                      )
                    : !(
                        date1 &&
                        date2 &&
                        state.duration &&
                        state.duration > 0 &&
                        state.taskName.length &&
                        state.deputationID &&
                        id1
                      )
                }
                onPress={
                  // handleMandateRequest
                  () => {
                    setModal2(true);
                  }
                }
                {...props}
              />
            ) : null}
          </View>
        </View>
        <View style={{ backgroundColor: '#FCFCFC', width: '100%' }}></View>
      </View>
      <CommonPopup
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setTimeout(() => {
            setState({ ...state, showModal: false });
            // props.navigation.goBack();
            props.navigation.popToTop();
          }, 1000);
        }}
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          // Alert.console.log("Modal has been closed.");
        }}
      >
        {isLoading ? <Loader /> : null}
      </Modal> */}
      {Platform.OS == 'android' ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoading}
          onRequestClose={() => {
            // Alert.console.log("Modal has been closed.");
          }}
        >
          <Loader />
        </Modal>
      ) : (
        isLoading && <Loader />
      )}
      <CommonPopup
        visible={modal2}
        text={
          true
            ? 'انت على وشك الموافقة على الطلب، هل انت متأكد؟'
            : 'انت على وشك إرسال الطلب، هل انت متأكد؟'
        }
        onClose={() => {
          if (!modal2) {
            return;
          }
          false ? handleMandateRequest() : approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={reasonInputVisible}
          onRequestClose={() => {
            // Alert.console.log("Modal has been closed.");
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#00000055',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: '90%',
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 35,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View style={{ width: '100%' }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    marginBottom: 16,
                    fontWeight: 'bold',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  سبب الرفض
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: '#ffffff' },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height6 }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight6(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  style={{ ...styles.btnPrimary, width: '45%' }}
                  onPress={() => {
                    rejectConfirm();
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    إرسال
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.btnDanger, width: '45%' }}
                  onPress={() => {
                    setReasonInputVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    الغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default MandateRequest;

const styles = StyleSheet.create({
  heading: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    // paddingRight: wp('4%'),
  },
  loginBtn: {
    width: '100%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    backgroundColor: '#007598',
    borderRadius: 5,
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    backgroundColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007598',
  },
  btnTextPrimary: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  btnDanger: {
    borderColor: '#20547A',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
  },
  input: {
    // height: "100%",
    textAlign: 'right',
    paddingRight: wp('2%'),
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'right',
    marginTop: hp('1%'),
    marginRight: wp('4%'),
  },
  mandateTypebtn: {
    // paddingVertical: 16,
    // paddingHorizontal: 16,
    // textAlign: 'center',
    backgroundColor: '#90909080',
    borderRadius: 6,
    width: '49%',
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mandateTypeText: {
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',

    fontFamily: '29LTAzer-Regular',
    fontSize: hp('1.5%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  dateText: {
    marginLeft: 15,
    marginTop: 4,
    textAlign: 'right',
    width: '85%',
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    justifyContent: 'center',
    marginVertical: 5,
  },
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#dedede',
  },
  buttonStyle: {
    borderColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: 'center',
    marginVertical: 30,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  multiCitiesContainer: {
    padding: 10,
  },
  multiCitiesTitles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '89%',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  multiCitiesdata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    backgroundColor: '#90909080',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    width: '103%',
    alignSelf: 'flex-end',
    paddingLeft: 45,
  },
  deleteCity: {
    position: 'absolute',
    left: 3,
    top: '40%',
  },
  cityText: {
    fontFamily: '29LTAzer-Regular',
    color: 'red',
    fontSize: hp('2%'),
  },
});
