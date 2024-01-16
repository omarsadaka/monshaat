import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageModal from 'react-native-image-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  default as Icon,
  default as MaterialCommunityIcon,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CommonPopup from '../../components/CommonPopup';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import store from '../../redux/store';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

const MonshaatNews = (props) => {
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const [height, setHeight] = useState(40);
  const [imageSrc, setImageSrc] = useState();
  const [hrefSrc, setHrefSrc] = useState();

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [Likes, setLikes] = useState([]);
  const [modal2, setModal2] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentUserID, setCurrentUserID] = useState({});

  let mItem = props?.route?.params?.item;
  let mType = props?.route?.params?.type;
  // console.log('545454mItem', mItem);
  let uri =
    mItem.hasOwnProperty('description') === false
      ? ''
      : mItem.description?.includes('<a') === true
      ? hrefSrc
      : mItem.description?.replace(/<\/?[^>]+(>|$)/g, '');

  const OptimisticUiComment = (responseData, deleted = false) => {
    if (mType === 'family') {
      let updated = store.getState().MonshaatReducer.monshaatFamily;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].comment_ids = [...updated[index].comment_ids].filter(
            (it, i) => i < updated[index].comment_ids.length - 1,
          ))
        : (updated[index].comment_ids = [
            ...updated[index].comment_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_FAMILY', value: updated });
    } else if (mType === 'news') {
      let updated = store.getState().MonshaatReducer.monshaatNewsData;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].comment_ids = [...updated[index].comment_ids].filter(
            (it, i) => i < updated[index].comment_ids.length - 1,
          ))
        : (updated[index].comment_ids = [
            ...updated[index].comment_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_NEWS', value: updated });
    } else {
      let updated = store.getState().MonshaatReducer.monshaatActivity;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].comment_ids = [...updated[index].comment_ids].filter(
            (it, i) => i < updated[index].comment_ids.length - 1,
          ))
        : (updated[index].comment_ids = [
            ...updated[index].comment_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_ACTIVITY', value: updated });
    }
  };
  const OptimisticUiLikes = (responseData = null, deleted = false) => {
    if (mType === 'family') {
      let updated = store.getState().MonshaatReducer.monshaatFamily;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].like_ids = [...updated[index].like_ids].filter(
            (it, i) => i < updated[index].like_ids.length - 1,
          ))
        : (updated[index].like_ids = [
            ...updated[index].like_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_FAMILY', value: updated });
    } else if (mType === 'news') {
      let updated = store.getState().MonshaatReducer.monshaatNewsData;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].like_ids = [...updated[index].like_ids].filter(
            (it, i) => i < updated[index].like_ids.length - 1,
          ))
        : (updated[index].like_ids = [
            ...updated[index].like_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_NEWS', value: updated });
    } else {
      let updated = store.getState().MonshaatReducer.monshaatActivity;
      let index = updated.findIndex((c) => c.id === mItem.id);
      deleted
        ? (updated[index].like_ids = [...updated[index].like_ids].filter(
            (it, i) => i < updated[index].like_ids.length - 1,
          ))
        : (updated[index].like_ids = [
            ...updated[index].like_ids,
            responseData,
          ]);
      store.dispatch({ type: 'MONSHAAT_ACTIVITY', value: updated });
    }
  };

  const submitLike = async () => {
    // OptimisticUiLikes(Math.random());
    setIsLoading(true);
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/portal.news?ids=${mItem.id}&values={"like_ids":[[4, ${mEmpID}]]}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        getLikes();
      })
      .catch((err) => {
        OptimisticUiLikes(_, true);
        setIsLoading(false);
      });
  };
  const removeLike = async () => {
    setIsLoading(true);
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/portal.news?ids=${mItem.id}&values={"like_ids":[[3, ${mEmpID}]]}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        OptimisticUiLikes(Math.random(), true);
        setIsLoading(false);
        setLiked(false);

        getLikes();
      })
      .catch((err) => {
        OptimisticUiLikes(Math.random(), true);
        setIsLoading(false);
      });
  };
  const getLikes = async () => {
    setIsLoading(true);

    let subUrl = '';
    if (mType == 'news') {
      subUrl =
        '/api/search_read?model=portal.news' +
        `&domain=[["type", "=","news"], ["published","=",true], ["id","=",${mItem.id}]]` +
        '&fields=["like_ids"]';
    } else if (mType == 'family') {
      subUrl =
        '/api/search_read?model=portal.news' +
        `&domain=[["type", "=","family_news"], ["published","=",true], ["id","=",${mItem.id}]]` +
        '&fields=["like_ids"]';
    } else {
      subUrl =
        '/api/search_read?model=portal.news' +
        `&domain=[["type", "=","ads"],["published","=",true], ["id","=",${mItem.id}]]` +
        '&fields=["like_ids"]';
    }
    let url = baseUrl + subUrl;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        setLikes(responseData[0].like_ids ? responseData[0].like_ids : []);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const submitComment = async () => {
    if (comment.trim() < 1) {
      return;
    }

    setIsLoading(true);
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/create/news.comments?values={"employee_id": ${mEmpID},"comment":"${encodeURIComponent(
        comment,
      )}","news_id":${mItem.id}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setComment('');
        setIsLoading(false);
        getComments();
        setHeight(40);
        OptimisticUiComment(responseData);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const getComments = async () => {
    setIsLoading(true);
    let url =
      baseUrl +
      `/api/call/all.requests/get_comment_value?kwargs={"news_id": ${mItem.id}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        setAllComments(responseData.reverse());
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getEmpID = async () => {
    let mEmpId = await AsyncStorage.getItem('empID');
    setCurrentUserID(JSON.parse(mEmpId));
  };
  const imageSource = () => {
    const sources =
      mItem.hasOwnProperty('description') === true &&
      mItem.description === '<p><br></p>'
        ? ''
        : mItem.hasOwnProperty('description') === true &&
          mItem.description?.includes('<img') === true &&
          mItem.description
            ?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
            .map((x) => x.replace(/.*src="([^"]*)".*/, '$1'));
    setImageSrc(sources[0]);
    // console.log('MITEM-DESCRIPTION-------', mItem.description);
  };

  const hrefSource = () => {
    const href =
      mItem.hasOwnProperty('description') === true &&
      mItem.description?.includes('<a') === true &&
      mItem.description
        ?.match(/<a [^>]*href="[^"]*"[^>]*>/gm)
        .map((x) => x.replace(/.*href="([^"]*)".*/, '$1'));
    setHrefSrc(href[0]);
  };
  useEffect(() => {
    getComments();
    getLikes();
    getEmpID();
    mItem.description && imageSource();
    mItem.description && hrefSource();
    // console.log(
    //   'MITEM-DESCRIPTION-------',
    //   mItem.hasOwnProperty('description'),
    // );
  }, []);

  useEffect(() => {
    (async () => {
      let mEmpID = await AsyncStorage.getItem('empID');
      if (Likes.includes(JSON.parse(mEmpID))) {
        setLiked(true);
      }
    })();
  }, [mItem, Likes]);

  const DeleteComment = async () => {
    if (!itemToDelete) {
      return;
    }
    let secretUrl = await EncryptUrl(
      baseUrl + `/api/unlink/news.comments?ids=${itemToDelete.id}`,
    );
    await fetch(secretUrl, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData === true) {
          setAllComments(allComments.filter((a) => a.id != itemToDelete.id));
          setShowSuccessModal(true);
          OptimisticUiComment(itemToDelete.id, true);
          return responseData;
        } else return;
      })
      .catch((err) => {
        // console.log('error');
      });
    setModal2(false);
  };
  const PreDeleteComment = async (item) => {
    setItemToDelete(item);
    setModal2(true);
  };
  const renderComment = useCallback(
    ({ item }) => {
      return (
        <View style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderAuthor}>
              {item.employee_id ? item.employee_id[1].split(']')[1] : '--'}
            </Text>
            <Text style={styles.commentHeaderTime}>{item.create_date}</Text>
          </View>
          <Text style={styles.commentText}>
            {item.comment.trim()}
            {'\n'}
          </Text>

          {currentUserID && currentUserID == item.employee_id[0] && (
            <TouchableOpacity onPress={() => PreDeleteComment(item)}>
              <Icon name="delete-circle" size={25} color={'red'} />
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [currentUserID],
  );

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1, backgroundColor: '#00759810' }}
    >
      <NewHeader
        {...props}
        back
        title={
          mType == 'news'
            ? 'أخبار منشآت'
            : mType == 'family'
            ? 'عائلة منشآت'
            : 'فعاليات منشآت'
        }
      />
      <View style={{ alignItems: 'center', paddingBottom: 16 }}>
        <View style={{ width: '90%', height: '90%' }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 8,
              marginTop: -15,
            }}
          >
            <KeyboardAwareScrollView
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#20547a',
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  {mItem.title ? mItem.title : null}
                </Text>
                <View style={styles.activityDateContainer}>
                  <Text style={styles.activityDate}>
                    {Moment(mItem.create_date).format('DD-MM-YYYY hh:mm A')}
                  </Text>
                  <Image
                    source={require('../../assets/images/date.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
              {mItem.image ? (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 16,
                    justifyContent: 'center',
                  }}
                >
                  {mType === 'activity' ? (
                    <ImageModal
                      style={{
                        width: Dimensions.get('window').width * 0.8,
                        height: 400,
                        borderRadius: 10,
                        alignSelf: 'center',
                      }}
                      resizeMode="contain"
                      imageBackgroundColor="#fff"
                      source={{
                        uri: `data:image/jpeg;base64,${mItem.image}`,
                      }}
                    />
                  ) : (
                    <ImageModal
                      style={{
                        width: Dimensions.get('window').width * 0.8,
                        height: 400,
                        borderRadius: 10,
                        alignSelf: 'center',
                      }}
                      resizeMode="contain"
                      imageBackgroundColor="#fff"
                      source={{
                        uri: `data:image/jpeg;base64,${mItem.image}`,
                      }}
                    />
                  )}
                </View>
              ) : null}

              {mItem.hasOwnProperty('description') === true &&
                mType === 'activity' &&
                mItem.description?.includes('<img') === true && (
                  <View style={styles.viewStyle}>
                    <ImageModal
                      style={styles.imageStyle}
                      resizeMode="contain"
                      source={{
                        uri: `${baseUrl}${imageSrc}`,
                      }}
                    />
                  </View>
                )}
              <View style={styles.hyperLinkDesc}>
                <TouchableOpacity
                  delayPressIn={0}
                  onPress={() => Linking.openURL(uri)}
                >
                  <Text style={styles.descriptionStyle}>
                    {mItem.hasOwnProperty('description') === true &&
                      (mItem.description?.includes('<a') === true
                        ? hrefSrc
                        : mItem.description?.replace(/<\/?[^>]+(>|$)/g, ''))}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.likesContainer}>
                <Text style={styles.favCount}>
                  {Likes.length ? Likes.length : '0'}
                </Text>
                <MaterialCommunityIcon
                  name="heart"
                  size={30}
                  color={liked ? '#ff4444' : '#cdbfbe'} //  "#ff4444"
                  onPress={liked ? removeLike : submitLike}
                />
              </View>

              <TextInput
                onChangeText={setComment}
                value={comment}
                multiline={true}
                placeholder="اكتب تعليقك هنا"
                placeholderTextColor="#9c8a8a"
                style={[styles.placeholder, { height: height }]}
                onContentSizeChange={(e) =>
                  setHeight(e.nativeEvent.contentSize.height)
                }
                expanded={true}
              />
              <TouchableOpacity
                onPress={submitComment}
                style={styles.submitComment}
                disabled={isLoading}
              >
                <Text style={styles.submitText}>تعليق</Text>
              </TouchableOpacity>
              <View style={styles.commentsContainer}>
                <View style={styles.commentsHeader}>
                  <View style={styles.commentsCountContainer}>
                    <Text style={styles.commentsCount}>
                      {allComments.length ? allComments.length : '0'}
                    </Text>
                  </View>
                  <Text style={styles.commentsTitle}>التعليقات</Text>
                </View>

                <FlatList
                  data={allComments}
                  renderItem={renderComment}
                  contentContainerStyle={styles.comments}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
      {isLoading ? <Loader /> : null}

      <CommonPopup
        visible={modal2}
        text={'انت على وشك  حذف التعليق،  هل انت متأكد؟'}
        onClose={() => {
          if (!modal2) {
            return;
          }
          DeleteComment();
        }}
        onCancel={() => {
          setModal2(false);
        }}
      />
      <CommonPopup
        autoCLose
        visible={showSuccessModal}
        onClose={() => {
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 1000);
        }}
        text={'لقد تم حذف التعليق بنجاح'}
      />
    </LinearGradient>
  );
};

export default MonshaatNews;

const styles = StyleSheet.create({
  headingTextContainer: {
    alignItems: 'flex-end',
    paddingVertical: hp('2%'),
  },
  headingText: {
    borderRadius: 25,
    paddingHorizontal: wp('2%'),
    backgroundColor: '#007598',
    paddingVertical: hp('1%'),
  },
  activityDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    paddingHorizontal: 8,
  },
  activityDate: {
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
    color: '#90becc',
    marginHorizontal: 10,
    marginTop: 5,
  },
  placeholder: {
    width: '100%',
    // height: 60,
    minHeight: 45,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#d5e6ed',
    textAlign: 'right',
    padding: 10,
    fontFamily: '29LTAzer-Regular',
    color: '#007598',
  },
  submitComment: {
    width: '30%',
    height: 30,
    backgroundColor: '#007598',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  submitText: {
    fontFamily: '29LTAzer-Regular',
    color: 'white',
  },
  commentsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 10,
    // borderColor: "#efefef",
    // borderWidth: 1,
    marginTop: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentsCountContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007297',
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  commentsCount: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    color: 'white',
  },
  commentsTitle: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    color: '#707070',
  },
  comments: {
    marginTop: 20,
  },
  commentContainer: {
    borderColor: '#ddf0f7',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    flexGrow: 1,
  },
  commentHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  commentHeaderAuthor: {
    fontFamily: '29LTAzer-Regular',
    color: '#156a86',
    fontSize: 12,
  },
  commentHeaderTime: {
    fontFamily: '29LTAzer-Regular',
    color: '#959595',
    marginRight: 10,
    fontSize: 10,
  },
  commentText: {
    color: '#707070',
    textAlign: 'right',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  likesContainer: {
    fontFamily: '29LTAzer-Regular',
    flexDirection: 'row',
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
  hyperLinkDesc: {
    paddingHorizontal: wp('2%'),
    marginBottom: 30,
    top: hp('2%'),
  },
  imageStyle: {
    width: Dimensions.get('window').width * 0.8,
    height: hp('50%'),
    borderRadius: 10,
  },
  viewStyle: {
    //  marginTop: hp('18%'),
    alignItems: 'center',
    //top: hp('-16%'),
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  descriptionStyle: {
    color: '#688ba5',
    lineHeight: 20,
    fontSize: 16,
    fontFamily: '29LTAzer-Regular',
    textAlign: 'right',
  },
});
