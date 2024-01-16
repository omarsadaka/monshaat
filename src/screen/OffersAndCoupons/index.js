import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import OffersDisplay from './offersCouponsDisplay';

const OffersCoupons = props => {
  const [offersNewLists, setOffersNewLists] = useState([]);

  const [state, setState] = useState({
    isLoading: true,
    offersLists: [],
    modalVisible: false,
  });
  const isFocused = useIsFocused();
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  AsyncStorage.setItem('accessToken', accessToken);

  const getOffersLists = async () => {
    setState({ ...state, isLoading: true });
    let mEmpID = await AsyncStorage.getItem('empID');

    let url =
      baseUrl +
      `/api/call/all.requests/retrieve_all_coupon_offer?kwargs={"employee_id": ${mEmpID}}`;
    let secretUrl = await EncryptUrl(url, true);
    fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        // console.log("responseData", responseData);

        // setOffersNewLists(responseData);
        setState({ ...state, offersLists: responseData, isLoading: false });
      })
      .catch(err => {});
  };

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Offers_Coupons_Screen');
    }
  }, [isFocused]);

  useEffect(() => {
    console.log('LENGTHHHHH----------->', state.offersLists.length);

    getOffersLists();
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      getOffersLists();
    });

    return willFocusSubscription;
  }, []);

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="   العروض و المزايا " />
      <View style={{ marginTop: -20, zIndex: 99, height: '88%' }}>
        <View style={styles.cardContainer}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F8F8F8',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {state.offersLists.length < 1 ? (
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
                    top: 20,
                  }}
                >
                  <RefreshContainer
                    style={{ top: -100 }}
                    refresh={false}
                    onPullToRefresh={getOffersLists}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#007598',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      عذرا لا يوجد عروض في الوقت الحالي{' '}
                    </Text>
                  </RefreshContainer>
                </View>
              )
            ) : (
              <OffersDisplay
                requestDataList={state.offersLists}
                onMRefresh={() => getOffersLists()}
                contentContainerStyle={{ paddingBottom: 250 }}
                {...props}
              />
            )}
          </View>
        </View>

        {/* {state.isLoading && <Loader />} */}
      </View>
    </LinearGradient>
  );
};
export default OffersCoupons;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    flexGrow: 1,
    // paddingTop: 20,
    height: '100%',
  },
});
