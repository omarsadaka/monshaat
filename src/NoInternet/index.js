import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Overlay from 'react-native-modal-overlay';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';

const NoInternet = (props) => {
  return (
    <Overlay
      animationType="zoomIn"
      containerStyle={styles.overlayContainer}
      childrenWrapperStyle={styles.overlayChildrenWrapper}
      animationDuration={500}
      visible
    >
      <Image
        source={require('../assets/images/NoConnexion.gif')}
        style={styles.image}
      />
      <Text style={styles.text}>لا يوجد إتصال بالإنترنت</Text>
      <TouchableOpacity onPress={() => RNRestart.Restart()}>
        <Image
          source={require('../assets/images/reload.png')}
          style={styles.reload}
        />
      </TouchableOpacity>
    </Overlay>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    fontSize: 20,
  },
  overlayContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayChildrenWrapper: {
    borderRadius: 30,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.73,
    // height: Dimensions.get('window').height * 0.4,
  },
  image: {
    width: 210,
    height: 180,
    backgroundColor: 'white',
  },
  reload: {
    width: 37,
    height: 37,
    marginTop: Dimensions.get('window').height * 0.04,
  },
});

export default NoInternet;
