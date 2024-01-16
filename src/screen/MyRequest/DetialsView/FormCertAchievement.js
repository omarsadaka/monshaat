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
import OrderViewAttatchment from '../../../components/OrderViewAttatchment';
import OrderViewItem from '../../../components/OrderViewItem';
import * as mApprovalAction from '../../../redux/action/ApprovalAction';
import * as loadingAction from '../../../redux/action/loadingAction';
import { CERT_ACHIEVEMENT_CLEAR } from '../../../redux/reducer/ApprovalReducer';
import { baseUrl, getStatus } from '../../../services';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

const FormCertAchievement = props => {
  let { item, viewType } = props;
  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [exp, setExp] = useState(0);
  const [state, setState] = useState({
    formData: item,
    viewMode: viewType,
    showModal: false,
    visible1: false,
  });

  const convertExponentialToFloat = x => {
    var newValue = Number.parseFloat(x).toFixed(0);
    if (newValue == 0) return 0 + ' ريال';
    else return Number.parseFloat(x).toFixed(0);
  };

  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url = `${baseUrl}/api/read/last_update?res_model=certificate.achievement&res_id=${item.id}`;
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
  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const requestResponse = useSelector(
    state => state.ApprovalReducer.cretAchievementResponse,
  );
  const [modal2, setModal2] = useState(false);

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (item) {
        setState({ ...state, formData: item, viewMode: viewType });
      }
    });
  }, [props.navigation]);

  useEffect(() => {
    if (typeof requestResponse === 'object' && requestResponse.length) {
      dispatch({ type: CERT_ACHIEVEMENT_CLEAR, value: null });
      setState({ ...state, showModal: true });
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
  }, [requestResponse]);

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    if (groupIds.indexOf(95) > -1) {
      mAction = 'action_done';
    }
    if (mAction) {
      let data = {
        id: state.formData.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(mApprovalAction.approveCertAchievement(data, accessToken));
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
      dispatch(mApprovalAction.rejectCertAchievement(data, accessToken));
      dispatch(loadingAction.commonLoader(true));
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
      {state.formData ? (
        <View style={AppStyle.pageBody}>
          <OrderViewItem
            title1="رقم الطلب"
            title2={state.formData.number}
            icon={require('../../../assets/images/order/id.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          {state.formData.purchase_order_number ? (
            <OrderViewItem
              title1="رقم أمر العمل"
              title2={state.formData.purchase_order_number}
              icon={require('../../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          <OrderViewItem
            title1="تاريخ الطلب"
            title2={moment(state.formData.date).format('D-MM-Y')}
            icon={require('../../../assets/images/order/date.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="الحالة"
            title2={
              getStatus('CertificateAchievement', state.formData.state)[
                'statusText'
              ]
            }
            icon={require('../../../assets/images/order/type.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
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
            title1="اسم المشروع"
            title2={
              state.formData.under_put_method
                ? state.formData.initiative_name
                : state.formData.project_name
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="المخرجات\التسليمات"
            title2={state.formData.output_deliverable}
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="المورد"
            title2={
              state.formData.partner_id ? state.formData.partner_id[1] : '-'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="إسم الدفعة"
            title2={
              state.formData.payment_name ? state.formData.payment_name : '--'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="رقم الدفعة"
            title2={state.formData.payment_number}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="مبلغ الدفعة"
            title2={
              convertExponentialToFloat(state.formData.payment_amount)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              ' ' +
              'ريال'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="الوصف"
            title2={state.formData.purchase_request_description}
            icon={require('../../../assets/images/order/subject.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          {state.formData.attachment_ids &&
          state.formData.attachment_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={state.formData.attachment_ids}
              title3={'الفاتورة'}
            />
          ) : (
            <OrderViewItem
              title1="الفاتورة"
              title2="لا يوجد مرفق"
              icon={require('../../../assets/images/order/attatchments.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}

          {state.formData.attachment_extraction_ids &&
          state.formData.attachment_extraction_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={state.formData.attachment_extraction_ids}
              title3={'المستخلص'}
            />
          ) : (
            <OrderViewItem
              title1="المستخلص"
              title2="لا يوجد مرفق"
              icon={require('../../../assets/images/order/attatchments.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}

          {state.formData.attachment_wage_protection_ids &&
          state.formData.attachment_wage_protection_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={state.formData.attachment_wage_protection_ids}
              title3={'حماية الأجور'}
            />
          ) : (
            <OrderViewItem
              title1="حماية الأجور"
              title2="لا يوجد مرفق"
              icon={require('../../../assets/images/order/attatchments.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}

          {state.formData.attachment_regulatory_certificates_ids &&
          state.formData.attachment_regulatory_certificates_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={
                state.formData.attachment_regulatory_certificates_ids
              }
              title3={'شهادات النظامية'}
            />
          ) : (
            <OrderViewItem
              title1="شهادات النظامية"
              title2="لا يوجد مرفق"
              icon={require('../../../assets/images/order/attatchments.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}

          {state.formData.attachment_final_clearance_ids &&
          state.formData.attachment_final_clearance_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={state.formData.attachment_final_clearance_ids}
              title3={'مخالصة نهائية'}
            />
          ) : (
            <OrderViewItem
              title1="مخالصة نهائية"
              title2="لا يوجد مرفق"
              icon={require('../../../assets/images/order/attatchments.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          )}
          {
            <View style={{ flex: 1, marginBottom: 16 }}>
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

export default FormCertAchievement;
