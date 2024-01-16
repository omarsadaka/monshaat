import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';

const statics = {
  statictTime: '@expire-time',
  days: 7,
};
export const GenerateNewSession = async () => {
  try {
    let expireDate = Moment(
      Moment(new Date())
        .add(statics.days, 'd')
        .format('YYYY/MM/DD HH:mm:ss'),
    );
    await AsyncStorage.setItem(statics.statictTime, String(expireDate));
  } catch (error) {
    // console.log(`error generate session ${error}`);
  }
};

export const LogoutIfSessionExpired = async () => {
  let userLogin = await AsyncStorage.getItem('userToken');
  if (!userLogin) {
    return console.log('user-not-login');
  }
  let expireDate = await AsyncStorage.getItem(statics.statictTime);
  if (!expireDate) {
    // no expire date user used old version of the app
    return GenerateNewSession();
  }

  const diffrence = Moment(new Date()).diff(Moment(expireDate));
  if (diffrence >= 0) {
  }
  // console.log(`diffrence ${diffrence}`);
};
