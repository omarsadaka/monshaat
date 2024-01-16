import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useIsFocused } from '@react-navigation/native';
import uniqBy from 'lodash.uniqby';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import publicIP from 'react-native-public-ip';
import Animated, { acc } from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SnackBar from 'react-native-snackbar-component';
import IconFe from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import IconAddBudget from '../../assets/images/iconly/chart.png';
import IconCertificateAchievement from '../../assets/images/iconly/paper.png';
import IconPaymentOrder from '../../assets/images/iconly/wallet.png';
import CustodyImage from '../../assets/images/request/custody.png';
import VacationImage from '../../assets/images/request/holiday.png';
import LetterImage from '../../assets/images/request/hrletter.png';
import LeaveImage from '../../assets/images/request/leave.png';
import MandateImage from '../../assets/images/request/mandate.png';
import {
  default as IconPurchaseOrder,
  default as PurchaseImage,
} from '../../assets/images/request/purchase.png';
import WorkImage from '../../assets/images/request/remote.png';
import SessionImage from '../../assets/images/request/session.png';
import TechnicalImage from '../../assets/images/request/technical.png';
import TrainingImage from '../../assets/images/request/training.png';
import {
  default as CommonPopup,
  default as CommonPopup2,
} from '../../components/CommonPopup';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import TabNav from '../../components/TabNavigator';
import * as attendanceAction from '../../redux/action/AttendanceAction';
import * as homeMyRequestActions from '../../redux/action/homeMyRequestAction';
import * as loadingAction from '../../redux/action/loadingAction';
import * as loginAction from '../../redux/action/loginActions';
import { getCountUnseen } from '../../redux/action/messageActions';
import { getNotifications } from '../../redux/action/NotificationsAction';
import * as profileAction from '../../redux/action/profileAction';
import * as searchAction from '../../redux/action/searchAction';

import store from '../../redux/store';
import { baseUrl, isAccessible } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import MyRequestList from '../MyRequest';
import RequestList from '../RequestList';
import base64 from 'react-native-base64';
import { isProductionMode } from '../../services';
import { itsmBaseUrl } from '../../services';
import FastImage from 'react-native-fast-image';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    if (e?.name !== 'Invariant Violation') {
      Alert.alert(
        'Unexpected error occurred',
        `
          Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
          We have reported this to our team ! Please close the app and start again!
          `,
        [
          {
            text: 'Close',
          },
        ],
      );
    }
  } else {
    //console.log(e);
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString) => {});
const notItem = { description: '<p><br></p>', id: 196 };
var _ = require('lodash');
const AnimatedView = Animated.View;

