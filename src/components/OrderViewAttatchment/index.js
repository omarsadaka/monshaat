import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { openDocumentService } from '../../services/openDocumentService';

const OrderViewAttatchment = (props) => {
  const { onComplete = () => {} } = props;
  return (
    <View style={props.styleCon ? props.styleCon : styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>
          {props.title3 ? props.title3 : 'المرفقات'}
        </Text>
        <View style={styles.attatchmentsContainer}>
          {props.attatchments.map((attatchment) => (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  openDocumentService(
                    attatchment,
                    props.dispatch,
                    props.accessToken,
                  );
                } else {
                  if (Platform.OS === 'ios') {
                    return fnUpload();
                  }
                  checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
                    .then((statuses) => {
                      if (
                        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
                        'denied'
                      ) {
                        //
                      } else if (
                        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
                        'blocked'
                      ) {
                        console.log('permission denied');
                      } else {
                        openDocumentService(
                          attatchment,
                          props.dispatch,
                          props.accessToken,
                        );
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
                            statuses[
                              'android.permission.READ_EXTERNAL_STORAGE'
                            ] === 'granted'
                          ) {
                            openDocumentService(
                              attatchment,
                              props.dispatch,
                              props.accessToken,
                            );
                          }
                        });
                      }
                    })
                    .catch((e) => {
                      isBlocked = true;
                      console.log('permission denied');
                    });
                }
                onComplete();
              }}
              style={styles.attatchmentsItem}
            >
              <Text
                style={[
                  styles.text2,
                  {
                    fontSize: props.styleCon
                      ? Dimensions.get('window').width * 0.025
                      : 16,
                    color: props.styleCon ? '#7698B1' : '#20547a',
                  },
                ]}
              >
                {props.title3 ? ' محضر بدأ الأعمال' : ' عرض المرفقات'}
              </Text>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/order/images.png')}
                style={[props.styleCon ? styles.icon2 : styles.icon]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Image
        resizeMode="contain"
        source={require('../../assets/images/order/attatchments.png')}
        style={props.style ? props.style : styles.icon}
      />
    </View>
  );
};

export default OrderViewAttatchment;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  attatchmentsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  attatchmentsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 8,
  },
  icon2: {
    width: 20,
    height: 20,
    marginTop: 8,
  },
  text1: {
    fontSize: Dimensions.get('window').width * 0.027,
    textAlign: 'center',
    color: 'gray', //'#7b9eb8',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    textAlign: 'right',
  },
  text2: {
    textAlign: 'center',

    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,

    textAlign: 'right',
    marginHorizontal: 10,
    marginTop: 8,
  },
});
