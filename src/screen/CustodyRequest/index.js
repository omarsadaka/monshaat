import AsyncStorage from '@react-native-community/async-storage';
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
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import { Checkbox } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewItem from '../../components/OrderViewItem';
import * as CustodyAction from '../../redux/action/CustodyAction';
import * as loadingAction from '../../redux/action/loadingAction';
import { baseUrl, getStatus } from '../../services';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import Feather from 'react-native-vector-icons/Feather';

let viewType = 'new';
let item = null;
const CustodyRequest = (props) => {
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(45);
  const [height2, setHeight2] = useState(45);
  const [timelineData, setTimelineData] = useState('');
  const [instructions, setInstructions] = useState('');
  const [state, setState] = useState({
    amount: '',
    showModal: false,
    purpose: '',
    type: 'temporary', // permanent - temporary
    reason: null,
    acceptCondition: false,
    isValidated: false,
  });

  const dispatch = useDispatch();
  const accessToken = useSelector((State) => State.LoginReducer.accessToken);
  const isLoading = useSelector((State) => State.CommonLoaderReducer.isLoading);
  const CustodyResponse = useSelector(
    (State) => State.CustodyReducer.CustodyResponse,
  );
  const editableData = useSelector(
    (State) => State.HomeMyRequestReducer.editable,
  );

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      getInstructions();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        // console.log('asdasd', item);
        setState({
          ...state,
          amount: item.custody_amount,
          purpose: item.custody_reason,
          type: item.custody_type,
          reason: item.refuse_reason ? item.refuse_reason : '',
        });

        viewType = props.route.params.viewType;

        let url = `${baseUrl}/api/read/last_update?res_model=manage.financial.custody&res_id=${item.id}`;
        (async () => {
          fetch(url, {
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
    return unsubscribe;
  });

  const finalArray = (data) => {
    return data.map((obj) => {
      return {
        time: moment(obj.create_date).format('D-MM-Y hh:mm:ss'),
        title:
          obj.old_value_char === 'طلب'
            ? ' صاحب الطلب'
            : obj.old_value_char === 'طلب'
            ? ' صاحب الطلب'
            : obj.old_value_char,
        description: obj.employee_id ? obj.employee_id[1].split(']')[1] : '',
        isFromMobile: obj.is_from_mobile,
      };
    });
  };
  const getInstructions = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    let url = `${baseUrl}/api/call/all.requests/get_custody_instructions`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('data', data);
        setInstructions(data);
      });
  };

  useEffect(() => {
    if (typeof CustodyResponse === 'object' && CustodyResponse.length) {
      dispatch(CustodyAction.emptyCustodyData());
      setState({ ...state, showModal: true });
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
  }, [CustodyResponse, dispatch, state]);

  const handleCustody = async () => {
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    let empID = await AsyncStorage.getItem('empID');
    let { amount, purpose, type } = state;
    if (state.acceptCondition && purpose.trim().length && amount > 0) {
      dispatch(loadingAction.commonLoader(true));
      let data = {
        values: {
          employee_id: empID,
          custody_type: type,
          custody_amount: amount,
          custody_reason: purpose,
          is_from_mobile: true,
        },
        accessToken: accessToken,
      };
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(CustodyAction.postCustodyRequest(data));
    } else {
      showMessage({
        style: styles.showMessage,
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
        style: styles.showMessage,
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
      dispatch(CustodyAction.reject(data, accessToken));
    } else {
      showMessage({
        style: styles.showMessage,
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };

  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={styles.flex}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="طلب عهدة"
            icon={require('../../assets/images/custody.png')}
          />
          <View style={styles.alginCenter}>
            <View style={styles.width90}>
              {!editableData && item ? (
                <OrderViewItem
                  title1="رقم الطلب"
                  title2={item.name}
                  icon={require('../../assets/images/order/id.png')}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="تاريخ الطلب"
                  title2={moment(item.order_date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null}

              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={getStatus('CustodyRequest', item.state).statusText}
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}
              {!editableData && item && item.refuse_reason ? (
                <OrderViewItem
                  title1={
                    item && item.state === 'cancel'
                      ? 'سبب الإلغاء'
                      : 'سبب الرفض'
                  }
                  title2={item.refuse_reason}
                  icon={require('../../assets/images/order/subject.png')}
                />
              ) : null}

              <OrderViewItem
                title1="نوع الطلب"
                icon={require('../../assets/images/order/type.png')}
              />
              <View
                style={[
                  styles.container1,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    borderColor:
                      state.isValidated && !state.type ? 'red' : '#ffffff',
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.activeTab,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor:
                        state.type === 'permanent' ? '#7B9EB8' : '#F0F9FF',
                    },
                  ]}
                  onPress={
                    editableData
                      ? () =>
                          setState({
                            ...state,
                            type: 'permanent',
                          })
                      : null
                  }
                >
                  <Text
                    style={[
                      styles.activeTabText,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        color: state.type === 'permanent' ? 'white' : '#7B9EB8',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    عهدة دائمة
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.activeTab,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor:
                        state.type === 'temporary' ? '#7B9EB8' : '#F0F9FF',
                    },
                  ]}
                  onPress={
                    editableData
                      ? () =>
                          setState({
                            ...state,
                            type: 'temporary',
                          })
                      : null
                  }
                >
                  <Text
                    style={[
                      styles.activeTabText,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        color: state.type === 'temporary' ? 'white' : '#7B9EB8',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    عهدة مؤقتة
                  </Text>
                </TouchableOpacity>
              </View>

              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    styles.amount,
                    state.isValidated && state.amount < 1
                      ? styles.borderRed
                      : styles.borderNormal,
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height }]}
                    changeText={(e) =>
                      setState({ ...state, amount: e.replace(/[^0-9]/g, '') })
                    }
                    value={state.amount}
                    editable={editableData}
                    placeholder="مبلغ العهدة *"
                    multiline={true}
                    keyboardType="phone-pad"
                    onContentSizeChange={(e) =>
                      setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                  <Image
                    style={styles.ksa}
                    source={require('./../../assets/images/ksa2.png')}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="مبلغ العهدة"
                  title2={state.amount + ' ' + 'ريال'}
                  icon={require('../../assets/images/order/id.png')}
                  hasIcon={true}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    styles.purpose,
                    state.isValidated && state.purpose.trim().length < 1
                      ? styles.borderRed
                      : styles.borderNormal,
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={styles.input}
                    changeText={(e) => setState({ ...state, purpose: e })}
                    value={state.purpose}
                    editable={editableData}
                    placeholder="الغرض من العهدة *"
                    multiline={true}
                  />
                </View>
              ) : (
                <View>
                  <OrderViewItem
                    title1="الغرض من العهدة"
                    title2={state.purpose}
                    icon={require('../../assets/images/order/id.png')}
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      alignSelf: 'center',
                      padding: 8,
                      width: '55%',
                      marginVertical: 15,
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor: '#008AC5',
                      // marginTop: 22,
                    }}
                    disabled={timelineData.length === 0 ? true : false}
                  >
                    {/* <Icon2
                      name="archive"
                      size={25}
                      color="white"
                      resizeMode="stretch"
                      style={styles.archiveIcon}
                    /> */}
                    <Text style={styles.approveRecordButton}>
                      سجل الموافقات{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {!editableData && (
                <View style={styles.flex}>
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
                          <Feather
                            name="x-circle"
                            size={23}
                            color={'#E23636'}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                  </Modal3>
                </View>
              )}
              {editableData && instructions !== '' ? (
                <View style={styles.instructionsContainer}>
                  <View style={styles.heading}>
                    <Text style={styles.instructionsText}>التعليمات</Text>
                  </View>
                  <Text style={[styles.viewerValueText]}>{instructions}</Text>
                </View>
              ) : null}
              {editableData ? (
                <View style={styles.admitContainer}>
                  <Text style={styles.admitText}>
                    اقر انا المتقدم/ة بأني قرأت واطلعت على الشروط والتعليمات
                    المذكورة أعلاه*
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                      status={state.acceptCondition ? 'checked' : 'unchecked'}
                      onPress={() =>
                        editableData
                          ? setState({
                              ...state,
                              acceptCondition: !state.acceptCondition,
                            })
                          : null
                      }
                      disabled={!editableData}
                      color={
                        state.isValidated && !state.acceptCondition
                          ? 'red'
                          : '#007598'
                      }
                    />
                  </View>
                </View>
              ) : null}
            </View>
            {editableData ? (
              <View style={styles.width80}>
                <CommonFormButton
                  {...props}
                  disabled={
                    !(
                      state.acceptCondition &&
                      state.purpose.trim().length &&
                      state.amount > 0
                    )
                  }
                  onPress={() => {
                    setModal2(true);
                  }}
                />
              </View>
            ) : viewType === 'approval' ? (
              <View
                style={{
                  marginBottom: 32,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '80%',
                  alignSelf: 'center',
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
        text={
          !editableData
            ? 'انت على وشك الموافقة على الطلب، هل انت متأكد؟'
            : 'انت على وشك إرسال الطلب، هل انت متأكد؟'
        }
        onClose={() => {
          if (!modal2) {
            return;
          }
          editableData ? handleCustody() : approveRequest();
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
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={reasonInputVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalSubContainer}>
              <View style={styles.width100}>
                <Text style={styles.rejectModalText}>سبب الرفض</Text>
                <View style={[styles.inputContainer]}>
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height2 }]}
                    changeText={(e) => setState({ ...state, reason: e })}
                    placeholder="سبب الرفض"
                    keyboardType="text"
                    value={state.reason}
                    multiline={true}
                    onContentSizeChange={
                      (e) => setHeight2(e.nativeEvent.contentSize.height)
                      // setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              </View>
              <View style={styles.sendView}>
                <TouchableOpacity
                  style={[styles.btnPrimary, styles.width45]}
                  onPress={() => {
                    rejectConfirm();
                  }}
                >
                  <Text style={styles.sendText}>إرسال</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnDanger, styles.width45]}
                  onPress={() => {
                    setReasonInputVisible(false);
                  }}
                >
                  <Text style={styles.cancelText}>الغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

export default CustodyRequest;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  alginCenter: { alignItems: 'center' },
  width90: { width: '90%', marginBottom: 14 },
  borderRed: { borderColor: 'red' },
  borderNormal: { borderColor: '#e2e2e2' },
  heading: {
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },
  purpose: {
    height: 'auto',
    justifyContent: 'flex-start',
    paddingTop: 10,
    minHeight: 100,
  },
  approveRecord: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    padding: 10,
    marginBottom: 10,
  },
  timelineEnabled: {
    backgroundColor: '#bfd8e0',
  },
  timelineDisabled: {
    backgroundColor: '#20547a',
  },
  approveRecordButton: {
    color: '#008AC5',
    fontFamily: '29LTAzer-Medium',
    fontSize: hp('2%'),
    width: '100%',
    marginRight: 10,
    paddingRight: 16,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  approveContainer: {
    width: '100%',
    height: '100%',
    top: 90,
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: -20,
  },
  approveNestedContainer: {
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
  },
  approveIcon: {
    display: 'flex',
    alignSelf: 'center',
    padding: 10,
    top: -20,
  },
  padding3: { padding: 3 },
  descriptionStyle: {
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
  },
  titleStyle: {
    color: '#7b9eb8',
    fontFamily: '29LTAzer-Bold',
    fontWeight: 'normal',
  },
  timeStyle: {
    color: '#20547a',
    width: 140,
    fontFamily: '29LTAzer-Regular',
  },
  noRecord: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: '29LTAzer-Regular',
  },
  closeApprove: {
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
  },
  instructionsContainer: { backgroundColor: '#f3fcff', marginTop: 10 },
  instructionsText: {
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
  },
  admitContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  admitText: {
    marginRight: 8,
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
    marginTop: Platform.OS === 'android' ? 0 : 3,
    textAlign: 'right',
    lineHeight: 18,
    width: '90%',
  },
  width80: { width: '80%' },

  rejectContainer: {
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    alignSelf: 'center',
  },
  rejectText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubContainer: {
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
  },
  rejectModalText: {
    alignSelf: 'center',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: '29LTAzer-Regular',
  },
  sendView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  width45: { width: '45%' },
  width100: { width: '100%' },
  confirmContainer: {
    backgroundColor: '#007598',
    borderWidth: 1,
    borderColor: '#007598',
  },
  confirmText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  cancelText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  colorWhite: { color: '#fff' },
  archiveIcon: { right: -90 },
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
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#90909080',
    borderRadius: 10,
  },
  mandateTypeText: {
    color: 'white',
    fontFamily: '29LTAzer-Regular',
  },
  rowContainer: {
    justifyContent: 'space-around',
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
  amount: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxStyle: {
    width: 15,
    height: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
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
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
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
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
  },
  activeTab: {
    width: '45%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: hp('1.5%'),
    justifyContent: 'center',
  },
  container1: {
    flexDirection: 'row',
    borderRadius: 30,
    // backgroundColor: 'white',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  activeTabText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  ksa: { height: 20, width: 30, marginLeft: 8 },
  showMessage: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
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
});
