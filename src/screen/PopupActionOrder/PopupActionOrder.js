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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import IconFe from 'react-native-vector-icons/Feather';

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
import Loader from '../../components/loader';
const PopupActionOrder = (props) => {
  const { viewType, item } = props.route.params;
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const workOrderRequestResponse = useSelector(
    (state) => state.PurchaseTypeReducer.workOrderRequestResponse,
  );
  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [reasonInputVisible, setReasonInputVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [reason, setReason] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    try {
      if (workOrderRequestResponse) {
        if (
          typeof workOrderRequestResponse === 'object' &&
          workOrderRequestResponse.length
        ) {
          dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
          setShowFinishModal(true);
          // setTimeout(() => {
          //   setState({ ...state, showModal: false });
          // props.navigation.goBack();
          // }, 4000);
        } else if (
          typeof workOrderRequestResponse === 'object' &&
          Object.keys(workOrderRequestResponse).length
        ) {
          dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: workOrderRequestResponse.message.replace('None', ''),
          });
        }
      }
    } catch (err) {
      dispatch(PurchaserequestActionPost.emptyWorkOrderRequest());
    }
  }, [workOrderRequestResponse]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (item) {
        // console.log('item ', item);
        let url =
          baseUrl +
          `/api/read/last_update?res_model=purchase.order&res_id=${item.id}`;
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
            paddingHorizontal: 7,
            justifyContent: 'flex-end',
            // backgroundColor: 'red',
            width: '100%',
          }}
        >
          <Text
            numberOfLines={1}
            style={[styles.itemLabel2, { textAlign: 'right' }]}
          >
            {item.description}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.itemLabel,
              { marginHorizontal: 3, textAlign: 'right' },
            ]}
          >
            {'الوصف : '}
          </Text>
          <Image
            resizeMode="stretch"
            source={require('../../assets/images/order/id.png')}
            style={{ width: 10, height: 10, tintColor: '#bfd8e0' }}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 7,
            paddingHorizontal: 7,
            justifyContent: 'space-between',
            // backgroundColor: 'red',
            width: '100%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Text style={[styles.itemLabel2, { textAlign: 'right' }]}>
              {item.price_subtotal} ريال
            </Text>
            <Text
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'الإجمالى الفرعى : '}
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
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Text
              numberOfLines={1}
              style={[styles.itemLabel2, { textAlign: 'right' }]}
            >
              {item.product_qty} ريال
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'الكمية : '}
            </Text>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/order/type.png')}
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
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Text numberOfLines={1} style={styles.itemLabel2}>
              {item.price_unit} ريال
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemLabel,
                { marginHorizontal: 3, textAlign: 'right' },
              ]}
            >
              {'سعر الوحدة : '}
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
        </View>
      </View>
    );
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
      item.state === 'gm_financial_purchasing_department'
    ) {
      mAction = 'action_requisition_gm_financial_purchasing_department';
    } else if (groupIds.indexOf(22) > -1 && item.state === 'vp_hr_master') {
      mAction = 'button_requisition_confirm';
    } else if (item.state === 'dm') {
      mAction = 'action_dm';
    } else if (item.state === 'sm') {
      mAction = 'action_sm';
    }
    if (mAction) {
      let data = {
        id: item.id,
        action: mAction,
      };
      dispatch(loadingAction.commonLoader(true));
      dispatch(PurchaserequestActionPost.approveـworkOrder(data, accessToken));
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
      if (item.state == 'dm' || item.state == 'sm')
        dispatch(
          PurchaserequestActionPost.reject_workOrder2(data, accessToken),
        );
      else
        dispatch(PurchaserequestActionPost.reject_workOrder(data, accessToken));
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
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View style={[AppStyle.cardContainer]}>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
          }}
        >
          <KeyboardAwareScrollView>
            <OrderHeader
              {...props}
              title="طلب أمر عمل منبثق"
              icon={require('../../assets/images/shopping.png')}
            />
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: '2%',
              }}
            >
              <View style={styles.rowCon}>
                <OrderViewItem
                  title1="إسم المنافسة"
                  title2={item?.tender_name}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                  styleCon={{ flex: 1 }}
                />
                <View style={{ width: 5 }} />
                <OrderViewItem
                  title1="رقم إتفاقية الشراء"
                  title2={item?.requisition_number}
                  icon={require('../../assets/images/order/id.png')}
                  title2Style={{
                    backgroundColor: '#FFFFFF',
                  }}
                  styleCon={{ flex: 1 }}
                />
                {/* <OrderViewItem
                  title1="رقم إتفاقية الشراء"
                  title2={item?.requisition_number}
                  icon={require('../../assets/images/order/id.png')}
                  styleCon={{ flex: 1 }}
                /> */}
              </View>
              <OrderViewItem
                title1="إسم المنافسة"
                title2={item?.tender_name}
                icon={require('../../assets/images/order/id.png')}
              />
              <OrderViewItem
                title1="تاريخ الطلب"
                title2={moment(item?.ordering_date).format('D-MM-Y')}
                icon={require('../../assets/images/order/date.png')}
              />
              {/* <OrderViewItem
                title1="النوع"
                title2={item?.type}
                icon={require('../../assets/images/order/date.png')}
              /> */}
              <OrderViewItem
                title1="النوع"
                title2={
                  item?.type == 'material'
                    ? 'تشغيلي'
                    : item?.type == 'project'
                    ? 'الخطة الإستراتيجية'
                    : 'دفعة مباشرة'
                }
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
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' ريال'
                }
                icon={require('../../assets/images/order/date.png')}
              />

              <OrderViewItem
                title1="أسلوب الطرح"
                title2={'اتفاقية اطارية'}
                icon={require('../../assets/images/order/date.png')}
              />
              <OrderViewItem
                title1="نوع الإتفاقية"
                title2={
                  item?.type == 'material'
                    ? 'تشغيلى'
                    : item?.type == 'project'
                    ? 'الخطة الإستراتيجية'
                    : 'دفعة مباشرة'
                }
                icon={require('../../assets/images/order/date.png')}
              />
              <OrderViewItem
                title1="المورد"
                title2={item?.partner_id}
                icon={require('../../assets/images/order/date.png')}
              />
              <OrderViewItem
                title1="القيمة المتبقية من الإتفاقية"
                title2={item?.residual_amount
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                icon={require('../../assets/images/order/date.png')}
              />
              {item?.date_end ? (
                <OrderViewItem
                  title1="تاريخ إنتهاء الإتفاقية"
                  title2={
                    item?.date_end
                      ? moment(item?.date_end).format('D-MM-Y')
                      : '--'
                  }
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null}
              <OrderViewItem
                title1="الوصف"
                title2={item?.purchase_request_description}
                icon={require('../../assets/images/order/date.png')}
              />
              <View style={styles.line} />
              <Text style={styles.productText}>المنتجات</Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <FlatList
                  data={item?.order_line}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
              <Text style={styles.orderWorkText}>
                مبلغ أمر العمل مع الضريبة
              </Text>
              <View
                style={[
                  styles.dropdownContainer,
                  {
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: '#e3e3e3',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <Image
                  source={require('../../assets/images/ksa.png')}
                  style={{ width: 40, height: 25, marginHorizontal: 10 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginVertical: '3%',
                    paddingHorizontal: 5,
                    flex: 1,
                    textAlign: 'right',
                  }}
                >
                  {item?.amount_total
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
                    ' ' +
                    'ريال'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  alignSelf: 'center',
                  padding: 8,
                  width: '50%',
                  marginVertical: 10,
                  alignItems: 'center',
                  // flexDirection: 'row-reverse',
                  justifyContent: 'center',
                  borderRadius: 30,
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
                    fontSize: 15,
                    width: '100%',
                    marginRight: 10,
                    // paddingRight: 16,
                    textAlign: 'center',
                    marginHorizontal: 10,
                  }}
                >
                  سجل الموافقات{' '}
                </Text>
              </TouchableOpacity>

              {viewType == 'approval' ? (
                <View
                  style={{
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
              {/* <View
                            style={{
                              display: "flex",
                              alignSelf: "center",
                              padding: 10,
                              top: -5,
                            }}
                          >
                            <View
                              style={{
                                display: "flex",
                                alignSelf: "center",
                                padding: 10,
                                top: -5,
                                flexDirection: "row-reverse",
                              }}
                            >
                              <View
                                style={{
                                  borderRadius: 10,
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
                                  {state.formData.employee_id
                                    ? state.formData.employee_id[1].split(
                                        "]"
                                      )[1]
                                    : ""}{" "}
                                </Text>
                              </View>
                              <View style={{ padding: 3 }} />
                              <View
                                style={{
                                  width: 150,
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
                            </View>
                          </View> */}

              {timelineData.length ? (
                <Timeline
                  data={timelineData}
                  circleSize={15}
                  // renderTime={RenderDetails}
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
              <IconFe name="x-circle" size={23} color={'#E23636'} />
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
    fontSize: hp('2%'),
    color: '#008AC5',
    marginVertical: 5,
  },
  orderWorkText: {
    width: '98%',
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: hp('2%'),
    color: '#20547a',
    marginTop: 10,
  },
  container: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column',
    // paddingVertical: 7,
    // paddingHorizontal: 7,
    marginVertical: 3,
    marginHorizontal: 2,
  },
  row: {
    flex: 1,
    alignContent: 'center',
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
  rowCon: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
export default PopupActionOrder;
