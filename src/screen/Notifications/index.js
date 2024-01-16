import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import uniqBy from 'lodash.uniqby';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
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
import { useDispatch, useSelector } from 'react-redux';
import CommonPopup from '../../components/CommonPopup';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import RefreshContainer from '../../components/RefreshContainer';
import * as homeMyRequestActions from '../../redux/action/homeMyRequestAction';
import {
  getNotifications,
  setNotificationViewd,
} from '../../redux/action/NotificationsAction';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';

const Notifications = (props) => {
  const [FYI, setFYI] = useState([]);
  const [modal2, setModal2] = useState(false);

  const [state, setState] = useState({
    requestListData: [],
    showList: false,
    selectedNotification: {},
    userId: '',
    empID: '',
  });
  const isFocused = useIsFocused();
  const accessToken = useSelector((state) => state.LoginReducer.accessToken);
  const isLoading = useSelector(
    (state) => state.NotificationsReducer.notificationsLoading,
  );
  const approveIDs = useSelector(
    (state) => state.HomeMyRequestReducer.approveIDs,
  );
  const userProfileData = useSelector(
    (state) => state.ProfileReducer.userProfileData,
  );
  const [activeTab, setActiveTab] = useState('FYA');

  const notOpnendNotifications = useSelector(
    (state) => state.NotificationsReducer.notificationsList,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    let empID = await AsyncStorage.getItem('empID');
    let data = {
      token: accessToken,
      id: empID,
      limit: 50,
      page: '1',
    };
    dispatch(
      homeMyRequestActions.getAllMyApproveList({
        data: data,
      }),
    );
  };

  useEffect(() => {
    if (!notOpnendNotifications || !notOpnendNotifications.length) {
      setFYI([]);
      setState({
        ...state,
        requestListData: [],
        showList: false,
      });
      return;
    }
    let arr = notOpnendNotifications.filter(
      (el) =>
        el &&
        el.record[0] &&
        'id' in el.record[0] &&
        approveIDs.indexOf(el.record[0].id) > -1,
    );
    let mArray = uniqBy([...arr], function (el) {
      return el.record[0].id;
    });
    setFYI(notOpnendNotifications);

    setState({
      ...state,
      requestListData: mArray,
      showList: true,
    });
  }, [notOpnendNotifications, isFocused, approveIDs]);
  const onPullToRefresh = () => {
    // setRefresh(!refresh);
    if (accessToken !== null) {
      AsyncStorage.getItem('userid').then(async (data1) => {
        //console.log("datdata1data1data1data1a1", data1);
        dispatch(getNotifications(data1, accessToken));

        setState({ ...state, userId: data1 });
      });
    }
  };

  useEffect(() => {
    onPullToRefresh();
  }, [isFocused]);

  const handleDelailButtonClick = (selectedNotification) => {
    const navigation = props.navigation;
    if (selectedNotification.res_id === '[]') {
      dispatch(homeMyRequestActions.EditableorNot(true));
      switch (selectedNotification.request_type) {
        case 'new_custody':
          navigation.navigate('CustodyRequest');
          break;
        case 'calendar':
          navigation.navigate('MyCalendar', {
            tabValue: 'me',
          });
          break;
        case 'team_calendar':
          navigation.navigate('MyCalendar', {
            tabValue: 'team',
          });
          break;
        case 'chat_server':
          navigation.navigate('MyChat', {
            viewExperts: false,
          });
          break;
        case 'experts_list':
          navigation.navigate('MyChat', {
            viewExperts: true,
          });
          break;
        case 'search':
          navigation.navigate('EmployeeSearch');
          break;
        case 'attendance':
          navigation.navigate('AttendanceList');
          break;
        case 'employee_journey':
          navigation.navigate('EmployeJourny');
          break;
        case 'ideas_bank':
          navigation.navigate('QuestBank');
          break;
        case 'new_helpdesk':
          navigation.navigate('TechnicalRequest', {
            comeFrom: 'NewRequest',
            item: '',
          });
          break;
        case 'new_holiday_request':
          navigation.navigate('NewLeaveRequest', {
            comeFrom: 'NewRequest',
            item: '',
          });
          break;
        case 'new_purchase_request':
          navigation.navigate('NewPurchaseRequest', {
            item: '',
          });
          break;
        case 'new_distance_work_request':
          navigation.navigate('RemoteRequest', {
            item: '',
          });
          break;
        case 'new_authorization':
          navigation.navigate('LeaveRequest', { item: '' });
          break;
        case 'new_training_request':
          navigation.navigate('TrainingRequest', {
            item: '',
          });
          break;
        case 'new_deputation':
          navigation.navigate('MandateRequest', {
            item: '',
          });
          break;
        case 'new_salary_identification_request':
          navigation.navigate('Rhletter', {
            item: '',
          });
          break;
        case 'new_hr_training_public':
          navigation.navigate('InternalCourses', {
            item: '',
          });
          break;

        case 'requests_to_approve':
          // console.log('home request to approve');
          break;
        case 'profile':
          navigation.navigate('Profile', {
            profileData: userProfileData[0],
            comeFfrom: 'loogeduser',
          });
          break;
        default:
          break;
      }
    } //notification with no resid
    else {
      dispatch(homeMyRequestActions.EditableorNot(false));
      dispatch(setNotificationViewd(selectedNotification.id, accessToken));
      const item = selectedNotification.record[0];
      const item2 = selectedNotification;

      if (selectedNotification.res_model === 'portal.question') {
        let item = selectedNotification.record[0];
        if (item && Object.keys(item).length !== 0) {
          navigation.navigate('Questionary', {
            item: item,
            isRequired: item?.survey_vals[0]?.is_required,
          });
        }
        return;
      } else if (selectedNotification.res_model === 'portal.news') {
        if (selectedNotification.request_type == 'news') {
          navigation.navigate('MonshaatNews', {
            item: item,
            type: 'news',
          });
        } else if (selectedNotification.request_type == 'ads') {
          navigation.navigate('MonshaatNews', {
            item: item,
            type: 'activity',
          });
        } else if (selectedNotification.request_type == 'family_news') {
          navigation.navigate('MonshaatNews', {
            item: item,
            type: 'family',
          });
        }
        return;
      }
      let approve = approveIDs.indexOf(item?.id) > -1 && activeTab === 'FYA';
      if (selectedNotification.res_model === 'hr.holidays') {
        !approve
          ? navigation.navigate('NewLeaveRequest', {
              item: item,
            })
          : navigation.navigate('NewLeaveRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.deputation') {
        !approve
          ? navigation.navigate('MandateRequest', {
              item: item,
            })
          : navigation.navigate('MandateRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.authorization') {
        !approve
          ? navigation.navigate('LeaveRequest', {
              item: item,
            })
          : navigation.navigate('LeaveRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'helpdesk.ticket') {
        !approve
          ? navigation.navigate('TechnicalRequest', { item: item })
          : navigation.navigate('TechnicalRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.distance.work') {
        !approve
          ? navigation.navigate('RemoteRequest', {
              item: item,
            })
          : navigation.navigate('RemoteRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'purchase.request') {
        !approve
          ? navigation.navigate('NewPurchaseRequest', {
              item: item,
            })
          : navigation.navigate('NewPurchaseRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.training.request') {
        !approve
          ? navigation.navigate('TrainingRequest', {
              item: item,
            })
          : navigation.navigate('TrainingRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.training.public') {
        !approve
          ? navigation.navigate('FormInternalCourses', {
              item: item,
            })
          : navigation.navigate('FormInternalCourses', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'payment.order') {
        !approve
          ? navigation.navigate('FormPaymentOrder', { item: item })
          : navigation.navigate('FormPaymentOrder', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'purchase.order') {
        !approve
          ? navigation.navigate('FormPurchaseOrder', { item: item })
          : navigation.navigate('FormPurchaseOrder', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'purchase.add.budget') {
        !approve
          ? navigation.navigate('FormPurchaseAddBudget', {
              item: item,
            })
          : navigation.navigate('FormPurchaseAddBudget', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'certificate.achievement') {
        !approve
          ? navigation.navigate('FormCertAchievement', {
              item: item,
            })
          : navigation.navigate('FormCertAchievement', {
              item: item,
              viewType: 'approval',
            });
      } else if (selectedNotification.res_model === 'hr.resignation') {
        !approve
          ? navigation.navigate('Resignations', { item: item2 })
          : navigation.navigate('Resignations', {
              item: item2,
              viewType: 'approval',
            });
      } else if (item.res_model === 'salary.identification.request') {
        !approve
          ? navigation.navigate('Rhletter', { item: item })
          : navigation.navigate('Rhletter', {
              item: item,
              // viewType: "approval",
            });
      } else if (item.res_model === 'manage.financial.custody') {
        !approve
          ? navigation.navigate('CustodyRequest', { item: item })
          : navigation.navigate('CustodyRequest', {
              item: item,
              viewType: 'approval',
            });
      } else if (item.res_model === 'purchase.requisition') {
        navigation.navigate('PurchaseOrderDetail', {
          item: item,
          viewType: 'approval',
        });
      } else if (item.res_model === 'purchase.contract') {
        navigation.navigate('ContractOrderDetail', {
          item: item,
          viewType: 'approval',
        });
      } else if (item.res_model === 'work.order') {
        navigation.navigate('PopupActionOrder', {
          item: item,
          viewType: 'approval',
        });
      } else if (item.res_model === 'hr.payslip') {
        navigation.navigate('SalaryMarches', {
          item: item,
          viewType: activeTab == 'FYI' ? 'myRequest' : 'approval',
        });
      } else if (item.res_model === 'hr.payslip.run') {
        navigation.navigate('SalaryMarchesGroup', {
          item: item,
          viewType: activeTab == 'FYI' ? 'myRequest' : 'approval',
        });
      }
    }
  };

  const renderRequestList = (item) => {
    let bypass = false;
    // if (!item || !item.record[0]) {
    //   if (item.res_model != 'portal.question') {
    //     return;
    //   } else {
    //     bypass = true;
    //   }
    // }
    // if (!bypass && !('id' in item.record[0])) {
    //   return;
    // }
    return (activeTab === 'FYA' &&
      approveIDs.indexOf(item.record[0].id) > -1) ||
      activeTab === 'FYI' ? (
      <>
        <View
          style={{
            width: 6,
            height: 6,
            backgroundColor: item.is_opened == 1 ? 'white' : '#80e1ff',
            position: 'absolute',
            left: 17,
            top: 10,
            borderRadius: 50,
            zIndex: 99,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            item.res_model === 'portal.question' &&
            item &&
            Object.keys(item.record).length === 0
              ? setModal2(true)
              : handleDelailButtonClick(item);
          }}
          style={{
            flexDirection: 'row',
            backgroundColor: item.is_opened == 1 ? 'white' : 'white',
            marginVertical: hp('0.5%'),
            paddingVertical: hp('2%'),
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 80,
          }}
        >
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: 'right',
                  color: 'gray',
                  padding: 5,
                  fontFamily:
                    item.is_opened == 1 ? '29LTAzer-Regular' : '29LTAzer-Bold',
                }}
                numberOfLines={1}
              >
                {item.res_model === 'portal.question'
                  ? 'لديك استبيان جديد'
                  : item.message_title}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'right',
                paddingRight: wp('3%'),
                fontFamily:
                  item.is_opened == 1 ? '29LTAzer-Regular' : '29LTAzer-Bold',
              }}
            >
              {item.res_model === 'portal.question'
                ? item.message_title
                : item.message_body}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 3,
            backgroundColor: '#ccf3ff',
            width: '90%',
            alignSelf: 'center',
          }}
        ></View>
      </>
    ) : null;
  };

  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الإشعارات" />
      <View style={{ alignItems: 'center', paddingBottom: 60, height: '85%' }}>
        <View style={styles.container1}>
          <TouchableOpacity
            style={[
              styles.activeTab,
              {
                backgroundColor: activeTab == 'FYI' ? '#007598' : '#fff',
              },
            ]}
            onPress={() => {
              setActiveTab('FYI');
              AnnalyticsFirebase('For_Your_Interaction_Screen');
            }}
          >
            <Text
              style={[
                styles.activeTabText,
                {
                  color: activeTab == 'FYI' ? 'white' : '#20547a',
                  paddingLeft: 5,
                },
              ]}
              numberOfLines={1}
            >
              للمعلومية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.activeTab,
              {
                backgroundColor: activeTab == 'FYA' ? '#007598' : '#fff',
              },
            ]}
            onPress={() => {
              setActiveTab('FYA');
              AnnalyticsFirebase('For_Your_Action_Screen');
            }}
          >
            <Text
              style={[
                styles.activeTabText,
                {
                  color: activeTab == 'FYA' ? 'white' : '#20547a',
                },
              ]}
              numberOfLines={1}
            >
              لعمل اللازم
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
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
            height: '95%',
            marginTop: 10,
          }}
        >
          <RefreshContainer refresh={false} onPullToRefresh={onPullToRefresh}>
            {!isLoading ? (
              <View style={{ width: '100%' }}>
                {state.requestListData.length > 0 && activeTab === 'FYA' ? (
                  <FlatList
                    data={state.requestListData}
                    renderItem={({ item }) => renderRequestList(item)}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={state.requestListData}
                    showsVerticalScrollIndicator={false}
                  />
                ) : FYI.length > 0 && activeTab === 'FYI' ? (
                  <FlatList
                    data={FYI}
                    renderItem={({ item }) => renderRequestList(item)}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={activeTab}
                    showsVerticalScrollIndicator={false}
                  />
                ) : state.showList &&
                  (state.requestListData.length < 1 || FYI.length < 1) ? (
                  <View
                    style={{
                      height: 300,
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        width: 150,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: '#007598',
                        fontFamily: '29LTAzer-Regular',
                      }}
                    >
                      لا يوجد نتائج
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      height: 300,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={require('../../assets/images/gif/128.gif')}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={{ flex: 1 }}></View>
            )}
          </RefreshContainer>
          {isLoading ? <Loader /> : null}
        </View>
        <CommonPopup
          visible={modal2}
          text={'تمت الإجابة على هذا الاستبيان من قبل'}
          text3={'حسناً'}
          colors={[
            '#3360A8',
            '#286BA2',
            '#21729F',
            '#197A9B',
            '#108397',
            '#019290',
          ]}
          onCancel={() => {
            setModal2(false);
          }}
        />
      </View>
    </LinearGradient>
  );
};
export default Notifications;
const styles = StyleSheet.create({
  container1: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    margin: 5,
    marginTop: 7,
    overflow: 'hidden',
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  activeTabText: {
    textAlign: 'center',
    // fontWeight: "bold",
    fontFamily: '29LTAzer-Regular',
  },
});
