import analytics from '@react-native-firebase/analytics';

export const AnnalyticsFirebase = async screenName => {
  await analytics().logEvent(screenName, { screenName });
};
