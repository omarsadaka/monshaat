import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Platform,
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
import OrderViewItem from '../../components/OrderViewItem';
import * as mApprovalAction from '../../redux/action/ApprovalAction';
import * as loadingAction from '../../redux/action/loadingAction';
import { PURCHASE_ADD_BUDGET_CLEAR } from '../../redux/reducer/ApprovalReducer';
import { baseUrl, getStatus } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { ClearPushNotification } from '../../utils/clearPushNotification';

let item = null;
let viewType = 'new';
const FormPurchaseAddBudget = (props) => {
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const [state, setState] = useState({
    formData: {},
    viewMode: viewType,
    showModal: false,
    visible1: false,
  });

  const [modal2, setModal2] = useState(false);

  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const requestResponse = useSelector(
    (state) => state.ApprovalReducer.purchaseAddBudgetResponse,
  );

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        // console.log('LISTENER.ITEM', item);
        // console.log('ITEM.ID', item.id);
        // http://95.177.177.69:8070/api/read/last_update?res_model=purchase.add.budget&res_id=29
        let url = `${baseUrl}/api/read/last_update?res_model=purchase.add.budget&res_id=${item.id}`;

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
              // console.log('lastupdate', data);
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
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        viewType = props.route.params.viewType;
        setState({ ...state, formData: item, viewMode: viewType });
      }
    });
  }, [props.navigation]);

  useEffect(() => {
    if (typeof requestResponse === 'object' && requestResponse.length) {
      dispatch({ type: PURCHASE_ADD_BUDGET_CLEAR, value: null });
      setState({ ...state, showModal: true });
    } else if (
      typeof requestResponse === 'object' &&
      Object.keys(requestResponse).length
    ) {
      dispatch({ type: PURCHASE_ADD_BUDGET_CLEAR, value: null });
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

    if (
      groupIds.indexOf(21) >
        -1 /*&& state.formData.state === 'authority_owner' */ &&
      state.formData.award_budget > 500000
    ) {
      mAction = 'action_done';
    } else if (
      groupIds.indexOf(22) >
        -1 /*&& state.formData.state === 'authority_owner'*/ &&
      state.formData.award_budget <= 500000
    ) {
      mAction = 'action_done';
    }
    if (mAction) {
      let data = {
        id: state.formData.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(mApprovalAction.approvePurchaseAddBudget(data, accessToken));
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
      dispatch(mApprovalAction.rejectPurchaseAddBudget(data, accessToken));
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
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View style={AppStyle.cardContainer}>
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="تعزيز ميزانية"
            icon={require('../../assets/images/agaza.png')}
          />
          {state.formData ? (
            <View style={AppStyle.pageBody}>
              <OrderViewItem
                title1="رقم الطلب"
                title2={state.formData.number}
                icon={require('../../assets/images/order/id.png')}
              />

              <OrderViewItem
                title1="تاريخ الطلب"
                title2={moment(state.formData.create_order).format('D-MM-Y')}
                icon={require('../../assets/images/order/date.png')}
              />

              <OrderViewItem
                title1="الحالة"
                title2={
                  getStatus('AddBudget', state.formData.state)['statusText']
                }
                icon={require('../../assets/images/order/type.png')}
              />
              {state.formData.reason ? (
                <OrderViewItem
                  title1="سبب الرفض"
                  title2={state.formData.reason}
                  icon={require('../../assets/images/order/subject.png')}
                />
              ) : null}
              <OrderViewItem
                title1="صاحب الطلب"
                title2={
                  state.formData.requester_id
                    ? state.formData.requester_id[1].split(']')[1]
                    : '-'
                }
                icon={require('../../assets/images/order/category2.png')}
              />

              {/* <View style={AppStyle.viewGroup}>
              <Text style={AppStyle.keyView}>مسؤول المشتريات</Text>
              <Text style={AppStyle.valueView}>
                {state.formData.employee_id
                  ? state.formData.employee_id[1]
                  : "-"}
              </Text>
            </View> */}
              <OrderViewItem
                title1="رقم طلب الشراء"
                title2={state.formData.purchase_request_number}
                icon={require('../../assets/images/order/category.png')}
              />
              <OrderViewItem
                title1="المبلغ الأساسي لطلب الشراء"
                title2={
                  state.formData.reserved_budget
                    ? state.formData.reserved_budget
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : '-'
                }
                icon={require('../../assets/images/order/subject.png')}
              />

              <OrderViewItem
                title1="مبلغ تعزيز الميزانية المطلوب"
                title2={
                  state.formData.boost_amount
                    ? state.formData.boost_amount
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : '-'
                }
                icon={require('../../assets/images/order/subject.png')}
              />
              <OrderViewItem
                title1="مبلغ الترسية بعد التعزيز"
                title2={
                  state.formData.award_budget
                    ? state.formData.award_budget
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    : '-'
                }
                icon={require('../../assets/images/order/subject.png')}
              />
              <OrderViewItem
                title1="الوصف"
                title2={state.formData.purchase_request_description}
                icon={require('../../assets/images/order/subject.png')}
              />
              {
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      // backgroundColor: "#2196f3",
                      alignSelf: 'center',
                      padding: 13,
                      width: '100%',
                      // justifyContent: "center",
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      // marginLeft: 50,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#e3e3e3',
                      padding: 10,
                      // textAlign: "center",
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

                        // justifyContent: "center",
                        // alignItems: "center",
                        width: '100%',
                        // left: 60,
                        marginRight: 10,
                        paddingRight: 16,
                        // backgroundColor: "#20547a",
                        textAlign: 'center',
                        marginHorizontal: 10,
                        marginTop: 8,
                        // textAlign: "right",
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
onPress={() => setState({ ...state, visible1: false })}
> */}
                    <KeyboardAvoidingView behavior="position" enabled>
                      <View
                        style={{
                          // height: 320,
                          width: '100%',
                          height: '100%',
                          top: 90,
                          alignSelf: 'center',
                          // padding: -50,
                          // borderRadius: 20,
                          // borderColor: "blue",

                          // // backgroundColor: "white",
                          // alignItems: "flex-end",
                          // justifyContent: "center",
                          // // shadowColor: "#000",
                          // // shadowOffset: {
                          // //   width: 0,
                          // //   height: 2,
                          // // },
                          // // shadowOpacity: 0.25,
                          // // shadowRadius: 3.84,
                          // // elevation: 20,
                          overflow: 'hidden',
                          marginTop: -20,
                          // backgroundColor: "white",
                          // flex: 1
                        }}
                      >
                        {/* <StatusBar backgroundColor="rgba(0,0,0,0.7)"  barStyle="light-content"/> */}

                        <View
                          style={{
                            backgroundColor: 'white',
                            // height: 45,

                            borderColor: '#e3e3e3',
                            justifyContent: 'center',
                            marginVertical: 5,
                            width: '100%',
                            height: '80%',
                            top: 0,
                            // marginRight: 5,
                            paddingLeft: 15,
                            paddingRight: 15,
                            // flex: 1
                            alignSelf: 'center',
                            borderRadius: 20,
                            paddingTop: 45,
                            paddingBottom: 40,
                          }}
                        >
                          {/* <View
                            style={{
                              display: "flex",
                              alignSelf: "center",
                              padding: 30,
                              top: -5,
                              flexDirection: "row-reverse",
                            }}
                          >
                            <View
                              style={{
                                // borderWidth: 1,
                                // borderColor: "#007598",
                                // backgroundColor: "#007598",
                                borderRadius: 10,
                                // width: 200,
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
                                {state.formData.requester_id
                                  ? state.formData.requester_id[1].split("]")[1]
                                  : ""}{" "}
                              </Text>
                            </View>
                            <View style={{ padding: 3 }} />
                            <View
                                style={{
                                  // borderWidth: 1,
                                  // borderColor: "#4E7D89",
                                  // backgroundColor: "#4E7D89",
                                  // borderRadius: 10,
                                  width: 150,
                                  display: "flex",
                                  alignSelf: "center",
                                  // bottom: 20
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
                          </View> */}

                          {timelineData.length ? (
                            <Timeline
                              data={timelineData}
                              // renderTime={RenderDetails}
                              circleSize={15}
                              circleColor="rgb(45,156,219)"
                              lineColor="rgb(45,156,219)"
                              innerCircle={'dot'}
                              descriptionStyle={{
                                // fontSize: 16,

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
              <OrderViewItem
                title1="السبب"
                title2={state.formData.add_budget_reason}
                icon={require('../../assets/images/order/category.png')}
              />

              {state.formData && state.viewMode === 'approval' ? (
                <View style={AppStyle.btnGroupAction}>
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

export default FormPurchaseAddBudget;
