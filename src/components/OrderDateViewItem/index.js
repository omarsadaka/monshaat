import React from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const OrderDateViewItem = (props) => {
  return (
    <View style={props.styleCon ? props.styleCon : styles.container}>
      <View style={styles.textContainer}>
        <Text
          selectable={true}
          style={props.styleText ? props.styleText : styles.text1}
        >
          {props.title1}
        </Text>
        <Image
          resizeMode="stretch"
          source={props.icon}
          style={props.style ? props.style : styles.icon}
        />
      </View>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          width: '100%',
          // height: hp('10%'),
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: 5,
          marginTop: 2,
          borderRadius: 5,
          borderColor: '#FFFFFF',
          borderWidth: 0.5,
        }}
      >
        {props.duration ? (
          <>
            <Text selectable={true} style={[styles.text2]}>
              {props.duration} {props.isLeave ? 'ساعة' : ' أيام'}
            </Text>
            <Text selectable={true} style={[styles.label]}>
              {' المدة'}
            </Text>
          </>
        ) : null}

        {props.endDate ? (
          <>
            <Text selectable={true} style={[styles.text2]}>
              {props.endDate}
            </Text>
            <Text selectable={true} style={[styles.label]}>
              {props.isLeave ? 'إلى الساعة' : 'النهايه'}
            </Text>
          </>
        ) : null}
        {props.startDate ? (
          <>
            <Text selectable={true} style={[styles.text2]}>
              {props.startDate}
            </Text>
            <Text selectable={true} style={[styles.label]}>
              {props.isLeave ? 'من الساعة' : 'البداية'}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default OrderDateViewItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  icon: {
    width: 14,
    height: 17,
    tintColor: '#bfd8e0',
  },
  text1: {
    fontSize: Dimensions.get('window').width * 0.027,
    color: 'gray',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    marginHorizontal: 2,
    textAlign: 'right',
    flex: 1,
  },
  text2: {
    textAlign: 'center',
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.028,
    padding: 5,
    marginTop: 2,
  },
  label: {
    textAlign: 'center',
    color: '#2365A8',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.028,
  },
});
