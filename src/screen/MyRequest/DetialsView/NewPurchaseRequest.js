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
  Switch,
  FlatList,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { default as Modal2, default as Modal3 } from 'react-native-modal';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import * as PurchaserequestActionPost from '../../../redux/action/PurchaseRequestAction';
import { baseUrl, getStatus } from '../../../services';
import { pick } from '../../../services/AttachmentPicker';
import { checkWeekend } from '../../../services/checkWeekend';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import ToggleSwitch from 'toggle-switch-react-native';
import { Checkbox } from 'react-native-paper';
let viewType = 'new';
let item = null;
const NewPurchaseRequest = (props) => {
  let { item, viewType } = props;
  // console.log('opsitem', item);
  const [loading, setLoading] = useState(false);

  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [checked, setChecked] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInActive, setIsInActive] = useState(true);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [dateMax, setDateMax] = useState('');
  const [state, setState] = useState({
    activeTab: 'operational',
    type: 'material',
    pusrchaseTypeDatastate: [],
    mPurchaseAttachmentTypes: [],
    attachmentType: [],
    purchaseSelected: '',
    notes: '',
    budget: 0,
    budgetRequest: '',
    showModal: false,
    showModal2: false,
    attachmentTypeData: [
      { title: 'other', arabicText: 'أخرى' },
      { title: 'samples', arabicText: 'عينات' },
      { title: 'specs', arabicText: 'مواصفات' },
      { title: 'rfp', arabicText: 'كراسة الشروط' },
    ],
    address: '',
    purchaseId: '',
    isAtt1Selected: false,
    isAtt2Selected: false,
    isAtt3Selected: false,
    isAtt4Selected: false,
    arrayData1: [],
    arrayData2: [],
    arrayData3: [],
    arrayData4: [],
    filename1: [],
    filename2: [],
    filename3: [],
    filename4: [],
    request_title: '',
    strategicPlanTypeData: [],
    strategicPlanTypeSelect: 0,
    strategic_plan_type_id: '',
    context: '',
    purchaseInitiativeTypeData: [],
    purchaseInitiativeTypeSelect: 0,
    purchase_initiative_id: '',
    purchaseProgramTypeData: [],
    purchaseProgramTypeSelect: 0,
    purchase_program_id: '',
    project_name: '',
    reason: null,
    isValidated: false,
    duration_project: 0,
    project_stages_ids: [],
    estimated_budget_per_year_ids: [],
    year: '',
    duration: '',
    dateoneErr: false,
    datetwoErr: false,
    descriptionErr: false,
    description: '',
    isVisible: false,
    chosenDate: '',
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
    endDateDisabled: true,

    // statPerYear: []
  });
  const [projectName, setProjectName] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [projectArray, setProjectArray] = useState([]);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [height3, setHeight3] = useState(40);
  const [height4, setHeight4] = useState(40);
  const [height5, setHeight5] = useState(40);
  const [initiativeId, setInitiativeId] = useState(0);
  const [programsId, setProgramsId] = useState(0);
  const [dropDownId, setDropDownId] = useState(0);
  const [active, setActive] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Purshase_Request_Screen');
    }
  }, [isFocused]);

  const handleConfirmone = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء اختيار يوم عمل',
      });
      return;
    }
    let a = moment(date).format('MM/DD/YYYY');
    const max = moment(a, 'DD-MM-YYYY').add(3, 'years').format('MM/DD/YYYY');
    setDateMax(max);
    setDate1(date);
    setDate2('');

    setState({
      ...state,
      date_start_project: a,
      date_end_project: '',
      duration_project: '1',
      visible2: false,
      endDateDisabled: false,
    });
  };
  const handleConfirmtwo = async (date) => {
    let isweekend = await checkWeekend(date);
    if (isweekend) {
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'الرجاء اختيار يوم عمل',
      });
      return;
    }
    let b = moment(date).format('MM/DD/YYYY');
    setState({ ...state, date_end_project: b, visible3: false });
    setDate2(date);
  };
  const handleConfirmthree = async (date) => {
    let b = moment(date).format('YYYY');
    setProjectDate(b);
    setState({ ...state, visible4: false });
  };

  useEffect(() => {
    if (date1 && date2) {
      let now = moment(date1); //todays date
      let end = moment(date2); // another date
      let duration = moment.duration(end.diff(now));
      let days = duration.asDays() + 1;
      let diff = Math.round(days).toString();
      setState({ ...state, duration_project: diff });
    }
  }, [date1, date2]);

  const submitHandler = () => {
    if (!projectName || !projectDate || !projectCost) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب ادخال جميع الحقول',
      });
      return;
    }

    setState({ ...state, showModal2: false });

    let project = {};
    project.key = new Date().valueOf();
    project.name = projectName;
    project.date = projectDate;
    project.cost = projectCost;
    projectArray.push(project);
    setProjectName('');
    setProjectDate('');
    setProjectCost('');
  };

  const ConvertToEnglishNumbers = (num) => {
    return num
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632;
      })
      .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776;
      });
  };

  useEffect(() => {
    if (inputs) {
      updateStat();
    }
  }, [inputs, inputs.length]);

  const updateStat = () => {
    var result = [];
    inputs.reduce(function (res, value) {
      if (!res[value.year]) {
        if (value.year && value.estimated_amount) {
          res[value.year] = { year: value.year, estimated_amount: 0.0 };
          result.push(res[value.year]);
        }
      }
      if (value.year && value.estimated_amount) {
        res[value.year].estimated_amount += parseFloat(value.estimated_amount);
      }
      return res;
    }, {});
    setState({
      ...state,
      estimated_budget_per_year_ids: result,
      project_stages_ids: inputs,
    });
  };
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const purchaseRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseRequestResponse,
  );
  const purchaseTypes = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseTypes,
  );
  const purchaseAttachmentTypes = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseAttachmentTypes,
  );
  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  /*Purchase Plan Type*/
  const strategicPlanTypes = useSelector(
    (state) => state.PurchaseTypeReducer.strategicPlanTypes,
  );

  const purchaseApprovedOrders = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseApprovedOrders,
  );

  useEffect(() => {
    dispatch(PurchaserequestActionPost.getStrategicPlanTypes(accessToken));
  }, []);

  useEffect(() => {
    if (typeof strategicPlanTypes === 'object' && strategicPlanTypes.length) {
      let data = [];
      strategicPlanTypes.map((item) => {
        data.push({
          value: item.id,
          label: item.display_name,
          initiative_ids: item.initiative_ids,
        });
      });
      setState({
        ...state,
        strategicPlanTypeData: data,
        strategicPlanTypeSelect: null,
      });
      dispatch(
        PurchaserequestActionPost.getPurchaseInitiativeTypes(
          accessToken,
          data[0].initiative_ids,
        ),
      );
    }
  }, [strategicPlanTypes]);

  const onSelectStrategicPlanTypes = (value, index) => {
    setDropDownId(index);
    setState({
      ...state,
      strategicPlanTypeSelect: value,
      strategic_plan_type_id: value,
    });
    if (index) {
      dispatch(
        PurchaserequestActionPost.getPurchaseInitiativeTypes(
          accessToken,
          state.strategicPlanTypeData[index - 1].initiative_ids,
        ),
      );
    }
  };

  /*Purchase Initiative Types*/
  const purchaseInitiativeTypes = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseInitiativeTypes,
  );
  useEffect(() => {
    if (
      typeof purchaseInitiativeTypes === 'object' &&
      purchaseInitiativeTypes.length
    ) {
      let data = [];
      purchaseInitiativeTypes.map((item) => {
        data.push({
          value: item.id,
          label: item.display_name,
          program_ids: item.program_ids,
        });
      });
      setState({
        ...state,
        purchaseInitiativeTypeData: data,
        purchaseInitiativeTypeSelect: null,
      });
      dispatch(
        PurchaserequestActionPost.getPurchaseProgramTypes(
          accessToken,
          data[0].program_ids,
        ),
      );
    }
  }, [purchaseInitiativeTypes]);

  const onSelectPurchaseInitiativeTypes = (value, index) => {
    setInitiativeId(index);
    setState({
      ...state,
      purchaseInitiativeTypeSelect: value,
      purchase_initiative_id: value,
    });
    if (index) {
      dispatch(
        PurchaserequestActionPost.getPurchaseProgramTypes(
          accessToken,
          state.purchaseInitiativeTypeData[index - 1].program_ids,
        ),
      );
    }
  };

  /*Purchase Program Type*/
  const purchaseProgramTypes = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseProgramTypes,
  );
  useEffect(() => {
    dispatch(PurchaserequestActionPost.getPurchaseAttachmentTypes(accessToken));
  }, []);
  useEffect(() => {
    if (
      typeof purchaseProgramTypes === 'object' &&
      purchaseProgramTypes.length
    ) {
      let data = [];
      purchaseProgramTypes.map((item) => {
        data.push({ value: item.id, label: item.display_name });
      });
      setState({
        ...state,
        purchaseProgramTypeData: data,
        purchaseProgramTypeSelect: null,
      });
    }
  }, [purchaseProgramTypes]);

  const onSelectPurchaseProgramTypes = (value, index) => {
    setProgramsId(index);
    setState({
      ...state,
      purchaseProgramTypeSelect: value,
      purchase_program_id: value,
    });
  };

  useEffect(() => {
    if (
      typeof purchaseAttachmentTypes === 'object' &&
      purchaseAttachmentTypes.length
    ) {
      setState({
        ...state,
        mPurchaseAttachmentTypes: purchaseAttachmentTypes,
      });
    }
  }, [purchaseAttachmentTypes]);
  useEffect(() => {
    if (typeof purchaseTypes === 'object' && purchaseTypes.length) {
      let data = [];
      purchaseTypes.map((item) => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.display_name,
        });
      });
      setState({
        ...state,
        pusrchaseTypeDatastate: data,
        purchaseSelected: null,
      });
    }
  }, [purchaseTypes]);

  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url =
          baseUrl +
          `/api/read/last_update?res_model=purchase.request&res_id=${item.id}`;
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
    if (props) {
      // item = props.route.params.item;
      // console.log('item purchase', item);
      setActive(item.under_put_method);

      let mActiveTab = 'operational';
      // viewType = props.route.params.viewType;
      if (true) {
        if (item.type === 'material') {
          mActiveTab = 'operational';
        } else if (item.type === 'direct_payment') {
          mActiveTab = 'direct';
        } else if (item.type === 'project') {
          mActiveTab = 'strategic';
        } else {
          mActiveTab = 'false';
        }
        //keys
        setState({
          ...state,
          activeTab: mActiveTab,
          description: item.description,
          budget: item.estimated_budget.toString(),
          notes: item.note,
          attachmentType: item.attachment_types,
          type: item.type,
          request_title: item.request_title,
          strategic_plan_type_id: item.strategic_plan_type_id[1],
          context: item.context,
          attachment_ids: item.attachment_ids,
          purchase_initiative_id: item.purchase_initiative_id[1],
          purchase_program_id: item.purchase_program_id[1],
          reason: item.reason ? item.refuse_reason : '',
          // key : item.key
          date_start_project: item.date_start_project
            ? item.date_start_project
            : null,
          date_end_project: date2 ? date2 : null,
          duration_project: item.duration_project ? item.duration_project : 0,
          project_stages_ids: item.project_stages_ids,
          cancel_reason: item.cancel_reason ? item.cancel_reason : '',
          purchase_request_description: item.purchase_request_description
            ? item.purchase_request_description
            : '',
        });
      }
      // console.log('aaaaaa', item);
    }
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
  const addFile = async () => {
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData4 = [...state.arrayData4];
        let filename4 = [...state.filename4];
        arrayData4.push(mFile);
        filename4.push({ name: mFile.name });
        setState({ ...state, arrayData4, filename4 });
      }
    } catch (err) {
      throw err;
    }
  };

  const removeRFPFile = (name) => {
    if (name) {
      let arrayData4 = [...state.arrayData4];
      let filename4 = [...state.filename4];
      let i = filename4.indexOf(name);
      if (i > -1) {
        arrayData4.splice(i, 1);
        filename4.splice(i, 1);
        setState({ ...state, arrayData4, filename4 });
      }
    }
  };

  useEffect(() => {
    if (state.activeTab === 'strategic' || state.activeTab === 'operational') {
      if (
        state.filename4.length > 0 &&
        // projectArray.length > 0 &&
        date1.length !== 0 &&
        date2.length !== 0 &&
        state.budget.length > 0 &&
        state.budget.length > -1 &&
        state.duration_project.length > 0 &&
        state.description.length > 0 &&
        dropDownId &&
        initiativeId &&
        programsId
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    }
    if (state.activeTab === 'direct') {
      if (
        state.description.length > 0 &&
        state.budget.length > 0 &&
        state.budget > -1 &&
        dropDownId
      ) {
        setIsInActive(false);
      } else {
        setIsInActive(true);
      }
    }
  }, [
    state,
    date1,
    date2,
    projectArray.length,
    dropDownId,
    initiativeId,
    programsId,
  ]);

  const handlePurchaseRequest = async () => {
    setChecked(false);
    if (isLoading) {
      return;
    }
    let sumAmount = projectArray.reduce((a, b) => a + Number(b.cost), 0);
    setState({ ...state, isValidated: true });
    let empID = await AsyncStorage.getItem('empID');
    let userId = await AsyncStorage.getItem('userid');
    let {
      // dateone,
      // datetwo,
      // duration,
      type,
      budget,
      description,
      notes,
      attachmentType,
      request_title,
      strategic_plan_type_id,
      context,
      purchase_initiative_id,
      purchase_program_id,
      duration_project,
      // date_start_project,
      // date_end_project,
      // project_stages_ids,
      // estimated_budget_per_year_ids,
      // year,
    } = state;

    projectArray.forEach((el) => {
      if (
        (state.activeTab === 'strategic' ||
          state.activeTab === 'operational') &&
        !(el.date >= moment(date1).year() && el.date <= moment(date2).year())
      ) {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message:
            'برجاء التثبت من التاريخ, يجب أن يكون بين تاريخ بداية و نهاية المشروع',
        });
        setModal2(false);

        return;
      }
    });
    let data = {
      accessToken: accessToken,
    };
    if (state.activeTab === 'direct' && !budget.length) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء ادخال التكاليف الإجمالية لكامل المشروع',
      });
      setModal2(false);

      return;
    }
    // if (state.activeTab === "direct" || state.activeTab === "operational" &&
    //   year < start && year != start && year > end && year != end
    // ) {
    //   showMessage({
    //     style: { alignItems: "flex-end", fontFamily: "29LTAzer-Regular" },
    //     type: "danger",
    //     message: "Please change the date"

    //   });
    //   return;
    // }

    if (
      (state.activeTab === 'strategic' || state.activeTab === 'operational') &&
      sumAmount != budget &&
      !active
    ) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب أن تكون الميزانية مساوية للتكلفة الاجمالية للمشروع',
      });
      setModal2(false);

      return;
    }

    if (
      // validation = required fields
      (state.activeTab === 'strategic' || state.activeTab === 'operational'
        ? duration_project > 0 && date1 && date2
        : true) &&
      type &&
      state.filename4.length > 0 &&
      description.length &&
      budget.length &&
      budget > -1 &&
      (state.activeTab === 'strategic' ? strategic_plan_type_id : true) &&
      (state.activeTab === 'direct' ? strategic_plan_type_id : true)
    ) {
      // type of request
      if (date1 && date2 && state.activeTab === 'operational') {
        let estimated_budget_per_year_ids_new = [];
        projectArray.forEach((el) => {
          let item = [0, 0, { year: el.date, estimated_amount: el.cost }];
          estimated_budget_per_year_ids_new.push(item);
        });
        let project_stages_ids_new = [];
        projectArray.forEach((el) => {
          let item = [
            0,
            0,
            {
              name: el.name,
              year: el.date,
              estimated_amount: el.cost,
            },
          ];
          project_stages_ids_new.push(item);
        });
        data['values'] = {
          employee_id: empID,
          // date_from: dateone,
          // date_to: datetwo,
          // duration: duration,
          type: type,
          description: description,
          estimated_budget: budget,
          attachment_types: [[6, 0, attachmentType]],
          note: notes,
          request_title: request_title,
          strategic_plan_type_id: strategic_plan_type_id,
          context: context,
          purchase_initiative_id: purchase_initiative_id,
          purchase_program_id: purchase_program_id,
          duration_project: duration_project,
          date_start_project: date1,
          date_end_project: date2,
          project_stages_ids: project_stages_ids_new,
          estimated_budget_per_year_ids: estimated_budget_per_year_ids_new,
          is_from_mobile: true,
          under_put_method: active ? true : false,
        };
      }

      if (date1 && date2 && state.activeTab === 'strategic') {
        let estimated_budget_per_year_ids_new = [];
        projectArray.forEach((el) => {
          let item = [0, 0, { year: el.date, estimated_amount: el.cost }];
          estimated_budget_per_year_ids_new.push(item);
        });
        let project_stages_ids_new = [];
        projectArray.forEach((el) => {
          let item = [
            0,
            0,
            {
              name: el.name,
              year: el.date,
              estimated_amount: el.cost,
            },
          ];
          project_stages_ids_new.push(item);
        });
        data['values'] = {
          // data to submit to form
          // date_from: dateone,
          // date_to: datetwo,
          // duration: duration,
          employee_id: empID,
          type: type,
          description: description,
          estimated_budget: budget,
          attachment_types: [[6, 0, attachmentType]],
          note: notes,
          request_title: request_title,
          strategic_plan_type_id: strategic_plan_type_id,
          context: context,
          purchase_initiative_id: purchase_initiative_id,
          purchase_program_id: purchase_program_id,
          duration_project: duration_project,
          date_start_project: date1,
          date_end_project: date2,
          project_stages_ids: project_stages_ids_new,
          estimated_budget_per_year_ids: estimated_budget_per_year_ids_new,
          is_from_mobile: true,
          under_put_method: active ? true : false,
        };
      }

      if (state.activeTab === 'direct') {
        data['values'] = {
          employee_id: empID,
          type: type,
          description: description,
          estimated_budget: budget,
          attachment_types: [[6, 0, attachmentType]],
          strategic_plan_type_id: strategic_plan_type_id,
          context: context,
          request_title: request_title,
          is_from_mobile: true,
        };
      }
      if (
        state.arrayData1 ||
        state.arrayData2 ||
        state.arrayData3 ||
        state.arrayData4
      ) {
        data['attachments'] = state.arrayData1
          .concat(state.arrayData2)
          .concat(state.arrayData3)
          .concat(state.arrayData4);
      }
      // console.log('data omar', data);
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(PurchaserequestActionPost.PurchaseRequestSubmit(data));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }
    setModal2(false);
  };
  useEffect(() => {
    try {
      if (purchaseRequestResponse) {
        if (
          typeof purchaseRequestResponse === 'object' &&
          purchaseRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyPurchaseRequest());
          setState({ ...state, showModal: true });
          // setTimeout(() => {
          //   setState({ ...state, showModal: false });
          // props.navigation.goBack();
          // }, 4000);
        } else if (
          typeof purchaseRequestResponse === 'object' &&
          Object.keys(purchaseRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyPurchaseRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: purchaseRequestResponse.message.replace('None', ''),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyPurchaseRequest());
    }
  }, [purchaseRequestResponse]);

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }
    if (groupIds.indexOf(21) > -1 && item.state === 'authority_owner') {
      mAction = 'action_contract_procurement';
    } else if (groupIds.indexOf(22) > -1 && item.state === 'authority_owner') {
      mAction = 'action_contract_procurement';
    } else if (groupIds.indexOf(95) > -1 && item.state === 'sm') {
      mAction = 'action_financial_audit';
    } else if (groupIds.indexOf(19) > -1 && item.state === 'dm') {
      mAction = 'action_management_strategy';
    }
    if (mAction) {
      let data = {
        id: item.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(PurchaserequestActionPost.approve(data, accessToken));
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
      dispatch(PurchaserequestActionPost.reject(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب تعبئة سبب الرفض',
      });
    }
  };

  function attachmentTypeSelected(mTypeId) {
    let mSelections = state.attachmentType;
    if (mSelections.indexOf(mTypeId) > -1) {
      mSelections.splice(mSelections.indexOf(mTypeId), 1);
      setState({ ...state, attachmentType: mSelections });
    } else {
      mSelections.push(mTypeId);
      setState({ ...state, attachmentType: mSelections });
    }
  }

  async function openDocument(attachmentIds) {
    checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      async (statuses) => {
        if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
            RESULTS.GRANTED ||
          Platform.OS === 'ios'
        ) {
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
                path: mDir + '/purchase/', // this is the path where your downloaded file will live in
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

  const toggleSwitch = () => {
    setActive((previousState) => !previousState);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('PurchaseOrderDetail', {
            RouteFrom: 'OrderPurchase',
          })
        }
        style={{
          width: '100%',
          height: hp('6.5%'),
          alignItems: 'center',
          flexDirection: 'row',
          borderColor: 'gray',
          borderWidth: 0.5,
        }}
      >
        <Text style={styles.itemLabel}> {item.title}</Text>
        <View
          style={{
            width: 0.5,
            height: hp('6.5%'),
            backgroundColor: 'gray',
          }}
        />
        <Text style={styles.itemLabel}> {item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.containerWidth}>
          <OrderViewItem
            title1="نوع الطلب"
            icon={require('../../../assets/images/order/type.png')}
          />
          <View
            style={[
              styles.container1,
              {
                borderColor: '#ffffff',
              },
            ]}
          >
            <TouchableOpacity
              disabled
              style={[
                styles.activeTab,
                {
                  backgroundColor:
                    state.activeTab == 'direct' ? '#008AC5' : '#ffffff',
                },
              ]}
              onPress={
                false
                  ? () =>
                      setState({
                        ...state,
                        activeTab: 'direct',
                        type: 'direct_payment',
                      })
                  : null
              }
            >
              <Text
                style={[
                  styles.activeTabText,
                  {
                    color: state.activeTab == 'direct' ? '#FCFCFC' : '#E4E4E4',
                  },
                ]}
                numberOfLines={1}
              >
                دفعة مباشرة
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              style={[
                styles.activeTab,
                {
                  backgroundColor:
                    state.activeTab == 'strategic' ? '#008AC5' : '#ffffff',
                },
              ]}
              onPress={
                false
                  ? () =>
                      setState({
                        ...state,
                        activeTab: 'strategic',
                        type: 'project',
                      })
                  : null
              }
            >
              <Text
                style={[
                  styles.activeTabText,
                  {
                    color:
                      state.activeTab == 'strategic' ? '#FCFCFC' : '#E4E4E4',
                  },
                ]}
                numberOfLines={1}
              >
                الخطة الإسترتيجية
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              style={[
                styles.activeTab,
                {
                  backgroundColor:
                    state.activeTab == 'operational' ? '#008AC5' : '#ffffff',
                },
              ]}
              onPress={
                false
                  ? () =>
                      setState({
                        ...state,
                        activeTab: 'operational',
                        type: 'material',
                      })
                  : null
              }
            >
              <Text
                style={[
                  styles.activeTabText,
                  {
                    color:
                      state.activeTab == 'operational' ? '#FCFCFC' : '#E4E4E4',
                    paddingLeft: 5,
                  },
                ]}
                numberOfLines={1}
              >
                تشغيلي
              </Text>
            </TouchableOpacity>
          </View>
          {
            state.activeTab == 'operational' ||
            state.activeTab == 'strategic' ? (
              <View style={styles.checkBoxContainer}>
                <View style={styles.checkBox}>
                  <ToggleSwitch
                    isOn={!active}
                    onColor="#EAEFF3"
                    offColor="#007598"
                    size="small"
                    onToggle={() => {
                      // if (editableData) toggleSwitch();
                    }}
                  />
                  <Text style={styles.checkBoxLabel}>إتفاقية إطارية</Text>
                </View>
                <Text style={styles.checkBoxTitle} numberOfLines={1}>
                  أسلوب الطرح
                </Text>
              </View>
            ) : null
            // ) : null
          }
          {active && state.activeTab !== 'work_order' ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <OrderViewItem
                title1="نوع الإتفاقية الإطارية"
                icon={require('../../../assets/images/order/type.png')}
              />
              <View
                style={[
                  styles.inputContainer,
                  {
                    width: '100%',
                    borderColor: '#e2e2e2',
                  },
                ]}
              >
                <CommonTextInput
                  customStyle={true}
                  placeholder="مغلقة"
                  customStyleData={[styles.input, { height: height }]}
                  editable={false}
                  multiline={true}
                />
              </View>
            </View>
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="رقم الطلب"
              title2={item['name']}
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
              title2={getStatus('Purchase', item.state)['statusText']}
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
          {true && item && item.cancel_reason ? (
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
            //  && viewType === "approval"
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
          {true && item && item.purchase_request_description ? (
            <OrderViewItem
              title1="الوصف"
              title2={item.purchase_request_description}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {state.activeTab !== 'work_order' ? (
            <OrderViewItem
              title1="الوصف"
              title2={item.description}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {state.activeTab === 'direct' && (
            <OrderViewItem
              title1={
                state.activeTab === 'direct' ? 'الميزانية المطلوبة' : null
              }
              title2={
                state.activeTab === 'direct'
                  ? state.budget
                    ? state.budget
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : ''
                  : null
              }
              icon={
                state.activeTab === 'direct'
                  ? require('../../../assets/images/order/money.png')
                  : null
              }
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}
          <View>
            {/* <OrderViewItem
                title1="نوع المرفقات"
                icon={require('../../../assets/images/order/type.png')}
              /> */}

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
              }}
            >
              {/* {state.mPurchaseAttachmentTypes && state.attachmentType
                  ? state.mPurchaseAttachmentTypes.map(item => {
                      return (
                        <TouchableOpacity
                          disabled
                          style={[
                            styles.attachmentBtn,
                            {
                              backgroundColor:
                                state.attachmentType.indexOf(item.id) > -1
                                  ? '#008AC5'
                                  : '#ffffff',
                            },
                          ]}
                          onPress={
                            editableData
                              ? () => {
                                  attachmentTypeSelected(item.id);
                                }
                              : null
                          }
                        >
                          <Text
                            style={{
                              color:
                                state.attachmentType.indexOf(item.id) > -1
                                  ? '#FCFCFC'
                                  : '#E4E4E4',
                              fontFamily: '29LTAzer-Regular',
                            }}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  : null} */}

              {state.activeTab !== 'work_order' ? (
                item.attachment_ids && item.attachment_ids.length > 0 ? (
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
                )
              ) : null}
            </View>
          </View>
          {state.activeTab === 'strategic' ||
            (state.activeTab === 'operational' && (
              <OrderViewItem
                title1="مخرجات الطلب"
                title2={state.notes ? state.notes : 'لا يوجد'}
                icon={require('../../../assets/images/order/arrows.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ))}
          {state.activeTab === 'strategic' ||
            state.activeTab === 'direct' ||
            (state.activeTab === 'operational' && (
              <OrderViewItem
                title1={
                  state.activeTab === 'direct' ? 'نوع الدفعة ' : 'نوع الخطة '
                }
                title2={item.strategic_plan_type_id[1]}
                icon={require('../../../assets/images/order/plan.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ))}
          {state.activeTab === 'strategic' ||
            (state.activeTab === 'operational' && (
              <OrderViewItem
                title1="اسم المبادرة /البرنامج  "
                title2={item.purchase_initiative_id[1]}
                icon={require('../../../assets/images/order/piority.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
            ))}
          <OrderViewItem
            title1="اسم المشروع "
            title2={
              item.purchase_program_id ? item.purchase_program_id[1] : '--'
            }
            icon={require('../../../assets/images/order/list.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          {/* <OrderDateViewItem
            title1="التاريخ "
            startDate={
              item?.date_start_project
                ? moment(item?.date_start_project).format('D-MM-Y')
                : '--'
            }
            icon={require('../../../assets/images/order/date.png')}
            endDate={
              item?.date_end_contract
                ? moment(item?.date_end_contract).format('D-MM-Y')
                : '--'
            }
            duration={item.duration_project ? item.duration_project : '0'}
          /> */}
          <OrderViewItem
            title1={
              state.activeTab === 'operational' ||
              state.activeTab === 'strategic'
                ? 'التكاليف ( التكلفة الاجمالية للمشروع)'
                : 'الميزانية المطلوبة'
            }
            title2={
              item.estimated_budget.toString()
                ? item.estimated_budget
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                : ''
            }
            icon={require('../../../assets/images/order/money.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
            hasIcon={true}
          />

          {item.reason && (
            <OrderViewItem
              title1="سبب الرفض"
              title2={item.refuse_reason ? item.refuse_reason : '-'}
              icon={require('../../../assets/images/order/id.png')}
            />
          )}
          {true && (
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
onPress={() => setState({ ...state, visible1: false })}
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
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default NewPurchaseRequest;

const styles = StyleSheet.create({
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#e2e2e2',
    borderWidth: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    textAlign: 'right',
    paddingRight: wp('2%'),
    // fontFamily: "29LTAzer-Regular",
    color: '#20547a',
  },

  activeTab: {
    width: '33%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: hp('1%'),
    justifyContent: 'center',
  },
  work_order: {
    width: '50%',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 30,
    paddingVertical: hp('1%'),
    justifyContent: 'center',
  },
  container1: {
    flexDirection: 'row',
    borderRadius: 30,
    // backgroundColor: 'white',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeTabText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  heading: {
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },
  containerWidth: {
    width: '90%',
    marginBottom: hp('2%'),
  },
  input: {
    // height: 60,
    textAlign: 'right',
    paddingRight: wp('2%'),
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
    // lineHeight:    hp("1.5%"),
    textAlignVertical: 'center',
    paddingVertical: 2,
  },
  attachmentBtn: {
    // width: "24%",
    paddingHorizontal: 10,
    borderRadius: 15,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    justifyContent: 'center',
    marginVertical: 5,
    lineHeight: 50,
  },
  viewerValueText: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
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
  dateText: {
    marginLeft: 15,
    marginTop: 0,
    textAlign: 'right',
    width: '85%',
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  checkBoxContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('1%'),
    marginTop: hp('1%'),
    justifyContent: 'center',
  },
  checkBoxTitle: {
    flex: 1,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('1.7%'),
    color: '#20547a',
  },
  checkBox: {
    width: '55%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    justifyContent: 'center',
  },
  checkBoxLabel: {
    flex: 1,
    textAlign: 'left',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('1.7%'),
    marginHorizontal: wp('2.6%'),
    color: 'gray',
  },
  label: {
    flex: 1,
    height: Platform.OS == 'ios' ? hp('2.5%') : null,
    color: 'white',
    fontWeight: '200',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: hp('2.6%'),
  },
  itemLabel: {
    flex: 1,
    color: 'gray',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: hp('2.4%'),
  },
  loadMore: {
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    marginTop: hp('2%'),
    fontSize: hp('2.5%'),
    color: '#20547a',
  },
});
