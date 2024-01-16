import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
import OrderHeader from '../../components/NewOrderHeader';
import OrderViewAttatchment2 from '../../components/OrderViewAttatchment2';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as technicalAction from '../../redux/action/technicalAction';
import { baseUrl, getStatus } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import base64 from 'react-native-base64';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import RNFS from 'react-native-fs';
import LoadingView from '../../components/CustomPreviewModel/LoadingView';
import { isProductionMode, itsmBaseUrl } from '../../services';
import * as profileAction from '../../redux/action/profileAction';
import OrderDateViewItem2 from '../../components/OrderDateViewItem2';
import { Checkbox } from 'react-native-paper';

let viewType = 'new';
let item = null;
const TechnicalRequestService = (props) => {
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [id4, setId4] = useState(0);
  const [id5, setId5] = useState(0);
  const [category, setCategory] = useState([]);
  const [sub1, setSub1] = useState();
  const [category2, setCategory2] = useState([]);
  const [sub2, setSub2] = useState();
  const [category3, setCategory3] = useState([]);
  const [sub3, setSub3] = useState();
  const [category4, setCategory4] = useState([]);
  const [sub4, setSub4] = useState();
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [sub_categoryData, setSub_categoryData] = useState([]);
  const [catID, setCatID] = useState(null);
  const [sub_catID, setSub_catID] = useState(null);
  const [order_owner, setOrder_owner] = useState(null);

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );
  const [state, setState] = useState({
    servers_ips: '',
    service_port: '',
    lb_proxy_ip: '',
    application_name: '',
    domain_name: '',
    original_url: '',
    destination_redirected_url: '',
    server_ip: '',
    time_start_date: '',
    time_start_date_visible: false,
    time_end_date: '',
    time_end_date_visible: false,
    dns_record: '',
    dns_server: '',
    server_ip_hostname: '',
    time_date: '',
    time_date_visible: false,

    website_ur: '',
    floor_number: '',
    basement: '',
    ground_floor: '',
    first_floor: '',
    second_floor: '',
    third_floor: '',
    fourth_floor: '',
    support_center: '',
    facilities: '',
    jeddah: '',
    port_socket_number: '',

    server_ip_hostname: '',
    destination_ips_urls: '',
    durartion: '',
    ports: '',
    public_dns_record: '',
    source_server_ip: '',
    destination_server_ip: '',
    sub_category: '',

    source_GSN_IP: '',
    source_entity_name: '',
    destination_GSN_IP: '',
    destination_entity_name: '',
    monshaat_server_IP: '',
    other_entity_name: '',

    db_name: '',
    db_ip: '',
    db_user: '',
    db_type: '',
    application_name: '',
    db_user_permisssion: '',
    backup_time: '',
    restoration_date: '',
    db_username: '',
    db_server_ip: '',

    cpu: '',
    ram: '',
    disk_partitions: '',
    network_zone: '',
    server_role: '',
    business_owner_name: '',
    application_name: '',
    application_technical_owner: '',
    application_technical_contact_number: '',
    application_custodian: '',
    application_custodian_contact_number: '',
    server_ip_address: '',
    username: '',
    role_permission: '',
    start_date: '',
    start_date_visible: false,
    end_date: '',
    end_date_visible: false,
    os_type: '',
    software_name: '',
    source_server_ip: '',
    source_file_path: '',
    destination_server_ip: '',
    destination_file_path: '',
    modify_number_of_CPU_to: '',
    modify_memory_to: '',
    modify_disk_to: '',

    leaveTypeData: [],
    classificationTypeData: [],
    typeData: [],
    typeSelected: '',
    leaveSelected: '',
    startDate: '',
    endDate: '',
    duration: '',
    comments: '',
    startDateErr: '',
    endDateErr: '',
    showModal: false,
    durationErr: '',
    classificationId: -1,
    classificationSelected: '',
    typeSelectedId: -1,
    categoryData: [],
    categorySelected: '',
    categorySelectedId: -1,
    locationData: [],
    locationSelected: '',
    type: '',
    subType: '',
    email: '',
    permission: '',

    choose_apps: '',

    server_ip_hostname: '',

    selection_menu: '',

    required_duration: '',
    server_address: '',
    operating_system: '',
    explanation: '',

    full_name: '',
    phone_number: '',
    id: '',
    email_address: '',
    duration: '',
    extension_number: '',

    email: '',
    project_name: '',
    project_date: '',
    is_the_project_registered: '',
    operating_company_name: '',
    power: '',
    members: '',
    office_number: '',
    application_owner: '',
    url: '',
    send_alert_to: '',

    priorityData: [
      {
        label: '☆☆☆',
        value: '0',
      },
      {
        label: '☆☆★',
        value: '1',
      },
      {
        label: '☆★★',
        value: '2',
      },
      {
        label: '★★★',
        value: '3',
      },
    ],
    justification: '',
    prioritySelected: '',
    subject: '',
    arrayData: [],
    base64Data: [],
    placeholderTicket: '',
    placeholderClass: '',
    filename: [],
    description: '',
    team_id: '',
    teamList: [],
    reason: null,
    isValidated: false,
    visible1: false,
    dropDown: [
      {
        label: 'جهاز محمول',
        value: 'Mobile device',
      },
      {
        label: 'خدمات الطابعات',
        value: 'Printer',
      },
      {
        label: 'برنامج جديد',
        value: 'New Program',
      },
      {
        label: 'البريد الإلكتروني',
        value: 'Email',
      },

      {
        label: 'موازن التحميل',
        value: 'Load Balancer',
      },
      {
        label: 'SSL',
        value: 'SSL',
      },
      {
        label: 'اعادة توجيه ال URL',
        value: 'Redirect URL',
      },
      {
        label: 'انترنت',
        value: 'Internet',
      },
      {
        label: 'تقارير شبكة WAN',
        value: 'WAN reports',
      },
      {
        label: 'DNS',
        value: 'DNS',
      },
      {
        label: 'السماح أو الحظر موقع',
        value: 'Allow / Block Website',
      },

      {
        label: 'خدمة نشر الوصول إلى الإنترنت / الاتصال',
        value: 'Internet / Connectivity Access Publish Service',
      },
      {
        label: 'طلب GSN/VPN من موقع إلى موقع',
        value: 'GSN /VPN site-to-site Request',
      },
      {
        label: 'خدمات قواعد البيانات',
        value: 'Database Services',
      },
      {
        label: 'الخادم',
        value: 'Server',
      },
      {
        label: 'صلاحية طلب صفر',
        value: 'صلاحية طلب صفر',
      },
      {
        label: 'إنشاء أو إزالة صلاحية للمستخدم',
        value: 'Add or remove user permission',
      },
      {
        label: 'طلب بيانات',
        value: 'Data request',
      },
      {
        label: 'نسخ الاحتياطي - استعادة خادم اللقطة',
        value: 'Backup / Restore Snapshot Server',
      },
      {
        label: 'إضافة / تعديل خدمة site24x7',
        value: 'add/modify site24x7 service',
      },
      {
        label: 'طلبات الملحقات التقنية',
        value: 'Technical support requests',
      },
      {
        label: 'خدمات الأمن السيبراني',
        value: 'Cyber Security',
      },
      {
        label: 'خدمات الحسابات',
        value: 'Account',
      },
      {
        label: 'صلاحيات إستخدام البريد الإلكتروني',
        value: 'Email Access',
      },
    ],

    dropDown1: [
      {
        label: 'البريد الإلكتروني',
        value: 'Email',
      },
      {
        label: 'خدمات الطابعات',
        value: 'Printer',
      },
      {
        label: 'برنامج جديد',
        value: 'New Program',
      },

      {
        label: 'طلبات الملحقات التقنية',
        value: 'Technical support requests',
      },
    ],

    dropDownCommonIT: [
      {
        label: 'جهاز محمول',
        value: 'Mobile device',
      },
      {
        label: 'صلاحيات إستخدام البريد الإلكتروني',
        value: 'Email Access',
      },
      {
        label: 'موازن التحميل',
        value: 'Load Balancer',
      },
      {
        label: 'SSL',
        value: 'SSL',
      },
      {
        label: 'اعادة توجيه ال URL',
        value: 'Redirect URL',
      },
      {
        label: 'انترنت',
        value: 'Internet',
      },
      {
        label: 'تقارير شبكة WAN',
        value: 'WAN reports',
      },
      {
        label: 'DNS',
        value: 'DNS',
      },
      {
        label: 'السماح أو الحظر موقع',
        value: 'Allow / Block Website',
      },
      {
        label: 'خدمة نشر الوصول إلى الإنترنت / الاتصال',
        value: 'Internet / Connectivity Access Publish Service',
      },
      {
        label: 'طلب GSN/VPN من موقع إلى موقع',
        value: 'GSN /VPN site-to-site Request',
      },
      {
        label: 'خدمات قواعد البيانات',
        value: 'Database Services',
      },
      {
        label: 'الخادم',
        value: 'Server',
      },
      {
        label: 'صلاحية طلب صفر',
        value: 'صلاحية طلب صفر',
      },
      {
        label: 'إنشاء أو إزالة صلاحية للمستخدم',
        value: 'Add or remove user permission',
      },
      {
        label: 'طلب بيانات',
        value: 'Data request',
      },
      {
        label: 'نسخ الاحتياطي - استعادة خادم اللقطة',
        value: 'Backup / Restore Snapshot Server',
      },
      {
        label: 'إضافة / تعديل خدمة site24x7',
        value: 'add/modify site24x7 service',
      },
      // {
      //   label: 'طلبات الملحقات التقنية',
      //   value: 'Technical support requests',
      // },
      {
        label: 'خدمات الأمن السيبراني',
        value: 'Cyber Security',
      },
      {
        label: 'خدمات الحسابات',
        value: 'Account',
      },
    ],

    dropDownSecurity: [
      {
        label: 'السماح أو الحظر موقع',
        value: 'Allow / Block Website',
      },
    ],
    bulidLocation: [
      {
        label: 'الرياض - المبنى الرئيسى-القبو',
        value: '1',
      },

      {
        label: 'الرياض - المبنى الرئيسى-الدور الأرضى',
        value: '2',
      },
      {
        label: 'الرياض - المبنى الرئيسى-الدور الأول',
        value: '3',
      },
      {
        label: 'الرياض - المبنى الرئيسى-الدور التانى',
        value: '4',
      },
      {
        label: 'الرياض - المبنى الرئيسى-الدور الثالث',
        value: '5',
      },
      {
        label: 'الرياض - المبنى الرئيسى-الدور الرابع',
        value: '6',
      },
      {
        label: 'المدينة المنورة - مركز دعم منشآت',
        value: '7',
      },
      {
        label: ' الخبر - مركز دعم منشآت',
        value: '8',
      },
      {
        label: ' جدة - مركز دعم منشآت',
        value: '9',
      },
    ],
  });
  const [lastUpdate, setLastUpdate] = useState('');
  const [timelineData, setTimelineData] = useState('');

  const [item_data, setItem_data] = useState({});
  const [location, setLocation] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [attachments_loader, setAttachments_loader] = useState(false);
  const [ischeckedArray, setIsCheckedArray] = useState([]);
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const itsmToken = useSelector((state) => state.ProfileReducer.ITSMToken);

  const isFocused = useIsFocused();
  const approveRequest = async () => {
    setModal2(false);
    dispatch(loadingAction.commonLoader(true));
    let url = `${itsmBaseUrl}approve_reject_request`;
    let body = {
      request_number: state.item.id,
      approver_email: userProfileData[0].work_email,
      approval_state: 'approved',
      rejection_reason: '',
    };
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'), // M0bile@pp
    );
    headers.append('Content-Type', 'application/json');
    fetch(url, {
      method: 'PUT',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
            'Content-Type': 'application/json',
          }
        : headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          dispatch(loadingAction.commonLoader(true));
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
        dispatch(loadingAction.commonLoader(false));
        setState({ ...state, showModal: true });
        setTimeout(() => {
          // props.navigation.replace('Home');
          props.navigation.popToTop();
        }, 1000);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  };

  const rejectRequest = () => {
    setReasonInputVisible(true);
  };

  const rejectConfirm = () => {
    if (state.reason) {
      setReasonInputVisible(false);
      dispatch(loadingAction.commonLoader(true));
      let url = `${itsmBaseUrl}approve_reject_request`;
      let body = {
        request_number: state.item.id,
        approver_email: userProfileData[0].work_email,
        approval_state: 'rejected',
        rejection_reason: state.reason,
      };
      let headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
      );
      headers.append('Content-Type', 'application/json');
      fetch(url, {
        method: 'PUT',
        headers: isProductionMode
          ? {
              Authorization: 'Bearer ' + itsmToken,
              'Content-Type': 'application/json',
            }
          : headers,
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 'failure') {
            // showMessage({
            //   style: {
            //     alignItems: 'flex-end',
            //     fontFamily: '29LTAzer-Regular',
            //   },
            //   type: 'danger',
            //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
            // });
            dispatch(loadingAction.commonLoader(true));
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
          dispatch(loadingAction.commonLoader(false));
          setState({ ...state, showModal: true });
          // props.navigation.replace('Home');
          setTimeout(() => {
            // props.navigation.replace('Home');
            props.navigation.popToTop();
          }, 1000);
        })
        .catch((err) => {
          // console.log('responseData err', err);
        });
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'سبب الرفض مطلوب',
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Technical_Request_Screen');
    }
    getToken();
  }, [isFocused, itsmToken]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ITSMTOKEN');
    const data = JSON.parse(token);
    // setItsmToken(data.accessToken);
    dispatch({
      type: 'ITSM_TOKEN',
      value: data.accessToken,
    });
  };
  const handleTimeStartDate = (date) => {
    let a = moment(date).format('MM/DD/YYYY');

    setState({
      ...state,
      time_start_date: a,
      time_start_date_visible: false,
    });
  };
  const handleTimeDate = (date) => {
    let a = moment(date).format('MM/DD/YYYY');

    setState({
      ...state,
      time_date: a,
      time_date_visible: false,
    });
  };

  const handleTimeEndDate = (date) => {
    let a = moment(date).format('MM/DD/YYYY');
    setState({
      ...state,
      time_end_date: a,
      time_end_date_visible: false,
    });
  };

  const handleStartDate = (date) => {
    let a = moment(date).format('MM/DD/YYYY');

    setState({
      ...state,
      start_date: a,
      start_date_visible: false,
    });
  };

  const handleEndDate = (date) => {
    let a = moment(date).format('MM/DD/YYYY');
    setState({
      ...state,
      end_date: a,
      end_date_visible: false,
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;

        let url = `${baseUrl}/api/read/last_update?res_model=helpdesk.ticket&res_id=${item.id}`;
        //`${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=06968`;
        // (async () => {
        //   let secretUrl = await EncryptUrl(url);

        //   fetch(secretUrl, {
        //     method: "GET",
        //     headers: {
        //       Authorization: "Bearer " + accessToken,
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //   })
        //     .then((response) => response.json())
        //     .then((data) => {
        //       console.log("lastupdate", data);
        //       let newdata = finalArray(data);
        //       // let removedEl = newdata.shift();
        //       // console.log("REMOVEDEL", removedEl);
        //       console.log("newdata", newdata);
        //       setTimelineData(newdata);
        //     });
        // })();
      }
    });
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        console.log('item item', item);
        setState({
          ...state,
          item: item,
        });
        setSub1(item.type);
        viewType = props.route.params.viewType;
        // omar
        setAttachments_loader(true);
        let url = `${itsmBaseUrl}monshaat_queryfromrequestnumber?number=${item.id}`;
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
              // showMessage({
              //   style: {
              //     alignItems: 'flex-end',
              //     fontFamily: '29LTAzer-Regular',
              //   },
              //   type: 'danger',
              //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
              // });
              dispatch(loadingAction.commonLoader(true));
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
                props.navigation.goBack();
              }, 3000);
            }
            var arr = responseData.result;
            const data = [];
            setItem_data(arr);
            if (arr.hasOwnProperty('attachment_base64_data_1')) {
              const obj = {
                id: arr.attachment_id_1,
                name: arr.attachment_file_name_1,
                url: arr.attachment_base64_data_1,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_2')) {
              const obj = {
                id: arr.attachment_id_2,
                name: arr.attachment_file_name_2,
                url: arr.attachment_base64_data_2,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_3')) {
              const obj = {
                id: arr.attachment_id_3,
                name: arr.attachment_file_name_3,
                url: arr.attachment_base64_data_3,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_4')) {
              const obj = {
                id: arr.attachment_id_4,
                name: arr.attachment_file_name_4,
                url: arr.attachment_base64_data_4,
              };
              data.push(obj);
            }
            if (arr.hasOwnProperty('attachment_base64_data_5')) {
              const obj = {
                id: arr.attachment_id_5,
                name: arr.attachment_file_name_5,
                url: arr.attachment_base64_data_5,
              };
              data.push(obj);
            }
            setAttachments(data);
            setAttachments_loader(false);
          })
          .catch((err) => {
            // console.log('responseData err', err);
            setAttachments_loader(false);
          });
      }

      if (props.route.params && props.route.params.subType) {
        subType = props.route.params.subType;

        setState({
          ...state,
          subType: props.route.params.subType,
        });
      }
    });

    return unsubscribe;
  }, [props.navigation, itsmToken]);

  const addFile = async () => {
    if (state.arrayData.length >= 5) {
      showMessage({
        style: {
          alignItems: 'flex-end',
          fontFamily: '29LTAzer-Regular',
        },
        type: 'danger',
        message: 'غير مسموح بأكثر من ٥ مرفقات',
      });
      return;
    }
    try {
      var data;
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        let base64Data = [...state.base64Data];
        RNFS.readFile(mFile.uri, 'base64').then((result) => {
          // console.log('result.uri', result);
          base64Data.push({ base64: result });
        });
        // alert(mFile.size); //3 mb
        if (
          getFileExtention(mFile.name) == 'png' ||
          getFileExtention(mFile.name) == 'jpg' ||
          getFileExtention(mFile.name) == 'jpeg' ||
          getFileExtention(mFile.name) == 'pdf'
        ) {
          if (mFile.size <= 3000000) {
            arrayData.push(mFile);
            filename.push({ name: mFile.name });
            setState({ ...state, arrayData, filename, base64Data });
          } else {
            showMessage({
              style: {
                alignItems: 'flex-end',
                fontFamily: '29LTAzer-Regular',
              },
              type: 'danger',
              message: 'حجم الملف كبير إختر ملف أخر حجم أقصى ٣ ميجا بايتس',
            });
          }
        } else {
          showMessage({
            style: {
              alignItems: 'flex-end',
              fontFamily: '29LTAzer-Regular',
            },
            type: 'danger',
            message: 'غير قادر على رفع هذا الملف يدعم فقط الصور وملفات ال pdf.',
          });
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const getFileExtention = (name) => {
    return /[.]/.exec(name) ? /[^.]+$/.exec(name) : undefined;
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
    if (sub1 == state.dropDown[4].value) {
      if (
        state.servers_ips.length > 0 &&
        state.service_port.length > 0 &&
        state.lb_proxy_ip.length > 0 &&
        state.application_name.length > 0 &&
        state.domain_name.length > 0 &&
        state.original_url.length > 0 &&
        state.destination_redirected_url.length > 0 &&
        state.server_ip.length > 0 &&
        state.time_start_date.length > 0 &&
        state.time_end_date.length > 0 &&
        state.dns_record.length > 0 &&
        state.dns_server.length > 0 &&
        state.server_ip_hostname.length > 0 &&
        state.time_date.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[5].value) {
      if (
        state.website_ur.length > 0 &&
        state.floor_number.length > 0 &&
        state.basement.length > 0 &&
        state.ground_floor.length > 0 &&
        state.first_floor.length > 0 &&
        state.second_floor.length > 0 &&
        state.third_floor.length > 0 &&
        state.fourth_floor.length > 0 &&
        state.facilities.length > 0 &&
        state.jeddah.length > 0 &&
        state.port_socket_number.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[10].value) {
      if (catID == 'configure_network_port') {
        if (
          catID &&
          ischeckedArray.length > 0 &&
          state.floor_number.length > 0 &&
          // state.port_socket_number.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else {
        if (
          catID &&
          state.website_ur.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (
      sub1 == state.dropDown[6].value ||
      sub1 == state.dropDown[11].value
    ) {
      if (
        state.server_ip_hostname.length > 0 &&
        state.destination_ips_urls.length > 0 &&
        state.durartion.length > 0 &&
        state.ports.length > 0 &&
        state.public_dns_record.length > 0 &&
        state.source_server_ip.length > 0 &&
        state.destination_server_ip.length > 0 &&
        state.sub_category.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (
      sub1 == state.dropDown[7].value ||
      sub1 == state.dropDown[12].value
    ) {
      if (
        state.source_GSN_IP.length > 0 &&
        state.source_entity_name.length > 0 &&
        state.destination_GSN_IP.length > 0 &&
        state.destination_entity_name.length > 0 &&
        state.monshaat_server_IP.length > 0 &&
        state.other_entity_name.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (
      sub1 == state.dropDown[8].value ||
      sub1 == state.dropDown[13].value
    ) {
      if (
        state.db_name.length > 0 &&
        state.db_ip.length > 0 &&
        state.db_user.length > 0 &&
        state.db_type.length > 0 &&
        state.application_name.length > 0 &&
        state.db_user_permisssion.length > 0 &&
        state.backup_time.length > 0 &&
        state.restoration_date.length > 0 &&
        state.db_username.length > 0 &&
        state.db_server_ip.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (
      sub1 == state.dropDown[9].value ||
      sub1 == state.dropDown[14].value
    ) {
      if (
        state.cpu.length > 0 &&
        state.ram.length > 0 &&
        state.network_zone.length > 0 &&
        state.server_role.length > 0 &&
        state.business_owner_name.length > 0 &&
        state.application_name.length > 0 &&
        state.application_technical_owner.length > 0 &&
        state.application_technical_contact_number.length > 0 &&
        state.application_custodian.length > 0 &&
        state.application_custodian_contact_number.length > 0 &&
        state.server_ip_address.length > 0 &&
        state.username.length > 0 &&
        state.role_permission.length > 0 &&
        state.start_date.length > 0 &&
        state.end_date.length > 0 &&
        state.os_type.length > 0 &&
        state.software_name.length > 0 &&
        state.source_server_ip.length > 0 &&
        state.source_file_path.length > 0 &&
        state.destination_server_ip.length > 0 &&
        state.destination_file_path.length > 0 &&
        state.modify_number_of_CPU_to.length > 0 &&
        state.modify_memory_to.length > 0 &&
        state.modify_disk_to.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[15].value) {
      if (sub_catID == 'Temporary') {
        if (
          state.start_date.length > 0 &&
          state.end_date.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else {
        if (state.justification.length > 0 && sub1) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (sub1 == state.dropDown[16].value) {
      if (
        catID &&
        sub_catID &&
        // state.sub_category.length > 0 &&
        state.choose_apps.length > 0 &&
        // state.subject.length > 0 &&
        state.choose_apps &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[17].value) {
      if (
        state.choose_apps.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[18].value) {
      if (
        state.server_ip_hostname.length > 0 &&
        state.time_date.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[19].value) {
      if (
        state.application_name.length > 0 &&
        state.url.length > 0 &&
        state.application_owner.length > 0 &&
        state.send_alert_to.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[20].value) {
      if (catID == 'request_technical_equipment') {
        if (
          // state.subject.length > 0 &&
          sub1 &&
          state.justification.length > 0 &&
          state.office_number
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else if (catID == 'request_preparing_presentations') {
        if (
          // state.subject.length > 0 &&
          sub1 &&
          state.justification.length > 0 &&
          location.length > 0 &&
          state.arrayData &&
          state.arrayData.length > 0
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else {
        if (
          // state.subject.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (sub1 == state.dropDown[21].value) {
      if (
        catID &&
        sub_catID &&
        state.required_duration.length > 0 &&
        // state.server_address.length > 0 &&
        // state.operating_system.length > 0 &&
        // state.explanation.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[22].value) {
      if (catID == 'Create/edit AD manager') {
        if (
          state.full_name.length > 0 &&
          // state.phone_number.length > 0 &&
          // state.id.length > 0 &&
          // state.email_address.length > 0 &&
          // state.duration.length > 0 &&
          state.extension_number.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else if (catID == 'VPN') {
        if (
          state.full_name.length > 0 &&
          // state.phone_number.length > 0 &&
          // state.id.length > 0 &&
          // state.email_address.length > 0 &&
          order_owner.length > 0 &&
          state.duration.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else if (catID == 'Managing Zoom Account') {
        if (
          state.full_name.length > 0 &&
          // state.phone_number.length > 0 &&
          // state.id.length > 0 &&
          state.email_address.length > 0 &&
          // state.duration.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else {
        if (
          state.full_name.length > 0 &&
          state.phone_number.length > 0 &&
          state.id.length > 0 &&
          state.email_address.length > 0 &&
          // state.duration.length > 0 &&
          // state.extension_number.length > 0 &&
          // state.subject.length > 0 &&
          state.justification.length > 0 &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (sub1 == state.dropDown[23].value) {
      if (
        state.email.length > 0 &&
        state.project_name.length > 0 &&
        state.project_date.length > 0 &&
        state.is_the_project_registered.length > 0 &&
        state.operating_company_name.length > 0 &&
        state.power.length > 0 &&
        state.members.length > 0 &&
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    } else if (sub1 == state.dropDown[3].value) {
      if (
        catID == 'manage_email_permission' ||
        catID == 'extend_account_intern'
      ) {
        if (
          (catID == 'manage_email_permission' &&
            state.email &&
            catID == 'manage_email_permission' &&
            state.permission &&
            catID == 'manage_email_permission' &&
            state.justification) ||
          (catID == 'extend_account_intern' &&
            state.email &&
            state.justification)
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else if (catID == 'emailing_group' || catID == 'shared_email') {
        if (
          (catID == 'emailing_group' && state.members) ||
          (catID == 'shared_email' && state.members)
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else if (catID == 'consultant_contractor') {
        if (sub_catID == 'create_new_account') {
          if (
            state.project_name &&
            state.project_date &&
            state.is_the_project_registered &&
            state.operating_company_name
          ) {
            setIsInActive(false);
          } else {
            setIsInActive(true);
          }
        } else if (sub_catID == 'account_extension') {
          if (state.email) {
            setIsInActive(false);
          } else {
            setIsInActive(true);
          }
        } else if (sub_catID == 'disclaimer') {
          if (state.email) {
            setIsInActive(false);
          } else {
            setIsInActive(true);
          }
        } else {
          if (
            state.email &&
            state.justification
            // state.project_name &&
            // state.project_date &&
            // state.is_the_project_registered &&
            // state.operating_company_name
          ) {
            setIsInActive(false);
          } else {
            setIsInActive(true);
          }
        }
      } else if (catID == 'edit_email_info') {
        setIsInActive(false);
      } else {
        if (
          state.justification.length > 0 &&
          // state.email  &&
          // state.permission &&
          // state.subject &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (sub1 == state.dropDown[2].value) {
      if (catID == 'Other') {
        if (state.subject && sub1) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      } else {
        if (
          // state.subject &&
          sub1
        ) {
          setIsInActive(false);
        } else {
          setIsInActive(true);
        }
      }
    } else if (sub1 == 'Printer' && catID == 'Access to use Printer') {
      setIsInActive(false);
    } else {
      if (
        // state.subject.length > 0 &&
        state.justification.length > 0 &&
        sub1
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    }
  }, [state, sub1, sub2, sub3, sub4, location, catID, sub_catID]);

  const handleSub1 = (value, index) => {
    setSub1(value);
    if (index) {
      setSub1(value);
      setState({
        ...state,
        subject: '',
        justification: '',
        project_name: '',
        permission: '',
        project_date: '',
        operating_company_name: '',
        required_duration: '',
      });
    }
    getCategory(value, 'category');
  };

  const submitAttachment = (number) => {
    const body = {
      number: number,
      file_name1: state.arrayData.length > 0 ? state.arrayData[0].name : '',
      payload1: state.base64Data.length > 0 ? state.base64Data[0].base64 : '',
      file_name2: state.arrayData.length > 1 ? state.arrayData[1].name : '',
      payload2: state.base64Data.length > 1 ? state.base64Data[1].base64 : '',
      file_name3: state.arrayData.length > 2 ? state.arrayData[2].name : '',
      payload3: state.base64Data.length > 2 ? state.base64Data[2].base64 : '',
      file_name4: state.arrayData.length > 3 ? state.arrayData[3].name : '',
      payload4: state.base64Data.length > 3 ? state.base64Data[3].base64 : '',
      file_name5: state.arrayData.length > 4 ? state.arrayData[4].name : '',
      payload5: state.base64Data.length > 4 ? state.base64Data[4].base64 : '',
    };

    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    headers.append('Content-Type', 'application/json');
    fetch(`${itsmBaseUrl}send_multi_attach`, {
      method: 'POST',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
            'Content-Type': 'application/json',
          }
        : headers,
      body: JSON.stringify(body),
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
          getToken();
        }
      })
      .catch((err) => {
        // console.log(' err submitAttachment', err);
      });
  };

  const submitRequest = () => {
    setModal2(false);
    dispatch(loadingAction.commonLoader(true));
    let url = '';
    let body = {};
    if (sub1 == state.dropDown[0].value) {
      url = `${itsmBaseUrl}create_request_mobile_device`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        description: state.subject,
        category: catID,
        justification: state.justification,
      };
    } else if (sub1 == state.dropDown[1].value) {
      url = `${itsmBaseUrl}create_request_printer`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        description: state.subject,
        category: catID,
        justification: state.justification,
      };
    } else if (sub1 == state.dropDown[2].value) {
      url = `${itsmBaseUrl}create_request_new_program`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        description: state.subject,
        category: catID,
        justification: state.justification,
      };
    } else if (sub1 == state.dropDown[3].value) {
      url = `${itsmBaseUrl}create_request_email`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        sub_category: sub_catID,
        email: state.email,
        permission: state.permission,
        members: state.members,
        project_name: state.project_name,
        project_date: state.project_date,
        is_the_project_registered: state.is_the_project_registered,
        operating_company_name: state.operating_company_name,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[4].value) {
      url = `${itsmBaseUrl}create_request_load_balancer`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        servers_ips: state.servers_ips,
        service_port: state.service_port,
        lb_proxy_ip: state.lb_proxy_ip,
        application_name: state.application_name,
        domain_name: state.domain_name,
        original_url: state.original_url,
        destination_redirected_url: state.destination_redirected_url,
        server_ip: state.server_ip,
        time_start_date: state.time_start_date,
        time_end_date: state.time_end_date,
        dns_record: state.dns_record,
        action: 'Add',
        dns_server: state.dns_server,
        server_ip_hostname: state.server_ip_hostname,
        time_date: state.time_date,
        justification: state.justification,
        description: state.subject,
      };
    } else if (
      sub1 == state.dropDown[5].value ||
      sub1 == state.dropDown[10].value
    ) {
      url = `${itsmBaseUrl}create_request_allow_block_website`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        website_ur: state.website_ur,
        floor_number: state.floor_number,
        basement: state.basement,
        ground_floor: state.ground_floor,
        first_floor: state.first_floor,
        second_floor: state.second_floor,
        third_floor: state.third_floor,
        fourth_floor: state.fourth_floor,
        support_center: state.support_center,
        facilities: state.facilities,
        jeddah: state.jeddah,
        port_socket_number: state.port_socket_number,
        justification: state.justification,
        description: state.subject,
      };
    } else if (
      sub1 == state.dropDown[6].value ||
      sub1 == state.dropDown[11].value
    ) {
      url = `${itsmBaseUrl}create_request_internet_connectivity`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        server_ip_hostname: state.server_ip_hostname,
        destination_ips_urls: state.destination_ips_urls,
        durartion: state.durartion,
        ports: state.ports,
        public_dns_record: state.public_dns_record,
        source_server_ip: state.source_server_ip,
        destination_server_ip: state.destination_server_ip,
        sub_category: sub_catID,
        justification: state.justification,
        description: state.subject,
      };
    } else if (
      sub1 == state.dropDown[7].value ||
      sub1 == state.dropDown[12].value
    ) {
      url = `${itsmBaseUrl}create_gsn_vpn_request`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        source_GSN_IP: state.source_GSN_IP,
        source_entity_name: state.source_entity_name,
        destination_GSN_IP: state.destination_GSN_IP,
        destination_entity_name: state.destination_entity_name,
        monshaat_server_IP: state.monshaat_server_IP,
        other_entity_name: state.other_entity_name,
        justification: state.justification,
        description: state.subject,
      };
    } else if (
      sub1 == state.dropDown[8].value ||
      sub1 == state.dropDown[13].value
    ) {
      url = `${itsmBaseUrl}create_request_database_services`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        db_name: state.db_name,
        db_ip: state.db_ip,
        db_user: state.db_user,
        db_type: state.db_type,
        application_name: state.application_name,
        db_user_permisssion: state.db_user_permisssion,
        backup_time: state.backup_time,
        restoration_date: state.restoration_date,
        db_username: state.db_username,
        db_server_ip: state.db_server_ip,
        justification: state.justification,
        description: state.subject,
      };
    } else if (
      sub1 == state.dropDown[9].value ||
      sub1 == state.dropDown[14].value
    ) {
      url = `${itsmBaseUrl}create_request_server`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        cpu: state.cpu,
        ram: state.ram,
        disk_partitions: state.disk_partitions,
        network_zone: state.network_zone,
        server_role: state.server_role,
        business_owner_name: state.business_owner_name,
        application_name: state.application_name,
        application_technical_owner: state.application_technical_owner,
        application_technical_contact_number:
          state.application_technical_contact_number,
        application_custodian: state.application_custodian,
        application_custodian_contact_number:
          state.application_custodian_contact_number,
        server_ip_address: state.server_ip_address,
        username: state.username,
        role_permission: state.role_permission,
        start_date: state.start_date,
        end_date: state.end_date,
        os_type: state.os_type,
        software_name: state.software_name,
        source_server_ip: state.source_server_ip,
        source_file_path: state.source_file_path,
        destination_server_ip: state.destination_server_ip,
        destination_file_path: state.destination_file_path,
        modify_number_of_CPU_to: state.modify_number_of_CPU_to,
        modify_memory_to: state.modify_memory_to,
        modify_disk_to: state.modify_disk_to,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[15].value) {
      url = `${itsmBaseUrl}create_request_zero_order_validity`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        sub_category: sub_catID,
        start_date: state.start_date,
        end_date: state.end_date,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[16].value) {
      url = `${itsmBaseUrl}create_request_ad_remove_user_permission`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        sub_category: sub_catID,
        choose_apps: state.choose_apps,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[17].value) {
      url = `${itsmBaseUrl}create_request_data_request`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        choose_apps: state.choose_apps,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[18].value) {
      url = `${itsmBaseUrl}create_request_backup_snapshot`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        server_ip_hostname: state.server_ip_hostname,
        time_date: state.time_date,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[19].value) {
      url = `${itsmBaseUrl}create_request_site24x7`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        application_name: state.application_name,
        url: state.url,
        application_owner: state.application_owner,
        send_alert_to: state.send_alert_to,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[20].value) {
      url = `${itsmBaseUrl}create_request_technical_support`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        office_number: state.office_number ? state.office_number : '',
        selection_menu: location ? location : '',
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[21].value) {
      url = `${itsmBaseUrl}create_request_cyber_security`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        sub_category: sub_catID,
        required_duration: state.required_duration,
        server_address: state.server_address,
        operating_system: state.operating_system,
        explanation: state.explanation,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[22].value) {
      url = `${itsmBaseUrl}create_request_account`;
      body = {
        requested_for_email: userProfileData[0].work_email,
        category: catID,
        full_name: state.full_name,
        phone_number: state.phone_number,
        id: state.id,
        email_address: state.email_address,
        duration: state.duration,
        extension_number: state.extension_number,
        justification: state.justification,
        description: state.subject,
      };
    } else if (sub1 == state.dropDown[23].value) {
      url = `${itsmBaseUrl}create_request_email_access`;
      body = {
        // requested_for_email: userProfileData[0].work_email,
        // category: 'VPN',
        // full_name: state.project_name,
        // email_address: state.email,
        // extension_number: state.members,
        // phone_number: state.power,
        // id: userProfileData[0].id,
        // duration: state.project_date,
        // justification: state.justification,
        // description: state.subject,

        // sub_category: 'create_shared_email',
        // project_date: state.project_date,
        // is_the_project_registered: state.is_the_project_registered,
        // operating_company_name: state.operating_company_name,
        // power: state.power,

        requested_for_email: userProfileData[0].work_email,
        category: 'shared_email',
        sub_category: 'create_shared_email',
        email_address: state.email,
        project_name: state.project_name,
        project_date: state.project_date,
        is_the_project_registered: state.is_the_project_registered,
        operating_company_name: state.operating_company_name,
        power: state.power,
        members: state.members,
        justification: state.justification,
        description: state.subject,
      };
    }
    let headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
    );
    headers.append('Content-Type', 'application/json');
    fetch(url, {
      method: 'POST',
      headers: isProductionMode
        ? {
            Authorization: 'Bearer ' + itsmToken,
            'Content-Type': 'application/json',
          }
        : headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          dispatch(loadingAction.commonLoader(true));
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
        submitAttachment(responseData.result.requested_item_number);

        clearTimeout(timeout);
        let timeout = setTimeout(() => {
          dispatch(loadingAction.commonLoader(false));
          setState({ ...state, showModal: true });
        }, 300);

        // props.navigation.replace('Home');
      })
      .catch((err) => {
        dispatch(loadingAction.commonLoader(false));
        // console.log('responseData err', err);
      });
  };

  // useEffect(() => {
  //   let url =
  //     `${itsmBaseUrl}monshaat_query_category`;
  //   let headers = new Headers();
  //   headers.append(
  //     'Authorization',
  //     'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
  //   );
  //   fetch(url, {
  //     method: 'GET',
  //     headers: headers,
  //   })
  //     .then(response => response.json())
  //     .then(responseData => {
  //       console.log('responseData responseData', responseData);
  //       setCategory(responseData.result);
  //     })
  //     .catch(err => {
  //       console.log('responseData err', err);
  //     });
  // }, []);
  const getCategory = (cat_item_name, variable_name) => {
    let url = `${itsmBaseUrl}query_request_var_choices?cat_item_name=${cat_item_name}&variable_name=${variable_name}`;
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
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          dispatch(loadingAction.commonLoader(true));
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
        const data = [];
        var arr = responseData.result;
        if (arr && arr != 'Invalid Catalog Item name or Variable Name.') {
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              label: arr[index].text_ar ? arr[index].text_ar : arr[index].text,
              value: arr[index].value,
            };
            if (
              cat_item_name == 'Allow / Block Website' &&
              arr[index].value == 'block_website'
            ) {
            } else {
              data.push(obj);
            }
          }
          setCategoryData(data);
        } else setCategoryData([]);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  };

  const getSubCategory = (cat_item_name, variable_name, dependent_value) => {
    let url = `${itsmBaseUrl}query_request_var_choices?cat_item_name=${cat_item_name}&variable_name=${variable_name}&dependent_value=${dependent_value}`;
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
            'Content-Type': 'application/json',
          }
        : headers,
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 'failure') {
          // showMessage({
          //   style: {
          //     alignItems: 'flex-end',
          //     fontFamily: '29LTAzer-Regular',
          //   },
          //   type: 'danger',
          //   message: 'إنتهت الجلسة. إنتظر جارى الإتصال...',
          // });
          dispatch(loadingAction.commonLoader(true));
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
        const data = [];
        var arr = responseData.result;
        if (arr && arr != 'Invalid Catalog Item name or Variable Name.') {
          for (let index = 0; index < arr.length; index++) {
            const obj = {
              label: arr[index].text_ar
                ? arr[index].text_ar
                : arr[index].text == 'Create a shared email'
                ? 'إنشاء بريد إلكتروني مشترك'
                : arr[index].text,
              value: arr[index].value,
            };
            data.push(obj);
          }
          setSub_categoryData(data);
        } else setSub_categoryData([]);
      })
      .catch((err) => {
        // console.log('responseData err', err);
      });
  };

  const handleCheckBox = (value, label) => {
    switch (value) {
      case '1':
        if (state.basement.length) {
          setState({
            ...state,
            basement: '',
          });
        } else {
          setState({
            ...state,
            basement: label,
          });
        }

        break;

      case '2':
        if (state.ground_floor.length) {
          setState({
            ...state,
            ground_floor: '',
          });
        } else {
          setState({
            ...state,
            ground_floor: label,
          });
        }

        break;

      case '3':
        if (state.first_floor.length) {
          setState({
            ...state,
            first_floor: '',
          });
        } else {
          setState({
            ...state,
            first_floor: label,
          });
        }

        break;
      case '4':
        if (state.second_floor.length) {
          setState({
            ...state,
            second_floor: '',
          });
        } else {
          setState({
            ...state,
            second_floor: label,
          });
        }

        break;
      case '5':
        if (state.third_floor.length) {
          setState({
            ...state,
            third_floor: '',
          });
        } else {
          setState({
            ...state,
            third_floor: label,
          });
        }

        break;
      case '6':
        if (state.fourth_floor.length) {
          setState({
            ...state,
            fourth_floor: '',
          });
        } else {
          setState({
            ...state,
            fourth_floor: label,
          });
        }

        break;
      case '7':
        if (state.support_center.length) {
          setState({
            ...state,
            support_center: '',
          });
        } else {
          setState({
            ...state,
            support_center: label,
          });
        }

        break;
      case '8':
        if (state.facilities.length) {
          setState({
            ...state,
            facilities: '',
          });
          setState({
            ...state,
            jeddah: state.jeddah ? `${state.jeddah}` : '',
          });
        } else {
          setState({
            ...state,
            facilities: label,
            jeddah: state.jeddah ? `${state.jeddah}\n${label}` : `${label}`,
          });
        }

        break;
      case '9':
        if (state.jeddah.length) {
          setState({
            ...state,
            jeddah: '',
          });
          setState({
            ...state,
            jeddah: state.facilities ? `${state.facilities}` : '',
          });
        } else {
          setState({
            ...state,
            jeddah: state.facilities
              ? `${state.facilities}\n${label}`
              : `${label}`,
          });
        }

        break;

      default:
        break;
    }
  };
  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 20,
          padding: 0,
          marginHorizontal: 10,
          height: Dimensions.get('window').height * 0.8,
          borderRadius: 8,
        }}
      >
        <View
          style={[
            AppStyle.cardContainer,
            {
              // backgroundColor: '#fff',
              marginTop: 10,
              padding: 0,
              borderColor: '#F5F5F5',
              borderWidth: 2,
            },
          ]}
        >
          <KeyboardAwareScrollView>
            <View style={{ alignItems: 'center' }}>
              <OrderHeader
                {...props}
                title={`مركز الطلبات والدعم`}
                title2={`طلب خدمة`}
                icon={require('../../assets/images/da3m.png')}
              />
              <View
                style={{
                  width: '100%',
                  padding: 15,
                  flex: 1,
                  backgroundColor: '#F5F5F5',
                  paddingBottom: 30,
                }}
              >
                {!editableData && state.item ? (
                  <OrderViewItem
                    title1="رقم الطلب"
                    title2={state.item?.id ? state.item.id : ''}
                    icon={require('../../assets/images/order/id.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}
                {!editableData && state.item ? (
                  <OrderViewItem
                    title1="الحالة"
                    title2={
                      item_data?.state
                        ? item_data?.state
                        : getStatus(
                            'TechnicalRequest',
                            state.item?.state ? state.item.state : '',
                          )['statusText']
                    }
                    icon={require('../../assets/images/order/type.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {!editableData && state.item ? (
                  <OrderViewItem
                    title1="صاحب الطلب"
                    title2={
                      state?.item?.RITMRequester
                        ? state?.item?.RITMRequester
                        : '--'
                    }
                    icon={require('../../assets/images/order/category2.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {/* {!editableData && state.item ? (
                <OrderViewItem
                  title1="الوقت"
                  title2={Moment(state.item?.create_date).format(
                    'D-MM-Y hh:mm:ss',
                  )}
                  // title2={state.item?.create_date}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null} */}
                {!editableData && state.item ? (
                  <OrderDateViewItem2
                    title1="الوقت "
                    date={Moment(state.item?.create_date).format('DD-MM-YYYY')}
                    icon={require('../../assets/images/order/date.png')}
                    time={Moment(state.item?.create_date).format(' hh:mm:ss a')}
                    styleText={{
                      color: 'gray',
                      fontFamily: '29LTAzer-Regular',
                      marginVertical: 2,
                      marginHorizontal: 2,
                      textAlign: 'right',
                      flex: 1,
                    }}
                  />
                ) : null}

                {editableData ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderWidth: 0.5,
                        borderColor:
                          state.isValidated && !sub1 ? 'red' : 'white',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={
                        userProfileData[0]?.department_id[0] == 433
                          ? [...state.dropDown1, ...state.dropDownSecurity]
                          : userProfileData[0]?.department_id[0] == 439
                          ? [...state.dropDown1, ...state.dropDownCommonIT]
                          : userProfileData[0]?.department_id[0] == 438
                          ? [...state.dropDown1, ...state.dropDownCommonIT]
                          : userProfileData[0]?.department_id[0] == 440
                          ? [...state.dropDown1, ...state.dropDownCommonIT]
                          : state.dropDown1
                      }
                      onValueChange={(value, index) => handleSub1(value, index)}
                      value={sub1}
                      placeholderText={'اختيار الخدمة *'}
                      disabled={!editableData}
                      isService
                    />
                  </View>
                ) : (
                  <OrderViewItem
                    title1=" الخدمة"
                    // title2={state.item?.type ? state.item.type : ''}
                    title2={item_data?.cat_item ? item_data?.cat_item : ''}
                    icon={require('../../assets/images/order/category.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                )}
                {/* omar */}
                {sub1 != state.dropDown[0].value ? (
                  editableData ? (
                    sub1 && categoryData.length > 0 ? (
                      <View
                        style={[
                          styles.dropdownContainer,
                          {
                            borderWidth: 0.5,
                            borderColor:
                              state.isValidated && !sub1 ? 'red' : 'white',
                          },
                        ]}
                      >
                        <CommonDropdown
                          itemData={categoryData}
                          onValueChange={(value, index) => {
                            setCatID(value);
                            getSubCategory(sub1, 'sub_category', value);
                          }}
                          value={catID}
                          placeholderText={isInActive ? 'التصنيف *' : 'التصنيف'}
                          disabled={!editableData}
                          isService
                        />
                      </View>
                    ) : null
                  ) : item_data?.category ? (
                    <OrderViewItem
                      title1=" التصنيف"
                      // title2={state.item?.category ? state.item?.category : ''}
                      title2={item_data?.category ? item_data?.category : ''}
                      icon={require('../../assets/images/order/category.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  ) : null
                ) : null}

                {sub1 != state.dropDown[20].value &&
                sub1 != state.dropDown[17].value ? (
                  editableData ? (
                    catID && sub_categoryData.length > 0 ? (
                      <View
                        style={[
                          styles.dropdownContainer,
                          {
                            borderWidth: 0.5,
                            borderColor:
                              state.isValidated && !sub1 ? 'red' : 'white',
                          },
                        ]}
                      >
                        <CommonDropdown
                          itemData={sub_categoryData}
                          onValueChange={(value, index) => {
                            setSub_catID(value);
                          }}
                          value={sub_catID}
                          placeholderText={
                            isInActive ? 'فئة التصنيف *' : 'فئة التصنيف'
                          }
                          disabled={!editableData}
                          isService
                        />
                      </View>
                    ) : null
                  ) : item_data?.sub_category ? (
                    <OrderViewItem
                      title1=" فئة التصنيف"
                      // title2={state.item?.sub_category ? state.item.sub_category : '--'}
                      title2={
                        item_data?.sub_category ? item_data?.sub_category : ''
                      }
                      icon={require('../../assets/images/order/category.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  ) : null
                ) : null}

                {editableData ? (
                  sub1 == state.dropDown[20].value &&
                  catID == 'request_preparing_presentations' ? (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          borderWidth: 0.5,
                          borderRadius: 8,
                          borderColor:
                            state.isValidated && !sub1 ? 'red' : 'white',
                        },
                      ]}
                    >
                      <CommonDropdown
                        itemData={[
                          { label: 'الدور الأول', value: 'first' },
                          { label: 'الدور الثانى', value: 'second' },
                          { label: 'الدور الثالث', value: 'third' },
                          { label: 'الدور الرابع', value: 'four' },
                        ]}
                        onValueChange={(value, index) => {
                          if (index) setLocation(value);
                          else setLocation('');
                        }}
                        value={location}
                        placeholderText={'الموقع/المبني الرئيسى منشآت *'}
                        disabled={!editableData}
                        isService
                      />
                    </View>
                  ) : null
                ) : item_data?.selection_menu ? (
                  <OrderViewItem
                    title1="الموقع/المبني الرئيسى منشآت"
                    title2={
                      item_data?.selection_menu ? item_data.selection_menu : ''
                    }
                    icon={require('../../assets/images/order/category.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {/* {editableData && (
                <OrderViewItem
                  title1="التبرير *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {(sub1 != state.dropDown[2].value &&
                  sub1 != 'Printer' &&
                  sub1 != state.dropDown[3].value &&
                  sub1 != state.dropDown[10].value) ||
                (sub1 == state.dropDown[2].value && catID == 'Other') ||
                (sub1 == 'Printer' && catID != 'Access to use Printer') ||
                (sub1 == state.dropDown[3].value &&
                  sub_catID != 'create_new_account') ||
                (sub1 == state.dropDown[10].value &&
                  catID != 'configure_network_port') ? (
                  // sub1 == 'Printer' && catID != 'Access to use Printer' ? (
                  editableData ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.justification.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[
                          styles.input,
                          { height: height2, ...40 },
                        ]}
                        placeholder={
                          catID == 'edit_email_info' ? 'التبرير' : 'التبرير *'
                        }
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            justification: e,
                            subjectErr: '',
                          })
                        }
                        value={state.justification}
                        editable={editableData}
                        multiline={true}
                        onContentSizeChange={(e) =>
                          setHeight2(e.nativeEvent.contentSize.height)
                        }
                      />
                    </View>
                  ) : item_data?.justification ? (
                    <OrderViewItem
                      title1="التبرير"
                      title2={
                        state.item?.justification
                          ? state.item.justification
                          : item_data?.justification
                          ? item_data.justification
                          : '--'
                      }
                      icon={require('../../assets/images/order/subject.png')}
                      title2Style={{
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  ) : null
                ) : null}

                {/* {editableData && sub1 == state.dropDown[3].value && (
                <OrderViewItem
                  title1="البريد الإلكتروني *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[3].value &&
                  (catID == 'manage_email_permission' ||
                    catID == 'extend_account_intern' ||
                    // catID == 'consultant_contractor' ||
                    (catID == 'consultant_contractor' &&
                      sub_catID != 'create_new_account')) ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.email.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="البريد الإلكتروني *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({ ...state, email: e, subjectErr: '' })
                        }
                        value={state.email}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.email ? (
                  <OrderViewItem
                    title1="البريد الإلكتروني"
                    title2={
                      state.item?.email
                        ? state.item.email
                        : item_data?.email
                        ? item_data.email
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="servers_ips *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.servers_ips.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="servers_ips *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              servers_ips: e,
                              subjectErr: '',
                            })
                          }
                          value={state.servers_ips}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="servers_ips"
                        title2={
                          state.item?.servers_ips
                            ? state.item.servers_ips
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="service_port *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.service_port.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="service_port *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              service_port: e,
                              subjectErr: '',
                            })
                          }
                          value={state.service_port}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="service_port"
                        title2={
                          state.item?.service_port
                            ? state.item.service_port
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="lb_proxy_ip *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.lb_proxy_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="lb_proxy_ip *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              lb_proxy_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.lb_proxy_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="lb_proxy_ip"
                        title2={
                          state.item?.lb_proxy_ip
                            ? state.item.lb_proxy_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="application_name *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="اسم التطبيق *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_name"
                        title2={
                          state.item?.application_name
                            ? state.item.application_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="domain_name *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.domain_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="domain_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              domain_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.domain_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="domain_name"
                        title2={
                          state.item?.domain_name
                            ? state.item.domain_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="original_url *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.original_url.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="original_url *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              original_url: e,
                              subjectErr: '',
                            })
                          }
                          value={state.original_url}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="original_url"
                        title2={
                          state.item?.original_url
                            ? state.item.original_url
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="destination_redirected_url *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_redirected_url.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_redirected_url *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_redirected_url: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_redirected_url}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_redirected_url"
                        title2={
                          state.item?.destination_redirected_url
                            ? state.item.destination_redirected_url
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="server_ip *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="00.00.000.00"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({ ...state, server_ip: e, subjectErr: '' })
                          }
                          value={state.server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="server_ip"
                        title2={
                          state.item?.server_ip ? state.item.server_ip : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="time_start_date *"
                  icon={require('../../assets/images/order/date.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                          onPress={
                            editableData
                              ? () =>
                                  setState({
                                    ...state,
                                    time_start_date_visible: true,
                                  })
                              : null
                          }
                          style={[
                            styles.dateStyle,
                            {
                              borderColor:
                                state.isValidated && !state.time_start_date
                                  ? 'red'
                                  : 'white',
                            },
                          ]}
                          // disabled={state.endDateDisabled}
                        >
                          <Image
                            style={{
                              height: 25,
                              width: 25,
                              tintColor: '#c2c2c2',
                            }}
                            source={require('./../../assets/images/date.png')}
                          />
                          <Text style={styles.dateText}>
                            {state.time_start_date
                              ? state.time_start_date
                              : 'time_start_date *'}
                          </Text>
                        </TouchableOpacity>
                        <Modal
                          animationType={'slide'}
                          transparent={true}
                          visible={state.time_start_date_visible}
                          hardwareAccelerated={true}
                        >
                          <TouchableWithoutFeedback
                            onPress={() =>
                              setState({
                                ...state,
                                time_start_date_visible: false,
                              })
                            }
                          >
                            <View
                              style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'center',
                                padding: 10,
                                borderRadius: 15,
                                backgroundColor: 'rgba(0, 117,152, 0.97)',
                                alignItems: 'flex-end',
                                justifyContent: 'space-around',
                                position: 'absolute',
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
                                  minDate={new Date()}
                                  onDateChange={handleTimeStartDate}
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
                                  textStyle={{
                                    fontFamily: '29LTAzer-Regular',
                                    color: '#000000',
                                  }}
                                  date={
                                    state.time_start_date
                                      ? new Date(state.time_start_date)
                                      : new Date()
                                  }
                                  initialDate={new Date()}
                                />
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </Modal>
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="time_start_date"
                        title2={
                          state.item?.time_start_date
                            ? state.item.time_start_date
                            : '--'
                        }
                        icon={require('../../assets/images/order/date.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}
                {/* omar */}
                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="time_end_date *"
                  icon={require('../../assets/images/order/date.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                          onPress={
                            editableData
                              ? () =>
                                  setState({
                                    ...state,
                                    time_end_date_visible: true,
                                  })
                              : null
                          }
                          style={[
                            styles.dateStyle,
                            {
                              borderColor:
                                state.isValidated && !state.time_end_date
                                  ? 'red'
                                  : 'white',
                            },
                          ]}
                          // disabled={state.endDateDisabled}
                        >
                          <Image
                            style={{
                              height: 25,
                              width: 25,
                              tintColor: '#c2c2c2',
                            }}
                            source={require('./../../assets/images/date.png')}
                          />
                          <Text style={styles.dateText}>
                            {state.time_end_date
                              ? state.time_end_date
                              : 'time_end_date *'}
                          </Text>
                        </TouchableOpacity>
                        <Modal
                          animationType={'slide'}
                          transparent={true}
                          visible={state.time_end_date_visible}
                          hardwareAccelerated={true}
                        >
                          <TouchableWithoutFeedback
                            onPress={() =>
                              setState({
                                ...state,
                                time_end_date_visible: false,
                              })
                            }
                          >
                            <View
                              style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'center',
                                padding: 10,
                                borderRadius: 15,
                                backgroundColor: 'rgba(0, 117,152, 0.97)',
                                alignItems: 'flex-end',
                                justifyContent: 'space-around',
                                position: 'absolute',
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
                                  minDate={new Date()}
                                  onDateChange={handleTimeEndDate}
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
                                  textStyle={{
                                    fontFamily: '29LTAzer-Regular',
                                    color: '#000000',
                                  }}
                                  date={
                                    state.time_end_date
                                      ? new Date(state.time_end_date)
                                      : new Date()
                                  }
                                  initialDate={new Date()}
                                />
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </Modal>
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="time_end_date"
                        title2={
                          state.item?.time_end_date
                            ? state.item.time_end_date
                            : '--'
                        }
                        icon={require('../../assets/images/order/date.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="dns_record *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.dns_record.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="dns_record *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              dns_record: e,
                              subjectErr: '',
                            })
                          }
                          value={state.dns_record}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="dns_record"
                        title2={
                          state.item?.dns_record ? state.item.dns_record : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[4].value && (
                <OrderViewItem
                  title1="dns_server *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[4].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.dns_server.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="dns_server *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              dns_server: e,
                              subjectErr: '',
                            })
                          }
                          value={state.dns_server}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="dns_server"
                        title2={
                          state.item?.dns_server ? state.item.dns_server : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[4].value ||
                  sub1 == state.dropDown[18].value) && (
                  <OrderViewItem
                    title1="server_ip_hostname *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[4].value ||
                  sub1 == state.dropDown[18].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.server_ip_hostname.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="00.00.000.00"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              server_ip_hostname: e,
                              subjectErr: '',
                            })
                          }
                          value={state.server_ip_hostname}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="server_ip_hostname"
                        title2={
                          state.item?.server_ip_hostname
                            ? state.item.server_ip_hostname
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[4].value ||
                  sub1 == state.dropDown[18].value) && (
                  <OrderViewItem
                    title1="time_date *"
                    icon={require('../../assets/images/order/date.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[4].value ||
                  sub1 == state.dropDown[18].value) && (
                  <>
                    {editableData ? (
                      <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                          onPress={
                            editableData
                              ? () =>
                                  setState({
                                    ...state,
                                    time_date_visible: true,
                                  })
                              : null
                          }
                          style={[
                            styles.dateStyle,
                            {
                              borderColor:
                                state.isValidated && !state.time_date
                                  ? 'red'
                                  : 'white',
                            },
                          ]}
                          // disabled={state.endDateDisabled}
                        >
                          <Image
                            style={{
                              height: 25,
                              width: 25,
                              tintColor: '#c2c2c2',
                            }}
                            source={require('./../../assets/images/date.png')}
                          />
                          <Text style={styles.dateText}>
                            {state.time_date
                              ? state.time_date
                              : 'تاريخ الوقت *'}
                          </Text>
                        </TouchableOpacity>
                        <Modal
                          animationType={'slide'}
                          transparent={true}
                          visible={state.time_date_visible}
                          hardwareAccelerated={true}
                        >
                          <TouchableWithoutFeedback
                            onPress={() =>
                              setState({ ...state, time_date_visible: false })
                            }
                          >
                            <View
                              style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'center',
                                padding: 10,
                                borderRadius: 15,
                                backgroundColor: 'rgba(0, 117,152, 0.97)',
                                alignItems: 'flex-end',
                                justifyContent: 'space-around',
                                position: 'absolute',
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
                                  minDate={new Date()}
                                  onDateChange={handleTimeDate}
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
                                  textStyle={{
                                    fontFamily: '29LTAzer-Regular',
                                    color: '#000000',
                                  }}
                                  date={
                                    state.time_date
                                      ? new Date(state.time_date)
                                      : new Date()
                                  }
                                  initialDate={new Date()}
                                />
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </Modal>
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="تاريخ الوقت"
                        title2={
                          state.item?.time_date ? state.item.time_date : '--'
                        }
                        icon={require('../../assets/images/order/date.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="website_ur *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <>
                    {catID == 'allow_website' ? (
                      editableData ? (
                        <View
                          style={[
                            styles.inputContainer,
                            {
                              borderColor:
                                state.isValidated && !state.website_ur.length
                                  ? 'red'
                                  : 'white',
                            },
                          ]}
                        >
                          <CommonTextInput
                            customStyle={true}
                            customStyleData={[styles.input, { height: 40 }]}
                            placeholder="عنوان url لموقع الويب *"
                            placeholderStyle={{
                              fontFamily: '29LTAzer-Regular',
                            }}
                            changeText={(e) =>
                              setState({
                                ...state,
                                website_ur: e,
                                subjectErr: '',
                              })
                            }
                            value={state.website_ur}
                            editable={editableData}
                            multiline={true}
                          />
                        </View>
                      ) : (
                        <OrderViewItem
                          title1="website_ur"
                          title2={
                            state.item?.website_ur
                              ? state.item.website_ur
                              : '--'
                          }
                          icon={require('../../assets/images/order/subject.png')}
                          title2Style={{
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      )
                    ) : null}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="floor_number *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}

                {editableData ? (
                  sub1 == state.dropDown[10].value &&
                  catID == 'configure_network_port' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: 'white',
                          padding: 10,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          color: '#707070',
                          fontSize: 17,
                          marginBottom: 15,
                        }}
                      >
                        {'موقع المبنى *'}
                      </Text>
                      {state.bulidLocation.map((item) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 4,
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                marginHorizontal: 10,
                                textAlign: 'right',
                                color: '#707070',
                                fontSize: 14,
                              }}
                            >
                              {item.label}
                            </Text>
                            <View style={styles.checkboxContainer}>
                              <Checkbox.Android
                                status={
                                  ischeckedArray.includes(item.value)
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                onPress={() => {
                                  if (ischeckedArray.includes(item.value)) {
                                    const index = ischeckedArray.indexOf(
                                      item.value,
                                    );
                                    ischeckedArray.splice(index, 1); // 2nd parameter means remove one item only
                                  } else {
                                    ischeckedArray.push(item.value);
                                  }

                                  handleCheckBox(item.value, item.label);
                                }}
                                color={'#007598'}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ) : null
                ) : (state.item?.basement && state.item?.basement != 'false') ||
                  (state.item?.ground_floor &&
                    state.item?.ground_floor != 'false') ||
                  (state.item?.first_floor &&
                    state.item?.first_floor != 'false') ||
                  (state.item?.second_floor &&
                    state.item?.second_floor != 'false') ||
                  (state.item?.third_floor &&
                    state.item?.third_floor != 'false') ||
                  (state.item?.fourth_floor &&
                    state.item?.fourth_floor != 'false') ||
                  (state.item?.jeddah && state.item?.jeddah != 'false') ? (
                  <OrderViewItem
                    title1="موقع المبنى"
                    title2={`${
                      state.item?.basement ? state.item.basement : ''
                    }\n${
                      state.item?.ground_floor ? state.item.ground_floor : ''
                    }\n${
                      state.item?.first_floor ? state.item.first_floor : ''
                    }\n${
                      state.item?.second_floor ? state.item.second_floor : ''
                    }\n${
                      state.item?.third_floor ? state.item.third_floor : ''
                    }\n${
                      state.item?.fourth_floor ? state.item.fourth_floor : ''
                    }\n${
                      state.item?.support_center
                        ? state.item.support_center
                        : ''
                    }\n${
                      state.item?.jeddah ? state.item.jeddah.trim() : ''
                    }`.trim()}
                    icon={require('../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {editableData ? (
                  sub1 == state.dropDown[10].value &&
                  catID == 'configure_network_port' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.floor_number.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonDropdown
                        itemData={[
                          { label: 'الدور الأول', value: 'الدور الأول' },
                          { label: 'الدور الثانى', value: 'الدور الثانى' },
                          { label: 'الدور الثالث', value: 'الدور الثالث' },
                          { label: 'الدور الرابع', value: 'الدور الرابع' },
                        ]}
                        onValueChange={(value, index) => {
                          setState({
                            ...state,
                            floor_number: value,
                          });
                        }}
                        value={state.floor_number}
                        placeholderText={'رقم الطابق *'}
                        disabled={!editableData}
                        isService
                      />
                    </View>
                  ) : null
                ) : state.item?.floor_number ? (
                  <OrderViewItem
                    title1="رقم الطابق"
                    title2={
                      state.item?.floor_number ? state.item.floor_number : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                    title2Style={{
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                ) : null}

                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.floor_number.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="floor_number *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              floor_number: e,
                              subjectErr: '',
                            })
                          }
                          value={state.floor_number}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="floor_number"
                        title2={
                          state.item?.floor_number
                            ? state.item.floor_number
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="basement *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.basement.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="basement *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({ ...state, basement: e, subjectErr: '' })
                          }
                          value={state.basement}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="basement"
                        title2={
                          state.item?.basement ? state.item.basement : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="ground_floor *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.ground_floor.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="ground_floor *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              ground_floor: e,
                              subjectErr: '',
                            })
                          }
                          value={state.ground_floor}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="ground_floor"
                        title2={
                          state.item?.ground_floor
                            ? state.item.ground_floor
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                        title2Style={{
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="first_floor *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.first_floor.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="first_floor *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              first_floor: e,
                              subjectErr: '',
                            })
                          }
                          value={state.first_floor}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="first_floor"
                        title2={
                          state.item?.first_floor
                            ? state.item.first_floor
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="second_floor *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.second_floor.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="second_floor *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              second_floor: e,
                              subjectErr: '',
                            })
                          }
                          value={state.second_floor}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="second_floor"
                        title2={
                          state.item?.second_floor
                            ? state.item.second_floor
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="third_floor *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.third_floor.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="third_floor *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              third_floor: e,
                              subjectErr: '',
                            })
                          }
                          value={state.third_floor}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="third_floor"
                        title2={
                          state.item?.third_floor
                            ? state.item.third_floor
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="fourth_floor *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.fourth_floor.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="fourth_floor *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              fourth_floor: e,
                              subjectErr: '',
                            })
                          }
                          value={state.fourth_floor}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="fourth_floor"
                        title2={
                          state.item?.fourth_floor
                            ? state.item.fourth_floor
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="support_center *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.support_center.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="support_center *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              support_center: e,
                              subjectErr: '',
                            })
                          }
                          value={state.support_center}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="support_center"
                        title2={
                          state.item?.support_center
                            ? state.item.support_center
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="facilities *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.facilities.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="facilities *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              facilities: e,
                              subjectErr: '',
                            })
                          }
                          value={state.facilities}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="facilities"
                        title2={
                          state.item?.facilities ? state.item.facilities : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="jeddah *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {sub1 == state.dropDown[5].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.jeddah.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="jeddah *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({ ...state, jeddah: e, subjectErr: '' })
                          }
                          value={state.jeddah}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="jeddah"
                        title2={state.item?.jeddah ? state.item.jeddah : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[5].value ||
                  sub1 == state.dropDown[10].value) && (
                  <OrderViewItem
                    title1="port_socket_number *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}

                {editableData ? (
                  (sub1 == state.dropDown[5].value ||
                    sub1 == state.dropDown[10].value) && (
                    <>
                      {sub1 == state.dropDown[10].value &&
                      catID == 'configure_network_port' ? (
                        editableData ? (
                          <View
                            style={[
                              styles.inputContainer,
                              {
                                borderColor:
                                  state.isValidated &&
                                  !state.port_socket_number.length
                                    ? 'red'
                                    : 'white',
                              },
                            ]}
                          >
                            <CommonTextInput
                              customStyle={true}
                              customStyleData={[styles.input, { height: 40 }]}
                              placeholder="رقم مقبس المنفذ"
                              placeholderStyle={{
                                fontFamily: '29LTAzer-Regular',
                              }}
                              changeText={(e) =>
                                setState({
                                  ...state,
                                  port_socket_number: e,
                                  subjectErr: '',
                                })
                              }
                              value={state.port_socket_number}
                              editable={editableData}
                              multiline={true}
                            />
                          </View>
                        ) : (
                          <OrderViewItem
                            title1="port_socket_number"
                            title2={
                              state.item?.port_socket_number
                                ? state.item.port_socket_number
                                : '--'
                            }
                            icon={require('../../assets/images/order/subject.png')}
                          />
                        )
                      ) : null}
                    </>
                  )
                ) : state.item?.port_socket_number ? (
                  <OrderViewItem
                    title1="رقم مقبس المنفذ"
                    title2={
                      state.item?.port_socket_number
                        ? state.item.port_socket_number
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {!editableData && (
                  <OrderViewItem
                    title1="رقم مقبس المنفذ"
                    title2={
                      state.item?.port_socket_number
                        ? state.item.port_socket_number
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                )} */}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="server_ip_hostname *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.server_ip_hostname.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="server_ip_hostname *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              server_ip_hostname: e,
                              subjectErr: '',
                            })
                          }
                          value={state.server_ip_hostname}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="server_ip_hostname"
                        title2={
                          state.item?.server_ip_hostname
                            ? state.item.server_ip_hostname
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="destination_ips_urls *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_ips_urls.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_ips_urls *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_ips_urls: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_ips_urls}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_ips_urls"
                        title2={
                          state.item?.destination_ips_urls
                            ? state.item.destination_ips_urls
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="durartion *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.durartion.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="durartion *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({ ...state, durartion: e, subjectErr: '' })
                          }
                          value={state.durartion}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="durartion"
                        title2={
                          state.item?.durartion ? state.item.durartion : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="ports *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.ports.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="ports *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({ ...state, ports: e, subjectErr: '' })
                          }
                          value={state.ports}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="ports"
                        title2={state.item?.ports ? state.item.ports : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="public_dns_record *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.public_dns_record.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="public_dns_record *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              public_dns_record: e,
                              subjectErr: '',
                            })
                          }
                          value={state.public_dns_record}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="public_dns_record"
                        title2={
                          state.item?.public_dns_record
                            ? state.item.public_dns_record
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="source_server_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.source_server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="000.00.000.000 *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              source_server_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.source_server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="source_server_ip"
                        title2={
                          state.item?.source_server_ip
                            ? state.item.source_server_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <OrderViewItem
                    title1="destination_server_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[6].value ||
                  sub1 == state.dropDown[11].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="00.00.000.00 *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_server_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_server_ip"
                        title2={
                          state.item?.destination_server_ip
                            ? state.item.destination_server_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/*              
              {(sub1 == state.dropDown[6].value ||
                sub1 == state.dropDown[11].value ||
                sub1 == state.dropDown[15].value ||
                sub1 == state.dropDown[16].value) && (
                <>
                  {editableData ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.sub_category.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="sub_category *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={e =>
                          setState({
                            ...state,
                            sub_category: e,
                            subjectErr: '',
                          })
                        }
                        value={state.sub_category}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                  //  (
                  //   <OrderViewItem
                  //     title1="sub_category"
                  //     title2={
                  //       state.item?.sub_category
                  //         ? state.item.sub_category
                  //         : '--'
                  //     }
                  //     icon={require('../../assets/images/order/subject.png')}
                  //   />
                  // )
                  }
                </>
              )} */}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="source_GSN_IP *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.source_GSN_IP.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="source_GSN_IP *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              source_GSN_IP: e,
                              subjectErr: '',
                            })
                          }
                          value={state.source_GSN_IP}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="source_GSN_IP"
                        title2={
                          state.item?.source_GSN_IP
                            ? state.item.source_GSN_IP
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="source_entity_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.source_entity_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="source_entity_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              source_entity_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.source_entity_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="source_entity_name"
                        title2={
                          state.item?.source_entity_name
                            ? state.item.source_entity_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="destination_GSN_IP *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_GSN_IP.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_GSN_IP *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_GSN_IP: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_GSN_IP}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_GSN_IP"
                        title2={
                          state.item?.destination_GSN_IP
                            ? state.item.destination_GSN_IP
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="destination_entity_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_entity_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_entity_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_entity_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_entity_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_entity_name"
                        title2={
                          state.item?.destination_entity_name
                            ? state.item.destination_entity_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="monshaat_server_IP *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.monshaat_server_IP.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="monshaat_server_IP *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              monshaat_server_IP: e,
                              subjectErr: '',
                            })
                          }
                          value={state.monshaat_server_IP}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="monshaat_server_IP"
                        title2={
                          state.item?.monshaat_server_IP
                            ? state.item.monshaat_server_IP
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <OrderViewItem
                    title1="other_entity_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[7].value ||
                  sub1 == state.dropDown[12].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.other_entity_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="other_entity_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              other_entity_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.other_entity_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="other_entity_name"
                        title2={
                          state.item?.other_entity_name
                            ? state.item.other_entity_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_name"
                        title2={state.item?.db_name ? state.item.db_name : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_ip *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_ip"
                        title2={state.item?.db_ip ? state.item.db_ip : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_user *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_user.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_user *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_user: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_user}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_user"
                        title2={state.item?.db_user ? state.item.db_user : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_type *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_type.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_type *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_type: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_type}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_type"
                        title2={state.item?.db_type ? state.item.db_type : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value ||
                  sub1 == state.dropDown[19].value) && (
                  <OrderViewItem
                    title1="application_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value ||
                  sub1 == state.dropDown[19].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="إسم التطبيق *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_name"
                        title2={
                          state.item?.application_name
                            ? state.item.application_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_user_permisssion *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.db_user_permisssion.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_user_permisssion *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_user_permisssion: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_user_permisssion}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_user_permisssion"
                        title2={
                          state.item?.db_user_permisssion
                            ? state.item.db_user_permisssion
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="backup_time *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.backup_time.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="backup_time *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              backup_time: e,
                              subjectErr: '',
                            })
                          }
                          value={state.backup_time}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="backup_time"
                        title2={
                          state.item?.backup_time
                            ? state.item.backup_time
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="restoration_date *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.restoration_date.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="restoration_date *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              restoration_date: e,
                              subjectErr: '',
                            })
                          }
                          value={state.restoration_date}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="restoration_date"
                        title2={
                          state.item?.restoration_date
                            ? state.item.restoration_date
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_username *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_username.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_username *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_username: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_username}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_username"
                        title2={
                          state.item?.db_username
                            ? state.item.db_username
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <OrderViewItem
                    title1="db_server_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[8].value ||
                  sub1 == state.dropDown[13].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.db_server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="db_server_ip *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              db_server_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.db_server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="db_server_ip"
                        title2={
                          state.item?.db_server_ip
                            ? state.item.db_server_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="cpu *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.cpu.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="cpu *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              cpu: e,
                              subjectErr: '',
                            })
                          }
                          value={state.cpu}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="cpu"
                        title2={state.item?.cpu ? state.item.cpu : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="ram *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.ram.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="ram *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              ram: e,
                              subjectErr: '',
                            })
                          }
                          value={state.ram}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="ram"
                        title2={state.item?.ram ? state.item.ram : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="disk_partitions *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.disk_partitions.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="أقسام القرص *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              disk_partitions: e,
                              subjectErr: '',
                            })
                          }
                          value={state.disk_partitions}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="أقسام القرص"
                        title2={
                          state.item?.disk_partitions
                            ? state.item.disk_partitions
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="network_zone *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.network_zone.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="منطقة الشبكة *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              network_zone: e,
                              subjectErr: '',
                            })
                          }
                          value={state.network_zone}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="منطقة الشبكة"
                        title2={
                          state.item?.network_zone
                            ? state.item.network_zone
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="server_role *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.server_role.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="دور الخادم *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              server_role: e,
                              subjectErr: '',
                            })
                          }
                          value={state.server_role}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="دور الخادم"
                        title2={
                          state.item?.server_role
                            ? state.item.server_role
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="business_owner_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.business_owner_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="business_owner_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              business_owner_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.business_owner_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="business_owner_name"
                        title2={
                          state.item?.business_owner_name
                            ? state.item.business_owner_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="application_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="application_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_name"
                        title2={
                          state.item?.application_name
                            ? state.item.application_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="application_technical_owner *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_technical_owner.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="application_technical_owner *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_technical_owner: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_technical_owner}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_technical_owner"
                        title2={
                          state.item?.application_technical_owner
                            ? state.item.application_technical_owner
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="application_technical_contact_number *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_technical_contact_number.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="application_technical_contact_number *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_technical_contact_number: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_technical_contact_number}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_technical_contact_number"
                        title2={
                          state.item?.application_technical_contact_number
                            ? state.item.application_technical_contact_number
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="application_custodian *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_custodian.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="application_custodian *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_custodian: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_custodian}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_custodian"
                        title2={
                          state.item?.application_custodian
                            ? state.item.application_custodian
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}
                {/* 
              {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="application_custodian_contact_number *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_custodian_contact_number.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="application_custodian_contact_number *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_custodian_contact_number: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_custodian_contact_number}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_custodian_contact_number"
                        title2={
                          state.item?.application_custodian_contact_number
                            ? state.item.application_custodian_contact_number
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="server_ip_address *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.server_ip_address.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="server_ip_address *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              server_ip_address: e,
                              subjectErr: '',
                            })
                          }
                          value={state.server_ip_address}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="server_ip_address"
                        title2={
                          state.item?.server_ip_address
                            ? state.item.server_ip_address
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="username *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.username.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="username *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              username: e,
                              subjectErr: '',
                            })
                          }
                          value={state.username}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="username"
                        title2={
                          state.item?.username ? state.item.username : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="role_permission *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.role_permission.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="role_permission *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              role_permission: e,
                              subjectErr: '',
                            })
                          }
                          value={state.role_permission}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="role_permission"
                        title2={
                          state.item?.role_permission
                            ? state.item.role_permission
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value ||
                  sub1 == state.dropDown[15].value) && (
                  <OrderViewItem
                    title1="start_date *"
                    icon={require('../../assets/images/order/date.png')}
                  />
                )} */}

                {editableData ? (
                  sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value ||
                  (sub1 == state.dropDown[15].value &&
                    sub_catID == 'Temporary') ? (
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity
                        onPress={
                          editableData
                            ? () =>
                                setState({
                                  ...state,
                                  start_date_visible: true,
                                })
                            : null
                        }
                        style={[
                          styles.dateStyle,
                          {
                            borderColor:
                              state.isValidated && !state.start_date
                                ? 'red'
                                : 'white',
                          },
                        ]}
                        // disabled={state.endDateDisabled}
                      >
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            tintColor: '#c2c2c2',
                          }}
                          source={require('./../../assets/images/date.png')}
                        />
                        <Text style={styles.dateText}>
                          {state.start_date
                            ? state.start_date
                            : 'تاريخ البداية *'}
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={state.start_date_visible}
                        hardwareAccelerated={true}
                      >
                        <TouchableWithoutFeedback
                          onPress={() =>
                            setState({
                              ...state,
                              start_date_visible: false,
                            })
                          }
                        >
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              alignSelf: 'center',
                              padding: 10,
                              borderRadius: 15,
                              backgroundColor: 'rgba(0, 117,152, 0.97)',
                              alignItems: 'flex-end',
                              justifyContent: 'space-around',
                              position: 'absolute',
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
                                minDate={new Date()}
                                onDateChange={handleStartDate}
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
                                textStyle={{
                                  fontFamily: '29LTAzer-Regular',
                                  color: '#000000',
                                }}
                                date={
                                  state.start_date
                                    ? new Date(state.start_date)
                                    : new Date()
                                }
                                initialDate={new Date()}
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    </View>
                  ) : null
                ) : item_data?.start_date ? (
                  <OrderViewItem
                    title1="تاريخ البداية"
                    title2={
                      state.item?.start_date
                        ? state.item.start_date
                        : item_data?.start_date
                        ? item_data.start_date
                        : '--'
                    }
                    icon={require('../../assets/images/order/date.png')}
                  />
                ) : null}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value ||
                  sub1 == state.dropDown[15].value) && (
                  <OrderViewItem
                    title1="end_date *"
                    icon={require('../../assets/images/order/date.png')}
                  />
                )} */}

                {editableData ? (
                  sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value ||
                  (sub1 == state.dropDown[15].value &&
                    sub_catID == 'Temporary') ? (
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity
                        onPress={
                          editableData
                            ? () =>
                                setState({
                                  ...state,
                                  end_date_visible: true,
                                })
                            : null
                        }
                        style={[
                          styles.dateStyle,
                          {
                            borderColor:
                              state.isValidated && !state.end_date
                                ? 'red'
                                : 'white',
                          },
                        ]}
                        // disabled={state.endDateDisabled}
                      >
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            tintColor: '#c2c2c2',
                          }}
                          source={require('./../../assets/images/date.png')}
                        />
                        <Text style={styles.dateText}>
                          {state.end_date ? state.end_date : 'تاريخ الإنتهاء *'}
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={state.end_date_visible}
                        hardwareAccelerated={true}
                      >
                        <TouchableWithoutFeedback
                          onPress={() =>
                            setState({
                              ...state,
                              end_date_visible: false,
                            })
                          }
                        >
                          <View
                            style={{
                              height: '100%',
                              width: '100%',
                              alignSelf: 'center',
                              padding: 10,
                              borderRadius: 15,
                              backgroundColor: 'rgba(0, 117,152, 0.97)',
                              alignItems: 'flex-end',
                              justifyContent: 'space-around',
                              position: 'absolute',
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
                                minDate={new Date()}
                                onDateChange={handleEndDate}
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
                                textStyle={{
                                  fontFamily: '29LTAzer-Regular',
                                  color: '#000000',
                                }}
                                date={
                                  state.end_date
                                    ? new Date(state.end_date)
                                    : new Date()
                                }
                                initialDate={new Date()}
                              />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    </View>
                  ) : null
                ) : item_data?.end_date ? (
                  <OrderViewItem
                    title1="تاريخ الإنتهاء"
                    title2={
                      state.item?.end_date
                        ? state.item.end_date
                        : item_data?.end_date
                        ? item_data.end_date
                        : '--'
                    }
                    icon={require('../../assets/images/order/date.png')}
                  />
                ) : null}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="os_type *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.os_type.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="os_type *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              os_type: e,
                              subjectErr: '',
                            })
                          }
                          value={state.os_type}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="os_type"
                        title2={state.item?.os_type ? state.item.os_type : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="software_name *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.software_name.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="software_name *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              software_name: e,
                              subjectErr: '',
                            })
                          }
                          value={state.software_name}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="software_name"
                        title2={
                          state.item?.software_name
                            ? state.item.software_name
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="source_server_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.source_server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="source_server_ip *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              source_server_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.source_server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="source_server_ip"
                        title2={
                          state.item?.source_server_ip
                            ? state.item.source_server_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="source_file_path *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.source_file_path.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="source_file_path *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              source_file_path: e,
                              subjectErr: '',
                            })
                          }
                          value={state.source_file_path}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="source_file_path"
                        title2={
                          state.item?.source_file_path
                            ? state.item.source_file_path
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="destination_server_ip *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_server_ip.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_server_ip *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_server_ip: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_server_ip}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_server_ip"
                        title2={
                          state.item?.destination_server_ip
                            ? state.item.destination_server_ip
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="destination_file_path *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.destination_file_path.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="destination_file_path *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              destination_file_path: e,
                              subjectErr: '',
                            })
                          }
                          value={state.destination_file_path}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="destination_file_path"
                        title2={
                          state.item?.destination_file_path
                            ? state.item.destination_file_path
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="modify_number_of_CPU_to *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.modify_number_of_CPU_to.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="modify_number_of_CPU_to *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              modify_number_of_CPU_to: e,
                              subjectErr: '',
                            })
                          }
                          value={state.modify_number_of_CPU_to}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="modify_number_of_CPU_to"
                        title2={
                          state.item?.modify_number_of_CPU_to
                            ? state.item.modify_number_of_CPU_to
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="modify_memory_to *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.modify_memory_to.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="modify_memory_to *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              modify_memory_to: e,
                              subjectErr: '',
                            })
                          }
                          value={state.modify_memory_to}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="modify_memory_to"
                        title2={
                          state.item?.modify_memory_to
                            ? state.item.modify_memory_to
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData &&
                (sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <OrderViewItem
                    title1="modify_disk_to *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}
                {(sub1 == state.dropDown[9].value ||
                  sub1 == state.dropDown[14].value) && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.modify_disk_to.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="modify_disk_to *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              modify_disk_to: e,
                              subjectErr: '',
                            })
                          }
                          value={state.modify_disk_to}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="modify_disk_to"
                        title2={
                          state.item?.modify_disk_to
                            ? state.item.modify_disk_to
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}
                {/* {editableData &&
                (sub1 == state.dropDown[16].value ||
                  sub1 == state.dropDown[17].value) && (
                  <OrderViewItem
                    title1="choose_apps *"
                    icon={require('../../assets/images/order/category2.png')}
                  />
                )} */}

                {/* {(sub1 == state.dropDown[16].value ||
                sub1 == state.dropDown[17].value) && (
                <>
                  {editableData ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.choose_apps.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="إختيار التطبيقات *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={e =>
                          setState({
                            ...state,
                            choose_apps: e,
                            subjectErr: '',
                          })
                        }
                        value={state.choose_apps}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : (
                    <OrderViewItem
                      title1="choose_apps"
                      title2={
                        state.item?.choose_apps ? state.item.choose_apps : '--'
                      }
                      icon={require('../../assets/images/order/subject.png')}
                    />
                  )}
                </>
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[16].value ||
                  sub1 == state.dropDown[17].value ? (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          borderWidth: 0.5,
                          borderRadius: 8,
                          borderColor:
                            state.isValidated && !sub1 ? 'red' : 'white',
                        },
                      ]}
                    >
                      <CommonDropdown
                        itemData={[
                          {
                            label: 'التطبيقات الداخلية',
                            value: 'التطبيقات الداخلية',
                          },
                          {
                            label: 'التطبيقات الخارخية',
                            value: 'التطبيقات الخارخية',
                          },
                        ]}
                        onValueChange={(value, index) => {
                          if (index) {
                            setState({
                              ...state,
                              choose_apps: value,
                              subjectErr: '',
                            });
                          } else {
                            setState({
                              ...state,
                              choose_apps: '',
                              subjectErr: '',
                            });
                          }
                        }}
                        value={state.choose_apps}
                        placeholderText={'إختيار التطبيقات *'}
                        disabled={!editableData}
                        isService
                      />
                    </View>
                  ) : null
                ) : item_data?.choose_apps ? (
                  <OrderViewItem
                    title1="إختيار التطبيقات"
                    title2={
                      state.item?.choose_apps
                        ? state.item.choose_apps
                        : item_data?.choose_apps
                        ? item_data.choose_apps
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[19].value && (
                <OrderViewItem
                  title1="url *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[19].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.url.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="url *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              url: e,
                              subjectErr: '',
                            })
                          }
                          value={state.url}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="url"
                        title2={state.item?.url ? state.item.url : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}
                {/* {editableData && sub1 == state.dropDown[19].value && (
                <OrderViewItem
                  title1="application_owner *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[19].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.application_owner.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="صاحب التطبيق *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              application_owner: e,
                              subjectErr: '',
                            })
                          }
                          value={state.application_owner}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="application_owner"
                        title2={
                          state.item?.application_owner
                            ? state.item.application_owner
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}
                {/* {editableData && sub1 == state.dropDown[19].value && (
                <OrderViewItem
                  title1="send_alert_to *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[19].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.send_alert_to.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="إرسال تنبيه إلى *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              send_alert_to: e,
                              subjectErr: '',
                            })
                          }
                          value={state.send_alert_to}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="send_alert_to"
                        title2={
                          state.item?.send_alert_to
                            ? state.item.send_alert_to
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[20].value && (
                <OrderViewItem
                  title1="selection_menu *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[20].value &&
                  catID == 'request_technical_equipment' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.selection_menu.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder={'رقم المكتب *'}
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            office_number: e,
                            subjectErr: '',
                          })
                        }
                        value={state.office_number}
                        editable={editableData}
                        // keyboardType="numeric"
                      />
                    </View>
                  ) : null
                ) : item_data?.office_number ? (
                  <OrderViewItem
                    title1="رقم المكتب"
                    title2={
                      item_data?.office_number ? item_data.office_number : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[21].value && (
                <OrderViewItem
                  title1="required_duration *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[21].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.required_duration.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="المدة المطلوبة بالأيام*"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              required_duration: e,
                              subjectErr: '',
                            })
                          }
                          value={state.required_duration}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="required_duration"
                        title2={
                          state.item?.required_duration
                            ? state.item.required_duration
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[21].value && (
                <OrderViewItem
                  title1="server_address *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {/* {sub1 == state.dropDown[21].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.server_address.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="عنوان الخادم *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              server_address: e,
                              subjectErr: '',
                            })
                          }
                          value={state.server_address}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="server_address"
                        title2={
                          state.item?.server_address
                            ? state.item.server_address
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )} */}

                {/* {editableData && sub1 == state.dropDown[21].value && (
                <OrderViewItem
                  title1="operating_system *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {/* {sub1 == state.dropDown[21].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated &&
                              !state.operating_system.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="نظام التشغيل *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              operating_system: e,
                              subjectErr: '',
                            })
                          }
                          value={state.operating_system}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="operating_system"
                        title2={
                          state.item?.operating_system
                            ? state.item.operating_system
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )} */}

                {/* {editableData && sub1 == state.dropDown[21].value && (
                <OrderViewItem
                  title1="explanation *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {/* {sub1 == state.dropDown[21].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.explanation.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="تفسير *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              explanation: e,
                              subjectErr: '',
                            })
                          }
                          value={state.explanation}
                          editable={editableData}
                          multiline={true}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="explanation"
                        title2={
                          state.item?.explanation
                            ? state.item.explanation
                            : '--'
                        }
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )} */}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="full_name *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {sub1 == state.dropDown[22].value && catID == 'VPN' ? (
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        borderWidth: 0.5,
                        borderColor:
                          state.isValidated && !sub1 ? 'red' : 'white',
                      },
                    ]}
                  >
                    <CommonDropdown
                      itemData={[
                        { label: 'موظف', value: 'employee' },
                        { label: 'متدرب', value: 'trainer' },
                        { label: 'متعاقد', value: 'Contracted' },
                      ]}
                      onValueChange={(value, index) => {
                        setOrder_owner(value);
                      }}
                      value={order_owner}
                      placeholderText={' صاحب الطلب *'}
                      disabled={!editableData}
                      isService
                    />
                  </View>
                ) : null}

                {editableData ? (
                  sub1 == state.dropDown[22].value ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.full_name.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="الإسم الكامل *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            full_name: e,
                            subjectErr: '',
                          })
                        }
                        value={state.full_name}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.full_name ? (
                  <OrderViewItem
                    title1="الإسم الكامل"
                    title2={
                      state.item?.full_name
                        ? state.item.full_name
                        : item_data?.full_name
                        ? item_data.full_name
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="phone_number *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[22].value &&
                  catID != 'Managing Zoom Account' &&
                  catID != 'Create/edit AD manager' &&
                  catID != 'VPN' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.phone_number.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="رقم الجوال *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            phone_number: e,
                            subjectErr: '',
                          })
                        }
                        value={state.phone_number}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.phone_number ? (
                  <OrderViewItem
                    title1="رقم الجوال"
                    title2={
                      state.item?.phone_number
                        ? state.item.phone_number
                        : item_data?.phone_number
                        ? item_data.phone_number
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="id *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[22].value &&
                  catID != 'Managing Zoom Account' &&
                  catID != 'Create/edit AD manager' &&
                  catID != 'VPN' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.id.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="الهوية *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            id: e,
                            subjectErr: '',
                          })
                        }
                        value={state.id}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.id ? (
                  <OrderViewItem
                    title1="الهوية"
                    title2={
                      state.item?.id
                        ? state.item.id
                        : item_data?.id
                        ? item_data.id
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="email_address *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[22].value &&
                  catID != 'Create/edit AD manager' &&
                  catID != 'VPN' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.email_address.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="البريد الإلكتروني *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            email_address: e,
                            subjectErr: '',
                          })
                        }
                        value={state.email_address}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.email_address ? (
                  <OrderViewItem
                    title1="البريد الإلكتروني"
                    title2={
                      state.item?.email_address
                        ? state.item.email_address
                        : item_data?.email_address
                        ? item_data.email_address
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="duration *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[22].value && catID == 'VPN' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.duration.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="المدة المطلوبة (أيام) *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            duration: e,
                            subjectErr: '',
                          })
                        }
                        value={state.duration}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.duration ? (
                  <OrderViewItem
                    title1="المدة(أشهر)"
                    title2={
                      state.item?.duration
                        ? state.item.duration
                        : item_data?.duration
                        ? item_data.duration
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[22].value && (
                <OrderViewItem
                  title1="extension_number *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[22].value &&
                  catID == 'Create/edit AD manager' ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.extension_number.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="رقم التحويلة *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            extension_number: e,
                            subjectErr: '',
                          })
                        }
                        value={state.extension_number}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.extension_number ? (
                  <OrderViewItem
                    title1="رقم التحويلة"
                    title2={
                      state.item?.extension_number
                        ? state.item.extension_number
                        : item_data?.extension_number
                        ? item_data.extension_number
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="email *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {sub1 == state.dropDown[23].value ? (
                  editableData ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.email.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="البريد الإلكتروني *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            email: e,
                            subjectErr: '',
                          })
                        }
                        value={state.email}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : item_data?.email ? (
                    <OrderViewItem
                      title1="email"
                      title2={
                        state.item?.email
                          ? state.item.email
                          : item_data?.email
                          ? item_data.email
                          : '--'
                      }
                      icon={require('../../assets/images/order/subject.png')}
                    />
                  ) : null
                ) : null}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="project_name *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {/* {(sub1 == state.dropDown[23].value ||
                (sub1 == state.dropDown[3].value &&
                  catID == 'consultant_contractor' &&
                  sub_catID == 'create_new_account')) && (
                <> */}
                {editableData ? (
                  sub1 == state.dropDown[23].value ||
                  (sub1 == state.dropDown[3].value &&
                    catID == 'consultant_contractor' &&
                    sub_catID == 'create_new_account') ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.project_name.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="إسم المشروع *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            project_name: e,
                            subjectErr: '',
                          })
                        }
                        value={state.project_name}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.project_name ? (
                  <OrderViewItem
                    title1="إسم المشروع"
                    title2={
                      state.item?.project_name
                        ? state.item.project_name
                        : item_data?.project_name
                        ? item_data.project_name
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}
                {/* </>
              )} */}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="project_date *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {/* {(sub1 == state.dropDown[23].value ||
                (sub1 == state.dropDown[3].value &&
                  catID == 'consultant_contractor' &&
                  sub_catID == 'create_new_account')) && (
                <> */}
                {editableData ? (
                  sub1 == state.dropDown[23].value ||
                  (sub1 == state.dropDown[3].value &&
                    catID == 'consultant_contractor' &&
                    sub_catID == 'create_new_account') ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.project_date.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="مدة المشروع (أشهر) *"
                        // placeholder="duration *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            project_date: e,
                            subjectErr: '',
                          })
                        }
                        value={state.project_date}
                        editable={editableData}
                        multiline={true}
                        // keyboardType="numeric"
                      />
                    </View>
                  ) : null
                ) : item_data?.project_date ? (
                  <OrderViewItem
                    title1="مدة المشروع (أشهر)"
                    title2={
                      state.item?.project_date
                        ? state.item.project_date
                        : item_data?.project_date
                        ? item_data.project_date
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}
                {/* </>
              )} */}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="is_the_project_registered *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {
                  editableData ? (
                    sub1 == state.dropDown[23].value ||
                    (sub1 == state.dropDown[3].value &&
                      catID == 'consultant_contractor' &&
                      sub_catID == 'create_new_account') ? (
                      <View
                        style={[
                          styles.dropdownContainer,
                          {
                            borderWidth: 0.5,
                            borderRadius: 8,
                            borderColor:
                              state.isValidated && !sub1 ? 'red' : 'white',
                          },
                        ]}
                      >
                        <CommonDropdown
                          itemData={[
                            { label: 'نعم', value: 'yes' },
                            { label: 'لا', value: 'no' },
                          ]}
                          onValueChange={(value, index) => {
                            if (index) {
                              setState({
                                ...state,
                                is_the_project_registered: value,
                                subjectErr: '',
                              });
                            } else {
                              setState({
                                ...state,
                                is_the_project_registered: '',
                                subjectErr: '',
                              });
                            }
                          }}
                          value={state.is_the_project_registered}
                          placeholderText={
                            'هل المشروع مسجل ضمن مكتب إدارة المشاريع؟ *'
                          }
                          disabled={!editableData}
                          isService
                        />
                      </View>
                    ) : null
                  ) : item_data?.is_the_project_registered ? (
                    <OrderViewItem
                      title1="هل المشروع مسجل ضمن مكتب إدارة المشاريع؟"
                      title2={
                        state.item?.is_the_project_registered
                          ? state.item.is_the_project_registered
                          : item_data?.is_the_project_registered
                          ? item_data.is_the_project_registered
                          : '--'
                      }
                      icon={require('../../assets/images/order/subject.png')}
                    />
                  ) : null
                  // )
                  // : null
                }

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="operating_company_name *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[23].value ||
                  (sub1 == state.dropDown[3].value &&
                    catID == 'consultant_contractor' &&
                    sub_catID == 'create_new_account') ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated &&
                            !state.operating_company_name.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="إسم الشركة المشغلة *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            operating_company_name: e,
                            subjectErr: '',
                          })
                        }
                        value={state.operating_company_name}
                        editable={editableData}
                        multiline={true}
                      />
                    </View>
                  ) : null
                ) : item_data?.operating_company_name ? (
                  <OrderViewItem
                    title1="إسم الشركة المشغلة"
                    title2={
                      state.item?.operating_company_name
                        ? state.item.operating_company_name
                        : item_data?.operating_company_name
                        ? item_data.operating_company_name
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="power *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
                {sub1 == state.dropDown[23].value && (
                  <>
                    {editableData ? (
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            borderColor:
                              state.isValidated && !state.power.length
                                ? 'red'
                                : 'white',
                          },
                        ]}
                      >
                        <CommonTextInput
                          customStyle={true}
                          customStyleData={[styles.input, { height: 40 }]}
                          placeholder="القوة *"
                          placeholderStyle={{
                            fontFamily: '29LTAzer-Regular',
                          }}
                          changeText={(e) =>
                            setState({
                              ...state,
                              power: e,
                              subjectErr: '',
                            })
                          }
                          value={state.power}
                          editable={editableData}
                          multiline={true}
                          keyboardType={'numeric'}
                        />
                      </View>
                    ) : (
                      <OrderViewItem
                        title1="power"
                        title2={state.item?.power ? state.item.power : '--'}
                        icon={require('../../assets/images/order/subject.png')}
                      />
                    )}
                  </>
                )}

                {/* {editableData && sub1 == state.dropDown[23].value && (
                <OrderViewItem
                  title1="members *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[3].value &&
                  (catID == 'emailing_group' || catID == 'shared_email') ? (
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          borderColor:
                            state.isValidated && !state.members.length
                              ? 'red'
                              : 'white',
                        },
                      ]}
                    >
                      <CommonTextInput
                        customStyle={true}
                        customStyleData={[styles.input, { height: 40 }]}
                        placeholder="الأعضاء *"
                        // placeholder="extension_number *"
                        placeholderStyle={{
                          fontFamily: '29LTAzer-Regular',
                        }}
                        changeText={(e) =>
                          setState({
                            ...state,
                            members: e,
                            subjectErr: '',
                          })
                        }
                        value={state.members}
                        editable={editableData}
                        multiline={true}
                        keyboardType="email-address"
                      />
                    </View>
                  ) : null
                ) : item_data?.members ? (
                  <OrderViewItem
                    title1="الأعضاء"
                    title2={item_data?.members ? item_data.members : '--'}
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* {editableData && sub1 == state.dropDown[3].value && (
                <OrderViewItem
                  title1="الإذن *"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}

                {editableData ? (
                  sub1 == state.dropDown[3].value &&
                  catID == 'manage_email_permission' ? (
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          borderWidth: 0.5,
                          borderRadius: 8,
                          borderColor:
                            state.isValidated && !sub1 ? 'red' : 'white',
                        },
                      ]}
                    >
                      <CommonDropdown
                        itemData={[
                          { label: 'إرسال ك', value: 'إرسال ك' },
                          {
                            label: 'إرسال نيابة أو صلاحية كاملة',
                            value: 'إرسال نيابة أو صلاحية كاملة',
                          },
                        ]}
                        onValueChange={(value, index) => {
                          setState({
                            ...state,
                            permission: value,
                            subjectErr: '',
                          });
                        }}
                        value={state.permission}
                        placeholderText={'الصلاحية *'}
                        disabled={!editableData}
                        isService
                      />
                    </View>
                  ) : null
                ) : item_data?.permission ? (
                  <OrderViewItem
                    title1="الصلاحية"
                    title2={
                      state.item?.permission
                        ? state.item.permission
                        : item_data?.permission
                        ? item_data.permission
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {editableData ? (
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          state.isValidated && !state.subject.length
                            ? 'red'
                            : 'white',
                      },
                    ]}
                  >
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={[styles.input, { height: height + 40 }]}
                      placeholder={
                        catID == 'Other' ? 'وصف الطلب *' : 'وصف الطلب'
                      }
                      placeholderStyle={{
                        fontFamily: '29LTAzer-Regular',
                      }}
                      changeText={(e) =>
                        setState({ ...state, subject: e, subjectErr: '' })
                      }
                      value={state.subject}
                      editable={editableData}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        setHeight(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                ) : item_data?.description ? (
                  <OrderViewItem
                    title1="الوصف"
                    title2={
                      state.item?.description
                        ? state.item.description
                        : item_data?.description
                        ? item_data.description
                        : '--'
                    }
                    icon={require('../../assets/images/order/subject.png')}
                  />
                ) : null}

                {/* omar 2 */}
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
                        {catID == 'request_preparing_presentations'
                          ? 'المرفقات *'
                          : 'المرفقات'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : attachments_loader ? (
                  <View>
                    <OrderViewItem
                      title1="المرفقات"
                      title2=""
                      icon={require('../../assets/images/order/attatchments.png')}
                    />
                    {/* <ActivityIndicator size="small" color="blue" /> */}
                    <Loader />
                  </View>
                ) : attachments && attachments.length > 0 ? (
                  <OrderViewAttatchment2
                    dispatch={dispatch}
                    accessToken={accessToken}
                    attatchments={attachments}
                  />
                ) : (
                  <OrderViewItem
                    title1="المرفقات"
                    title2="لا يوجد مرفق"
                    icon={require('../../assets/images/order/attatchments.png')}
                  />
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  marginTop: 10,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '80%',
                  }}
                >
                  {editableData ? (
                    <View>
                      <CommonFormButton
                        onPress={() => {
                          let reg =
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                          if (state.email && reg.test(state.email) === false) {
                            showMessage({
                              style: {
                                alignItems: 'flex-end',
                                fontFamily: '29LTAzer-Regular',
                              },
                              type: 'danger',
                              message: 'البريد الإلكترونى غير صالح',
                            });
                            return;
                          }
                          if (
                            state.members &&
                            reg.test(state.members) === false
                          ) {
                            showMessage({
                              style: {
                                alignItems: 'flex-end',
                                fontFamily: '29LTAzer-Regular',
                              },
                              type: 'danger',
                              message: 'حقل الأعضاء يقبل بريد إلكترونى فقط',
                            });
                            return;
                          }
                          setModal2(true);
                        }}
                        {...props}
                        disabled={isInActive}
                        style={{ marginVertical: 10 }}
                      />
                    </View>
                  ) : state.item && viewType === 'approval' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '80%',
                        alignSelf: 'center',
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: '45%' }}
                        onPress={rejectRequest}
                      >
                        <View style={styles.reject}>
                          <Text
                            style={{
                              fontFamily: '29LTAzer-Medium',
                              fontSize: 14,
                              textAlign: 'center',
                              color: '#FCFCFC',
                            }}
                          >
                            رفض
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ width: '45%' }}
                        onPress={() => setModal2(true)}
                      >
                        <View style={styles.accept}>
                          <Text
                            style={{
                              fontFamily: '29LTAzer-Medium',
                              fontSize: 14,
                              color: '#FCFCFC',
                              textAlign: 'center',
                            }}
                          >
                            قبول
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
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
          editableData ? submitRequest() : approveRequest();
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
                    customStyleData={[styles.input, { height: height }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
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

export default TechnicalRequestService;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
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
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 0.5,
    justifyContent: 'center',
    marginVertical: 5,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
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
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 0.5,
    justifyContent: 'center',
    marginVertical: 5,
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

  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 0.5,
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
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
    alignSelf: 'center',
  },
  accept: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#5CB366',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 8 : 4,
    marginVertical: 8,
  },
  reject: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E23636',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 8 : 4,
    marginVertical: 8,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
  },
});
