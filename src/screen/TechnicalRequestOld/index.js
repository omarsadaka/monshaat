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
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as technicalAction from '../../redux/action/technicalAction';
import { baseUrl, getStatus } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';

let viewType = 'new';
let item = null;
const TechnicalRequest = props => {
  const [modal2, setModal2] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [height, setHeight] = useState(40);
  const [height2, setHeight2] = useState(40);
  const [isInActive, setIsInActive] = useState(true);
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);
  const [id3, setId3] = useState(0);
  const [id4, setId4] = useState(0);
  const [id5, setId5] = useState(0);

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

  const dispatch = useDispatch();

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);

  const allClassificationType = useSelector(
    state => state.TechnicalReducer.allClassificationType,
  );

  const allType = useSelector(state => state.TechnicalReducer.allType);

  const allCategories = useSelector(
    state => state.TechnicalReducer.allCategories,
  );
  const allLocations = useSelector(
    state => state.TechnicalReducer.allLocations,
  );
  const mTeamList = useSelector(state => state.TechnicalReducer.teamList);
  const editableData = useSelector(
    state => state.HomeMyRequestReducer.editable,
  );

  const technicalResponse = useSelector(
    state => state.TechnicalReducer.technicalResponse,
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Technical_Request_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        // console.log('LISTENER.ITEM', item);
        // console.log('ITEM.ID', item.id);

        let url = `${baseUrl}/api/read/last_update?res_model=helpdesk.ticket&res_id=${item.id}`;
        //`${baseUrl}/api/read/last_update?res_model=hr.holidays&res_id=06968`;
        // (async () => {
        //   let secretUrl = await EncryptUrl(url);

        //   fetch(secretUrl, {
        //     method: "GET",
        //     headers: {
        //       Authorization: "Bearer " + accessToken,
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //   })
        //     .then((response) => response.json())
        //     .then((data) => {
        //       console.log("lastupdate", data);
        //       let newdata = finalArray(data);
        //       // let removedEl = newdata.shift();
        //       // console.log("REMOVEDEL", removedEl);
        //       console.log("newdata", newdata);
        //       setTimelineData(newdata);
        //     });
        // })();
      }
    });
  });

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

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.item) {
        item = props.route.params.item;
        //console.log(item);
        setState({
          ...state,
          subject: item.name,
          prioritySelected: item.priority,
          typeSelected: item.ticket_type_id[1],
          placeholderTicket: item.ticket_type_id[1],
          classificationSelected: item.class_id[1],
          placeholderClass: item.class_id[1],
          locationSelected: item.location_id[1],
          team_id: item.team_id ? item.team_id[1] : '-',
          description: item.description,
          categorySelected: item.category_id[1],
          attachment_ids: item.attachment_ids,
          reason: item.reason ? item.refuse_reason : '',
        });
        viewType = props.route.params.viewType;
      } else {
        setState({
          ...state,
          locationData: [],
          locationSelected: null,
        });
        dispatch(technicalAction.getTeams(accessToken));
        dispatch(technicalAction.getClassificationType(accessToken));
        dispatch(technicalAction.getLocations(accessToken));
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (typeof technicalResponse === 'object' && technicalResponse.length) {
      dispatch(technicalAction.emptyTechnicalData());
      // setState({ ...state, showModal: true });
    } else if (
      typeof technicalResponse === 'object' &&
      Object.keys(technicalResponse).length
    ) {
      dispatch(technicalAction.emptyTechnicalData());
      showMessage({
        style: { alignItems: 'flex-end' },
        type: 'danger',
        message: technicalResponse.message.replace('None', ''),
      });
    }
  }, [technicalResponse]);

  useEffect(() => {
    if (
      typeof allClassificationType === 'object' &&
      allClassificationType.length
    ) {
      let data = [];
      allClassificationType.map(item => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.name,
          type_ids: item.type_ids,
        });
      });
      setState({
        ...state,
        classificationTypeData: data,
        classificationSelected: null,
        classificationId: null,
      });
    }
  }, [allClassificationType]);

  useEffect(() => {
    if (typeof allType === 'object' && allType.length) {
      let data = [];
      allType.map(item => {
        data.push({
          id: item.id,
          value: item.id,
          label: item.name,
          category_ids: item.category_ids,
        });
      });
      setState({
        ...state,
        typeData: data,
        typeSelected: null,
        typeSelectedId: null,
      });
    }
  }, [allType]);

  useEffect(() => {
    if (typeof allCategories === 'object' && allCategories.length) {
      let data = [];
      allCategories.map(item => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        categoryData: data,
        categorySelected: null,
        categorySelectedId: null,
      });
    }
  }, [allCategories]);

  useEffect(() => {
    if (typeof allLocations === 'object' && allLocations.length) {
      let data = [];
      allLocations.map(item => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        locationData: data,
        locationSelected: null,
      });
    }
  }, [allLocations]);

  useEffect(() => {
    if (typeof mTeamList === 'object' && mTeamList.length) {
      let data = [];
      mTeamList.map(item => {
        data.push({ id: item.id, value: item.id, label: item.name });
      });
      setState({
        ...state,
        teamList: data,
        team_id: null,
      });
    }
  }, [mTeamList]);

  const addFile = async () => {
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        arrayData.push(mFile);
        filename.push({ name: mFile.name });
        setState({ ...state, arrayData, filename });
      }
    } catch (err) {
      throw err;
    }
  };

  const removeFile = name => {
    if (name) {
      let arrayData = [...state.arrayData];
      let filename = [...state.filename];
      let i = filename.indexOf(name);
      if (i > -1) {
        arrayData.splice(i, 1);
        filename.splice(i, 1);
        setState({ ...state, arrayData, filename });
      }
    }
  };

  const handleClassifications = (value, index) => {
    setId1(index);
    setState({
      ...state,
      classificationSelected: value,
      classificationId: value,
    });
    if (index) {
      if (state.classificationTypeData[index - 1]) {
        dispatch(
          technicalAction.getType(
            accessToken,
            state.classificationTypeData[index - 1].type_ids,
          ),
        );
      }
    }
  };

  const handleTypes = (value, index) => {
    setId2(index);
    setState({
      ...state,
      typeSelected: value,
      typeSelectedId: value,
    });
    if (index) {
      if (state.typeData[index - 1]) {
        dispatch(
          technicalAction.getCategories(
            accessToken,
            state.typeData[index - 1].category_ids,
          ),
        );
      }
    }
  };

  const handleCategory = (value, index) => {
    setId3(index);
    setState({
      ...state,
      categorySelected: value,
      categorySelectedId: value,
    });
  };

  const handleLocation = (value, index) => {
    setId5(index);
    setState({
      ...state,
      locationSelected: value,
    });
  };

  const onTeamSelected = (value, index) => {
    //console.log(value, index);
    if (index) {
      setState({
        ...state,
        team_id: value,
      });
    }
  };
  useEffect(() => {
    if (
      state.subject.length > 0 &&
      id1 &&
      id2 &&
      id3 &&
      id4 &&
      // state.team_id &&
      id5 &&
      state.description.length > 0
    ) {
      setIsInActive(false);
    } else setIsInActive(true);
  }, [state]);
  const sendTechnicalRequest = async () => {
    if (isLoading) {
      return;
    }
    setState({ ...state, isValidated: true });
    if (
      state.subject.length &&
      state.classificationId > 0 &&
      state.typeSelectedId > 0 &&
      state.categorySelectedId > 0 &&
      state.prioritySelected &&
      // state.team_id &&
      state.locationSelected &&
      state.description.length
    ) {
      let empID = await AsyncStorage.getItem('empID');
      let userId = await AsyncStorage.getItem('userid');
      let {
        subject,
        classificationId,
        typeSelectedId,
        categorySelectedId,
        locationSelected,
        arrayData,
        prioritySelected,
        description,
        team_id,
      } = state;
      let data = {
        values: {
          employee_id: empID,
          name: subject,
          // team_id: team_id,
          class_id: JSON.stringify(classificationId),
          ticket_type_id: JSON.stringify(typeSelectedId),
          category_id: JSON.stringify(categorySelectedId),
          priority: prioritySelected,
          location_id: locationSelected,
          description: description,
          is_from_mobile: true,
        },
        accessToken: accessToken,
      };
      if (arrayData) {
        data['attachments'] = arrayData;
      }
      setModal2(false);
      dispatch(loadingAction.commonLoader(true));
      dispatch(technicalAction.postTechnicalRequest(data, openModel()));
    } else {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'يرجى إدخال الحقول المطلوبة',
      });
    }
    setModal2(false);
  };

  const openModel = () => {
    setState({ ...state, showModal: true });
  };

  async function openDocument(attachmentIds) {
    checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      async statuses => {
        if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
            RESULTS.GRANTED ||
          Platform.OS === 'ios'
        ) {
          let flag = [];
          await attachmentIds.map(async attachmentId => {
            dispatch(loadingAction.commonLoader(true));
            const { config, fs } = RNFetchBlob;
            let mDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
            let options = {
              fileCache: true,
              addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: true,
                path: mDir + '/helpdesk/', // this is the path where your downloaded file will live in
                description: 'Downloading file.',
              },
            };
            await config(options)
              .fetch(
                'GET',
                baseUrl + '/api/attachment/download/' + attachmentId,
                {
                  Authorization: 'Bearer ' + accessToken,
                },
              )
              .then(res => {
                flag.push(true);
                if (flag.length === attachmentIds.length) {
                  dispatch(loadingAction.commonLoader(false));
                  showMessage({
                    style: {
                      alignItems: 'flex-end',
                      fontFamily: '29LTAzer-Regular',
                    },
                    type: 'success',
                    message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
                  });
                }
              })
              .catch(err => {
                flag.push(false);
                if (flag.length === attachmentIds.length) {
                  dispatch(loadingAction.commonLoader(false));
                  showMessage({
                    style: {
                      alignItems: 'flex-end',
                      fontFamily: '29LTAzer-Regular',
                    },
                    type: 'danger',
                    message: 'غير قادر على تحميل',
                  });
                }
              });
          });
        } else {
          showMessage({
            style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
            type: 'danger',
            message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
          });
        }
      },
    );
  }
  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <View style={{ alignItems: 'center', paddingBottom: 32 }}>
            <OrderHeader
              {...props}
              title="مركز الطلبات والدعم"
              icon={require('../../assets/images/da3m.png')}
            />
            <View style={{ width: '90%' }}>
              {!editableData && item ? (
                <OrderViewItem
                  title1="المعرف"
                  title2={item.id}
                  icon={require('../../assets/images/order/id.png')}
                />
              ) : null}
              {!editableData && item ? (
                <OrderViewItem
                  title1="تاريخ مفتوح"
                  title2={Moment(item.open_date).format('D-MM-Y')}
                  icon={require('../../assets/images/order/date.png')}
                />
              ) : null}

              {!editableData && item ? (
                <OrderViewItem
                  title1="الحالة"
                  title2={
                    getStatus(
                      'TechnicalRequest',
                      item.stage_id ? item.stage_id[1] : '',
                    )['statusText']
                  }
                  icon={require('../../assets/images/order/type.png')}
                />
              ) : null}
              {!editableData && item && item.refuse_reason ? (
                <OrderViewItem
                  title1="سبب الرفض"
                  title2={item.refuse_reason}
                  icon={require('../../assets/images/order/subject.png')}
                />
              ) : null}
              {editableData !== true && viewType === 'approval' ? (
                item ? (
                  <OrderViewItem
                    title1="بتوصية من"
                    title2={item.employee_id[1]}
                    icon={require('../../assets/images/order/id.png')}
                  />
                ) : null
              ) : null}

              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      // height: 40,
                      borderColor:
                        state.isValidated && !state.subject.length
                          ? 'red'
                          : '#e2e2e2',
                    },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height }]}
                    placeholder="الموضوع *"
                    placeholderStyle={{ fontFamily: '29LTAzer-Regular' }}
                    changeText={e =>
                      setState({ ...state, subject: e, subjectErr: '' })
                    }
                    value={state.subject}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={e =>
                      setHeight(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الموضوع"
                  title2={state.subject}
                  icon={require('../../assets/images/order/subject.png')}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.classificationSelected
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.classificationTypeData}
                    onValueChange={(value, index) =>
                      handleClassifications(value, index)
                    }
                    value={state.classificationSelected}
                    placeholderText={
                      state.placeholderClass
                        ? state.placeholderClass
                        : 'التصنيف *'
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="التصنيف"
                  title2={state.placeholderClass}
                  icon={require('../../assets/images/order/category.png')}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.typeSelected
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.typeData}
                    onValueChange={(value, index) => handleTypes(value, index)}
                    value={state.typeSelected}
                    placeholderText={
                      state.placeholderTicket
                        ? state.placeholderTicket
                        : 'النوع *'
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="النوع"
                  title2={state.typeSelected}
                  icon={require('../../assets/images/order/type.png')}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.categorySelected
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.categoryData}
                    onValueChange={(value, index) =>
                      handleCategory(value, index)
                    }
                    value={state.categorySelected}
                    placeholderText="الفئة *"
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الفئة"
                  title2={state.categorySelected}
                  icon={require('../../assets/images/order/category2.png')}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.prioritySelected
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.priorityData}
                    onValueChange={(value, index) => {
                      setId4(index);
                      setState({ ...state, prioritySelected: value });
                    }}
                    value={state.prioritySelected}
                    placeholderText="الأولوية *"
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الأولوية"
                  title2={
                    state.prioritySelected === '0'
                      ? '☆☆☆'
                      : state.prioritySelected === '1'
                      ? '☆☆★'
                      : state.prioritySelected === '2'
                      ? '☆★★'
                      : state.prioritySelected === '3'
                      ? '★★★'
                      : '☆☆☆☆'
                  }
                  icon={require('../../assets/images/order/piority.png')}
                />
              )}
              {/* 
              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.team_id ? "red" : "#e3e3e3",
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.teamList}
                    onValueChange={(value, index) =>
                      onTeamSelected(value, index)
                    }
                    value={state.team_id}
                    placeholderText={
                      state.placeholderClass
                        ? state.placeholderClass
                        : "فريق الدعم الفني *"
                    }
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="فريق الدعم الفني"
                  title2={state.team_id}
                  icon={require("../../assets/images/order/team.png")}
                />
              )} */}

              {editableData ? (
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.locationSelected
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonDropdown
                    itemData={state.locationData}
                    onValueChange={(value, index) =>
                      handleLocation(value, index)
                    }
                    value={state.locationSelected}
                    placeholderText="الموقع *"
                    disabled={!editableData}
                  />
                </View>
              ) : (
                <OrderViewItem
                  title1="الموقع"
                  title2={state.locationSelected}
                  icon={require('../../assets/images/order/location.png')}
                />
              )}

              {editableData ? (
                <View
                  style={[
                    styles.inputContainer,
                    {
                      // height: 'auto',
                      // height: 40,
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        state.isValidated && !state.description
                          ? 'red'
                          : '#e3e3e3',
                    },
                  ]}
                >
                  <CommonTextInput
                    customStyle={true}
                    customStyleData={[styles.input, { height: height2 }]}
                    placeholder="الوصف *"
                    changeText={e =>
                      setState({
                        ...state,
                        description: e,
                        discriptionErr: '',
                      })
                    }
                    value={state.description}
                    editable={editableData}
                    multiline={true}
                    onContentSizeChange={e =>
                      setHeight2(e.nativeEvent.contentSize.height)
                    }
                  />
                </View>
              ) : state.description ? (
                <OrderViewItem
                  title1="الوصف"
                  title2={state.description}
                  icon={require('../../assets/images/order/subject.png')}
                />
              ) : null}

              {editableData ? (
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
                    onPress={editableData ? addFile : null}
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
              ) : state.attachment_ids && state.attachment_ids.length > 0 ? (
                <OrderViewAttatchment
                  dispatch={dispatch}
                  accessToken={accessToken}
                  attatchments={state.attachment_ids}
                />
              ) : (
                <OrderViewItem
                  title1="المرفقات"
                  title2="لا يوجد مرفق"
                  icon={require('../../assets/images/order/attatchments.png')}
                />
              )}
            </View>
            <View style={{ width: '80%' }}>
              {editableData ? (
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
        </KeyboardAwareScrollView>
      </View>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          // Alert.console.log("Modal has been closed.");
        }}
      >
        <Loader />
      </Modal> */}

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
          sendTechnicalRequest();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
    </LinearGradient>
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
    // height: '100%',
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
