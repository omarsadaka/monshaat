import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import { baseUrl } from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader';
import CustomPreviewModel from '../../components/CustomPreviewModel/CustomPreviewModel';
const BtnHitSlope = { top: 20, right: 20, left: 20, bottom: 20 };

export const IdeaView = ({
  item,
  comments,
  refreshIdea,
  isDetails,
  scrollToIndex,
}) => {
  const [disLiked, setDisLiked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comm_disLiked, setComm_disLiked] = useState(false);
  const [comm_liked, setComm_liked] = useState(false);
  const [sending, setSending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [empID, setEmpID] = useState('');
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const [commentID, setCommentID] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [height, setHeight] = useState(100);
  const [disLikes, setDisLikes] = useState([]);
  const [likes, setLikes] = useState([]);
  const dispatch = useDispatch();

  const Loading = () => {
    setIsLoading(true);
    dispatch;
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  useEffect(() => {
    (async () => {
      let mEmpID = await AsyncStorage.getItem('empID');
      setEmpID(mEmpID);

      if (item.count_up_ids.includes(JSON.parse(mEmpID))) {
        setLiked(true);
      }
      if (item.count_down_ids.includes(JSON.parse(mEmpID))) {
        setDisLiked(true);
      }
    })();
  }, [item, commentID, isloading]);

  const thumpUp = async () => {
    if (sending) {
      return;
    }
    setSending(true);
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/portal.reflection?ids=${item.id}&values={"count_up_ids":[[4, ${mEmpID}]]}`;
    if (liked) {
      url =
        baseUrl +
        `/api/write/portal.reflection?ids=${item.id}&values={"count_up_ids":[[3, ${mEmpID}]]}`;
    }
    // setIsLoading(true);

    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (disLiked) {
          let url =
            baseUrl +
            `/api/write/portal.reflection?ids=${item.id}&values={"count_down_ids":[[3, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              // setIsLoading(false);
              refreshIdea();
              setDisLiked(false);
              setTimeout(() => {
                setSending(false);
              }, 3000);
            })
            .catch((err) => {
              // setIsLoading(false);
            });
        } else {
          refreshIdea();
          if (liked) {
            setLiked(false);
          }
          setTimeout(() => {
            setSending(false);
          }, 3000);
        }
        // setIsLoading(false);
      })
      .catch((err) => {
        // setIsLoading(false);
      });
  };
  const thumpUp2 = async (id, item) => {
    if (isloading) {
      return;
    }
    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 2000);
    if (item.dislike_ids.includes(JSON.parse(empID))) {
      const index = item.dislike_ids.indexOf(JSON.parse(empID));
      item.dislike_ids.splice(index, 1);
    }
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/reflection.comments?ids=${id}&values={"dislike_ids":[[3, ${mEmpID}]]}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (!item.like_ids.includes(JSON.parse(empID))) {
          let url =
            baseUrl +
            `/api/write/reflection.comments?ids=${id}&values={"like_ids":[[4, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              // item.like_ids.push(JSON.parse(empID));
              // setTimeout(() => {
              //   if (item.like_ids.includes(JSON.parse(empID))) {
              //     setComm_liked(true);
              //   }
              // }, 300);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        } else {
          let url =
            baseUrl +
            `/api/write/reflection.comments?ids=${id}&values={"like_ids":[[3, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              // const index = item.like_ids.indexOf(JSON.parse(empID));
              // item.like_ids.splice(index, 1);
            });

          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const thumpDown = async () => {
    if (sending) {
      return;
    }
    setSending(true);

    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/portal.reflection?ids=${item.id}&values={"count_down_ids":[[4, ${mEmpID}]]}`;
    if (disLiked) {
      url =
        baseUrl +
        `/api/write/portal.reflection?ids=${item.id}&values={"count_down_ids":[[3, ${mEmpID}]]}`;
    }
    // setIsLoading(true);

    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (liked) {
          let url =
            baseUrl +
            `/api/write/portal.reflection?ids=${item.id}&values={"count_up_ids":[[3, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              refreshIdea();
              setLiked(false);
              setTimeout(() => {
                setSending(false);
              }, 3000); // setIsLoading(false);
            })
            .catch((err) => {
              // setIsLoading(false);
            });
        } else {
          refreshIdea();
          if (disLiked) {
            setDisLiked(false);
          }
          setTimeout(() => {
            setSending(false);
          }, 3000);
        }
        // setIsLoading(false);
      })
      .catch((err) => {
        // setIsLoading(false);
      });
  };

  const thumpDown2 = async (id, item) => {
    if (isloading) {
      return;
    }
    setIsLoading(true);

    if (item.like_ids.includes(JSON.parse(empID))) {
      const index = item.like_ids.indexOf(JSON.parse(empID));
      item.like_ids.splice(index, 1);
    }
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/write/reflection.comments?ids=${id}&values={"like_ids":[[3, ${mEmpID}]]}`;
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (!item.dislike_ids.includes(JSON.parse(empID))) {
          let url =
            baseUrl +
            `/api/write/reflection.comments?ids=${id}&values={"dislike_ids":[[4, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              // item.dislike_ids.push(JSON.parse(empID));
              // setTimeout(() => {
              //   if (item.dislike_ids.includes(JSON.parse(empID))) {
              //     setComm_disLiked(true);
              //   }
              // }, 300);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        } else {
          let url =
            baseUrl +
            `/api/write/reflection.comments?ids=${id}&values={"dislike_ids":[[3, ${mEmpID}]]}`;
          fetch(url, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
            .then((response) => response.json())
            .then((responseData) => {
              // const index = item.dislike_ids.indexOf(JSON.parse(empID));
              // item.dislike_ids.splice(index, 1);
            });

          setIsLoading(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const submitComment = async () => {
    if (comment.trim() < 1) {
      return;
    }
    if (isloading) {
      return;
    }
    setIsLoading(true);
    let mEmpID = await AsyncStorage.getItem('empID');
    let url =
      baseUrl +
      `/api/create/reflection.comments?values={"employee_id": ${mEmpID},"comment":"${encodeURIComponent(
        comment.trim(),
      )}","reflection_id":${item.id}}`;
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
        refreshIdea();
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const renderItem = ({ item }) => {
    const time = item?.duration?.split(',')[0];
    const day_value = time?.split(' ')[0];
    const day_label = time?.split(' ')[1];
    return (
      <View style={styles.commentsContainer}>
        <View
          style={{ width: '95%', flexDirection: 'row', alignItems: 'center' }}
        >
          <Text
            style={[
              styles.commentOwner,
              { fontSize: 10, flex: 1, marginHorizontal: 5 },
            ]}
          >
            {/* {'منذ'} {Math.abs(day_value)} {day_label == 'day' ? 'يوم' : 'أيام'} */}
            {/* {'منذ'} {item.duration.split(',')[0]} */}
            {/* {item.duration} */}
            {'منذ '}
            {item.duration_days > 0
              ? (item.duration_days | 0) + ' يوم'
              : item.duration_hours > 1
              ? (item.duration_hours | 0) + ' ساعة'
              : (item.duration_minuets | 0) + ' دقيقة'}
          </Text>
          <Text style={styles.commentOwner}>
            {item.employee_id[1].split(']')[1]}
          </Text>
        </View>

        <Text style={styles.commentText}>{item.comment}</Text>
        <View
          style={{
            width: '25%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'flex-end',
            marginTop: 7,
          }}
        >
          <TouchableOpacity
            style={styles.singleActivityContainer}
            onPress={() => {
              // if (!item.dislike_ids.includes(JSON.parse(empID)) && !isloading) {
              // item.dislike_ids.push(JSON.parse(empID));
              // setTimeout(() => {
              //   if (item.dislike_ids.includes(JSON.parse(empID))) {
              //     setComm_disLiked(true);
              //   }
              // }, 300);

              if (!item.dislike_ids.includes(JSON.parse(empID))) {
                item.dislike_ids.push(JSON.parse(empID));
                setTimeout(() => {
                  if (item.dislike_ids.includes(JSON.parse(empID))) {
                    setComm_disLiked(true);
                  }
                }, 300);
              } else {
                const index = item.dislike_ids.indexOf(JSON.parse(empID));
                item.dislike_ids.splice(index, 1);
              }
              thumpDown2(item.id, item);
              // }
            }}
          >
            <Entypo
              name="thumbs-down"
              size={15}
              color={
                item.dislike_ids.includes(JSON.parse(empID))
                  ? '#E23636'
                  : '#D1D3D4'
              }
              // color={'#D1D3D4'}
            />
            <Text style={styles.activityText}>
              {item.dislike_ids ? item.dislike_ids.length : '0'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.singleActivityContainer}
            onPress={() => {
              // if (!item.like_ids.includes(JSON.parse(empID)) && !isloading) {
              // item.like_ids.push(JSON.parse(empID));
              // setTimeout(() => {
              //   if (item.like_ids.includes(JSON.parse(empID))) {
              //     setComm_liked(true);
              //   }
              // }, 300);
              if (!item.like_ids.includes(JSON.parse(empID))) {
                item.like_ids.push(JSON.parse(empID));
                setTimeout(() => {
                  if (item.like_ids.includes(JSON.parse(empID))) {
                    setComm_liked(true);
                  }
                }, 300);
              } else {
                const index = item.like_ids.indexOf(JSON.parse(empID));
                item.like_ids.splice(index, 1);
              }
              thumpUp2(item.id, item);
              // }
            }}
          >
            <Entypo
              name="thumbs-up"
              size={15}
              color={
                item.like_ids.includes(JSON.parse(empID))
                  ? '#008AC5'
                  : '#D1D3D4'
              }
            />
            <Text style={styles.activityText}>
              {item.like_ids ? item.like_ids.length : '0'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // console.log('item', item);
  return (
    <View
      style={[
        styles.ideaContainer,
        Platform.OS === 'android' && styles.ideaAndroid,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setShowComments(true);
          // comments ? null : navigation.navigate('BankComments', { item: item })
        }}
        style={{
          height: showComments ? null : Dimensions.get('window').height * 0.13,
        }}
      >
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.statusText, { backgroundColor: '#00759850' }]}>
              {' '}
              تطبيق الموظفين
            </Text>
            {item &&
            item.attachment_ids &&
            item.attachment_ids.length > 0 > 0 ? (
              <Image
                source={require('../../assets/images/order/attatchments.png')}
                style={{ width: 15, height: 15 }}
                resizeMode="contain"
              />
            ) : null}
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.infoText}>
              {item.employee_id ? item.employee_id[1].split(']')[1] : '--'}
            </Text>
            <Text style={styles.infoText2}>
              {item && item.service_management_id
                ? item.service_management_id[1]
                : '--'}
            </Text>
          </View>
          <Image
            source={
              item.image
                ? { uri: `data:image/jpeg;base64,${item.image}` }
                : require('../../assets/images/user.png')
            }
            style={{ width: 40, height: 40, borderRadius: 5 }}
          />
        </View>

        {/* <View style={[styles.ideaheaderContainer]}>
          {item.is_not_show_name === true ? (
            <Text style={styles.ideaheaderText} />
          ) : (
            <Text style={styles.ideaheaderText}>
              {item.employee_id ? item.employee_id[1].split(']')[1] : '--'}
            </Text>
          )}

          <Text style={styles.ideaheaderText}>{item.name}</Text>
        </View> */}
        {/* <Text style={styles.ideaBodyProvider}>
          اسم الخدمة / الجهة :{' '}
          {item && item.service_management_id
            ? item.service_management_id[1]
            : '--'}
        </Text> */}
        <Text
          style={styles.ideaBodyConten}
          numberOfLines={showComments ? null : 3}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
      <View style={styles.ideaActivityContainer}>
        <TouchableOpacity
          style={styles.singleActivityContainer}
          onPress={() => setShowComments(true)}
        >
          <MaterialCommunityIcons name="message" size={20} color={'#d2d3d5'} />
          <Text style={styles.activityText}>
            {item.comments ? item.comments.length : 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={BtnHitSlope}
          // disabled={liked}
          onPress={() => {
            thumpDown();
          }}
          style={styles.singleActivityContainer}
        >
          <Entypo
            name="thumbs-down"
            size={20}
            color={disLiked ? '#E23636' : '#D1D3D4'}
          />
          <Text style={styles.activityText}>
            {item.count_down_ids ? item.count_down_ids.length : 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={BtnHitSlope}
          onPress={() => {
            thumpUp();
          }}
          style={styles.singleActivityContainer}
        >
          <Entypo
            name="thumbs-up"
            size={20}
            color={liked ? '#008AC5' : '#D1D3D4'}
          />
          <Text style={styles.activityText}>
            {item.count_up_ids ? item.count_up_ids.length : 0}
          </Text>
        </TouchableOpacity>
      </View>
      {showComments && isDetails ? (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: 'gray',
              marginVertical: 5,
            }}
          />

          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}
          >
            {item && item.attachment_ids && item.attachment_ids.length > 0 ? (
              <OrderViewAttatchment
                dispatch={Loading}
                accessToken={accessToken}
                attatchments={item.attachment_ids}
                styleCon={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  right: 10,
                }}
                style={{ width: 20, height: 20, marginTop: 10, right: 7 }}
              />
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
          >
            <Text
              style={[styles.activityText, { flex: 1, textAlign: 'right' }]}
            >
              التعليقات
            </Text>
            <MaterialCommunityIcons
              name="message"
              size={20}
              color={'#d2d3d5'}
            />
          </View>
          <FlatList
            style={{
              width: '90%',
            }}
            nestedScrollEnabled
            data={item.comments}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <View
            style={{
              width: '90%',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 5,
            }}
          >
            <Text style={styles.addComment}>إضافة تعليق</Text>
            <MaterialCommunityIcons
              name="message"
              size={18}
              color={'#A3A3A3'}
            />
          </View>
          <TextInput
            onChangeText={setComment}
            value={comment}
            multiline={true}
            // placeholder="اكتب تعليقك هنا"
            placeholderTextColor="#9c8a8a"
            style={[styles.placeholder, { height: 80 }]}
            onContentSizeChange={(e) =>
              setHeight(e.nativeEvent.contentSize.height)
            }
            expanded={true}
          />
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginHorizontal: '5%',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowComments(false);
                setComment('');
                scrollToIndex();
              }}
              style={styles.close}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: '#4B4B4B',
                  fontFamily: '29LTAzer-Medium',
                  fontSize: 11,
                }}
              >
                {' '}
                إغلاق
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitComment}
              style={styles.submitComment}
            >
              <Text style={styles.submitText}>إرسال</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* <CustomPreviewModel
        isVesible={isVesible}
        onClosePress={() => setIsVesible(false)}
        type={type}
        data={url}
      /> */}
      {isloading && <Loader />}
    </View>
  );
};
const styles = StyleSheet.create({
  ideaContainer: {
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 10,
    width: '93%',
    minWidth: '90%',
    minHeight: 100,
    backgroundColor: '#FCFCFC',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    elevation: 3,
    // height: Dimensions.get('window').height * 0.2,
  },
  ideaAndroid: {
    borderColor: '#ededed',
    borderWidth: 1.5,
  },
  ideaheaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    // width:"80%"
  },
  ideaheaderText: {
    fontFamily: '29LTAzer-Regular',
    color: '#136c8a',
    textAlign: 'center',
    fontSize: 12,
    marginHorizontal: 5,
    maxWidth: '50%',
  },
  infoText: {
    fontFamily: '29LTAzer-Bold',
    textAlign: 'right',
    fontSize: Dimensions.get('window').width * 0.035,
    marginHorizontal: 5,
    color: '#4B4B4B',
  },
  infoText2: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'right',
    fontSize: Dimensions.get('window').width * 0.031,
    marginTop: 5,
    marginHorizontal: 5,
    color: '#4B4B4B',
  },
  ideaheaderButton: {
    backgroundColor: '#fff',
    borderColor: '#007297',
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
    width: 65,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ideaBodyProvider: {
    color: '#959595',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'right',
    fontSize: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  ideaBodyConten: {
    color: '#4B4B4B',
    fontFamily: '29LTAzer-Regular',
    textAlign: 'right',
    fontSize: Dimensions.get('window').width * 0.03,
    marginTop: 3,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  ideaActivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 30,
    width: '40%',
    marginTop: Platform.OS == 'android' ? 7 : 0,
    // position: 'absolute',
    // bottom: 3,
    // right: 5,
  },
  singleActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    fontSize: Dimensions.get('window').width * 0.03,
    color: '#9b9b9b',
    marginHorizontal: 3,
  },
  commentsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 7,
    borderColor: '#E8E8E8',
    borderWidth: 0.5,
    paddingVertical: 5,
  },
  commentOwner: {
    fontFamily: '29LTAzer-Medium',
    textAlign: 'right',
    fontSize: 12,
    color: '#007297',
  },
  commentText: {
    width: '95%',
    fontFamily: '29LTAzer-Medium',
    textAlign: 'right',
    fontSize: 10,
    color: '#707070',
    marginTop: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 4,
  },
  statusText: {
    borderRadius: Platform.OS == 'android' ? 20 : 8,
    padding: 3,
    color: '#4B4B4B',
    fontSize: Dimensions.get('window').width * 0.025,
    marginHorizontal: 1,
    overflow: 'hidden',
  },
  addComment: {
    flex: 1,
    fontFamily: '29LTAzer-Medium',
    textAlign: 'right',
    fontSize: 12,
    color: '#8F8282',
  },
  placeholder: {
    width: '90%',
    // minHeight: 47,
    borderWidth: 0.6,
    borderRadius: 5,
    borderColor: '#CECECE',
    textAlign: 'right',
    padding: 10,
    fontFamily: '29LTAzer-Regular',
    color: '#007598',
    marginBottom: 5,
  },
  submitComment: {
    width: '20%',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#008AC5',
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 3,
  },
  submitText: {
    fontFamily: '29LTAzer-Regular',
    color: 'white',
    fontSize: 12,
  },
  close: {
    width: '20%',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingVertical: 5,
    marginVertical: 5,
  },
});
