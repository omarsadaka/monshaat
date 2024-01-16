import React from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';

const OrderViewItem = (props) => {
  return (
    // <View style={props.styleCon ? props.styleCon : styles.container}>
    //   <View style={styles.textContainer}>
    //     <Text
    //       selectable={true}
    //       style={props.styleText ? props.styleText : styles.text1}
    //     >
    //       {props.title1}
    //     </Text>
    //     {props.title2 ? (
    //       <Text selectable={true} style={styles.text2}>
    //         {props.title2}
    //       </Text>
    //     ) : null}
    //   </View>
    //   <Image
    //     resizeMode="stretch"
    //     source={props.icon}
    //     style={props.style ? props.style : styles.icon}
    //   />
    // </View>
    <View style={props.styleCon ? props.styleCon : styles.container}>
      <View style={styles.textContainer}>
        {props.isCustody ? (
          <Image
            resizeMode="stretch"
            source={require('../../assets/images/ksa.png')}
            style={{ width: 18, height: 17, marginHorizontal: 10 }}
          />
        ) : null}
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
      {props.title2 ? (
        <Text
          selectable={true}
          style={[
            styles.text2,
            props.title2Style,
            // { borderColor: props?.title2Style ? '#FFFFFF' : 'black' },
          ]}
        >
          {props.title2}
        </Text>
      ) : null}

      {props.hasIcon ? (
        <Image
          resizeMode="stretch"
          source={require('../../assets/images/ksa.png')}
          style={styles.icon2}
        />
      ) : null}
    </View>
  );
};

export default OrderViewItem;

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
  icon2: {
    width: 18,
    height: 17,
    // tintColor: '#bfd8e0',
    position: 'absolute',
    left: 10,
    bottom: 2,
  },
  icon3: {
    width: 18,
    height: 17,
    // tintColor: '#bfd8e0',
    position: 'absolute',
    left: Dimensions.get('window').width * 0.15,
    bottom: 8,
  },
  text1: {
    fontSize: Dimensions.get('window').width * 0.027,
    color: 'gray', // #2365A8
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    marginHorizontal: 5,
    textAlign: 'right',
    flex: 1,
  },
  text2: {
    width: '100%',
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
    fontSize: Dimensions.get('window').width * 0.027,
    textAlign: 'right',
    padding: 5,
    marginTop: 2,
    borderRadius: 5,
    borderColor: '#FFFFFF',
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
    paddingVertical: Dimensions.get('window').height * 0.008,
    backgroundColor: '#FFFFFF',
  },
});
