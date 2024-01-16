import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal3 from 'react-native-modal';
import { useSelector } from 'react-redux';
import CommonPopup from '../../components/CommonPopup';
import Loader from '../../components/loader';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
const OffersDisplay = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [couponID, setCouponID] = useState(null);
  const [modal2, setModal2] = useState(false);
  const [item, setItem] = useState();
  const [state, setState] = useState({
    requestListData: [],
    statusText: '',
    showModal: false,
  });
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  AsyncStorage.setItem('accessToken', accessToken);

  const renderRequestList = (item, coupID) => {
    let viewItem = {
      status: null,
      lineOne: item,
      addLineOne: null,
      isLoading: false,
    };

    return (
      <View>
        <View style={styles.offersDataContainer}>
          <View style={styles.offersDataContentContainer}>
            <Text numberOfLines={4} style={styles.offersDataDescription}>
              {item.offer_ref}
            </Text>
            <Text style={styles.offersDataDate}>
              {'ينتهي في تاريخ' + ' ' + Moment(item.end_date).format('D-MM-Y')}
            </Text>
          </View>

          <View style={styles.offersDataImageContainer}>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${item.image_of_offer}`,
              }}
              resizeMode="stretch"
              style={styles.offersDataImage}
              // onError={() => setState({ ...state, imageError: false })}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#e3e3e3',
            flexDirection: 'row',
            marginHorizontal: 10,
            flexDirection: 'row-reverse',
            marginVertical: -8,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,

            paddingTop: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
            bottom: 8,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 5,
              borderWidth: 1,
              alignItems: 'center',
              width: 75,
              display: 'flex',
              left: 110,
              top: -10,
              borderColor: '#007598',
              backgroundColor: '#007598',
              paddingVertical: Platform.OS === 'android' ? 0 : 5,
            }}
            onPress={() => {
              setCouponID(item.id);
              setModalVisible(true);
            }}
          >
            <Text style={styles.notificationsTextDisplay}>تطبيق</Text>
          </TouchableOpacity>
          <View>
            <Text
              style={{
                textAlign: 'right',
                fontFamily: '29LTAzer-Bold',
                fontSize: 10,
                color: '#90becc',
                right: 0,
                left: 10,
                top: 15,
              }}
              numberOfLines={2}
            >
              متبقي لديك استخدامات
            </Text>

            <Text
              style={{
                borderTopRightRadius: 7,
                borderBottomLeftRadius: 7,

                borderWidth: 1,
                backgroundColor: 'white',
                borderColor: 'white',
                width: 30,
                top: -25,
                textAlign: 'center',
                left: 35,
              }}
            >
              {item.available_usage}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const sendOffer = async () => {
    setState({ ...state, isLoading: true });
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/call/all.requests/retrieve_usage_coupon?kwargs={"coupon_id": ${couponID},"employee_id": ${mEmpID}}`;

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
        setState({ ...state, isLoading: false });
        // console.log('JSON RETURNED ', responseData);

        if (responseData === false) {
          setModal2(true);
        } else if (responseData) {
          return props.navigation.navigate('QrCodeOffers', {
            item: responseData,
          });
        }
      })
      .catch(error => {
        // console.error('Error:', error);
      });
    setModalVisible(false);
  };
  return (
    <>
      <FlatList
        data={props.requestDataList}
        onRefresh={props.onMRefresh}
        refreshing={false}
        renderItem={({ item }) => renderRequestList(item)}
        keyExtractor={(item, index) => {
          index.toString();
        }}
        contentContainerStyle={props.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
      <Modal3
        isVisible={isModalVisible}
        hasBackdrop={true}
        backdropOpacity={0.7}
        backdropColor="black"
        animationIn="fadeIn"
        animationOut="fadeOut"
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.notificationsTitleContainer}>
              <Text style={styles.notificationsTitleText}>
                العروض و المزايا{' '}
              </Text>
              <Image
                source={require('../../assets/images/logo3.png')}
                style={styles.notificationImage}
              />
            </View>
            <View style={styles.hr}></View>
            <View style={{ alignItems: 'center', display: 'flex', right: 60 }}>
              <Text style={styles.modalText}>سيتم تطبيق العرض</Text>
            </View>
            <View style={styles.notificationsButtonsContainer}>
              <TouchableOpacity
                style={styles.notificationsButtonCancel}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.notificationsTextCancel}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notificationsButtonDisplay}
                onPress={() => {
                  sendOffer();

                  // props.navigation.navigate("QrCodeOffers");
                }}
              >
                <Text style={styles.notificationsTextDisplay}>تأكيد</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText2}>
              بمجرد التأكيد ستكون قد استنفذت إستخدام واحد ولا يمكن إستخدامه مرة
              أخرى
            </Text>
          </View>
        </View>
      </Modal3>
      <CommonPopup
        visible={modal2}
        text={'لقد قمت بإستخدام جميع الكوبونات المتوفرة في هذا العرض'}
        text3={'حسناً'}
        colors={[
          '#3360A8',
          '#286BA2',
          '#21729F',
          '#197A9B',
          '#108397',
          '#019290',
        ]}
        onCancel={() => {
          setModal2(false);
        }}
      />
      {state.isLoading ? <Loader /> : null}
    </>
  );
};
export default OffersDisplay;

const styles = StyleSheet.create({
  offersDataContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
    marginVertical: 15,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: '100%',
    minHeight: 100,
    overflow: 'hidden',
    // width: 305,
    //right: -10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offersDataImageContainer: {
    width: '30%',
    height: '100%',
  },
  offersDataImage: {
    // height:"100%"
    width: undefined,
    height: undefined,
    flex: 1,
  },
  offersDataContentContainer: {
    width: '70%',
    alignItems: 'flex-end',
    padding: 16,
  },
  offersDataDate: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    color: '#90becc',
  },
  offersDataDescription: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#20547a',
  },

  rightContainer: {
    backgroundColor: 'red',
    height: '83%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginTop: 8,
  },
  rightText: {
    color: 'white',
    margin: '6%',
    marginTop: '8%',
    textAlignVertical: 'center',
    textAlign: 'left',
    fontFamily: '29LTAzer-Regular',
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
    width: '95%',
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
  modalText2: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 15,
    color: '#90becc',
    top: 20,
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
    backgroundColor: '#adadad',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#adadad',
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
    color: 'white',
  },
});
