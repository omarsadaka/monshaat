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
import CommonDropdown from '../../components/CommonDropdown';
import CommonTextInput from '../../components/CommonTextInput';
import Icon2 from 'react-native-vector-icons/Entypo';
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

const ContractOrderDetail = (props) => {
  const { viewType, item } = props.route.params;
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const purchaseContractRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.purchaseContractRequestResponse,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [reason, setReason] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  // const [attachments, setAttachments] = useState([1]);
  const [modal2, setModal2] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const attachment_ids = item.unsigned_pdf_contract
    ? [
        {
          url: item.unsigned_pdf_contract,
          name: 'finalcContractTemplate.pdf',
        },
      ]
    : [];

  useEffect(() => {
    try {
      if (purchaseContractRequestResponse) {
        if (
          typeof purchaseContractRequestResponse === 'object' &&
          purchaseContractRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyContractRequest());
          setShowFinishModal(true);
          // setTimeout(() => {
          //   setState({ ...state, showModal: false });
          // props.navigation.goBack();
          // }, 4000);
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
  }, [purchaseContractRequestResponse]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (item) {
        // console.log('item ', item);
        let url =
          baseUrl +
          `/api/read/last_update?res_model=purchase.contract&res_id=${item.id}`;
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
    if (
      groupIds.indexOf(222) > -1 &&
      item.state === 'financial_purchasing_mgr'
    ) {
      mAction = 'action_financial_purchasing_mgr';
    } else if (groupIds.indexOf(22) > -1 && item.state === 'validate') {
      mAction = 'action_validate';
    } else if (groupIds.indexOf(21) > -1 && item.state === 'authority_owner') {
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
      dispatch(
        PurchaserequestActionPost.reject_purchaseCotract(data, accessToken),
      );
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يجب تعبئة سبب الرفض',
      });
    }
  };

  const getState = (state) => {
    let statusText = '';
    switch (state) {
      case 'draft':
        statusText = 'طلب';
        break;
      case 'dm':
        statusText = 'المدير المباشر';
        break;
      case 'sm':
        statusText = 'مدير القطاع';
        break;
      case 'management_strategy':
        statusText = 'مشرف القطاع في ادارة المشاريع';
        break;
      case 'dmanagement_strategy_mgr':
        statusText = 'مدير مكتب ادارة المشاريع';
        break;
      case 'financial_audit':
        statusText = 'مدقق مالي';
        break;
      case 'financial_department':
        statusText = 'ادارة المالية';
        break;
      case 'authority_owner':
        statusText = 'صاحب الصلاحية';
        break;
      case 'contract_procurement':
        statusText = 'ادارة العقود و المشتريات';
        break;
      case 'waiting':
        statusText = 'طلب توضيح';
        break;
      case 'done':
        statusText = 'اعتمد';
        break;
      case 'cancelled':
        statusText = 'ملغى';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        break;
      case 'under_put':
        statusText = 'تحت الطرح';
        break;
      case 'receiving_offers':
        statusText = 'إستلام العروض';
        break;
      case 'technical_analysis':
        statusText = 'التحليل الفني';
        break;
      case 'check_offers':
        statusText = 'فحص العروض';
        break;
      case 'awarding_baptism':
        statusText = 'الترسية/التعميد';
        break;
      case 'purchase_order':
        statusText = 'أمر الشراء المبدئي';
        break;
      case 'purchase_requisition':
        statusText = 'اتفاقية الشراء';
        break;
      default:
        statusText = state;
        break;
    }
    return statusText;
  };
  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="الطلبات" />
      <View style={AppStyle.cardContainer}>
        <KeyboardAwareScrollView>
          <OrderHeader
            {...props}
            title="طلب تعاقد"
            icon={require('../../assets/images/shopping.png')}
          />
          <View
            style={{
              padding: '3%',
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
                title1="رقم العقد"
                title2={item.name}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <OrderViewItem
                title1="نوع بداية مدة العقد"
                title2={
                  item?.start_duration_type
                    ? item.start_duration_type == 'custom_date'
                      ? 'تاريخ معين'
                      : item.start_duration_type == 'business_date'
                      ? 'تاريخ محضر بدء الأعمال'
                      : item.start_duration_type == 'sign_date'
                      ? 'تاريخ توقيع العقد'
                      : item.start_duration_type
                    : '--'
                }
                icon={require('../../assets/images/order/id.png')}
              />

              <OrderDateViewItem
                title1="التاريخ "
                startDate={
                  item?.date_start_contract
                    ? moment(item?.date_start_contract).format('D-MM-Y')
                    : '--'
                }
                icon={require('../../assets/images/order/date.png')}
                endDate={
                  item?.date_end_contract
                    ? moment(item?.date_end_contract).format('D-MM-Y')
                    : '--'
                }
                duration={
                  item?.contract_duration ? item?.contract_duration : '0'
                }
              />

              <OrderViewItem
                title1="تاريخ توقيع العقد"
                title2={
                  item?.date_sign
                    ? moment(item?.date_sign).format('D-MM-Y')
                    : '--'
                }
                icon={require('../../assets/images/order/date.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <OrderViewItem
                title1="المورد"
                title2={item.partner_id[1]}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              {item?.purchase_request_number ? (
                <OrderViewItem
                  title1="رقم أمر الشراء"
                  title2={item?.purchase_request_number}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              {item?.requisition_number ? (
                <OrderViewItem
                  title1="رقم اتفاقيه الشراء"
                  title2={item.requisition_number}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ) : null}
              <OrderViewItem
                title1="الموظف المسند له"
                title2={
                  item?.employee_assigned_id[1]
                    ? item?.employee_assigned_id[1].split(']')[1]
                    : '--'
                }
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />

              <OrderViewItem
                title1="مسؤول المشتريات"
                title2={item.contract_manager[1].split(']')[1]}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="نوع المشروع"
                title2={
                  item?.project_type == 'material'
                    ? 'تشغيلي'
                    : item?.project_type == 'project'
                    ? 'الخطة الإستراتيجية'
                    : 'دفعة مباشرة'
                }
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="الرقم المرجعى للعقد فى منصة اعتماد"
                title2={item.etimad_reference ? item.etimad_reference : '--'}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="القطاع"
                title2={item?.sector_id ? item?.sector_id[1] : '--'}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="إسم المنافسة"
                title2={item.tender_name}
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              <OrderViewItem
                title1="مبلغ الترسية"
                title2={
                  item?.award_amount
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'ريال'
                }
                icon={require('../../assets/images/order/id.png')}
                title2Style={{
                  backgroundColor: '#FFFFFF',
                }}
              />
              {/* {item.attachment_ids && item.attachment_ids.length > 0 ? (
              <OrderViewAttatchment2
                dispatch={dispatch}
                accessToken={accessToken}
                attatchments={item.attachment_ids}
              />
            ) : (
              <OrderViewItem
                title1="المرفقات"
                title2="لا يوجد مرفق"
                icon={require('../../assets/images/order/attatchments.png')}
              />
            )} */}

              {attachment_ids && attachment_ids.length > 0 ? (
                <OrderViewAttatchment2
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={attachment_ids}
                  isContractOrder={' العقد النهائى'}
                />
              ) : (
                <OrderViewItem
                  title1="نموذج العقد النهائى"
                  title2="لا يوجد نموذج عقد نهائى"
                  icon={require('../../assets/images/order/attatchments.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {item.contract_beginning_attachment_ids &&
              item.contract_beginning_attachment_ids.length > 0 ? (
                <OrderViewAttatchment
                  title3="مرفق محضر بدأ الأعمال"
                  onComplete={() => {}}
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={item.contract_beginning_attachment_ids}
                />
              ) : (
                <OrderViewItem
                  title1="مرفق محضر بدأ الأعمال"
                  title2="لا يوجد مرفق محضر بدأ الأعمال"
                  icon={require('../../assets/images/order/attatchments.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
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
                  // backgroundColor: '#20547a',
                }}
                // disabled={timelineData.length == 0 ? true : false}
              >
                {/* <Icon2
                  name="archive"
                  size={25}
                  color="white"
                  resizeMode="stretch"
                  style={{ right: -90 }}
                /> */}
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
            <View style={{ backgroundColor: '#FCFCFC', width: '100%' }}>
              {viewType == 'approval' ? (
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
                      borderRadius: 5,
                      borderWidth: 1,
                      textAlign: 'center',
                      marginVertical: 22,
                      // height: 40,
                      justifyContent: 'center',
                      paddingVertical: Platform.OS == 'ios' ? 8 : 4,
                    }}
                    onPress={rejectRequest}
                  >
                    {/* <View style={styles.buttonStyle}> */}
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
                      رفض
                    </Text>
                    {/* </View> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '45%',
                      backgroundColor: '#5CB366',
                      borderColor: '#5CB366',
                      borderRadius: 5,
                      borderWidth: 1,
                      textAlign: 'center',
                      marginVertical: 22,
                      // height: 40,
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
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={reasonInputVisible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000055',
            justifyContent: 'center',
            alignItems: 'center',
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
    width: '80%',
    height: 0.5,
    backgroundColor: 'gray',
    marginVertical: 2,
  },
  productText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2.5%'),
    color: '#20547a',
  },
  container: {
    width: Dimensions.get('window').width * 0.82,
    backgroundColor: 'white',
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 7,
    marginVertical: 3,
    marginHorizontal: 2,
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
});
export default ContractOrderDetail;
