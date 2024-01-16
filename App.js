import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Linking,
  LogBox,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlashMessage from 'react-native-flash-message';
import RootChecker from 'react-native-root-checker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import CommonPopup2 from './src/components/CommonPopup';
import SplashScreenComponent from './src/components/SplashScreen';
import Route from './src/navigation';
import store from './src/redux/store';
import { baseUrl } from './src/services';
import { EncryptUrl } from './src/services/EncryptUrl';
// import NetInfo from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';
import { useNetInfo } from '@react-native-community/netinfo';

import * as Sentry from '@sentry/react-native';
import { checkInteretState } from './src/components/Helper/Helper';

import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { getVersion } from 'react-native-device-info';

const inAppUpdates = new SpInAppUpdates(
  true, // isDebug
);

Sentry.init({
  dsn: 'https://bcde1daa6e4a4f72b3d72be81097d15c@o1297206.ingest.sentry.io/6525303',

  tracesSampleRate: 1.0,
});

export default Sentry.wrap(() => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SafeAreaProvider>
  );
});

const App = () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const [state, setState] = useState({
    splash: true,
    visible: false,
  });
  const [rooted, setRooted] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const netInfo = useNetInfo();

  // useEffect(() => {
  //   if (!netInfo?.isConnected && netInfo.type !== 'unknown') {
  //     setIsConnected(false);
  //     showMessage({
  //       style: { alignItems: 'flex-end', fontFamily: '29LTAzer-Regular' },
  //       type: 'danger',
  //       message: 'تعذر الإتصال بالإنترنت',
  //     });
  //   }
  // }, [isConnected]);

  // useEffect(() => {
  //   checkInteretState();
  // }, []);

  const checkForRootStatus = async () => {
    if (__DEV__) {
      return;
    }
    try {
      if (Platform.OS === 'android') {
        const rootedStatus = await RootChecker.isRootedByNativeRootCheck(
          'AIzaSyA9daduoDxRwOFPSh731Ir0pcBiALja2HQ',
        );
        setRooted(rootedStatus);
      } else if (Platform.OS === 'ios') {
        const rootedStatus = await RootChecker.isJailBroken(
          'AIzaSyA9daduoDxRwOFPSh731Ir0pcBiALja2HQ',
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const appUrl = 'https://ethaq.monshaat.gov.sa/index.php/s/7Eqr59BejqcxEqw';

  const updateLink = () => {
    setUpdate(false);
    Linking.openURL(appUrl);
  };

  const getValues = async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    let url = `${baseUrl}/api/search_read?fields=["message", "version"]&model=upgrade.message`;
    let secretUrl = await EncryptUrl(url);
    let currenVersion = '1.0.90'; //1.0.92
    let previousVersion = '1.0.87'; //1.0.86
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((e) => {
        let desiredVersion = e[0].version;
        if (
          desiredVersion !== currenVersion &&
          desiredVersion !== previousVersion
        ) {
          setUpdate(true);
        }
        // let splittedVersionNumberOddo = desiredVersion.split(".");
        // let splittedVersionNumberReact = currenVersion.split(".");
        // if (
        //   splittedVersionNumberOddo.length > splittedVersionNumberReact.length
        // ) {
        //   return setUpdate(true);
        // }
        // let showRequiredMessage = false;
        // splittedVersionNumberOddo.map((it, i) => {
        //   if (Number(it) === Number(splittedVersionNumberReact[i])) {
        //
        //   }
        // });
        // // alert(Number(splittedVersionNumberReact[0]) + 1);
        // showRequiredMessage && setUpdate(true);
      })
      .catch((e) => {});
  };

  const checkForUpdate = () => {
    let ver = getVersion();
    inAppUpdates.checkNeedsUpdate({ curVersion: ver,country: 'ISO 3166-1 +966' }).then(result => {
      console.log('result ssss', result);
      if (result.shouldUpdate) {
        // let updateOptions: StartUpdateOptions = {};
        // if (Platform.OS === 'android') {
        //   // android only, on iOS the user will be promped to go to your app store page
        //   updateOptions = {
        //     updateType: IAUUpdateKind.FLEXIBLE,
        //   };
        // }
        // inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78

        const updateOptions: StartUpdateOptions = Platform.select({
          ios: {
            title: 'تحديث متاح',
            message:
              'هناك إصدار جديد من التطبيق متوفر في متجر التطبيقات ، هل تريد تحديثه؟',
            buttonUpgradeText: 'تحديث',
            buttonCancelText: 'إلغاء',
            country: 'ISO 3166-1 +966', // 👈🏻 the country code for the specific version to lookup for (optional)
          },
          android: {
            updateType: IAUUpdateKind.IMMEDIATE,
          },
        });
        inAppUpdates.startUpdate(updateOptions);
      }
    });
  };

  useEffect(() => {
    let oldRender = Text.render;
    Text.render = function (...args) {
      let origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [{ fontFamily: '29LTAzer-Regular' }, origin.props.style],
      });
    };

    Image.render = function (...args) {
      let origin = FastImage.render.call(this, ...args);
      return React.cloneElement(origin, {
        tintColor: origin.props.style.tintColor || undefined,
        style: [origin.props.style],
      });
    };
    LogBox.ignoreAllLogs();
    // getValues();
    checkForUpdate()
    checkForRootStatus();
    setState({ ...state, splash: false });
    SplashScreen.hide();

    const ReactNative = require('react-native');
    try {
      ReactNative.I18nManager.allowRTL(false);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getActiveRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];

    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        //  alert(currentRouteName);
        if (previousRouteName !== currentRouteName) {
          await analytics().setCurrentScreen(currentRouteName);
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <CommonPopup2
        close={true}
        visible={rooted}
        text="لإستخدام تطبيق منشآت يجب ألا يكون الهاتف ذو صلاحيات Root"
        onClose={() => {
          BackHandler.exitApp();
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={false} //if production set it update else false
        onRequestClose={() => {
          setUpdate(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>تحديث التطبيق </Text>
            <View style={styles.hr} />
            <Text style={styles.modalText}>لتجربة أفضل، يرجى التحديث</Text>
            {Platform.OS === 'android' && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => updateLink()}
              >
                <Text style={styles.textStyle}>تحديث </Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => setUpdate(false)}
              >
                <Text style={styles.textStyle}>إلغاء </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {false && state.splash === true ? (
        <SplashScreenComponent />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <Route />
          <FlashMessage position="bottom" />
        </View>
      )}
    </NavigationContainer>
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
    padding: 30,
    width: '80%',
    alignItems: 'flex-end',
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
  },
  buttonContainer: {
    backgroundColor: '#007598',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
  },
  hr: {
    height: 1,
    width: '50%',
    alignSelf: 'flex-end',
    backgroundColor: '#007598',
    marginTop: -15,
    marginBottom: 20,
  },
});
