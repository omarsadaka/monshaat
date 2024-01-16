import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  VirtualizedList,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Swipeable from 'react-native-swipeable';
import { useDispatch, useSelector } from 'react-redux';
import CommonPopup from '../../components/CommonPopup';
import CommonReasonModal from '../../components/CommonReasonModal';
import * as mApprovalAction from '../../redux/action/ApprovalAction';
import * as CustodyAction from '../../redux/action/CustodyAction';
import * as homeMyRequestActions from '../../redux/action/homeMyRequestAction';
import * as leaveActions from '../../redux/action/leaveActions';
import * as leaveRequestActions from '../../redux/action/leaveRequestAction';
import * as loadingAction from '../../redux/action/loadingAction';
import * as MandateRequestActionPost from '../../redux/action/MandateRequestSubmitAction';
import * as PurchaserequestActionPost from '../../redux/action/PurchaseRequestAction';
import * as remoteWorkAction from '../../redux/action/remoteWorkAction';
import * as trainingActions from '../../redux/action/trainingAction';
import * as trainingRequestActions from '../../redux/action/trainingAction';
import * as hrActions from '../../redux/action/hrActions';
import { CERT_ACHIEVEMENT_CLEAR } from '../../redux/reducer/ApprovalReducer';
import {
  PAYMENT_ORDER_CLEAR,
  PURCHASE_ORDER_CLEAR,
} from '../../redux/reducer/ApprovalReducer';

import { PURCHASE_ADD_BUDGET_CLEAR } from '../../redux/reducer/ApprovalReducer';

import base64 from 'react-native-base64';
import { isProductionMode } from '../../services';
import { itsmBaseUrl } from '../../services';
import * as profileAction from '../../redux/action/profileAction';
import IconFe from 'react-native-vector-icons/Feather';
import Collapsible from 'react-native-collapsible';
import ContractOrderDetail from './DetialsView/ContractOrderDetail';
import NewLeaveRequest from './DetialsView/NewLeaveRequest';
import MandateRequest from './DetialsView/MandateRequest';
import TrainingRequest from './DetialsView/TrainingRequest';
import Resignation from './DetialsView/Resignation';
import PurchaseOrderDetail from './DetialsView/PurchaseOrderDetail';
import FormPaymentOrder from './DetialsView/FormPaymentOrder';
import FormCertAchievement from './DetialsView/FormCertAchievement';
import Rhletter from './DetialsView/Rhletter';
import FormInternalCourses from './DetialsView/FormInternalCourses';
import CustodyRequest from './DetialsView/CustodyRequest';
import LeaveRequest from './DetialsView/LeaveRequest';
import RemoteRequest from './DetialsView/RemoteRequest';
import CustodyClose from './DetialsView/CustodyClose';
import NewPurchaseRequest from './DetialsView/NewPurchaseRequest';
import TechnicalRequest from './DetialsView/TechnicalRequest';
import PopupActionOrder from './DetialsView/PopupActionOrder';
import FormPurchaseOrder from './DetialsView/FormPurchaseOrder';
import FormPurchaseAddBudget from './DetialsView/FormPurchaseAddBudget';
import TechnicalRequestService from './DetialsView/TechnicalRequestService';
import TechnicalRequestOld from './DetialsView/TechnicalRequestOld';
import moment from 'moment';

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
  var time = sign + hour + ':' + minute;

  return time;
}

