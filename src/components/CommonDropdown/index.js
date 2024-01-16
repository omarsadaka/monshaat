import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';

const CommonDropdown = (props) => {
  return (
    <View>
      <View>
        <RNPickerSelect
          keyExtractor={(item, index) => index.toString()}
          onValueChange={props.onValueChange}
          items={props.itemData}
          value={props.value}
          useNativeAndroidPickerStyle={false}
          style={
            props.bank
              ? bankStyling
              : props.employee
              ? employeeStyling
              : props.isService
              ? pickerStyling2
              : pickerStyling
          }
          disabled={props.disabled ? props.disabled : false}
          placeholder={
            props.disablePlaceholder
              ? {}
              : {
                  label: props.placeholderText,
                  value: null,
                }
          }
        />
      </View>
      <View
        style={{
          left: wp('2%'),
          position: 'absolute',
          justifyContent: 'center',
          height: 45,
        }}
      >
        <Icon
          name="down"
          size={15}
          color={props.employee ? '#007598' : '#c2c2c2'}
        />
      </View>
    </View>
  );
};

export default CommonDropdown;

const pickerStyling = StyleSheet.create({
  placeholder: {
    color: '#99b4c8',
    fontFamily: '29LTAzer-Regular',
  },
  inputIOS: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 0.3,
    borderColor: '#e3e3e3',
    borderRadius: 6,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
  inputAndroid: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
});
const pickerStyling2 = StyleSheet.create({
  placeholder: {
    color: '#99b4c8',
    fontFamily: '29LTAzer-Regular',
  },
  inputIOS: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 0.3,
    borderColor: '#e3e3e3',
    borderRadius: 6,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
  inputAndroid: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
});
const bankStyling = StyleSheet.create({
  placeholder: {
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Regular',
  },
  inputIOS: {
    color: '#a1a1a1',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 0.3,
    borderColor: '#e3e3e3',
    borderRadius: 50,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
  inputAndroid: {
    color: '#a1a1a1',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 50,
    height: 45,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
});

const employeeStyling = StyleSheet.create({
  placeholder: {
    color: '#007598',
    fontFamily: '29LTAzer-Regular',
  },
  inputIOS: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 0.5,
    borderColor: '#007598',
    borderRadius: 20,
    height: Dimensions.get('window').height * 0.04,
    width: Dimensions.get('window').width * 0.66,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
  inputAndroid: {
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: hp('0.9%'),
    paddingLeft: 8,
    borderWidth: 1,
    borderColor: '#007598',
    borderRadius: 20,
    height: 45,
    width: Dimensions.get('window').width * 0.66,
    textAlign: 'right',
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
  },
});
