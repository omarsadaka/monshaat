import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { SearchBar } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import NewHeader from '../../components/NewHeader';
import * as searchAction from '../../redux/action/searchAction';
import { EMP_NO } from '../../services';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';

const EmployeeSearch = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    listManagers: [],
    listDeptEmp: [],
    listColeEmp: [],
    listSearchEmp: [],
    mGroupIDs: [],
    keywords: '',
    isSearched: false,
  });
  const [refresh, setRefresh] = useState(false);
  const [depCollapsed, setDepCollapsed] = useState(true);
  const [colCollapsed, setColCollapsed] = useState(true);
  const isLoading = useSelector(
    (state) => state.CommonLoaderReducer.isLoadingStand,
  );
  const deptLoading = useSelector((state) => state.SearchReducer.deptLoading);
  const managerLoading = useSelector(
    (state) => state.SearchReducer.managerLoading,
  );
  const searchLoading = useSelector(
    (state) => state.SearchReducer.searchLoading,
  );
  const isFocused = useIsFocused();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const departmentID = useSelector((state) => state.LoginReducer.deptId);
  const managerID = useSelector((state) => state.LoginReducer.managerId);
  const managerData = useSelector((state) => state.SearchReducer.managerData);
  const deptData = useSelector((state) => state.SearchReducer.deptData);
  const colData = useSelector((state) => state.SearchReducer.colData);
  const searchData = useSelector((state) => state.SearchReducer.searchData);
  useEffect(() => {
    if (isFocused) {
      AnnalyticsFirebase('Search_Screen');
    }
  }, [isFocused]);
  const onPullToRefresh = () => {
    if (managerID) {
      AsyncStorage.getItem(EMP_NO)
        .then((mEMP_NO) => {
          if (mEMP_NO !== '1200') {
            dispatch(
              searchAction.getManagerData({
                id: managerID[0].parent_id[0],
                accessToken: accessToken,
                refresh: true,
              }),
            );
          } else {
            if (departmentID) {
              dispatch(
                searchAction.getDeptData({
                  id: departmentID[0].department_id[0],
                  accessToken: accessToken,
                  refresh: true,
                }),
              );
            }
          }
        })
        .catch((err) => {
          dispatch(
            searchAction.getManagerData({
              id: managerID[0].parent_id[0],
              accessToken: accessToken,
            }),
          );
        });
    }
  };
  // useEffect(() => {
  //   Analytics.logScreenView(
  //     'Search')

  // }, []);

  const searchEmployees = (mKeywords, mIsSearched) => {
    setState({
      ...state,
      keywords: mKeywords,
      isSearched: mIsSearched,
      listSearchEmp: [],
    });
    if (mKeywords.length) {
      dispatch(
        searchAction.getSearchData({
          searchKey: mKeywords,
          accessToken: accessToken,
        }),
      );

      // ...
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('userGroup').then((mUserGroups) => {
      setState({ ...state, mGroupIDs: mUserGroups });
    });
  }, []);

  useEffect(() => {
    (async () => {
      // let managerData = await AsyncStorage.getItem("MANAGER_DATA");
      // let deptData = await AsyncStorage.getItem("DEPT_DATA");
      // let colData = await AsyncStorage.getItem("COL_DATA");

      // if (deptData && managerData && colData) {
      //   dispatch(
      //     searchAction.getManagerData({
      //       id: 1,
      //       accessToken: accessToken,
      //     })
      //   );
      //   dispatch(
      //     searchAction.getDeptData({
      //       id: 1,
      //       accessToken: accessToken,
      //     })
      //   );
      //   if (managerID) {
      //     dispatch(
      //       searchAction.getColData({
      //         id: managerID[0].parent_id[0],
      //         accessToken: accessToken,
      //       })
      //     );
      //   }
      //   return;
      // }
      if (managerID) {
        AsyncStorage.getItem(EMP_NO)
          .then((mEMP_NO) => {
            dispatch(
              searchAction.getColData({
                id: managerID[0].parent_id[0],
                accessToken: accessToken,
              }),
            );
            if (mEMP_NO !== '1200') {
              dispatch(
                searchAction.getManagerData({
                  id: managerID[0].parent_id[0],
                  accessToken: accessToken,
                }),
              );
            } else {
              if (departmentID) {
                dispatch(
                  searchAction.getDeptData({
                    id: departmentID[0].department_id[0],
                    accessToken: accessToken,
                  }),
                );
              }
            }
          })
          .catch((err) => {
            dispatch(
              searchAction.getManagerData({
                id: managerID[0].parent_id[0],
                accessToken: accessToken,
              }),
            );
          });
      }
    })();
  }, [departmentID, accessToken, managerID, refresh]);

  useEffect(() => {
    if (managerData && managerData.length) {
      //console.log(managerData, "managerData");
      setState({ ...state, listManagers: managerData });
      if (departmentID) {
        // dispatch({ type: "COMMON_LOADER", value: false });
        dispatch(
          searchAction.getDeptData({
            id: departmentID[0].department_id[0],
            managerId: managerData[0].id,
            accessToken: accessToken,
          }),
        );
      }
    }
  }, [managerData, departmentID]);

  useEffect(() => {
    if (deptData && deptData.length) {
      setState({ ...state, listDeptEmp: deptData });
      // dispatch({ type: "COMMON_LOADER", value: false });
    }
  }, [deptData]);
  useEffect(() => {
    if (colData && colData.length) {
      setState({ ...state, listColeEmp: colData });
      // dispatch({ type: "COMMON_LOADER", value: false });
    }
  }, [colData]);

  useEffect(() => {
    if (searchData && searchData.length) {
      setState({ ...state, listSearchEmp: searchData, isSearched: true });
      // dispatch({ type: "COMMON_LOADER", value: false });
    }
  }, [searchData]);

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
        <NewHeader {...props} />
        <View style={{ flex: 1, flexGrow: 1 }}>
          <SearchBar
            style={{ fontFamily: '29LTAzer-Regular' }}
            placeholder={'البحث'}
            lightTheme={true}
            onChangeText={(e) => {
              setState({ ...state, keywords: e });
            }}
            onClear={() => {
              searchEmployees('', false);
            }}
            onCancel={() => {
              searchEmployees('', false);
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
              borderRadius: 8,
              direction: 'rtl',
            }}
            inputStyle={{
              direction: 'rtl',
              textAlign: 'right',
              color: '#7b9eb8',
            }}
            onSubmitEditing={(e) => searchEmployees(e.nativeEvent.text, true)}
            searchIcon={false}
            placeholderTextColor="#7b9eb8"
            placeholderFontFamily="29LTAzer-Regular"
          />

          {managerLoading || deptLoading || searchLoading ? (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <CustomActivityIndicator modalVisible={true} />
            </View>
          ) : null}
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onPullToRefresh} />
            }
            style={AppStyle.scrollView}
          >
            {state.keywords.length < 1 ? (
              <View>
                {state.listManagers.length ? (
                  <View style={{ paddingVertical: 8 }}>
                    <View style={styles.directManagerContainer}>
                      <Text style={[AppStyle.h3, styles.directManagerText]}>
                        المدير المباشر
                      </Text>
                      <View style={styles.directmanagerIconContainer}>
                        <Image
                          resizeMode="contain"
                          style={styles.directManagerIcon}
                          source={require('../../assets/images/users.png')}
                        />
                      </View>
                    </View>
                    <EmployeeList data={state.listManagers} {...props} />
                  </View>
                ) : null}

                {state.listDeptEmp.length ? (
                  <View style={{ paddingVertical: 8 }}>
                    <TouchableOpacity
                      onPress={() => setDepCollapsed(!depCollapsed)}
                      style={styles.directManagerContainer}
                    >
                      <Icon
                        size={25}
                        color={'#007598'}
                        name={depCollapsed ? 'add-circle' : 'remove-circle'}
                      />
                      <Text style={[AppStyle.h3, styles.directManagerText]}>
                        {'موظفي ادارتي (' + state.listDeptEmp.length + ')'}
                      </Text>

                      <View style={styles.directmanagerIconContainer}>
                        <Image
                          resizeMode="contain"
                          style={styles.directManagerIcon}
                          source={require('../../assets/images/users.png')}
                        />
                      </View>
                    </TouchableOpacity>
                    <Collapsible easing={'linear'} collapsed={depCollapsed}>
                      <EmployeeList data={state.listDeptEmp} {...props} />
                    </Collapsible>
                  </View>
                ) : null}
                <View>
                  {state.listColeEmp.length ? (
                    <View style={{ paddingVertical: 8 }}>
                      <TouchableOpacity
                        onPress={() => setColCollapsed(!colCollapsed)}
                        style={styles.directManagerContainer}
                      >
                        <Icon
                          size={25}
                          color={'#007598'}
                          name={colCollapsed ? 'add-circle' : 'remove-circle'}
                        />
                        <Text style={[AppStyle.h3, styles.directManagerText]}>
                          {'زملاء الادارة (' + state.listColeEmp.length + ')'}
                        </Text>
                        <View style={styles.directmanagerIconContainer}>
                          <Image
                            resizeMode="contain"
                            style={styles.directManagerIcon}
                            source={require('../../assets/images/users.png')}
                          />
                        </View>
                      </TouchableOpacity>
                      <Collapsible
                        easing={'linear'}
                        duration={600}
                        collapsed={colCollapsed}
                      >
                        <EmployeeList data={state.listColeEmp} {...props} />
                      </Collapsible>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : state.listSearchEmp.length > 0 ? (
              <View>
                {state.listSearchEmp.length ? (
                  <View style={{ paddingVertical: 8 }}>
                    <Text
                      style={[
                        AppStyle.h3,
                        {
                          padding: 16,
                          alignSelf:
                            Platform.OS === 'ios' ? 'flex-end' : 'flex-start',
                        },
                      ]}
                    >
                      {'نتيجة البحث (' + state.listSearchEmp.length + ')'}
                    </Text>
                    <EmployeeList data={state.listSearchEmp} {...props} />
                  </View>
                ) : null}
              </View>
            ) : (
              <View>
                {state.isSearched && !searchLoading && !isLoading ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 16,
                      color: '#007598',
                      fontFamily: '29LTAzer-Regular',
                    }}
                  >
                    لم يتم العثور على نتائج
                  </Text>
                ) : null}
              </View>
            )}
          </KeyboardAwareScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

