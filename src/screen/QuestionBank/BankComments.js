import AsyncStorage from '@react-native-community/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import { baseUrl } from '../../services';
import { IdeaView } from './IdeaView';

const BankComments = props => {
  const [isloading, setIsLoading] = useState(false);
  const [item, setItem] = useState({});
  const [comment, setComment] = useState('');
  const [height, setHeight] = useState(40);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  const dispatch = useDispatch();

  const Loading = () => {
    setIsLoading(true);
    dispatch;
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //
      if (props.route.params && props.route.params.item) {
        setItem(props.route.params.item);
      }
    });
  });
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
      .then(response => response.json())
      .then(responseData => {
        setComment('');
        refreshIdea();
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const refreshIdea = async () => {
    setIsLoading(true);
    let url =
      baseUrl +
      `/api/call/all.requests/get_single_reflection?kwargs={"reflection_id": ${item.id}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        setItem(responseData[0]);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const renderComment = useCallback(({ item }) => {
    const time = item?.duration?.split(',')[0];
    const day_value = time?.split(' ')[0];
    const day_label = time?.split(' ')[1];
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentHeaderAuthor}>
            {item.employee_id ? item.employee_id[1].split(']')[1] : '--'}
          </Text>
          <Text style={styles.commentHeaderTime}>
            {'منذ'} {day_value ? Math.abs(day_value) : '1'}{' '}
            {day_label == 'day' ? 'يوم' : 'أيام'}
            {/* {item.create_date} */}
            {/* {'منذ'} {item.duration.split(',')[0]} */}
          </Text>
        </View>
        <Text style={styles.commentText}>
          {item.comment.split('<br/>').join('\n')}
          {'\n'}
        </Text>
      </View>
    );
  }, []);
  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="  بنك الأفكار " />
      <View
        style={{
          marginTop: -20,
          zIndex: 99,
          height: '88%',
        }}
      >
        {/* <KeyboardAwareScrollView scrollEnabled={false}> */}
        <View style={styles.cardContainer}>
          {/* <BankBasicForm
              updateIdeas={refreshIdea}
              setIsLoading={setIsLoading}
              {...props}
            /> */}

          {item && (
            <IdeaView
              item={item}
              comments={true}
              refreshIdea={() => refreshIdea()}
              isDetails={false}
            />
          )}

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
            ) : (
              <OrderViewItem
                title1="المرفقات"
                title2="لا يوجد مرفق"
                icon={require('../../assets/images/order/attatchments.png')}
                styleText={{
                  fontSize: 14,
                  color: 'gray',
                  fontFamily: '29LTAzer-Regular',
                  marginVertical: 2,
                  textAlign: 'right',
                  flex: 1,
                  marginHorizontal: 7,
                }}
                styleCon={{
                  width: '90%',
                  // flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#bfd8e0',
                  marginTop: 10,
                }}
              />
            )}
          </View>

          <View style={{ paddingHorizontal: '5%' }}>
            <View style={styles.singleActivityContainer}>
              <FontAwesome name="comment" size={15} color="grey" />
              <Text style={styles.activityText}>التعليقات</Text>
            </View>
            <TextInput
              onChangeText={setComment}
              value={comment}
              multiline={true}
              placeholder="اكتب تعليقك هنا"
              placeholderTextColor="#9c8a8a"
              style={[styles.placeholder, { height: height }]}
              onContentSizeChange={e =>
                setHeight(e.nativeEvent.contentSize.height)
              }
              expanded={true}
            />
            <TouchableOpacity
              onPress={submitComment}
              style={styles.submitComment}
            >
              <Text style={styles.submitText}>إرسال</Text>
            </TouchableOpacity>
            {item && (
              <FlatList
                data={
                  item.comments && item.comments.length > 0
                    ? item.comments.reverse()
                    : []
                }
                renderItem={renderComment}
                contentContainerStyle={styles.comments}
                extraData={item}
                scrollEnabled={true}
              />
            )}
          </View>
        </View>
        {isloading ? <Loader /> : null}
      </View>
    </LinearGradient>
  );
};
export default BankComments;
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
    paddingTop: 20,
    height: '100%',
    // alignItems: 'center',
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
  singleActivityContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: 4,
  },
  activityText: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    fontSize: 14,
    color: '#9b9b9b',
    marginHorizontal: 5,
  },
  comments: {
    marginTop: 20,
    paddingBottom: 450,
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
    // flexDirection: "column",
    flexWrap: 'wrap',
    // paddingHorizontal: 10,
  },
});
