import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CommonDropdown from '../../components/CommonDropdown';
import CommonPopup from '../../components/CommonPopup';
import { baseUrl } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { EncryptUrl } from '../../services/EncryptUrl';

export const BankBasicForm = ({ updateIdeas, setIsLoading }) => {
  const [selected, setSelected] = useState(true);
  const [publishInMobile, setPublishInMobile] = useState(true);
  const [validated, seValidated] = useState(false);
  const [more, setMore] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');

  const [state, setState] = useState({
    filename: [],
    arrayData: [],
    hideName: false,
  });

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const submitIdea = async () => {
    if (name.trim().length < 1 || description.trim().length < 1) {
      seValidated(true);
      return;
    }
    if (sending) {
      return;
    }
    seValidated(false);
    setSending(true);
    setIsLoading(true);

    let mEmpID = await AsyncStorage.getItem('empID');

    let url = `${baseUrl}/api/create/portal.reflection?values={"name": "${name}","description":"${encodeURIComponent(
      description,
    )}","employee_id":"${mEmpID}","publish_in_mobile":true,"type":"${
      selected ? 'internal' : 'external'
    }","purpose":"${purpose}","service_management_id":"${department}", "is_not_show_name":${
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
      .then(response => response.json())
      .then(async responseData => {
        setMore(false);
        setName('');
        setDescription('');
        setPurpose('');
        if (state.arrayData?.length > 0) {
          const formBody = new FormData();
          state.arrayData.forEach(fileItem => {
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
          }).then(uploadRes => {
            setState({ ...state, arrayData: [], filename: [] });
            updateIdeas();
            setVisible(true);
          });
        } else {
          setVisible(true);
          updateIdeas();
        }
        setIsLoading(false);
        setSending(false);
      })
      .catch(error => {
        // console.error('Error:', error);
      });
  };
  const getServices = async () => {
    setIsLoading(true);

    let url = `${baseUrl}/api/call/all.requests/retrieve_service_related_management?kwargs={}`;

    let secretUrl = await EncryptUrl(url);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(async responseData => {
        let data = [];
        responseData.map(item => {
          data.push({
            id: item.id,
            value: item.id,
            label: item.department_services,
          });
        });
        setDepartments(data);
        setDepartment(data[0].value);
        setIsLoading(false);
      })
      .catch(error => {
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
      .then(statuses => {
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
          ]).then(statuses => {
            if (
              statuses['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
            ) {
              AddFileAsync();
            }
          });
        }
      })
      .catch(e => {
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

  return (
    <View style={styles.bsContainer}>
      <ScrollView>
        <View style={styles.basicFormContainer}>
          <View style={styles.textTitleContainer}>
            <Text style={styles.textTitle}>شاركنا بفكرة</Text>
          </View>
          <TextInput
            multiline={true}
            placeholder="عنوان الفكرة*"
            placeholderTextColor="#afa1a1"
            style={[
              styles.input,
              {
                borderColor:
                  validated && !name.trim().length ? 'red' : '#dddddd',
              },
            ]}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            multiline={true}
            placeholder="وصف الفكرة*"
            placeholderTextColor="#afa1a1"
            style={[
              styles.input,
              {
                height: 80,
                borderColor:
                  validated && !description.trim().length ? 'red' : '#dddddd',
              },
            ]}
            value={description}
            onChangeText={setDescription}
          />
          {more && (
            <View style={styles.moreContainer}>
              <Text style={styles.suggestedText3}>
                نوع الفكرة لمنظومة منشآت
              </Text>
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={publishInMobile ? 'checked' : 'unchecked'}
                  onPress={() => setPublishInMobile(!publishInMobile)}
                  color={'#007598'}
                />
                <Text style={styles.suggestedText1}>خاص بالتطبيق</Text>
              </View>
              <View style={styles.checkBoxView}>
                <Text style={styles.textBox}>
                  عدم إظهار الاسم عند عرض الفكرة{' '}
                </Text>
                <View style={styles.checkboxContainer1}>
                  <Checkbox.Android
                    status={state.hideName ? 'checked' : 'unchecked'}
                    onPress={() =>
                      setState({
                        ...state,
                        hideName: !state.hideName,
                      })
                    }
                    color={'#007598'}
                  />
                </View>
              </View>
              <View style={styles.basicButtonGroupContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSelected(false);
                  }}
                  style={selected ? styles.inactive : styles.active}
                >
                  <Text style={styles.text}>فكرة خارجية</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelected(true);
                  }}
                  style={selected ? styles.active : styles.inactive}
                >
                  <Text style={styles.text}>فكرة داخلية</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.suggestedText}>المستهدف من الفكرة</Text>
              <TextInput
                multiline={true}
                placeholder="اكتب هنا"
                placeholderTextColor="#afa1a1"
                style={[styles.inputTarget, { height: 80 }]}
                value={purpose}
                onChangeText={setPurpose}
              />
              <Text
                style={[
                  styles.suggestedText2,
                  { marginVertical: 5, marginRight: 5 },
                ]}
              >
                الخدمة / الإدارة ذات العلاقة
              </Text>
              <View style={styles.dropdownContainer}>
                <CommonDropdown
                  itemData={departments}
                  bank={true}
                  onValueChange={(value, index) => {
                    setDepartment(value);
                  }}
                  value={department}
                  disablePlaceholder={true}
                />
              </View>
              <TouchableOpacity onPress={addFile} style={styles.addAttatchment}>
                <Entypo name="attachment" size={25} color="#a6c8d4" />
                <Text style={styles.attatchmentText}>ارفق ملف هنا</Text>
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
            </View>
          )}
          <View style={[styles.basicButtonGroupContainer2, { width: '98%' }]}>
            <TouchableOpacity
              onPress={() => submitIdea()}
              style={styles.basicButtonGroupSend}
            >
              <Text style={styles.basicButtonGroupSendText}>إرسال</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMore(!more)}
              style={styles.basicButtonGroupDetails}
            >
              <MaterialCommunityIcons
                name={more ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#8bb7c2"
              />
              <Text style={styles.basicButtonGroupDetailsText}>
                المزيد من التفاصيل
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <CommonPopup
          visible={visible}
          autoCLose={true}
          onClose={() => {
            setTimeout(() => {
              setVisible(false);
            }, 1000);
          }}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  basicFormContainer: {
    borderColor: '#dddddd',
    borderWidth: Platform.OS == 'ios' ? 1 : 1.5,
    padding: 5,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    borderColor: '#dddddd',
    width: '98%',
    height: 40,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: '#afa1a1',
    borderRadius: 5,
    borderWidth: Platform.OS == 'ios' ? 1 : 1.5,
    marginVertical: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#f5f5f5',
  },
  inputTarget: {
    borderColor: '#dddddd',
    width: '98%',
    height: 40,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: '#afa1a1',
    borderRadius: 5,
    borderWidth: Platform.OS == 'ios' ? 1 : 1.5,
    marginVertical: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#f5f5f5',
    top: -5,
  },
  inputValidated: {
    borderColor: 'red',
    width: '98%',
    height: 40,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: '#afa1a1',
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  basicButtonGroupContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    // margin: 10,
    top: -20,
  },
  basicButtonGroupContainer2: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
  },
  basicButtonGroupSend: {
    backgroundColor: '#007297',
    borderRadius: 5,
    padding: 1,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicButtonGroupDetails: {
    backgroundColor: '#fff',
    borderColor: '#007297',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 1,
    width: 140,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  basicButtonGroupSendText: {
    fontFamily: '29LTAzer-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  basicButtonGroupDetailsText: {
    fontFamily: '29LTAzer-Regular',
    color: '#007297',
    textAlign: 'center',
  },
  moreContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '95%',
    marginTop: 10,
  },
  suggestedText: {
    fontFamily: '29LTAzer-Regular',
    color: '#9c8a8a',
    textAlign: 'center',
    top: -10,
  },
  suggestedText3: {
    fontFamily: '29LTAzer-Regular',
    color: '#9c8a8a',
    textAlign: 'center',
  },
  suggestedText1: {
    fontFamily: '29LTAzer-Regular',
    color: '#9c8a8a',
    textAlign: 'center',
  },
  suggestedText2: {
    fontFamily: '29LTAzer-Regular',
    color: '#9c8a8a',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp('1%'),
    left: wp('1%'),
    marginBottom: hp('-1%'),
  },
  inactive: {
    backgroundColor: '#c7c7c7',
    height: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 1,
    width: '48%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  active: {
    backgroundColor: '#007297',
    height: 30,
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 1,
    width: '48%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: '29LTAzer-Regular',
    color: '#ffffff',
    textAlign: 'center',
  },
  addAttatchment: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 5,
  },
  attatchmentText: {
    fontFamily: '29LTAzer-Regular',
    color: '#8bb7c2',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    width: '80%',
    overflow: 'hidden',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingTop: 10,
    width: '80%',
    alignItems: 'flex-end',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  modalTextt: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  hr: {
    height: 0.8,
    width: '112%',
    alignSelf: 'center',
    backgroundColor: '#dbdbdb',
    marginBottom: 20,
  },
  notificationsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: -10,
  },
  notificationImage: {
    width: 23,
    height: 23,
    borderRadius: 5,
    marginLeft: 10,
  },
  notificationsTitleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#424242',
  },
  notificationsButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  notificationsButtonDisplay: {
    backgroundColor: '#11708e',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  notificationsButtonCancel: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11708e',
  },
  notificationsTextDisplay: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#fff',
  },
  notificationsTextCancel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#11708e',
  },
  textTitleContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    height: 30,
  },
  textTitle: {
    backgroundColor: 'white',
    transform: [{ translateY: -15 }],
    fontFamily: '29LTAzer-Regular',
    color: '#666666',
    paddingHorizontal: 5,
  },
  checkboxContainer1: {
    width: wp('6%'),
    height: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: hp('3%'),
  },
  checkBoxView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: hp('2%'),
    marginRight: wp('0.5%'),
  },
  textBox: {
    marginRight: 5,
    color: '#9c8a8a',
    fontFamily: '29LTAzer-Regular',
    marginTop: hp('-1%'),
  },
});
