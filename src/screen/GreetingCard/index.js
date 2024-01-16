import CameraRoll from '@react-native-community/cameraroll';
import React, { useRef, useState } from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import CommonFormButton from '../../components/CommonFormButton';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import * as loadingAction from '../../redux/action/loadingAction';

export default function GreetingCard(props) {
  const isLoading = useSelector(state => state.CommonLoaderReducer.isLoading);
  const dispatch = useDispatch();
  const viewRef = useRef();

  const [state, setState] = useState({
    username: '',
    imgSrc: '',
  });

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const savePicture = async () => {
    let url = state.imgSrc;
    if (Platform.OS === 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'gif',
      })
        .fetch('GET', url)
        .then(res => {
          // console.log();
          CameraRoll.saveToCameraRoll(res.path()).then(res => {
            showMessage({
              style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
              type: 'success',
              message: 'تم الحفظ',
            });
          });
        });
    } else {
      CameraRoll.saveToCameraRoll(url).then(res => {
        showMessage({
          style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
          type: 'success',
          message: 'تم الحفظ',
        });
      });
    }
  };

  async function shareCard() {
    RNFetchBlob.fetch('GET', state.imgSrc)
      .then(resp => {
        let base64image = resp.data;
        share('data:image/gif;base64,' + base64image);
      })
      .catch(err => errorHandler(err));
  }
  const share = base64image => {
    let shareOptions = {
      title: 'Title',
      url: base64image,
      subject: 'Subject',
    };
    Share.open(shareOptions)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        // err && console.log(err);
      });
  };
  const onChangeText = (value, type) => {
    if (type == 'username') {
      setState({ ...state, username: value });
    }
  };

  // useEffect(() => {
  //     getGreetingCard();
  // }, []);

  const getGreetingCard = () => {
    dispatch(loadingAction.commonLoader(true));
    //  let username = {name }
    // console.log('USERNAME', state.username);
    fetch(
      `https://greeting.monshaat.gov.sa/greeting/eidaldha/small/` +
        state.username,
      {
        method: 'GET',
      },
    )
      .then(response => {
        // console.log('Responseeeee', response);
        setState({ ...state, imgSrc: response.url });
        dispatch(loadingAction.commonLoader(false));
      })

      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F8F8F8',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <NewHeader
          {...props}
          back={true}
          style={styles.titleFont}
          title=" بطاقة المعايدة"
        />
        <View>
          <Text
            style={{
              fontFamily: '29LTAzer-Bold',
              textAlign: 'center',
              top: 12,
            }}
          >
            إنشاء بطاقة المعايدة
          </Text>

          <KeyboardAwareScrollView>
            <View style={[styles.inputContainer, { marginBottom: hp('7%') }]}>
              <CommonTextInput
                customStyle={true}
                customStyleData={styles.input}
                placeholder="يرجى إدخال الاسم"
                placeholderTextColor="#99B4C8"
                changeText={e => onChangeText(e.toLowerCase(), 'username')}
                value={state.username}
                keyboardType={
                  Platform.OS === 'android' ? 'visible-password' : ''
                }
                secureText={false}
              />
            </View>
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 180, marginVertical: -16 }}>
                  <CommonFormButton
                    {...props}
                    buttonText="إنشاء البطاقة"
                    onPress={getGreetingCard}
                  />
                </View>
                {state.imgSrc ? (
                  <Image
                    style={{
                      width: '100%',
                      height: 220,
                      top: 20,
                      marginTop: 20,
                    }}
                    source={{
                      uri: state.imgSrc,
                    }}
                    resizeMode="stretch"
                  />
                ) : null}
                {isLoading ? <Loader /> : null}
              </View>
              {/* <TouchableOpacity style={styles.generateBtn} >
                                <Text style={styles.generateBtnText}>إنشاء البطاقة </Text>
                            </TouchableOpacity> */}
            </View>
            {/* <View style={{ right: 60, felx: 1, height: 300, width: 30, top: 10 }}>
                            <Image source={require('../../assets/images/giphy.gif')}  ></Image>
                        </View> */}
          </KeyboardAwareScrollView>
          <View style={styles.shareQrContainer}>
            <TouchableOpacity
              onPress={() => savePicture()}
              style={styles.shareQrItem}
            >
              <Text style={styles.shareQrItemText}>تحميل البطاقة</Text>
              <View style={styles.shareQrItemImage}>
                <Image
                  source={require('../../assets/images/download.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareCard} style={styles.shareQrItem}>
              <Text style={styles.shareQrItemText}>مشاركة البطاقة</Text>
              <View style={styles.shareQrItemImage}>
                <Image
                  source={require('../../assets/images/share.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
  container1: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  loginWithBtns: {
    width: '50%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: hp('1.4%'),
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: '90%',
    top: 30,
    paddingRight: wp('4%'),
    alignItems: 'center',
    left: 18,
  },
  input: {
    paddingRight: wp('4%'),
    paddingVertical: hp('2%'),
    width: '100%',
    borderRadius: 10,
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.75%'),
  },
  generateBtn: {
    borderRadius: 10,
    width: '50%',
    paddingVertical: hp('1.5%'),
    backgroundColor: '#007297',
    alignItems: 'center',
    left: 90,
  },
  generateBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  container2: {
    marginBottom: hp('6%'),
    marginTop: hp('8%'),
  },
  topTextContainer: {
    alignItems: 'center',
    // paddingVertical: hp("5%"),
  },
  topText1: {
    fontSize: 18,
    color: '#007297',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
  },
  topText2: {
    fontSize: 18,
    color: '#687D8D',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
  },

  shareQrContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: "yellow",7
    top: 50,
  },
  shareQrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareQrItemText: {
    color: '#20547a',
    fontSize: 14,
    fontFamily: '29LTAzer-Regular',
  },
  shareQrItemImage: {
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
