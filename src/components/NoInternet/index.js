import React from 'react';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';
import Overlay from 'react-native-modal-overlay';

const NoConnexion = props => {
  return (
    <Overlay
      animationType="zoomIn"
      containerStyle={styles.overlayContainer}
      childrenWrapperStyle={styles.overlayChildrenWrapper}
      animationDuration={500}
      visible
    >
      <Image
        source={require('../../assets/images/NoConnexion.gif')}
        style={styles.image}
      />
      <Text style={styles.text}>لا يوجد إتصال</Text>
    </Overlay>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: '29LTAzer-Regular',
    marginTop: 150,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  overlayContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayChildrenWrapper: {
    borderRadius: 30,
    alignItems: 'center',
    width: Dimensions.get('window').width - 100,
    height: Dimensions.get('window').width - 170,
  },
  image: {
    width: 210,
    height: 180,
    backgroundColor: 'white',
    position: 'absolute',
  },
});

export default NoConnexion;
