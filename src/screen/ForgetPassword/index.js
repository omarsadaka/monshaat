import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewHeader from '../../components/NewHeader';
import WebView from 'react-native-webview';
import Loader from '../../components/loader';

export default function ForgetPassword(props) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  return (
    <LinearGradient colors={['#d5e6ed', '#d5e6ed']} style={{ flex: 1 }}>
      <NewHeader {...props} back={true} title="إعادة كلمة المرور" />
      <WebView
        source={{ uri: 'https://ads.monshaat.gov.sa/authorization.do' }}
        // scrollEnabled={true}
        style={styles.web_view}
      />
      {isLoading ? <Loader /> : null}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  web_view: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginVertical: 10,
  },
});
