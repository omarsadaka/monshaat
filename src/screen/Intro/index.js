import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import * as loginActions from '../../redux/action/loginActions';

const slides = [
  {
    key: 1,

    text: 'متابعة الطلبات',
    subtext: 'يمكنك القيام برفع الطلبات\nومتابعتها والموافقة عليها',
    image: require('../../assets/images/boarding1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,

    text: 'جدول الأعمال و الاعلانات',

    image: require('../../assets/images/boarding2.png'),
    backgroundColor: '#febe29',
    subtext: 'الاطلاع على جدول أعمالك و\nآخر اخبار و فعاليات منشآت',
  },
  {
    key: 3,

    text: 'أسأل الخبير',
    image: require('../../assets/images/boarding3.png'),
    backgroundColor: '#22bcb5',
    subtext: 'الاستفادة من خبرات موظفي\nمنشآت في مجالات مختلفة',
  },
];

export default function Intro(props) {
  const _renderItem = ({ item }) => {
    return (
      <View style={styles.itemView}>
        <Image
          resizeMode="stretch"
          style={{ height: '70%', width: '101%' }}
          source={item.image}
        />
        <Text style={styles.titletext}>{item.text}</Text>
        <Text style={styles.subtitletext}>{item.subtext}</Text>
      </View>
    );
  };

  const dispatch = useDispatch();

  const proceed = () => {
    // AsyncStorage.setItem("AppIntro", "true");
    dispatch(loginActions.handleAppIntro('true'));
  };

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        showNextButton={false}
        showDoneButton={false}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={proceed}>
        <Image
          resizeMode="contain"
          style={{ height: 15, width: 15 }}
          source={require('../../assets/images/left.png')}
        />
        <Text style={styles.loginBtnText}>تخطي</Text>
      </TouchableOpacity>
      <Image
        resizeMode="stretch"
        style={{ height: '10%', width: '101%' }}
        source={require('../../assets/images/boardingFooter.png')}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 30,
    // backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: hp('2%'),
    marginVertical: hp('4%'),
    position: 'absolute',
    top: '70%',
  },
  loginBtnText: {
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 20,
    color: '#007297',
    marginHorizontal: 10,
  },
  titletext: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 22,
    paddingVertical: hp('1%'),
    color: '#20547a',
  },
  subtitletext: {
    fontFamily: '29LTAzer-Regular',
    lineHeight: 28,
    fontSize: 18,
    color: '#007297',
  },
  itemView: {
    alignItems: 'center',
    // marginTop: hp('7%'),
  },
  backImagestyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
