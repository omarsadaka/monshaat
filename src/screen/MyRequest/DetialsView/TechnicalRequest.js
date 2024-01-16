import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { AppStyle } from '../../../assets/style/AppStyle';
import CommonDropdown from '../../../components/CommonDropdown';
import CommonFormButton from '../../../components/CommonFormButton';
import CommonPopup from '../../../components/CommonPopup';
import CommonTextInput from '../../../components/CommonTextInput';
import Loader from '../../../components/loader';
import NewHeader from '../../../components/NewHeader';
import OrderHeader from '../../../components/OrderHeader';
import OrderViewAttatchment2 from '../../../components/OrderViewAttatchment2';
import OrderViewItem from '../../../components/OrderViewItem';
import * as loadingAction from '../../../redux/action/loadingAction';
import * as technicalAction from '../../../redux/action/technicalAction';
import { baseUrl, getStatus } from '../../../services';
import { pick } from '../../../services/AttachmentPicker';
import { AnnalyticsFirebase } from '../../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../../utils/clearPushNotification';
import base64 from 'react-native-base64';
import RNFS from 'react-native-fs';
import { isProductionMode } from '../../../services';
import { itsmBaseUrl } from '../../../services';
import * as profileAction from '../../../redux/action/profileAction';
import OrderDateViewItem2 from '../../../components/OrderDateViewItem2';

