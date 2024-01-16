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
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import publicIP from 'react-native-public-ip';
import Animated from 'react-native-reanimated';
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
import CommonTextInput from '../../components/CommonTextInput';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import CommonDropdown from '../../components/CommonDropdown';

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
let allData = [];
const AllOrders = props => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const userProfileData = useSelector(
    state => state.ProfileReducer.userProfileData,
  );
  const profileData = useSelector(state => state.ProfileReducer.profileData);
  const fall = useRef(new Animated.Value(1));
  const sheetRef = useRef(null);
  const [bs, setBs] = useState('new');
  const [bsShowm, setBsShown] = useState(false);
  const [popup, setPopup] = useState(false);
  const [mandatory, setMandatory] = useState();
  const [remoteMessage, setRemoteMessage] = useState({});
  const [ansValue, setAnsValue] = useState('');
  const [questText, setQuestText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [approve, setApprove] = useState(false);
  const [filters, setFilters] = useState([]);
  const [tempFilters, setTempFilters] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [surveyNotif, setSurveyNotif] = useState({});
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
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);
  const [employeeID, setEmployeeID] = useState('');
  const [sectors, setSectors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sectors_ids, setSectors_ids] = useState([]);
  const [departments_ids, setDepartments_ids] = useState([]);
  const [sectors_items, setSectors_items] = useState([]);
  const [departments_items, setDepartments_tems] = useState([]);
  const [check_ids, setCheck_ids] = useState([]);
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [snackVisib, setSnackVisib] = useState(false);

  var isProduction = true;
  const [value, setValue] = useState(null);
  const managerID = useSelector(state => state.LoginReducer.managerId);

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  const itsmToken = useSelector(state => state.ProfileReducer.ITSMToken);

  const showModal = useSelector(state => state.AttendanceReducer.showModal);
  const requestLoading = useSelector(
    state => state.HomeMyRequestReducer.requestLoading,
  );
  const approveLoading = useSelector(
    state => state.HomeMyRequestReducer.approveLoading,
  );

  const attendance = useSelector(
    state => state.HomeMyRequestReducer.attendance,
  );
  const [modal2, setModal2] = useState(false);
  const [state, setState] = useState({
    surveyQuest: null,
    modalVisible: false,
    notificationData: [],
    userId: '',
    notificationDatadisplayname: [],
    activeTab: 'approval',
    activeMenuTab: '',
    isMenuApprovalVisible: true,
    sentbyName: '',
    requestDataOfList: [],
    menuMyRequest: tabs,
    menuDataApproval: [
      {
        title: 'Leave',
        icon: LeaveImage,
        arabicTitle: 'استئذان',
      },
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
        title: 'PaymentOrder',
        icon: IconPaymentOrder,
        arabicTitle: 'أمر صرف',
      },
      {
        title: 'PurchaseOrder',
        icon: IconPurchaseOrder,
        arabicTitle: 'أمر شراء',
      },
      {
        title: 'AddBudget',
        icon: IconAddBudget,
        arabicTitle: 'تعزيز ميزانية',
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
        title: 'CertificateAchievement',
        icon: IconCertificateAchievement,
        arabicTitle: 'شهادة الإنجاز',
      },
      {
        title: 'Internal',
        icon: SessionImage,
        arabicTitle: ' الدورات الداخلية',
      },
      {
        title: 'Resignations',
        icon: LetterImage,
        arabicTitle: 'الإستقالة',
      },
      {
        title: 'Custody',
        icon: CustodyImage,
        arabicTitle: 'طلب عهدة',
      },
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
    ],
    menuData: [
      {
        title: 'Leave',
        icon: LeaveImage,
        arabicTitle: 'استئذان',
      },
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
        title: 'PaymentOrder',
        icon: IconPaymentOrder,
        arabicTitle: 'أمر صرف',
      },
      {
        title: 'PurchaseOrder',
        icon: IconPurchaseOrder,
        arabicTitle: 'أمر شراء',
      },
      {
        title: 'AddBudget',
        icon: IconAddBudget,
        arabicTitle: 'تعزيز ميزانية',
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
        title: 'TechnicalRequest',
        icon: TrainingImage,
        arabicTitle: 'مركز الطلبات والدعم',
      },

      {
        title: 'CertificateAchievement',
        icon: IconCertificateAchievement,
        arabicTitle: 'شهادة الإنجاز',
      },
      {
        title: 'Hrletter',
        icon: LetterImage,
        arabicTitle: ' خطاب الموارد',
      },
      {
        title: 'Resignations',
        icon: LetterImage,
        arabicTitle: 'الإستقالة',
      },
      {
        title: 'Internal',
        icon: SessionImage,
        arabicTitle: ' الدورات الداخلية',
      },
      {
        title: 'Custody',
        icon: CustodyImage,
        arabicTitle: 'طلب عهدة',
      },
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

  const inOut = useSelector(state => state.AttendanceReducer.inOut);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  AsyncStorage.setItem('accessToken', accessToken);

  const allMyRequests = useSelector(
    state => state.HomeMyRequestReducer.allMyRequests,
  );

  const allMyApprove = useSelector(
    state => state.HomeMyRequestReducer.allMyApprove,
  );

  const userGroupData = useSelector(
    state => state.ProfileReducer.userGroupData,
  );
  const editableData = useSelector(
    state => state.HomeMyRequestReducer.editable,
  );

  const NotificationData = useSelector(
    state => state.NotificationrequestReducer.notificationData,
  );
  const NotificationDataDisplayName = useSelector(
    state => state.NotificationrequestReducer.notificationDatadisplayname,
  );

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Home_Screen');
    }
    getToken();
  }, [isFocused]);

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
          .then(response => response.json())
          .then(async responseData => {
            await AsyncStorage.setItem(
              'ReleaseNotes',
              JSON.stringify(responseData[0].message),
            );

            setReleaseNotes(responseData[0].message);
            setReleaseVersion(responseData[0].version);
            setShowRelease(true);
          })
          .catch(error => {
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
      .then(response => response.json())
      .then(responseData => {
        setState({
          ...state,
          isLoad: false,
          showSuccessModal: true,
        });
        AsyncStorage.removeItem('Questionary');
      })
      .catch(error => {
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
        style: {
          alignItems: 'flex-end',
          fontFamily: '29LTAzer-Regular',
        },
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
      let url = `${baseUrl}/api/call/all.requests/get_employee_required_survey?kwargs={"employee_id":${EmpId}}`;
      let secretUrl = await EncryptUrl(url);
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(async responseData => {
          const RespData = JSON.stringify(responseData);
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
        .catch(error => {
          // console.error('Error:', error);
        });
    })();
  }, [accessToken, isFocused, props.navigation, appStateVisible]);
  const notificationNavigation = useCallback(
    async selectedNotification => {
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
                payload: {
                  index: 4,
                  tabValue: 'me',
                },
              });
              break;
            case 'team_calendar':
              store.dispatch({
                type: 'navigate-to',
                payload: {
                  index: 4,
                  tabValue: 'team',
                },
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
                payload: {
                  index: 1,
                  viewExperts: false,
                },
              });
              break;
            case 'experts_list':
              store.dispatch({
                type: 'navigate-to',
                payload: {
                  index: 1,
                  viewExperts: true,
                },
              });
              break;
            case 'search':
              store.dispatch({
                type: 'navigate-to',
                payload: { index: 0 },
              });
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
                profileData: {
                  ...profile_data[0],
                  ...profileData[0],
                },
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
              .then(response => response.json())
              .then(responseData => {
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
              .catch(err => {});
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
            } else if (selectedNotification.res_model === 'purchase.order') {
              empID == item.employee_id[0]
                ? navigation.navigate('FormPurchaseOrder', {
                    item: item,
                  })
                : navigation.navigate('FormPurchaseOrder', {
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

  const _handleAppStateChange = nextAppState => {
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
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('remoteMessage', remoteMessage);
      remoteMessage.notification.title.includes('رسالة')
        ? props.navigation.navigate('MessagesFeed', {
            correspondantId: remoteMessage.data.correspondant,
          })
        : notificationNavigation(remoteMessage.data);
    });
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        // console.log('remoteMessage', remoteMessage);
        remoteMessage.notification.title.includes('رسالة')
          ? props.navigation.navigate('MessagesFeed', {
              correspondantId: remoteMessage.data.correspondant,
            })
          : notificationNavigation(remoteMessage.data);
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
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
    messaging().onMessage(async remoteMessage => {
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
    AsyncStorage.getItem('empID').then(mEmpId => {
      empID = mEmpId;
      if (userGroupData && userGroupData.length && empID) {
        AsyncStorage.setItem(
          'userGroup',
          JSON.stringify(userGroupData[0].groups_id),
        );
        mGroup = userGroupData[0].groups_id;
        setState({
          ...state,
          isMenuApprovalVisible: false,
        });
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
                {
                  title: 'Leave',
                  icon: LeaveImage,
                  arabicTitle: 'استئذان',
                },
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
      AsyncStorage.getItem('userid').then(async data1 => {
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
      AsyncStorage.getItem('userid').then(async data1 => {
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
  const handleSelect = () => {
    setBs('sort');
    sheetRef.current.snapTo(0);
  };
  const onLoadMoreApprove = () => {
    if (!accessToken || empID == '1') {
      return;
    }
    let data = {
      token: accessToken,
      id: empID,
      limit: APPROVE_LIMIT,
      page: pageApprove + 1,
    };
    dispatch(
      homeMyRequestActions.getAllMyApproveList({
        data: data,
      }),
    );
    setPageApprove(pageApprove + 1);
  };
  // , [accessToken, empID, pageApprove, APPROVE_LIMIT]);

  const onLoadMore = () => {
    if (!accessToken || empID == '1') {
      return;
    }
    let data = {
      token: accessToken,
      id: empID,
      limit: REQUEST_LIMIT,
      page: page + 1,
    };
    dispatch(
      homeMyRequestActions.getAllMyReuqestList({
        data: data,
      }),
    );
    setPage(page + 1);
  };
  // , [accessToken, empID, page, REQUEST_LIMIT]);

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
  }, [getAllMyReuqests, isLoading, sectors_ids, departments_ids, employeeID]);

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
  }, []); //getAttendance

  useEffect(() => {
    getFilterSectors();
    getFilterDepartments(sectors_ids);
    getFilterEmployees();
  }, [empID, accessToken]);

  const getFilterSectors = () => {
    if (!accessToken || empID == '1') {
      return;
    }
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_sectors?kwargs={"employee_id": ${empID}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('all order getSectorsList', responseData);
        setSectors(responseData);
      })
      .catch(err => {
        console.log('getSectorsList error', err);
      });
  };
  const getFilterDepartments = sectorIds => {
    if (!accessToken || empID == '1') {
      return;
    }
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_departments?kwargs={"employee_id": ${empID},"sector_ids":[${sectorIds}]}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('all order getFilterDepartments', responseData);
        setDepartments(responseData);
      })
      .catch(err => {
        console.log('getFilterDepartments error', err);
      });
  };
  const getFilterEmployees = () => {
    if (!accessToken || empID == '1') {
      return;
    }
    const url =
      baseUrl +
      `/api/call/all.requests/get_employee_employees?kwargs={"employee_id": ${empID},"sector_ids":[${sectors_ids}],"departments_ids":[${departments_ids}]}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('all order getFilterEmployees', responseData);
        const data = [];
        var arr = responseData;
        if (arr) {
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              label: arr[index].complete_name,
              value: arr[index].id,
            };
            data.push(obj);
          }
          setEmployees(data);
        } else setEmployees([]);
      })
      .catch(err => {
        remoteLog(url, err);
        console.log('getFilterEmployees error', err);
      });
  };

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
            style={{
              width: 30,
              height: 30,
              marginHorizontal: 8,
            }}
          />
        ) : null}
      </View>
    );
  };
  const loadMoreFamilyBtn = data => {
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
        {requestLoading && data.length > 10 ? (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{
              width: 30,
              height: 30,
              marginHorizontal: 8,
            }}
          />
        ) : null}
      </View>
    );
  };
  const handleMenuItem = item => {
    let active = activeFilters.some(obj => obj.title === item.title);

    if (active) {
      let myArray = activeFilters.filter(function(obj) {
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

  const handleMenuItemSectors = item => {
    let active = sectors_items.some(obj => obj.id === item.id);

    if (active) {
      let myArray = sectors_items.filter(function(obj) {
        return obj.id !== item.id;
      });
      setSectors_items(myArray);
      const ids = [];
      myArray.forEach(element => {
        ids.push(element.id);
      });
      setSectors_ids(ids);
      console.log('myArray', ids);
      getFilterDepartments(ids);
    } else {
      let mData = uniqBy([...sectors_items, item], 'id');
      setSectors_items(mData);
      const ids = [];
      mData.forEach(element => {
        ids.push(element.id);
      });
      setSectors_ids(ids);
      console.log('mData', ids);
      getFilterDepartments(ids);
    }
    setAll(false);
    setBsShown(false);
  };

  const handleMenuItemDepartments = item => {
    let active = departments_items.some(obj => obj.id === item.id);

    if (active) {
      let myArray = departments_items.filter(function(obj) {
        return obj.id !== item.id;
      });
      setDepartments_tems(myArray);
      const ids = [];
      myArray.forEach(element => {
        ids.push(element.id);
      });
      setDepartments_ids(ids);
    } else {
      let mData = uniqBy([...departments_items, item], 'id');
      setDepartments_tems(mData);
      const ids = [];
      mData.forEach(element => {
        ids.push(element.id);
      });
      setDepartments_ids(ids);
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

  const handleApprovalRequest = async () => {
    setState({
      ...state,
      activeTab: 'approval',
    });
    AnnalyticsFirebase('Approve_Request_Screen');

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
      setDate('');
    } else {
      setFilters(activeFilters);
    }

    sheetRef.current.snapTo(1);
  };

  const handleBsClose = () => {
    let mData = [];
    if (all) {
      mData = [...tempFilters];
      setAll(false);
    } else {
      mData = activeFilters.filter(e => filters.includes(e));
    }
    if (mData.length == 0) {
      setAll(true);
    }
    setActiveFilters(mData);
  };

  const handleAll = () => {
    if (!all) {
      setTempFilters([...activeFilters]);
      setActiveFilters([]);
      setSectors_ids([]);
      setDepartments_ids([]);
      setSectors_items([]);
      setDepartments_tems([]);
      setAll(!all);
    }
  };
  const SelectAllSort = ({ newArray }) => {
    return (
      <TouchableOpacity
        onPress={handleAll}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: all ? '#008AC5' : '#fff',
            paddingHorizontal: 12,
            paddingVertical: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: all ? '#fff' : '#008AC5',
              fontFamily: '29LTAzer-Medium',
              fontSize: newArray.length > 8 ? 14 : 16,
            },
          ]}
        >
          الكل
        </Text>
      </TouchableOpacity>
    );
  };
  const SelectItemSort = ({ item, newArray }) => {
    let active = activeFilters.some(obj => obj.title === item.title);
    return (
      <TouchableOpacity
        onPress={() => handleMenuItem(item)}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: active ? '#008AC5' : '#fff',
            paddingHorizontal: 15,
            paddingVertical: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: active ? '#fff' : '#008AC5',
              fontFamily: '29LTAzer-Medium',
              fontSize: Dimensions.get('window').width * 0.035,
            },
          ]}
        >
          {item.arabicTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  const SelectItemSortSectors = ({ item, newArray }) => {
    let active = sectors_items.some(obj => obj.id === item.id);
    return (
      <TouchableOpacity
        onPress={() => {
          handleMenuItemSectors(item);
        }}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: active ? '#008AC5' : '#fff',
            paddingHorizontal: 15,
            paddingVertical: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: active ? '#fff' : '#008AC5',
              fontFamily: '29LTAzer-Medium',
              fontSize: Dimensions.get('window').width * 0.035,
            },
          ]}
        >
          {item.display_name}
        </Text>
      </TouchableOpacity>
    );
  };
  const SelectItemSortDepartmets = ({ item, newArray }) => {
    let active = departments_items.some(obj => obj.id === item.id);
    return (
      <TouchableOpacity
        onPress={() => {
          handleMenuItemDepartments(item);
        }}
        style={[
          styles.menuItemContainer,
          {
            backgroundColor: active ? '#008AC5' : '#fff',
            paddingHorizontal: 15,
            paddingVertical: 8,
          },
        ]}
      >
        <Text
          style={[
            styles.menuItemText,
            {
              color: active ? '#fff' : '#008AC5',
              fontFamily: '29LTAzer-Medium',
              fontSize: Dimensions.get('window').width * 0.035,
            },
          ]}
        >
          {item.display_name}
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
      data.forEach(elm => {
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
        } else {
          newArray.push(elm);
        }
      });
    }

    return (
      <View
        // colors={['#d1e3eb', '#e1eaed', '#d1e3eb']}
        style={styles.bsContainer}
      >
        <ScrollView style={{ marginTop: 20 }}>
          <Text
            style={
              ([styles.bsTitle],
              {
                marginHorizontal: 5,
                textAlign: 'right',
                color: '#4B4B4B',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 5,
              })
            }
          >
            تصفية النتائج
          </Text>
          <View
            style={{
              width: '98%',
              height: 1,
              backgroundColor: '#dbdbdb',
              alignSelf: 'center',
              marginVertical: 10,
            }}
          ></View>
          {state.activeTab === 'approval' && (
            <View
              style={{
                width: '100%',
                height: 50,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              <CommonDropdown
                itemData={employees}
                onValueChange={(value, index) => {
                  console.log(value);
                  setEmployeeID(value);
                }}
                value={employeeID}
                placeholderText={'الموظف'}
                employee={true}
              />
              <Text
                style={{
                  color: '#4B4B4B',
                  fontSize: newArray.length > 6 ? 15 : 17,
                  fontFamily: '29LTAzer-Medium',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  alignSelf: 'center',
                }}
              >
                صاحب الطلب :
              </Text>
            </View>
          )}
          <Text style={styles.label}>نوع الطلب:</Text>
          <View style={styles.bsItemsContainer}>
            <SelectAllSort newArray={newArray} />
            {newArray.map(el => {
              return <SelectItemSort item={el} newArray={newArray} />;
            })}
          </View>
          {state.activeTab === 'approval' ? (
            <View>
              <Text style={styles.label}>الإدارة:</Text>
              {departments.length > 0 ? (
                <View style={styles.bsItemsContainer}>
                  {departments?.map(el => {
                    return (
                      <SelectItemSortDepartmets
                        item={el}
                        newArray={departments}
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={[styles.label, { marginHorizontal: '12%' }]}>
                  لا يوجد إدارات
                </Text>
              )}

              <Text style={styles.label}>القطاعات:</Text>
              {sectors.length > 0 ? (
                <View style={styles.bsItemsContainer}>
                  {sectors?.map(el => {
                    return (
                      <SelectItemSortSectors item={el} newArray={sectors} />
                    );
                  })}
                </View>
              ) : (
                <Text style={[styles.label, { marginHorizontal: '12%' }]}>
                  لا يوجد قطاعات
                </Text>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              width: '100%',
              height: 40,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: '#E4E4E4',
              borderRadius: 20,
              marginVertical: 5,
            }}
          >
            <IconFe
              name="calendar"
              size={newArray.length > 6 ? 12 : 15}
              color="#c2c2c2"
              onPress={() => setOpen(true)}
            />

            <DatePicker
              date={date ? date : ''}
              selected={date}
              open={open}
              mode="date"
              placeholder=""
              format="DD-MM-YYYY"
              maxDate={new Date().getDate()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onConfirm={date => {
                setOpen(false);
                setDate(date);
                setAll(false);
              }}
              onDateChange={date => {
                setDate(date);
                setAll(false);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              showIcon={false}
              dateIcon={{ color: 'green' }}
              style={{ width: '60%' }}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent',
                  width: '60%',
                },
              }}
            />
            <Text
              style={{
                color: '#000',
                fontSize: newArray.length > 6 ? 10 : 15,
                fontFamily: '29LTAzer-Medium',
                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',
              }}
            >
              التاريخ :
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBsConfirm} style={styles.bsButton}>
            <Text style={styles.bsButtonText}>تصفية</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const handleNewPress = async item => {
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'Leave') {
      if (await isAccessible('hr.authorization', accessToken)) {
        navigation.navigate('LeaveRequest', {
          item: '',
        });
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'آسف! ليس لديك إذن للوصول إلى هذا',
        });
      }
    } else if (item.title === 'TechnicalRequest') {
      if (await isAccessible('helpdesk.ticket', accessToken)) {
        navigation.navigate('TechnicalRequestNew', {
          item: '',
        });
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
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
        style={styles.bsContainer2}
      >
        <View
          style={{
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
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
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map(obj => {
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
      .catch(err => {
        // console.log('responseData err', err);
      });
  }, [itsmToken]);

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
      .then(response => response.json())
      .then(responseData => {
        // console.log('dsdadadadada', responseData);
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
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
          let arr = responseData.result.map(obj => {
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
      .catch(err => {
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
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map(obj => {
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
      .catch(err => {
        // console.log('responseData err', err);
      });
  }, [itsmToken]); //userProfileData, requestLoading,

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
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == 'failure') {
          dispatch(
            profileAction.getJsonWebToken(
              accessToken,
              userProfileData[0].work_email,
            ),
          );
        }
        let arr = responseData.result.map(obj => {
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
      .catch(err => {
        // console.log('responseData err', err);
      });
  }, [userProfileData, approveLoading, itsmToken]);

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

  const searchFilter = (data, text) => {
    const arr = [];
    data.forEach(obj => {
      if (
        obj?.requisition_number?.includes(text) > -1 ||
        obj?.name?.includes(text) ||
        obj?.number?.includes(text) ||
        obj?.seq_number?.includes(text)
      ) {
        arr.push(obj);
      }
    });
    setSearchFilterData(arr);
  };
  const renderMyRequest = useCallback(() => {
    let data = [];
    if (!allMyRequests.hasOwnProperty('training')) {
      return (
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#008AC5',
              fontFamily: '29LTAzer-Regular',
            }}
          >
            الرجاء المحاولة لاحقا
          </Text>
        </View>
      );
    }

    if (filters.length > 0) {
      filters.some(obj => obj.title === 'TechnicalRequest')
        ? data.push(...allMyRequests['help desk'])
        : null;
      filters.some(obj => obj.title === 'TechnicalRequest')
        ? data.push(...incidents)
        : null;
      filters.some(obj => obj.title === 'TechnicalRequest')
        ? data.push(...services)
        : null;
      filters.some(obj => obj.title === 'Vacation')
        ? data.push(...allMyRequests.holidays)
        : null;
      filters.some(obj => obj.title === 'RemoteWork')
        ? data.push(...allMyRequests['distance work'])
        : null;
      filters.some(obj => obj.title === 'Purchase')
        ? data.push(...allMyRequests['purchase requests'])
        : null;
      filters.some(obj => obj.title === 'Hrletter')
        ? data.push(...allMyRequests['salary requests'])
        : null;
      filters.some(obj => obj.title === 'Leave')
        ? data.push(...allMyRequests.authorizations)
        : null;
      filters.some(obj => obj.title === 'Training')
        ? data.push(...allMyRequests.training)
        : null;
      filters.some(obj => obj.title === 'Mandate')
        ? data.push(...allMyRequests.deputations)
        : null;
      filters.some(obj => obj.title === 'CertificateAchievement')
        ? data.push(...allMyRequests['certificate achievement'])
        : null;
      filters.some(obj => obj.title === 'PaymentOrder')
        ? data.push(...allMyRequests['payment orders'])
        : null;
      filters.some(obj => obj.title === 'AddBudget')
        ? data.push(...allMyRequests['purchase add budget'])
        : null;
      filters.some(obj => obj.title === 'PurchaseOrder')
        ? data.push(...allMyRequests['purchase orders'])
        : null;
      filters.some(obj => obj.title === 'Internal')
        ? data.push(...allMyRequests.training_public)
        : null;
      filters.some(obj => obj.title === 'Resignations')
        ? data.push(...allMyRequests.resignations)
        : null;
      filters.some(obj => obj.title === 'Custody')
        ? data.push(...allMyRequests.custody)
        : null;
      filters.some(obj => obj.title === 'CustodyClose')
        ? data.push(...allMyRequests['custody close'])
        : null;
      filters.some(obj => obj.title === 'purchase requisition')
        ? data.push(...allMyRequests['purchase requisition'])
        : null;
      filters.some(obj => obj.title === 'purchase contracts')
        ? data.push(...allMyRequests['purchase contracts'])
        : null;
      filters.some(obj => obj.title === 'work orders')
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

    //filter date
    if (date) {
      let dateFilter = data.filter(function(obj) {
        return (
          moment(obj.create_date).format('DD-MM-YYYY') == date ||
          moment(obj.order_date).format('DD-MM-YYYY') == date ||
          moment(obj.close_date).format('DD-MM-YYYY') == date
        );
      });
      data = dateFilter;
    }
    if (data.length === 0) {
      myRequestsNum = 0;
      return (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <RefreshContainer refresh={false} onPullToRefresh={getAllMyReuqests}>
            <Text
              style={{
                textAlign: 'center',
                color: '#008AC5',
                fontFamily: '29LTAzer-Regular',
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
        function(object) {
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

    return (
      <MyRequestList
        requestDataList={data}
        menu={state.activeTab}
        onMRefresh={getAllMyReuqests}
        ListFooterComponent={loadMoreFamilyBtn(data)}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0}
        initialNumToRender={REQUEST_LIMIT}
        mIsLoading={requestLoading}
        isAllOrders={true}
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
    if (!allMyApprove.hasOwnProperty('training')) {
      return (
        <View
          style={{
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#008AC5',
              fontFamily: '29LTAzer-Regular',
            }}
          >
            الرجاء المحاولة لاحقا
          </Text>
        </View>
      );
    }
    if (filters.length > 0) {
      filters.some(obj => obj.title === 'Leave')
        ? data.push(...allMyApprove.authorizations)
        : null;
      filters.some(obj => obj.title === 'CertificateAchievement')
        ? data.push(...allMyApprove['certificate achievement'])
        : null;
      filters.some(obj => obj.title === 'Mandate')
        ? data.push(...allMyApprove.deputations)
        : null;
      filters.some(obj => obj.title === 'RemoteWork')
        ? data.push(...allMyApprove['distance work'])
        : null;
      filters.some(obj => obj.title === 'Vacation')
        ? data.push(...allMyApprove.holidays)
        : null;
      filters.some(obj => obj.title === 'PaymentOrder')
        ? data.push(...allMyApprove['payment orders'])
        : null;
      filters.some(obj => obj.title === 'AddBudget')
        ? data.push(...allMyApprove['purchase add budget'])
        : null;
      filters.some(obj => obj.title === 'PurchaseOrder')
        ? data.push(...allMyApprove['purchase orders'])
        : null;
      filters.some(obj => obj.title === 'Purchase')
        ? data.push(...allMyApprove['purchase requests'])
        : null;
      filters.some(obj => obj.title === 'Training')
        ? data.push(...allMyApprove.training)
        : null;
      filters.some(obj => obj.title === 'Internal')
        ? data.push(...allMyApprove['training public'])
        : null;
      filters.some(obj => obj.title === 'Resignations')
        ? data.push(...allMyApprove.resignations)
        : null;
      filters.some(obj => obj.title === 'Custody')
        ? data.push(...allMyApprove.custody)
        : null;
      filters.some(obj => obj.title === 'CustodyClose')
        ? data.push(...allMyApprove['custody close'])
        : null;
      filters.some(obj => obj.title === 'purchase requisition')
        ? data.push(...allMyApprove['purchase requisition'])
        : null;
      filters.some(obj => obj.title === 'purchase contracts')
        ? data.push(...allMyApprove['purchase contracts'])
        : null;
      filters.some(obj => obj.title === 'work orders')
        ? data.push(...allMyApprove['work orders'])
        : null;
      filters.some(obj => obj.title === 'TechnicalRequest')
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
        ...servicesApprove,
      ];
    }

    data = uniqBy(data, 'id');
    allData = data;

    if (searchText) {
      data = searchFilterData;
    }

    if (date) {
      let dateFilter = data.filter(function(obj) {
        return moment(obj.create_date).format('DD-MM-YYYY') == date;
      });
      data = dateFilter;
    }

    if (sectors_ids.length > 0 && departments_ids.length > 0 && employeeID) {
      let filter = data.filter(function(obj) {
        return (
          sectors_ids.includes(obj?.sector_id[0]) ||
          departments_ids.includes(obj?.department_global_id[0]) ||
          employeeID == obj?.employee_id[0]
        );
      });
      data = filter;
    } else if (sectors_ids.length > 0 && departments_ids.length > 0) {
      let filter = data.filter(function(obj) {
        return (
          sectors_ids.includes(obj?.sector_id[0]) ||
          departments_ids.includes(obj?.department_global_id[0])
        );
      });
      data = filter;
    } else if (sectors_ids.length > 0 && employeeID) {
      let filter = data.filter(function(obj) {
        return (
          sectors_ids.includes(obj?.sector_id[0]) ||
          employeeID == obj?.employee_id[0]
        );
      });
      data = filter;
    } else if (departments_ids.length > 0 && employeeID) {
      let filter = data.filter(function(obj) {
        return (
          departments_ids.includes(obj?.department_global_id[0]) ||
          employeeID == obj?.employee_id[0]
        );
      });
      data = filter;
    } else if (sectors_ids.length > 0) {
      let filter = data.filter(function(obj) {
        return sectors_ids.includes(obj?.sector_id[0]);
      });
      data = filter;
    } else if (departments_ids.length > 0) {
      let filter = data.filter(function(obj) {
        return departments_ids.includes(obj?.department_global_id[0]);
      });
      data = filter;
    } else if (employeeID) {
      let filter = data.filter(function(obj) {
        return employeeID == obj?.employee_id[0];
      });
      data = filter;
    }

    if (data.length === 0) {
      myRequestsNum = 0;

      return (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <RefreshContainer refresh={false} onPullToRefresh={getAllMyReuqests}>
            <Text
              style={{
                textAlign: 'center',
                color: '#008AC5',
                fontFamily: '29LTAzer-Regular',
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
        function(object) {
          return object.create_date;
        },
      ],
      ['desc'],
    );

    data = sortedArray;
    myRequestsNum = data.length;
    return (
      <MyRequestList
        requestDataList={data}
        menu={state.activeTab}
        mIsLoading={approveLoading}
        ListFooterComponent={loadMoreApproveBtn}
        onMRefresh={getAllMyReuqests}
        onEndReachedThreshold={0}
        initialNumToRender={APPROVE_LIMIT}
        onEndReached={onLoadMoreApprove}
        isAllOrders={true}
        {...props}
      />
    );
  }, [
    filters,
    allMyApprove,
    approveLoading,
    props,
    state.activeTab,
    date,
    searchText,
  ]);

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
  const returnAnswers = questId => {
    let a = rate.values.map(ans => {
      if (ans[0].question_id[0] === questId) {
        return ans[0];
      }
    });

    return a;
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#d5e6ed', '#d5e6ed']} //'#ffffff',
        style={{
          flex: 1,
          backgroundColor: '#00759810',
        }}
      >
        <NewHeader {...props} title={'الطلبات'} back />
        <View style={{ justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
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
                          state.activeTab == 'myRequest' ? 'white' : '#20547a',
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

        <View style={{ alignItems: 'center' }}>
          <View style={styles.newContainer}>
            <TouchableOpacity
              onPress={handleNewOrder}
              style={styles.leftContainer}
            >
              <Text style={styles.newText}>طلب جديد</Text>
              <IconFe name="plus" size={15} color={'#007297'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height * 0.8,
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <View
              style={{
                width: '90%',
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
                  {state.isMenuApprovalVisible && (
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
                    />
                  )}
                </View>
                <View style={styles.filterContainer}>
                  <IconFe
                    name="sliders"
                    size={25}
                    color={'#007297'}
                    onPress={handleSelect}
                  />
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={styles.input}
                    placeholder="بحث"
                    placeholderStyle={{
                      fontFamily: '29LTAzer-Regular',
                    }}
                    changeText={e => {
                      if (e) {
                        setSearchText(e);
                        searchFilter(allData, e);
                      } else {
                        setSearchText('');
                      }
                    }}
                    onFocus={() => sheetRef.current.snapTo(1)}
                    value={searchText}
                    multiline={false}
                  />
                </View>
                <View
                  style={{
                    width: '93%',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <View style={styles.numberContainer}>
                    <View style={styles.numberTextContainer}>
                      <Text style={styles.numberText}>{myRequestsNum}</Text>
                    </View>
                    <Text style={styles.ordersText}>عدد الطلبات</Text>
                  </View>
                </View>

                <View style={{ width: '100%', flex: 1 }}>
                  {state.activeTab == 'myRequest' ? (
                    Object.keys(allMyRequests).length > 0 ? (
                      <View style={{ width: '100%' }}>{renderMyRequest()}</View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                        }}
                      >
                        <CustomActivityIndicator modalVisible={true} />
                      </View>
                    )
                  ) : state.activeTab ===
                    'newRequest' ? null : state.activeTab === 'approval' &&
                    state.activeMenuTab !== 'All' ? (
                    Object.keys(allMyApprove).length > 0 ? (
                      <View style={{ width: '100%' }}>{renderMyApprove()}</View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                        }}
                      >
                        <CustomActivityIndicator modalVisible={true} />
                      </View>
                    )
                  ) : !approveLoading || !requestLoading ? (
                    <RequestList
                      requestDataList={
                        state.requestDataOfList && state.activeMenuTab !== 'All'
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
            </View>
          </View>
        </View>
        {isLoading ? <Loader /> : null}
        {renderShadow()}
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
                    onChangeText={text => {
                      text.length > 0 &&
                        setState({
                          ...state,
                          isValidated: true,
                        });
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
              returnAnswers(rate.survey_vals[0].id).map(resp => {
                // console.log('RATEE---', rate);

                // console.log('resp', resp);
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

      <BottomSheet
        ref={sheetRef}
        callbackNode={fall.current}
        onCloseEnd={() => setBsShown(false)}
        onOpenEnd={() => setBsShown(true)}
        snapPoints={[
          Platform.OS === 'android'
            ? state.activeTab == 'approval'
              ? Dimensions.get('window').height / 1.6
              : Dimensions.get('window').height / 2.5
            : state.activeTab == 'approval'
            ? Dimensions.get('window').height / 1.5
            : Dimensions.get('window').height / 2.3,
          -600,
        ]}
        initialSnap={1}
        borderRadius={10}
        renderContent={bs == 'sort' ? renderContentSort : renderContentNew}
        nabledContentGestureInteraction={false}
      />

      {state.isLoad ? <Loader /> : null}

      <CommonPopup
        visible={state.showSuccessModal}
        onClose={() => {
          setState({
            ...state,
            showSuccessModal: false,
          });
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
    width: '90%',
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
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  filterContainer: {
    width: '93%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  numberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 1,
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
    color: '#2461A2',
    fontSize: 17,
    fontFamily: '29LTAzer-Medium',
    marginHorizontal: 5,
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
  ordersText: {
    fontSize: 14,
    fontFamily: '29LTAzer-Medium',
    color: '#4B4B4B',
  },
  numberTextContainer: {
    width: 23,
    height: 23,
    backgroundColor: '#008AC5',
    borderRadius: 23 / 2,
    marginHorizontal: 2,
    overflow: 'hidden',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  numberText: {
    height: '90%',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 15,
    marginTop: Platform.OS == 'ios' ? 5 : 0,
  },
  menuItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderColor: '#008AC5',
    borderWidth: 1,
    margin: 3,
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  bsContainer2: {
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
    // marginVertical: 5,
  },
  bsTitle: {
    color: '#4B4B4B',
    fontSize: 18,
    fontFamily: '29LTAzer-Bold',
    marginHorizontal: 5,
    marginTop: 10,
    right: 10,
    position: 'absolute',
    top: 0,
    marginBottom: 10,
  },
  label: {
    color: '#4B4B4B',
    fontSize: 18,
    fontFamily: '29LTAzer-Medium',
    textAlign: 'right',
    marginVertical: 4,
    marginHorizontal: 5,
  },
  bsButton: {
    backgroundColor: '#008AC5',
    width: '25%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 10,
  },
  bsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: '29LTAzer-Medium',
    marginVertical: 5,
  },
  attendanceContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 4,
    width: '80%',
    marginBottom: 10,
    marginTop: -25,
    borderRadius: 50,
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
    width: '90%',
    textAlign: 'right',
    color: '#007598',
    fontSize: 18,
  },
  serviceLabel: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 15,
    marginTop: 3,
  },
  serviceItem: {
    flex: 1,
    height: 67,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    marginHorizontal: 3,
  },
  input: {
    flex: 1,
    height: 30,
    textAlign: 'right',
    paddingRight: wp('3%'),
    marginLeft: wp('2%'),
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('2%'),
    paddingVertical: 2,
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  activeTeamDropDown: {
    height: 20,
    borderRadius: 20,
    borderColor: '#007598',
    flexDirection: 'row-reverse',
  },
  placeholderStyle: {
    fontFamily: '29LTAzer-Regular',
    color: '#007598',
    textAlign: 'right',
  },
  arrowIconStyle: {
    tintColor: '#007598',
    marginLeft: -10,
  },
  dropdownContainer: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#007598',
  },
});
export default AllOrders;
