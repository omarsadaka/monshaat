import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  PixelRatio,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SearchBar, Icon, Input } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import NewHeader from '../../components/NewHeader';
import {
  getCorrespondnatList,
  getCountUnseen,
} from '../../redux/action/messageActions';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';

const NavigationTabs = ({
  onFirstTaBress = () => {},
  onSecondTabPress = () => {},
  active,
}) => {
  const [activeTab, setActiveTab] = useState('chatHistory');
  React.useEffect(() => {
    if (active === 0) {
      setActiveTab('chatHistory');
    }
    if (active === 1) {
      setActiveTab('ExpertList');
    }
  }, [active]);
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              width: '100%',
              backgroundColor: activeTab == 'chatHistory' ? '#007598' : '#fff',
            },
          ]}
          onPress={() => {
            setActiveTab('chatHistory');
            onFirstTaBress();
            AnnalyticsFirebase('Chat_Tab_Screen');
          }}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'chatHistory' ? 'white' : '#20547a',
                height: 20,
              },
            ]}
            numberOfLines={1}
          >
            المحادثات
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ borderLeftWidth: 1, borderLeftColor: 'white' }} />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[
            styles.activeTab,
            {
              width: '100%',
              backgroundColor: activeTab == 'ExpertList' ? '#007598' : '#fff',
            },
          ]}
          onPress={() => {
            setActiveTab('ExpertList');
            onSecondTabPress();
            AnnalyticsFirebase('Expert_List_Screen');
          }}
        >
          <Text
            style={[
              styles.activeTabText,
              {
                color: activeTab == 'ExpertList' ? 'white' : '#20547a',
                height: 20,
              },
            ]}
            numberOfLines={1}
          >
            قائمة الخبراء
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MemoizedNavigation = React.memo(NavigationTabs);

