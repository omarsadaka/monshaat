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
import { AppStyle } from '../../assets/style/AppStyle';
import CommonPopup from '../../components/CommonPopup';
import CommonReasonModal from '../../components/CommonReasonModal';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import * as mApprovalAction from '../../redux/action/ApprovalAction';
import * as loadingAction from '../../redux/action/loadingAction';
import { CERT_ACHIEVEMENT_CLEAR } from '../../redux/reducer/ApprovalReducer';
import { baseUrl, getStatus } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { ClearPushNotification } from '../../utils/clearPushNotification';

let item = null;
let viewType = 'new';
const FormCertAchievement = (props) => {
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [exp, setExp] = useState(0);
  const [state, setState] = useState({
    formData: {},
    viewMode: viewType,
    showModal: false,
    visible1: false,
  });

  const convertExponentialToFloat = (x) => {
    var newValue = Number.parseFloat(x).toFixed(0);
    if (newValue == 0) return 0 + ' ريال';
    else return Number.parseFloat(x).toFixed(0);
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        item = props.route.params.item;
        // console.log('LISTENER.ITEM', item);
        // console.log('ITEM.ID', item.id);
        let url = `${baseUrl}/api/read/last_update?res_model=certificate.achievement&res_id=${item.id}`;
        // console.log('timelline url', url, accessToken);
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
              // console.log('lastupdate', data);
              let newdata = finalArray(data);
              // console.log('newdata', newdata);
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
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const requestResponse = useSelector(
    (state) => state.ApprovalReducer.cretAchievementResponse,
  );
  const [modal2, setModal2] = useState(false);

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        console.log('certi engaz', item);
        viewType = props.route.params.viewType;
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
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View style={[AppStyle.cardContainer, { backgroundColor: '#F5F5F5' }]}>
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="شهادة انجاز"
            icon={require('../../assets/images/agaza.png')}
          />
          {state.formData ? (
            <View style={AppStyle.pageBody}>
              <OrderViewItem
                title1="رقم الطلب"
                title2={state.formData.number}
                icon={require('../../assets/images/order/id.png')}
              />
              {state.formData.purchase_order_number ? (
                <OrderViewItem
                  title1="رقم أمر العمل"
                  title2={state.formData.purchase_order_number}
                  icon={require('../../assets/images/order/id.png')}
                />
              ) : null}
              <OrderViewItem
                title1="تاريخ الطلب"
                title2={moment(state.formData.date).format('D-MM-Y')}
                icon={require('../../assets/images/order/date.png')}
              />
              <OrderViewItem
                title1="الحالة"
                title2={
                  getStatus('CertificateAchievement', state.formData.state)[
                    'statusText'
                  ]
                }
                icon={require('../../assets/images/order/type.png')}
              />
              <OrderViewItem
                title1="صاحب الطلب"
                title2={
                  state.formData.employee_id
                    ? state.formData.employee_id[1].split(']')[1]
                    : '-'
                }
                icon={require('../../assets/images/order/category2.png')}
              />
              <OrderViewItem
                title1="اسم المشروع"
                title2={
                  state.formData.under_put_method
                    ? state.formData.initiative_name
                    : state.formData.project_name
                }
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="المخرجات\التسليمات"
                title2={state.formData.output_deliverable}
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="المورد"
                title2={
                  state.formData.partner_id ? state.formData.partner_id[1] : '-'
                }
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="إسم الدفعة"
                title2={state.formData.payment_name}
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="رقم الدفعة"
                title2={state.formData.payment_number}
                icon={require('../../assets/images/order/subject.png')}
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
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="الوصف"
                title2={state.formData.purchase_request_description}
                icon={require('../../assets/images/order/subject.png')}
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
                  icon={require('../../assets/images/order/attatchments.png')}
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
                  icon={require('../../assets/images/order/attatchments.png')}
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
                  icon={require('../../assets/images/order/attatchments.png')}
                />
              )}

              {state.formData.attachment_regulatory_certificates_ids &&
              state.formData.attachment_regulatory_certificates_ids.length >
                0 ? (
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
                  icon={require('../../assets/images/order/attatchments.png')}
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
                  icon={require('../../assets/images/order/attatchments.png')}
                />
              )}
              {
                <View style={{ flex: 1, marginBottom: 16 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      alignSelf: 'center',
                      width: '100%',
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#e3e3e3',
                      padding: 10,
                      backgroundColor:
                        timelineData.length == 0 ? '#bfd8e0' : '#20547a',
                    }}
                    disabled={timelineData.length == 0 ? true : false}
                  >
                    <Icon2
                      name="archive"
                      size={25}
                      color="white"
                      resizeMode="stretch"
                      style={{ right: -90 }}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: '29LTAzer-Bold',
                        fontSize: 18,
                        width: '100%',
                        marginRight: 10,
                        paddingRight: 16,
                        textAlign: 'center',
                        marginHorizontal: 10,
                        marginTop: 8,
                      }}
                    >
                      سجل الموافقات{' '}
                    </Text>
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
                            paddingTop: 45,
                            paddingBottom: 40,
                          }}
                        >
                          {timelineData.length ? (
                            <Timeline
                              data={timelineData}
                              circleSize={15}
                              circleColor="rgb(45,156,219)"
                              lineColor="rgb(45,156,219)"
                              innerCircle={'dot'}
                              descriptionStyle={{
                                color: '#20547a',
                                fontFamily: '29LTAzer-Regular',
                              }}
                              titleStyle={{
                                color: '#7b9eb8',
                                fontFamily: '29LTAzer-Bold',
                                fontWeight: 'normal',
                              }}
                              timeStyle={{
                                color: '#20547a',
                                width: 140,
                                fontFamily: '29LTAzer-Regular',
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
                            right: 5,
                            top: 10,
                            backgroundColor: '#c00e0e',
                            alignSelf: 'center',
                            borderRadius: 50,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: '#fff' }}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                    {/* </TouchableWithoutFeedback> */}
                  </Modal3>
                </View>
              }
              {state.formData && state.viewMode === 'approval' ? (
                <View style={[AppStyle.btnGroupAction, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={{ width: '45%' }}
                    onPress={rejectRequest}
                  >
                    <View style={AppStyle.btnDanger}>
                      <Text style={AppStyle.btnTextDanger}>رفض</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ width: '45%' }}
                    onPress={() => setModal2(true)}
                  >
                    <View style={AppStyle.btnPrimary}>
                      <Text style={AppStyle.btnTextPrimary}>موافقة</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}
        </KeyboardAwareScrollView>
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
        changeText={(e) => setState({ ...state, reason: e })}
        actionOk={() => {
          rejectConfirm();
        }}
        actionCancle={() => {
          setReasonInputVisible(false);
        }}
      />
    </LinearGradient>
  );
};

export default FormCertAchievement;
