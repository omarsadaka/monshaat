import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import AppendedQuestionnary from './appendedQuestionnary';
const QuestForm = (props) => {
  const [ratingNewLists, setRatingNewLists] = useState([]);

  const [state, setState] = useState({
    isLoading: true,
    ratingLists: [],
    modalVisible: false,
  });
  const data = [
    { title: 'ssسss dada dad', end_date: '12-2-2022', image: '' },
    { title: 'ssسssd dad dadadad', end_date: '12-2-2022', image: '' },
    { title: 'ssسss d dadadad', end_date: '12-2-2022', image: '' },
  ];
  const isFocused = useIsFocused();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  AsyncStorage.setItem('accessToken', accessToken);

  const getQuestions = async () => {
    let mEmpID = await AsyncStorage.getItem('empID');

    let url =
      baseUrl +
      `/api/call/all.requests/get_employee_survey?kwargs={"employee_id": ${mEmpID}}`;
    let secretUrl = await EncryptUrl(url, true);
    console.log('secretUrl', secretUrl);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('responseDatas', responseData);
        if (responseData.length > 0) {
          let responseDatas = JSON.stringify(responseData);

          let lists = null;
          lists = responseDatas && responseDatas;

          const newLists = JSON.parse(lists);

          setRatingNewLists(newLists);
          setState({ ...state, ratingLists: responseDatas, isLoading: false });
        } else {
          setState({
            ...state,
            ratingLists: [],
            isLoading: false,
          });
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Survey_Screen');
    }
  }, [isFocused]);
  useEffect(() => {
    getQuestions();
  }, [isFocused, state.ratingLists]);

  const ratingQuestLists = () => {
    if (state.ratingLists.length < 1) {
      if (state.isLoading) {
        return (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{
              width: 30,
              height: 30,

              top: 250,
              left: '43%',
            }}
          />
        );
      }
      return (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
            alignContent: 'center',
            top: 20,
          }}
        >
          <RefreshContainer
            style={{ top: -100 }}
            refresh={false}
            onPullToRefresh={getQuestions}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/Group138.png')}
                style={{ width: 200, height: 300 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: '#007598',
                  fontFamily: '29LTAzer-Regular',
                }}
              >
                لا يوجد استبيانات في الفترة الحالية{' '}
              </Text>
            </View>
          </RefreshContainer>
        </View>
      );
    } else if (state.ratingLists.length > 1) {
      return (
        <AppendedQuestionnary
          requestDataList={JSON.parse(state.ratingLists)}
          onMRefresh={() => getQuestions()}
          {...props}
        />
      );
    }
  };
  return (
    <LinearGradient
      colors={['#d5e6ed', '#d5e6ed']} //'#ffffff',
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="  الاستبيانات " />
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          elevation: 1,
          marginVertical: 10,
          paddingTop: 5,
          borderRadius: 10,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 1 },
          marginBottom: '6%',
        }}
      >
        {ratingQuestLists()}
      </View>
    </LinearGradient>
  );
};
export default QuestForm;
