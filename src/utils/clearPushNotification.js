import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

export const ClearPushNotification = () => {
  if (Platform.OS === 'android') {
    PushNotification.cancelAllLocalNotifications();
  } else {
    PushNotificationIOS.removeAllDeliveredNotifications();
    PushNotification.cancelAllLocalNotifications();
  }
};
