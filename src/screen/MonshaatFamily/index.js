import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import MonshaatActivityIcon from '../../assets/images/monshaatActivity.png';
import NewHeader from '../../components/NewHeader';
import * as loadingAction from '../../redux/action/loadingAction';
import * as monshaatActions from '../../redux/action/monshaatAction';
import { setFamilyData } from '../../redux/action/newsAction';
import { baseUrl, limit } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import AsyncStorage from '@react-native-community/async-storage';
const MonshaatFamily = (props) => {
  const [state, setState] = useState({
    familyData: [],
    newsData: [],
    monshaatActivityData: [],
    showNewsList: false,
    showActivity: false,
    showFamilyList: false,
    imageError: true,
    isLoadingNews: false,
    isLoadingActivity: false,
    isLoadingFamily: false,
    showMoreNews: false,
    showMoreActivity: false,
    showMoreFamily: false,
  });
  const [activityData, setActivityData] = useState([]);
  const data = [
    {
      image: null,
      create_date: '2021-11-04 09:11:54',
    },
    {
      image: null,
      create_date: '2021-11-04 09:11:54',
    },
    {
      image: null,
      create_date: '2021-11-04 09:11:54',
    },
    {
      image: null,
      create_date: '2021-11-04 09:11:54',
    },
    {
      image: null,
      create_date: '2021-11-04 09:11:54',
    },
  ];
  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  let monshaatNewsData = useSelector(
    (state) => state.MonshaatReducer.monshaatNewsData,
  );

  let monshaatActivity = useSelector(
    (state) => state.MonshaatReducer.monshaatActivity,
  );

  let monshaatFamily = useSelector(
    (state) => state.MonshaatReducer.monshaatFamily,
  );

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const [refresh, setRefresh] = useState(false);
  const [empID, setEmpID] = useState('');

  //  console.log('--------------monshaatNewsData',monshaatNewsData)
  // console.log('--------------monshaatActivity', monshaatActivity);
  //  console.log('--------------monshaatFamily',monshaatFamily)

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Monshaat_Family_Screen');
    }
  }, [isFocused]);

  const onPullToRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchData();
    // const willFocusSubscription = props.navigation.addListener('focus', () => {
    //   fetchData();
    // });
    // return willFocusSubscription;
  }, [refresh, isFocused]);

  const fetchData = () => {
    setState({
      ...state,
      newsData: [],
      monshaatActivityData: [],
      familyData: [],
      isLoadingFamily: true,
      isLoadingActivity: true,
      isLoadingNews: true,
    });

    dispatch(
      monshaatActions.getMonshaatFamilyData(
        accessToken,
        limit,
        0,
        // monshaatFamily.length
      ),
    );
    dispatch(
      monshaatActions.getMonshaatActivityData(
        accessToken,
        limit,
        0,
        // monshaatActivity.length
      ),
    );
    dispatch(
      monshaatActions.getMonshaatNewsList(
        accessToken,
        limit,
        0,
        // monshaatNewsData.length
      ),
    );
  };

  useEffect(() => {
    (async () => {
      let mEmpID = await AsyncStorage.getItem('empID');
      setEmpID(mEmpID);
    })();
  }, [empID]);

  useEffect(() => {
    // const willFocusSubscription = props.navigation.addListener('focus', () => {
    state.isLoadingFamily = false;
    setState({ ...state, isLoadingFamily: false });
    if (typeof monshaatFamily === 'object' && monshaatFamily.length) {
      setState({
        ...state,
        familyData: [],
      });
      state.showMoreFamily = monshaatFamily.length >= limit;
      setState({
        ...state,
        familyData: monshaatFamily,
        showFamilyList: true,
      });
    } else {
      setFamilyData(monshaatFamily);
    }
    // });
    // return willFocusSubscription;
  }, [monshaatFamily, isFocused]);

  const loadMoreFamily = async () => {
    if (!state.isLoadingFamily) {
      setState({ ...state, isLoadingFamily: true });
      let secretUrl = await EncryptUrl(
        baseUrl +
          '/api/search_read?model=portal.news' +
          '&domain=[["type", "=","family_news"], ["published","=",true]]' +
          '&fields=["title","description","image","write_date","create_date", "resume","like_ids","comment_ids"]' +
          '&limit=' +
          limit +
          '&offset=' +
          (state.familyData.length + limit),
      );

      await fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (typeof responseData === 'object' && responseData.length) {
            state.showMoreFamily = responseData.length >= limit;
            let mData = state.familyData.concat(responseData);
            setState({ ...state, isLoadingFamily: false });
            setState({ ...state, familyData: mData, showFamilyList: true });
          } else {
            setState({ ...state, isLoadingFamily: false });
          }
          dispatch(loadingAction.commonLoader(false));
        })
        .catch((err) => {
          setState({ ...state, isLoadingFamily: false });
          dispatch(loadingAction.commonLoader(false));
        });
    }
  };

  useEffect(() => {
    // const willFocusSubscription = props.navigation.addListener('focus', () => {
    state.isLoadingActivity = false;
    setState({ ...state, isLoadingActivity: false });
    if (typeof monshaatActivity === 'object' && monshaatActivity.length) {
      setState({
        ...state,
        monshaatActivityData: [],
      });
      state.showMoreActivity = monshaatActivity.length >= limit;
      setState({
        ...state,
        monshaatActivityData: monshaatActivity,
        showActivity: true,
      });
    }
    // });

    // return willFocusSubscription;
  }, [monshaatActivity, isFocused]);

  const loadMoreActivity = async () => {
    if (!state.isLoadingActivity) {
      setState({ ...state, isLoadingActivity: true });
      let secretUrl = await EncryptUrl(
        baseUrl +
          '/api/search_read?model=portal.awareness.image' +
          '&domain=[["published","=",true]]&order=write_date desc&' +
          '&fields=["image","write_date","create_date","resume","like_ids","comment_ids"]' +
          '&limit=' +
          limit +
          '&offset=' +
          (state.monshaatActivityData.length + limit),
      );
      await fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          // console.log('responseData', responseData);
          if (typeof responseData === 'object' && responseData.length) {
            state.showMoreActivity = monshaatActivity.length >= limit;
            let mData = state.monshaatActivityData.concat(responseData);
            setState({ ...state, isLoadingActivity: false });
            setState({
              ...state,
              monshaatActivityData: mData,
              showActivity: true,
            });
          } else {
            setState({ ...state, isLoadingActivity: false });
          }
          dispatch(loadingAction.commonLoader(false));
        })
        .catch((err) => {
          setState({ ...state, isLoadingActivity: false });
          dispatch(loadingAction.commonLoader(false));
        });
    }
  };

  useEffect(() => {
    // const willFocusSubscription = props.navigation.addListener('focus', () => {
    state.isLoadingNews = false;
    setState({ ...state, isLoadingNews: false });
    if (typeof monshaatNewsData === 'object' && monshaatNewsData.length) {
      setState({
        ...state,
        newsData: [],
      });
      state.showMoreNews = monshaatNewsData.length >= limit;
      setState({
        ...state,
        newsData: monshaatNewsData,
        showNewsList: true,
      });
    }
    // });

    // return willFocusSubscription;
  }, [monshaatNewsData, isFocused]);

  const loadMoreNews = async () => {
    if (!state.isLoadingNews) {
      setState({ ...state, isLoadingNews: true });
      // monshaatNewsData = [];
      let secretUrl = await EncryptUrl(
        baseUrl +
          '/api/search_read?model=portal.news' +
          '&domain=[["type", "=","news"], ["published","=",true]]' +
          '&fields=["title","description","image","write_date","create_date","resume","like_ids","comment_ids"]' +
          '&limit=' +
          limit +
          '&offset=' +
          (state.newsData.length + limit),
      );
      await fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (typeof responseData === 'object' && responseData.length) {
            state.showMoreNews = responseData.length >= limit;
            let mData = state.newsData.concat(responseData);
            setState({ ...state, isLoadingNews: false });
            setState({ ...state, newsData: mData, showNewsList: true });
          } else {
            setState({ ...state, isLoadingNews: false });
          }
          dispatch(loadingAction.commonLoader(false));
        })
        .catch((err) => {
          setState({ ...state, isLoadingNews: false });
          dispatch(loadingAction.commonLoader(false));
        });
    }
  };
  const CommentsLikesCount = ({ item }) => {
    let likes = item.like_ids ? item.like_ids.length : '0';
    let comments = item.comment_ids ? item.comment_ids.length : '0';
    let color = item.like_ids
      ? item.like_ids.includes(JSON.parse(empID))
        ? '#ff4444'
        : '#cdbfbe'
      : '#ff4444';
    return (
      <View style={styles.commentsLikesContainer}>
        <View style={styles.likesContainer}>
          <Text style={styles.favCount}>{likes}</Text>
          <MaterialCommunityIcon
            name="heart"
            size={20}
            color={color} //  "#ff4444"
          />
        </View>
        <View style={styles.likesContainer}>
          <Text style={styles.favCount}>{comments}</Text>
          <MaterialCommunityIcon
            name="comment-multiple"
            size={20}
            color={'#cdbfbe'} //  "#ff4444"
          />
        </View>
      </View>
    );
  };
  const renderFamilyData = (item) => {
    // Moment.locale('ar');
    return (
      <TouchableOpacity
        style={styles.familyContainer}
        onPress={() =>
          props.navigation.navigate('MonshaatNews', {
            item: item,
            type: 'family',
          })
        }
      >
        <View style={styles.FamilyContentContainer}>
          <Text style={styles.FamilydateText}>
            {Moment(item.create_date).format('D-MM-Y')}
          </Text>
          <Text numberOfLines={2} style={styles.FamilyContentText}>
            {item.resume}
          </Text>
        </View>
        <View style={styles.FamilyIconContainer}>
          <View style={styles.directmanagerIconContainer}>
            <Image
              resizeMode="contain"
              style={styles.directManagerIcon}
              source={require('../../assets/images/users2.png')}
            />
          </View>
        </View>
        {/* <CommentsLikesCount item={item} /> */}
      </TouchableOpacity>
    );
  };

  const renderActivity = (item) => {
    return (
      <TouchableOpacity
        style={styles.activityContainer}
        onPress={() =>
          props.navigation.navigate('MonshaatNews', {
            item: item,
            type: 'activity',
          })
        }
      >
        {item.image ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${item.image}`,
            }}
            resizeMode="contain"
            style={{
              width: '90%',
              height: '80%',
              transform: [{ rotateY: '180deg' }],
            }}
            onError={() => setState({ ...state, imageError: false })}
          />
        ) : (
          <Image
            source={MonshaatActivityIcon}
            style={{
              width: '90%',
              height: '80%',
              textAlign: 'center',
              transform: [{ rotateY: '180deg' }],
            }}
            resizeMode="contain"
          />
        )}
        <View style={styles.activityDateContainer}>
          <Text style={styles.activityDate}>
            {Moment(item.create_date).format('D-MM-Y')}
          </Text>
          <Image
            source={require('../../assets/images/date.png')}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </View>
        {/* <CommentsLikesCount item={item} /> */}
      </TouchableOpacity>
    );
  };

  const renderNewsData = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('MonshaatNews', {
            item: item,
            type: 'news',
          })
        }
      >
        <View style={styles.newsDataContainer}>
          <View style={styles.newsDataContentContainer}>
            <Text style={styles.newsDataDate}>
              {Moment(item.create_date).format('D-MM-Y')}
            </Text>
            <Text numberOfLines={4} style={styles.newsDataDescription}>
              {/* {item.description.replace(/<\/?[^>]+(>|$)/g, "")} */}
              {item.resume}
            </Text>
          </View>
          <View style={styles.newsDataImageContainer}>
            <Image
              source={{
                uri: `data:image/jpeg;base64,${item.image}`,
              }}
              resizeMode="contain"
              style={styles.newsDataImage}
              // onError={() => setState({ ...state, imageError: false })}
            />
          </View>
        </View>
        {/* <CommentsLikesCount item={item} /> */}
      </TouchableOpacity>
    );
  };

  const loadMoreFamilyBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 16,
          height: '100%',
        }}
      >
        {
          state.isLoadingFamily ? (
            // <ActivityIndicator
            //   size="small"
            //   color="#007598"
            //   style={{ marginHorizontal: 8 }}
            // />
            <Image
              source={require('../../assets/images/gif/128.gif')}
              style={{ width: 30, height: 30, marginHorizontal: 8 }}
            />
          ) : null

          // ? (
          //   <TouchableOpacity
          //     onPress={loadMoreFamily}
          //     style={{
          //       paddingVertical: 8,
          //       paddingHorizontal: 16,
          //       backgroundColor: "#d2d2d2",
          //       borderRadius: 8,
          //     }}
          //   >
          //     <Text
          //       style={{ textAlign: "center", fontFamily: "29LTAzer-Regular" }}
          //     >
          //       المزيد
          //     </Text>
          //   </TouchableOpacity>
          // ) :
        }
      </View>
    );
  };

  const loadMoreActivityBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          height: '100%',
        }}
      >
        {state.isLoadingActivity ? (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{ width: 30, height: 30, marginHorizontal: 8 }}
          />
        ) : null}
      </View>
    );
  };

  const loadMoreNewsBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 16,
        }}
      >
        {state.isLoadingNews ? (
          // <ActivityIndicator
          //   size="small"
          //   color="#007598"
          //   style={{ marginHorizontal: 8 }}
          // />
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={{ width: 30, height: 30, marginHorizontal: 8 }}
          />
        ) : // state.showMoreNews ? (
        //   <TouchableOpacity
        //     onPress={loadMoreNews}
        //     style={{
        //       paddingVertical: 8,
        //       paddingHorizontal: 16,
        //       backgroundColor: "#d2d2d2",
        //       borderRadius: 8,
        //     }}
        //   >
        //     <Text
        //       style={{ textAlign: "center", fontFamily: "29LTAzer-Regular" }}
        //     >
        //       المزيد
        //     </Text>
        //   </TouchableOpacity>
        // ) :
        null}
      </View>
    );
  };
  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={styles.container}
    >
      <NewHeader {...props} title={'الأخبار'} back />
      <ScrollView
        refreshControl={
          // <RefreshContainer refresh={false} onRefresh={onPullToRefresh} />

          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              onPullToRefresh();
              // fetchData();
            }}
          />
        }
        style={{ marginTop: -20 }}
      >
        <View style={styles.monshaatFamilyContainer}>
          <View
            style={[
              styles.headingTextContainer,
              { flexDirection: 'row-reverse' },
            ]}
          >
            <View style={styles.headingText}>
              <Text style={styles.headingsubText}>عائلة منشآت</Text>
              <View style={styles.directmanagerIconContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.directManagerIcon}
                  source={require('../../assets/images/users.png')}
                />
              </View>
            </View>
          </View>

          <View style={{ marginTop: 8, height: 100, justifyContent: 'center' }}>
            {state.showFamilyList ? (
              <FlatList
                style={{
                  paddingHorizontal: 8,
                  // transform: [{ rotateY: '180deg' }],
                }}
                data={state.familyData}
                renderItem={({ item }) => renderFamilyData(item)}
                horizontal={true}
                inverted={true}
                showsHorizontalScrollIndicator={true}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={loadMoreFamilyBtn}
                onEndReached={loadMoreFamily}
                onEndReachedThreshold={0}
              />
            ) : (
              <Image
                source={require('../../assets/images/gif/128.gif')}
                style={{
                  width: 30,
                  height: 30,
                  marginHorizontal: 8,
                  left: 140,
                  position: 'relative',
                }}
              />
            )}
          </View>
        </View>

        <View
          style={[
            styles.headingTextContainer,
            { flexDirection: 'row-reverse' },
          ]}
        >
          <View style={[styles.headingText, { marginRight: 20 }]}>
            <Text style={styles.headingsubText}>فعاليات منشآت</Text>
            <View style={styles.directmanagerIconContainer}>
              <Image
                resizeMode="contain"
                style={styles.directManagerIcon}
                source={require('../../assets/images/activity.png')}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 8,
            marginBottom: 16,
            width: '100%',
            justifyContent: 'center',
            height: 180,
          }}
        >
          {state.showActivity ? (
            <FlatList
              data={state.monshaatActivityData}
              style={{
                paddingHorizontal: 8,
                // transform: [{ rotateY: '180deg' }],
              }}
              renderItem={({ item }) => renderActivity(item)}
              horizontal={true}
              inverted={true}
              showsHorizontalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={loadMoreActivityBtn}
              onEndReached={loadMoreActivity}
              onEndReachedThreshold={0}
            />
          ) : (
            <Image
              source={require('../../assets/images/gif/128.gif')}
              style={{
                width: 30,
                height: 30,
                marginHorizontal: 8,
                left: 150,
                position: 'relative',
              }}
            />
          )}
        </View>
        <View
          style={[
            styles.headingTextContainer,
            { flexDirection: 'row-reverse' },
          ]}
        >
          <View style={[styles.headingText, { marginRight: 20 }]}>
            <Text style={styles.headingsubText}>أخبار منشآت</Text>
            <View style={styles.directmanagerIconContainer}>
              <Image
                resizeMode="contain"
                style={styles.directManagerIcon}
                source={require('../../assets/images/news.png')}
              />
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center' }}>
          {state.showActivity ? (
            <FlatList
              data={state.newsData}
              keyExtractor={(item, index) => index.toString()}
              style={{ paddingHorizontal: 16, marginTop: 8 }}
              renderItem={({ item }) => renderNewsData(item)}
              ListFooterComponent={loadMoreNewsBtn}
              onEndReached={loadMoreNews}
              onEndReachedThreshold={0}
            />
          ) : (
            <Image
              source={require('../../assets/images/gif/128.gif')}
              style={{
                width: 30,
                height: 30,
                marginHorizontal: 8,
                left: 150,
                position: 'relative',
                bottom: 0,
              }}
            />
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MonshaatFamily;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2',
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
  },
  headingText: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingRight: 0,
    marginRight: -10,
    alignItems: 'center',
  },
  headingsubText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#20547a',
    marginHorizontal: 5,
  },
  icon: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    shadowColor: '#f3fcff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  familyContainer: {
    width: wp('60%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: wp('1.5%'),
    backgroundColor: '#f3fcff',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 50,
    // transform: [{ rotateY: '180deg' }],
  },
  familydateText: {
    color: 'gray',
    fontSize: 10,
    textAlign: 'left',
    paddingVertical: hp('0.5%'),
  },
  noData: {
    color: 'gray',
    fontSize: 20,
    fontFamily: '29LTAzer-Regular',
  },
  newsDataContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: '100%',
    minHeight: 100,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  newsDataImageContainer: {
    width: '30%',
    height: '100%',
  },
  newsDataImage: {
    width: undefined,
    height: undefined,
    flex: 1,
  },
  newsDataContentContainer: {
    width: '70%',
    alignItems: 'flex-end',
    padding: 16,
  },
  newsDataDate: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    color: '#90becc',
  },
  newsDataDescription: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#20547a',
  },
  newsBtnContainer: {
    width: '30%',
  },
  newsBtn: {
    width: '80%',
    backgroundColor: '#007598',
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
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
  dateText: {
    width: '80%',
    fontSize: 10,
    textAlign: 'center',
    color: 'gray',
    paddingTop: 5,
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  monshaatFamilyContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    padding: 17,
    paddingLeft: 0,
    zIndex: 999,
  },
  directmanagerIconContainer: {
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  directManagerIcon: { width: 25, height: 25 },
  FamilyIconContainer: {
    width: '20%',
    alignItems: 'center',
  },
  FamilyContentContainer: {
    width: '80%',
    alignItems: 'flex-end',
  },
  FamilydateText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#18ab91',
  },
  FamilyContentText: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#20547a',
  },
  activityContainer: {
    width: wp('55%'),
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  activityDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    paddingHorizontal: 8,
    // transform: [{ rotateY: '180deg' }],
  },
  activityDate: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    color: '#90becc',
    marginHorizontal: 10,
    marginTop: 5,
  },
  commentsLikesContainer: {
    position: 'absolute',
    bottom: -2,
    left: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  favCount: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    color: '#707070',
    marginHorizontal: 5,
  },
});
