import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import NewHeader from '../../components/NewHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppStyle } from '../../assets/style/AppStyle';
import OrderHeader from '../../components/OrderHeader';
import OrderViewItem from '../../components/OrderViewItem';
import OrderDateViewItem from '../../components/OrderDateViewItem';

import OrderViewAttatchment2 from '../../components/OrderViewAttatchment2';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';

import Loader from '../../components/loader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import CommonTextInput from '../../components/CommonTextInput';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { useDispatch, useSelector } from 'react-redux';
import * as loadingAction from '../../redux/action/loadingAction';
import * as PurchaserequestActionPost from '../../redux/action/PurchaseRequestAction';
import CommonPopup from '../../components/CommonPopup';
import AsyncStorage from '@react-native-community/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import * as trainingActions from '../../redux/action/trainingAction';

const SalaryMarches = (props) => {
  const { viewType, item } = props.route.params;
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const hrPayslipRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.hrPayslipRequestResponse,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [reason, setReason] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  // const attachment_ids = item.unsigned_pdf_contract
  //   ? [
  //       {
  //         url: item.unsigned_pdf_contract,
  //         name: 'finalcContractTemplate.pdf',
  //       },
  //     ]
  //   : [];

  useEffect(() => {
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
  }, [hrPayslipRequestResponse]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (item) {
        // console.log('item ', item);
        let url =
          baseUrl +
          `/api/read/last_update?res_model=hr.payslip&res_id=${item.id}`;
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
              // console.log('data', data);
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

  const approveRequest = async () => {
    setModal2(false);
    let mAction = null;
    let groupIds = await AsyncStorage.getItem('userGroup');
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
      dispatch(PurchaserequestActionPost.approve_hr_payslip(data, accessToken));
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
    if (reason) {
      setReasonInputVisible(false);
      let data = {
        id: item.id,
        reason: { refuse_reason: reason },
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(PurchaserequestActionPost.reject_hr_payslip(data, accessToken));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب تعبئة سبب الرفض',
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingVertical: 7,
            paddingHorizontal: 7,
            flexDirection: 'row',
            backgroundColor: '#008AC5',
            width: '100%',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            justifyContent: 'flex-end',
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.itemLabel2,
              { color: '#FFFFFF', textAlign: 'right' },
            ]}
          >
            {item.name}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 7,
            paddingHorizontal: 5,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.itemLabel2, { textAlign: 'right' }]}
            >
              {item.number_of_days}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'عدد الأيام : '}
            </Text>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/order/date.png')}
              style={{ width: 10, height: 10, tintColor: '#bfd8e0' }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',

              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.itemLabel2, { textAlign: 'right' }]}
            >
              {item.category == 'allowance'
                ? 'البدلات'
                : item.category == 'changing_allowance'
                ? 'مزايا مالية'
                : item.category == 'difference'
                ? 'فروقات'
                : item.category == 'deduction'
                ? 'الحسميات'
                : item.category == 'retirement'
                ? 'التقاعد'
                : item.category == 'insurance'
                ? 'التأمين'
                : 'صافي الراتب'}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'الفئة : '}
            </Text>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/order/id.png')}
              style={{ width: 10, height: 10, tintColor: '#bfd8e0' }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 7,
            paddingHorizontal: 5,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',

              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Text style={[styles.itemLabel2, { textAlign: 'right' }]}>
              {item.amount} ريال
            </Text>
            <Text
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {' المبلغ : '}
            </Text>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/order/money.png')}
              style={{
                width: 10,
                height: 10,
                tintColor: '#bfd8e0',
                marginHorizontal: 2,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',

              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.itemLabel2, { textAlign: 'right' }]}
            >
              {item.number_of_hours}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'عدد الساعات : '}
            </Text>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/order/date.png')}
              style={{
                width: 10,
                height: 10,
                tintColor: '#bfd8e0',
                marginHorizontal: 2,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { height: Dimensions.get('window').height * 0.85 },
        ]}
      >
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="طلب مسيرات رواتب فردية"
            icon={require('../../assets/images/shopping.png')}
          />
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 11,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                padding: '5%',
                backgroundColor: '#F5F5F5',
                borderRadius: 11,
              }}
            >
              <OrderViewItem
                title1="الموظف"
                title2={item.employee_id ? item.employee_id[1] : '--'}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <OrderViewItem
                title1="القطاع"
                title2={item.sector_id ? item.sector_id[1] : '--'}
                icon={require('../../assets/images/order/id.png')}
              />

              <OrderViewItem
                title1="الإدارة"
                title2={
                  item.administration_id ? item.administration_id[1] : '--'
                }
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <OrderViewItem
                title1="الإداة العامة"
                title2={
                  item.department_global_id
                    ? item.department_global_id[1]
                    : '--'
                }
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="القسم"
                title2={item.department_id ? item.department_id[1] : '--'}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <View style={styles.line} />
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 20,
                }}
              >
                <FlatList
                  data={item.line_ids}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>

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
                }}
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
            </View>
            {viewType == 'approval' ? (
              <View style={{ backgroundColor: '#FCFCFC', width: '100%' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '80%',
                    alignSelf: 'center',
                    backgroundColor: '#FCFCFC',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: '45%',
                      backgroundColor: '#E23636',
                      borderColor: '#E23636',
                      borderRadius: 8,
                      borderWidth: 1,
                      textAlign: 'center',
                      marginVertical: 22,
                      // height: 40,
                      justifyContent: 'center',
                      paddingVertical: Platform.OS == 'ios' ? 8 : 4,
                    }}
                    onPress={rejectRequest}
                  >
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Medium',
                        fontSize: hp('2%'),
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: '#FCFCFC',
                        alignSelf: 'center',
                        textAlignVertical: 'center',
                        color: '#FCFCFC',
                        alignSelf: 'center',
                      }}
                    >
                      إلغاء
                    </Text>
                    {/* </View> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '45%',
                      backgroundColor: '#5CB366',
                      borderColor: '#5CB366',
                      borderRadius: 8,
                      borderWidth: 1,
                      textAlign: 'center',
                      marginVertical: 22,
                      justifyContent: 'center',
                      paddingVertical: Platform.OS == 'ios' ? 8 : 4,
                    }}
                    onPress={() => setModal2(true)}
                  >
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Medium',
                        fontSize: hp('2%'),
                        textAlign: 'center',
                        color: '#FCFCFC',
                        color: '#FCFCFC',
                      }}
                    >
                      قبول
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={reasonInputVisible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            height: Dimensions.get('window').height,
            backgroundColor: '#00000055',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: Dimensions.get('window').height * 0.05,
            marginHorizontal: -30,
          }}
        >
          <View
            style={{
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
            }}
          >
            <View style={{ width: '100%' }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  marginBottom: 16,
                  fontWeight: 'bold',
                  fontFamily: '29LTAzer-Regular',
                }}
              >
                سبب الرفض
              </Text>
              <View
                style={[styles.inputContainer, { backgroundColor: '#ffffff' }]}
              >
                <CommonTextInput
                  customStyle={true}
                  customStyleData={[styles.input, { height: height }]}
                  changeText={(e) => setReason(e)}
                  placeholder="سبب الرفض"
                  keyboardType="text"
                  value={reason}
                  multiline={true}
                  onContentSizeChange={(e) =>
                    setHeight(e.nativeEvent.contentSize.height)
                  }
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={{ ...styles.btnPrimary, width: '45%' }}
                onPress={() => {
                  rejectConfirm();
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  إرسال
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.btnDanger, width: '45%' }}
                onPress={() => {
                  setReasonInputVisible(false);
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  الغاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
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
      </Modal>

      <CommonPopup
        visible={showFinishModal}
        onClose={() => {
          setTimeout(() => {
            setShowFinishModal(false);
            props.navigation.popToTop();
          }, 1000);
        }}
        autoCLose={true}
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
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  line: {
    width: '110%',
    height: 0.5,
    backgroundColor: 'gray',
    marginVertical: 2,
    marginTop: 20,
  },
  productText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2.5%'),
    color: '#20547a',
  },
  container: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'column',
    marginVertical: 5,
  },
  row: {
    flex: 1,
    alignContent: 'center',
  },
  itemLabel: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2%'),
    color: '#20547a',
  },
  btn: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#20547a',
    borderRadius: 8,
    paddingVertical: 5,
    marginVertical: 10,
  },
  btnText: {
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2.5%'),
    color: 'white',
  },
  dropdownContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
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
  inputContainer: {
    width: '100%',
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
  buttonStyle: {
    borderColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    textAlign: 'center',
    marginVertical: 15,
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
  itemLabel: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Medium',
    fontSize: Dimensions.get('window').width * 0.023,
    color: '#4B4B4B',
    fontWeight: '500',
  },
  itemLabel2: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.023,
    color: '#4B4B4B',
  },
});
export default SalaryMarches;
