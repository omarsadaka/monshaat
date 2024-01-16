import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { default as moment, default as Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import {
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Timeline from 'react-native-timeline-flatlist';
import Icon2 from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewItem from '../../components/OrderViewItem';
import * as hrActions from '../../redux/action/hrActions';
import * as loadingAction from '../../redux/action/loadingAction';
import { baseUrl, getStatus } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import store from '../../redux/store';
import Feather from 'react-native-vector-icons/Feather';

let viewType = 'new';
let item = null;
const RhLetterRequest = (props) => {
  const [modal2, setModal2] = useState(false);
  const [timelineData, setTimelineData] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [isInActive, setIsInActive] = useState(true);

  const hrRequestResponse = useSelector(
    (state) => state.HrRequestReducer.hrRequestResponse,
  );

  const nav = useSelector((state) => state.NavigateTo.navigeteTo);

  const [state, setState] = useState({
    hrTypeData: [
      {
        id: '1',
        value: 'salary_detail',
        label: 'تعريف بتفاصيل الراتب',
      },
      {
        id: '2',
        value: 'total_salary',
        label: 'تعريف بإجمالي الراتب',
      },
      {
        id: '3',
        value: 'salary_payslip',
        label: 'مسير للراتب',
      },
      {
        id: '4',
        value: 'salary_identification',
        label: 'تعريف بالراتب',
      },
      {
        id: '5',
        value: 'nosalary_identification',
        label: 'تعريف بدون راتب',
      },
      {
        id: '6',
        value: 'salary_check',
        label: 'تثبيت راتب',
      },
    ],
    typeSelectedId: '',
    placeHolderData: '',
    showModal: false,
    notes: '',
    reason: null,
    isValidated: false,
    destination: '',
    create_date: '',
    employee_id: '',
    order_date: '',
  });

  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Hr_Letter_Request_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;

        setState({
          ...state,
          order_date: item.create_date,
          employee_id: item.employee_id,
          partner_id: item.partner_id,
          state: item.state,
          destination: item.destination,
          notes: item.notes,
          type: item.type,
        });
        viewType = props.route.params.viewType;
        let url = `${baseUrl}/api/read/last_update?res_model=salary.identification.request&res_id=${item.id}`;
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
              let newdata = finalArray(data);
              setTimelineData(newdata);
            });
        })();
      }
    });

    return unsubscribe;
  }, [props.navigation]);
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

  const [dropDownId, setDropDownId] = useState(0);
  const handleHrType = (value, index) => {
    setDropDownId(index);
    setState({
      ...state,
      typeSelected: value,
      typeSelectedId: value,
    });
  };

  useEffect(() => {
    if (state.destination.length > 0 && dropDownId) {
      setIsInActive(false);
    } else {
      setIsInActive(true);
    }
  }, [state.destination.length, dropDownId]);

  const handleLetter = async () => {
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    let empID = await AsyncStorage.getItem('empID');
    let { notes, typeSelectedId, destination } = state;
    if (destination.length && typeSelectedId) {
      let data = {
        values: {
          employee_id: empID,
          type: typeSelectedId,
          order_date: moment(new Date()).format('MM/DD/YYYY'),
          notes: notes,
          destination: destination,
          is_from_mobile: true,
        },
        accessToken: accessToken,
      };
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(hrActions.postHrRequest(data));
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
    if (typeof hrRequestResponse === 'object' && hrRequestResponse.length) {
      dispatch(hrActions.emptyHrData());
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'success',
        message: 'قدمت بنجاح',
      });
      setState({ ...state, showModal: true });
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
  }, [hrRequestResponse]);
  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <View style={{ alignItems: 'center' }}>
            <OrderHeader
              {...props}
              title=" خطاب الموارد البشرية"
              icon={require('../../assets/images/Hrletter.png')}
            />
            <View style={{ width: '90%', paddingBottom: 16 }}>
              {!editableData && item ? (
                <OrderViewItem
                  title1="رقم الطلب"
                  title2={item.number}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="تاريخ الطلب"
                  title2={Moment(item.create_date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={getStatus('HRLetter', item.state)['statusText']}
                  icon={require('../../assets/images/order/type.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {!editableData && item && item.refuse_reason ? (
                <OrderViewItem
                  title1="سبب الرفض"
                  title2={item.refuse_reason}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {editableData ? (
                <View>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        borderColor:
                          state.isValidated && !state.destination.length
                            ? 'red'
                            : '#e2e2e2',
                      },
                    ]}
                  >
                    <CommonTextInput
                      customStyle={true}
                      customStyleData={[
                        styles.input,
                        { height: height, paddingVertical: 4 },
                      ]}
                      placeholder="مسمى الجهة الموجهة لها *"
                      changeText={(e) =>
                        setState({
                          ...state,
                          destination: e,
                          destinationErr: '',
                        })
                      }
                      value={state.destination}
                      editable={editableData}
                      multiline={true}
                      onContentSizeChange={(e) =>
                        setHeight(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                </View>
              ) : (
                <OrderViewItem
                  title1="مسمى الجهة الموجهة لها"
                  title2={state.destination ? state.destination : '--'}
                  icon={require('../../assets/images/order/category.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderColor:
                        state.isValidated && !state.typeSelected
                          ? 'red'
                          : '#e2e2e2',
                      borderRadius: 6,
                      borderWidth: 1,
                      backgroundColor: 'white',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.hrTypeData}
                    onValueChange={(value, index) => handleHrType(value, index)}
                    value={state.typeSelected}
                    placeholderText={
                      state.placeHolderData ? state.placeHolderData : 'النوع*'
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="النوع"
                  title2={
                    state.type
                      ? state.hrTypeData.filter(
                          (el) => el.value == state.type,
                        )[0].label
                      : '--'
                  }
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    { height: 'auto', backgroundColor: 'white' },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height2 }]}
                    placeholder="الملاحظات"
                    changeText={(e) =>
                      setState({ ...state, notes: e, discriptionErr: '' })
                    }
                    value={state.notes}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={(e) =>
                      setHeight2(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الملاحظات"
                  title2={state.notes ? state.notes : '--'}
                  icon={require('../../assets/images/order/subject.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              {!editableData && (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      alignSelf: 'center',
                      padding: 8,
                      width: '55%',
                      marginVertical: 10,
                      alignItems: 'center',
                      flexDirection: 'row-reverse',
                      justifyContent: 'center',
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor: '#008AC5',
                      // backgroundColor: '#20547a',
                    }}
                    // disabled={timelineData.length == 0 ? true : false}
                  >
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
                  </TouchableOpacity>

                  <Modal3
                    isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    // animationType={"slide"}
                    hasBackdrop={true}
                    backdropOpacity={0.8}
                    backdropColor="black"
                    animationIn="fadeIn"
                    animationOut="fadeOut"
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
                          <Feather
                            name="x-circle"
                            size={23}
                            color={'#E23636'}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                    {/* </TouchableWithoutFeedback> */}
                  </Modal3>
                </View>
              )}
            </View>
            {editableData ? (
              <View style={{ width: '80%' }}>
                <CommonFormButton
                  {...props}
                  onPress={() => setModal2(true)}
                  disabled={isInActive}
                />
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {}}
      >
        {isLoading ? <Loader /> : null}
      </Modal> */}
      {Platform.OS == 'android' ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoading}
          onRequestClose={() => {}}
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
          setTimeout(() => {
            setState({ ...state, showModal: false });
            props.navigation.popToTop();
            // if (Platform.OS == 'android') props.navigation.goBack();
            // else props.navigation.popToTop();
            // props.navigation.navigate('Home');
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
          editableData ? handleLetter() : null;
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
    </LinearGradient>
  );
};

export default RhLetterRequest;

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
    // paddingVertical: 2,
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
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    justifyContent: 'center',
    marginVertical: 5,
    justifyContent: 'center',
  },
  fullDay: {
    textAlign: 'right',
    color: '#007297',
    fontFamily: '29LTAzer-Regular',
  },
});
