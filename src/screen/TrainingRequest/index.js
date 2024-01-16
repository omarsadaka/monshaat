import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
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
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as trainingActions from '../../redux/action/trainingAction';
import * as trainingRequestActions from '../../redux/action/trainingAction';
import { TRAINING_TRAVEL_DAYS } from '../../redux/reducer/trainingReducer';
import {
  baseUrl,
  DEGREE_ID,
  DEPT_ID,
  getStatus,
  GRADE_ID,
  JOB_ID,
  TYPE_ID,
} from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import OrderDateViewItem from '../../components/OrderDateViewItem';

let viewType = 'new';
let item = null;

const TrainingRequest = (props) => {
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [isDatePickerVisibleone, setDatePickerVisibilityone] = useState(false);
  const [isDatePickerVisibletwo, setDatePickerVisibilitytwo] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);

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
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      //
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        setState({
          ...state,
          trainingType: item.financial_type,
        });
        let url = `${baseUrl}/api/read/last_update?res_model=hr.training.request&res_id=${item.id}`;
        //`${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=06968`;
        (async () => {
          let secretUrl = await EncryptUrl(url);

          fetch(secretUrl, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              let newdata = finalArray(data);
              // let removedEl = newdata.shift();
              setTimelineData(newdata);
            });
        })();
      }
    });
  });

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
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        console.log('item sasasa', item);
        item = props.route.params.item;
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
        viewType = props.route.params.viewType;
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
    });

    return unsubscribe;
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
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />

      <View style={AppStyle.cardContainer}>
        <View
          style={{
            borderRadius: 8,
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: !editableData ? '#F5F5F5' : '#FFF',
          }}
        >
          <KeyboardAwareScrollView>
            <OrderHeader
              {...props}
              title="تدريب"
              icon={require('../../assets/images/tadreb.png')}
            />
            <View style={{ alignItems: 'center', paddingBottom: 16 }}>
              <View style={{ width: '100%' }}>
                {!editableData && item ? (
                  <OrderViewItem
                    title1="رقم الطلب"
                    title2={item['number']}
                    icon={require('../../assets/images/order/id.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}
                {!editableData && item ? (
                  <OrderViewItem
                    title1="تاريخ الطلب"
                    title2={moment(item.date).format('D-MM-Y')}
                    icon={require('../../assets/images/order/date.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}
                {!editableData && item ? (
                  <OrderViewItem
                    title1="الحالة"
                    title2={getStatus('Training', item.state)['statusText']}
                    icon={require('../../assets/images/order/type.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}
                {!editableData && item && item.refuse_reason ? (
                  <OrderViewItem
                    title1="سبب الرفض"
                    title2={item.refuse_reason}
                    icon={require('../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}
                {editableData !== true && item ? (
                  <OrderViewItem
                    title1="صاحب الطلب"
                    title2={item.employee_id[1].split(']')[1]}
                    icon={require('../../assets/images/order/category2.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {/* {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الإدارة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.department_id ? item.department_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الوظيفة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.job_id ? item.job_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الصنف</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.type_id ? item.type_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>المرتبة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.grade_id ? item.grade_id[1] : "-"}
                </Text>
              </View>
            ) : null}
            {!editableData && item ? (
              <View>
                <View style={styles.heading}>
                  <Text>الدرجة</Text>
                </View>
                <Text style={[styles.viewerValueText]}>
                  {item.degree_id ? item.degree_id[1] : "-"}
                </Text>
              </View>
            ) : null} */}

                {editableData ? (
                  <View>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.courseName.length
                              ? 'red'
                              : '#e2e2e2',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: height }]}
                        placeholder="مسمى الدورة *"
                        changeText={(e) =>
                          setState({
                            ...state,
                            courseName: e,
                            courseNameErr: '',
                          })
                        }
                        value={state.courseName}
                        editable={editableData}
                        multiline={true}
                        onContentSizeChange={(e) =>
                          setHeight(e.nativeEvent.contentSize.height)
                        }
                      />
                    </View>
                  </View>
                ) : (
                  <OrderViewItem
                    title1="مسمى الدورة"
                    title2={state.courseName}
                    icon={require('../../assets/images/order/category.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}
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
                          state.type === 'international' ? '#008AC5' : 'gray',
                      },
                    ]}
                    onPress={() => {
                      editableData
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
                          color:
                            state.trainingType === 'international'
                              ? '#FCFCFC'
                              : '#E4E4E4',
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
                          state.type === 'local' ? '#008AC5' : 'gray',
                      },
                    ]}
                    onPress={() => {
                      if (editableData) {
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
                    <Text style={styles.mandateTypeText}>محلي</Text>
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
                          state.trainingType === 'free' ? '#008AC5' : 'gray',
                      },
                    ]}
                    onPress={() => {
                      editableData
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
                          color:
                            state.trainingType === 'free'
                              ? '#FCFCFC'
                              : '#E4E4E4',
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
                          state.trainingType === 'paid' ? '#008AC5' : 'gray',
                      },
                    ]}
                    onPress={() => {
                      if (editableData) {
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
                          color:
                            state.trainingType === 'paid'
                              ? '#FCFCFC'
                              : '#E4E4E4',
                        },
                      ]}
                    >
                      غير مجانى
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                {editableData ? (
                  <View style={[styles.dropdownContainer]}>
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
                        source={require('./../../assets/images/date2.png')}
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
                              // enableDateChange={true}
                              // startFromSunday={true}
                              // maxDate={new Date()}
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
                              date={date1 ? new Date(date1) : new Date()}
                            />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                    {/* <DateTimePickerModal
                      // minimumDate={new Date()}
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
                ) : null}
                {editableData ? (
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
                        source={require('./../../assets/images/date2.png')}
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
                              date={date2 ? new Date(date2) : new Date()}
                              initialDate={date1 ? new Date(date1) : new Date()}
                            />
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                    {/* <DateTimePickerModal
                      style={{ fontFamily: "29LTAzer-Regular" }}
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
              </View>

              {editableData ? (
                <View style={{ width: '100%' }}>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: '#fff',
                        flexDirection: 'row-reverse',
                        justifyContent: 'space-between',
                        paddingRight: 10,
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <CommonTextInput
                      placeholder="المدة"
                      customStyle={true}
                      customStyleData={styles.input}
                      value={state.duration}
                      editable={false}
                    />
                    <Text style={styles.text}>أيام</Text>
                  </View>
                </View>
              ) : (
                <OrderDateViewItem
                  title1="التاريخ"
                  startDate={moment(state.dateone).format('DD-MM-YYYY')}
                  endDate={moment(state.datetwo).format('DD-MM-YYYY')}
                  duration={state.duration}
                  icon={require('../../assets/images/order/date.png')}
                />
              )}

              {editableData ? (
                <View style={{ width: '100%' }}>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          state.isValidated && !state.centerName
                            ? 'red'
                            : '#e2e2e2',
                      },
                    ]}
                  >
                    <CommonTextInput
                      placeholder="مركز التدريب *"
                      customStyle={true}
                      customStyleData={[styles.input, { height: height2 }]}
                      changeText={(e) =>
                        setState({ ...state, centerName: e, centerNameErr: '' })
                      }
                      editable={editableData}
                      value={state.centerName}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        setHeight2(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                </View>
              ) : (
                <OrderViewItem
                  title1="مركز التدريب"
                  title2={state.centerName}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {editableData ? (
                state.trainingType == 'paid' ? (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          borderColor:
                            state.isValidated && !state.currencyId
                              ? 'red'
                              : '#e2e2e2',
                          borderRadius: 6,
                          borderWidth: 1,
                          backgroundColor: 'white',
                          width: '35%',
                        },
                      ]}
                    >
                      <CommonDropdown
                        itemData={state.currencyDataList}
                        onValueChange={(value, index) =>
                          handleCurrencyTypes(value, index)
                        }
                        value={state.currencySelected}
                        disabled={!editableData}
                        placeholderText={
                          state.currencyPlaceholder
                            ? state.currencyPlaceholder
                            : ''
                        }
                      />
                    </View>

                    <View
                      style={[
                        styles.inputContainer,
                        {
                          width: '61%',
                          marginLeft: wp('3%'),
                          borderColor:
                            state.isValidated &&
                            (!state.courseFees.length || state.courseFees < 1)
                              ? 'red'
                              : '#e2e2e2',
                        },
                      ]}
                    >
                      <CommonTextInput
                        placeholder="قيمة الدورة *"
                        customStyle={true}
                        customStyleData={styles.input}
                        keyboardType="numeric"
                        changeText={(e) =>
                          setState({
                            ...state,
                            courseFees: ConvertToEnglishNumbers(e),
                            durationErr: '',
                          })
                        }
                        value={state.courseFees}
                        editable={editableData}
                      />
                    </View>
                  </View>
                ) : null
              ) : (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <OrderViewItem
                    title1="قيمة الدورة"
                    title2={
                      state.courseFees
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                      ' ' +
                      state.currencyPlaceholder
                    }
                    icon={require('../../assets/images/order/date.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </View>
              )}
              {/* <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor:
                        state.isValidated && !state.currencyId
                          ? 'red'
                          : '#e2e2e2',
                      borderRadius: 6,
                      borderWidth: 1,
                      backgroundColor: 'white',
                      width: '35%',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.currencyDataList}
                    onValueChange={(value, index) =>
                      handleCurrencyTypes(value, index)
                    }
                    value={state.currencySelected}
                    disabled={!editableData}
                    placeholderText={
                      state.currencyPlaceholder ? state.currencyPlaceholder : ''
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="قيمة الدورة"
                  title2={
                    state.courseFees
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                    ' ' +
                    state.currencyPlaceholder
                  }
                  icon={require('../../assets/images/order/date.png')}
                />
              )}
              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      width: '61%',
                      marginLeft: wp('3%'),
                      borderColor:
                        state.isValidated &&
                        (!state.courseFees.length || state.courseFees < 1)
                          ? 'red'
                          : '#e2e2e2',
                    },
                  ]}
                >
                  <CommonTextInput
                    placeholder="قيمة الدورة *"
                    customStyle={true}
                    customStyleData={styles.input}
                    keyboardType="numeric"
                    changeText={e =>
                      setState({
                        ...state,
                        courseFees: ConvertToEnglishNumbers(e),
                        durationErr: '',
                      })
                    }
                    value={state.courseFees}
                    editable={editableData}
                  />
                </View>
              ) : null
              // <Text style={[styles.viewerValueText, { width: "61%" }]}>
              //   {state.courseFees}
              // </Text>
              }
            </View> */}

              {state.type === 'international' ? (
                <View style={{ width: '100%' }}>
                  {editableData ? (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          backgroundColor: 'white',
                          borderWidth: 1,
                          borderRadius: 6,
                          borderColor:
                            state.isValidated && !state.countrySelected
                              ? 'red'
                              : '#e2e2e2',
                        },
                      ]}
                    >
                      <CommonDropdown
                        placeholderText
                        itemData={state.countryList}
                        onValueChange={(value, index) => {
                          return handleOnCountrySelect(value, index - 1);
                        }}
                        value={state.countrySelected}
                        placeholderText="الدولة *"
                        disabled={!editableData}
                      />
                    </View>
                  ) : (
                    <OrderViewItem
                      title1="الدولة"
                      title2={state.countrySelected}
                      icon={require('../../assets/images/order/subject.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </View>
              ) : null}

              {editableData ? (
                state.type === 'international' ? (
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          state.isValidated && !state.city ? 'red' : '#e2e2e2',
                        width: '100%',
                      },
                    ]}
                  >
                    <CommonTextInput
                      customStyle={true}
                      placeholder="المدينة *"
                      customStyleData={[styles.input, { height: height3 }]}
                      changeText={(e) => setState({ ...state, city: e })}
                      value={state.city}
                      editable={editableData}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        setHeight3(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderColor:
                          state.isValidated && !state.citySelected
                            ? 'red'
                            : '#e2e2e2',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={state.allAvailableCities}
                      onValueChange={(value, index) => {
                        handleCities(value, index);
                      }}
                      value={state.citySelected}
                      placeholderText={
                        state.cityPlaceholder
                          ? state.cityPlaceholder
                          : 'المدينة *'
                      }
                      disabled={!editableData}
                    />
                  </View>
                )
              ) : (
                <OrderViewItem
                  title1="المدينة"
                  title2={
                    state.type === 'local' ? state.cityPlaceholder : state.city
                  }
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {/* <View>
                <View style={styles.heading}>
                  <Text>أيام السفر</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#70707015",
                    flexDirection: "row-reverse",
                  }}
                >
                  <Text style={[styles.viewerValueText]}>
                    {state.travel_days}
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      position: "absolute",
                      right: 10,
                      marginHorizontal: 5,
                    }}
                  >
                    يوم
                  </Text>
                </View>
              </View> */}

              <OrderViewItem
                title1="أيام السفر"
                title2={state.travel_days ? state.travel_days + ' أيام' : '--'}
                icon={require('../../assets/images/order/subject.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              {state.travel_days === 1 ? (
                <View>
                  {editableData ? (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          backgroundColor: 'white',
                          borderWidth: 1,
                          borderRadius: 6,
                          borderColor:
                            state.isValidated && !state.travel_days_setting
                              ? 'red'
                              : '#e2e2e2',
                          width: Dimensions.get('window').width * 0.85,
                        },
                      ]}
                    >
                      <CommonDropdown
                        emp
                        itemData={state.travelDaysSettingTypes}
                        onValueChange={(value, index) => {
                          setState({ ...state, travel_days_setting: value });
                        }}
                        placeholderText="تحديد يوم السفر *"
                        value={state.travel_days_setting}
                        disabled={!editableData}
                      />
                    </View>
                  ) : (
                    <OrderViewItem
                      title1="تحديد يوم السفر"
                      title2={state.travel_days_setting}
                      icon={require('../../assets/images/order/subject.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </View>
              ) : null}
              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      width: '100%',
                      borderColor:
                        state.isValidated && !state.courseContent.length
                          ? 'red'
                          : '#e2e2e2',
                    },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height4 }]}
                    changeText={(e) =>
                      setState({
                        ...state,
                        courseContent: e,
                        courseContentErr: '',
                      })
                    }
                    placeholder="برنامج الدورة *"
                    value={state.courseContent}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight4(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="برنامج الدورة"
                  title2={state.courseContent}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        //   state.isValidated && !state.alternateEmployeeSelected
                        //     ? "red" :
                        '#e2e2e2',
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
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الموظف البديل"
                  title2={
                    state.alternateEmployeeSelectedId
                      ? state.alternateEmployeeSelectedId.split(']')[1]
                      : '-'
                  }
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              <View style={{ width: '100%' }}>
                {editableData ? (
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
                      onPress={editableData ? addFile : null}
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
                ) : state.attachment_ids && state.attachment_ids.length > 0 ? (
                  <OrderViewAttatchment
                    dispatch={dispatch}
                    accessToken={accessToken}
                    attatchments={state.attachment_ids}
                  />
                ) : (
                  <OrderViewItem
                    title1="المرفقات"
                    title2="لا يوجد مرفق"
                    icon={require('../../assets/images/order/attatchments.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}
                {!editableData && (
                  <View style={{ flex: 1, marginBottom: 16 }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={{
                        alignSelf: 'center',
                        padding: 8,
                        width: '55%',
                        marginTop: 20,
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: '#008AC5',
                      }}
                      disabled={timelineData.length == 0 ? true : false}
                    >
                      {/* <Icon2
                      name="archive"
                      size={25}
                      color="white"
                      resizeMode="stretch"
                      style={{ right: -90 }}
                    /> */}
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
                            {/* <View
                            style={{
                              display: "flex",
                              alignSelf: "center",
                              padding: 10,
                              top: -5,
                            }}
                          >
                            <View
                              style={{
                                display: "flex",
                                alignSelf: "center",
                                padding: 10,
                                top: -5,
                                flexDirection: "row-reverse",
                              }}
                            >
                              <View
                                style={{
                                  borderRadius: 10,
                                  display: "flex",
                                  alignSelf: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: "#7b9eb8",
                                    fontFamily: "29LTAzer-Bold",
                                    fontWeight: "normal",
                                  }}
                                >
                                  صاحب الطلب
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "right",
                                    fontFamily: "29LTAzer-Regular",
                                    fontSize: 15,
                                    color: "#20547a",
                                    marginLeft: 30,
                                  }}
                                >
                                  {state.formData.employee_id
                                    ? state.formData.employee_id[1].split(
                                        "]"
                                      )[1]
                                    : ""}{" "}
                                </Text>
                              </View>
                              <View style={{ padding: 3 }} />
                              <View
                                style={{
                                  width: 150,
                                  display: "flex",
                                  alignSelf: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: "#7b9eb8",
                                    fontFamily: "29LTAzer-Bold",
                                    fontWeight: "normal",
                                    marginRight: 10,
                                  }}
                                >
                                  تاريخ الإنشاء{" "}
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontFamily: "29LTAzer-Bold",
                                    fontSize: 15,
                                    color: "#4E7D89",
                                    marginRight: -5,
                                  }}
                                >
                                  {state.formData.create_date}{" "}
                                </Text>
                              </View>
                            </View>
                          </View> */}

                            {timelineData.length ? (
                              <Timeline
                                data={timelineData}
                                circleSize={15}
                                // renderTime={RenderDetails}
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
                            <IconFe
                              name="x-circle"
                              size={23}
                              color={'#E23636'}
                            />
                          </TouchableOpacity>
                        </View>
                      </KeyboardAvoidingView>
                      {/* </TouchableWithoutFeedback> */}
                    </Modal3>
                  </View>
                )}
              </View>
              {!editableData ? (
                viewType === 'approval' ? null : state.reason ? (
                  <OrderViewItem
                    title1="تعليق"
                    title2={state.reason ? state.reason : '-'}
                    icon={require('../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null
              ) : null}
            </View>
            {editableData ? (
              <View style={{ width: '80%', alignSelf: 'center' }}>
                <CommonFormButton
                  onPress={() => {
                    setModal2(true);
                  }}
                  {...props}
                  disabled={isInActive}
                />
              </View>
            ) : item && viewType === 'approval' ? (
              <View style={AppStyle.btnGroupAction}>
                <TouchableOpacity
                  style={{
                    width: '42%',
                    backgroundColor: '#E23636',
                    // height: '22%',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E23636',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    marginTop: 8,
                    justifyContent: 'center',
                    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
                  }}
                  onPress={rejectRequest}
                >
                  <Text
                    style={{
                      color: 'white',
                      margin: '5%',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Medium',
                    }}
                  >
                    رفض
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '42%',
                    backgroundColor: '#5CB366',
                    // height: '22%',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#5CB366',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    marginTop: 8,
                    justifyContent: 'center',
                    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
                  }}
                  onPress={() => setModal2(true)}
                >
                  <Text
                    style={{
                      color: 'white',
                      margin: '5%',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Medium',
                    }}
                  >
                    قبول
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </KeyboardAwareScrollView>
        </View>
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
          !editableData
            ? 'انت على وشك الموافقة على الطلب، هل انت متأكد؟'
            : 'انت على وشك إرسال الطلب، هل انت متأكد؟'
        }
        onClose={() => {
          if (!modal2) {
            return;
          }
          editableData ? handleTrainingRequest() : approveRequest();
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
    </LinearGradient>
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
    width: '100%',
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
    width: '100%',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: '#90909080',
    borderRadius: 6,
    width: '40%',
  },
  mandateTypeText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
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
    width: '103%',
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
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
  },
  accept: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#5CB366',
    alignItems: 'center',
    paddingVertical: 3,
    marginVertical: 8,
  },
  reject: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E23636',
    alignItems: 'center',
    paddingVertical: 3,
    marginVertical: 8,
  },
});
