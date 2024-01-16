import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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
import CommonFormButton from '../../../components/CommonFormButton';
import CommonPopup from '../../../components/CommonPopup';
import CommonReasonModal from '../../../components/CommonReasonModal';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewAttatchment from '../../../components/OrderViewAttatchment';
import OrderViewItem from '../../../components/OrderViewItem';
import OrderDateViewItem from '../../../components/OrderDateViewItem';

import * as mApprovalAction from '../../../redux/action/ApprovalAction';
import * as loadingAction from '../../../redux/action/loadingAction';
import { baseUrl } from '../../../services';
import { EncryptUrl } from '../../../services/EncryptUrl';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import Feather from 'react-native-vector-icons/Feather';

const FormInternalCourses = (props) => {
  let { item, viewType } = props;
  // const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    formData: item,
    viewMode: viewType,
    showModal: false,
    visible1: false,
    isValidated: false,
    isLoading: false,
    emptyData: false,
    // display: true
  });
  const [modal2, setModal2] = useState(false);
  const [display, setDisplay] = useState(true);
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );
  // const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
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

  // console.log('state formData', state.formData);

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

  // console.log('Displaaaaaaaaaaaay',display)
  useEffect(async () => {
    props.navigation.addListener('focus', () => {
      if (props) {
        // item = props.route.params.item;
        // viewType = props.route.params.viewType;
        setState({ ...state, formData: item, viewMode: viewType });
      }
    });

    let trainingID = item.id;
    // console.log('TRAININGID', trainingID);

    let mEmpID = await AsyncStorage.getItem('empID');

    let mUrl = `${baseUrl}/api/call/all.requests/action_display_button?kwargs={"employee_id": ${mEmpID}, "training_id": ${trainingID}}`;

    fetch(mUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('DATA5 ', data);
        setDisplay(data);
        //setState({ ...state, display: data })
      });
  }, [props.navigation]);

  const sendInternalRequest = async () => {
    setState({ ...state, isLoading: true });

    let trainingID = state.formData.id;

    let mEmpID = await AsyncStorage.getItem('empID');

    let url =
      baseUrl +
      `/api/call/all.requests/action_candidat_api?kwargs={"employee_id": ${mEmpID}, "is_from_mobile": ${true}, "training_id": ${trainingID}}`;
    // console.log('URL2', url);

    let secretUrl = await EncryptUrl(url);
    setState({ ...state, isLoading: true });
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setState({ ...state, isLoading: false });

        // console.log('JSON RETURNED', responseData);
        if (responseData) {
          showMessage({
            type: 'danger',
            message: responseData.message.replace('None', ''),
            style: { alignItems: 'flex-end' },
          });
        } else {
          const logEvent = `${baseUrl}/api/call/all.requests/add_actions_log?kwargs={"res_id": ${trainingID},"res_model": "hr.training.public","employee_id":${mEmpID},"description":" لقد تم تم إرسال طلب دورات داخلية  بنجاح " }`;
          // console.log('log send request', logEvent);

          fetch(logEvent, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => {
              // console.log('RESPONSE send aothorization ---->', response);
              response.json();
            })
            .then((responseData) => {
              // console.log('send aothorization ---->', responseData);
            });

          setState({ ...state, isLoading: false, showModal: true });
        }
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
    setModal2(false);
  };

  const approveRequest = async () => {
    setModal2(false);
    setState({ ...state, isLoading: true });

    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');

    if (groupIds) {
      groupIds = JSON.parse(groupIds);
    }

    if (groupIds.indexOf(19) > -1) {
      mAction = 'dm';
    }
    if (mAction) {
      let data = {
        id: state.formData.id,
        action: mAction,
      };

      // dispatch(loadingAction.commonLoader(true));
      dispatch(mApprovalAction.approveInternalCourses(data, accessToken));
      setState({ ...state, showModal: true, isLoading: false });
      setTimeout(() => {
        setState({ ...state, showModal: false });
        props.navigation.goBack();
      }, 4000);
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
      setState({ ...state, isLoading: true });

      setReasonInputVisible(false);

      let data = {
        id: item.id,
        reason: { refuse_reason: state.reason },
      };
      dispatch(loadingAction.commonLoader(true));
      setState({ ...state, showModal: true, isLoading: false });
      setTimeout(() => {
        setState({ ...state, showModal: false });
        props.navigation.goBack();
      }, 4000);

      dispatch(mApprovalAction.rejectInternalCourses(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: 'السبب / التعليق مطلوب',
      });
    }
  };
  return (
    state.formData && (
      <KeyboardAwareScrollView>
        <View style={AppStyle.pageBody}>
          <OrderViewItem
            title1="تاريخ الترشح"
            title2={moment(state.formData.date).format('D-MM-Y')}
            icon={require('../../../assets/images/order/date.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />

          <OrderViewItem
            title1="رقم الطلب"
            title2={state.formData.number}
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="إسم الموظف"
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
            title1="الدورة"
            title2={
              state.formData.training_id ? state.formData.training_id[1] : null
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          {state.formData.refuse_reason ? (
            <OrderViewItem
              title1="سبب الإلغاء"
              title2={state.formData.refuse_reason}
              icon={require('../../../assets/images/order/subject.png')}
              title2Style={{
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : null}

          <OrderDateViewItem
            title1="التاريخ"
            startDate={moment(state.formData.date_from).format('DD-MM-YYYY')}
            endDate={moment(state.formData.date_to).format('DD-MM-YYYY')}
            duration={state.formData.number_of_days}
            icon={require('../../../assets/images/order/date.png')}
          />
          <OrderViewItem
            title1="النوع"
            title2={state.formData.type === 'international' ? 'دولي' : 'محلي'}
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="القيمة"
            title2={
              // (state.formData.currency_id
              //   ? state.formData.currency_id[1] + " "
              //   : "-") +
              state.formData.amount
                ? state.formData.amount
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                : '--'
            }
            icon={require('../../../assets/images/order/category.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <OrderViewItem
            title1="مركز التدريب"
            title2={state.formData.training_center}
            icon={require('../../../assets/images/order/id.png')}
            title2Style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          {!editableData && (
            <View style={{ flex: 1 }}>
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
                  marginTop: 20,
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
      </KeyboardAwareScrollView>
    )
  );
};

export default FormInternalCourses;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginVertical: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
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
    fontFamily: '29LTAzer-Regular',
  },
  mandateTypebtn: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: '#90909080',
    borderRadius: 6,
    width: '49%',
  },
  mandateTypeText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 45,
    minHeight: 45,
    borderRadius: 6,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
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
  viewerValueText: {
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    color: '#20547A',
    fontFamily: '29LTAzer-Regular',
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
});
