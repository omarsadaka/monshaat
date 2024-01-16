import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../src/redux/store';
import CombinedIcon from '../assets/images/announcement_white.png';
import calendarIcon from '../assets/images/Calendar.png';
import chatIcon from '../assets/images/Chat.png';
import HomeIcon from '../assets/images/Home.png';
import SearchIcon from '../assets/images/users.png';
import ProfileIcon from '../assets/images/user2.png';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import { checkInteretState } from '../components/Helper/Helper';
import Loader from '../components/loader';
import ReanimatedBottomNav from '../components/ReanimatedBottomTabs';
import NoInternet from '../NoInternet';
import * as loginActions from '../redux/action/loginActions';
import { getCountUnseen } from '../redux/action/messageActions';
import AttendanceList from '../screen/AttendanceList';
import AttendanceSystem from '../screen/AttendanceSystem';
import CustodyClose from '../screen/CustodyClose';
import CustodyRequest from '../screen/CustodyRequest';
import EmployeJourny from '../screen/EmployeJourny';
import FormCertAchievement from '../screen/FormCertAchievement';
import FormInternalCourses from '../screen/FormInternalCourses';
import FormPaymentOrder from '../screen/FormPaymentOrder';
import FormPurchaseAddBudget from '../screen/FormPurchaseAddBudget';
import FormPurchaseOrder from '../screen/FormPurchaseOrder';
import GreetingCard from '../screen/GreetingCard';
import Home from '../screen/Home';
import RhLetterRequest from '../screen/HrLetterRequest';
import InternalCourses from '../screen/InternalCourses';
import Intro from '../screen/Intro';
import LeaveRequest from '../screen/LeaveRequest';
import Login from '../screen/Login';
import MandateRequest from '../screen/MandateRequest';
import MessagesFeed from '../screen/MessagesFeed';
import MonshaatFamily from '../screen/MonshaatFamily';
import MonshaatNews from '../screen/MoonshatNews';
import MyCalendar from '../screen/MyCalendar';
import MyChat from '../screen/MyChat';
import NewLeaveRequest from '../screen/NewLeaveRequest';
import NewPurchaseRequest from '../screen/NewPurchaseRequest';
import Notifications from '../screen/Notifications';
import OffersCoupons from '../screen/OffersAndCoupons';
import QrCodeOffers from '../screen/OffersAndCoupons/qrcode';
import OtpVerification from '../screen/OtpVerification';
import PdfViewer from '../screen/pdfViewer';
import Profile from '../screen/Profile';
import QRProfile from '../screen/QRProfile';
import Questionary from '../screen/Questionary';
import QuestForm from '../screen/Questionary/questForm';
import QuestBank from '../screen/QuestionBank';
import BankComments from '../screen/QuestionBank/BankComments';
import RemoteRequest from '../screen/RemoteRequest';
import Resignation from '../screen/Resignation';
import EmployeeSearch from '../screen/Search/index';
import SmartAssit from '../screen/SmartAssit';
import TechnicalRequest from '../screen/TechnicalRequest';
import TechnicalRequestNew from '../screen/TechnicalRequestNew';
import TechnicalRequestOld from '../screen/TechnicalRequestOld';
import TechnicalRequestService from '../screen/TechnicalRequestService';
import TrainingRequest from '../screen/TrainingRequest';
import PurchaseOrderDetail from '../screen/PurchaseOrderDetail';
import ContractOrderDetail from '../screen/ContractOrderDetail';
import PopupActionOrder from '../screen/PopupActionOrder/PopupActionOrder';
import ManagerProfile from '../screen/ManagerProfile';
import AllOrders from '../screen/AllOrders';
import AllOrders2 from '../screen/AllOrders2';
import SalaryMarches from '../screen/SalaryMarches';
import SalaryMarchesGroup from '../screen/SalaryMarchesGroup';
import ForgetPassword from '../screen/ForgetPassword';
import { useNetInfo } from '@react-native-community/netinfo';
const hasNotich = DeviceInfo.hasNotch();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
export default function Route() {
  const [isToken, setToken] = useState(false);
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.LoginReducer.userToken);
  const appIntroBool = useSelector((state) => state.LoginReducer.appIntroBool);
  const netInfo = useNetInfo();

  // useEffect(() => {
  //   checkInteretState();
  // }, []);

  useEffect(() => {
    dispatch(loginActions.findAccessToken());
    AsyncStorage.getItem('userToken').then(async (token) => {
      let data = await AsyncStorage.getItem('AppIntro');
      if (data !== null) {
        dispatch(loginActions.handleAppIntro('true'));
      }
      if (data === null) {
        dispatch(loginActions.handleAppIntro('false'));
      }
      if (token != null) {
        dispatch(loginActions.storeUserToken('token'));
        setToken(true);
      } else {
        setToken(true);
        dispatch(loginActions.storeUserToken(null));
      }
    });
  }, [dispatch]);

  if (!netInfo.isConnected && netInfo.type !== 'unknown' && isToken)
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="NoInternet" component={NoInternet} />
      </Stack.Navigator>
    );
  return isToken === false ? (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Loader" component={Loader} />
    </Stack.Navigator>
  ) : userToken === 'token' ? (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="DrawerNav" component={TabNav} />
      <Stack.Screen name="NewLeaveRequest" component={NewLeaveRequest} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="MonshaatNews" component={MonshaatNews} />
      <Stack.Screen name="MonshaatFamily" component={MonshaatFamily} />
      <Stack.Screen name="EmployeeSearch" component={EmployeeSearch} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="QRProfile" component={QRProfile} />
      <Stack.Screen name="LeaveRequest" component={LeaveRequest} />
      <Stack.Screen name="MandateRequest" component={MandateRequest} />
      <Stack.Screen name="TechnicalRequest" component={TechnicalRequest} />
      <Stack.Screen
        name="TechnicalRequestNew"
        component={TechnicalRequestNew}
      />
      <Stack.Screen
        name="TechnicalRequestOld"
        component={TechnicalRequestOld}
      />
      <Stack.Screen
        name="TechnicalRequestService"
        component={TechnicalRequestService}
      />
      <Stack.Screen name="RemoteRequest" component={RemoteRequest} />
      <Stack.Screen name="NewPurchaseRequest" component={NewPurchaseRequest} />
      <Stack.Screen name="TrainingRequest" component={TrainingRequest} />
      <Stack.Screen name="FormPaymentOrder" component={FormPaymentOrder} />
      <Stack.Screen name="FormPurchaseOrder" component={FormPurchaseOrder} />
      <Stack.Screen name="InternalCourses" component={InternalCourses} />
      <Stack.Screen name="Rhletter" component={RhLetterRequest} />
      <Stack.Screen name="Resignations" component={Resignation} />
      <Stack.Screen name="EmployeJourny" component={EmployeJourny} />
      <Stack.Screen name="Questionary" component={Questionary} />
      <Stack.Screen name="QuestForm" component={QuestForm} />
      <Stack.Screen name="QuestBank" component={QuestBank} />
      <Stack.Screen name="BankComments" component={BankComments} />
      <Stack.Screen name="OffersCoupons" component={OffersCoupons} />
      <Stack.Screen name="QrCodeOffers" component={QrCodeOffers} />
      <Stack.Screen name="Home" component={TabNav} />
      <Stack.Screen name="SmartAssit" component={SmartAssit} />
      <Stack.Screen name="CustodyRequest" component={CustodyRequest} />
      <Stack.Screen name="CustodyClose" component={CustodyClose} />
      <Stack.Screen
        name="FormPurchaseAddBudget"
        component={FormPurchaseAddBudget}
      />
      <Stack.Screen
        name="FormCertAchievement"
        component={FormCertAchievement}
      />
      <Stack.Screen
        name="FormInternalCourses"
        component={FormInternalCourses}
      />
      <Stack.Screen name="AttendanceSystem" component={AttendanceSystem} />
      <Stack.Screen name="AttendanceList" component={AttendanceList} />
      <Stack.Screen name="GreetingCard" component={GreetingCard} />
      <Stack.Screen name="MessagesFeed" component={MessagesFeed} />
      <Stack.Screen name="PdfViewer" component={PdfViewer} />
      <Stack.Screen name="NoInternet" component={NoInternet} />
      <Stack.Screen
        name="PurchaseOrderDetail"
        component={PurchaseOrderDetail}
      />
      <Stack.Screen
        name="ContractOrderDetail"
        component={ContractOrderDetail}
      />
      <Stack.Screen name="PopupActionOrder" component={PopupActionOrder} />
      <Stack.Screen name="ManagerProfile" component={ManagerProfile} />
      <Stack.Screen name="AllOrders" component={AllOrders} />
      <Stack.Screen name="AllOrders2" component={AllOrders2} />
      <Stack.Screen name="SalaryMarches" component={SalaryMarches} />
      <Stack.Screen name="SalaryMarchesGroup" component={SalaryMarchesGroup} />
    </Stack.Navigator>
  ) : appIntroBool === 'true' ? (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Intro" component={Intro} />
    </Stack.Navigator>
  );
}

