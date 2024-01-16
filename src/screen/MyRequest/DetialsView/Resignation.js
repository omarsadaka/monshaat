import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../../assets/style/AppStyle';
import CommonPopup from '../../../components/CommonPopup';
import CommonReasonModal from '../../../components/CommonReasonModal';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewAttatchment from '../../../components/OrderViewAttatchment';
import OrderViewItem from '../../../components/OrderViewItem';
import * as mApprovalAction from '../../../redux/action/ApprovalAction';
import * as loadingAction from '../../../redux/action/loadingAction';
import { baseUrl } from '../../../services';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import Feather from 'react-native-vector-icons/Feather';

const Resignations = props => {
  const { item, viewType } = props;
  const [modal2, setModal2] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    showModal: false,
    reason: null,
    create_date: '',
    employee_id: '',
    attachment_ids: [],
    formData: {},
  });

  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const editableData = useSelector(
    state => state.HomeMyRequestReducer.editable,
  );

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      if (item) {
        console.log('resignation item', item);
        setState({
          ...state,
          employee_id: item.employee_id,
          attachment_ids: item.attachment_ids,
          note: item.note,
          formData: item,
        });
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    if (state.formData.state === 'gm_humain') {
      mAction = 'action_disclaimer';
    } else if (state.formData.state === 'dm') {
      mAction = 'action_sm';
    }
    // new
    else if (state.formData.state === 'sm') {
      mAction = 'action_hrm';
    }
    if (mAction) {
      let data = {
        id: state.formData.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(mApprovalAction.approveResignation(data, accessToken));
      setState({ ...state, showModal: true });
    } else {
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'ليس لديك الإذن',
      });
    }
  };

  const [reasonInputVisible, setReasonInputVisible] = useState(false);

  const rejectRequest = () => {
    setReasonInputVisible(true);
  };
  const getHistoryApprove = async () => {
    if (item) {
      // console.log('asd@getHistoryApprove');
      setLoading(true);

      try {
        let url = `${baseUrl}/api/read/last_update?res_model=hr.resignation&res_id=${item.id}`;

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
  const rejectConfirm = () => {
    if (state.reason) {
      setReasonInputVisible(false);
      let data = {
        id: item.id,
        reason: { refuse_reason: state.reason },
      };
      dispatch(loadingAction.commonLoader(true));
      setState({ ...state, showModal: true });

      dispatch(mApprovalAction.rejectResignation(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };

  const resignationStation = state => {
    let statusText = '';
    switch (state) {
      case 'employee':
        statusText = 'موظف';

        break;
      case 'human':
        statusText = 'مسؤول الموارد البشرية';

        break;
      case 'dm':
        statusText = 'المدير المباشر';

        break;
      case 'sm':
        statusText = 'مدير القطاع';

        break;
      case 'gm_humain':
        statusText = 'مدير عام الموارد البشرية';

        break;
      case 'hrm':
        statusText = 'عمليات الموارد البشرية';

        break;
      case 'done':
        statusText = 'منتهي';

        break;
      case 'cancel':
        statusText = 'ملغى';

        break;
      case 'cutoff':
        statusText = 'مقطوع';

        break;
      case 'refuse':
        statusText = 'مرفوض';

        break;
      case 'confirm':
        statusText = 'للاعتماد';

        break;
      case 'validate1':
        statusText = 'الموافقة الثانية';

        break;
      case 'validate':
        statusText = 'مقبول';

        break;
      case 'disclaimer':
        statusText = 'إخلاء طرف';

        break;
      default:
        statusText = item.state;
        break;
    }

    return statusText;
  };

  return (
    <KeyboardAwareScrollView>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '90%' }}>
          {true && item ? (
            <OrderViewItem
              title1="رقم الطلب"
              title2={item.name}
              icon={require('../../../assets/images/order/id.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="تاريخ الطلب"
              title2={moment(item.create_date).format('D-MM-Y')}
              icon={require('../../../assets/images/order/date.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="إسم الموظف"
              title2={item.employee_id[1]}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="المسمى الوظيفي"
              title2={item.job_id[1]}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="آخر يوم عمل"
              title2={moment(item.date_end).format('D-MM-Y')}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="سبب الإستقالة"
              title2={item.note ? item.note : '--'}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}
          {true && item ? (
            <OrderViewItem
              title1="الحالة"
              title2={resignationStation(item.state)}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}

          {true && item && item.refuse_reason ? (
            <OrderViewItem
              title1="سبب رفض الاستقالة"
              title2={item.refuse_reason}
              icon={require('../../../assets/images/order/type.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}

          {true &&
          item &&
          item.attachment_ids &&
          item.attachment_ids.length > 0 ? (
            <OrderViewAttatchment
              dispatch={dispatch}
              accessToken={accessToken}
              attatchments={state.attachment_ids}
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
          )}
          {true && (
            <View style={{ flex: 1, marginTop: 10 }}>
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
              </Modal3>
            </View>
          )}
        </View>
      </View>
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
      <CommonReasonModal
        {...props}
        visible={reasonInputVisible}
        value={state.reason}
        customStyleData={[AppStyle.inputBox, { height: height }]}
        changeText={e => setState({ ...state, reason: e })}
        actionOk={() => {
          rejectConfirm();
        }}
        actionCancle={() => {
          setReasonInputVisible(false);
        }}
        multiline={true}
        onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
      />
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
    </KeyboardAwareScrollView>
  );
};

export default Resignations;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    paddingRight: wp('4%'),
    marginBottom: hp('0.5%'),
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
  },
  input: {
    height: '100%',
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
  },
  mandateTypebtn: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#90909080',
    borderRadius: 10,
  },
  mandateTypeText: {
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateStyle: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'white',
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 6,
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
  checkboxStyle: {
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    backgroundColor: '#007598',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerValueText: {
    textAlign: 'right',
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
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    justifyContent: 'center',
    marginVertical: 5,
  },
  fullDay: {
    textAlign: 'right',
    color: '#007297',
    fontFamily: '29LTAzer-Regular',
  },
});
