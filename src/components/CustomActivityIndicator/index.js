import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
const CustomActivityIndicator = ({ modalVisible }) => {
  return (
    <View style={styles.centeredView}>
      <Image
        source={require('../../assets/images/gif/128.gif')}
        style={{ width: 30, height: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default CustomActivityIndicator;