function DrawerNav(props) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerPosition="right"
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNav} />
    </Drawer.Navigator>
  );
}

function TabNav(props) {
  const localUser = useSelector((state) => state.ProfileReducer.profileData[0]);
  const unViewdCount = useSelector((state) => state.messageReducer.unSeenCount);
  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localUser) {
      dispatch(getCountUnseen(localUser.id));
    }
  }, [dispatch, localUser]);
  const calander = useCallback(() => {
    return <MyCalendar {...props} store={store} />;
  }, [props]);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      inactiveColor="#fff"
      barStyle={{ backgroundColor: '#007598' }}
      tabBar={(props) => (
        <>
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: hasNotich ? 20 : 5,
            }}
          >
            <ReanimatedBottomNav
              navigation={props.navigation}
              unViewdCount={unViewdCount}
            />
          </View>
        </>
      )}
    >
      <Tab.Screen
        name="Calendar"
        component={calander}
        options={{
          tabBarLabel: 'التقويم',
          labelStyle: { margin: 15 },
          tabBarIcon: ({ color, size }) => (
            <FastImage
              source={calendarIcon}
              style={{ width: 25, height: 25 }}
              tintColor={color}
              resizeMode="contain"
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="MonshaatFamily"
        component={MonshaatFamily}
        options={{
          tabBarLabel: 'الأخبار',
          tabBarIcon: ({ color, size }) => (
            <FastImage
              source={CombinedIcon}
              style={{ width: 25, height: 25, tintColor: color }}
              tintColor={color}
              resizeMode="contain"
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <FastImage
              source={HomeIcon}
              style={{ width: 25, height: 25, tintColor: color }}
              tintColor={color}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={MyChat}
        options={{
          tabBarLabel: 'المحادثات',
          tabBarIcon: ({ color, size }) => (
            <View>
              <FastImage
                source={chatIcon}
                style={{ width: 25, height: 25, tintColor: color }}
                tintColor={color}
                resizeMode="contain"
              />
              {unViewdCount > 0 && (
                <View
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 10,
                    backgroundColor: 'red',
                    marginTop: -20,
                    marginLeft: 20,
                    marginRight: -5,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'الملف الشخصى',
          tabBarIcon: ({ color, size }) => (
            <FastImage
              source={ProfileIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: color,
              }}
              tintColor={color}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={EmployeeSearch}
        options={{
          tabBarLabel: 'دليل الموظفين',
          tabBarIcon: ({ color, size }) => (
            <FastImage
              source={SearchIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: color,
              }}
              tintColor={color}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