const MyRequestList = (props) => {
  // console.log('props.requestDataList', props.requestDataList);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requestListData: [],
    statusText: '',
    reason: null,
    showModal: false,
  });
  const [selectedItem, setSelectedItem] = useState({});
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(true);
  const [itemClicked, setItemClicked] = useState();
  const flatlistRef = useRef(null);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const itsmToken = useSelector((state) => state.ProfileReducer.ITSMToken);

  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );

  const purchaseContractRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseContractRequestResponse,
  );
  const purchaseRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseRequestResponse,
  );
  const CustodyCloseResponse = useSelector(
    (State) => State.CustodyReducer.CustodyCloseResponse,
  );
  const CustodyResponse = useSelector(
    (State) => State.CustodyReducer.CustodyResponse,
  );
  const requestResponse = useSelector(
    (state) => state.ApprovalReducer.cretAchievementResponse,
  );
  const requestResponse2 = useSelector(
    (state) => state.ApprovalReducer.paymentOrderResponse,
  );
  const requestResponse3 = useSelector(
    (state) => state.ApprovalReducer.purchaseAddBudgetResponse,
  );
  const requestResponse4 = useSelector(
    (state) => state.ApprovalReducer.purchaseOrderResponse,
  );
  const leaveRequestResponse = useSelector(
    (state) => state.LeavePermissionReducer.leaveRequestResponse,
  );
  const mandateRequestResponse = useSelector(
    (state) => state.MandateTypeReducer.mandateRequestResponse,
  );
  const leaveVacationRes = useSelector(
    (state) => state.LeaveRequestReducer.leaveVacationRes,
  );
  const workOrderRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.workOrderRequestResponse,
  );
  const purchaseRequisitionRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseRequisitionRequestResponse,
  );
  const remoteWorkResponse = useSelector(
    (state) => state.RemoteWorkReducer.remoteWorkResponse,
  );
  const hrRequestResponse = useSelector(
    (state) => state.HrRequestReducer.hrRequestResponse,
  );
  const trainingRequestResponse = useSelector(
    (state) => state.TrainingReducer.trainingRequestResponse,
  );
  const hrPayslipRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.hrPayslipRequestResponse,
  );
  const hrPayslipRunRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.hrPayslipRunRequestResponse,
  );
  useEffect(() => {
    getToken();
  }, [itsmToken]);

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
    try {
      if (purchaseContractRequestResponse) {
        if (
          typeof purchaseContractRequestResponse === 'object' &&
          purchaseContractRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyContractRequest());
          setShowFinishModal(true);
        } else if (
          typeof purchaseContractRequestResponse === 'object' &&
          Object.keys(purchaseContractRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyContractRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: purchaseContractRequestResponse.message.replace(
              'None',
              '',
            ),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyContractRequest());
    }
    try {
      if (purchaseRequestResponse) {
        if (
          typeof purchaseRequestResponse === 'object' &&
          purchaseRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyPurchaseRequest());
          setShowFinishModal(true);
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

    if (
      typeof CustodyCloseResponse === 'object' &&
      CustodyCloseResponse.length
    ) {
      dispatch(CustodyAction.emptyCustodyCloseData());
      setShowFinishModal(true);
    } else if (
      typeof CustodyCloseResponse === 'object' &&
      Object.keys(CustodyCloseResponse).length
    ) {
      dispatch(CustodyAction.emptyCustodyCloseData());
      showMessage({
        type: 'danger',
        message: CustodyCloseResponse.message.replace('None', ''),
        style: styles.showMessage,
      });
    }
    if (typeof CustodyResponse === 'object' && CustodyResponse.length) {
      dispatch(CustodyAction.emptyCustodyData());
      setShowFinishModal(true);
    } else if (
      typeof CustodyResponse === 'object' &&
      Object.keys(CustodyResponse).length
    ) {
      dispatch(CustodyAction.emptyCustodyData());
      showMessage({
        type: 'danger',
        message: CustodyResponse.message.replace('None', ''),
        style: styles.showMessage,
      });
    }
    if (typeof requestResponse === 'object' && requestResponse.length) {
      dispatch({ type: CERT_ACHIEVEMENT_CLEAR, value: null });
      setShowFinishModal(true);
    } else if (
      typeof requestResponse === 'object' &&
      Object.keys(requestResponse).length
    ) {
      dispatch({ type: CERT_ACHIEVEMENT_CLEAR, value: null });
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: requestResponse.message.replace('None', ''),
      });
    }
    if (typeof requestResponse2 === 'object' && requestResponse2.length) {
      dispatch({ type: PAYMENT_ORDER_CLEAR, value: null });
      setShowFinishModal(true);
    } else if (
      typeof requestResponse2 === 'object' &&
      Object.keys(requestResponse2).length
    ) {
      dispatch({ type: PAYMENT_ORDER_CLEAR, value: null });
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: requestResponse2.message.replace('None', ''),
      });
    }
    if (typeof requestResponse3 === 'object' && requestResponse3.length) {
      dispatch({ type: PURCHASE_ADD_BUDGET_CLEAR, value: null });
      setShowFinishModal(true);
    } else if (
      typeof requestResponse3 === 'object' &&
      Object.keys(requestResponse3).length
    ) {
      dispatch({ type: PURCHASE_ADD_BUDGET_CLEAR, value: null });
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: requestResponse3.message.replace('None', ''),
      });
    }
    if (typeof requestResponse4 === 'object' && requestResponse4.length) {
      dispatch({ type: PURCHASE_ORDER_CLEAR, value: '' });
      setShowFinishModal(true);
    } else if (
      typeof requestResponse4 === 'object' &&
      Object.keys(requestResponse4).length
    ) {
      dispatch({ type: PAYMENT_ORDER_CLEAR, value: null });
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: requestResponse4.message.replace('None', ''),
      });
    }
    if (
      typeof leaveRequestResponse === 'object' &&
      leaveRequestResponse.length
    ) {
      dispatch(leaveActions.emptyLeavePermissionData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'success',
        message: 'قدمت بنجاح',
      });
      setShowFinishModal(true);
    } else if (
      typeof leaveRequestResponse === 'object' &&
      Object.keys(leaveRequestResponse).length
    ) {
      dispatch(leaveActions.emptyLeavePermissionData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: leaveRequestResponse.message.replace('None', ''),
      });
    }
    if (
      typeof mandateRequestResponse === 'object' &&
      mandateRequestResponse.length
    ) {
      dispatch(MandateRequestActionPost.emptyMandateRequest());
      setShowFinishModal(true);
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
    if (typeof leaveVacationRes === 'object' && leaveVacationRes.length) {
      dispatch(leaveRequestActions.emptyVacationData());
      setShowFinishModal(true);
    } else if (
      typeof leaveVacationRes === 'object' &&
      Object.keys(leaveVacationRes).length
    ) {
      dispatch(leaveRequestActions.emptyVacationData());
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: leaveVacationRes.message.replace('None', ''),
      });
    }

    try {
      if (workOrderRequestResponse) {
        if (
          typeof workOrderRequestResponse === 'object' &&
          workOrderRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
          setShowFinishModal(true);
        } else if (
          typeof workOrderRequestResponse === 'object' &&
          Object.keys(workOrderRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
          showMessage({
            style: {
              alignItems: 'flex-end',
              fontFamily: '29LTAzer-Regular',
            },
            type: 'danger',
            message: workOrderRequestResponse.message.replace('None', ''),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
    }

    try {
      if (purchaseRequisitionRequestResponse) {
        if (
          typeof purchaseRequisitionRequestResponse === 'object' &&
          purchaseRequisitionRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyRequisitionRequest());
          setShowFinishModal(true);
        } else if (
          typeof purchaseRequisitionRequestResponse === 'object' &&
          Object.keys(purchaseRequisitionRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyRequisitionRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: purchaseRequisitionRequestResponse.message.replace(
              'None',
              '',
            ),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyRequisitionRequest());
    }

    if (typeof remoteWorkResponse === 'object' && remoteWorkResponse.length) {
      dispatch(remoteWorkAction.emptyRemoteWorkData());
      setShowFinishModal(true);
    } else if (
      typeof remoteWorkResponse === 'object' &&
      Object.keys(remoteWorkResponse).length
    ) {
      dispatch(remoteWorkAction.emptyRemoteWorkData());
      showMessage({
        type: 'danger',
        message: remoteWorkResponse.message.replace('None', ''),
        style: { alignItems: 'flex-end' },
      });
    }

    if (typeof hrRequestResponse === 'object' && hrRequestResponse.length) {
      dispatch(hrActions.emptyHrData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'success',
        message: 'قدمت بنجاح',
      });
      setShowFinishModal(true);
    } else if (
      typeof hrRequestResponse === 'object' &&
      Object.keys(hrRequestResponse).length
    ) {
      dispatch(hrActions.emptyHrData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: hrRequestResponse.message.replace('None', ''),
      });
    }

    if (
      typeof trainingRequestResponse === 'object' &&
      trainingRequestResponse.length
    ) {
      dispatch(trainingRequestActions.emptyTrainingData());
      setShowFinishModal(true);
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
    try {
      if (hrPayslipRequestResponse) {
        if (
          typeof hrPayslipRequestResponse === 'object' &&
          hrPayslipRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyHrPaysRequest());
          setShowFinishModal(true);
        } else if (
          typeof hrPayslipRequestResponse === 'object' &&
          Object.keys(hrPayslipRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyHrPaysRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: hrPayslipRequestResponse.message.replace('None', ''),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyHrPaysRequest());
    }
    try {
      if (hrPayslipRunRequestResponse) {
        if (
          typeof hrPayslipRunRequestResponse === 'object' &&
          hrPayslipRunRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyHrPaysRunRequest());
          setShowFinishModal(true);
        } else if (
          typeof hrPayslipRunRequestResponse === 'object' &&
          Object.keys(hrPayslipRunRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyHrPaysRunRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: hrPayslipRunRequestResponse.message.replace('None', ''),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyHrPaysRunRequest());
    }
  }, [
    purchaseContractRequestResponse,
    purchaseRequestResponse,
    CustodyCloseResponse,
    CustodyResponse,
    requestResponse,
    requestResponse2,
    requestResponse3,
    requestResponse4,
    leaveRequestResponse,
    mandateRequestResponse,
    leaveVacationRes,
    workOrderRequestResponse,
    purchaseRequisitionRequestResponse,
    remoteWorkResponse,
    hrRequestResponse,
    trainingRequestResponse,
    hrPayslipRequestResponse,
    hrPayslipRunRequestResponse,
  ]);

  const convertExponentialToFloat = (x) => {
    var newValue = Number.parseFloat(x).toFixed(0);
    if (newValue == 0) return 0;
    else return Number.parseFloat(x).toFixed(0);
  };
  const handleMyRequest = (item) => {
    if (item.id == itemClicked) {
      setItemClicked('');
    } else {
      setItemClicked(item.id);
    }
  };

  const handleOpenDetails = (item) => {
    console.log('wwwwwwomar', item);

    let navigation = props.navigation;
    // navigation.navigate('SalaryMarches', {
    //   viewType: props.menu,
    // });
    // return;
    dispatch(homeMyRequestActions.EditableorNot(false));
    if (item.res_model === 'hr.holidays') {
      navigation.navigate('NewLeaveRequest', {
        comeFrom: 'MyRequest',
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'helpdesk.new') {
      navigation.navigate('TechnicalRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'helpdesk.service') {
      navigation.navigate('TechnicalRequestService', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.deputation') {
      navigation.navigate('MandateRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.authorization') {
      navigation.navigate('LeaveRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'helpdesk.ticket') {
      navigation.navigate('TechnicalRequestOld', { item: item });
    } else if (item.res_model === 'hr.distance.work') {
      navigation.navigate('RemoteRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'purchase.request') {
      navigation.navigate('NewPurchaseRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model == 'purchase.requisition') {
      props.navigation.navigate('PurchaseOrderDetail', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model == 'purchase.contract') {
      props.navigation.navigate('ContractOrderDetail', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model == 'work.order') {
      props.navigation.navigate('PopupActionOrder', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.training.request') {
      navigation.navigate('TrainingRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'payment.order') {
      navigation.navigate('FormPaymentOrder', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'purchase.order') {
      navigation.navigate('FormPurchaseOrder', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'purchase.add.budget') {
      navigation.navigate('FormPurchaseAddBudget', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'certificate.achievement') {
      navigation.navigate('FormCertAchievement', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'salary.identification.request') {
      navigation.navigate('Rhletter', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.resignation') {
      navigation.navigate('Resignations', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.training.public') {
      navigation.navigate('FormInternalCourses', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'manage.financial.custody') {
      navigation.navigate('CustodyRequest', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'manage.financial.custody.close') {
      navigation.navigate('CustodyClose', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.payslip') {
      navigation.navigate('SalaryMarches', {
        item: item,
        viewType: props.menu,
      });
    } else if (item.res_model === 'hr.payslip.run') {
      navigation.navigate('SalaryMarchesGroup', {
        item: item,
        viewType: props.menu,
      });
    }
  };

  const rejectRequest = (item) => {
    setReasonInputVisible(true);
    setSelectedItem(item);
  };

  const rejectConfirm = () => {
    let item = selectedItem;
    if (state.reason) {
      setReasonInputVisible(false);
      if (item.res_model === 'hr.holidays') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(leaveRequestActions.leaveReject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'hr.deputation') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(MandateRequestActionPost.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'hr.authorization') {
        let data = {
          id: item.id,
          reason: { reason: state.reason },
        };
        dispatch(leaveActions.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'helpdesk.ticket') {
      } else if (item.res_model === 'hr.distance.work') {
        let data = {
          id: item.id,
          reason: { reason: state.reason },
        };
        dispatch(remoteWorkAction.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'purchase.request') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(PurchaserequestActionPost.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      }
      // new
      else if (item.res_model === 'purchase.requisition') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(
          PurchaserequestActionPost.reject_purchaseRequisition(
            data,
            accessToken,
          ),
        );
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'purchase.contract') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(
          PurchaserequestActionPost.reject_purchaseCotract(data, accessToken),
        );
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'work.order') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(PurchaserequestActionPost.reject_workOrder(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'hr.payslip') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(
          PurchaserequestActionPost.reject_hr_payslip(data, accessToken),
        );
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'hr.payslip.run') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(
          PurchaserequestActionPost.reject_hr_payslip_run(data, accessToken),
        );
        dispatch(loadingAction.commonLoader(true));
      }
      // end
      else if (item.res_model === 'hr.training.request') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(trainingActions.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'payment.order') {
        let data = {
          id: item.id,
          reason: { reason: state.reason },
        };
        dispatch(mApprovalAction.rejectPaymentOrder(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'purchase.order') {
        let data = {
          id: item.id,
          reason: { reason: state.reason },
        };
        dispatch(mApprovalAction.rejectPurchaseOrder(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'purchase.add.budget') {
        let data = {
          id: item.id,
          reason: { reason: state.reason },
        };
        dispatch(mApprovalAction.rejectPurchaseAddBudget(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'certificate.achievement') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(mApprovalAction.rejectCertAchievement(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'hr.training.public') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.rejectInternalCourses(data, accessToken));
        setShowFinishModal(true);
      } else if (item.res_model === 'hr.resignation') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.rejectResignation(data, accessToken));
        setShowFinishModal(true);
      } else if (item.res_model === 'manage.financial.custody') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(CustodyAction.reject(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'manage.financial.custody.close') {
        let data = {
          id: item.id,
          reason: { refuse_reason: state.reason },
        };
        dispatch(CustodyAction.rejectCustodyClose(data, accessToken));
        dispatch(loadingAction.commonLoader(true));
      } else if (item.res_model === 'helpdesk.service') {
        rejectConfirmHelp_disk_servise();
        dispatch(loadingAction.commonLoader(true));
      }
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'سبب الرفض مطلوب',
      });
    }
  };
  const approveConfirm = (item) => {
    // setSelectedItem(item);
    setState({ ...state, showModal: true });
    setSelectedItem(item);
  };

  const approveRequest = async () => {
    setState({ ...state, showModal: false });

    let item = selectedItem;

    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (item.res_model === 'hr.holidays') {
      let data = {
        id: item['id'],
      };
      dispatch(leaveRequestActions.leaveApprove(data, accessToken));
      dispatch(loadingAction.commonLoader(true));
    } else if (item.res_model === 'hr.deputation') {
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
          id: item['id'],
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(MandateRequestActionPost.approve(data, accessToken));
      } else {
        showMessage({
          style: { alignItems: 'flex-end' },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'hr.authorization') {
      let data = {
        id: item.id,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(leaveActions.approve(data, accessToken));
    } else if (item.res_model === 'helpdesk.ticket') {
    } else if (item.res_model === 'hr.distance.work') {
      let data = {
        id: item.id,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(remoteWorkAction.approve(data, accessToken));
    } else if (item.res_model === 'purchase.request') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (groupIds.indexOf(21) > -1 && item.state === 'authority_owner') {
        mAction = 'action_contract_procurement';
      } else if (
        groupIds.indexOf(22) > -1 &&
        item.state === 'authority_owner'
      ) {
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    }
    // new
    else if (item.res_model === 'purchase.requisition') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (
        groupIds.indexOf(222) > -1 &&
        item.state === 'gm_financial_purchasing_department'
      ) {
        mAction = 'action_vp_hr_master';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
        mAction = 'action_hr_master';
      } else if (groupIds.indexOf(21) > -1 && item.state === 'hr_master') {
        mAction = 'button_confirm';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(
          PurchaserequestActionPost.approveـpurchaseRequisition(
            data,
            accessToken,
          ),
        );
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'purchase.contract') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (
        groupIds.indexOf(222) > -1 &&
        item.state === 'financial_purchasing_mgr'
      ) {
        mAction = 'action_financial_purchasing_mgr';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'validate') {
        mAction = 'action_validate';
      } else if (
        groupIds.indexOf(21) > -1 &&
        item.state === 'authority_owner'
      ) {
        mAction = 'action_authority_owner';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(
          PurchaserequestActionPost.approveـpurchaseContract(data, accessToken),
        );
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'work.order') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (
        groupIds.indexOf(222) > -1 &&
        item.state === 'gm_financial_purchasing_department'
      ) {
        mAction = 'action_requisition_gm_financial_purchasing_department';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
        mAction = 'button_requisition_confirm';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(
          PurchaserequestActionPost.approveـworkOrder(data, accessToken),
        );
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'hr.payslip') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (item.state === 'hrm') {
        mAction = 'action_send_to_vp_hr_master';
      } else if (item.state === 'vp_hr_master') {
        mAction = 'action_done';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(
          PurchaserequestActionPost.approve_hr_payslip(data, accessToken),
        );
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'hr.payslip.run') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
      if (item.state === 'hrm') {
        mAction = 'action_send_to_vp_hr_master';
      } else if (item.state === 'vp_hr_master') {
        mAction = 'action_done';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(
          PurchaserequestActionPost.approve_hr_payslip_run(data, accessToken),
        );
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    }
    // end
    else if (item.res_model === 'hr.training.request') {
      let mAction = null;
      let groupIds = await AsyncStorage.getItem('userGroup');
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }
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
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'payment.order') {
      if (groupIds) {
        groupIds = await JSON.parse(groupIds);
      }

      if (
        item.state === 'gm_financial_purchasing_department' &&
        groupIds.indexOf(222) > -1
      ) {
        mAction = 'action_his_authority';
      } else if (item.state === 'hr_master' && groupIds.indexOf(21) > -1) {
        mAction = 'action_done';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
        mAction = 'action_hr_master';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approvePaymentOrder(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'purchase.order') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }

      if (
        groupIds.indexOf(21) > -1 /*&& state.formData.state === 'hr_master'*/
      ) {
        mAction = 'button_confirm';
      } else if (
        groupIds.indexOf(22) > -1 /*&& state.formData.state === 'vp_hr_master'*/
      ) {
        mAction = 'action_hr_master';
      } else if (
        groupIds.indexOf(222) >
        -1 /*&& state.formData.state === 'gm_financial_purchasing_department'*/
      ) {
        mAction = 'action_vp_hr_master';
      }
      if (mAction) {
        let data = {
          id: state.formData.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approvePurchaseOrder(data, accessToken));
      }
    } else if (item.res_model === 'purchase.add.budget') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }

      if (
        groupIds.indexOf(21) > -1 /*&& item.state === 'authority_owner' */ &&
        item.award_budget > 500000
      ) {
        mAction = 'action_done';
      } else if (
        groupIds.indexOf(22) > -1 /*&& item.state === 'authority_owner'*/ &&
        item.award_budget <= 500000
      ) {
        mAction = 'action_done';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approvePurchaseAddBudget(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'certificate.achievement') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }

      if (groupIds.indexOf(95) > -1) {
        mAction = 'action_done';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approveCertAchievement(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'hr.training.public') {
      if (groupIds) {
        groupIds = JSON.parse(groupIds);
      }

      if (groupIds.indexOf(95) > -1) {
        mAction = 'action_done';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approveInternalCourses(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'hr.resignation') {
      if (groupIds) {
        groupIds = await JSON.parse(groupIds);
      }

      if (groupIds.indexOf(20) > -1 && state.formData.state === 'disclaimer') {
        mAction = 'action_disclaimer';
      } else if (groupIds.indexOf(95) > -1 && state.formData.state === 'hrm') {
        mAction = 'action_hrm';
      } else if (groupIds.indexOf(19) > -1 && state.formData.state === 'sm') {
        mAction = 'action_sm';
      }

      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(mApprovalAction.approveResignation(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'manage.financial.custody') {
      if (groupIds) {
        groupIds = await JSON.parse(groupIds);
      }
      if (groupIds.indexOf(19) > -1 && item.state === 'dm') {
        mAction = 'action_dm';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
        mAction = 'action_vp_hr_master';
      } else if (groupIds.indexOf(21) > -1 && item.state === 'hr_master') {
        mAction = 'action_hr_master';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(CustodyAction.approve(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'manage.financial.custody.close') {
      if (groupIds) {
        groupIds = await JSON.parse(groupIds);
      }
      if (groupIds.indexOf(19) > -1 && item.state === 'dm') {
        mAction = 'action_dm';
      } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
        mAction = 'action_vp_hr_master';
      }
      if (mAction) {
        let data = {
          id: item.id,
          action: mAction,
        };
        dispatch(loadingAction.commonLoader(true));
        dispatch(CustodyAction.approveCustodyClose(data, accessToken));
      } else {
        showMessage({
          style: {
            alignItems: 'flex-end',
            fontFamily: '29LTAzer-Regular',
          },
          type: 'danger',
          message: 'ليس لديك الإذن',
        });
      }
    } else if (item.res_model === 'helpdesk.service') {
      approveRequestHelp_disk_servise();
      dispatch(loadingAction.commonLoader(true));
    }
  };

  const approveRequestHelp_disk_servise = async () => {
    setState({ ...state, showModal: false });
    let item = selectedItem;
    dispatch(loadingAction.commonLoader(true));
    let url = `${itsmBaseUrl}approve_reject_request`;
    let body = {
      request_number: item.id,
      approver_email: userProfileData[0].work_email,
      approval_state: 'approved',
      rejection_reason: '',
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
        dispatch(loadingAction.commonLoader(false));
      })
      .catch((err) => {
        dispatch(loadingAction.commonLoader(false));
      });
  };

  const rejectConfirmHelp_disk_servise = () => {
    setState({ ...state, showModal: false });
    let item = selectedItem;
    dispatch(loadingAction.commonLoader(true));
    let url = 'approve_reject_request';
    let body = {
      request_number: item.id,
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
        dispatch(loadingAction.commonLoader(false));
      })
      .catch((err) => {});
  };

  const Wraper = useCallback(
    (props) => {
      return props.approval == 'approval' ? (
        <Swipeable
          rightButtons={!props.isAllOrders ? Buttons(props.item) : null}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // if (!(props.isAllOrders && props.approval == 'approval'))
              handleOpenDetails(props.item);
            }}
          >
            {props.children}
          </TouchableOpacity>
        </Swipeable>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!(props.isAllOrders && props.approval == 'approval'))
              // handleMyRequest(props.item);
              handleOpenDetails(props.item);
            if (!props.isAllOrders && props.index == 2) {
              flatlistRef.current.scrollToIndex({
                animated: true,
                index: props.index,
              });
            }
          }}
        >
          {props.children}
        </TouchableOpacity>
      );
    },
    [Buttons],
  );
  function Buttons(item) {
    let btns = new Array();
    btns.push(
      <TouchableOpacity
        onPress={() => rejectRequest(item)}
        style={styles.rightContainer}
      >
        <Text style={styles.rightText}>رفض</Text>
      </TouchableOpacity>,
    );
    btns.push(
      <TouchableOpacity
        onPress={() => approveConfirm(item)}
        style={styles.leftContainer}
      >
        <Text style={styles.leftText}>موافقة</Text>
      </TouchableOpacity>,
    );

    return btns;
  }

  const renderRequestList = (item, index) => {
    let statusText = '';
    let statusColor = '#008AC5';
    let viewItem = {
      status: null,
      lineOne: item?.id,
      lineTwo: null,
      lineThree: null,
      addLineOne: null,
      lineDescription: null,
      lineDescription2: null,
    };
    // hr.training.request
    if (item?.res_model === 'hr.holidays') {
      switch (item?.state) {
        case 'draft':
          // statusText = "طلب";
          // statusColor = "#F39C12";
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'hrm':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'cutoff':
          statusText = 'مقطوع';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'confirm':
          statusText = 'للاعتماد';
          statusColor = '#008AC5';
          break;
        case 'validate1':
          statusText = 'الموافقة الثانية';
          statusColor = '#008AC5';
          break;
        case 'validate':
          statusText = 'مقبول';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item?.name;
      viewItem.lineThree = Moment(item?.date).format('DD-MM-YYYY');
      viewItem.lineDescription =
        ' من ' +
        item?.date_from +
        ' الى ' +
        item?.date_to +
        `  لمدة ${item?.duration} أيام`;
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item?.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item?.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item?.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item?.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        if (
          item?.employee_id[1].length >= 30 ||
          item?.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = item.holiday_status_id
          ? item?.holiday_status_id[1] + ' لـ' + name0
          : null;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = item.holiday_status_id
          ? item?.holiday_status_id[1]
          : null;
      }
    } else if (item?.res_model === 'salary.identification.request') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'hrm':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'تم طباعة';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'cutoff':
          statusText = 'مقطوع';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'confirm':
          statusText = 'للاعتماد';
          statusColor = '#008AC5';
          break;
        case 'validate1':
          statusText = 'الموافقة الثانية';
          statusColor = '#008AC5';
          break;
        case 'validate':
          statusText = 'مقبول';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.number;
      viewItem.lineThree = Moment(item.create_date).format('DD-MM-YYYY');
      viewItem.lineDescription = item.destination
        ? `مسمي الجهة : ${item.destination}`
        : '--';
      if (props.menu === 'myRequest') {
        viewItem.lineTwo = 'خطاب موارد بشرية';
      }
    } else if (item?.res_model === 'hr.resignation') {
      switch (item.state) {
        case 'employee':
          statusText = 'موظف';
          statusColor = '#008AC5';
          break;
        case 'human':
          statusText = 'مسؤول الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'gm_humain':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'hrm':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'منتهي';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'cutoff':
          statusText = 'مقطوع';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'confirm':
          statusText = 'للاعتماد';
          statusColor = '#008AC5';
          break;
        case 'validate1':
          statusText = 'الموافقة الثانية';
          statusColor = '#008AC5';
          break;
        case 'validate':
          statusText = 'مقبول';
          statusColor = '#5FDD6D';
          break;
        case 'disclaimer':
          statusText = 'إخلاء طرف';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = 'إستقالة';
      viewItem.lineDescription = Moment(item.date).format('DD-MM-YYYY');
      if (props.menu === 'myRequest') {
        viewItem.lineTwo = 'إستقالة';
      }
      // viewItem.lineTwo = "طلب إستقالة ل" + item.employee_id[1];
      else {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = 'طلب إستقالة لـ' + name0;
      }
    } else if (item?.res_model === 'hr.deputation') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'audit':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'humain':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'gm_humain':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'confirm':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'done_ticket':
          statusText = 'معتمد و تم حجز التذكرة';
          statusColor = '#008AC5';
          break;
        case 'pending':
          statusText = 'تحت الإجراء';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'معتمد و تم امر الصرف';
          statusColor = '#5FDD6D';
          break;
        case 'finish':
          statusText = 'منتهي';
          statusColor = '#DD4B39';
          break;
        case 'cancelled':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'cutoff':
          statusText = 'مقطوع';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.seq_number;
      viewItem.lineThree = Moment(item.order_date).format('DD-MM-YYYY');
      viewItem.lineDescription =
        ' من ' + item.date_from + ' الى ' + item.date_to;
      let type = null;
      if (item.type) {
        type = item.type === 'internal' ? 'انتداب داخلي' : 'انتداب خارجي';
      }
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = type + ' لـ' + name0;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = type;
      }
    } else if (item?.res_model === 'hr.authorization') {
      switch (item.state) {
        case 'new':
          // statusText = "طلب";
          // statusColor = "#F39C12";
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'hrm':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.name;
      viewItem.lineDescription =
        'في يوم: ' +
        item.date +
        ' ' +
        (item.all_day
          ? 'كامل اليوم'
          : 'من الساعة ' +
            convertNumToTime(item.hour_from) +
            ' إلى ' +
            convertNumToTime(item.hour_to));
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = item.type_id
          ? item.type_id[1].split(']')[1] + ' لـ' + name0
          : null;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = item.type_id ? item.type_id[1].split(']')[1] : null;
      }
      viewItem.lineThree = Moment(item.create_date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'helpdesk.ticket') {
      if (item.stage_id) {
        switch (item.stage_id[1]) {
          case 'مع فريق التواصل':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'مع فريق المرافق':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'مع فريق المعمل':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'طلبات مؤجلة':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'بإنتظار العميل':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'طلبات غير تقنية':
            statusText = item.stage_id[1];
            statusColor = '#5FDD6D';
            break;
          case 'جديدة':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'تحت الاجراء':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'بانتظار المستخدم':
            statusText = item.stage_id[1];
            statusColor = '#008AC5';
            break;
          case 'تم حل الطلب':
            statusText = item.stage_id[1];
            statusColor = '#5FDD6D';
            break;
          case 'تم الالغاء':
            statusText = item.stage_id[1];
            statusColor = '#DD4B39';
            break;
          default:
            statusText = item.stage_id[1];
            statusColor = '#727572';
            break;
        }
      }
      let val = item.id;

      // viewItem.lineTwo = item.name ? item.name : null;
      viewItem.lineTwo = 'طلب مركز الطلبات والدعم رقم' + ' ' + val;
      viewItem.lineDescription = Moment(item.open_date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'hr.distance.work') {
      switch (item.state) {
        case 'draft':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'humain':
          statusText = 'عمليات الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.name;
      viewItem.lineDescription =
        ' من ' +
        item.date_from +
        ' الى ' +
        item.date_to +
        '  لمدة ' +
        (item.duration ? item.duration + ' يوم' : null);
      // var prefixForLineTwo = 'عمل عن بعد لمدة: ';
      var prefixForLineTwo = 'عمل عن بعد';
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = prefixForLineTwo;
        // +
        // (item.duration ? item.duration + ' يوم' : null) +
        // ' لـ' +
        // name0;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = prefixForLineTwo;
        // + (item.duration ? item.duration + ' يوم' : null);
      }

      viewItem.lineThree = Moment(item.create_date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'purchase.request') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'management_strategy':
          statusText = 'مشرف القطاع في ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'dmanagement_strategy_mgr':
          statusText = 'مدير مكتب ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'financial_audit':
          statusText = 'مدقق مالي';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'ادارة المالية';
          statusColor = '#008AC5';
          break;
        case 'authority_owner':
          statusText = 'صاحب الصلاحية';
          statusColor = '#008AC5';
          break;
        case 'contract_procurement':
          statusText = 'ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'waiting':
          statusText = 'طلب توضيح';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancelled':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'under_put':
          statusText = 'تحت الطرح';
          statusColor = '#008AC5';
          break;
        case 'receiving_offers':
          statusText = 'إستلام العروض';
          statusColor = '#008AC5';
          break;
        case 'technical_analysis':
          statusText = 'التحليل الفني';
          statusColor = '#008AC5';
          break;
        case 'check_offers':
          statusText = 'فحص العروض';
          statusColor = '#008AC5';
          break;
        case 'awarding_baptism':
          statusText = 'الترسية/التعميد';
          statusColor = '#008AC5';
          break;
        case 'purchase_order':
          statusText = 'أمر الشراء المبدئي';
          statusColor = '#008AC5';
          break;
        case 'purchase_requisition':
          statusText = 'اتفاقية الشراء';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.name;

      var type =
        item.type === 'project'
          ? 'الخطة الإستراتجية'
          : item.type === 'material'
          ? '‫تشغيلي‬'
          : 'دفعة مباشرة';
      var val = item.estimated_budget
        ? item.estimated_budget
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : null;
      var prefixForLineTwo = type + ' بقيمة: ' + val + ' ريال';
      viewItem.lineDescription = prefixForLineTwo;
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = 'طلب شراء لـ' + ' ' + name0;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = item.description ? item.description : null;
      }
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'payment.order') {
      switch (item.state) {
        case 'prepare':
          statusText = 'اعداد';
          statusColor = '#F39C12';
          break;
        case 'account_manager':
          statusText = 'مدير المحاسبة';
          statusColor = '#008AC5';
          break;
        case 'review':
          statusText = 'مراجعة الميزانية';
          statusColor = '#008AC5';
          break;
        case 'financial_manager':
          statusText = 'مدير الإدارة المالية';
          statusColor = '#008AC5';
          break;
        case 'gm_financial_purchasing_department':
          statusText = 'مدير عام الإدارة المالية و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'financial_observer':
          statusText = 'المراقب المالي';
          statusColor = '#008AC5';
          break;
        case 'his_authority':
          statusText = 'صاحب الصلاحية';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'payment_supervisor':
          statusText = 'مشرف مدفوعات';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#008AC5';
          break;
      }
      //   viewItem.lineOne = item.number ? item.number : null;
      //   viewItem.lineTwo = item.purpose ? item.purpose : null;
      //   viewItem.lineThree = item.payment_amount ? item.payment_amount : null;
      //   viewItem.addLineOne = Moment(item.date).format("DD-MM-YYYY");

      viewItem.lineOne = item.number ? item.number : null;
      var val = item.payment_amount
        ? item.payment_amount
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : null;
      viewItem.lineDescription =
        'القيمة: ' +
        val +
        ' ' +
        (item.currency_id ? item.currency_id[1] : null);
      viewItem.lineTwo = item.purpose ? ' أمر صرف  ' + item.purpose : '-';
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'purchase.order') {
      switch (item.state) {
        case 'draft':
          statusText = ' طلب شراء مبدئي';
          statusColor = '#F39C12';
          break;
        case 'sent':
          statusText = ' تم إرسال طلب الشراء المدئي';
          statusColor = '#008AC5';
          break;
        case 'to_approve':
          statusText = ' للموافقة';
          statusColor = '#008AC5';
          break;
        case 'to approve':
          statusText = ' للموافقة';
          statusColor = '#008AC5';
          break;
        case 'purchase_manager':
          statusText = 'مدير المشتريات';
          statusColor = '#008AC5';
          break;
        case 'manager_contracts_purchasing_department':
          statusText = ' مدير إدارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'gm_financial_purchasing_department':
          statusText = 'مدير عام الإدارة المالية و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = ' نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'purchase':
          statusText = 'أمر شراء';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'مغلق';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'رفض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      //   viewItem.lineOne = item.name ? item.name : null;
      //   viewItem.lineTwo = item.tender_name ? item.tender_name : null;
      //   viewItem.lineThree = item.award_amount ? item.award_amount : null;
      //   viewItem.addLineOne = Moment(item.date_order).format("DD-MM-YYYY");
      viewItem.lineOne = item.name ? item.name : null;
      var val = item.award_amount //convertExponentialToFloat()
        ? convertExponentialToFloat(item.award_amount)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : '--';
      viewItem.lineDescription = 'مبلغ الترسية: ' + val + ' ريال';
      viewItem.lineTwo = item.tender_name ? item.tender_name : '-';
      viewItem.lineThree = Moment(item.date_order).format('DD-MM-YYYY');
    } else if (item?.res_model === 'hr.training.request') {
      switch (item.state) {
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'training':
          statusText = 'قسم التدريب';
          statusColor = '#008AC5';
          break;
        case 'audit':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'gm_humain':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'confirm':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'confirm_center':
          statusText = 'اعتماد المعهد';
          statusColor = '#008AC5';
          break;
        case 'done_ticket':
          statusText = 'معتمد وتم حجز التذكرة';
          statusColor = '#008AC5';
          break;
        case 'pending':
          statusText = 'تحت الإجراء';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'معتمد و تم امر الصرف';
          statusColor = '#5FDD6D';
          break;
        case 'cancelled':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'Requested':
          statusText = 'مطلوب';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      //   viewItem.lineTwo = item.name ? item.name : null;
      //   viewItem.lineThree = Moment(item.date).format("DD-MM-YYYY");
      viewItem.lineOne = item.number;
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
      viewItem.lineDescription =
        ' من ' + item.date_from + ' الى ' + item.date_to;
      let type = null;
      if (item.type) {
        type = item.type === 'local' ? 'تدريب داخلي' : 'تدريب خارجي';
      }
      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
          ' ' +
          item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.employee_id[1].length >= 30 ||
          item.employee_id[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = type + ' لـ' + name0;
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = type;
      }
    } else if (item?.res_model === 'purchase.add.budget') {
      switch (item.state) {
        case 'draft':
          statusText = ' طلب شراء مبدئي';
          statusColor = '#F39C12';
          break;
        case 'financial_audit':
          statusText = 'المدقق المالي';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'مدير المالية';
          statusColor = '#008AC5';
          break;
        case 'authority_owner':
          statusText = 'صاحب الصلاحية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'مغلق';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.number ? item.number : null;
      var val = item.award_budget
        ? item.award_budget.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : ' ';
      viewItem.lineDescription = 'مبلغ الترسية: ' + val + ' ريال';
      viewItem.lineTwo = item.add_budget_reason ? item.add_budget_reason : '-';
      viewItem.lineThree = Moment(item.create_date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'certificate.achievement') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'sector_project_management':
          statusText = 'مشرف القطاع في ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'project_management_office':
          statusText = 'مكتب ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.number ? item.number : null;
      viewItem.lineTwo = 'طلب شهادة إنجاز';

      var val = convertExponentialToFloat(item.payment_amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      viewItem.lineDescription = 'القيمة: ' + val + ' ريال';
      // viewItem.lineTwo = item.payment_name ? item.payment_name : null;
      // title="شهادة انجاز"
      // item.payment_name ? item.payment_name : null;

      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'certificate.achievement') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'sector_project_management':
          statusText = 'مشرف القطاع في ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'project_management_office':
          statusText = 'مكتب ادارة المشاريع';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.number ? item.number : null;
      viewItem.lineTwo = 'طلب شهادة إنجاز';

      var val = convertExponentialToFloat(item.payment_amount).toString();
      viewItem.lineDescription = 'القيمة: ' + val + ' ريال';
      // viewItem.lineTwo = item.payment_name ? item.payment_name : null;
      // title="شهادة انجاز"
      // item.payment_name ? item.payment_name : null;

      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'hr.training.public') {
      switch (item.state) {
        case 'draft':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'candidate':
          statusText = 'الترشح';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'gm_humain':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        case 'training':
          statusText = 'قسم التدريب';
          statusColor = '#008AC5';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;

        case 'confirm':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'done':
          statusText = 'منتهي';
          statusColor = '#5FDD6D';
          break;
      }
      let name0 = null;
      let name1 =
        item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
        ' ' +
        item.employee_id[1].split(']')[1].split(' ').slice(-1).join(' ');
      let name2 =
        item.employee_id[1].split(']')[1].split(' ').slice(0, 2).join(' ') +
        ' ' +
        item.employee_id[1].split(']')[1].split(' ').slice(-2).join(' ');
      if (
        item.employee_id[1].length >= 30 ||
        item.employee_id[1].length <= 27
      ) {
        name0 = name1;
      } else {
        name0 = name2;
      }
      viewItem.lineTwo =
        props.menu === 'approval'
          ? 'الدورة الداخلية ل' + name0
          : 'الدورة الداخلية ';

      viewItem.lineDescription =
        ' من ' + item.date_from + ' الى ' + item.date_to;
    } else if (item?.res_model === 'manage.financial.custody') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'مدير الإدارة المالية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'closed':
          statusText = 'اقفال';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام الإدارة المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.name;
      viewItem.lineThree = Moment(item.order_date).format('DD-MM-YYYY');
      viewItem.lineDescription = `قيمة العهدة ${item.custody_amount}`;
      viewItem.lineTwo =
        item.custody_type === 'temporary'
          ? 'نوع العهدة: مؤقتة'
          : 'نوع العهدة: دائمة';
    } else if (item?.res_model === 'manage.financial.custody.close') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'مدير الإدارة المالية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'closed':
          statusText = 'اقفال';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام الإدارة المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }
      viewItem.lineOne = item.close_name;
      viewItem.lineThree = Moment(item.custody_order_date).format('DD-MM-YYYY');
      viewItem.lineDescription = `قيمة العهدة ${item.custody_amount}`;
      viewItem.lineTwo = 'طلب إستعاضة/إغلاق عهدة';
    } else if (item?.res_model === 'helpdesk.new') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        // case 'New':
        //   statusText = 'جديد';
        //   statusColor = '#008AC5';
        //   break;
        case 'جديد':
          statusText = 'جديد';
          statusColor = '#008AC5';
          break;
        case 'Pending':
          statusText = 'تحت الإجراء';
          statusColor = '#008AC5';
          break;
        case 'In Progress':
          statusText = 'قيد التنفيذ';
          statusColor = '#008AC5';
          break;
        case 'قيد الإنتظار':
          statusText = 'قيد الإنتظار';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'مدير الإدارة المالية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'Canceled':
          statusText = 'ملغية';
          statusColor = '#DD4B39';
          break;
        case 'تم الحل':
          statusText = 'تم الحل';
          statusColor = 'green';
          break;
        case 'مغلقة':
          statusText = 'مغلقة';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام الإدارة المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ';
          statusColor = '#5FDD6D';
          break;
        default:
          statusText = item.state;
          statusColor = '#008AC5';
          break;
      }
      viewItem.lineOne = `${item.id}`; //item.name;
      viewItem.lineThree = Moment(item.custody_order_date).format('DD-MM-YYYY');
      viewItem.lineDescription = `الوصف: ${item.IncidentDescription}`;
      viewItem.lineTwo = `التصنيف: ${item.category}`;
      // viewItem.lineTwo = `${item.id}`;
    } else if (item?.res_model === 'helpdesk.service') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'New':
          statusText = 'طلب جديد';
          statusColor = '#008AC5';
          break;
        case 'In Progress':
          statusText = 'قيد التنفيذ';
          statusColor = '#008AC5';
          break;
        case 'Work In Progress':
          statusText = 'قيد التنفيذ';
          statusColor = '#008AC5';
          break;
        case 'Pending':
          statusText = 'قيد الإنتظار';
          statusColor = '#008AC5';
          break;
        case 'Open':
          statusText = 'قيد الإنتظار';
          statusColor = '#008AC5';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'financial_department':
          statusText = 'مدير الإدارة المالية';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'Closed':
          statusText = 'مغلقة';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام الإدارة المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ';
          statusColor = '#5FDD6D';
          break;
        case 'Requested':
          statusText = 'مطلوب';
          statusColor = '#008AC5';
          break;
        case 'Closed Completed':
          statusText = 'مغلقة كاملة';
          statusColor = '#DD4B39';
          break;
        case 'Closed Complete':
          statusText = 'مغلقة كاملة';
          statusColor = '#DD4B39';
          break;
        case 'Closed In Completed':
          statusText = 'مغلقة غير مكتملة';
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.state;
          statusColor = '#008AC5';
          break;
      }
      viewItem.lineOne = `${item.id}`; //item.name;
      viewItem.lineThree = Moment(item.custody_order_date).format('DD-MM-YYYY');
      viewItem.lineDescription = item.short_description
        ? `الوصف: ${item.short_description}`
        : item.description
        ? `الوصف: ${item.description}`
        : '';
      viewItem.lineTwo = `التصنيف: ${item.type}`;
      // viewItem.lineTwo = `${item.id}`;
    }
    //new
    else if (item?.res_model === 'purchase.requisition') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'purchase_manager':
          statusText = 'مدير المشتريات';
          statusColor = '#008AC5';
          break;
        case 'manager_contracts_purchasing_department':
          statusText = 'مدير ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'gm_financial_purchasing_department':
          statusText = 'مدير عام الإدارة المالية و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        // case 'financial_department':
        //   statusText = 'ادارة المالية';
        //   statusColor = '#008AC5';
        //   break;
        // case 'authority_owner':
        //   statusText = 'صاحب الصلاحية';
        //   statusColor = '#008AC5';
        //   break;
        // case 'contract_procurement':
        //   statusText = 'ادارة العقود و المشتريات';
        //   statusColor = '#008AC5';
        //   break;
        // case 'waiting':
        //   statusText = 'طلب توضيح';
        //   statusColor = '#008AC5';
        //   break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        // case 'under_put':
        //   statusText = 'تحت الطرح';
        //   statusColor = '#008AC5';
        //   break;
        // case 'receiving_offers':
        //   statusText = 'إستلام العروض';
        //   statusColor = '#008AC5';
        //   break;
        // case 'technical_analysis':
        //   statusText = 'التحليل الفني';
        //   statusColor = '#008AC5';
        //   break;
        // case 'check_offers':
        //   statusText = 'فحص العروض';
        //   statusColor = '#008AC5';
        //   break;
        // case 'awarding_baptism':
        //   statusText = 'الترسية/التعميد';
        //   statusColor = '#008AC5';
        //   break;
        // case 'purchase_order':
        //   statusText = 'أمر الشراء المبدئي';
        //   statusColor = '#008AC5';
        //   break;
        case 'purchase_requisition':
          statusText = 'اتفاقية الشراء';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.name;

      var type = item.type_id;
      var val = item.amount_total
        ? item.amount_total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        : null;
      var prefixForLineTwo = type + ' بقيمة: ' + val + ' ريال';
      viewItem.lineDescription = prefixForLineTwo;

      viewItem.lineTwo = 'إتفاقية إطارية'; //item.description ? item.description : null;
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'purchase.contract') {
      switch (item.state) {
        case 'contract':
          statusText = 'تحت الاعداد';
          statusColor = '#F39C12';
          break;
        case 'contract_manager':
          statusText = 'مدير العقود';
          statusColor = '#008AC5';
          break;
        case 'purchasing_contract_mgr':
          statusText = 'مدير إدارة المشتريات والعقود';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'validate':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'authority_owner':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'processing':
          statusText = 'تحت التنفيذ';
          statusColor = '#008AC5';
          break;
        case 'start_business':
          statusText = 'بدأ العمل';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'العقد مكتمل';
          statusColor = '#5FDD6D';
          break;
        case 'contract_procurement':
          statusText = 'ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;

        case 'cancelled':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;

        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.name; //'طلب تعاقد';

      // viewItem.lineDescription = item.name ? `رقم العقد: ${item.name}` : '';

      if (props.menu === 'approval') {
        let name0 = null;
        let name1 =
          item.contract_manager[1]
            .split(']')[1]
            .split(' ')
            .slice(0, 2)
            .join(' ') +
          ' ' +
          item.contract_manager[1].split(']')[1].split(' ').slice(-1).join(' ');
        let name2 =
          item.contract_manager[1]
            .split(']')[1]
            .split(' ')
            .slice(0, 2)
            .join(' ') +
          ' ' +
          item.contract_manager[1].split(']')[1].split(' ').slice(-2).join(' ');
        if (
          item.contract_manager[1].length >= 30 ||
          item.contract_manager[1].length <= 27
        ) {
          name0 = name1;
        } else {
          name0 = name2;
        }
        viewItem.lineTwo = 'طلب تعاقد لـ' + name0;
      } else if (props.menu === 'myRequest') {
        viewItem.lineDescription2 = `اسم المورد: ${item.partner_id[1]}`;
        viewItem.lineTwo = 'طلب تعاقد';
      }
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'work.order') {
      switch (item.state) {
        case 'new':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'dm':
          statusText = 'المدير المباشر';
          statusColor = '#008AC5';
          break;
        case 'sm':
          statusText = 'مدير القطاع';
          statusColor = '#008AC5';
          break;
        case 'draft':
          statusText = 'أمر شراء مبدئي';
          statusColor = '#008AC5';
          break;
        case 'sent':
          statusText = 'تم إرسال طلب الشراء المدنى';
          statusColor = '#008AC5';
          break;
        case 'to approve':
          statusText = 'للموافقة';
          statusColor = '#008AC5';
          break;
        case 'purchase_manager':
          statusText = 'مدير المشتريات';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'مغلق';
          statusColor = '#5FDD6D';
          break;
        case 'director_contracts_department':
          statusText = 'مدير قسم العقود';
          statusColor = '#008AC5';
          break;
        case 'manager_contracts_purchasing_department':
          statusText = 'مدير ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'gm_financial_purchasing_department':
          statusText = 'مدير عام الادارة المالية و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'purchase':
          statusText = 'امر شراء';
          statusColor = '#008AC5';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;

        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.requisition_name; //'طلب أمر عمل';

      viewItem.lineDescription = item.name ? `رقم أمر العمل: ${item.name}` : '';

      if (props.menu === 'approval') {
        let name0 = null;
        // let name1 =
        //   item.contract_manager[1]
        //     .split(']')[1]
        //     .split(' ')
        //     .slice(0, 2)
        //     .join(' ') +
        //   ' ' +
        //   item.contract_manager[1]
        //     .split(']')[1]
        //     .split(' ')
        //     .slice(-1)
        //     .join(' ');
        // let name2 =
        //   item.contract_manager[1]
        //     .split(']')[1]
        //     .split(' ')
        //     .slice(0, 2)
        //     .join(' ') +
        //   ' ' +
        //   item.contract_manager[1]
        //     .split(']')[1]
        //     .split(' ')
        //     .slice(-2)
        //     .join(' ');
        // if (
        //   item.contract_manager[1].length >= 30 ||
        //   item.contract_manager[1].length <= 27
        // ) {
        //   name0 = name1;
        // } else {
        //   name0 = name2;
        // }
        // viewItem.lineTwo = item?.purchase_request_description;
        viewItem.lineTwo = ` طلب أمر عمل ل  ${
          item?.employee_id ? item?.employee_id[1] : '--'
        }`;

        var val = item.award_amount
          ? convertExponentialToFloat(item.award_amount)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          : '--';
        viewItem.lineDescription = 'مبلغ الترسية: ' + val + ' ريال';
      } else if (props.menu === 'myRequest') {
        viewItem.lineTwo = 'طلب أمر عمل';
        viewItem.lineDescription2 = `اسم المورد: ${item?.partner_id}`;
      }
      viewItem.lineThree = Moment(item.date).format('DD-MM-YYYY');
    } else if (item?.res_model === 'hr.payslip') {
      switch (item.state) {
        case 'draft':
          statusText = 'طلب';
          statusColor = '#F39C12';
          break;
        case 'purchase_manager':
          statusText = 'مدير المشتريات';
          statusColor = '#008AC5';
          break;
        case 'manager_contracts_purchasing_department':
          statusText = 'مدير ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'gm_financial_purchasing_department':
          statusText = 'مدير عام الإدارة المالية و المشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'hr_master':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'اعتمد';
          statusColor = '#5FDD6D';
          break;
        case 'cancel':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;

        case 'purchase_requisition':
          statusText = 'اتفاقية الشراء';
          statusColor = '#008AC5';
          break;
        case 'hrm':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.id;

      var prefixForLineTwo = 'الفترة ' + item.period_id;
      viewItem.lineDescription = prefixForLineTwo;

      viewItem.lineTwo = 'طلب مسير إفرادى ل' + ' ' + item.employee_id[1];
    } else if (item?.res_model === 'hr.payslip.run') {
      switch (item.state) {
        case 'contract':
          statusText = 'تحت الاعداد';
          statusColor = '#F39C12';
          break;
        case 'contract_manager':
          statusText = 'مدير العقود';
          statusColor = '#008AC5';
          break;
        case 'purchasing_contract_mgr':
          statusText = 'مدير إدارة المشتريات والعقود';
          statusColor = '#008AC5';
          break;
        case 'financial_purchasing_mgr':
          statusText = 'مدير عام المالية والمشتريات';
          statusColor = '#008AC5';
          break;
        case 'vp_hr_master':
          statusText = 'نائب المحافظ للخدمات المشتركة';
          statusColor = '#008AC5';
          break;
        case 'authority_owner':
          statusText = 'المحافظ';
          statusColor = '#008AC5';
          break;
        case 'processing':
          statusText = 'تحت التنفيذ';
          statusColor = '#008AC5';
          break;
        case 'start_business':
          statusText = 'بدأ العمل';
          statusColor = '#008AC5';
          break;
        case 'done':
          statusText = 'العقد مكتمل';
          statusColor = '#5FDD6D';
          break;
        case 'contract_procurement':
          statusText = 'ادارة العقود و المشتريات';
          statusColor = '#008AC5';
          break;

        case 'cancelled':
          statusText = 'ملغى';
          statusColor = '#DD4B39';
          break;
        case 'refuse':
          statusText = 'مرفوض';
          statusColor = '#DD4B39';
          break;
        case 'hrm':
          statusText = 'مدير عام الموارد البشرية';
          statusColor = '#008AC5';
          break;
        default:
          statusText = item.state;
          statusColor = '#727572';
          break;
      }

      viewItem.lineOne = item.id;

      var type = item.type_id;

      var prefixForLineTwo = 'الفترة ' + item.period_id[1];
      viewItem.lineDescription = prefixForLineTwo;

      viewItem.lineTwo = 'مسير جماعى';
    }
    //end
    if (statusColor === '') statusColor = '#727572';
    viewItem.status = statusText;
    return (
      <Wraper
        item={item}
        approval={props.menu}
        isAllOrders={props.isAllOrders}
        index={index}
      >
        <View
          style={{
            // flexDirection: 'row',
            height:
              props.isAllOrders &&
              props.menu !== 'myRequest' &&
              itemClicked != item.id
                ? Dimensions.get('window').height * 0.16
                : Dimensions.get('window').height * 0.1,
            backgroundColor: 'white',
            elevation: 2,
            shadowOpacity: 0.15,
            marginVertical: itemClicked != item.id ? 4 : 1,
            marginHorizontal: 16,
            paddingVertical: 3,
            paddingHorizontal: 8,
            paddingRight: 15,
            borderBottomRightRadius: itemClicked != item.id ? 8 : 1,
            borderBottomLeftRadius: itemClicked != item.id ? 8 : 1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,

            shadowOffset: { width: 0, height: 0 },
            // borderWidth: 1,
            // borderColor: '#eeeeee',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {props.menuTab !== 'All' ? (
              <View
                style={{
                  width: '33%',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: statusColor,
                    borderRadius: 37,
                    alignItems: 'center',
                    paddingHorizontal: 4,
                    marginTop: 8,
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      textAlign: 'center',
                      fontFamily: '29LTAzer-Medium',
                      paddingVertical: Dimensions.get('window').height * 0.009,
                      fontSize: Dimensions.get('window').width * 0.028,
                    }}
                    numberOfLines={1}
                  >
                    {viewItem.status}
                  </Text>
                </View>
                {viewItem.addLineOne ? (
                  <Text
                    style={{
                      color: 'gray',
                      marginTop: 8,
                      fontSize: Dimensions.get('window').width * 0.03,
                      fontFamily: '29LTAzer-Medium',
                    }}
                    numberOfLines={1}
                  >
                    {viewItem.addLineOne}
                  </Text>
                ) : null}

                <View>
                  <Text
                    style={{
                      color: '#A0A0A0',
                      marginTop: Dimensions.get('window').height * 0.01,
                      fontSize: Dimensions.get('window').width * 0.03,
                      fontFamily: '29LTAzer-Medium',
                    }}
                  >
                    {item?.res_model === 'manage.financial.custody'
                      ? Moment(item?.order_date).format('DD-MM-YYYY')
                      : item?.res_model === 'manage.financial.custody.close'
                      ? Moment(item?.close_date).format('DD-MM-YYYY')
                      : item?.create_date
                      ? Moment(item?.create_date).format('DD-MM-YYYY')
                      : ''}
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={{ width: '30%', alignItems: 'center' }}
              />
            )}

            <View
              style={{
                width: '70%',
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              {/* {item?.res_model === 'payment.order' ||
              item?.res_model === 'certificate.achievement' ||
              item?.res_model === 'purchase.add.budget' ||
              item?.res_model === 'purchase.order' ||
              item?.res_model === 'purchase.requisition' ||
              item?.res_model === 'purchase.contract' ||
              item?.res_model === 'purchase.request' ||
              item?.res_model === 'hr.distance.work' ||
              item?.res_model === 'hr.authorization' ||
              item?.res_model === 'hr.holidays' ||
              (item?.res_model == 'work.order' && viewItem.lineOne) ? ( */}
              {viewItem.lineOne ? (
                <Text
                  style={{
                    color: '#A0A0A0',
                    fontSize: Dimensions.get('window').width * 0.03,
                    textAlign: 'right',
                    fontFamily: '29LTAzer-Regular',
                  }}
                  numberOfLines={1}
                >
                  {viewItem.lineOne}
                </Text>
              ) : null}
              {/* ) : null} */}

              {viewItem.lineTwo ? (
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'right',
                    color: '#4B4B4B',
                    paddingVertical: Platform.OS == 'android' ? 2 : 6,
                    fontSize: Dimensions.get('window').width * 0.03,
                    fontFamily: '29LTAzer-Bold',
                  }}
                >
                  {viewItem.lineTwo}
                </Text>
              ) : null}

              <View>
                {viewItem.lineDescription2 ? (
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width * 0.03,
                      textAlign: 'right',
                      color: '#A0A0A0',
                      fontFamily: '29LTAzer-Regular',
                    }}
                    numberOfLines={2}
                  >
                    {viewItem.lineDescription2}
                  </Text>
                ) : null}
                {viewItem.lineDescription && viewItem.lineDescription != '' ? (
                  <Text
                    style={{
                      fontSize: Dimensions.get('window').width * 0.03,
                      textAlign: 'right',
                      color: '#A0A0A0',
                      fontFamily: '29LTAzer-Regular',
                      // marginHorizontal: '2%',
                    }}
                    numberOfLines={2}
                  >
                    {viewItem.lineDescription}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          {props.isAllOrders &&
          props.menu !== 'myRequest' &&
          itemClicked != item.id ? (
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: Dimensions.get('window').width * 0.8,
                  height: 1,
                  backgroundColor: '#E9E9E9',
                  marginVertical: '2%',
                }}
              />

              {itemClicked != item.id && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity
                    style={styles.viewDetails}
                    onPress={() => {
                      // handleMyRequest(item);
                      handleOpenDetails(item);
                    }}
                  >
                    <IconFe name="chevron-down" size={15} color={'#000000'} />
                    <Text
                      style={[
                        styles.btnText,
                        { color: '#4B4B4B', fontFamily: '29LTAzer-Bold' },
                      ]}
                    >
                      عرض التفاصيل
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.reject}
                    onPress={() => rejectRequest(item)}
                  >
                    <Text style={styles.btnText}>
                      {item.res_model == 'hr.payslip' ||
                      item.res_model == 'hr.payslip.run'
                        ? 'إلغاء'
                        : 'رفض'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.accept}
                    onPress={() => approveConfirm(item)}
                  >
                    <Text style={styles.btnText}>قبول</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
        {/* <Collapsible collapsed={itemClicked != item.id}> */}
        {itemClicked == item.id ? (
          <View
            style={{
              flex: 1,
              backgroundColor: '#F5F5F5',
              width: '92%',
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
              shadowOffset: { width: 0, height: 0 },
              alignSelf: 'center',
              marginBottom: 5,
            }}
          >
            <ScrollView>
              {item.res_model == 'purchase.contract' && (
                <ContractOrderDetail
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'hr.holidays' && (
                <NewLeaveRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'hr.deputation' && (
                <MandateRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'hr.training.request' && (
                <TrainingRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'purchase.order' && (
                <FormPurchaseOrder
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'hr.resignation' && (
                <Resignation
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'purchase.add.budget' && (
                <FormPurchaseAddBudget
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'work.order' && (
                <PopupActionOrder
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'helpdesk.new' && (
                <TechnicalRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'hr.distance.work' && (
                <RemoteRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'hr.authorization' && (
                <LeaveRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'purchase.requisition' && (
                <PurchaseOrderDetail
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'payment.order' && (
                <FormPaymentOrder
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'certificate.achievement' && (
                <FormCertAchievement
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'salary.identification.request' && (
                <Rhletter
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'manage.financial.custody' && (
                <CustodyRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'manage.financial.custody.close' && (
                <CustodyClose
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'helpdesk.service' && (
                <TechnicalRequestService
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}
              {item.res_model == 'helpdesk.ticket' && (
                <TechnicalRequestOld
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'hr.training.public' && (
                <FormInternalCourses
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {item.res_model == 'purchase.request' && (
                <NewPurchaseRequest
                  item={item}
                  viewType={props.menu}
                  navigation={props.navigation}
                />
              )}

              {itemClicked == item.id && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 15,
                    backgroundColor: '#FCFCFC',
                    elevation: 2,
                    shadowOpacity: 0.15,
                    shadowOffset: { width: 0, height: 0 },
                    height: props.menu !== 'myRequest' ? 70 : 0,
                    paddingHorizontal: 22,
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                    borderColor: '#e8ecee',
                    borderWidth: props.menu !== 'myRequest' ? 1 : 0,
                    marginBottom: 1,
                  }}
                >
                  {props.menu !== 'myRequest' && (
                    <>
                      <TouchableOpacity
                        style={styles.viewDetails}
                        onPress={() => setItemClicked('')}
                      >
                        <IconFe name="chevron-up" size={15} color={'#000000'} />
                        <Text
                          style={[
                            styles.btnText,
                            { color: '#4B4B4B', fontFamily: '29LTAzer-Bold' },
                          ]}
                        >
                          عرض التفاصيل
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.reject}
                        onPress={() => rejectRequest(item)}
                      >
                        <Text style={styles.btnText}>
                          {item.res_model == 'hr.payslip' ||
                          item.res_model == 'hr.payslip.run'
                            ? 'إلغاء'
                            : 'رفض'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.accept}
                        onPress={() => approveConfirm(item)}
                      >
                        <Text style={styles.btnText}>قبول</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        ) : null}
        {/* </Collapsible> */}
      </Wraper>
    );
  };

  return (
    <>
      <FlatList
        ref={flatlistRef}
        data={props.requestDataList}
        onRefresh={props.onMRefresh}
        refreshing={false}
        renderItem={({ item, index }) => renderRequestList(item, index)}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold}
        initialNumToRender={props.initialNumToRender}
        ListFooterComponent={props.ListFooterComponent}
        nestedScrollEnabled
      />
      <CommonPopup
        visible={state.showModal}
        text={'انت على وشك الموافقة على الطلب، هل انت متأكد؟'}
        onClose={() => {
          approveRequest();
        }}
        onCancel={() => {
          setState({ ...state, showModal: false });
          setSelectedItem({});
        }}
      />
      <CommonPopup
        visible={showFinishModal}
        onClose={() => {
          setTimeout(() => {
            setShowFinishModal(false);
            // props.navigation.popToTop();
          }, 1000);
        }}
        autoCLose={true}
      />
      <CommonReasonModal
        {...props}
        visible={reasonInputVisible}
        customStyleData={{ textAlign: 'right', marginHorizontal: 5 }}
        value={state.reason}
        changeText={(e) => setState({ ...state, reason: e })}
        actionOk={() => {
          rejectConfirm();
        }}
        actionCancle={() => {
          setReasonInputVisible(false);
          setSelectedItem({});
          setState({ ...state, reason: null });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    backgroundColor: '#E23636',
    height: Dimensions.get('window').height * 0.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginTop: 8,
  },
  leftContainer: {
    backgroundColor: '#5CB366',
    height: Dimensions.get('window').height * 0.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5CB366',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginTop: 8,
  },
  rightText: {
    color: 'white',
    margin: '5%',
    marginTop: '6%',
    textAlignVertical: 'center',
    textAlign: 'left',
    fontFamily: '29LTAzer-Medium',
  },
  leftText: {
    color: 'white',
    margin: '5%',
    marginTop: '6%',
    textAlignVertical: 'center',
    textAlign: 'left',
    fontFamily: '29LTAzer-Medium',
  },
  accept: {
    width: '28%',
    borderRadius: 5,
    backgroundColor: '#5CB366',
    alignItems: 'center',
    marginLeft: 5,
    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
  },
  reject: {
    width: '28%',
    borderRadius: 5,
    backgroundColor: '#E23636',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 6 : 4,
  },
  btnText: {
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: '29LTAzer-Medium',
    paddingVertical: 1,
    fontSize: 13,
  },
  viewDetails: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default MyRequestList;
