import React from 'react';
import { ImageBackground } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const SplashScreenComponent = props => {
  return (
    <ImageBackground
      style={{
        height: heightPercentageToDP('100%'),
        width: widthPercentageToDP('100%'),
      }}
      resizeMode="cover"
      source={require('./../../assets/images/icon2.png')}
    ></ImageBackground>
  );
};

export default SplashScreenComponent;
