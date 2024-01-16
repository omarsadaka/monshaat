import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import InternalRequest from '../IntrenalRequest';

const InternalCourses = (props) => {
  const [state, setState] = useState({
    isLoading: true,
    internal: [],
    opt: {},
    modalVisible: false,
  });
  const isFocused = useIsFocused();
  const getAllMyReuqests = async () => {
    setState({ ...state, isLoading: true });
    const token = await AsyncStorage.getItem('accessToken');
    let mUrl = `${baseUrl}/api/search_read?domain=[["state","=","candidate"],["published","=",true]]&model=hr.training&fields=["name","attachment_ids","number","date_from","date_to","training_center","type","programme_training","place","amount","country_id","city","state","number_participant","number_place","number_of_days"]`;
    (async () => {
      let secretUrl = await EncryptUrl(mUrl);
      fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((data) =>
          setState({ ...state, internal: data, isLoading: false }),
        )
        .catch(function () {
          // console.log('error');
        });
    })();
  };

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Internal_Courses_Request');
    }
  }, [isFocused]);
  useEffect(() => {
    getAllMyReuqests();
  }, []);

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="  الدورات الداخلية" />
      <View
        style={{
          flex: 1,
          backgroundColor: '#F8F8F8',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {state.internal.length < 1 ? (
          state.isLoading ? (
            <Image
              source={require('../../assets/images/gif/128.gif')}
              style={{
                width: 30,
                height: 30,

                top: 250,
                left: '43%',
              }}
            />
          ) : (
            <View
              style={{
                justifyContent: 'center',
                height: '100%',
                alignItems: 'center',
                alignContent: 'center',
                top: 250,
              }}
            >
              <RefreshContainer
                refresh={false}
                onPullToRefresh={getAllMyReuqests}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#007598',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  عذرا لا يتوفر دورات داخلية في الوقت الحالي{' '}
                </Text>
              </RefreshContainer>
            </View>
          )
        ) : (
          <InternalRequest
            requestDataList={state.internal}
            onMRefresh={() => getAllMyReuqests()}
            {...props}
          />
        )}
      </View>
    </LinearGradient>
  );
};
export default InternalCourses;
