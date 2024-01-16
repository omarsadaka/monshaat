import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CommonFormButton = (props) => {
  return (
    <LinearGradient
      colors={props.disabled ? ['#bfd8e0', '#bfd8e0'] : ['#007297', '#007297']}
      style={[styles.loginBtn, props.style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <TouchableOpacity
        onPress={props.onPress}
        style={{ paddingVertical: hp('2%') }}
        disabled={props.disabled}
      >
        <Text style={styles.loginBtnText}>
          {props.buttonText === undefined ? 'إرسال الطلب' : props.buttonText}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CommonFormButton;

const styles = StyleSheet.create({
  loginBtn: {
    width: '100%',
    marginVertical: 32,
    backgroundColor: '#007598',
    borderRadius: 5,
  },
  loginBtnText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
});