const MyChat = props => {
  const localUser = useSelector(
    state => state.ProfileReducer.userProfileData[0],
  );
  const unViewdCount = useSelector(state => state.messageReducer.unSeenCount);
  const [activeTab, setActiveTab] = useState(null);

  const correspondantsList = useSelector(
    state => state.messageReducer.correspondantsList,
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  const [listExperts, setListExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empid, setEmpId] = useState('');
  const [state, setState] = useState({
    keywords: '',
    isSearched: false,
    listSearchEmp: correspondantsList,
    filteredLists: [],
    selectedEmp: false,
    isLoadingg: false,
  });
  const isLoading = useSelector(
    state => state.CommonLoaderReducer.isLoadingStand,
  );

  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Chat_Screen');
    }
  }, [isFocused]);
  useEffect(() => {
    if (!localUser) {
      return;
    }
    dispatch(getCorrespondnatList(localUser.id, accessToken));
  }, [correspondantsList.length, unViewdCount]);

  useEffect(() => {
    if (!localUser) {
      return;
    }
    dispatch(getCorrespondnatList(localUser.id, accessToken));
  }, [isFocused]);

  useEffect(async () => {
    let empid = await AsyncStorage.getItem('empID');
    setEmpId(empid);
  }, []);
  const [viewExperts, setViewExperts] = useState(false);

  useEffect(() => {
    localUser && dispatch(getCountUnseen(localUser.id));
  }, [isFocused]);

  const onPullToRefresh = () => {
    getExpertList().then(experts => {
      let expList = [];
      experts.map((expert, i) => {
        if (expert) {
          let expName = expert.name;
          let expDes = expert.description;
          let expImage = expert.image;

          let exp = {
            id: i,
            name: expName,
            description: expDes,
            image: expImage,
            user: expert,
          };
          expList.push(exp);
        }
      });
      setListExperts(expList);
    });
  };
  async function getExpertList() {
    setLoading(true);
    let accessToken = await AsyncStorage.getItem('accessToken');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + accessToken);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    const url = baseUrl + '/api/call/all.requests/retrieve_experts_list';
    let secretUrl = await EncryptUrl(url);
    return fetch(secretUrl, requestOptions)
      .then(response => response.json())
      .then(responseData => {
        let arr = [];
        responseData.map(el => {
          arr.push(el);
        });
        setLoading(false);

        return arr;
      })
      .catch(function(error) {
        setLoading(false);
        throw error;
      });
  }

  useEffect(() => {
    getExpertList().then(experts => {
      let expList = [];
      experts.map((expert, i) => {
        if (expert) {
          let expName = expert.name;
          let expDes = expert.description;
          let expImage = expert.image;

          let exp = {
            id: i,
            name: expName,
            description: expDes,
            image: expImage,
            user: expert,
          };
          expList.push(exp);
        }
      });
      setListExperts(expList);
    });
    return () => (mounted = false);
  }, [isFocused]);
  const ExpertList = props => {
    const localUser = useSelector(
      state => state.ProfileReducer.userProfileData[0],
    );
    return (
      <ScrollView
        style={{ marginBottom: 40 }}
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onPullToRefresh} />
        }
      >
        {props.data.length
          ? props.data.map(expert => {
              return (
                <TouchableOpacity
                  style={AppStyle.employeeItem}
                  key={expert.id}
                  onPress={() => {
                    if (!Array.isArray(expert.user.employee_id)) {
                      return console.log('employee id not valid');
                    }
                    // console.log('expert', expert);
                    expert.user.id != localUser.id
                      ? props.navigation.navigate('MessagesFeed', {
                          correspondant: {
                            ...expert.user.employee_data[0], //employee_data
                            image: expert.image,
                          },
                          message: '',
                          type: 'community',
                        })
                      : showMessage({
                          style: { alignItems: 'flex-end' },
                          type: 'danger',
                          message: 'لايمكن بدء المحادثة لكونها مع نفس المستخدم',
                        });
                  }}
                >
                  <View style={AppStyle.employeeDetailsContainer}>
                    <View>
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${expert.image}`,
                        }}
                        style={AppStyle.employeeImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={[AppStyle.employeeInfo, { width: '80%' }]}>
                      <Text
                        style={[
                          styles.expertText,
                          {
                            fontSize: 16,
                            alignSelf:
                              Platform.OS === 'android'
                                ? 'flex-end'
                                : 'flex-start',
                            marginBottom: 14,
                          },
                        ]}
                      >
                        {expert.name}
                      </Text>
                      <Text numberOfLines={2} style={styles.expertText}>
                        {expert.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </ScrollView>
    );
  };
  const NavChange = useCallback(value => {
    setViewExperts(value);
  }, []);

  const searchAllEmp = (mKeywords, mIsSearched) => {
    setState({
      ...state,
      keywords: mKeywords,
      selectedEmp: mKeywords === '' ? false : true,
      isSearched: mKeywords === '' ? false : mIsSearched,
      filteredLists:
        mKeywords === '' ? correspondantsList : state.filteredLists,
    });
    if (mKeywords.length > 0) {
      searchEmpFl(mKeywords);
    }
  };

  const searchEmpFl = mKeywords => {
    setState({ ...state, isLoadingg: true });
    const searchText = JSON.stringify(mKeywords);
    let url =
      baseUrl +
      `/api/call/all.requests/employee_chat_search_request?kwargs={"employee_object":${searchText}}`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        setState({ ...state, listSearchEmp: responseData, isSearched: true });
      })
      .catch(function(error) {
        throw error;
      });
  };

  const handleNotificationRoute = showExpritList => {
    setActiveTab(showExpritList ? 1 : 0);
    NavChange(showExpritList);
    setActiveTab(null);
  };

  useEffect(() => {
    if (typeof props?.route?.params?.viewExperts === 'boolean') {
      setTimeout(() => {
        handleNotificationRoute(props.route.params.viewExperts);
      }, 2000);
    }
  }, [props.route.params]);
  useEffect(() => {
    if (state.listSearchEmp.length > 0) {
      setState({
        ...state,
        isLoadingg: false,
        isSearched: true,
      });
    }
    if (state.listSearchEmp.length < 1 && state.keywords.length === 0) {
      setState({
        ...state,
        isLoadingg: true,
        isSearched: true,
      });
    } else if (
      state.listSearchEmp.length < 1 &&
      state.keywords.length > 0 &&
      state.isSearched === true
    ) {
      setState({
        ...state,
        isLoadingg: false,
        isSearched: true,
      });
    }
  }, [state.listSearchEmp]);

  const getAllEmployees = mIsSearched => {
    setState({
      ...state,
      keywords: '',
      selectedEmp: false,
      isSearched: false,
      listSearchEmp: [],
      filteredLists: correspondantsList,
    });
  };
  const clearBackSpace = () => {
    setState({
      ...state,
      selectedEmp: false,
      isSearched: false,
      listSearchEmp: [],
      filteredLists: correspondantsList,
      isLoadingg: true,
    });
  };

  // console.log('correspondantsList', correspondantsList);
  const render = () => {
    return (
      <View style={styles.dropDownContainer}>
        {state.isLoadingg === true ? (
          <View style={styles.activityAnd}>
            <CustomActivityIndicator modalVisible={true} />
          </View>
        ) : (
          <ScrollView>
            {state.listSearchEmp.length > 0 ? (
              state.listSearchEmp
                .filter(it => String(it.id) !== String(empid))
                .map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.employeeContainer}
                      onPress={() => {
                        setState({
                          ...state,
                          keywords: '',
                          isSearched: false,
                          selectedEmp: false,
                          filteredLists: state.listSearchEmp.filter(el => {
                            let a = el.complete_name.includes(
                              item.complete_name,
                            );
                            return a;
                          }),
                        });
                        props.navigation.navigate('MessagesFeed', {
                          correspondant: item, //
                          type: 'community',
                          imgSrc: `${baseUrl}/web/image?model=hr.employee&id=${item.id}&field=image_small`,
                        });
                      }}
                    >
                      <View>
                        <Text style={styles.completeName} numberOfLines={1}>
                          {item.complete_name}
                        </Text>
                      </View>
                      <View style={styles.jobIdStyle}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.itemMonshaatJob}
                        >
                          {item.job_id ? item.job_id[1] : ''}
                        </Text>
                      </View>

                      <View style={styles.employeeStatusContainer}>
                        <View
                          style={[
                            styles.employeeStatus,
                            item.attendance_state === 'onduty'
                              ? styles.onDutyStyle
                              : item.attendance_state === 'holidays'
                              ? styles.holidayStyle
                              : item.attendance_state === 'deputation'
                              ? styles.deputationStyle
                              : item.attendance_state === 'training'
                              ? styles.trainingStyle
                              : item.attendance_state === 'distance_work'
                              ? styles.distanceWorkStyle
                              : item.attendance_state === 'absence'
                              ? styles.absenceStyle
                              : item.attendance_state === 'authorization'
                              ? styles.authoStyle
                              : styles.attendanceStyle,
                          ]}
                        >
                          <Text
                            style={[AppStyle.h3, styles.itemAttendanceStyle]}
                            numberOfLines={1}
                          >
                            {/* {PixelRatio.getFontScale()} */}
                            {item.attendance_state === 'onduty'
                              ? 'متواجد'
                              : item.attendance_state === 'holidays'
                              ? 'اجازة'
                              : item.attendance_state === 'deputation'
                              ? 'انتداب'
                              : item.attendance_state === 'training'
                              ? 'تدريب'
                              : item.attendance_state === 'distance_work'
                              ? 'عمل عن بعد'
                              : item.attendance_state === 'absence'
                              ? 'غياب'
                              : item.attendance_state === 'authorization'
                              ? 'استئذان'
                              : ''}{' '}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
            ) : (
              <Text style={styles.textBoxStyle}>لم يتم العثور على نتائج</Text>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        AppStyle.page,
        { flexDirection: 'column', backgroundColor: '#F0F1F2' },
      ]}
    >
      <LinearGradient
        colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
        style={{ flex: 1 }}
      >
        <NewHeader {...props} back={false} />

        <MemoizedNavigation
          active={activeTab}
          onFirstTaBress={() => {
            NavChange(false);
          }}
          onSecondTabPress={() => {
            NavChange(true);
          }}
        />

        {/* {!viewExperts && (
          <SearchBar
            style={{ fontFamily: '29LTAzer-Regular' }}
            placeholder={'البحث'}
            onChangeText={e => {
              setState({ ...state, keywords: e, isSearched: false });
              if (e === '') {
                Keyboard.dismiss();
                getAllEmployees();
              }
            }}
            onClear={() => {
              getAllEmployees();
              Keyboard.dismiss();
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                clearBackSpace();
              }
            }}
            value={state.keywords}
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              paddingHorizontal: 16,
              marginTop: -20,
            }}
            leftIconContainerStyle={{ fontSize: 16 }}
            inputContainerStyle={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              direction: 'rtl',
            }}
            inputStyle={{
              direction: 'rtl',
              textAlign: 'right',
              color: '#7b9eb8',
            }}
            icon={{ type: 'AntDesign', color: '#86939e', name: 'search1' }}
            onSubmitEditing={e => {
              setState({ ...state, isLoadingg: true });
              searchAllEmp(e.nativeEvent.text, true);
            }}
            searchIcon={true}
            placeholderTextColor="#7b9eb8"
            placeholderFontFamily="29LTAzer-Regular"
          />
        )} */}

        {!viewExperts &&
          (Platform.OS == 'android' ? (
            <Input
              placeholder="البحث"
              placeholderTextColor="#7b9eb8"
              underlineColorAndroid="transparent"
              defaultValue={state.keywords}
              onChangeText={e => {
                setState({ ...state, keywords: e, isSearched: false });
                if (e === '') {
                  Keyboard.dismiss();
                  getAllEmployees();
                }
              }}
              onClear={() => {
                getAllEmployees();
                Keyboard.dismiss();
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  clearBackSpace();
                }
              }}
              onSubmitEditing={e => {
                setState({ ...state, isLoadingg: true });
                searchAllEmp(e.nativeEvent.text, true);
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: '29LTAzer-Regular',
                color: '#7b9eb8',
                marginHorizontal: 8,
              }}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                paddingHorizontal: 16,
                marginTop: -10,
              }}
              inputContainerStyle={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                direction: 'rtl',
                borderBottomWidth: 0,
              }}
              inputStyle={{
                direction: 'rtl',
                textAlign: 'right',
                color: '#7b9eb8',
              }}
              rightIcon={
                <Icon
                  name={'search'}
                  type="AntDesign"
                  size={17}
                  color={'#7b9eb8'}
                />
              }
            />
          ) : (
            <Input
              placeholder="البحث"
              placeholderTextColor="#7b9eb8"
              underlineColorAndroid="transparent"
              defaultValue={state.keywords}
              onChangeText={e => {
                setState({ ...state, keywords: e, isSearched: false });
                if (e === '') {
                  Keyboard.dismiss();
                  getAllEmployees();
                }
              }}
              onClear={() => {
                getAllEmployees();
                Keyboard.dismiss();
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  clearBackSpace();
                }
              }}
              onSubmitEditing={e => {
                setState({ ...state, isLoadingg: true });
                searchAllEmp(e.nativeEvent.text, true);
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                direction: 'rtl',
                textAlign: 'right',
                fontFamily: '29LTAzer-Regular',
                color: '#7b9eb8',
                marginHorizontal: 8,
              }}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                paddingHorizontal: 16,
                marginTop: -10,
              }}
              inputContainerStyle={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                direction: 'rtl',
                borderBottomWidth: 0,
              }}
              inputStyle={{
                direction: 'rtl',
                textAlign: 'right',
                color: '#7b9eb8',
              }}
              leftIcon={
                <Icon
                  name={'search'}
                  type="AntDesign"
                  size={17}
                  color={'#7b9eb8'}
                />
              }
            />
          ))}

        {!viewExperts &&
          state.isSearched &&
          state.keywords.length > 0 &&
          render()}

        {viewExperts ? (
          <View style={styles.wrapper}>
            <View style={{ paddingVertical: 8 }}>
              {listExperts.length && !loading ? (
                <ExpertList data={listExperts} {...props} a={123} />
              ) : (
                <CustomActivityIndicator modalVisible={true} />
              )}
            </View>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 120 }}
              ListHeaderComponent={() => {
                if (!isLoading) {
                  return null;
                }
                return <CustomActivityIndicator modalVisible={true} />;
              }}
              ListEmptyComponent={() => {
                if (isLoading) {
                  return null;
                }
                return (
                  <View>
                    <Text
                      style={{
                        fontFamily: '29LTAzer-Regular',
                        textAlign: 'center',
                        marginTop: Dimensions.get('window').height / 3,
                      }}
                    >
                      لا توجد محادثات
                    </Text>
                  </View>
                );
              }}
              // data={correspondantsList.filter(e => e.complete_name)}
              data={correspondantsList}
              keyExtractor={(item, i) => String(i)}
              renderItem={({ item }) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={AppStyle.employeeItem}
                      onPress={() => {
                        // console.log('item chatt', item);
                        props.navigation.navigate('MessagesFeed', {
                          correspondant: item,
                          type: 'community',
                          imgSrc: `${baseUrl}/web/image?model=hr.employee&id=${item.id}&field=image_small`,
                        });
                      }}
                    >
                      <View style={AppStyle.employeeDetailsContainer}>
                        <View>
                          {item.image ? (
                            <Image
                              source={{
                                uri: `data:image/jpeg;base64,${item.image}`,
                              }}
                              style={AppStyle.employeeImage}
                              resizeMode="cover"
                              onError={() =>
                                setState({
                                  ...state,
                                  imageLoading: false,
                                })
                              }
                            />
                          ) : (
                            <Image
                              source={require('../../assets/images/user.png')}
                              style={AppStyle.employeeImage}
                              resizeMode="cover"
                            />
                          )}
                        </View>
                        {!item.seen && (
                          <View
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 10,
                              backgroundColor: 'red',
                              marginTop: -20,
                              marginLeft: 20,
                              marginRight: -5,
                            }}
                          />
                        )}
                        <View
                          style={{
                            paddingHorizontal: 8,
                            flexDirection: 'column',
                            direction: 'rtl',
                            alignItems:
                              Platform.OS === 'android'
                                ? 'flex-end'
                                : 'flex-start',
                            justifyContent: 'space-between',
                            width: '65%',
                          }}
                        >
                          <Text style={styles.itemMonshaatText}>
                            {item?.sector_id ? item?.sector_id[1] : ''}
                          </Text>

                          <Text style={styles.itemMonshaatName}>
                            {item.complete_name}
                          </Text>
                          <Text style={styles.itemMonshaatJob}>
                            {item?.job_id && item?.job_id !== 'false'
                              ? item?.job_id[1]
                              : ''}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default MyChat;
const styles = StyleSheet.create({
  employeeStatus: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5CB46680',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 4,
    fontFamily: '29LTAzer-Regular',
  },
  employeeStatusContainer: {
    marginTop: -5,
    width: 75,
    padding: 8,
    height: 50,
    right: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  container1: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  activeTabText: {
    textAlign: 'center',
    // fontWeight: "bold",
    height: Platform.OS === 'android' ? undefined : 15,
    fontFamily: '29LTAzer-Regular',
  },
  qrIconContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    paddingVertical: hp('2%'),
    width: '80%',
    justifyContent: 'space-around',
  },
  directManagerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  directManagerText: { padding: 8, color: '#20547a', fontWeight: 'bold' },
  directmanagerIconContainer: {
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  directManagerIcon: { width: 15, height: 15 },
  itemMonshaatText: {
    color: '#18ab91',
    fontSize: 10,
    paddingVertical: 3,
    fontFamily: '29LTAzer-Regular',
  },
  itemMonshaatName: {
    color: '#20547a',
    fontSize: 16,
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
  },
  itemMonshaatJob: {
    color: '#7b9eb8',
    fontSize: 12,
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
    textAlign: 'left',
  },
  expertText: {
    fontSize: 14,
    fontFamily: '29LTAzer-Regular',
    textAlign: Platform.OS === 'android' ? 'right' : 'left',
  },
  wrapper: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
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
    height: '80%',
  },

  activityAnd: {
    top: -10,
  },
  dropDownContainer: {
    backgroundColor: '#f5fcff',
    borderRadius: 20,
    width: wp('90%'),
    display: 'flex',
    alignSelf: 'center',
    padding: 10,
    maxHeight: hp('20%'),
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  employeeContainer: {
    backgroundColor: '#f0f0f0',
    width: wp('84%'),
    borderRadius: 10,
    borderColor: '#f0f0f0',
    flexDirection: 'row-reverse',
    flex: 1,
    marginBottom: hp('1%'),
    height: hp('6%'),
  },
  completeName: {
    fontFamily: '29LTAzer-Bold',
    textAlign: 'right',
    marginTop: hp('1.7%'),
    marginRight: hp('1%'),
    color: '#7b9eb8',
    fontSize: 10,
  },
  jobIdStyle: {
    display: 'flex',
    alignSelf: 'center',
    marginRight: wp('5%'),
    top: hp('1.8%'),
    width: wp('25%'),
    position: 'absolute',
    right: wp('15%'),
  },
  textBoxStyle: {
    textAlign: 'center',
    padding: 16,
    color: '#007598',
    fontFamily: '29LTAzer-Regular',
  },
  onDutyStyle: {
    backgroundColor: '#d2f7f1',
  },
  holidayStyle: {
    backgroundColor: '#ffe9e9',
  },
  deputationStyle: {
    backgroundColor: '#ffeed3',
  },
  trainingStyle: {
    backgroundColor: '#e9f4f8',
  },
  distanceWorkStyle: {
    backgroundColor: '#ebffd8',
  },
  authoStyle: {
    backgroundColor: '#ffe9e9',
  },
  absenceStyle: {
    backgroundColor: '#ffe9e9',
  },
  attendanceStyle: {
    backgroundColor: 'transparent',
  },
  itemAttendanceStyle: {
    color: '#7b9eb8',
    fontFamily: '29LTAzer-Regular',
    fontSize: PixelRatio.roundToNearestPixel(9.99),
  },
});
