import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { showMessage } from 'react-native-flash-message';
import { stat } from 'react-native-fs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
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
import * as trainingActions from '../../../redux/action/trainingAction';
import * as trainingRequestActions from '../../../redux/action/trainingAction';
import { TRAINING_TRAVEL_DAYS } from '../../../redux/reducer/trainingReducer';
import {
  baseUrl,
  DEGREE_ID,
  DEPT_ID,
  getStatus,
  GRADE_ID,
  JOB_ID,
  TYPE_ID,
} from '../../../services';
import { pick } from '../../../services/AttachmentPicker';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
const TrainingRequest = (props) => {
  let { item } = props;
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [isDatePickerVisibletwo, setDatePickerVisibilitytwo] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modal2, setModal2] = useState(false);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [height3, setHeight3] = useState(40);
  const [height4, setHeight4] = useState(40);
  const [height5, setHeight5] = useState(40);
  const [state, setState] = useState({
    dateone: '',
    datetwo: '',
    currencySelected: '',
    currencyId: '',
    currencyDataList: [],
    reason: null,
    allAvailableCities: [],
    travelDaysSettingTypes: [
      { label: 'بعد نهاية التدريب', value: 'after_training' },
      {
        label: 'قبل بداية التدريب',
        value: 'before_training',
      },
    ],
    leaveTypeData: [],
    travel_days: 1,
    countryId: '',
    countrySelected: '',
    countryList: [],
    cityId: '',
    showModal: false,
    citySelected: '',
    fillOne: false,
    fillTwo: false,
    courseName: '',
    type: 'local',
    trainingType: 'paid',
    courseFees: '',
    centerName: '',
    courseContent: '',
    filename: [],
    duration: 0,
    cityPlaceholder: '',
    currencyPlaceholder: '',
    alternateEmployeeData: [],
    alternateEmployeeSelected: '',
    alternateEmployeeSelectedId: '',
    arrayData: [],
    isValidated: false,
    city: '',
    travel_days_setting: '',
    visible1: false,
    visible2: false,
    visible3: false,
    endDateDisabled: true,
  });

  const [lastUpdate, setLastUpdate] = useState('');

  const dispatch = useDispatch();

  const currencyType = useSelector(
    (state) => state.TrainingReducer.currencyType,
  );

  const mTravelDays = useSelector((state) => state.TrainingReducer.travelDays);
  const allAternateEmployeeData = useSelector(
    (state) => state.TrainingReducer.allAternateEmployeeData,
  );

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );
  const trainingRequestResponse = useSelector(
    (state) => state.TrainingReducer.trainingRequestResponse,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const deptId = useSelector((state) => state.LoginReducer.deptId);
  const managerID = useSelector((state) => state.LoginReducer.managerId);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Training_Request_Screen');
    }
  }, [isFocused]);
  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url = `${baseUrl}/api/read/last_update?res_model=hr.training.request&res_id=${item.id}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        // console.log('asd@response', response);

        const data = await response.json();
        // console.log('asd@data', data);
        let newdata = finalArray(data);
        setTimelineData(newdata);
        setModalVisible(true);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    // const unsubscribe = props.navigation.addListener('focus', () => {
    // ClearPushNotification();
    //
    if (item) {
      setState({
        ...state,
        trainingType: item.financial_type,
      });
      //`${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=06968`;
    }
    // });
  }, [item]);

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
    dispatch({ type: TRAINING_TRAVEL_DAYS, value: 1 });
    if (props && props.item) {
      item = props.item;
      let fillOne = false;
      let fillTwo = false;
      if (item.type === 'local') {
        fillTwo = true;
      } else {
        fillOne = true;
      }
      setState({
        ...state,
        citySelected: item.city_id ? item.city_id[1] : '',
        cityPlaceholder: item.city_id ? item.city_id[1] : item.city,
        countrySelected: item.country_id ? item.country_id[1] : '',
        dateone: item.date_from,
        datetwo: item.date_to,
        courseName: item.name,
        duration: item.duration,
        centerName: item.training_center,
        courseFees: item.amount.toString(),
        travel_days: item.travel_days,
        type: item.type,
        fillOne,
        fillTwo,
        courseContent: item.programme_session,
        attachment_ids: item.attachment_ids,
        currencyPlaceholder: item.currency_id[1],
        alternateEmployeeSelectedId: item.substitute_employee_id[1],
        reason: item.reason ? item.refuse_reason : '',
        city: item.city,
        trainingType: item.financial_type,
      });
    } else {
      dispatch(trainingActions.getCountries(accessToken));
      dispatch(trainingActions.getCities(accessToken, null));
      dispatch(trainingActions.getCurrencyTypes(accessToken));
      if (deptId)
        dispatch(
          trainingActions.getAlternateEmployee(
            accessToken,
            deptId[0]['department_id'][0],
            managerID[0].parent_id[0],
          ),
        );
    }
  }, [props.navigation]);

  const ConvertToArabicNumbers = (num) => {
    const arabicNumbers =
      '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
    return new String(num).replace(/[0123456789]/g, (d) => {
      return arabicNumbers[d];
    });
  };

  const ConvertToEnglishNumbers = (num) => {
    const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
    return num
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632;
      })
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776;
      });
  };

  const handleCurrencyTypes = (value, index) => {
    setId1(index);
    setState({
      ...state,
      currencySelected: value,
      currencyId: value,
    });
  };

  useEffect(() => {
    if (typeof currencyType === 'object' && currencyType.length) {
      let data = [];
      currencyType.map((item) => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.name,
        });
      });
      setState({
        ...state,
        currencyDataList: data,
        currencySelected: data[2]?.id,
      });
    }
  }, [currencyType]);

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

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const allCities = useSelector((state) => state.TrainingReducer.allCities);

  useEffect(() => {
    if (typeof allCities === 'object' && allCities.length) {
      let data = [];
      allCities.map((item) => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        allAvailableCities: data,
        citySelected: null,
      });
    }
  }, [allCities]);

  const handleCities = (value, index) => {
    setId2(index);

    setState({
      ...state,
      citySelected: value,
      cityId: value,
      city: index && state.allAvailableCities[index - 1].label,
      travel_days: 1,
    });
  };

  const allCountries = useSelector(
    (state) => state.TrainingReducer.allCountries,
  );

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
    setId3(index);
    setState({
      ...state,
      countrySelected: value,
      countryId: value,
    });
    dispatch(trainingActions.getCities(accessToken, value));
    if (value) {
      let empID = await AsyncStorage.getItem('empID');
      dispatch(
        trainingActions.getTravelDays({
          accessToken: accessToken,
          employee_id: empID,
          country_id: value,
        }),
      );
    }
    // }
  };

  useEffect(() => {
    if (mTravelDays) {
      setState({
        ...state,
        travel_days:
          state.citySelected || state.countrySelected ? mTravelDays : 0,
      });
    }
  }, [mTravelDays]);

  const showDatePickerone = () => {
    setDatePickerVisibilityone(true);
  };

  const hideDatePickerone = () => {
    setDatePickerVisibilityone(false);
  };

  const showDatePickertwo = () => {
    setDatePickerVisibilitytwo(true);
  };

  const hideDatePickertwo = () => {
    setDatePickerVisibilitytwo(false);
  };

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
  };
  const handleConfirmtwo = (date) => {
    let b = moment(date).format('MM/DD/YYYY');
    setDate2(date);

    setState({ ...state, datetwo: b, visible3: false });
  };

  useEffect(() => {
    if (
      typeof trainingRequestResponse === 'object' &&
      trainingRequestResponse.length
    ) {
      dispatch(trainingRequestActions.emptyTrainingData());
      setState({ ...state, showModal: true });
    } else if (
      typeof trainingRequestResponse === 'object' &&
      Object.keys(trainingRequestResponse).length
    ) {
      dispatch(trainingRequestActions.emptyTrainingData());
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: trainingRequestResponse.message
          ? trainingRequestResponse.message.replace('None', '')
          : 'حصل خطأ ما حاول مرة أخرى',
      });
    }
  }, [trainingRequestResponse]);

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
  useEffect(() => {
    if (
      state.city &&
      state.courseName.length > 0 &&
      (state.travel_days === 1
        ? state.travel_days_setting && state.travel_days_setting.length
        : true) &&
      state.centerName.length > 0 &&
      state.courseContent?.length > 0 &&
      (state.type === 'local' ? id2 : true) &&
      (state.type === 'international' ? id3 >= 0 : true) &&
      (state.trainingType === 'paid' ? state.courseFees : true) &&
      date1 &&
      date1.length !== 0 &&
      date2 &&
      date2.length !== 0 &&
      id1
    ) {
      setIsInActive(false);
    } else setIsInActive(true);
  }, [state, date1, date2, id2, id1, id3]);

  const handleTrainingRequest = async () => {
    if (isLoading) {
      return;
    }
    setModal2(false);
    setState({ ...state, isValidated: true });
    dispatch(loadingAction.commonLoader(true));
    let empID = await AsyncStorage.getItem('empID');
    let mJOB_ID = await AsyncStorage.getItem(JOB_ID);
    let mDEPT_ID = await AsyncStorage.getItem(DEPT_ID);
    let mDEGREE_ID = await AsyncStorage.getItem(DEGREE_ID);
    let mGRADE_ID = await AsyncStorage.getItem(GRADE_ID);
    let mTYPE_ID = await AsyncStorage.getItem(TYPE_ID);
    if (
      state.courseName.length &&
      (state.travel_days === 1 ? state.travel_days_setting.length : true) &&
      state.currencySelected &&
      state.centerName.length &&
      state.courseContent?.length &&
      state.city?.length &&
      (state.type === 'international' ? state.countrySelected : true) &&
      (state.trainingType == 'paid' ? state.courseFees > 1 : true) &&
      date1 &&
      date2
    ) {
      let {
        courseName,
        cityId,
        countryId,
        type,
        duration,
        travel_days,
        travel_days_setting,
        courseFees,
        centerName,
        courseContent,
        currencySelected,
        alternateEmployeeSelectedId,
        arrayData,
        city,
        trainingType,
      } = state;

      let data = {
        values: {
          job_id: mJOB_ID,
          department_id: mDEPT_ID,
          degree_id: mDEGREE_ID,
          grade_id: mGRADE_ID,
          type_id: mTYPE_ID,
          employee_id: empID,
          name: courseName,
          type: type,
          travel_days: travel_days.toString(),
          travel_days_setting: travel_days === 1 ? travel_days_setting : '',
          amount: courseFees,
          country_id: countryId,
          duration: duration,
          training_center: centerName,
          currency_id: currencySelected,
          date_from: moment(date1).format('MM/DD/YYYY'),
          date_to: moment(date2).format('MM/DD/YYYY'),
          programme_session: courseContent,
          substitute_employee_id: alternateEmployeeSelectedId,
          city: city,
          is_from_mobile: true,
          financial_type: trainingType,
        },
        accessToken: accessToken,
      };
      if (state.type === 'local') {
        data.values['city_id'] = cityId;
      }
      if (arrayData) {
        data['attachments'] = arrayData;
      }
      // const res = await CheckAltEmp(data.values, accessToken);
      //console.log(res, "res");
      // if (res == null) {
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(trainingActions.TrainingRequestSubmit(data));

      // } else {
      //   showMessage({
      //     style: { alignItems: "flex-end", fontFamily: "29LTAzer-Regular" },
      //     type: "danger",
      //     message: res.warning.message,
      //   });
      // }
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

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    // if (groupIds.indexOf(21) > -1 /*&& item.state === 'hr_master'*/) {
    //   mAction = "hr_master_accept";
    // } else if (groupIds.indexOf(22) > -1 /*&& item.state === 'vp_hr_master'*/) {
    //   mAction = "action_vp_hr_master";
    // } else if (groupIds.indexOf(20) > -1 /*&& item.state === 'gm_humain'*/) {
    //   mAction = "action_gm_humain";
    // } else if (groupIds.indexOf(95) > -1 /*&& item.state === 'sm'*/) {
    //   mAction = "action_sm";
    // } else if (groupIds.indexOf(19) > -1 /*&& item.state === 'dm'*/) {
    //   mAction = "action_dm";
    // }

    //before changes
    // if (groupIds.indexOf(21) > -1 /*&& item.state === 'hr_master'*/) {
    //   mAction = "hr_master_accept";
    // }
    if (groupIds.indexOf(21) > -1 && item.state === 'hr_master') {
      mAction = 'hr_master_accept';
    } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
      mAction = 'action_vp_hr_master';
    } else if (groupIds.indexOf(20) > -1 && item.state === 'gm_humain') {
      mAction = 'action_gm_humain';
    } else if (groupIds.indexOf(95) > -1 && item.state === 'sm') {
      mAction = 'action_sm';
    } else if (groupIds.indexOf(19) > -1 && item.state === 'dm') {
      mAction = 'action_dm';
    }
    if (mAction) {
      let data = {
        id: item.id,
        action: mAction,
      };
      dispatch(trainingActions.approve(data, accessToken));
      dispatch(loadingAction.commonLoader(true));
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
      dispatch(trainingActions.reject(data, accessToken));
      dispatch(loadingAction.commonLoader(true));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'سبب الرفض مطلوب',
      });
    }
  };

  async function openDocument(attachmentIds) {
    checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      async (statuses) => {
        if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
            RESULTS.GRANTED ||
          Platform.OS === 'ios'
        ) {
          await attachmentIds.map(async (attachmentId) => {
            dispatch(loadingAction.commonLoader(true));
            const attachmentInfo = await fetch(
              baseUrl +
                `/api/search_read/ir.attachment?domain=[["id","=",${attachmentId}]]&fields=["extension","name"]`,
              {
                method: 'GET',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              },
            ).then((response) => response.json());
            if (Platform.OS === 'ios') {
              const { extension, name } = attachmentInfo[0];
              const { dirs } = RNFetchBlob.fs;
              const dirToSave =
                Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
              const configfb = {
                fileCache: true,
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: name,
                path: `${dirToSave}/${name}${extension}`,
              };
              const configOptions = Platform.select({
                ios: {
                  fileCache: configfb.fileCache,
                  title: configfb.title,
                  path: configfb.path,
                  appendExt: '',
                },
                android: configfb,
              });
              RNFetchBlob.config(configOptions)
                .fetch(
                  'GET',
                  baseUrl + '/api/attachment/download/' + attachmentId,
                  {
                    Authorization: 'Bearer ' + accessToken,
                  },
                )
                .the((res) => {
                  if (Platform.OS === 'ios') {
                    RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    setTimeout(async () => {
                      RNFetchBlob.ios
                        .previewDocument(configfb.path)
                        .then((res) => console.log(res, 'download'));
                    }, 500);
                  }
                  if (Platform.OS == 'android') {
                  }
                  dispatch(loadingAction.commonLoader(false));
                  showMessage({
                    style: {
                      alignItems: 'flex-end',
                      fontFamily: '29LTAzer-Regular',
                    },
                    type: 'success',
                    message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
                  });
                })
                .catch((e) => {
                  //console.log("The file saved to ERROR", e.message);
                });
            } else {
              let flag = [];
              await attachmentIds.map(async (attachmentId) => {
                dispatch(loadingAction.commonLoader(true));
                const { config, fs } = RNFetchBlob;
                let mDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
                let options = {
                  fileCache: true,
                  addAndroidDownloads: {
                    useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                    notification: true,
                    path: mDir + '/training/', // this is the path where your downloaded file will live in
                    description: 'Downloading file.',
                  },
                };
                await config(options)
                  .fetch(
                    'GET',
                    baseUrl + '/api/attachment/download/' + attachmentId,
                    {
                      Authorization: 'Bearer ' + accessToken,
                    },
                  )
                  .then((res) => {
                    flag.push(true);
                    if (flag.length === attachmentIds.length) {
                      dispatch(loadingAction.commonLoader(false));
                      showMessage({
                        style: {
                          alignItems: 'flex-end',
                          fontFamily: '29LTAzer-Regular',
                        },
                        type: 'success',
                        message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
                      });
                    }
                  })
                  .catch((err) => {
                    flag.push(false);
                    if (flag.length === attachmentIds.length) {
                      dispatch(loadingAction.commonLoader(false));
                      showMessage({
                        style: {
                          alignItems: 'flex-end',
                          fontFamily: '29LTAzer-Regular',
                        },
                        type: 'danger',
                        message: 'غير قادر على تحميل',
                      });
                    }
                  });
              });
            }
          });
        } else {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
          });
        }
      },
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={{}}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
        }}
      >
        <View style={{ width: '90%', marginBottom: 16 }}>
          {true && item ? (
            <OrderViewItem
              title1="رقم الطلب"
              title2={item['number']}
              icon={require('../../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="تاريخ الطلب"
              title2={moment(item.date).format('D-MM-Y')}
              icon={require('../../../assets/images/order/date.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="الحالة"
              title2={getStatus('Training', item.state)['statusText']}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item && item.refuse_reason ? (
            <OrderViewItem
              title1="سبب الرفض"
              title2={item.refuse_reason}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {false !== true && item ? (
            <OrderViewItem
              title1="صاحب الطلب"
              title2={item.employee_id[1].split(']')[1]}
              icon={require('../../../assets/images/order/category2.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}

          {/* {true && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الإدارة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.department_id ? item.department_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {true && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الوظيفة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.job_id ? item.job_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {true && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الصنف</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.type_id ? item.type_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {true && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>المرتبة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.grade_id ? item.grade_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {true && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الدرجة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.degree_id ? item.degree_id[1] : "-"}
                </Text>
              </View>
            ) : null} */}

          <OrderViewItem
            title1="مسمى الدورة"
            title2={item.name}
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <View style={styles.heading}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  alignSelf: 'flex-end',
                  marginBottom: 5,
                },
              ]}
            >
              آلية الانعقاد
            </Text>
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[
                styles.mandateTypebtn,
                {
                  backgroundColor:
                    item.type === 'international' ? '#008AC5' : '#FFFFFF',
                },
              ]}
              onPress={() => {
                false
                  ? setState({
                      ...state,
                      type: 'international',
                      allAvailableCities: [],
                      city: '',
                      travel_days: 1,
                      travel_days_setting: null,
                    })
                  : // : dispatch(trainingActions.getCountries(accessToken, null));

                    null;
              }}
            >
              <Text
                style={[
                  styles.mandateTypeText,
                  {
                    color: item.type == 'international' ? '#FCFCFC' : 'gray', //E4E4E4
                  },
                ]}
              >
                دولي
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mandateTypebtn,
                {
                  backgroundColor:
                    item.type === 'local' ? '#008AC5' : '#FFFFFF',
                },
              ]}
              onPress={() => {
                if (false) {
                  setState({
                    ...state,
                    type: 'local',
                    city: '',
                    travel_days: 1,
                    travel_days_setting: null,
                  });
                  dispatch(trainingActions.getCities(accessToken, null));
                }
              }}
            >
              <Text
                style={[
                  styles.mandateTypeText,
                  { color: item.type == 'local' ? '#FCFCFC' : 'gray' },
                ]}
              >
                محلي
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heading}>
            <Text
              style={[
                styles.text,
                { fontSize: 16, alignSelf: 'flex-end', marginBottom: 5 },
              ]}
            >
              نوع التديب
            </Text>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[
                styles.mandateTypebtn,
                {
                  backgroundColor:
                    item.financial_type === 'free' ? '#008AC5' : '#FFFFFF',
                },
              ]}
              onPress={() => {
                false
                  ? setState({
                      ...state,
                      trainingType: 'free',
                      courseFees: 0,
                      currencySelected: '152',
                    })
                  : // : dispatch(trainingActions.getCountries(accessToken, null));
                    null;
              }}
            >
              <Text
                style={[
                  styles.mandateTypeText,
                  {
                    color: item.financial_type == 'free' ? '#FCFCFC' : 'gray',
                  },
                ]}
              >
                مجانى
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mandateTypebtn,
                {
                  backgroundColor:
                    item.financial_type === 'paid' ? '#008AC5' : '#FFFFFF',
                },
              ]}
              onPress={() => {
                if (false) {
                  setState({
                    ...state,
                    trainingType: 'paid',
                  });
                  dispatch(trainingActions.getCities(accessToken, null));
                }
              }}
            >
              <Text
                style={[
                  styles.mandateTypeText,
                  {
                    color: item.financial_type == 'paid' ? '#FCFCFC' : 'gray',
                  },
                ]}
              >
                غير مجانى
              </Text>
            </TouchableOpacity>
          </View>
          <OrderDateViewItem
            title1="التاريخ"
            startDate={moment(item.date_from).format('DD-MM-YYYY')}
            endDate={moment(item.date_to).format('DD-MM-YYYY')}
            duration={item.duration}
            icon={require('../../../assets/images/order/date.png')}
          />
          <OrderViewItem
            title1="مركز التدريب"
            title2={item.training_center}
            icon={require('../../../assets/images/order/id.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {item.financial_type == 'paid' && (
            <OrderViewItem
              title1="قيمة الدورة"
              title2={
                item.amount
                  .toString()
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                ' ' +
                item.currency_id[1]
              }
              icon={require('../../../assets/images/order/date.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}

          <OrderViewItem
            title1="أيام السفر"
            title2={item.travel_days ? item.travel_days + ' أيام' : '--'}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="المدينة"
            title2={item.city_id ? item.city_id[1] : '--'}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {item.travel_days === 1 && (
            <OrderViewItem
              title1="تحديد يوم السفر"
              title2={state.travel_days_setting}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}
          <OrderViewItem
            title1="برنامج الدورة"
            title2={item.programme_session}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="الموظف البديل"
            title2={
              item.substitute_employee_id
                ? item.substitute_employee_id[1].split(']')[1]
                : '-'
            }
            icon={require('../../../assets/images/order/id.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {item.type === 'international' && (
            <OrderViewItem
              title1="الدولة"
              title2={item.country_id[1]}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}
        </View>

        <View></View>

        <View style={{ width: '90%' }}>
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
                              width: '90%',
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
          <View style={{ flex: 1, marginTop: 22 }}>
            <TouchableOpacity
              onPress={() => getHistoryApprove()}
              style={{
                alignSelf: 'center',
                padding: 8,
                width: '55%',
                marginVertical: 5,
                alignItems: 'center',
                flexDirection: 'row-reverse',
                justifyContent: 'center',
                borderRadius: 25,
                borderWidth: 1,
                borderColor: '#008AC5',
              }}
            >
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
              // animationType={"slide"}
              hasBackdrop={true}
              // transparent={true}
              //  backdropTransitionInTiming={300}
              //  backdropTransitionOutTiming={300}
              backdropOpacity={0.8}
              backdropColor="black"
              animationIn="fadeIn"
              animationOut="fadeOut"
              // coverScreen={false}
              // deviceHeight={Dimensions.get('screen').height}
              // backdropColor={"black"}
              // visible={state.visible1}
              // hardwareAccelerated={true}

              // animationDuration={500}
            >
              {/* <TouchableWithoutFeedback
  onPress={() => setModalVisible(false)
  }
    > */}
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
        {true ? (
          props.viewType === 'approval' ? null : item.reason ? (
            <OrderViewItem
              title1="تعليق"
              title2={item.reason ? item.refuse_reason : ''}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null
        ) : null}
      </View>

      <CommonPopup
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setState({ ...state, showModal: false });
          // props.navigation.goBack();
          props.navigation.popToTop();
        }}
      />
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
          false ? handleTrainingRequest() : approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />

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
                    customStyleData={[styles.input, { height: height5 }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight5(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  width: '90%',
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

export default TrainingRequest;
const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    // paddingRight: wp('4%'),
  },
  btnPrimary: {
    width: '90%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    backgroundColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007598',
  },
  btnDanger: {
    borderColor: '#20547A',
    borderRadius: 5,
    borderWidth: 1,
    width: '90%',
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
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
    fontFamily: '29LTAzer-Regular',
  },
  mandateTypebtn: {
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
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
  dateStyle: {
    width: '90%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#e2e2e2',
    borderWidth: 1,
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
  text: {
    color: '#99b4c8',
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
    alignSelf: 'center',
  },
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
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
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
  },
});