const TechnicalRequest = (props) => {
  let { item, viewType } = props;
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [id4, setId4] = useState(0);
  const [id5, setId5] = useState(0);
  const [category, setCategory] = useState([]);
  const [sub1, setSub1] = useState();
  const [category2, setCategory2] = useState([]);
  const [sub2, setSub2] = useState();
  const [category3, setCategory3] = useState([]);
  const [sub3, setSub3] = useState();
  const [category4, setCategory4] = useState([]);
  const [sub4, setSub4] = useState();
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const editableData = useSelector(
    (state) => state.HomeMyRequestReducer.editable,
  );

  const [state, setState] = useState({
    leaveTypeData: [],
    classificationTypeData: [],
    typeData: [],
    typeSelected: '',
    leaveSelected: '',
    startDate: '',
    endDate: '',
    duration: '',
    comments: '',
    startDateErr: '',
    endDateErr: '',
    showModal: false,
    durationErr: '',
    classificationId: -1,
    classificationSelected: '',
    typeSelectedId: -1,
    categoryData: [],
    categorySelected: '',
    categorySelectedId: -1,
    locationData: [],
    locationSelected: '',
    type: '',
    subType: '',
    priorityData: [
      {
        label: '☆☆☆',
        value: '0',
      },
      {
        label: '☆☆★',
        value: '1',
      },
      {
        label: '☆★★',
        value: '2',
      },
      {
        label: '★★★',
        value: '3',
      },
    ],
    prioritySelected: '',
    subject: '',
    arrayData: [],
    base64Data: [],
    placeholderTicket: '',
    placeholderClass: '',
    filename: [],
    description: '',
    team_id: '',
    teamList: [],
    reason: null,
    isValidated: false,
    visible1: false,
  });
  const [lastUpdate, setLastUpdate] = useState('');
  const [timelineData, setTimelineData] = useState('');
  const [item_data, setItem_data] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [attachments_loader, setAttachments_loader] = useState(true);
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  const isLoading = useSelector((state) => state.CommonLoaderReducer.isLoading);

  const itsmToken = useSelector((state) => state.ProfileReducer.ITSMToken);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Technical_Request_Screen');
    }
    getToken();
  }, [isFocused]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('ITSMTOKEN');
    const data = JSON.parse(token);
    dispatch({
      type: 'ITSM_TOKEN',
      value: data.accessToken,
    });
  };
  useEffect(() => {
    if (props) {
      setState({
        ...state,
        item: item,
      });
      // setAttachments_loader(true);
      let url = `${itsmBaseUrl}monshaat_queryfromincidentnumber?number=${item.id}`;
      let headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + base64.encode('monshaat_mobile_app:M0bile@pp'),
      );
      fetch(url, {
        method: 'GET',
        headers: isProductionMode
          ? {
              Authorization: 'Bearer ' + itsmToken,
            }
          : headers,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 'failure') {
            dispatch(
              profileAction.getJsonWebToken(
                accessToken,
                userProfileData[0].work_email,
              ),
            );
            clearTimeout(timeout);
            let timeout = setTimeout(() => {
              getToken();
            }, 1000);
          }
          var arr = responseData.result;
          const data = [];
          setItem_data(arr);
          if (arr.hasOwnProperty('attachment_base64_data_1')) {
            const obj = {
              id: arr.attachment_id_1,
              name: arr.attachment_file_name_1,
              url: arr.attachment_base64_data_1,
            };
            data.push(obj);
          }
          if (arr.hasOwnProperty('attachment_base64_data_2')) {
            const obj = {
              id: arr.attachment_id_2,
              name: arr.attachment_file_name_2,
              url: arr.attachment_base64_data_2,
            };
            data.push(obj);
          }
          if (arr.hasOwnProperty('attachment_base64_data_3')) {
            const obj = {
              id: arr.attachment_id_3,
              name: arr.attachment_file_name_3,
              url: arr.attachment_base64_data_3,
            };
            data.push(obj);
          }
          if (arr.hasOwnProperty('attachment_base64_data_4')) {
            const obj = {
              id: arr.attachment_id_4,
              name: arr.attachment_file_name_4,
              url: arr.attachment_base64_data_4,
            };
            data.push(obj);
          }
          if (arr.hasOwnProperty('attachment_base64_data_5')) {
            const obj = {
              id: arr.attachment_id_5,
              name: arr.attachment_file_name_5,
              url: arr.attachment_base64_data_5,
            };
            data.push(obj);
          }
          setAttachments(data);
          setAttachments_loader(false);
        })
        .catch((err) => {
          setAttachments_loader(false);
        });
    }
  }, []);

  return (
    <KeyboardAwareScrollView>
      <View style={{ alignItems: 'center', paddingBottom: 32 }}>
        {attachments_loader ? (
          <Loader />
        ) : (
          <View style={{ width: '90%' }}>
            {true && state.item ? (
              <OrderViewItem
                title1="رقم الطلب"
                title2={state.item?.id ? state.item.id : ''}
                icon={require('../../../assets/images/order/id.png')}
              />
            ) : null}
            {true && state.item ? (
              <OrderViewItem
                title1="الحالة"
                title2={
                  getStatus(
                    'TechnicalRequest',
                    state.item?.state ? state.item.state : '',
                  )['statusText']
                }
                icon={require('../../../assets/images/order/type.png')}
              />
            ) : null}

            {true && state.item ? (
              <OrderViewItem
                title1="صاحب الطلب"
                title2={
                  state?.item?.IncidentCaller
                    ? state?.item.IncidentCaller
                    : '--'
                }
                icon={require('../../../assets/images/order/category2.png')}
              />
            ) : null}

            {/* {true && state.item ? (
            <OrderViewItem
              title1="الوقت"
              title2={Moment(state.item?.create_date).format('D-MM-Y hh:mm:ss')}
              icon={require('../../../assets/images/order/date.png')}
            />
          ) : null} */}

            {true && state.item ? (
              <OrderDateViewItem2
                title1="الوقت"
                date={Moment(state.item?.create_date).format('DD-MM-YYYY')}
                icon={require('../../../assets/images/order/date.png')}
                time={Moment(state.item?.create_date).format(' hh:mm:ss a')}
                styleText={{
                  color: 'gray',
                  fontFamily: '29LTAzer-Regular',
                  marginVertical: 2,
                  marginHorizontal: 2,
                  textAlign: 'right',
                  flex: 1,
                }}
              />
            ) : null}

            {false ? (
              <View
                style={[
                  styles.dropdownContainer,
                  {
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: state.isValidated && !sub1 ? 'red' : '#e3e3e3',
                  },
                ]}
              >
                <CommonDropdown
                  itemData={category}
                  onValueChange={(value, index) => {
                    setSub1(value);
                    getSubCategory1(index, value);
                  }}
                  value={sub1}
                  placeholderText={'اختيار الفئة *'}
                  disabled={true}
                />
              </View>
            ) : (
              <OrderViewItem
                title1=" الفئة"
                title2={item_data?.category ? item_data.category : ''}
                icon={require('../../../assets/images/order/category.png')}
              />
            )}

            {false ? (
              category2.length > 1 ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !sub2 ? 'red' : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={category2}
                    onValueChange={(value, index) => {
                      setSub2(value);
                      getSubCategory2(index, value);
                    }}
                    value={sub2}
                    placeholderText={
                      state.placeholderTicket
                        ? state.placeholderTicket
                        : 'اختيار الفئة الفرعية'
                    }
                    disabled={true}
                  />
                </View>
              ) : null
            ) : item_data?.subcategory ? (
              <OrderViewItem
                title1="اختيار الفئة الفرعية"
                title2={item_data?.subcategory}
                icon={require('../../../assets/images/order/type.png')}
              />
            ) : null}

            {false ? (
              category3.length > 1 ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !sub3 ? 'red' : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={category3}
                    onValueChange={(value, index) => {
                      setSub3(value);
                      getSubCategory3(index, value);
                    }}
                    value={sub3}
                    placeholderText={
                      state.placeholderTicket
                        ? state.placeholderTicket
                        : 'اختيار الفئة الفرعية'
                    }
                    disabled={true}
                  />
                </View>
              ) : null
            ) : item_data?.subcategory2 ? (
              <OrderViewItem
                title1="اختيار الفئة الفرعية"
                title2={item_data?.subcategory2}
                icon={require('../../../assets/images/order/type.png')}
              />
            ) : null}
            {false ? (
              category4.length > 1 ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !sub4 ? 'red' : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={category4}
                    onValueChange={(value, index) => {
                      setSub4(value);
                    }}
                    value={sub4}
                    placeholderText={
                      state.placeholderTicket
                        ? state.placeholderTicket
                        : 'اختيار الفئة الفرعية'
                    }
                    disabled={true}
                  />
                </View>
              ) : null
            ) : item_data?.subcategory3 ? (
              <OrderViewItem
                title1="اختيار الفئة الفرعية"
                title2={item_data?.subcategory3}
                icon={require('../../../assets/images/order/type.png')}
              />
            ) : null}
            {/* {editableData && (
                <OrderViewItem
                  title1="الوصف"
                  icon={require('../../assets/images/order/category2.png')}
                />
              )} */}
            {false ? (
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor:
                      state.isValidated && !state.subject.length
                        ? 'red'
                        : '#e2e2e2',
                  },
                ]}
              >
                <CommonTextInput
                  customStyle={true}
                  customStyleData={[styles.input, { height: height + 40 }]}
                  placeholder="وصف المشكلة *"
                  placeholderStyle={{
                    fontFamily: '29LTAzer-Regular',
                  }}
                  changeText={(e) =>
                    setState({ ...state, subject: e, subjectErr: '' })
                  }
                  value={state.subject}
                  editable={false}
                  multiline={true}
                  onContentSizeChange={(e) => {
                    if (e.nativeEvent.contentSize.height > 100) return;
                    setHeight(e.nativeEvent.contentSize.height);
                  }}
                />
              </View>
            ) : (
              <OrderViewItem
                title1="الوصف"
                title2={
                  state.item?.IncidentDescription
                    ? state.item.IncidentDescription
                    : ''
                }
                icon={require('../../../assets/images/order/subject.png')}
              />
            )}

            {false ? (
              <View>
                {state.filename.length
                  ? state.filename.map((item, index) => (
                      <View
                        style={{
                          flexDirection: 'row-reverse',
                          marginBottom: 10,
                        }}
                        key={index}
                      >
                        <View
                          style={{
                            flexDirection: 'row-reverse',
                            backgroundColor: '#efefef',
                            alignSelf: 'stretch',
                            flexGrow: 1,
                            borderRadius: 6,
                          }}
                        >
                          <View style={{ flexGrow: 1, flex: 1 }}>
                            <Text
                              style={{
                                padding: 10,
                                width: '100%',
                                overflow: 'hidden',
                                textAlign: 'right',
                                fontFamily: '29LTAzer-Regular',
                              }}
                              numberOfLines={1}
                            >
                              {item.name}
                            </Text>
                          </View>
                          <IconFe
                            name="paperclip"
                            size={20}
                            color={'#007598'}
                            style={{
                              marginRight: 8,
                              padding: 10,
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            removeFile(item);
                          }}
                        >
                          <IconFe
                            name="x"
                            size={20}
                            color={'red'}
                            style={{
                              marginRight: 8,
                              padding: 10,
                              backgroundColor: '#efefef',
                              borderRadius: 6,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  : null}

                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ]}
                  onPress={false ? addFile : null}
                >
                  <MaterialCommunityIcons
                    name="arrow-collapse-up"
                    size={20}
                    color="#c2c2c2"
                    style={{ paddingLeft: 16 }}
                  />
                  <Text
                    style={{
                      alignSelf: 'stretch',
                      color: '#99b4c8',
                      fontFamily: '29LTAzer-Regular',
                      flexGrow: 1,
                      padding: 10,
                      textAlign: 'right',
                      alignSelf: 'center',
                    }}
                  >
                    المرفقات
                  </Text>
                </TouchableOpacity>
              </View>
            ) : // : attachments_loader ? (
            //   <View>
            //     <OrderViewItem
            //       title1="المرفقات"
            //       title2=""
            //       icon={require('../../../assets/images/order/attatchments.png')}
            //     />
            //     <Loader />
            //   </View>
            // )
            attachments && attachments.length > 0 ? (
              <OrderViewAttatchment2
                dispatch={dispatch}
                accessToken={accessToken}
                attatchments={attachments}
              />
            ) : (
              <OrderViewItem
                title1="المرفقات"
                title2="لا يوجد مرفق"
                icon={require('../../../assets/images/order/attatchments.png')}
              />
            )}
          </View>
        )}
        <View style={{ width: '80%' }}>
          {false ? (
            <CommonFormButton
              {...props}
              onPress={() => {
                setModal2(true);
              }}
              disabled={isInActive}
            />
          ) : null}
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
      <CommonPopup
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setState({ ...state, showModal: false });
          // props.navigation.goBack();
          props.navigation.popToTop();
        }}
      />
      <CommonPopup
        visible={modal2}
        text={'انت على وشك إرسال الطلب، هل انت متأكد؟'}
        onClose={() => {
          if (!modal2) {
            return;
          }
          submitRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default TechnicalRequest;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },

  input: {
    // height: "100%",
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
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
});
