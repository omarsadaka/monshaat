import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
} from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import IconFe from 'react-native-vector-icons/Feather';
import Loader from '../../components/loader';
import RefreshContainer from '../../components/RefreshContainer';
import * as homeMyRequestActions from '../../redux/action/homeMyRequestAction';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';

const testIDs = require('./testIDs');

const VacationImage = require('../../assets/images/iconly/calendar.png');
const MandateImage = require('../../assets/images/iconly/location.png');
const TrainingImage = require('../../assets/images/iconly/edit.png');
const WorkImage = require('../../assets/images/iconly/work.png');
const AllImage = require('../../assets/images/all.png');
const InternalCourcesImage = require('../../assets/images/iconly/internalCourses.png');

function getDatesBetweenDates(startDate, endDate) {
  let dates = [];
  const theDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (theDate < lastDate) {
    dates = [...dates, new Date(theDate).toISOString().substring(0, 10)];
    theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, lastDate.toISOString().substring(0, 10)];
  return dates;
}

const leaveColor = '#EB5252';
const authorizationColor = 'orange';

const mandateColor = '#655DC6';
const trainingColor = '#00A9AF';
const remoteColor = '#3360A8';
const internalCourcesColor = trainingColor;

const days = [
  'الأحد',
  'الأثنين',
  'الثلاثاء',
  'الاربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const Filters = [
  {
    name: 'authorization',
    index: 0,
    label: 'استئذان',
    source: VacationImage,
    backgroundColor: authorizationColor,
  },
  {
    name: 'distance',
    index: 2,
    label: 'عمل عن بعد',
    source: WorkImage,
    backgroundColor: remoteColor,
  },
  {
    name: 'training',
    index: 5,
    label: 'تدريب',
    source: TrainingImage,
    backgroundColor: trainingColor,
  },
  {
    name: 'deputation',
    index: 6,
    label: 'انتداب',
    source: MandateImage,
    backgroundColor: mandateColor,
  },
  {
    name: 'holiday',
    index: 8,
    label: 'اجازة',
    source: VacationImage,
    backgroundColor: leaveColor,
  },
];

