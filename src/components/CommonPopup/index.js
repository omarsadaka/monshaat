import LottieView from 'lottie-react-native';
import * as React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Overlay from 'react-native-modal-overlay';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from '../../redux/store';

const CommonPopup = props => {
  const [visible, setVisible] = React.useState(props.visible);
  React.useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);
  React.useEffect(() => {}, [props.visible]);
  const renderContent = () => {
    if (props.autoCLose) {
      return (
        <View>
          <Overlay
            visible={visible}
            onClose={() => props.onClose()}
            closeOnTouchOutside={props.closeOnTouchOutside}
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
            <View style={{ marginTop: -50, paddingBottom: 20 }}>
              <LottieView
                source={require('../../assets/loitte/success.json')}
                autoPlay
                loop={false}
                style={{ width: 200, height: 200 }}
                onAnimationFinish={() => {
                  setTimeout(() => {
                    setVisible(false);
                    props.onClose();
                  }, 1300);
                }}
              />

              <Text style={[styles.textStyle, { marginTop: -40 }]}>
                {props.text ? props.text : 'تم إرسال طلبك بنجاح '}
              </Text>
            </View>
          </Overlay>
        </View>
      );
    } else {
      return (
        <View>
          <Overlay
            visible={visible}
            onClose={props.onClose}
            closeOnTouchOutside={props.closeOnTouchOutside}
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
              {props.close ? (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderColor: 'red',
                    borderRadius: 30,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={25} color="red" name="close" />
                </View>
              ) : (
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderColor: 'green',
                    borderRadius: 30,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../../assets/images/Send.png')}
                    style={{ height: 30, width: 30, tintColor: 'green' }}
                    resizeMode="contain"
                  />
                </View>
              )}

              <Text style={styles.textStyle}>
                {props.text ? props.text : 'تم إرسال طلبك بنجاح '}
              </Text>
              <View
                style={{
                  width: Dimensions.get('window').width / 3,
                  marginTop: hp('4%'),
                }}
              >
                {props.onClose && (
                  <LinearGradient
                    colors={[
                      '#3360A8',
                      '#286BA2',
                      '#21729F',
                      '#197A9B',
                      '#108397',
                      '#019290',
                    ]}
                    style={styles.loginBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        props.onClose();
                        store.dispatch({ type: 'reset-navigate-to' });
                      }}
                      style={{ paddingVertical: hp('2%') }}
                    >
                      <Text style={styles.loginBtnText}>
                        {props.text2 ? props.text2 : 'موافق'}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
                {props.onCancel && (
                  <LinearGradient
                    colors={
                      props.colors
                        ? props.colors
                        : ['#FF0000', '#ed4040', '#ed4040', '#FF0000']
                    }
                    style={[styles.loginBtn, { marginVertical: 0 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TouchableOpacity
                      onPress={props.onCancel}
                      style={{ paddingVertical: hp('2%') }}
                    >
                      <Text style={styles.loginBtnText}>
                        {props.text3 ? props.text3 : 'إلغاء'}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
            </View>
          </Overlay>
        </View>
      );
    }
  };

  return renderContent();
};

export default CommonPopup;

const styles = StyleSheet.create({
  loginBtn: {
    width: '100%',
    marginVertical: hp('2%'),
    backgroundColor: '#007598',
    borderRadius: 5,
  },
  loginBtnText: {
    color: 'white',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  textStyle: {
    marginTop: hp('3%'),
    fontFamily: '29LTAzer-Regular',
    fontSize: 20,
    lineHeight: 22,
    color: '#666666',
    textAlign: 'center',
  },
});
