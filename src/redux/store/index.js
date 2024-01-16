import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import ApprovalReducer from '../reducer/ApprovalReducer';
import AttendanceReducer from '../reducer/AttendanceReducer';
import Calender from '../reducer/Calender';
import CustodyReducer from '../reducer/CustodyReducer';
import HomeMyRequestReducer from '../reducer/homeMyRequestReducer';
import HrRequestReducer from '../reducer/hrReducer';
import InternalCoursesRequestReducer from '../reducer/InternalCoursesReducer';
import LeavePermissionReducer from '../reducer/leaveReducer';
import LeaveRequestReducer from '../reducer/leaveRequestReducer';
import CommonLoaderReducer from '../reducer/loadingReducer';
import LoginReducer from '../reducer/loginReducer';
import MandateTypeReducer from '../reducer/MandateTypeReducer';
import messageReducer from '../reducer/messageReducer';
import MonshaatReducer from '../reducer/monshaatReducer';
import NavigateTo from '../reducer/navigationReducer';
import NewsReducer from '../reducer/NewsReducer';
import NotificationDisplayNameReducer from '../reducer/NotificationDisplayNameReducer';
import NotificationrequestReducer from '../reducer/NotificationrequestReducer';
import NotificationsReducer from '../reducer/NotificationsReducer';
import ProfileReducer from '../reducer/profileReducer';
import PurchaseTypeReducer from '../reducer/PurchaserequestReducer';
import RemoteWorkReducer from '../reducer/remoteWorkReducer';
import SearchReducer from '../reducer/searchReducer';
import TechnicalReducer from '../reducer/technicalReducer';
import TrainingReducer from '../reducer/trainingReducer';

const rootReducer = combineReducers({
  NavigateTo,
  LoginReducer,
  CommonLoaderReducer,
  ProfileReducer,
  LeaveRequestReducer,
  TrainingReducer,
  NotificationrequestReducer,
  NotificationDisplayNameReducer,
  HomeMyRequestReducer,
  LeavePermissionReducer,
  MandateTypeReducer,
  RemoteWorkReducer,
  TechnicalReducer,
  PurchaseTypeReducer,
  SearchReducer,
  AttendanceReducer,
  MonshaatReducer,
  ApprovalReducer,
  messageReducer,
  NotificationsReducer,
  InternalCoursesRequestReducer,
  HrRequestReducer,
  NewsReducer,
  Calender,
  CustodyReducer,
});

let store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
