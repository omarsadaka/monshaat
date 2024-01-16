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

const CommonConfirmation = props => {
  return (
    <View>
      <Overlay
        visible={props.visible}
        onClose={props.onConfirm}
        onCancel={props.onCancel}
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
          {props.close || props.onCancel ? (
            <View />
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
            {props.text ? props.text : 'سوف تقوم بإرسال الطلب، هل أنت متأكد؟'}
          </Text>
          <View
            style={{
              width: Dimensions.get('window').width / 3,
              marginTop: hp('4%'),
            }}
          >
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
                onPress={props.onConfirm}
                style={{ paddingVertical: hp('2%') }}
              >
                <Text style={styles.loginBtnText}>نعم</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={props.onCancel}
                style={{ paddingVertical: hp('2%') }}
              >
                <Text style={styles.loginBtnText}>إلغاء</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Overlay>
    </View>
  );
};

export default CommonConfirmation;

const styles = StyleSheet.create({
  loginBtn: {
    width: '100%',
    marginVertical: hp('2%'),
    backgroundColor: '#007598',
    borderRadius: 5,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    backgroundColor: '#007598',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007598',
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
    color: 'grey',
    textAlign: 'center',
  },
  btnDanger: {
    borderColor: '#20547A',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
  },
});
