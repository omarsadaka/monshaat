import React from 'react';
import { Image } from 'react-native';

const Loader = props => {
  const { style } = props;

  return (
    <Image
      source={require('../../assets/images/gif/128.gif')}
      style={{
        width: 30,
        height: 30,
        marginHorizontal: 8,
        top: '43%',
        left: '43%',
        position: 'absolute',
        ...style,
      }}
    />
  );
};

export default Loader;
