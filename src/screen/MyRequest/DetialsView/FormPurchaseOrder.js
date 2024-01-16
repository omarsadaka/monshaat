import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../../assets/style/AppStyle';
import CommonPopup from '../../../components/CommonPopup';
import CommonReasonModal from '../../../components/CommonReasonModal';
import Loader from '../../../components/loader';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewItem from '../../../components/OrderViewItem';
import * as mApprovalAction from '../../../redux/action/ApprovalAction';
import * as loadingAction from '../../../redux/action/loadingAction';
import {
  PAYMENT_ORDER_CLEAR,
  PURCHASE_ORDER_CLEAR,
} from '../../../redux/reducer/ApprovalReducer';
import { baseUrl, getStatus } from '../../../services';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

const FormPurchaseOrder = props => {
  let { item, viewType } = props;
  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    formData: item,
    viewMode: viewType,
    showModal: false,
    visible1: false,
  });
  const [modal2, setModal2] = useState(false);

  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const requestResponse = useSelector(
    state => state.ApprovalReducer.purchaseOrderResponse,
  );
  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url = `${baseUrl}/api/read/last_update?res_model=purchase.order&res_id=${item.id}`;

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

  const finalArray = data => {
    return data.map(obj => {
      return {
        time: moment(obj.create_date).format('D-MM-Y hh:mm:ss'),
        title: obj.old_value_char == 'طلب' ? ' صاحب الطلب' : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };
  useEffect(() => {
    dispatch({ type: PURCHASE_ORDER_CLEAR, value: '' });
    return props.navigation.addListener('focus', () => {
      if (props) {
        // item = props.route.params.item;
        //console.log("PurchaseOrder >> ", item);
        // viewType = props.route.params.viewType;
        setState({ ...state, formData: item, viewMode: viewType });
      }
    });
  }, [props.navigation]);

  useEffect(() => {
    if (typeof requestResponse === 'object' && requestResponse.length) {
      dispatch({ type: PURCHASE_ORDER_CLEAR, value: '' });
      setState({ ...state, showModal: true });
    } else if (
      typeof requestResponse === 'object' &&
      Object.keys(requestResponse).length
    ) {
      dispatch({ type: PAYMENT_ORDER_CLEAR, value: null });
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: requestResponse.message.replace('None', ''),
      });
    }
  }, [requestResponse]);

  const approveRequest = async () => {
    setModal2(false);

    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    if (groupIds.indexOf(21) > -1 /*&& state.formData.state === 'hr_master'*/) {
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
    } else {
      showMessage({
        style: { alignItems: 'flex-end' },
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
        reason: { reason: state.reason },
      };
      dispatch(mApprovalAction.rejectPurchaseOrder(data, accessToken));
      dispatch(loadingAction.commonLoader(true));
    } else {
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };

  return (
    <KeyboardAwareScrollView>
      {state.formData ? (
        <View style={AppStyle.pageBody}>
          <OrderViewItem
            title1="رقم أمر الشراء"
            title2={state.formData.name}
            icon={require('../../../assets/images/order/id.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="تاريخ أمر الشراء"
            title2={moment(state.formData.date_order).format('D-MM-Y')}
            icon={require('../../../assets/images/order/date.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="الحالة"
            title2={
              getStatus('PurchaseOrder', state.formData.state)['statusText']
            }
            icon={require('../../../assets/images/order/type.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          {state.formData.cancel_reason ? (
            <OrderViewItem
              title1="سبب الإلغاء"
              title2={state.formData.cancel_reason}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          <OrderViewItem
            title1="صاحب الطلب"
            title2={
              state.formData.employee_id
                ? state.formData.employee_id[1].split(']')[1]
                : '-'
            }
            icon={require('../../../assets/images/order/category2.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="رقم طلب الشراء"
            title2={
              state.formData.purchase_request_number
                ? state.formData.purchase_request_number
                : '--'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="اسم المنافسة"
            title2={
              state.formData.tender_name ? state.formData.tender_name : '--'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="اسم المورد"
            title2={
              state.formData.partner_id ? state.formData.partner_id[1] : '-'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="مبلغ الترسية "
            title2={
              state.formData.award_amount
                ? state.formData.award_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                  ' ' +
                  'ريال'
                : '--'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="الوصف"
            title2={
              state.formData.purchase_request_description
                ? state.formData.purchase_request_description
                : '--'
            }
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => getHistoryApprove()}
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
                      <Feather name="x-circle" size={23} color={'#E23636'} />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
                {/* </TouchableWithoutFeedback> */}
              </Modal3>
            </View>
          }
        </View>
      ) : null}
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
      <CommonPopup
        visible={modal2}
        text={'انت على وشك الموافقة على الطلب، هل انت متأكد؟'}
        onClose={() => {
          if (!modal2) {
            return;
          }
          approveRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
      {isLoading ? <Loader /> : null}
      <CommonReasonModal
        {...props}
        visible={reasonInputVisible}
        value={state.reason}
        changeText={e => setState({ ...state, reason: e })}
        actionOk={() => {
          rejectConfirm();
        }}
        actionCancle={() => {
          setReasonInputVisible(false);
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default FormPurchaseOrder;