const tabs = [
  {
    title: 'TechnicalRequest',
    icon: TechnicalImage,
    arabicTitle: 'مركز الطلبات والدعم',
  },
  { title: 'Vacation', icon: VacationImage, arabicTitle: 'الإجازة' },
  { title: 'RemoteWork', icon: WorkImage, arabicTitle: 'عمل عن بعد' },
  { title: 'Purchase', icon: PurchaseImage, arabicTitle: 'طلب شراء' },
  { title: 'Leave', icon: LeaveImage, arabicTitle: 'استئذان' },
  { title: 'Training', icon: TrainingImage, arabicTitle: 'تدريب' },
  { title: 'Mandate', icon: MandateImage, arabicTitle: 'الانتداب' },
  {
    title: 'Internal',
    icon: SessionImage,
    arabicTitle: 'روزنامة الدورات الداخلية',
  },
  {
    title: 'Hrletter',
    icon: LetterImage,
    arabicTitle: ' خطاب الموارد البشرية',
  },

  { title: 'Resignations', icon: LetterImage, arabicTitle: 'الإستقالة' },
  { title: 'Custody', icon: CustodyImage, arabicTitle: 'طلب عهدة' },
];
let APPROVE_LIMIT = 5;
let REQUEST_LIMIT = 5;
let empID = '1';
let userId = '1';
let mGroup = [];
let myRequestsNum = 0;
const Home = (props) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const profileData = useSelector((state) => state.ProfileReducer.profileData);
  const fall = useRef(new Animated.Value(1));
  const sheetRef = useRef(null);
  const [bs, setBs] = useState('new');
  const [bsShowm, setBsShown] = useState(false);
  const [popup, setPopup] = useState(false);
  const [remoteMessage, setRemoteMessage] = useState({});
  const [ansValue, setAnsValue] = useState('');
  const [questText, setQuestText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [approve, setApprove] = useState(false);
  const [filters, setFilters] = useState([]);
  const [tempFilters, setTempFilters] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [num, setNum] = useState(0);
  const [all, setAll] = useState(true);
  const [page, setPage] = useState(1);
  const [pageApprove, setPageApprove] = useState(1);
  const [verifModal, setVerifModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesApprove, setServicesApprove] = useState([]);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [showRelease, setShowRelease] = useState(false);
  var isProduction = true;

  const managerID = useSelector((state) => state.LoginReducer.managerId);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const itsmToken = useSelector((state) => state.ProfileReducer.ITSMToken);

  const showModal = useSelector((state) => state.AttendanceReducer.showModal);
  const requestLoading = useSelector(
    (state) => state.HomeMyRequestReducer.requestLoading,
  );
  const approveLoading = useSelector(
    (state) => state.HomeMyRequestReducer.approveLoading,
  );

  const attendance = useSelector(
    (state) => state.HomeMyRequestReducer.attendance,
  );
  const [modal2, setModal2] = useState(false);
  const [state, setState] = useState({
    surveyQuest: null,
    modalVisible: false,
    notificationData: [],
    userId: '',
    notificationDatadisplayname: [],
    activeTab: '',
    activeMenuTab: '',
    isMenuApprovalVisible: false,
    sentbyName: '',
    requestDataOfList: [],
    menuMyRequest: tabs,
    menuDataApproval: [
      { title: 'Leave', icon: LeaveImage, arabicTitle: 'استئذان' },
      { title: 'RemoteWork', icon: WorkImage, arabicTitle: 'عمل عن بعد' },
      { title: 'Purchase', icon: PurchaseImage, arabicTitle: 'طلب شراء' },
      { title: 'PaymentOrder', icon: IconPaymentOrder, arabicTitle: 'أمر صرف' },
      {
        title: 'PurchaseOrder',
        icon: IconPurchaseOrder,
        arabicTitle: 'أمر شراء',
      },
      { title: 'AddBudget', icon: IconAddBudget, arabicTitle: 'تعزيز ميزانية' },
      { title: 'Training', icon: TrainingImage, arabicTitle: 'تدريب' },
      { title: 'Mandate', icon: MandateImage, arabicTitle: 'الانتداب' },
      { title: 'Vacation', icon: VacationImage, arabicTitle: 'الإجازة' },

      {
        title: 'CertificateAchievement',
        icon: IconCertificateAchievement,
        arabicTitle: 'شهادة الإنجاز',
      },
      {
        title: 'Internal',
        icon: SessionImage,
        arabicTitle: ' الدورات الداخلية',
      },
      { title: 'Resignations', icon: LetterImage, arabicTitle: 'الإستقالة' },
      { title: 'Custody', icon: CustodyImage, arabicTitle: 'طلب عهدة' },
      {
        title: 'CustodyClose',
        icon: CustodyImage,
        arabicTitle: 'طلب إستعاضة عهدة',
      },
      {
        title: 'TechnicalRequest',
        icon: TrainingImage,
        arabicTitle: 'مركز الطلبات والدعم',
      },
      {
        title: 'purchase requisition',
        icon: CustodyImage,
        arabicTitle: 'اتفاقية اطارية',
      },
      {
        title: 'purchase contracts',
        icon: CustodyImage,
        arabicTitle: 'طلب تعاقد',
      },
      {
        title: 'work orders',
        icon: CustodyImage,
        arabicTitle: 'طلب امر عمل',
      },
      {
        title: 'hr payslip',
        icon: CustodyImage,
        arabicTitle: 'مسيرات رواتب فردية',
      },
      {
        title: 'hr payslip run',
        icon: CustodyImage,
        arabicTitle: 'مسيرات رواتب جماعية',
      },
    ],
    menuData: [
      { title: 'Leave', icon: LeaveImage, arabicTitle: 'استئذان' },
      { title: 'RemoteWork', icon: WorkImage, arabicTitle: 'عمل عن بعد' },
      { title: 'Purchase', icon: PurchaseImage, arabicTitle: 'طلب شراء' },
      { title: 'PaymentOrder', icon: IconPaymentOrder, arabicTitle: 'أمر صرف' },
      {
        title: 'PurchaseOrder',
        icon: IconPurchaseOrder,
        arabicTitle: 'أمر شراء',
      },
      { title: 'AddBudget', icon: IconAddBudget, arabicTitle: 'تعزيز ميزانية' },
      { title: 'Training', icon: TrainingImage, arabicTitle: 'تدريب' },
      { title: 'Mandate', icon: MandateImage, arabicTitle: 'الانتداب' },
      { title: 'Vacation', icon: VacationImage, arabicTitle: 'الإجازة' },
      {
        title: 'TechnicalRequest',
        icon: TrainingImage,
        arabicTitle: 'مركز الطلبات والدعم',
      },

      {
        title: 'CertificateAchievement',
        icon: IconCertificateAchievement,
        arabicTitle: 'شهادة الإنجاز',
      },
      { title: 'Hrletter', icon: LetterImage, arabicTitle: ' خطاب الموارد' },
      { title: 'Resignations', icon: LetterImage, arabicTitle: 'الإستقالة' },
      {
        title: 'Internal',
        icon: SessionImage,
        arabicTitle: ' الدورات الداخلية',
      },
      { title: 'Custody', icon: CustodyImage, arabicTitle: 'طلب عهدة' },
      {
        title: 'CustodyClose',
        icon: CustodyImage,
        arabicTitle: 'طلب إستعاضة عهدة',
      },
      {
        title: 'purchase requisition',
        icon: CustodyImage,
        arabicTitle: 'اتفاقية اطارية',
      },
      {
        title: 'purchase contracts',
        icon: CustodyImage,
        arabicTitle: 'طلب تعاقد',
      },
      {
        title: 'work orders',
        icon: CustodyImage,
        arabicTitle: 'طلب امر عمل',
      },
    ],

    menuNewRequest: tabs,
    isLoading: true,
    wishingMsg: '',
    allMyRequestsState: {},
    allMyApproveState: {},
    isValidated: true,
    showSuccessModal: false,
    isLoad: false,
  });
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const inOut = useSelector((state) => state.AttendanceReducer.inOut);
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  AsyncStorage.setItem('accessToken', accessToken);

  const allMyRequests = useSelector(
    (state) => state.HomeMyRequestReducer.allMyRequests,
  );

  const allMyApprove = useSelector(
    (state) => state.HomeMyRequestReducer.allMyApprove,
  );

  const userGroupData = useSelector(
    (state) => state.ProfileReducer.userGroupData,
  );

  const NotificationData = useSelector(
    (state) => state.NotificationrequestReducer.notificationData,
  );
  const NotificationDataDisplayName = useSelector(
    (state) => state.NotificationrequestReducer.notificationDatadisplayname,
  );

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Home_Screen');
    }
    getToken();
  }, [isFocused]);

  useEffect(() => {
    const checkToken = async () => {
      if (accessToken !== null) {
        AsyncStorage.getItem('userid').then(async (data1) => {
          let secretUrl =
            baseUrl +
            `/api/search_read?model=hr.employee&domain=[["user_id", "=", ${data1}]]&fields=${'["job_english_name","user_id", "department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","name","family_name","role","emp_state","image","sector","department_global_id","dept","management","attendance_state"]'}`;

          fetch(secretUrl, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (
                responseData.code == 401 ||
                responseData.message == '401: Unauthorized'
              ) {
                logout();
              }
            })
            .catch((err) => {});
        });
      } else {
        const token = await AsyncStorage.getItem('accessToken');
        setTimeout(() => {
          if (token == null) {
            showMessage({
              style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
              type: 'danger',
              message: 'إنتهت الجلسة',
            });
            logout();
          } else {
            dispatch({
              type: 'ACCESS_TOKEN',
              value: token,
            });
          }
        }, 5000);
      }
    };
    checkToken();
  }, []);

  const logout = async () => {
    dispatch(loginAction.storeUserToken(null));
    dispatch(loginAction.emptyLoginData());
    dispatch({ type: 'logout-action', payload: null });
    dispatch({
      type: 'ITSM_TOKEN',
      value: null,
    });
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('ITSMTOKEN');
    await clearAll();
  };
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

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ITSMTOKEN');
    const data = JSON.parse(token);
    // setItsmToken(data.accessToken);
    dispatch({
      type: 'ITSM_TOKEN',
      value: data.accessToken,
    });
  };
  useEffect(() => {
    (async () => {
      const Questionary = await AsyncStorage.getItem('Questionary');
      let item = JSON.parse(Questionary);

      if (item) {
        props.navigation.navigate('Questionary', {
          item: item,
          isRequired: item.survey_vals[0].is_required,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        return;
      }
      const ReleaseNotes = await AsyncStorage.getItem('ReleaseNotes');
      let item = JSON.parse(ReleaseNotes);
      if (!item) {
        let url = `${baseUrl}/api/search_read?fields=["message", "version"]&model=upgrade.message`;
        let secretUrl = await EncryptUrl(url);
        fetch(secretUrl, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response.json())
          .then(async (responseData) => {
            await AsyncStorage.setItem(
              'ReleaseNotes',
              JSON.stringify(responseData[0].message),
            );

            setReleaseNotes(responseData[0].message);
            setReleaseVersion(responseData[0].version);
            setShowRelease(true);
          })
          .catch((error) => {
            // console.error('Error:', error);
          });
      }
    })();
  }, [accessToken]);

  const handleRating = async () => {
    setState({ ...state, isLoad: true });
    let mEmpID = await AsyncStorage.getItem('empID');
    let questId = rate && rate.survey_vals[0].id;
    let url = baseUrl;
    let questType = rate && rate.survey_vals[0].answer_type;
    if (questType === 'text') {
      url += `/api/create/portal.question.text.response?values={"employee_id": ${mEmpID}, "answer":${questText},"question_id":${questId}}`;
    } else {
      let ansValueId = ansValue;
      url += `/api/create/portal.question.response?values={"employee_id": ${mEmpID}, "value_id":${ansValueId}}`;
    }
    setModalVisible(false);

    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setState({ ...state, isLoad: false, showSuccessModal: true });
        AsyncStorage.removeItem('Questionary');
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
    setVerifModal(false);
  };

  const verifDataValidation = () => {
    let questType = rate && rate.survey_vals[0].answer_type;
    if (questType === 'text' && questText.length === 0) {
      setState({ ...state, isValidated: false });
      return;
    } else if (questType === 'choices' && !ansValue) {
      setState({ ...state, isValidated: false });
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء إختيار إجابة',
      });
      return;
    }
    setModalVisible(false);
    setTimeout(() => {
      setVerifModal(true);
    }, 1000);
  };
  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolateNode(fall.current, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });

    return (
      <TouchableWithoutFeedback onPress={() => sheetRef.current.snapTo(1)}>
        <AnimatedView
          pointerEvents={bsShowm ? 'box-only' : 'none'}
          style={[
            styles.shadowContainer,
            {
              opacity: popup ? 0.5 : animatedShadowOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    (async () => {
      if (!accessToken || !isFocused) {
        return;
      }
      const EmpId = await AsyncStorage.getItem('empID');
      // console.log('EMPID', EmpId);
      let url = `${baseUrl}/api/call/all.requests/get_employee_required_survey?kwargs={"employee_id":${EmpId}}`;
      let secretUrl = await EncryptUrl(url);
      // console.log('url', url);
      // console.log('accessToken', accessToken);
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then(async (responseData) => {
          // console.log('responseData----0', responseData);
          const RespData = JSON.stringify(responseData);
          // console.log('RESPDATA----0', RespData);
          const item2 = RespData.replace('"[{', '[{');
          const ell = item2.replace('}]"', '}]');
          const jsonEll = JSON.parse(ell);
          const item3 = jsonEll[0];
          if (item3 && item3.survey_vals[0].is_required === true) {
            props.navigation.navigate('Questionary', {
              item: item3,
              isRequired: item3.survey_vals[0].is_required,
            });
          }
        })
        .catch((error) => {
          // console.error('Error:', error);
        });
    })();
  }, [accessToken, isFocused, props.navigation, appStateVisible]);
  const notificationNavigation = useCallback(
    async (selectedNotification) => {
      setModalVisible(false); //
      setTimeout(async () => {
        if (
          selectedNotification.res_id === '[]' &&
          selectedNotification.res_model !== 'survey.survey'
        ) {
          dispatch(homeMyRequestActions.EditableorNot(true));
          switch (selectedNotification.request_type) {
            case 'new_custody':
              props.navigation.navigate('CustodyRequest');
              break;
            case 'calendar':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 4, tabValue: 'me' },
              });
              break;
            case 'team_calendar':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 4, tabValue: 'team' },
              });
              break;
            case 'news':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 3 },
              });
              break;
            case 'main_meu':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 2 },
              });
              break;
            case 'chat_server':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 1, viewExperts: false },
              });
              break;
            case 'experts_list':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 1, viewExperts: true },
              });
              break;
            case 'search':
              store.dispatch({ type: 'navigate-to', payload: { index: 0 } });
              break;
            case 'attendance':
              props.navigation.navigate('AttendanceList');
              break;
            case 'employee_journey':
              props.navigation.navigate('EmployeJourny');
              break;
            case 'ideas_bank':
              props.navigation.navigate('QuestBank');
              break;
            case 'new_helpdesk':
              props.navigation.navigate('TechnicalRequestNew', {
                comeFrom: 'NewRequest',
                item: '',
              });
              break;
            case 'new_holiday_request':
              props.navigation.navigate('NewLeaveRequest', {
                comeFrom: 'NewRequest',
                item: '',
              });
              break;

            case 'new_purchase_request':
              props.navigation.navigate('NewPurchaseRequest', {
                item: '',
              });
              break;
            case 'new_distance_work_request':
              props.navigation.navigate('RemoteRequest', {
                item: '',
              });
              break;
            case 'new_authorization':
              props.navigation.navigate('LeaveRequest', { item: '' });
              break;
            case 'new_training_request':
              props.navigation.navigate('TrainingRequest', {
                item: '',
              });
              break;
            case 'new_deputation':
              props.navigation.navigate('MandateRequest', {
                item: '',
              });
              break;
            case 'new_salary_identification_request':
              props.navigation.navigate('Rhletter', {
                item: '',
              });
              break;
            case 'new_hr_training_public':
              props.navigation.navigate('InternalCourses', {
                item: '',
              });
              break;
            case 'requests_to_approve':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 2 },
              });
              break;
            case 'profile':
              const profile_data = await AsyncStorage.getItem('PROFILE_DATA');
              props.navigation.navigate('Profile', {
                profileData: { ...profile_data[0], ...profileData[0] },
                comeFfrom: 'loogeduser',
              });
              break;
            default:
              break;
          }
        } else {
          if (
            selectedNotification.res_model &&
            selectedNotification.res_model === 'portal.news'
          ) {
            if (
              selectedNotification.request_type === 'none' ||
              selectedNotification.request_type === 'main_meu'
            ) {
              return;
            }
            let secretUrl = await EncryptUrl(
              baseUrl +
                `/api/search_read/portal.news?fields=["title","resume","description","image"]&domain=[["id","=",${selectedNotification.res_id}]]`,
            );
            let accessToken = await AsyncStorage.getItem('accessToken');
            fetch(secretUrl, {
              method: 'GET',
              headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
              .then((response) => response.json())
              .then((responseData) => {
                let navigation = props.navigation;
                if (selectedNotification.request_type == 'news') {
                  navigation.navigate('MonshaatNews', {
                    item: responseData[0],
                    type: 'news',
                  });
                } else if (
                  selectedNotification.request_type == 'advertisement'
                ) {
                  navigation.navigate('MonshaatNews', {
                    item: responseData[0],
                    type: 'activity',
                  });
                } else if (
                  selectedNotification.request_type == 'monshaat_family'
                ) {
                  navigation.navigate('MonshaatNews', {
                    item: responseData[0],
                    type: 'family',
                  });
                }
                setRemoteMessage(null);
              })
              .catch((err) => {});
          } else if (selectedNotification.res_model == 'survey.survey') {
            let navigation = props.navigation;
            const item2 = selectedNotification.record.replace('"[{', '[{');
            const ell = item2.replace('}]"', '}]');
            const jsonEll = JSON.parse(ell);
            const item3 = jsonEll[0];
            navigation.navigate('Questionary', {
              item: item3,
              isRequired: item3.survey_vals[0].is_required,
            });
          } else {
            dispatch(homeMyRequestActions.EditableorNot(false));
            const item1 = selectedNotification.record.replace('"[{', '[{');
            const el = item1.replace('}]"', '}]');
            const jsonEl = JSON.parse(el);
            const item = jsonEl[0];
            let empID = await AsyncStorage.getItem('empID');
            let navigation = props.navigation;
            if (selectedNotification.res_model === 'hr.holidays') {
              empID == item.employee_id[0]
                ? navigation.navigate('NewLeaveRequest', {
                    item: item,
                  })
                : navigation.navigate('NewLeaveRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'hr.deputation') {
              empID == item.employee_id[0]
                ? navigation.navigate('MandateRequest', {
                    item: item,
                  })
                : navigation.navigate('MandateRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'hr.authorization') {
              empID == item.employee_id[0]
                ? navigation.navigate('LeaveRequest', {
                    item: item,
                  })
                : navigation.navigate('LeaveRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'helpdesk.ticket') {
              empID == item.employee_id[0]
                ? navigation.navigate('TechnicalRequest', { item: item })
                : navigation.navigate('TechnicalRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'hr.distance.work') {
              empID == item.employee_id[0]
                ? navigation.navigate('RemoteRequest', {
                    item: item,
                  })
                : navigation.navigate('RemoteRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'purchase.request') {
              empID == item.employee_id[0]
                ? navigation.navigate('NewPurchaseRequest', {
                    item: item,
                  })
                : navigation.navigate('NewPurchaseRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (
              selectedNotification.res_model === 'hr.training.request'
            ) {
              empID == item.employee_id[0]
                ? navigation.navigate('TrainingRequest', {
                    item: item,
                  })
                : navigation.navigate('TrainingRequest', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (
              selectedNotification.res_model === 'hr.training.public'
            ) {
              empID == item.employee_id[0]
                ? navigation.navigate('FormInternalCourses', {
                    item: item,
                  })
                : navigation.navigate('FormInternalCourses', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (
              selectedNotification.res_model === 'salary.identification.request'
            ) {
              empID == item.employee_id[0]
                ? navigation.navigate('Rhletter', {
                    item: item,
                  })
                : navigation.navigate('Rhletter', {
                    item: item,
                  });
            } else if (selectedNotification.res_model === 'hr.resignation') {
              empID == item.employee_id[0]
                ? navigation.navigate('Resignations', {
                    item: item,
                  })
                : navigation.navigate('Resignations', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (item.res_model === 'purchase.order') {
              empID == item.employee_id[0]
                ? navigation.navigate('FormPurchaseOrder', {
                    item: item,
                  })
                : navigation.navigate('FormPurchaseOrder', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (
              selectedNotification.res_model === 'purchase.requisition'
            ) {
              empID == item?.employee_id[0]
                ? navigation.navigate('PurchaseOrderDetail', {
                    item: item,
                  })
                : navigation.navigate('PurchaseOrderDetail', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (selectedNotification.res_model === 'purchase.contract') {
              empID == item?.employee_id[0]
                ? navigation.navigate('ContractOrderDetail', {
                    item: item,
                  })
                : navigation.navigate('ContractOrderDetail', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (item.res_model === 'work.order') {
              empID == item?.employee_id[0]
                ? navigation.navigate('PopupActionOrder', {
                    item: item,
                  })
                : navigation.navigate('PopupActionOrder', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (item.res_model === 'hr.payslip') {
              empID == item?.employee_id[0]
                ? navigation.navigate('SalaryMarches', {
                    item: item,
                  })
                : navigation.navigate('SalaryMarches', {
                    item: item,
                    viewType: 'approval',
                  });
            } else if (item.res_model === 'hr.payslip.run') {
              empID == item?.employee_id[0]
                ? navigation.navigate('SalaryMarchesGroup', {
                    item: item,
                  })
                : navigation.navigate('SalaryMarchesGroup', {
                    item: item,
                    viewType: 'approval',
                  });
            }
            setRemoteMessage(null);
          }
        }
      }, 3000);
    },
    [accessToken, profileData],
  );

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
  const [rate, setRate] = useState();
  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log('remoteMessage', remoteMessage);
      remoteMessage.notification.title.includes('رسالة')
        ? props.navigation.navigate('MessagesFeed', {
            correspondantId: remoteMessage.data.correspondant,
          })
        : notificationNavigation(remoteMessage.data);
    });
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        // console.log('remoteMessage', remoteMessage);
        remoteMessage.notification.title.includes('رسالة')
          ? props.navigation.navigate('MessagesFeed', {
              correspondantId: remoteMessage.data.correspondant,
            })
          : notificationNavigation(remoteMessage.data);
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      // console.log('Message handled in the background!', remoteMessage);
      if (remoteMessage && appStateVisible === 'background') {
        let recortSTR = null;
        recortSTR = remoteMessage && remoteMessage?.data?.record;
        const record = JSON.parse(recortSTR);
        let is_req = record[0].survey_vals[0].is_required;
        if (
          is_req === true &&
          remoteMessage.data.res_model === 'survey.survey'
        ) {
          notificationNavigation(remoteMessage.data);
          if (appStateVisible === 'active') {
            is_req = null;
          }
        }
      }
    });
    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification.title.includes('رسالة')) {
        // console.log('message on forground');
      } else {
        setRemoteMessage(remoteMessage);
        if (remoteMessage.data.request_type) {
          if (
            remoteMessage.data.request_type == 'new_custody' ||
            remoteMessage.data.request_type == 'calendar' ||
            remoteMessage.data.request_type == 'team_calendar' ||
            remoteMessage.data.request_type == 'news' ||
            remoteMessage.data.request_type == 'chat_server' ||
            remoteMessage.data.request_type == 'experts_list' ||
            remoteMessage.data.request_type == 'search' ||
            remoteMessage.data.request_type == 'attendance' ||
            remoteMessage.data.request_type == 'employee_journey' ||
            remoteMessage.data.request_type == 'ideas_bank' ||
            remoteMessage.data.request_type == 'new_helpdesk' ||
            remoteMessage.data.request_type == 'new_holiday_request' ||
            remoteMessage.data.request_type == 'new_purchase_request' ||
            remoteMessage.data.request_type == 'new_distance_work_request' ||
            remoteMessage.data.request_type == 'new_authorization' ||
            remoteMessage.data.request_type == 'new_training_request' ||
            remoteMessage.data.request_type == 'new_deputation' ||
            remoteMessage.data.request_type ==
              'new_salary_identification_request' ||
            remoteMessage.data.request_type == 'new_hr_training_public' ||
            remoteMessage.data.request_type == 'requests_to_approve'
          ) {
            store.dispatch({
              type: 'navigate-to',
              payload: { index: 2 },
            });
          }
        }
        setTimeout(() => {
          setModalVisible(true);
        }, 1000);
        // console.log('RemoteMessage', remoteMessage);
      }

      if (remoteMessage) {
        let recortSTR = null;
        recortSTR = remoteMessage && remoteMessage?.data?.record;

        const record = JSON.parse(recortSTR);
        // console.log('RECORRRD', record);
        setRate(record[0]);
        if (record[0].survey_vals[0].is_required === true) {
          AsyncStorage.setItem('Questionary', JSON.stringify(record[0]));
        }
      }
    });
  }, [profileData, isFocused, appStateVisible]);

  useEffect(() => {
    profileData[0] && dispatch(getCountUnseen(profileData[0].id));
  }, [isFocused]);

  useEffect(() => {
    if (!managerID || !accessToken) return;

    dispatch(
      searchAction.getManagerData({
        id: managerID[0].parent_id[0],
        accessToken: accessToken,
      }),
    );
  }, [managerID, accessToken]);

  useEffect(() => {
    if (profileData.length && NotificationData != undefined) {
      AsyncStorage.setItem('role', profileData[0].role);
      mRole = profileData[0].role;
      setState({
        ...state,
        profileData: profileData,
        modalVisible: true,
        notificationData: NotificationData,
        notificationDatadisplayname: NotificationDataDisplayName,
      });
    }
  }, [profileData, NotificationData, NotificationDataDisplayName]);

  useEffect(() => {
    (async () => {
      let mGroup = await AsyncStorage.getItem('userGroup');
      // console.log('mGroup', mGroup);
      if (mGroup) {
        mGroup = JSON.parse(mGroup);
        if (
          mGroup.indexOf(19) > -1 ||
          mGroup.indexOf(95) > -1 ||
          mGroup.indexOf(20) > -1 ||
          mGroup.indexOf(222) > -1 ||
          mGroup.indexOf(22) > -1 ||
          mGroup.indexOf(21) > -1
        ) {
          setState({
            ...state,
            activeTab: 'approval',
            isMenuApprovalVisible: true,
            activeMenuTab: state.menuDataApproval[0].title,
          });
          setApprove(true);
        } else {
          setState({
            ...state,
            activeTab: 'myRequest',
            isMenuApprovalVisible: false,
            activeMenuTab: state.menuMyRequest[0].title,
          });
          setApprove(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('empID').then((mEmpId) => {
      empID = mEmpId;
      if (userGroupData && userGroupData.length && empID) {
        AsyncStorage.setItem(
          'userGroup',
          JSON.stringify(userGroupData[0].groups_id),
        );
        // console.log('userGroupData[0].groups_id', userGroupData[0].groups_id);
        mGroup = userGroupData[0].groups_id;
        // setState({
        //   ...state,
        //   isMenuApprovalVisible: false,
        // });
        setApprove(false);
        if (mGroup.length) {
          if (mGroup.indexOf(104) > -1 || mGroup.indexOf(105) > -1) {
            setState({
              ...state,
              menuNewRequest: [
                {
                  title: 'TechnicalRequest',
                  icon: TechnicalImage,
                  arabicTitle: 'مركز الطلبات والدعم',
                },
                { title: 'Leave', icon: LeaveImage, arabicTitle: 'استئذان' },
                {
                  title: 'RemoteWork',
                  icon: WorkImage,
                  arabicTitle: 'عمل عن بعد',
                },
                {
                  title: 'Purchase',
                  icon: PurchaseImage,
                  arabicTitle: 'طلب شراء',
                },
                {
                  title: 'Training',
                  icon: TrainingImage,
                  arabicTitle: 'تدريب',
                },
                {
                  title: 'Mandate',
                  icon: MandateImage,
                  arabicTitle: 'الانتداب',
                },
                {
                  title: 'Vacation',
                  icon: VacationImage,
                  arabicTitle: 'الإجازة',
                },
                {
                  title: 'Internal',
                  icon: SessionImage,
                  arabicTitle: ' الدورات الداخلية',
                },
              ],
            });
          }
          if (
            mGroup.indexOf(19) > -1 ||
            mGroup.indexOf(95) > -1 ||
            mGroup.indexOf(20) > -1 ||
            mGroup.indexOf(222) > -1 ||
            mGroup.indexOf(22) > -1 ||
            mGroup.indexOf(21) > -1
          ) {
            setState({
              ...state,
              activeTab: 'approval',
              isMenuApprovalVisible: true,
              activeMenuTab: state.menuDataApproval[0].title,
            });
            setApprove(true);
          } else {
            setState({
              ...state,
              activeTab: 'myRequest',
              isMenuApprovalVisible: false,
              activeMenuTab: state.menuMyRequest[0].title,
            });
            setApprove(false);
          }
        }
      }
    });
  }, [userGroupData, empID]);

  useEffect(() => {
    if (accessToken !== null) {
      AsyncStorage.getItem('userid').then(async (data1) => {
        let data = {
          id: data1,
          accessToken: accessToken,
        };

        await dispatch(profileAction.getUserGroupData(data));
        await dispatch(loginAction.getManagerId(data));
        await dispatch(loginAction.getDeptId(data));
        empID = await AsyncStorage.getItem('empID');
        userId = await AsyncStorage.getItem('userid');
        setState({ ...state, userId, empID });
      });
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken !== null) {
      AsyncStorage.getItem('userid').then(async (data1) => {
        let data = {
          id: data1,
          accessToken: accessToken,
          home: 'homeee',
        };
        dispatch(profileAction.getProfile(data));
        dispatch(profileAction.getProfileData(data));
      });
    }
  }, [accessToken, inOut]);

  const handleNewOrder = () => {
    setBs('new');
    sheetRef.current.snapTo(0);
    AnnalyticsFirebase('New_Requests_Tab_Screen');
  };

  const getAllMyReuqests = useCallback(() => {
    if (!accessToken || empID == '1') {
      return;
    }
    setPageApprove(1);
    setPage(1);
    dispatch({
      type: 'CLEAR_HOME',
    });
    let data = {
      token: accessToken,
      id: empID,
      limit: APPROVE_LIMIT,
      page: '1',
    };
    if (approve) {
      dispatch(
        homeMyRequestActions.getAllMyApproveList({
          data: data,
        }),
      );
    }
    data.limit = REQUEST_LIMIT;

    dispatch(
      homeMyRequestActions.getAllMyReuqestList({
        data: data,
      }),
    );
  }, [accessToken, empID, approve]);

  useEffect(() => {
    !isLoading && getAllMyReuqests();
  }, [getAllMyReuqests, isLoading, state.activeTab]);

  const getAttendance = useCallback(() => {
    if (!accessToken || empID == '1') {
      return;
    }
    let data = {
      token: accessToken,
      id: empID,
    };
    dispatch(
      homeMyRequestActions.getHomeAttendance({
        data: data,
      }),
    );
  }, [accessToken, empID, inOut, showModal, requestLoading]);

  useEffect(() => {
    getAttendance();
  }, [getAttendance]);

  const loadMoreApproveBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 16,
          height: 90,
          width: '100%',
        }}
      >
        {approveLoading ? (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{ width: 30, height: 30, marginHorizontal: 8 }}
          />
        ) : null}
      </View>
    );
  };
  const loadMoreFamilyBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 16,
          height: 90,
          width: '100%',
        }}
      >
        {requestLoading ? (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{ width: 30, height: 30, marginHorizontal: 8 }}
          />
        ) : null}
      </View>
    );
  };
  const handleMenuItem = (item) => {
    let active = activeFilters.some((obj) => obj.title === item.title);

    if (active) {
      let myArray = activeFilters.filter(function (obj) {
        return obj.title !== item.title;
      });
      setActiveFilters(myArray);
    } else {
      let mData = uniqBy([...activeFilters, item], 'title');
      setActiveFilters(mData);
    }
    setAll(false);
    setBsShown(false);
  };

  const handleMyRequest = async () => {
    setState({
      ...state,
      activeTab: 'myRequest',
    });
    AnnalyticsFirebase('My_Request_Screen');

    setFilters([]);
    setActiveFilters([]);
    setTempFilters([]);
    setAll(true);
    setBsShown(false);
  };

  const handleBsConfirm = () => {
    if (all) {
      setFilters([]);
      setActiveFilters([]);
      setTempFilters([]);
      setAll(true);
    } else {
      setFilters(activeFilters);
    }

    sheetRef.current.snapTo(1);
  };

  const handleAll = () => {
    if (!all) {
      setTempFilters([...activeFilters]);
      setActiveFilters([]);
      setAll(!all);
    }
  };
  const SelectAllSort = () => {
    return (
      <TouchableOpacity
        onPress={handleAll}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: all ? '#007598' : '#fff',
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: all ? '#fff' : '#99b4c8',
              fontFamily: all ? '29LTAzer-Regular' : '29LTAzer-Regular',
            },
          ]}
        >
          الكل
        </Text>
      </TouchableOpacity>
    );
  };
  const SelectItemSort = ({ item }) => {
    let active = activeFilters.some((obj) => obj.title === item.title);
    return (
      <TouchableOpacity
        onPress={() => handleMenuItem(item)}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: active ? '#007598' : '#fff',
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: active ? '#fff' : '#99b4c8',
              fontFamily: active ? '29LTAzer-Regular' : '29LTAzer-Regular',
            },
          ]}
        >
          {item.arabicTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderContentSort = () => {
    let data =
      state.activeTab === 'approval' ? state.menuDataApproval : state.menuData;
    let newArray = data;
    if (state.activeTab === 'approval') {
      newArray = [];
      data.forEach((elm) => {
        if (elm.title === 'CertificateAchievement') {
          var x = allMyApprove['certificate achievement'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Purchase') {
          var x = allMyApprove['purchase requests'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Internal') {
          var x = allMyApprove['training public'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'TechnicalRequest') {
          var x = allMyApprove['help desk'];
          var y = services;
          if ((x && x.length !== 0) || (y && y.length !== 0)) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Vacation') {
          var x = allMyApprove.holidays;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'RemoteWork') {
          var x = allMyApprove['distance work'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Hrletter') {
          var x = allMyApprove['salary requests'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Leave') {
          var x = allMyApprove.authorizations;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Training') {
          var x = allMyApprove.training;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Mandate') {
          var x = allMyApprove.deputations;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'PaymentOrder') {
          var x = allMyApprove['payment orders'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'AddBudget') {
          var x = allMyApprove['purchase add budget'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'PurchaseOrder') {
          var x = allMyApprove['purchase orders'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Resignations') {
          var x = allMyApprove.resignations;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'Custody') {
          var x = allMyApprove.custody;
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'CustodyClose') {
          var x = allMyApprove['custody close'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        }
        //new
        else if (elm.title === 'purchase requisition') {
          var x = allMyApprove['purchase requisition'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'purchase contracts') {
          var x = allMyApprove['purchase contracts'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'work orders') {
          var x = allMyApprove['work orders'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'hr payslip') {
          var x = allMyApprove['hr payslip'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else if (elm.title === 'hr payslip run') {
          var x = allMyApprove['hr payslip run'];
          if (x && x.length !== 0) {
            newArray.push(elm);
          }
        } else {
          newArray.push(elm);
        }
      });
    }
    return (
      <LinearGradient
        colors={['#d1e3eb', '#e1eaed', '#d1e3eb']}
        style={styles.bsContainer}
      >
        <Text style={styles.bsTitle}>تصفية</Text>
        <View style={styles.bsItemsContainer}>
          <SelectAllSort />
          {newArray.map((el) => {
            return <SelectItemSort item={el} />;
          })}
        </View>

        <TouchableOpacity onPress={handleBsConfirm} style={styles.bsButton}>
          <Text style={styles.bsButtonText}>تصفية</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };
  const handleNewPress = async (item) => {
    setBs(false);
    setBsShown(false);
    sheetRef.current.snapTo(1);
    const navigation = props.navigation;

    dispatch(homeMyRequestActions.EditableorNot(true));
    if (item.title === 'Vacation') {
      if (await isAccessible('hr.holidays', accessToken)) {
        navigation.navigate('NewLeaveRequest', {
          comeFrom: 'NewRequest',
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Mandate') {
      if (await isAccessible('hr.deputation', accessToken)) {
        navigation.navigate('MandateRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Leave') {
      if (await isAccessible('hr.authorization', accessToken)) {
        navigation.navigate('LeaveRequest', { item: '' });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'TechnicalRequest') {
      if (await isAccessible('helpdesk.ticket', accessToken)) {
        navigation.navigate('TechnicalRequestNew', { item: '' });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'RemoteWork') {
      if (await isAccessible('hr.distance.work', accessToken)) {
        navigation.navigate('RemoteRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Purchase') {
      if (await isAccessible('purchase.request', accessToken)) {
        navigation.navigate('NewPurchaseRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Training') {
      if (await isAccessible('hr.training', accessToken)) {
        navigation.navigate('TrainingRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Internal') {
      if (await isAccessible('hr.training.public', accessToken)) {
        navigation.navigate('InternalCourses', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Hrletter') {
      if (await isAccessible(accessToken)) {
        navigation.navigate('Rhletter', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Custody') {
      if (await isAccessible('manage.financial.custody', accessToken)) {
        navigation.navigate('CustodyRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    }
  };
  const SelectItemNew = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNewPress(item)}
      style={styles.itemNewContainer}
    >
      <Image
        resizeMode="contain"
        source={item.icon}
        style={styles.itemNewImage}
      />
      <Text style={styles.itemNewText}>{item.arabicTitle}</Text>
    </TouchableOpacity>
  );
  const renderContentNew = useCallback(
    () => (
      <LinearGradient
        colors={['#d1e3eb', '#e1eaed', '#d1e3eb']}
        style={styles.bsContainer}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginVertical: 40,
          }}
        >
          <SelectItemNew item={tabs[0]} />
          <SelectItemNew item={tabs[1]} />
          <SelectItemNew item={tabs[2]} />
          <SelectItemNew item={tabs[3]} />
          <SelectItemNew item={tabs[4]} />
          <SelectItemNew item={tabs[5]} />
          <SelectItemNew item={tabs[6]} />
          <SelectItemNew item={tabs[8]} />
          <SelectItemNew item={tabs[7]} />
          <SelectItemNew item={tabs[10]} />
        </View>
      </LinearGradient>
    ),
    [tabs],
  );
  useEffect(() => {
    if (userProfileData.length === 0 || !userProfileData[0].work_email) return;
    let url = `${itsmBaseUrl}monshaat_incident?email=${userProfileData[0].work_email}`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );

    // console.log('monshaat_incident', url);
    fetch(url, {
      method: 'GET',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map((obj) => {
          return {
            ...obj,
            // ...responseData.result,
            IncidentDescription: obj.IncidentDescription,
            id: obj.IncidentNumber,
            create_date: obj.IncidentCreated,
            state: obj.IncidentState,
            res_model: 'helpdesk.new',
            IncidentAssignedTo: obj.IncidentAssignedTo,
            IncidentAssignmentGroup: obj.IncidentAssignmentGroup,
            category: obj.category,
            IncidentCaller: obj.IncidentCaller,
            IncidentShortDescription: obj.IncidentShortDescription,
          };
        });
        // console.log('responseData responseData', arr);
        setIncidents(arr);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  }, [userProfileData, requestLoading, itsmToken]);

  useEffect(() => {
    if (userProfileData.length === 0 || !userProfileData[0].work_email) return;
    let url = `${itsmBaseUrl}monshaat_incident?email=${userProfileData[0].work_email}`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );

    // console.log('monshaat_incident', url);
    fetch(url, {
      method: 'GET',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('dsdadadadada', responseData);
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          // dispatch(loadingAction.commonLoader(true));
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
          clearTimeout(timeout);
          let timeout = setTimeout(() => {
            getToken();
            dispatch(loadingAction.commonLoader(false));
          }, 3000);
        }
        if (responseData.result) {
          let arr = responseData.result.map((obj) => {
            return {
              ...obj,
              // ...responseData.result,
              IncidentDescription: obj.IncidentDescription,
              id: obj.IncidentNumber,
              create_date: obj.IncidentCreated,
              state: obj.IncidentState,
              res_model: 'helpdesk.new',
              IncidentAssignedTo: obj.IncidentAssignedTo,
              IncidentAssignmentGroup: obj.IncidentAssignmentGroup,
              category: obj.category,
              IncidentCaller: obj.IncidentCaller,
              IncidentShortDescription: obj.IncidentShortDescription,
            };
          });
          // console.log('responseData responseData', arr);
          setIncidents(arr);
        }
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  }, [itsmToken]);

  useEffect(() => {
    if (userProfileData.length === 0 || !userProfileData[0].work_email) return;
    let url = `${itsmBaseUrl}query_request_from_email?email=${userProfileData[0].work_email}`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    fetch(url, {
      method: 'GET',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map((obj) => {
          return {
            ...obj,
            // IncidentDescription: obj.IncidentDescription,
            id: obj.RITMNumber,
            create_date: obj.RITMCreated,
            state: obj.RITMState,
            res_model: 'helpdesk.service',
            RITMAssignedTo: obj.RITMAssignedTo,
            RITMAssignmentGroup: obj.RITMAssignmentGroup,
            IncidentCaller: obj.IncidentCaller,
            type: obj.RITMItem,
          };
        });
        // console.log('responseData responseData', arr);
        setServices(arr);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  }, [userProfileData, requestLoading, itsmToken]);

  useEffect(() => {
    if (userProfileData.length === 0 || !userProfileData[0].work_email) return;
    let url = `${itsmBaseUrl}pending_requests_from_email?email=${userProfileData[0].work_email}`;
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    fetch(url, {
      method: 'GET',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map((obj) => {
          return {
            ...obj,
            // IncidentDescription: obj.IncidentDescription,
            id: obj.RITMNumber,
            create_date: obj.ApprovalCreated,
            state: obj.ApprovalState,
            res_model: 'helpdesk.service',
            RITMRequester: obj.RITMRequester,
            type: obj.RITMItem,
          };
        });
        // console.log('responseData responseData', arr);
        setServicesApprove(arr);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  }, [userProfileData, approveLoading, itsmToken]);
  const [snackVisib, setSnackVisib] = useState(false);

  useEffect(() => {
    dispatch(getNotifications(state.userId, accessToken));
  }, [state.userId]);

  useEffect(() => {
    if (accessToken !== null) {
      dispatch(attendanceAction.attendanceGet(accessToken, state.userId));
    }
  }, [state.userId, accessToken]);

  useEffect(() => {
    setNum(myRequestsNum);
  }, [
    myRequestsNum,
    state,
    filters,
    requestLoading,
    approveLoading,
    isLoading,
  ]);

  const renderMyRequest = useCallback(() => {
    let data = [];
    if (!allMyRequests.hasOwnProperty('training') && data.length > 0) {
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#007598',
              fontFamily: '29LTAzer-Regular',
              marginTop: Dimensions.get('window').height * 0.17,
            }}
          >
            الرجاء المحاولة لاحقا
          </Text>
        </View>
      );
    }

    if (filters.length > 0) {
      filters.some((obj) => obj.title === 'TechnicalRequest')
        ? data.push(...allMyRequests['help desk'])
        : null;
      filters.some((obj) => obj.title === 'TechnicalRequest')
        ? data.push(...incidents)
        : null;
      filters.some((obj) => obj.title === 'TechnicalRequest')
        ? data.push(...services)
        : null;
      filters.some((obj) => obj.title === 'Vacation')
        ? data.push(...allMyRequests.holidays)
        : null;
      filters.some((obj) => obj.title === 'RemoteWork')
        ? data.push(...allMyRequests['distance work'])
        : null;
      filters.some((obj) => obj.title === 'Purchase')
        ? data.push(...allMyRequests['purchase requests'])
        : null;
      filters.some((obj) => obj.title === 'Hrletter')
        ? data.push(...allMyRequests['salary requests'])
        : null;
      filters.some((obj) => obj.title === 'Leave')
        ? data.push(...allMyRequests.authorizations)
        : null;
      filters.some((obj) => obj.title === 'Training')
        ? data.push(...allMyRequests.training)
        : null;
      filters.some((obj) => obj.title === 'Mandate')
        ? data.push(...allMyRequests.deputations)
        : null;
      filters.some((obj) => obj.title === 'CertificateAchievement')
        ? data.push(...allMyRequests['certificate achievement'])
        : null;
      filters.some((obj) => obj.title === 'PaymentOrder')
        ? data.push(...allMyRequests['payment orders'])
        : null;
      filters.some((obj) => obj.title === 'AddBudget')
        ? data.push(...allMyRequests['purchase add budget'])
        : null;
      filters.some((obj) => obj.title === 'PurchaseOrder')
        ? data.push(...allMyRequests['purchase orders'])
        : null;
      filters.some((obj) => obj.title === 'Internal')
        ? data.push(...allMyRequests.training_public)
        : null;
      filters.some((obj) => obj.title === 'Resignations')
        ? data.push(...allMyRequests.resignations)
        : null;
      filters.some((obj) => obj.title === 'Custody')
        ? data.push(...allMyRequests.custody)
        : null;
      filters.some((obj) => obj.title === 'CustodyClose')
        ? data.push(...allMyRequests['custody close'])
        : null;
      filters.some((obj) => obj.title === 'purchase requisition')
        ? data.push(...allMyRequests['purchase requisition'])
        : null;
      filters.some((obj) => obj.title === 'purchase contracts')
        ? data.push(...allMyRequests['purchase contracts'])
        : null;
      filters.some((obj) => obj.title === 'work orders')
        ? data.push(...allMyRequests['work orders'])
        : null;
    } else {
      data = [
        ...allMyRequests['help desk'],
        ...allMyRequests.authorizations,
        ...allMyRequests.deputations,
        ...allMyRequests['distance work'],
        ...allMyRequests.holidays,
        ...allMyRequests['purchase requests'],
        ...allMyRequests['salary requests'],
        ...allMyRequests.training,
        ...allMyRequests['certificate achievement'],
        ...allMyRequests['payment orders'],
        ...allMyRequests['purchase add budget'],
        ...allMyRequests['purchase orders'],
        ...allMyRequests.training_public,
        ...allMyRequests.resignations,
        ...allMyRequests.custody,
        ...allMyRequests['custody close'],
        ...allMyRequests['purchase requisition'],
        ...allMyRequests['purchase contracts'],
        ...allMyRequests['work orders'],
        ...incidents,
        ...services,
      ];
    }
    data = uniqBy(data, 'id');

    if (data.length === 0) {
      myRequestsNum = 0;
      return (
        <View style={{ justifyContent: 'center', height: '100%' }}>
          <RefreshContainer refresh={false} onPullToRefresh={getAllMyReuqests}>
            <Text
              style={{
                textAlign: 'center',
                color: '#007598',
                fontFamily: '29LTAzer-Regular',
                marginTop: Dimensions.get('window').height * 0.17,
              }}
            >
              لا يوجد نتائج
            </Text>
          </RefreshContainer>
        </View>
      );
    }

    let sortedArray = _.orderBy(
      data,
      [
        function (object) {
          return object.create_date
            ? object.create_date
            : object.order_date
            ? object.order_date
            : object.close_date;
        },
      ],
      ['desc'],
    );

    data = sortedArray;
    myRequestsNum = data.length;

    // get first three orders from list
    const newData = [];
    for (let index = 0; index < 3; index++) {
      const element = data[index];
      newData.push(element);
    }

    return (
      <MyRequestList
        requestDataList={data.length > 3 ? newData : data}
        menu={state.activeTab}
        onMRefresh={getAllMyReuqests}
        ListFooterComponent={loadMoreFamilyBtn}
        onEndReached={() => {}} //onLoadMore
        onEndReachedThreshold={0}
        initialNumToRender={REQUEST_LIMIT}
        mIsLoading={requestLoading}
        isAllOrders={false}
        {...props}
      />
    );
  }, [
    filters,
    allMyRequests,
    requestLoading,
    props,
    state.activeTab,
    incidents,
    services,
  ]);

  const renderMyApprove = useCallback(() => {
    let data = [];
    if (!allMyRequests.hasOwnProperty('training') && data.length > 0) {
      return (
        <View
          style={{
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#007598',
              fontFamily: '29LTAzer-Regular',
              marginTop: Dimensions.get('window').height * 0.17,
            }}
          >
            الرجاء المحاولة لاحقا
          </Text>
        </View>
      );
    }
    if (filters.length > 0) {
      filters.some((obj) => obj.title === 'Leave')
        ? data.push(...allMyApprove.authorizations)
        : null;
      filters.some((obj) => obj.title === 'CertificateAchievement')
        ? data.push(...allMyApprove['certificate achievement'])
        : null;
      filters.some((obj) => obj.title === 'Mandate')
        ? data.push(...allMyApprove.deputations)
        : null;
      filters.some((obj) => obj.title === 'RemoteWork')
        ? data.push(...allMyApprove['distance work'])
        : null;
      filters.some((obj) => obj.title === 'Vacation')
        ? data.push(...allMyApprove.holidays)
        : null;
      filters.some((obj) => obj.title === 'PaymentOrder')
        ? data.push(...allMyApprove['payment orders'])
        : null;
      filters.some((obj) => obj.title === 'AddBudget')
        ? data.push(...allMyApprove['purchase add budget'])
        : null;
      filters.some((obj) => obj.title === 'PurchaseOrder')
        ? data.push(...allMyApprove['purchase orders'])
        : null;
      filters.some((obj) => obj.title === 'Purchase')
        ? data.push(...allMyApprove['purchase requests'])
        : null;
      filters.some((obj) => obj.title === 'Training')
        ? data.push(...allMyApprove.training)
        : null;
      filters.some((obj) => obj.title === 'Internal')
        ? data.push(...allMyApprove['training public'])
        : null;
      filters.some((obj) => obj.title === 'Resignations')
        ? data.push(...allMyApprove.resignations)
        : null;
      filters.some((obj) => obj.title === 'Custody')
        ? data.push(...allMyApprove.custody)
        : null;
      filters.some((obj) => obj.title === 'CustodyClose')
        ? data.push(...allMyApprove['custody close'])
        : null;
      filters.some((obj) => obj.title === 'purchase requisition')
        ? data.push(...allMyApprove['purchase requisition'])
        : null;
      filters.some((obj) => obj.title === 'purchase contracts')
        ? data.push(...allMyApprove['purchase contracts'])
        : null;
      filters.some((obj) => obj.title === 'work orders')
        ? data.push(...allMyApprove['work orders'])
        : null;

      filters.some((obj) => obj.title === 'hr payslip')
        ? data.push(...allMyApprove['hr payslip'])
        : null;
      filters.some((obj) => obj.title === 'hr payslip run')
        ? data.push(...allMyApprove['hr payslip run'])
        : null;

      filters.some((obj) => obj.title === 'TechnicalRequest')
        ? data.push(...servicesApprove)
        : null;
    } else {
      data = [
        ...allMyApprove.authorizations,
        ...allMyApprove['certificate achievement'],
        ...allMyApprove.deputations,
        ...allMyApprove['distance work'],
        ...allMyApprove.holidays,
        ...allMyApprove['payment orders'],
        ...allMyApprove['purchase add budget'],
        ...allMyApprove['purchase orders'],
        ...allMyApprove['purchase requests'],
        ...allMyApprove.training,
        ...allMyApprove['training public'],
        ...allMyApprove.resignations,
        ...allMyApprove.custody,
        ...allMyApprove['custody close'],
        ...allMyApprove['purchase requisition'],
        ...allMyApprove['purchase contracts'],
        ...allMyApprove['work orders'],
        ...allMyApprove['hr payslip'],
        ...allMyApprove['hr payslip run'],
        ...servicesApprove,
      ];
    }

    data = uniqBy(data, 'id');
    if (data.length === 0) {
      myRequestsNum = 0;

      return (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <RefreshContainer refresh={false} onPullToRefresh={getAllMyReuqests}>
            <Text
              style={{
                textAlign: 'center',
                color: '#007598',
                fontFamily: '29LTAzer-Regular',
                textAlignVertical: 'center',
                marginTop: Dimensions.get('window').height * 0.17,
              }}
            >
              لا يوجد نتائج
            </Text>
          </RefreshContainer>
        </View>
      );
    }
    let sortedArray = _.orderBy(
      data,
      [
        function (object) {
          return object.create_date;
        },
      ],
      ['desc'],
    );

    data = sortedArray;
    myRequestsNum = data.length;

    // get first three orders from list
    const newData = [];
    for (let index = 0; index < 3; index++) {
      const element = data[index];
      newData.push(element);
    }
    return (
      <MyRequestList
        requestDataList={data.length > 3 ? newData : data}
        menu={state.activeTab}
        mIsLoading={approveLoading}
        ListFooterComponent={loadMoreApproveBtn}
        onMRefresh={getAllMyReuqests}
        onEndReachedThreshold={0}
        initialNumToRender={APPROVE_LIMIT}
        onEndReached={() => {}} //onLoadMoreApprove
        isAllOrders={false}
        {...props}
      />
    );
  }, [filters, allMyApprove, approveLoading, props, state.activeTab]);

  const getworkingHours = (start, end) => {
    var startTime = moment(start, 'HH:mm:ss a');
    var endTime = moment(end, 'HH:mm');

    var ms = moment(end).diff(moment(start));
    var d = moment.duration(ms);
    // duration in hours
    var hour = Math.abs(parseInt(d.asHours()));
    var hours = hour < 10 ? '0' + hour : hour;
    // console.log('duration hour', hour);
    // duration in minutes
    var minute = Math.abs(parseInt(d.asMinutes()) % 60);
    var minutes = minute < 10 ? '0' + minute : minute;
    return minutes && hours ? hours + ':' + minutes : '--:--';
  };

  const renderAttendance = () => {
    let checkin = attendance.filter((el) => el.action === 'sign_in');
    let checkout = attendance.filter((el) => el.action === 'sign_out');

    return (
      <TouchableOpacity
        onPress={() => {
          publicIP()
            .then((ip) => {
              let publicIp = ip;

              if (
                publicIp === '5.42.244.10' ||
                publicIp === '77.240.92.238' ||
                (profileData[0] &&
                  profileData[0].attendance_state === 'distance_work') ||
                baseUrl !== 'https://me.monshaat.gov.sa'
              ) {
                dispatch(loadingAction.commonLoader(true));
                // alert(attendance[0].action);
                !attendance[0]
                  ? dispatch(
                      attendanceAction.attendanceCheckInOut(
                        accessToken,
                        state.empID,
                        'check_in',
                      ),
                    )
                  : attendance[0].action == 'sign_in'
                  ? dispatch(
                      attendanceAction.attendanceCheckInOut(
                        accessToken,
                        state.empID,
                        'checkout',
                      ),
                    )
                  : dispatch(
                      attendanceAction.attendanceCheckInOut(
                        accessToken,
                        state.empID,
                        'check_in',
                      ),
                    );
              } else {
                setModal2(true);
              }
            })
            .catch((error) => {
              // console.log(error);
            });
        }}
        style={[
          styles.attendanceContainer,
          {
            backgroundColor: !attendance[0]
              ? '#FFFFFF' //EA4545
              : attendance[0].action == 'sign_in'
              ? '#EA4545'
              : '#FFFFFF',
          },
        ]}
      >
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              color: !attendance[0]
                ? '#666666'
                : attendance[0].action == 'sign_in'
                ? '#fff'
                : '#666666',
              fontFamily: '29LTAzer-Medium',
              marginLeft: '15%',
            }}
          >
            {!attendance[0]
              ? 'تسجيل الدخول'
              : attendance[0].action == 'sign_in'
              ? 'تسجيل الخروج'
              : 'تسجيل الدخول'}
          </Text>
          <View
            style={{
              width: '95%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontFamily: '29LTAzer-Medium',
                    color: !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666',
                    fontSize: 12,
                  }}
                >
                  عدد ساعات العمل
                </Text>

                <Ionicons
                  name="time-outline"
                  size={15}
                  color={
                    !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666'
                  }
                  style={{ marginHorizontal: 3 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: '29LTAzer-Medium',
                  color: !attendance[0]
                    ? '#666666'
                    : attendance[0].action == 'sign_in'
                    ? '#fff'
                    : '#666666',
                  fontSize: 12,
                }}
              >
                {getworkingHours(
                  checkin[checkin.length - 1]?.name,
                  checkout[0]?.name,
                )}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontFamily: '29LTAzer-Medium',
                    color: !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666',
                    fontSize: 12,
                  }}
                >
                  خروج{' '}
                </Text>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={
                    !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666'
                  }
                  style={{ marginHorizontal: 3 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: '29LTAzer-Medium',
                  color: !attendance[0]
                    ? '#666666'
                    : attendance[0].action == 'sign_in'
                    ? '#fff'
                    : '#666666',
                  fontSize: 12,
                }}
              >
                {checkout[0]
                  ? moment(checkout[0].name).format('HH:mm')
                  : '--:--'}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontFamily: '29LTAzer-Medium',
                    color: !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666',
                    fontSize: 12,
                  }}
                >
                  دخول
                </Text>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={
                    !attendance[0]
                      ? '#666666'
                      : attendance[0].action == 'sign_in'
                      ? '#fff'
                      : '#666666'
                  }
                  style={{ marginHorizontal: 3 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: '29LTAzer-Medium',
                  color: !attendance[0]
                    ? '#666666'
                    : attendance[0].action == 'sign_in'
                    ? '#fff'
                    : '#666666',
                  fontSize: 12,
                }}
              >
                {checkin[checkin.length - 1]
                  ? moment(checkin[checkin.length - 1].name).format('HH:mm')
                  : '--:--'}
              </Text>
            </View>
          </View>
        </View>

        <Ionicons
          name="finger-print-outline"
          size={35}
          color={
            !attendance[0]
              ? '#45EAA2'
              : attendance[0].action == 'sign_in'
              ? '#fff'
              : '#45EAA2'
          }
          style={{ marginHorizontal: 5 }}
        />
      </TouchableOpacity>
    );
  };
  function CustRadioButton(props) {
    return (
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: props.color,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 5,
          },
          props.style,
        ]}
      >
        {props.selected ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: props.color,
            }}
          />
        ) : null}
      </View>
    );
  }
  const returnAnswers = (questId) => {
    let a = rate.values.map((ans) => {
      if (ans[0].question_id[0] === questId) {
        return ans[0];
      }
    });

    return a;
  };

  const serviceItem = (icon, label) => {
    return (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => {
          if (label == 'الأخبار') {
            props.navigation.navigate('MonshaatFamily');
          } else if (label == 'دليل الموظفين') {
            props.navigation.navigate('EmployeeSearch');
          } else if (label == 'بنك الأفكار') {
            props.navigation.navigate('QuestBank');
          } else if (label == 'الإستبيانات') {
            props.navigation.navigate('QuestForm');
          } else if (label == 'الملفات') {
          } else {
            props.navigation.navigate('EmployeJourny');
          }
        }}
      >
        <FastImage
          source={icon}
          style={{ width: 27, height: 27, tintColor: '#007598' }}
          tintColor={'#007598'}
          resizeMode="contain"
        />
        <Text style={[styles.serviceLabel, {}]}>{label}</Text>
        {/* {label == 'الإستبيانات' ? (
          <Text
            style={[
              styles.serviceLabel,
              { transform: [{ rotateY: '180deg' }] },
            ]}
          >
            {label}
          </Text>
        ) : (
          <Text style={[styles.serviceLabel, {}]}>{label}</Text>
        )} */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#d5e6ed', '#d5e6ed']} // '#ffffff',
        style={{ flex: 1, backgroundColor: '#00759810' }}
      >
        <NewHeader {...props} />
        {/* <View style={{ width: '100%', height: '100%' }}> */}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: -Dimensions.get('window').height * 0.021,
            // position: 'absolute',
            // top:
            //   Platform.OS == 'android'
            //     ? Dimensions.get('window').height * 0.09
            //     : Dimensions.get('window').height * 0.12,
          }}
        >
          {renderAttendance()}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View
            style={{
              justifyContent: 'space-around',
              marginTop: Dimensions.get('window').height * 0.015,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={styles.newContainer}>
                <TouchableOpacity
                  onPress={handleNewOrder}
                  style={styles.leftContainer}
                >
                  <Text style={styles.newText}>طلب جديد</Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: '29LTAzer-Medium',
                      color: '#2E5784',
                    }}
                  >
                    +
                  </Text>
                  {/* <IconFe name="plus" size={13} color={'#2E5784'} /> */}
                </TouchableOpacity>
                <View style={styles.rightContainer}>
                  <Text style={styles.newText}>الطلبات</Text>
                </View>
              </View>

              <View style={styles.container1}>
                {!state.isMenuApprovalVisible && (
                  <TouchableOpacity
                    style={[
                      styles.activeTab,
                      {
                        backgroundColor:
                          state.activeTab == 'myRequest' ? '#007598' : '#fff',
                      },
                    ]}
                    onPress={handleMyRequest}
                  >
                    <Text
                      style={[
                        styles.activeTabText,
                        {
                          color:
                            state.activeTab == 'myRequest'
                              ? 'white'
                              : '#20547a',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      طلباتي
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={{}}>
            <View
              style={{
                width: '100%',
                height:
                  Platform.OS == 'android'
                    ? Dimensions.get('window').height * 0.47
                    : Dimensions.get('window').height * 0.42,
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <View
                style={{
                  width: '94%',
                  height: '100%',
                  alignItems: 'center',
                  borderRadius: 10,
                  backgroundColor: '#fff',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <View style={{ marginBottom: 5 }}>
                    {/* {state.isMenuApprovalVisible && (
                      <TabNav
                        label1="طلباتي"
                        label2="موافقاتى"
                        onNavChange={v => {
                          setState(old => ({
                            ...state,
                            activeTab: v == 0 ? 'approval' : 'myRequest',
                            isMenuApprovalVisible: old.isMenuApprovalVisible,
                          }));
                          setFilters([]);
                          setActiveFilters([]);
                          setTempFilters([]);
                          setAll(true);
                          setBsShown(false);
                          getAllMyReuqests;
                        }}
                        index={state.activeTab == 'approval' ? 0 : 1}
                      />
                    )} */}

                    <View
                      style={{
                        width: '90%',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          alignItems: 'center',
                          paddingTop: Platform.OS == 'ios' ? '5%' : '3%',
                        }}
                      >
                        <TouchableOpacity
                          style={{ alignItems: 'center', flex: 1 }}
                          onPress={() =>
                            setState((old) => ({
                              ...state,
                              activeTab: 'myRequest',
                            }))
                          }
                        >
                          <Text
                            style={{
                              color:
                                state.activeTab == 'myRequest'
                                  ? '#5399E6'
                                  : '#A9A9A9',
                              fontFamily: '29LTAzer-Medium',
                              fontSize: hp('2%'),
                            }}
                          >
                            طلباتى
                          </Text>
                          <View
                            style={{
                              width: '100%',
                              marginTop: 5,
                              height: state.activeTab == 'myRequest' ? 3 : 1,
                              backgroundColor:
                                state.activeTab == 'myRequest'
                                  ? '#5399E6'
                                  : '#A9A9A9',
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ alignItems: 'center', flex: 1 }}
                          onPress={() => {
                            setState((old) => ({
                              ...state,
                              activeTab: 'approval',
                            }));
                          }}
                        >
                          <Text
                            style={{
                              color:
                                state.activeTab == 'approval'
                                  ? '#5399E6'
                                  : '#A9A9A9',
                              fontFamily: '29LTAzer-Medium',
                              fontSize: hp('2%'),
                            }}
                          >
                            موافقاتى
                          </Text>
                          <View
                            style={{
                              width: '100%',
                              marginTop: 5,
                              height: state.activeTab == 'approval' ? 3 : 1,
                              backgroundColor:
                                state.activeTab == 'approval'
                                  ? '#5399E6'
                                  : '#A9A9A9',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', flex: 1 }}>
                    {state.activeTab == 'myRequest' ? (
                      Object.keys(allMyRequests).length > 0 ? (
                        <View style={{ width: '100%' }}>
                          {renderMyRequest()}
                        </View>
                      ) : (
                        <View style={{ justifyContent: 'center' }}>
                          <CustomActivityIndicator modalVisible={true} />
                        </View>
                      )
                    ) : state.activeTab ===
                      'newRequest' ? null : state.activeTab === 'approval' &&
                      state.activeMenuTab !== 'All' ? (
                      Object.keys(allMyApprove).length > 0 ? (
                        <View style={{ width: '100%' }}>
                          {renderMyApprove()}
                        </View>
                      ) : (
                        <View style={{ justifyContent: 'center' }}>
                          <CustomActivityIndicator modalVisible={true} />
                        </View>
                      )
                    ) : !approveLoading || !requestLoading ? (
                      <RequestList
                        requestDataList={
                          state.requestDataOfList &&
                          state.activeMenuTab !== 'All'
                            ? state.requestDataOfList
                            : state.requestDataOfList[0]
                        }
                        mIsLoading={approveLoading || requestLoading}
                      />
                    ) : (
                      <CustomActivityIndicator modalVisible={true} />
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.allOrders}
                  onPress={() => {
                    props.navigation.navigate('AllOrders2', {
                      tabName: state.activeTab,
                    });
                  }}
                >
                  <Text style={{ color: '#4B4B4B' }}>عرض كل الطلبات</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <Text style={styles.service}>الخدمات</Text>
              <View
                style={{
                  width: '94%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* {serviceItem(
                  require('../../assets/images/Group8.png'),
                  'الإستبيانات',
                )} */}
                {serviceItem(
                  require('../../assets/images/Group7.png'),
                  'رحلة الموظف',
                )}
                {serviceItem(
                  require('../../assets/images/Group3.png'),
                  'الأخبار',
                )}
                {/* {serviceItem(
                  require('../../assets/images/Group2.png'),
                  'الملفات',
                )} */}
                {serviceItem(
                  require('../../assets/images/Group1.png'),
                  'بنك الأفكار',
                )}
                {serviceItem(
                  require('../../assets/images/Group8.png'),
                  'الإستبيانات',
                )}
              </View>
              {/* <View
                style={{
                  width: '94%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 7,
                  transform: [{ rotateY: '180deg' }],
                }}
              >
                {serviceItem(
                  require('../../assets/images/Group8.png'),
                  'الإستبيانات',
                )}
              </View> */}
            </View>
          </View>
          {isLoading ? <Loader /> : null}
          {renderShadow()}
        </ScrollView>
      </LinearGradient>

      <SnackBar
        style={{ fontFamily: '29LTAzer-Regular' }}
        visible={snackVisib}
        textMessage="تم تسجيل الخروج بنجاح"
        actionHandler={() => {
          setSnackVisib(false);
        }}
        actionText="let's go"
      />
      <CommonPopup
        visible={showModal}
        autoCLose={true}
        onClose={() => {
          setTimeout(() => {
            dispatch({
              type: 'ATTENDANCE_MODAL',
              value: false,
            });
          }, 1000);
        }}
      />
      <CommonPopup2
        style={{ fontFamily: '29LTAzer-Regular' }}
        close={true}
        visible={modal2}
        text="لتسجيل الحضور و الانصراف يجب استخدام شبكة منشآت أو وجود طلب عمل عن بعد"
        onClose={() => {
          setModal2(false);
        }}
      />
      <Modal3
        isVisible={isModalVisible}
        hasBackdrop={true}
        backdropOpacity={0.7}
        backdropColor="black"
        animationIn="fadeIn"
        animationOut="fadeOut"
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.notificationsTitleContainer}>
              <Text style={styles.notificationsTitleText}>
                {remoteMessage &&
                remoteMessage?.data?.res_model === 'survey.survey'
                  ? remoteMessage?.notification?.title
                  : remoteMessage?.notification?.title}
              </Text>
              <Image
                source={require('../../assets/images/logo3.png')}
                style={styles.notificationImage}
              />
            </View>
            <View style={styles.hr} />
            <Text style={styles.modalText}>
              {remoteMessage &&
              remoteMessage?.data?.res_model === 'survey.survey'
                ? rate && rate?.survey_vals[0].name
                : remoteMessage?.notification?.body}
            </Text>

            {remoteMessage &&
              remoteMessage?.data?.res_model === 'survey.survey' &&
              rate &&
              rate.survey_vals[0].answer_type === 'text' && (
                <View
                  style={{
                    paddingBottom: 10,
                    width: '100%',
                  }}
                >
                  <TextInput
                    style={[
                      state.isValidated
                        ? styles.textInputStyle
                        : styles.textErrorStyle,
                      { paddingVertical: 30 },
                    ]}
                    multiline={true}
                    onChangeText={(text) => {
                      text.length > 0 &&
                        setState({ ...state, isValidated: true });
                      setQuestText(text);
                    }}
                    defaultValue={questText}
                    placeholder="الاجابة"
                  />
                </View>
              )}
            {remoteMessage &&
              remoteMessage?.data?.res_model === 'survey.survey' &&
              rate &&
              rate.survey_vals[0].answer_type === 'choices' &&
              returnAnswers(rate.survey_vals[0].id).map((resp) => {
                return (
                  <View
                    style={{
                      bottom: 10,
                      borderColor: 'red',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setAnsValue(resp.id)}
                      value={ansValue}
                      style={{ marginVertical: 5 }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',

                          right: 0,
                          display: 'flex',
                          alignSelf: 'flex-end',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: '29LTAzer-Regular',
                            textAlign: 'right',
                            top: 10,
                            marginRight: 5,
                          }}
                        >
                          {resp.name}
                        </Text>
                        <CustRadioButton
                          color={'#007598'}
                          selected={resp.id == ansValue}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            <View style={styles.notificationsButtonsContainer}>
              {remoteMessage &&
              remoteMessage?.data?.res_model === 'survey.survey' &&
              rate &&
              rate.survey_vals[0].is_required === true ? null : remoteMessage &&
                remoteMessage?.data?.request_type === 'none' ? null : (
                <TouchableOpacity
                  style={styles.notificationsButtonCancel}
                  onPress={() => {
                    setModalVisible(false);
                    setRemoteMessage(null);
                  }}
                >
                  <Text style={styles.notificationsTextCancel}>
                    {remoteMessage &&
                    remoteMessage?.data?.res_model === 'survey.survey'
                      ? 'تجاهل'
                      : 'إلغاء'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.notificationsButtonDisplay}
                onPress={() => {
                  remoteMessage &&
                  remoteMessage?.data?.res_model === 'survey.survey'
                    ? verifDataValidation()
                    : notificationNavigation(remoteMessage.data);
                }}
              >
                <Text style={styles.notificationsTextDisplay}>
                  {' '}
                  {remoteMessage &&
                  remoteMessage?.data?.res_model === 'survey.survey'
                    ? 'إرسال'
                    : remoteMessage &&
                      remoteMessage?.data?.request_type === 'none'
                    ? 'حسناً'
                    : 'عرض'}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal3>

      <Modal3
        isVisible={showRelease}
        hasBackdrop={true}
        backdropOpacity={0.7}
        backdropColor="black"
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        {/* الإصدار */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.notificationsTitleContainer}>
              <Text style={styles.notificationsTitleText}>
                ما الجديد في هذا الإصدار {'1.0.94'}
                {/* {releaseVersion} */}
              </Text>
              <Image
                source={require('../../assets/images/logo3.png')}
                style={styles.notificationImage}
              />
            </View>
            <View style={styles.hr} />
            <Text style={styles.modalText}>{releaseNotes}</Text>
            <View style={styles.notificationsButtonsContainer}>
              <TouchableOpacity
                style={styles.notificationsButtonDisplay}
                onPress={async () => {
                  setShowRelease(false);
                }}
              >
                <Text style={styles.notificationsTextDisplay}>حسناً</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal3>

      <BottomSheet
        ref={sheetRef}
        callbackNode={fall.current}
        onCloseEnd={() => setBsShown(false)}
        onOpenEnd={() => setBsShown(true)}
        snapPoints={[
          Platform.OS === 'android'
            ? Dimensions.get('window').height / 1.6
            : Dimensions.get('window').height / 1.7,
          -600,
        ]}
        initialSnap={1}
        borderRadius={10}
        renderContent={bs == 'sort' ? renderContentSort : renderContentNew}
      />

      {/* {state.isLoad ? <Loader /> : null} */}

      <CommonPopup
        visible={state.showSuccessModal}
        onClose={() => {
          setState({ ...state, showSuccessModal: false });
          setAnsValue(null);
          setQuestText(null);
          state.showModal && props.navigation.goBack();
        }}
      />
      <CommonPopup
        visible={verifModal}
        text={'انت على وشك إرسال الإستفتاء، هل انت متأكد؟'}
        onClose={() => {
          if (!verifModal) {
            return;
          }
          handleRating();
        }}
        onCancel={() => {
          setVerifModal(false);
          setModalVisible(true);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textInputStyle: {
    borderColor: '#e3e3e3',
    width: 200,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,

    width: '100%',
  },
  textErrorStyle: {
    borderColor: 'red',
    width: 200,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
  },
  buttonStyle: {
    borderColor: 'red',
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginVertical: 30,
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  container1: {
    width: '94%',
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  container0: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  newContainer: {
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Dimensions.get('window').height * 0.011,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    backgroundColor: '#007598',
    borderRadius: 50,
    width: 35,
    height: 35,

    justifyContent: 'center',
    alignItems: 'center',
  },
  newText: {
    color: '#2E5784',
    fontSize: 17,
    fontFamily: '29LTAzer-Medium',
    marginHorizontal: 3,
    opacity: 1,
  },
  activeTabText: {
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  userText: {
    textAlign: 'right',
    paddingRight: 25,
    paddingBottom: 24,
    fontSize: 20,
    fontFamily: '29LTAzer-Regular',
  },
  attendanceTextContainer: {
    borderRadius: 30,
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1.5%'),
    backgroundColor: '#007598',
  },
  menuContainer: {
    height: '100%',
    paddingHorizontal: wp('6%'),
    marginHorizontal: wp('2%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderRadius: 30,
    flexDirection: 'row-reverse',
  },
  menuText: {
    color: '#007598',
    paddingRight: wp('2%'),
    fontFamily: '29LTAzer-Regular',
  },
  menuItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5,
  },
  menuItemText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  itemNewContainer: {
    paddingVertical: 12,

    width: 100,
    height: 80,
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemNewText: {
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    textAlign: 'center',
  },
  itemNewImage: {
    width: 25,
    height: 20,
    marginBottom: 10,
    tintColor: '#c4dbe2',
  },
  bsContainer: {
    backgroundColor: 'white',
    padding: 10,
    height: '100%',
    borderTopLeftRadius: 70,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  bsItemsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 25,
  },
  bsTitle: {
    color: '#20547a',
    fontSize: 16,
    fontFamily: '29LTAzer-Regular',
    marginHorizontal: 5,
    marginTop: 10,
    right: 10,
    position: 'absolute',
    top: 0,
    marginBottom: 10,
  },
  bsButton: {
    backgroundColor: '#007297',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  bsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: '29LTAzer-Regular',
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '70%',
    // paddingTop: Dimensions.get('window').height * 0.01,
    borderRadius: 50,
    paddingVertical:
      Platform.OS == 'ios' ? Dimensions.get('window').height * 0.006 : 0,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
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
    padding: 20,
    paddingTop: 10,
    width: '80%',
    alignItems: 'flex-end',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'right',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  modalTextt: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  hr: {
    height: 0.8,
    width: '112%',
    alignSelf: 'center',
    backgroundColor: '#dbdbdb',
    marginBottom: 20,
  },
  notificationsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: -10,
  },
  notificationImage: {
    width: 23,
    height: 23,
    borderRadius: 5,
    marginLeft: 10,
  },
  notificationsTitleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#424242',
  },
  notificationsButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  notificationsButtonDisplay: {
    backgroundColor: '#11708e',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  notificationsButtonCancel: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11708e',
  },
  notificationsTextDisplay: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#fff',
  },
  notificationsTextCancel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#11708e',
  },
  CustButtonsContainer: {
    height: 50,
    width: '90%',
    marginBottom: 10,
    backgroundColor: '#fff',
    transform: [{ scaleX: -1 }],
    borderRadius: 5,
  },
  CustButtonsContentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
  },
  CustButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 35,
    backgroundColor: '#008AC5',
    marginHorizontal: 5,
    borderRadius: 5,
    transform: [{ scaleX: -1 }],
  },
  custButtonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 12,
    color: '#fff',
  },
  ordersCard: {
    width: '95%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 5,
    shadowOpacity: 0.3,
  },
  service: {
    width: '94%',
    textAlign: 'right',
    color: '#2E5784',
    fontSize: 18,
    fontFamily: '29LTAzer-Medium',
    marginVertical: 7,
  },
  serviceLabel: {
    textAlign: 'center',
    color: '#4B4B4B',
    fontSize: 13,
    marginTop: 4,
    fontFamily: '29LTAzer-Bold',
  },
  serviceItem: {
    width: Dimensions.get('window').width / 4.5,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    // marginHorizontal: 1,
  },
  allOrders: {
    alignItems: 'center',
    backgroundColor: '#D5DCDF',
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS == 'ios' ? 8 : 6,
  },
});
export default Home;
