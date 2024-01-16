import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import MonshaatActivityIcon from '../../assets/images/monshaatActivity.png';
import Header from '../../components/Header';
import * as monshaatActions from '../../redux/action/monshaatAction';

const MonshaatFamily = props => {
  const [state, setState] = useState({
    familyData: [],
    newsData: [],
    monshaatActivityData: [],
    showNewsList: false,
    showActivity: false,
    showFamilyList: false,
    imageError: true,
  });

  const dispatch = useDispatch();

  const monshaatNewsData = useSelector(
    state => state.MonshaatReducer.monshaatNewsData,
  );

  const monshaatActivity = useSelector(
    state => state.MonshaatReducer.monshaatActivity,
  );

  const monshaatFamily = useSelector(
    state => state.MonshaatReducer.monshaatFamily,
  );

  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  useEffect(() => {
    dispatch(monshaatActions.getMonshaatNewsList(accessToken));
    dispatch(monshaatActions.getMonshaatFamilyData(accessToken));
    dispatch(monshaatActions.getMonshaatActivityData(accessToken));
  }, []);

  useEffect(() => {
    if (typeof monshaatNewsData === 'object' && monshaatNewsData.length) {
      setState({ ...state, newsData: monshaatNewsData, showNewsList: true });
    }
  }, [monshaatNewsData]);

  useEffect(() => {
    if (typeof monshaatActivity === 'object' && monshaatActivity.length) {
      setState({
        ...state,
        monshaatActivityData: monshaatActivity,
        showActivity: true,
      });
    }
  }, [monshaatActivity]);

  useEffect(() => {
    if (typeof monshaatFamily === 'object' && monshaatFamily.length) {
      setState({ ...state, familyData: monshaatFamily, showFamilyList: true });
    }
  }, [monshaatFamily]);

  const renderFamilyData = item => {
    return (
      <TouchableOpacity style={styles.familyContainer}>
        <View style={{ width: '80%', paddingHorizontal: 5 }}>
          <Text numberOfLines={3} style={{ color: 'gray', fontSize: 12 }}>
            {item.description.replace(/<\/?[^>]+(>|$)/g, '')}
          </Text>
          <Text style={styles.familydateText}>{item.write_date}</Text>
        </View>
        <View style={{ width: '20%' }}>
          <Icon2 name="user-circle" size={30} color="#007598" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderActivity = item => {
    return (
      <View>
        <TouchableOpacity style={{ marginHorizontal: wp('2%') }}>
          <View>
            {state.imageError ? (
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${item.image}`,
                }}
                resizeMode="cover"
                style={{ width: 200, height: 150 }}
                onError={() => setState({ ...state, imageError: false })}
              />
            ) : (
              <Image source={MonshaatActivityIcon} resizeMode="contain" />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: wp('1%'),
            }}
          >
            <View style={{ width: 100 }}>
              <Text style={{ color: '#007598', fontSize: 12, flexShrink: 1 }}>
                {item.write_date}
              </Text>
            </View>
            <View style={{ width: 100 }}>
              <Text style={{ color: '#007598', flexShrink: 1 }}>
                {' '}
                {item.title.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNewsData = item => {
    return (
      <View style={styles.newsDataContainer}>
        <TouchableOpacity
          style={styles.newsBtnContainer}
          onPress={() =>
            props.navigation.navigate('MonshaatNews', { item: item })
          }
        >
          <View style={styles.newsBtn}>
            <Text style={{ color: 'white' }}>تفاصيل</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.newsDataTextContainer}>
          {/* <HTML
            source={{html: item.description}}
            allowedStyles={['font-size']}
          /> */}
          <Text numberOfLines={2}>
            {item.description.replace(/<\/?[^>]+(>|$)/g, '')}
          </Text>
          <View>
            <Text style={styles.newsDateText} numberOfLines={1}>
              {item.write_date}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Header {...props} back={false} />
      </View>
      <ScrollView>
        <View>
          <View style={styles.headingTextContainer}>
            <View style={styles.headingText}>
              <Text style={{ color: 'white' }}>عائلة منشآت</Text>
            </View>
          </View>
          <View style={{ marginVertical: hp('2%'), paddingRight: 20 }}>
            {state.showFamilyList ? (
              <FlatList
                data={state.familyData}
                renderItem={({ item }) => renderFamilyData(item)}
                horizontal
                inverted={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <ActivityIndicator size="small" color="#007598" />
            )}
          </View>
        </View>

        <View style={[styles.headingTextContainer]}>
          <View style={styles.headingText}>
            <Text style={{ color: 'white' }}>نشاط منشآت</Text>
          </View>
          <View
            style={{
              height: 215,
              marginTop: hp('2%'),
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {state.showActivity ? (
              <FlatList
                data={state.monshaatActivityData}
                renderItem={({ item }) => renderActivity(item)}
                horizontal
                inverted={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <ActivityIndicator size="small" color="#007598" />
            )}
          </View>
        </View>
        <View style={styles.headingTextContainer}>
          <View style={styles.headingText}>
            <Text style={{ color: 'white' }}>منشآت نيوز</Text>
          </View>
        </View>
        {state.showNewsList ? (
          <View style={{ alignItems: 'center' }}>
            <View style={{ marginVertical: hp('2%'), width: '90%' }}>
              <FlatList
                data={state.newsData}
                renderItem={({ item }) => renderNewsData(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        ) : (
          <ActivityIndicator size="small" color="#007598" />
        )}
      </ScrollView>
    </View>
  );
};

export default MonshaatFamily;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00759810',
  },
  searchView: {
    flexDirection: 'row',
    borderWidth: 0.3,
    margin: 5,
    borderRadius: 9,
    backgroundColor: 'white',
    padding: 2,
  },
  textView: {
    alignItems: 'flex-end',
    paddingRight: wp('2%'),
  },
  textStyle: {
    paddingVertical: hp('0.5%'),
  },
  headingTextContainer: {
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  headingText: {
    borderRadius: 25,
    paddingHorizontal: wp('2%'),
    backgroundColor: '#007598',
    paddingVertical: hp('1%'),
  },
  familyContainer: {
    width: wp('50%'),
    flexDirection: 'row',
    marginHorizontal: wp('1.5%'),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  familydateText: {
    color: 'gray',
    fontSize: 10,
    paddingVertical: hp('0.5%'),
  },
  newsDataContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: hp('0.5%'),
    paddingVertical: hp('1%'),
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  newsBtnContainer: {
    width: '30%',
  },
  newsBtn: {
    width: '80%',
    backgroundColor: '#007598',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: hp('0.3%'),
  },
  newsDataTextContainer: {
    width: '70%',
    justifyContent: 'center',
  },
  newsText: {
    textAlign: 'right',
    paddingRight: wp('2%'),
    color: '#007598',
  },
  newsDateText: {
    fontSize: 10,
    textAlign: 'right',
    color: 'gray',
    padding: 5,
  },
});
