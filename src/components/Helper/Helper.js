import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

export const checkInteretState = () => {
  NetInfo.fetch().then((state) => {
    if (!state.isConnected) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'تعذر الإتصال بالإنترنت',
      });
    }
  });
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (!state.isInternetReachable && !state.isConnected) {
      showMessage({
        style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
        type: 'danger',
        message: 'تعذر الإتصال بالإنترنت',
      });
    }
  });
  unsubscribe();
  // return unsubscribe;
};
