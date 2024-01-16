import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { BankBasicForm } from './BankBasicForm';
import { IdeaView } from './IdeaView';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import CommonDropdown from '../../components/CommonDropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import { pick } from '../../services/AttachmentPicker';
import CommonPopup from '../../components/CommonPopup';
import IconFe from 'react-native-vector-icons/Feather';
import { act } from 'react-test-renderer';
import { showMessage } from 'react-native-flash-message';
var _ = require('lodash');
const AnimatedView = Animated.View;
const QuestBank = (props) => {
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const [activeTab, setActiveTab] = useState('NEWEST');
  const [isloading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [empID, setEmpId] = useState();
  const [iseIdeasLoading, setIsIdeasLoading] = useState(true);
  const fall = useRef(new Animated.Value(1));
  const sheetRef = useRef(null);
  const [bs, setBs] = useState('new');
  const [bsShowm, setBsShown] = useState(false);
  const [publishInMobile, setPublishInMobile] = useState(false);
  const [publishInMobile2, setPublishInMobile2] = useState(false);
  const [publishInMobile3, setPublishInMobile3] = useState(false);

  const [selected, setSelected] = useState(true);
  const [validated, seValidated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('title');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [purpose2, setPurpose2] = useState('');
  const [purpose3, setPurpose3] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [showAddView, setShowAddView] = useState(false);
  const [popup, setPopup] = useState(false);
  const keyboardVerticalOffset =
    Platform.OS == 'ios' ? Dimensions.get('window').height * 0.28 : 0;
  const [state, setState] = useState({
    filename: [],
    arrayData: [],
    hideName: false,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Ideas_Bank_Screen');
    }
  }, [isFocused, isloading]);

  useEffect(() => {
    (async () => {
      let mEmpID = await AsyncStorage.getItem('empID');
      setEmpId(JSON.parse(mEmpID));
    })();
  }, [isloading]);

  const submitIdea = async () => {
    if (!department || !description) {
      seValidated(true);

      // showMessage({
      //   style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
      //   type: 'danger',
      //   message: 'أدخل البيانات الإجبارية',
      // });
      return;
    }

    if (sending) {
      return;
    }
    // setShowAddView(false);
    sheetRef.current.snapTo(1);
    seValidated(false);
    setSending(true);
    setIsLoading(true);
    let mEmpID = await AsyncStorage.getItem('empID');

    let url = `${baseUrl}/api/create/portal.reflection?values={"name": "${name}","description":"${encodeURIComponent(
      description,
    )}","employee_id":"${mEmpID}","publish_in_mobile":true,"type":"${
      selected ? 'internal' : 'external'
    }","purpose":"${purpose},${purpose2},${purpose3}","service_management_id":"${department}", "is_not_show_name":${
      state.hideName
    }}`;

    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setName('');
        setDescription('');
        setPurpose('');
        setPublishInMobile('');
        setPublishInMobile2('');
        setPublishInMobile3('');
        setDepartment('');
        setState({
          ...state,
          filename: [],
        });
        if (state.arrayData?.length > 0) {
          const formBody = new FormData();
          state.arrayData.forEach((fileItem) => {
            formBody.append('files', fileItem);
          });
          let url =
            baseUrl +
            '/api/attachments/upload?res_model=portal.reflection&res_id=' +
            responseData[0];
          // let secretUrl = await EncryptUrl(url, true);

          await fetch(url, {
            method: 'POST',
            body: formBody,
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'multipart/form-data',
            },
          }).then((uploadRes) => {
            setState({ ...state, arrayData: [], filename: [] });
            getIdeas();
            setVisible(true);
          });
        } else {
          setVisible(true);
          getIdeas();
        }
        setIsLoading(false);
        setSending(false);
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
  };
  const getServices = async () => {
    let url = `${baseUrl}/api/call/all.requests/retrieve_service_related_management?kwargs={}`;

    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        let data = [];
        responseData.map((item) => {
          data.push({
            id: item.id,
            value: item.id,
            label: item.department_services,
          });
        });
        setDepartments(data);
        // setDepartment(data[0].value);
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
  };
  useEffect(() => {
    getServices();
  }, []);
  const addFile = async () => {
    if (Platform.OS === 'ios') {
      return AddFileAsync();
    }
    checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
      .then((statuses) => {
        if (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'denied') {
          //
        } else if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'blocked'
        ) {
          // console.log('permission denied');
        } else {
          AddFileAsync();
        }
        if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
            RESULTS.UNAVAILABLE &&
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
            RESULTS.GRANTED
        ) {
          requestMultiple([
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ]).then((statuses) => {
            if (
              statuses['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
            ) {
              AddFileAsync();
            }
          });
        }
      })
      .catch((e) => {
        isBlocked = true;
        // console.log('permission denied');
      });
  };
  AddFileAsync = async () => {
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

  const removeFile = (name) => {
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

  SuggestedHeader = () => (
    <View style={styles.suggestedContainer}>
      {/* <View style={styles.suggestedCounter}>
        <Text style={styles.suggestedCounterText}>
          {activeTab == 'ALL'
            ? ideas.length
            : ideas.filter(el => el.employee_id[0] == empID).length}
        </Text>
      </View> */}
      <View style={styles.container1}>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              backgroundColor: activeTab == 'MY' ? '#008AC5' : '#E7F0F4',
            },
          ]}
          onPress={() => setActiveTab('MY')}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'MY' ? 'white' : '#2367AB',
                paddingLeft: 5,
              },
            ]}
            numberOfLines={1}
          >
            أفكارى
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              backgroundColor: activeTab == 'MOSTLIKED' ? '#008AC5' : '#E7F0F4',
            },
          ]}
          onPress={() => setActiveTab('MOSTLIKED')}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'MOSTLIKED' ? 'white' : '#2367AB',
              },
            ]}
            numberOfLines={1}
          >
            الأكثر إعجابا
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              backgroundColor:
                activeTab == 'MOSTDISCUSSED' ? '#008AC5' : '#E7F0F4',
            },
          ]}
          onPress={() => setActiveTab('MOSTDISCUSSED')}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'MOSTDISCUSSED' ? 'white' : '#2367AB',
              },
            ]}
            numberOfLines={1}
          >
            الأكثر نقاشا
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              backgroundColor: activeTab == 'NEWEST' ? '#008AC5' : '#E7F0F4',
            },
          ]}
          onPress={() => setActiveTab('NEWEST')}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'NEWEST' ? 'white' : '#2367AB',
              },
            ]}
            numberOfLines={1}
          >
            الأحدث
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.suggestedText}>الأفكار المقترحة</Text> */}
    </View>
  );

  const getIdeas = async () => {
    setIsLoading(true);

    let url = `${baseUrl}/api/call/all.requests/get_reflection_bank_values?kwargs={"limit": 150,"page": 1}`;

    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIdeas([]);

        setIdeas(responseData);
        setIsLoading(false);
        setTimeout(() => {
          setIsIdeasLoading(false);
        }, 1000);
      })
      .catch((error) => {
        // console.error('Error:', error);
        setTimeout(() => {
          setIsIdeasLoading(false);
        }, 1000);
      });
  };

  useEffect(() => {
    getIdeas();
  }, [isFocused]);

  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolateNode(fall.current, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });

    return (
      <TouchableWithoutFeedback onPress={() => sheetRef.current.snapTo(1)}>
        <AnimatedView
          pointerEvents={bsShowm ? 'box-only' : 'none'}
          style={[
            styles.shadowContainer,
            {
              opacity: popup ? 0.5 : animatedShadowOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
    );
  };
  const renderContentNew = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : null}
      enabled
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={styles.bsContainer}>
        <ScrollView
          style={{ width: '100%', marginTop: 20 }}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <TouchableOpacity
            style={{ width: 70, height: 3, backgroundColor: 'gray' }}
          />
          <View
            style={{
              width: '95%',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}
          >
            <Text style={styles.newIdea}>فكرة جديدة</Text>
            {/* <MaterialCommunityIcons
              name="airballoon"
              size={20}
              color={'pink'}
            /> */}
            <Image
              source={require('../../assets/images/Group31.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.hint}>
            تذكر أنك غير ملزم بتنفيذ الفكرة.كل ما عليك مشاركتنا ما يدور بداخلك
            من إبداع
          </Text>
          <Text style={styles.who_serve}>من تخدم الفكرة</Text>
          <View
            style={{
              width: '92%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={styles.checkboxContainer}>
              <Checkbox.Android
                status={publishInMobile2 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublishInMobile2(!publishInMobile2);
                  if (publishInMobile2)
                    setPurpose2('المنشآت الصغيرة والمتوسطة');
                  else setPurpose2('');
                }}
                color={'#4B4B4B'}
              />
              <Text style={styles.suggestedText1}>
                المنشآت الصغيرة والمتوسطة
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox.Android
                status={publishInMobile ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublishInMobile(!publishInMobile);
                  if (publishInMobile) setPurpose('موظفى منشآت');
                  else setPurpose('');
                }}
                color={'#4B4B4B'}
              />
              <Text style={styles.suggestedText1}>موظفى منشآت</Text>
            </View>
          </View>
          <View
            style={{ width: '92%', alignItems: 'flex-end', marginBottom: 5 }}
          >
            <View style={styles.checkboxContainer}>
              <Checkbox.Android
                status={publishInMobile3 ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublishInMobile3(!publishInMobile3);
                  if (publishInMobile3) setPurpose3('رواد الأعمال');
                  else setPurpose3('');
                }}
                color={'#4B4B4B'}
              />
              <Text style={styles.suggestedText1}>رواد الأعمال</Text>
            </View>
          </View>
          <Text style={styles.who_serve}>الخدمة ذات العلاقة</Text>
          <View
            style={[
              styles.dropdownContainer,
              { borderColor: !department && validated ? 'red' : '#e2e2e2' },
            ]}
          >
            <CommonDropdown
              itemData={departments}
              bank={true}
              placeholderText={'إختر الخدمة *'}
              onValueChange={(value, index) => {
                setDepartment(value);
              }}
              value={department}
              disablePlaceholder={false}
            />
          </View>
          {/* <Text style={styles.who_serve}>أكتب عنوان لفكرتك</Text>
          <TextInput
            multiline={true}
            placeholder="عنوان الفكرة*"
            placeholderTextColor="#4B4B4B"
            style={[
              styles.input,
              {
                borderColor:
                  validated && !name.trim().length ? 'red' : '#dddddd',
              },
            ]}
            value={name}
            onChangeText={e => setName(e)}
          /> */}
          {/* <Text style={[styles.hint, { color: '#000', fontSize: 18 }]}>
          أكتب وصف لفكرتك
        </Text> */}
          <TextInput
            multiline={true}
            maxLength={200}
            placeholder="أكتب وصف لفكرتك*"
            placeholderTextColor="#4B4B4B"
            style={[
              styles.input,
              {
                height: 80,
                borderColor:
                  validated && !description.trim().length ? 'red' : '#dddddd',
              },
            ]}
            value={description}
            onChangeText={(e) => setDescription(e)}
          />
          <Text style={styles.length}>200 حرف</Text>
          <Text style={[styles.who_serve, { marginTop: 17 }]}>
            هل لديك مرفقات تدعم فكرتك؟
          </Text>
          <TouchableOpacity onPress={addFile} style={styles.addAttatchment}>
            <Entypo name="attachment" size={15} color="#a6c8d4" />
            <Text style={styles.attatchmentText}>إرفقها هنا</Text>
          </TouchableOpacity>
          <View style={{ width: '95%' }}>
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
          </View>
          <TouchableOpacity
            onPress={() => {
              submitIdea();
            }}
            style={[
              styles.sendBtn,
              {
                backgroundColor: '#008AC5',
                // !department || !name || !description ? '#A3A3A3' : '#008AC5',
              },
            ]}
            // disabled={!department || !name || !description}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 15,
                fontFamily: '29LTAzer-Medium',
              }}
            >
              نشر
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );

  const scrollToIndex = (inx) => {
    this.flatListRef.scrollToIndex({ animated: true, index: inx });
  };
  return (
    <LinearGradient
      colors={['#d5e6ed', '#d5e6ed']} //'#ffffff',
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="  بنك الأفكار " />
      <View style={{}}>
        <KeyboardAwareScrollView scrollEnabled={false}>
          <View style={styles.cardContainer}>
            {/* {
              <BankBasicForm
                updateIdeas={getIdeas}
                setIsLoading={setIsLoading}
              />
            } */}
            <TouchableOpacity
              style={{ width: '100%' }}
              onPress={() => {
                // setShowAddView(true);
                setName('');
                setDescription('');
                setPurpose('');
                setPublishInMobile('');
                setPublishInMobile2('');
                setPublishInMobile3('');
                setDepartment('');
                setState({
                  ...state,
                  filename: [],
                });
                sheetRef.current.snapTo(0);
              }}
            >
              <Text style={styles.new}> + فكرة جديدة</Text>
            </TouchableOpacity>
            {SuggestedHeader()}
            <View style={styles.container}>
              <FlatList
                // ListHeaderComponent={() => {
                //   return iseIdeasLoading ? <Loader /> : null;
                // }}
                ref={(ref) => {
                  this.flatListRef = ref;
                }}
                contentContainerStyle={{
                  paddingBottom: 250,
                  width: '100%',
                }}
                ListEmptyComponent={() => {
                  return (
                    <View>
                      {!isloading ? (
                        <View style={{ alignItems: 'center' }}>
                          <Image
                            source={require('../../assets/images/Group138.png')}
                            style={{ width: 200, height: 300 }}
                            resizeMode="contain"
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#007598',
                              fontFamily: '29LTAzer-Regular',
                            }}
                          >
                            لا يوجد أفكار في الفترة الحالية
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.activeTab,
                              {
                                backgroundColor: '#007598',
                                marginTop: 10,
                                paddingHorizontal: 5,
                              },
                            ]}
                            onPress={() => {
                              //  setShowAddView(true)
                              sheetRef.current.snapTo(0);
                            }}
                          >
                            <Text
                              style={[styles.activeTabText, { color: 'white' }]}
                            >
                              أضف فكرة جديدة
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  );
                }}
                onRefresh={getIdeas}
                //  refreshControl={() => null}
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
                refreshing={false}
                data={
                  activeTab == 'NEWEST'
                    ? Array.isArray(ideas)
                      ? ideas
                      : []
                    : activeTab == 'MOSTDISCUSSED'
                    ? _.orderBy(
                        ideas,
                        [
                          function (object) {
                            return object.comments.length;
                          },
                        ],
                        ['desc'],
                      )
                    : activeTab == 'MOSTLIKED'
                    ? _.orderBy(
                        ideas,
                        [
                          function (object) {
                            return object.count_up_ids.length;
                          },
                        ],
                        ['desc'],
                      )
                    : ideas.filter((el) => el.employee_id[0] == empID)
                }
                renderItem={({ item, index, separators }) => (
                  <IdeaView
                    item={item}
                    navigation={props.navigation}
                    refreshIdea={getIdeas}
                    isDetails={true}
                    scrollToIndex={() => scrollToIndex(index)}
                  />
                )}
                scrollEnabled={true}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* {showAddView ? renderContentNew() : null} */}
      {isloading && <Loader />}
      {renderShadow()}
      <CommonPopup
        visible={visible}
        autoCLose={true}
        onClose={() => {
          setTimeout(() => {
            setVisible(false);
          }, 1000);
        }}
      />

      <BottomSheet
        ref={sheetRef}
        callbackNode={fall.current}
        onCloseEnd={() => setBsShown(false)}
        onOpenEnd={() => setBsShown(true)}
        snapPoints={[
          Platform.OS === 'android'
            ? Dimensions.get('window').height / 1.5
            : Dimensions.get('window').height / 1.8,
          -600,
        ]}
        initialSnap={1}
        borderRadius={10}
        nabledContentGestureInteraction={false}
        renderContent={() => renderContentNew()}
      />
    </LinearGradient>
  );
};
export default QuestBank;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  container1: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: Platform.OS == 'android' ? 5 : 8,
    justifyContent: 'center',
    marginHorizontal: 3,
    borderColor: '#008AC5',
    borderWidth: 1,
  },
  activeTabText: {
    textAlign: 'center',
    fontFamily: '29LTAzer-Medium',
    fontSize: 13,
  },
  suggestedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
  },
  suggestedCounter: {
    backgroundColor: '#007297',
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
  },
  suggestedCounterText: {
    fontFamily: '29LTAzer-Regular',
    color: '#fff',
    textAlign: 'right',
  },
  suggestedText: {
    fontFamily: '29LTAzer-Regular',
    color: '#707070',
    textAlign: 'right',
    marginRight: -35,
  },
  container: {
    width: Dimensions.get('window').width * 0.92,
    height: Dimensions.get('window').height * 0.7,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 10,
    marginBottom: 30,
    marginHorizontal: 2,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    elevation: 0.5,
    // shadowOpacity: 0.2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
  },
  new: {
    width: '90%',
    fontFamily: '29LTAzer-Medium',
    color: '#2367AB',
    textAlign: 'left',
    marginHorizontal: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  bsContainer: {
    backgroundColor: '#F9F9F9',
    padding: 10,
    height: '100%',
    width: '100%',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#000',
    shadowRadius: 3,
    // position: 'absolute',
    // bottom: 0,
  },
  newIdea: {
    flex: 1,
    fontFamily: '29LTAzer-Bold',
    color: '#4B4B4B',
    textAlign: 'right',
    marginHorizontal: 10,
    fontSize: 17,
  },
  hint: {
    width: '92%',
    fontFamily: '29LTAzer-Regular',
    color: '#4B4B4B',
    textAlign: 'right',
    fontSize: 14,
    marginTop: 3,
  },
  who_serve: {
    width: '92%',
    fontFamily: '29LTAzer-Medium',
    color: '#4B4B4B',
    textAlign: 'right',
    fontSize: 16,
    marginTop: 7,
  },
  checkboxContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop: hp('1%'),
    left: wp('1%'),
    marginBottom: hp('-1%'),
  },
  suggestedText1: {
    fontFamily: '29LTAzer-Regular',
    color: '#4B4B4B',
    textAlign: 'center',
    fontSize: 14,
  },
  dropdownContainer: {
    borderRadius: 50,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    width: '92%',
    overflow: 'hidden',
  },
  input: {
    borderColor: '#E4E4E4',
    width: '92%',
    height: 40,
    textAlign: 'right',
    textAlignVertical: 'top',
    fontFamily: '29LTAzer-Regular',
    color: '#afa1a1',
    borderRadius: 5,
    borderWidth: Platform.OS == 'ios' ? 1 : 1.5,
    marginVertical: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
  },
  addAttatchment: {
    width: '92%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 5,
  },
  attatchmentText: {
    flex: 1,
    fontFamily: '29LTAzer-Regular',
    color: '#4B4B4B',
    textAlign: 'right',
    marginHorizontal: 10,
  },
  sendBtn: {
    backgroundColor: '#008AC5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 27,
    paddingVertical: 10,
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  length: {
    width: '85%',
    fontFamily: '29LTAzer-Regular',
    color: '#9F9F9F',
    textAlign: 'left',
    fontSize: 12,
    marginTop:
      Platform.OS == 'android'
        ? -Dimensions.get('window').height * 0.03
        : -Dimensions.get('window').height * 0.02,
  },
});
