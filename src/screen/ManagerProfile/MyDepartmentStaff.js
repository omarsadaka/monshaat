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
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppStyle } from '../../assets/style/AppStyle';
import * as searchAction from '../../redux/action/searchAction';
import { EMP_NO } from '../../services';
import Loader from '../../components/loader';

const MyDepartmentStaff = (props) => {
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
  const [depCollapsed, setDepCollapsed] = useState(true);
  const [colCollapsed, setColCollapsed] = useState(true);
  const [isLoading, setIsLoadig] = useState(false);

  const isFocused = useIsFocused();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const departmentID = useSelector((state) => state.LoginReducer.deptId);
  const managerID = useSelector((state) => state.LoginReducer.managerId);
  const managerData = useSelector((state) => state.SearchReducer.managerData2);
  const deptData = useSelector((state) => state.SearchReducer.deptData2);
  const colData = useSelector((state) => state.SearchReducer.colData2);
  const searchData = useSelector((state) => state.SearchReducer.searchData);

  useEffect(() => {
    (async () => {
      setIsLoadig(true);
      if (props.userID) {
        AsyncStorage.getItem(EMP_NO)
          .then((mEMP_NO) => {
            dispatch(
              searchAction.getColData2({
                id: props.managerID,
                accessToken: accessToken,
                user_id: props.userID,
              }),
            );
            if (mEMP_NO !== '1200') {
              dispatch(
                searchAction.getManagerData2({
                  id: props.managerID,
                  accessToken: accessToken,
                }),
              );
            } else {
              if (props.departmentID) {
                console.log('getDeptData2',props.departmentID ,'aa',props.managerID,'aa',props.userID )
                dispatch(
                  searchAction.getDeptData2({
                    id: props.departmentID,
                    managerId: props.managerID,
                    accessToken: accessToken,
                    user_id: props.userID,
                  }),
                );
              }
            }
          })
          .catch((err) => {
            dispatch(
              searchAction.getManagerData2({
                id: props.managerID,
                accessToken: accessToken,
              }),
            );
          });
      }
      setTimeout(() => {
        setIsLoadig(false);
      }, 1300);
    })();
  }, [props.departmentID, accessToken]);

  useEffect(() => {
    // if (managerData && managerData.length) {
    //   setState({ ...state, listManagers: managerData });
      if (props.departmentID) {
        console.log('getDeptData2 2',props.departmentID ,'aa',props.managerID,'aa',props.userID )
        dispatch(
          searchAction.getDeptData2({
            id: props.departmentID,
            managerId: props.managerID,
            accessToken: accessToken,
            user_id: props.userID,
          }),
        );
      }
    // }
  }, [props.departmentID]);

  useEffect(() => {
    if (managerData && managerData.length) {
      setState({ ...state, listManagers: managerData });
     
    }
  }, [managerData]);

  useEffect(() => {
    if (deptData && deptData.length) {
      setState({ ...state, listDeptEmp: deptData });
    }
  }, [deptData]);

  useEffect(() => {
    if (colData && colData.length) {
      setState({ ...state, listColeEmp: colData });
    }
  }, [colData]);

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
                      props.navigation.push('ManagerProfile', {
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

  return (
    <View style={{ flex: 1, flexGrow: 1 }}>
      <View>
        <View style={{ paddingVertical: 8, marginTop: 30 }}>
          <View style={[styles.directManagerContainer, { marginBottom: -5 }]}>
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
                  {/* {' الموظفين التابعين ل  (' + state.listColeEmp.length + ')'} */}
                  {`  زملاء إدارة ${props.name} (${state.listColeEmp.length})`}
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
      {isLoading ? <Loader /> : null}
    </View>
  );
};
export default MyDepartmentStaff;
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

  directManagerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
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