LocaleConfig.locales['ar'] = {
  monthNames: [
    'يناير',
    'فبراير',
    'مارس',
    'ابريل',
    'مايو',
    'يونيو',
    'يوليو',
    'اغسطس',
    'سبتمبر',
    'اكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  monthNamesShort: [
    'يناير',
    'فبراير',
    'مارس',
    'ابريل',
    'مايو',
    'يونيو',
    'يوليو',
    'اغسطس',
    'سبتمبر',
    'اكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  dayNames: [
    'الأحد',
    'الأثنين',
    'الثلاثاء',
    'الاربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ],
  dayNamesShort: ['أحد', 'أثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'],
  today: 'اليوم',
};
LocaleConfig.defaultLocale = 'ar';
export default class MyCalander extends Component {
  constructor(props) {
    super(props);
    this.cal = false;
    this.datess = {};
    this.state = {
      year: new Date().getFullYear(),
      selectedFilter: false,
      activeIndex: 1,
      calendarOpened: false,
      selectedDDay: '',
      selectedDayString: '',
      items: {},
      totalRes: [],
      selectedDayDates: [],
      date: new Date(),
      markedDate: {},
      props: this.props,
      isLoading: false,
      //THIS NEED TO BE FROM THE LOGGED IN USER
      profileData: {
        empId: 0,
        username: '',
        token: '',
      },
      startDate: '',
      endDate: '',
      datesObject: {},
      activeCalander: 'me', // me || team
      activeTeamMembers: [], // array if emp ids
      activeCalanderType: 'all', // all - holiday - training - distance - deputation
      teamIDs: [],
      open: false,
      value: 'all',
      open2: false,
      value2: 'all',
      data2: [],
    };

    this.setValue = this.setValue.bind(this);
  }
  setOpen(open) {
    this.setState({
      open,
    });
  }

  setValue(callback) {
    this.setState(
      (state) => ({
        value: callback(state.value),
      }),
      () => {
        // console.log('value', this.state.value);
        // this.caller(this.state.value2, this.state.value);
        this.getCalanderData(
          this.state.value2,
          this.state.value,
          this.state.startDate,
          this.state.endDate,
        );
      },
    );
  }

  setOpen2(open2) {
    this.setState({
      open2,
    });
  }

  setValue2(callback) {
    this.setState(
      (state) => ({
        value2: callback(state.value2),
      }),
      () => {
        // console.log('value2', this.state.value2);
        // this.caller(this.state.value2, this.state.value);
        this.getCalanderData(
          this.state.value2,
          this.state.value,
          this.state.startDate,
          this.state.endDate,
        );
      },
    );
  }

  setItems2(callback) {
    // console.log('setItems2', callback);

    this.setState((state) => ({
      data2: callback(state.data2),
    }));
  }

  async getDeptData() {
    this.setState({ isLoading: true });

    let accessToken = await AsyncStorage.getItem('accessToken');

    AsyncStorage.getItem('empID').then(async (mEmpID) => {
      let url =
        baseUrl +
        `/api/search_read?model=hr.employee&domain=[["parent_id", "=", ${mEmpID}]]&fields=["attendance_state","replace_employee_id","department_id","parent_id","mobile_phone","work_phone","work_email","number","sector_id","job_id","complete_name","english_name","address_home_id","address_id","emp_state","image","sector","department_global_id","department_global_id","dept","management","number"]`;
      let secretUrl = await EncryptUrl(url);
      // console.log(url, 'getDeptData calender url');

      fetch(secretUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then(async (responseData) => {
          // console.log('getDeptData calender', responseData);
          let managerData = await AsyncStorage.getItem('MANAGER_DATA');
          managerData = JSON.parse(managerData);
          // console.log('managerData', managerData);
          let start2 = {
            label: managerData[0].complete_name,
            value: managerData[0].id,
          };
          // console.log('start2', start2);
          let start = { label: 'عضو الفريق (الكل)', value: 'all' };
          let arr = responseData.map((obj) => {
            return {
              label: obj.complete_name,
              value: obj.id,
            };
          });

          arr.unshift(start2);
          let IDS = arr.map((item) => item.value);
          arr.unshift(start);

          this.setState({ ...this.state, data2: arr, teamIDs: IDS });
          const d = new Date();
          let month = d.getMonth() + 1;
          let year = d.getFullYear();
          let lastDayOfMonth = this.getDaysInMonth(month, year);
          let startdate = `${year}-${month}-01`;
          let enddate = `${year}-${month}-${lastDayOfMonth}`;
          this.setState({
            ...this.state,
            startDate: startdate,
            endDate: enddate,
          });
          this.getCalanderData('all', 'all', startdate, enddate);
        });
    });
  }

  hanldeApiResponse(responseData, model) {
    var markedDatesString = '';
    responseData.forEach((request) => {
      if (model == 'hr.authorization') {
        markedDatesString +=
          '"' +
          request.date +
          '": {"customStyles": {"container": {"backgroundColor": "' +
          authorizationColor +
          '"},"text": {"color": "white"}}},';
      } else {
        let datesBetween = getDatesBetweenDates(
          request.date_from,
          request.date_to,
        );
        datesBetween.forEach((day) => {
          const color =
            model === 'hr.holidays'
              ? leaveColor
              : model === 'hr.deputation'
              ? mandateColor
              : model === 'hr.training.public'
              ? internalCourcesColor
              : model === 'hr.distance.work'
              ? remoteColor
              : trainingColor;
          markedDatesString +=
            '"' +
            day +
            '": {"customStyles": {"container": {"backgroundColor": "' +
            color +
            '"},"text": {"color": "white"}}},';
        });
      }
    });
    let finalRes = responseData.map((item) => {
      return {
        ...item,
        model: model,
      };
    });
    let res = {
      markedDatesString: markedDatesString,
      responseData: finalRes,
    };
    return res;
  }
  //zz

  componentDidMount() {
    this.getDeptData();
    AnnalyticsFirebase('Team_Calendar');
  }

  onPullToRefresh() {
    this.getDeptData();
    this.getCalanderData(
      this.state.value2,
      this.state.value,
      this.state.startDate,
      this.state.endDate,
    );
  }

  async getCalanderData(emp, activity, start, end) {
    this.setState({ isLoading: true });

    let accessToken = await AsyncStorage.getItem('accessToken');
    let empId = emp == 'all' ? this.state.teamIDs : emp;

    let startdate = start ? start : this.state.startDate;
    let enddate = end ? end : this.state.endDate;

    // console.log(
    //   '-------------------getCalanderData2',
    //   emp,
    //   activity,
    //   start,
    //   end,
    // );
    // console.log('this.state.teamIDs', this.state.teamIDs);
    if (!emp || !startdate || !enddate) {
      this.setState({ isLoading: false });
      return;
    }
    let url =
      baseUrl +
      `/api/call/all.requests/get_calendar_requests_per_day?kwargs={"date_start": "${startdate}", "date_end": "${enddate}","employee_ids": [${empId}]}`;
    // console.log('calender url', url);
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        // console.log('getCalanderData', responseData);
        let datesObject = {};
        let markedDatesObject = {};
        let authorizationRes = [];
        let distanceWorkRes = [];
        let deputationRes = [];
        let holidayRes = [];
        let trainingRes = [];
        let internalCourcesRes = [];
        let dotColor = 'white';

        let res = responseData.map((day) => {
          let dots = [];

          let distance_work_count =
            activity == 'all' || activity == 'distance'
              ? day[Object.keys(day)[0]].distance_work.length
              : 0;

          let internal_cources_count =
            activity == 'all' || activity == 'training'
              ? day[Object.keys(day)[0]]['public training'].length
              : 0;

          let authorization_count =
            activity == 'all' || activity == 'authorization'
              ? day[Object.keys(day)[0]].authorization.length
              : 0;

          let deputation_count =
            activity == 'all' || activity == 'deputation'
              ? day[Object.keys(day)[0]].deputation.length
              : 0;

          let holiday_count =
            activity == 'all' || activity == 'holiday'
              ? day[Object.keys(day)[0]].holiday.length
              : 0;

          let training_count =
            activity == 'all' || activity == 'training'
              ? day[Object.keys(day)[0]].training.length
              : 0;
          datesObject[Object.keys(day)[0]] = [];
          if (authorization_count > 0) {
            dotColor = authorizationColor;
            for (let index = 0; index < authorization_count; index++) {
              dots.push({ color: dotColor });
              authorizationRes.push(
                ...day[Object.keys(day)[0]].authorization[index],
              );
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]].authorization[index],
              );
            }
          }
          if (internal_cources_count > 0) {
            dotColor = internalCourcesColor;
            for (let index = 0; index < internal_cources_count; index++) {
              dots.push({ color: dotColor });
              internalCourcesRes.push(
                ...day[Object.keys(day)[0]]['public training'][index],
              );
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]]['public training'][index],
              );
            }
          }
          if (training_count > 0) {
            dotColor = trainingColor;
            for (let index = 0; index < training_count; index++) {
              dots.push({ color: dotColor });
              trainingRes.push(...day[Object.keys(day)[0]].training[index]);
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]].training[index],
              );
            }
          }

          if (distance_work_count > 0) {
            dotColor = remoteColor;
            for (let index = 0; index < distance_work_count; index++) {
              dots.push({ color: dotColor });
              distanceWorkRes.push(
                ...day[Object.keys(day)[0]].distance_work[index],
              );
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]].distance_work[index],
              );
            }
          }

          if (deputation_count > 0) {
            dotColor = mandateColor;
            for (let index = 0; index < deputation_count; index++) {
              dots.push({ color: dotColor });

              deputationRes.push(...day[Object.keys(day)[0]].deputation[index]);
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]].deputation[index],
              );
            }
          }

          if (holiday_count > 0) {
            dotColor = leaveColor;
            for (let index = 0; index < holiday_count; index++) {
              dots.push({ color: dotColor });

              holidayRes.push(...day[Object.keys(day)[0]].holiday[index]);
              datesObject[Object.keys(day)[0]].push(
                ...day[Object.keys(day)[0]].holiday[index],
              );
            }
          }

          let totalCount =
            distance_work_count +
            authorization_count +
            deputation_count +
            holiday_count +
            internal_cources_count +
            training_count;
          // let dots = [];
          // let dot = { color: dotColor };
          if (totalCount < 1) {
            return markedDatesObject;
          }
          // for (var i = 0; i < totalCount; i += 1) {
          //   dots.push(dot);
          // }

          markedDatesObject[Object.keys(day)[0]] = {
            dots: dots.length > 1 ? dots : {},
            selected: true,
            selectedColor:
              dots.length > 1
                ? '#dbdbdb'
                : distance_work_count > 0
                ? remoteColor
                : authorization_count > 0
                ? 'orange'
                : deputation_count > 0
                ? mandateColor
                : internal_cources_count > 0
                ? internalCourcesColor
                : holiday_count > 0
                ? leaveColor
                : trainingColor,
          };

          return markedDatesObject;
        });
        // console.log('authorizationRes', authorizationRes);
        // console.log('deputationRes', deputationRes);
        // console.log('distanceWorkRes', distanceWorkRes);
        // console.log('holidayRes', holidayRes);
        // console.log('trainingRes', trainingRes);
        // console.log('datesObject', datesObject);

        // console.log('-------------------resres', res);

        this.setState({
          ...this.state,
          markedDate: res[0],
          datesObject: datesObject,
          isLoading: false,
        });
      })
      .catch((err) => {
        // console.log('error', err);
      });
  }

  async handleDay(day) {
    var d = new Date(day);
    var dayName = days[d.getDay()];
    let formatedDay = moment(d).format('YYYY-MM-DD');
    // console.log('formatedDay', formatedDay);
    if (formatedDay in this.state.datesObject) {
      // console.log('formatedDay2', this.state.datesObject[formatedDay]);
      this.setState({
        ...this.state,
        selectedDayDates: this.state.datesObject[formatedDay],
        selectedDDay: day,
        selectedDayString: dayName,
      });
    } else {
      this.setState({
        ...this.state,
        selectedDayDates: [],
        selectedDDay: day,
        selectedDayString: dayName,
      });
    }
  }
  getDaysInMonth(m, y) {
    return m === 2
      ? y & 3 || (!(y % 25) && y & 15)
        ? 28
        : 29
      : 30 + ((m + (m >> 3)) & 1);
  }
  monthChange({ month, year }) {
    let startdate = `${year}-${month}-01`;
    let lastDayOfMonth = this.getDaysInMonth(month, year);
    let enddate = `${year}-${month}-${lastDayOfMonth}`;
    // remove-selected-day-on-month-chage
    this.setState({
      ...this.state,
      startDate: startdate,
      endDate: enddate,
      selectedDayString: '',
      selectedDDay: '',
    });
    this.getCalanderData(
      this.state.value2,
      this.state.value,
      startdate,
      enddate,
    );
  }
  renderArrows(direction) {
    return direction == 'right' ? (
      <IconFe name="chevron-right" size={25} color="#008ac5" />
    ) : (
      <IconFe name="chevron-left" size={25} color="#008ac5" />
    );
  }
  _renderFilters() {
    const { data } = this.state;
    return (
      <ScrollView
        ref={(r) => (this.ScrollView = r)}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ transform: [{ scaleX: -1 }] }}
        contentContainerStyle={{
          flexDirection: 'row-reverse',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}
      >
        {Filters.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={(callback) => {
                if (this.state.isLoading) return;
                this.ScrollView.scrollTo({
                  animated: true,
                  x: i < 3 ? Dimensions.get('window').width : 0,
                });
                this.state.selectedFilter === false ||
                (this.state.selectedFilter === true &&
                  this.state.value !== item.name)
                  ? this.setState(
                      () => ({
                        value: item.name,
                        data: data,
                        activeIndex: item.index,
                        selectedFilter: true,
                      }),
                      () => {
                        this.getCalanderData(
                          this.state.value2,
                          this.state.value,
                          this.state.startDate,
                          this.state.endDate,
                        );
                      },
                    )
                  : this.setState(
                      () => ({
                        value: 'all',
                        data: data,
                        activeIndex: 1,
                        selectedFilter: false,
                      }),
                      () => {
                        // console.log(
                        //   'Selecteeeed22222222----->',
                        //   this.state.selectedFilter,
                        // );
                        this.getCalanderData(
                          this.state.value2,
                          this.state.value,
                          this.state.startDate,
                          this.state.endDate,
                        );
                      },
                    );
              }}
            >
              <View
                style={[
                  styles.detailsType,
                  {
                    backgroundColor:
                      this.state.activeIndex === item.index
                        ? '#ddd4cd'
                        : 'white',

                    borderRadius: 20,
                    padding: 3,
                    transform: [{ scaleX: -1 }],
                  },
                ]}
              >
                <Text style={styles.detailsText}>{item.label}</Text>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: item.backgroundColor,
                    },
                  ]}
                >
                  <FastImage
                    tintColor={'white'}
                    style={[styles.detailsIcon]}
                    source={item.source}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  render(props) {
    const { open, value, data, open2, value2, data2, activeIndex } = this.state;

    return (
      <View
        style={[
          styles.page,
          { flexDirection: 'column', backgroundColor: '#F0F1F2' },
        ]}
      >
        <View
          style={[
            styles.dropdownContainer,
            Platform.OS == 'ios' && { zIndex: 999 },
          ]}
        >
          <DropDownPicker
            placeholder={'عضو الفريق (الكل)'}
            translation={{
              NOTHING_TO_SHOW: 'لا يوجد أعضاء في الفريق',
            }}
            zIndex={2000}
            zIndexInverse={1000}
            containerStyle={{ width: '55%' }}
            style={styles.activeTeamDropDown}
            placeholderStyle={styles.placeholderStyle}
            textStyle={styles.placeholderStyle}
            open={open2}
            showTickIcon={false}
            arrowIconStyle={styles.arrowIconStyle}
            value={value2}
            items={data2}
            setOpen={(props) => this.setOpen2(props)}
            setValue={(props) => this.setValue2(props)}
            setItems={(props) => this.setItems2(props)}
          />
        </View>
        <RefreshContainer
          style={{ zIndex: 999 }}
          contentContainerStyle={{ zIndex: 999 }}
          refresh={false}
          onPullToRefresh={() => this.onPullToRefresh()}
        >
          {this._renderFilters()}
        </RefreshContainer>

        <View
          style={{
            flex: 70,
            zIndex: 99,
          }}
        >
          <CalendarProvider
            date={new Date().toISOString().slice(0, 10)}
            onMonthChange={this.monthChange.bind(this)}
            onDateChanged={this.loadItemsDay.bind(this)}
            showTodayButton
            todayButtonStyle={{
              fontFamily: '29LTAzer-Regular',
              // position: 'absolute',
              // marginTop: Dimensions.get('window').height * 0.05,
              // bottom: Dimensions.get('window').height * 0.18,
            }}
            disabledOpacity={0.6}
          >
            <ExpandableCalendar
              // disableMonthChange={true}
              // enableSwipeMonths={false}
              disableArrowLeft={this.state.isLoading}
              disableArrowRight={this.state.isLoading}
              renderArrow={this.renderArrows}
              testID={testIDs.expandableCalendar.CONTAINER}
              selected={this.state.date}
              // scrollEnabled={false}
              markingType={'multi-dot'} // 'multi-dot'
              markedDates={this.state.markedDate}
              theme={{
                textDayHeaderFontSize: 12,
                textDayHeaderFontFamily: '29LTAzer-Bold',
                textDayFontFamily: '29LTAzer-Regular',
                textMonthFontFamily: '29LTAzer-Regular',
                textDayFontSize: 14,
                backgroundColor: 'white',
              }}
              disableAllTouchEventsForDisabledDays={true}
              initialPosition={ExpandableCalendar.positions.OPEN}
            />
            <View style={styles.detailsContainer}>
              <Text
                style={[
                  styles.detailsText,
                  { alignSelf: 'center', marginTop: 5 },
                ]}
              >
                {this.state.selectedDayString} {this.state.selectedDDay}
              </Text>
              <ScrollView contentContainerStyle={styles.detailsContent}>
                {this.state.selectedDayDates.map((item, props) => {
                  return (
                    <View style={styles.detailsItemContainer}>
                      <View style={styles.detailsType}>
                        <Text style={styles.detailsText}>
                          {item.res_model === 'hr.holidays'
                            ? 'إجازة'
                            : item.res_model === 'hr.deputation'
                            ? 'انتداب'
                            : item.res_model === 'hr.training.public'
                            ? 'دورة داخلية'
                            : item.res_model === 'hr.distance.work'
                            ? 'عمل عن بعد'
                            : item.res_model === 'hr.authorization'
                            ? 'استئذان'
                            : 'تدريب'}
                        </Text>
                        <View
                          style={[
                            styles.iconContainer,
                            {
                              backgroundColor:
                                item.res_model === 'hr.holidays'
                                  ? leaveColor
                                  : item.res_model === 'hr.deputation'
                                  ? mandateColor
                                  : item.res_model === 'hr.distance.work'
                                  ? remoteColor
                                  : item.res_model === 'hr.training.public'
                                  ? internalCourcesColor
                                  : item.res_model === 'hr.authorization'
                                  ? authorizationColor
                                  : trainingColor,
                            },
                          ]}
                        >
                          <FastImage
                            tintColor={'white'}
                            style={[styles.detailsIcon]}
                            source={
                              item.res_model === 'hr.holidays'
                                ? VacationImage
                                : item.res_model === 'hr.deputation'
                                ? MandateImage
                                : item.res_model === 'hr.distance.work'
                                ? WorkImage
                                : item.res_model === 'hr.training.public'
                                ? InternalCourcesImage
                                : item.res_model === 'hr.authorization'
                                ? VacationImage
                                : TrainingImage
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.detailsnames}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.props.store.dispatch(
                              homeMyRequestActions.EditableorNot(false),
                            );
                            this.state.props.navigation.navigate(
                              item.res_model === 'hr.training.request'
                                ? 'TrainingRequest'
                                : item.res_model === 'hr.distance.work'
                                ? 'RemoteRequest'
                                : item.res_model === 'hr.holidays'
                                ? 'NewLeaveRequest'
                                : item.res_model === 'hr.deputation'
                                ? 'MandateRequest'
                                : item.res_model === 'hr.training.public'
                                ? 'FormInternalCourses'
                                : item.res_model === 'hr.authorization'
                                ? 'LeaveRequest'
                                : null,
                              { item: item },
                            );
                          }}
                        >
                          <Text style={styles.detailsText}>
                            {item.employee_id[1].split(']')[1]}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </CalendarProvider>
        </View>
        {this.state.isLoading ? <Loader style={{ zIndex: 999 }} /> : null}
      </View>
    );
  }

  loadItemsDay(day) {
    if (!day) return;
    // console.log('loadItemsDay', day);

    // setTimeout(() => {
    this.handleDay(day);

    // }, 1000);
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  appointmentCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContainer: {
    height: 35,
    top: 9,
    paddingHorizontal: wp('1%'),
    paddingVertical: 5,
    marginHorizontal: wp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    borderRadius: 30,
    flexDirection: 'row-reverse',
  },

  container1: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignSelf: 'center',
    margin: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  activeTabText: {
    textAlign: 'center',
    // fontWeight: "bold",
    fontFamily: '29LTAzer-Regular',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
  },
  activeTeamContainer: {
    width: '35%',
  },
  activeTeamDropDown: {
    height: 30,
    borderRadius: 13,
    borderColor: '#dfdfdf',
    flexDirection: 'row-reverse',
  },
  placeholderStyle: {
    fontFamily: '29LTAzer-Regular',
    color: '#696969',
    textAlign: 'center',
  },
  arrowIconStyle: {
    tintColor: '#696969',
    marginLeft: -10,
  },
  detailsContainer: {
    // backgroundColor: "red",
    // marginTop: 20,
    // zIndex: 9,
    flex: 1,
    width: '100%',
  },
  detailsContent: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  detailsItemContainer: {
    width: '100%',
    // backgroundColor:"red",
    padding: 20,
  },
  detailsType: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  detailsnames: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  detailsText: {
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    color: '#696969',
    textAlign: 'center',
  },
  iconContainer: {
    padding: 5,
    borderRadius: 50,
    marginLeft: 10,
    tintColor: 'white',
    color: 'white',
  },
  detailsIcon: {
    width: 20,
    height: 20,
    // color:"white",

    // tintColor: "white",
  },
});
