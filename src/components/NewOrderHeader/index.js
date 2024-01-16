import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

const OrderHeader = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <Text style={styles.type}>{'تقنى'}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={styles.text}>{props.title}</Text>
        <Text style={styles.text2}>{props.title2}</Text>
      </View>
    </View>
  );
};

export default OrderHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: Platform.OS == 'android' ? 10 : 15,
    marginBottom: 10,
  },
  typeContainer: {
    backgroundColor: '#00000029',
    width: 100,
    borderRadius: 20,
    marginHorizontal: 6,
    padding: Platform.OS == 'android' ? 5 : 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#A0A0A0',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
  },
  text2: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Bold',
    fontSize: 14,
    marginTop: Platform.OS == 'android' ? 1 : 5,
  },
  type: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
  },
});