const EmployeeList = (props) => {
  const localUser = useSelector(
    (state) => state.ProfileReducer.userProfileData[0],
  );

  return (
    <View>
      {props.data.length
        ? props.data.map((mItem) => {
            return (
              <View>
                <TouchableOpacity
                  style={AppStyle.employeeItem}
                  key={mItem.id}
                  onPress={() => {
                    props.navigation.navigate('ManagerProfile', {
                      profileData: mItem,
                    });
                  }}
                >
                  <View style={AppStyle.employeeDetailsContainer}>
                    <View>
                      {mItem.image ? (
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${mItem.image}`,
                          }}
                          style={AppStyle.employeeImage}
                          resizeMode="cover"
                          onError={() =>
                            setState({ ...state, imageLoading: false })
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

                    <View style={AppStyle.employeeInfo}>
                      <Text style={styles.itemMonshaatText}>
                        {mItem.sector_id ? mItem.sector_id[1] : ''}
                      </Text>
                      <Text style={styles.itemMonshaatName}>
                        {mItem.complete_name}
                      </Text>
                      <Text style={styles.itemMonshaatJob}>
                        {mItem.job_id ? mItem.job_id[1] : ''}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={AppStyle.employeeStatusContainer}>
                      <View
                        style={[
                          AppStyle.employeeStatus,
                          {
                            backgroundColor:
                              mItem.attendance_state === 'onduty'
                                ? '#d2f7f1'
                                : mItem.attendance_state === 'holidays'
                                ? '#ffe9e9'
                                : mItem.attendance_state === 'deputation'
                                ? '#ffeed3'
                                : mItem.attendance_state === 'training'
                                ? '#e9f4f8'
                                : mItem.attendance_state === 'distance_work'
                                ? '#ebffd8'
                                : mItem.attendance_state === 'absence'
                                ? '#ffe9e9'
                                : mItem.attendance_state === 'authorization'
                                ? '#ffe9e9'
                                : '',
                            borderWidth: 0,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            AppStyle.h3,
                            {
                              color: '#7b9eb8',
                              fontFamily: '29LTAzer-Regular',
                              fontSize: 12,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {mItem.attendance_state === 'onduty'
                            ? 'متواجد'
                            : mItem.attendance_state === 'holidays'
                            ? 'اجازة'
                            : mItem.attendance_state === 'deputation'
                            ? 'انتداب'
                            : mItem.attendance_state === 'training'
                            ? 'تدريب'
                            : mItem.attendance_state === 'distance_work'
                            ? 'عمل عن بعد'
                            : mItem.attendance_state === 'absence'
                            ? 'غياب'
                            : mItem.attendance_state === 'authorization'
                            ? 'استئذان'
                            : ''}
                        </Text>
                      </View>
                    </View>
                    {localUser && (
                      <TouchableOpacity
                        style={styles.qrIconContainer}
                        onPress={() =>
                          mItem.id != localUser.id
                            ? props.navigation.navigate('MessagesFeed', {
                                correspondant: mItem,
                                type: 'community',
                              })
                            : showMessage({
                                style: { alignItems: 'flex-end' },
                                type: 'danger',
                                message:
                                  'لايمكن بدء المحادثة لكونها مع نفس المستخدم',
                              })
                        }
                        // disabled={() => mItem.id != localUser.id}
                      >
                        <Icon
                          size={15}
                          color={
                            mItem.id != localUser.id ? '#007598' : '#d9d9d9'
                          }
                          name="chat-bubble-outline"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        : null}
    </View>
  );
};

export default EmployeeSearch;
const styles = StyleSheet.create({
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
  directManagerText: {
    padding: 8,
    color: '#20547a',
    // fontWeight: "bold",
    fontFamily: '29LTAzer-Regular',
  },
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
    writingDirection: 'rtl',
  },
  itemMonshaatJob: {
    color: '#7b9eb8',
    fontSize: 12,
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
    writingDirection: 'rtl',
  },
});
