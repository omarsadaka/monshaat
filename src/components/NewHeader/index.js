import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NotificationSounds, {
  playSampleSound,
} from 'react-native-notification-sounds';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import {
  getCorrespondnatList,
  getCountUnseen,
} from '../../redux/action/messageActions';
import { msgServer } from '../../services';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { useNavigation } from '@react-navigation/native';
const socket = io(msgServer);
const HitSlope = {
  top: 100,
  bottom: 100,
  right: 100,
  left: 100,
};
const NewHeader = (props) => {
  const navigation = useNavigation();
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      const localUser = userProfileData[0];

      msg.reciverId == localUser.id &&
        NotificationSounds &&
        NotificationSounds.getNotifications('notification').then(
          (soundsList) => {
            /*
      Play the notification sound.  complete_name
      pass the complete sound object.
      This function can be used for playing the sample sound
      */
            playSampleSound(soundsList[1]);
            // if you want to stop any playing sound just call:
            // stopSampleSound();
          },
        );
      localUser && dispatch(getCountUnseen(localUser.id));
    });
  }, [NotificationSounds, userProfileData]);

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const insets = useSafeAreaInsets();
  const approveIDs = useSelector(
    (state) => state.HomeMyRequestReducer.approveIDs,
  );
  const notOpnendNotifications = useSelector(
    (state) => state.NotificationsReducer.notificationsList,
  );
  useEffect(() => {
    if (!notOpnendNotifications || !notOpnendNotifications.length) {
      setCount(0);
      return;
    }
    let arr = notOpnendNotifications.filter(
      (el) =>
        el &&
        el.record[0] &&
        'id' in el.record[0] &&
        approveIDs.indexOf(el.record[0].id) > -1,
    );

    setCount(arr.length);
  }, [notOpnendNotifications, approveIDs]);

  const userID = async () => await AsyncStorage.getItem('userid');

  function getGreetingTime() {
    let g = ''; //return g
    let currentHour = parseFloat(moment(new Date()).format('HH'));
    if (currentHour >= 4 && currentHour < 12) {
      g = 'صباح الخير';
    } else if (currentHour >= 12 && currentHour < 17) {
      g = 'طاب مسائك';
    } else if (currentHour >= 17) {
      g = 'مساء الخير';
    } else {
      g = 'صباح الخير';
    }
    return g;
  }
  return props.back ? (
    <ImageBackground
      source={require('../../assets/images/bgheader.png')}
      style={[styles.backgroundContainer, { paddingTop: insets.top }]}
    >
      {!props.isRequired ? (
        <View
          style={{
            flexDirection: 'row-reverse',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              // if (props.isAllOrder) {
              //   props.navigation.navigate('Home');
              // } else {
              props.navigation.goBack();
              props.fetchMessage &&
                dispatch(
                  getCorrespondnatList(userProfileData[0].id, accessToken),
                );
              // }
            }}
          >
            <Text style={styles.backgroundBackText}>
              {props.title ? props.title : ''}
            </Text>
            <IconFe name="chevron-right" size={25} color="#fff" />
          </TouchableOpacity>
          {props.hasToolTip && (
            <MaterialCommunityIcons
              size={30}
              color="white"
              name="dots-vertical"
              style={{ paddingTop: 5, marginLeft: 5 }}
              onPress={props.onToolTipPress}
              // style={{ alignSelf: "flex-end" }}
            />
          )}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.backgroundBackText}>
            {props.title ? props.title : ''}
          </Text>
          {/* <IconFe name="chevron-right" size={25} color="#fff" /> */}
        </View>
      )}
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require('../../assets/images/bgheader2.png')}
      style={[styles.backgroundContainer, { paddingTop: insets.top }]}
    >
      {userProfileData.length && userProfileData[0].image ? (
        <View
        // onPress={() =>
        //   props.navigation.navigate('Profile', {
        //     profileData: userProfileData[0],
        //     comeFfrom: 'loogeduser',
        //   })
        // }
        >
          <Image
            source={{
              uri: `data:image/jpeg;base64,${userProfileData[0].image}`,
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View
        // onPress={() =>
        //   props.navigation.navigate('Profile', {
        //     profileData: userProfileData[0],
        //     comeFfrom: 'loogeduser',
        //   })
        // }
        >
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
      )}
      <View style={{ justifyContent: 'center', marginHorizontal: 8 }}>
        <Text style={styles.morningText}>{getGreetingTime()}</Text>
        <Text style={styles.nameText}>
          {userProfileData[0] ? userProfileData[0].complete_name : ''}
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={HitSlope}
        onPress={() => {
          props.navigation.navigate('Notifications');
          AnnalyticsFirebase('Bell_Nofication_Screen');
        }}
        style={styles.notificationContainer}
      >
        <Image
          source={require('../../assets/images/bell.png')}
          style={styles.bell}
          resizeMode="cover"
        />
        {count !== 0 && (
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 15 / 2,
              backgroundColor: '#FFFFFF',
              marginTop: -23,
              marginLeft: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#40547F',
                textAlign: 'center',
                fontSize: 9,
                // textAlignVertical: 'center',
                fontFamily: '29LTAzer-Black',
              }}
            >
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default NewHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 60,
  },
  notificationDot: {
    backgroundColor: 'red',
    height: 9,
    width: 9,
    borderRadius: 4.5,
    position: 'absolute',
    right: 8,
    bottom: 15,
  },
  backgroundContainer: {
    flexDirection: 'row-reverse',
    paddingVertical: 28,
    paddingHorizontal: 8,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    // height:130
  },
  backgroundBackText: {
    fontSize: Dimensions.get('window').width * 0.05,
    // fontWeight: "bold",
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: '29LTAzer-Medium',
    marginVertical: 8,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 5,
  },
  morningText: {
    // fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: '29LTAzer-Medium',
    fontSize: 16,
    textAlign: 'right',
    top: 9,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: '29LTAzer-Medium',
    top: Platform.OS == 'ios' ? 2 : -3,
  },
  notificationContainer: {
    position: 'absolute',
    right: 20,
  },
  bell: {
    width: 20,
    height: 25,
  },
});
