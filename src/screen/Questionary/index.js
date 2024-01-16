import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import NewHeader from '../../components/NewHeader';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { ClearPushNotification } from '../../utils/clearPushNotification';
import Overlay from 'react-native-modal-overlay';

const Questionary = (props) => {
  const [ansValue, setAnsValue] = useState([]);
  const [questText, setQuestText] = useState('');
  const [modal2, setModal2] = useState(false);
  const [height, setHeight] = useState(40);
  const [state, setState] = useState({
    questData: null,
    myQuestions: [],
    myAanswers: [],
    isValidated: true,
    showModal: false,
    isLoading: false,
  });
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      ClearPushNotification();
      if (props.route.params && props.route.params.item) {
        let item = props.route.params.item;
        if (item.survey_vals[0].is_required === true) {
          AsyncStorage.setItem('Questionary', JSON.stringify(item));
        }
        setState({ ...state, questData: item });
      }
    });

    return unsubscribe;
  }, [props.navigation, state.questData]);

  const returnAnswers = (questId) => {
    let a = state.questData.values.map((ans) => {
      if (ans[0].question_id[0] === questId) {
        return ans[0];
      }
    });
    return a;
  };

  const handleRating = async () => {
    setState({ ...state, isLoading: true });
    let mEmpID = await AsyncStorage.getItem('empID');
    let questId = state.questData.survey_vals[0].id;
    let url = baseUrl;
    let questType = state.questData.survey_vals[0].answer_type;
    if (questType === 'text') {
      url += `/api/create/portal.question.text.response?values={"employee_id": ${mEmpID}, "answer":"${questText}","question_id":${questId}}`;
    } else {
      let ansValueId = ansValue;
      url += `/api/create/portal.question.response?values={"employee_id": ${mEmpID}, "value_id":${ansValueId}}`;
    }
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
        setState({ ...state, isLoading: false, showModal: true });
        setTimeout(() => {
          setAnsValue(null);
          setQuestText(null);
        }, 2000);
        setTimeout(() => {
          setState({ ...state, showModal: false });
          props.navigation.popToTop();
        }, 3000);
        AsyncStorage.removeItem('Questionary');
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
    setModal2(false);
  };

  const verifDataValidation = () => {
    let questType =
      state.questData && state.questData.survey_vals[0].answer_type;

    if (questType === 'text' && questText.length === 0) {
      setState({ ...state, isValidated: false });
      return;
    } else if (questType === 'choices' && !ansValue) {
      setState({ ...state, isValidated: false });
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'الرجاء إختيار إجابة',
      });
      return;
    }
    setModal2(true);
  };
  function CustRadioButton(props) {
    return (
      <View
        style={[
          {
            height: 18,
            width: 18,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: '#B7B3B3', //props.color,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 5,
            backgroundColor: '#FFFFFF',
            elevation: 2,
            shadowOpacity: 0.1,
            shadowOffset: { width: 1, height: 1 },
          },
          props.style,
        ]}
      >
        {props.selected ? (
          <View
            style={{
              height: 9,
              width: 9,
              borderRadius: 9 / 2,
              backgroundColor: '#797575', //props.color,
            }}
          />
        ) : null}
      </View>
    );
  }

  useEffect(() => {
    const backAction = () => {
      if (
        state.questData &&
        state.questData.survey_vals[0].is_required === true //
      ) {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'danger',
          message: 'يرجى الاجابة! هذا الاستبيان إجباري  ',
        });
      } else if (
        state.questData &&
        state.questData.survey_vals[0].is_required === false
      ) {
        props.navigation.goBack();
        // BackHandler.exitApp();
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [state.questData]);

  const rederOverLay = () => {
    return (
      <Overlay
        visible={state.showModal}
        onClose={() => {
          alert('d');
          setTimeout(() => {
            setState({ ...state, showModal: false });
            props.navigation.popToTop();
          }, 1000);
        }}
        animationType="zoomIn"
        containerStyle={{
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
        childrenWrapperStyle={{
          borderRadius: 30,
          alignItems: 'center',
          width: Dimensions.get('window').width - 100,
        }}
        animationDuration={500}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/gif/1.gif')}
            style={styles.wrapper}
          />
          <Text
            style={{
              color: '#666666',
              fontSize: 25,
              fontFamily: '29LTAzer-Medium',
            }}
          >
            {'تم إرسال المشاركة '}
          </Text>
          <Text
            style={{
              color: '#666666',
              fontSize: 18,
              fontFamily: '29LTAzer-Regular',
              marginTop: 5,
            }}
          >
            {'شكرا لك'}
          </Text>
        </View>
      </Overlay>
    );
  };
  return (
    <LinearGradient
      colors={['#d5e6ed', '#d5e6ed']}
      style={{ flex: 1, backgroundColor: '#00759810' }}
    >
      <NewHeader
        {...props}
        back={true}
        isRequired={props.route.params.isRequired}
        title="الاستبيان"
      />
      <View style={styles.cardContainer}>
        <KeyboardAwareScrollView>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ flex: 1, padding: 8, top: 15, backgroundColor: '#fff' }}
            >
              <Text
                style={{
                  textAlign: 'right',
                  fontFamily: '29LTAzer-Regular',
                  fontSize: 16,
                  color: '#20547A',
                  marginHorizontal: 10,
                }}
              >
                {state.questData && state.questData.survey_vals[0].name}
              </Text>
              {state.questData &&
                state.questData.survey_vals[0].answer_type === 'text' && (
                  <View
                    style={{
                      Bottom: 15,
                      display: 'flex',
                      width: '95%',
                      alignSelf: 'center',
                      top: 10,
                      right: 15,
                      height: 'auto',
                    }}
                  >
                    <TextInput
                      style={[
                        state.isValidated ? styles.input : styles.inputts,
                        { height: height },
                      ]}
                      multiline={true}
                      onChangeText={(text) => {
                        text.length > 0 &&
                          setState({ ...state, isValidated: true });
                        setQuestText(text);
                      }}
                      defaultValue={questText}
                      placeholder="الاجابة"
                      onContentSizeChange={(e) =>
                        setHeight(e.nativeEvent.contentSize.height)
                      }
                    />
                  </View>
                )}
              {state.questData &&
                state.questData.survey_vals[0].answer_type === 'choices' &&
                returnAnswers(state.questData.survey_vals[0].id).map((resp) => {
                  return (
                    <View
                      style={
                        {
                          // bottom: 10,
                        }
                      }
                    >
                      <TouchableOpacity
                        onPress={() => setAnsValue(resp.id)}
                        value={ansValue}
                        style={{ marginVertical: 5 }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // right: 0,
                            display: 'flex',
                            alignSelf: 'flex-end',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: '29LTAzer-Regular',
                              textAlign: 'right',
                              // top: 10,
                              marginRight: 5,
                              color: '#20547A',
                            }}
                          >
                            {resp.name}
                          </Text>
                          <CustRadioButton
                            color={'#20547A'}
                            selected={resp.id == ansValue}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              {/* <View
                style={{
                  width: '40%',
                  display: 'flex',
                  alignSelf: 'center',
                }}
              >
                <CommonFormButton
                  {...props}
                  onPress={() => verifDataValidation()}
                  buttonText="إرسال"
                />
              </View> */}
            </View>
            <View
              style={{
                alignItems: 'center',
                marginRight: 10,
                marginTop: Dimensions.get('window').height * 0.023,
              }}
            >
              <View
                style={{
                  width: Dimensions.get('window').width * 0.06,
                  height: Dimensions.get('window').width * 0.06,
                  borderRadius: (Dimensions.get('window').width * 0.06) / 2,
                  borderColor: '#2367AC',
                  borderWidth: 2,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Dimensions.get('window').width * 0.03,
                    textAlign: 'center',
                    fontFamily: '29LTAzer-Bold',
                    color: '#2367AC',
                    marginTop:
                      Platform.OS == 'ios'
                        ? Dimensions.get('window').height * 0.005
                        : null,
                  }}
                >
                  {'1'}
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  // height: 60,
                  flex: 1,
                  backgroundColor: '#A3A0A0',
                  marginTop: 4,
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: '30%',
              display: 'flex',
              alignSelf: 'center',
            }}
          >
            <CommonFormButton
              {...props}
              onPress={() => verifDataValidation()}
              buttonText="إرسال"
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      {state.isLoading ? (
        <View style={{ justifyContent: 'center' }}>
          <CustomActivityIndicator
            modalVisible={true}
          ></CustomActivityIndicator>
        </View>
      ) : null}
      {/* <CommonPopup
        text={'تم ارسال المشاركه -- شكرا لك'}
        visible={state.showModal}
        autoCLose={true}
        onClose={() => {
          setTimeout(() => {
            setState({ ...state, showModal: false });
            // props.navigation.goBack();
            props.navigation.popToTop();
          }, 1000);
        }}
      /> */}
      {state.showModal ? rederOverLay() : null}
      <CommonPopup
        visible={modal2}
        text={'انت على وشك إرسال الإستفتاء، هل انت متأكد؟'}
        onClose={() => {
          if (!modal2) {
            return;
          }
          let questType = state.questData.survey_vals[0].answer_type;

          if (
            (questType !== 'text' && ansValue.length < 1) ||
            (questType === 'text' && questText.length < 1)
          ) {
            setModal2(false);
          } else {
            handleRating();
          }
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
    </LinearGradient>
  );
};

export default Questionary;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    marginTop: '5%',
    maxHeight: '85%',
  },

  titleFont: {
    fontFamily: '29LTAzer-Regular',
  },
  input: {
    borderColor: '#007598',
    // height: 50,
    minHeight: 40,
    width: '100%',
    textAlign: 'right',
    left: 20,
    // paddingRight: wp("2%"),
    fontFamily: '29LTAzer-Regular',
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    paddingVertical: 2,
  },
  inputts: {
    borderColor: 'red',
    // height: 50,
    width: '100%',
    textAlign: 'right',
    left: 20,
    // paddingRight: wp("2%"),
    fontFamily: '29LTAzer-Regular',
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
  },
  wrapper: {
    width: 120,
    height: 120,
    zIndex: 4000,
  },
});
