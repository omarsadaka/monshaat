import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const OrderHeader = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
      <View style={styles.iconContainer}>
        <Image resizeMode="contain" source={props.icon} style={styles.image} />
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
    marginVertical: 10,
  },
  iconContainer: {
    backgroundColor: 'white',
    height: 38,
    width: 38,
    borderRadius: 50,
    marginHorizontal: 10,
    padding: 8,
    shadowColor: '#66ccba',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.41,

    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 8,
    fontSize: 16,
  },
});
