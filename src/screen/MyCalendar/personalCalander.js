import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader';
import RefreshContainer from '../../components/RefreshContainer';
import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';
const testIDs = require('./testIDs');

const leaveColor = '#EB5252';
const authorizationColor = 'orange';
const mandateColor = '#655DC6';
const trainingColor = '#00A9AF';
const remoteColor = '#3360A8';
const internalCourcesColor = trainingColor;

const VacationImage = require('../../assets/images/iconly/calendar.png');
const MandateImage = require('../../assets/images/iconly/location.png');
const TrainingImage = require('../../assets/images/iconly/edit.png');
const WorkImage = require('../../assets/images/iconly/work.png');

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
const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];
  const theDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (theDate < lastDate) {
    dates = [...dates, new Date(theDate).toISOString().substring(0, 10)];
    theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, lastDate.toISOString().substring(0, 10)];
  return dates;
};
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const PersonalCalander = (props) => {
  const [empID, setEmpId] = useState();
  const [isloading, setIsLoading] = useState(false);

  const [userName, setUserName] = useState('');
  const [markedDate, setMarkedDate] = useState({});
  const [personalCalanderData, setPersonalCalanderData] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollRef = useRef();

  const accessToken = useSelector((state) => state.LoginReducer.accessToken);

  useEffect(() => {
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
      dayNamesShort: [
        'أحد',
        'أثنين',
        'ثلاثاء',
        'اربعاء',
        'خميس',
        'جمعة',
        'سبت',
      ],
      today: 'اليوم',
    };
    LocaleConfig.defaultLocale = 'ar';
    (async () => {
      let mEmpID = await AsyncStorage.getItem('empID');
      // console.log('empID', JSON.parse(mEmpID));
      setEmpId(JSON.parse(mEmpID));
    })();
    (async () => {
      let username = await AsyncStorage.getItem('username');
      setUserName(username);
    })();
  }, []);

  const getPersonalCalander = async (activity) => {
    // console.log('getPersonalCalander');
    let holiday,
      deputation,
      remoteWork,
      authorization,
      internalCources,
      training = '';

    let holidayRes,
      deputationRes,
      remoteWorkRes,
      authorizationRes,
      internalCourcesRes,
      trainingRes = [];
    let model = 'hr.holidays';

    let personalCalanderResponse = await personalalanderApiCall();

    if (activity == 'all' || activity == 'holiday') {
      let holidayResponse = personalCalanderResponse.holidays;
      holiday = hanldeApiResponse(holidayResponse, model).markedDatesString;
      holidayRes = hanldeApiResponse(holidayResponse, model).responseData;
    } else {
      holiday = hanldeApiResponse([], model).markedDatesString;
      holidayRes = hanldeApiResponse([], model).responseData;
    }
    if (activity == 'all' || activity == 'training') {
      model = 'hr.training.public';
      let internalCourcesResponse = personalCalanderResponse['public training'];
      internalCources = hanldeApiResponse(
        internalCourcesResponse,
        model,
      ).markedDatesString;
      internalCourcesRes = hanldeApiResponse(
        internalCourcesResponse,
        model,
      ).responseData;
    } else {
      internalCources = hanldeApiResponse([], model).markedDatesString;
      internalCourcesRes = hanldeApiResponse([], model).responseData;
    }

    if (activity == 'all' || activity == 'authorization') {
      model = 'hr.authorization';
      let authorizationResponse = personalCalanderResponse.authorizations;
      authorization = hanldeApiResponse(
        authorizationResponse,
        model,
      ).markedDatesString;
      authorizationRes = hanldeApiResponse(
        authorizationResponse,
        model,
      ).responseData;
    } else {
      authorization = hanldeApiResponse([], model).markedDatesString;
      authorizationRes = hanldeApiResponse([], model).responseData;
    }

    if (activity == 'all' || activity == 'deputation') {
      model = 'hr.deputation';
      let deputationResponse = personalCalanderResponse.deputations;
      deputation = hanldeApiResponse(
        deputationResponse,
        model,
      ).markedDatesString;
      deputationRes = hanldeApiResponse(deputationResponse, model).responseData;
    } else {
      deputation = hanldeApiResponse([], model).markedDatesString;
      deputationRes = hanldeApiResponse([], model).responseData;
    }

    if (activity == 'all' || activity == 'distance') {
      model = 'hr.distance.work';
      let remoteWorkResponse = personalCalanderResponse['distance work'];
      remoteWork = hanldeApiResponse(
        remoteWorkResponse,
        model,
      ).markedDatesString;
      remoteWorkRes = hanldeApiResponse(remoteWorkResponse, model).responseData;
    } else {
      remoteWork = hanldeApiResponse([], model).markedDatesString;
      remoteWorkRes = hanldeApiResponse([], model).responseData;
    }

    if (activity == 'all' || activity == 'training') {
      model = 'hr.training.request';
      let trainingResponse = personalCalanderResponse.training;
      training = hanldeApiResponse(trainingResponse, model).markedDatesString;
      trainingRes = hanldeApiResponse(trainingResponse, model).responseData;
    } else {
      training = hanldeApiResponse([], model).markedDatesString;
      trainingRes = hanldeApiResponse([], model).responseData;
    }
    let totalres = [
      ...holidayRes,
      ...authorizationRes,
      ...deputationRes,
      ...remoteWorkRes,
      ...trainingRes,
      ...internalCourcesRes,
    ];
    let markedDates =
      holiday +
      authorization +
      deputation +
      remoteWork +
      training +
      internalCources;
    // console.log('markedDates', markedDates);
    let editedDate = '{' + markedDates.slice(0, -1);
    editedDate += '}';

    setMarkedDate(JSON.parse(editedDate));
    setPersonalCalanderData(totalres);
  };
  const personalalanderApiCall = async () => {
    // console.log('personalalanderApiCall');
    setIsLoading(true);

    let url = `${baseUrl}/api/call/all.requests/retrieve_my_calendar?kwargs={"employee_id": ${empID}}`;
    let secretUrl = await EncryptUrl(url);

    return fetch(secretUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        return responseData;
      })
      .catch(function (error) {
        // console.log('Error calling getPersonalCalander');
        // console.log(url);
        // console.log(
        //   'There has been a problem with your fetch operation: ' +
        //     error.message,
        // );
        setIsLoading(false);
        throw error;
      });
  };

  const hanldeApiResponse = (responseData, model) => {
    let markedDatesString = '';
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
  };

  const callAppointmentApi = async (startTime, endTime) => {
    setIsLoading(true);

    if (userName == 'fsuwailih' && baseUrl !== 'https://me.monshaat.gov.sa') {
      let myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Bearer p9yVQvxte2hhuupgiTZD4TeWgui0A0',
      );
      myHeaders.append('Content-Type', 'application/json');

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
      };

      let url =
        'http://demo6761654.mockable.io/getAppointmentByUserAndDates/1308';
      return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responseData) => {
          setIsLoading(false);
          // console.log('callAppointmentApi mock', responseData);
          return responseData;
        })
        .catch(function (error) {
          // console.log('Error calling callAppointmentApi');
          // console.log(url);

          // console.log(
          //   'There has been a problem with your fetch operation: ' +
          //     error.message,
          // );
          setIsLoading(false);
          throw error;
        });
    } else {
      if (!accessToken || !userName) {
        return;
      }
      var myHeaders = new Headers();
      myHeaders.append('x-api-key', '2EB6630E-ADF2-4765-B428-CFD2FC74AF9F');
      myHeaders.append('Authorization', accessToken);
      myHeaders.append('Content-Type', 'application/json');

      var raw = {
        userName: userName,
        startDate: startTime,
        endDate: endTime,
      };
      console.log('raw omar', raw);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      var url = `http://185.118.121.226:8300/IntegrationAPI/CRM/Appointments/UserAppointment`;
      return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responseData) => {
          setIsLoading(false);
          return responseData;
        })
        .catch(function (error) {
          alert(error);
          setIsLoading(false);
          throw error;
        });
    }
  };
  const handleAppointment = async (startTime, endTime, day) => {
    const appointments = await callAppointmentApi(startTime, endTime);

    for (let i = -7; i < 30; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);

      if (!agendaItems[strTime]) {
        agendaItems[strTime] = [];

        const meetings = appointments.filter(
          (meeting) => meeting.dayDate.split('T')[0] === strTime,
        );
        for (let j = 0; j < meetings.length; j++) {
          agendaItems[strTime].push({
            start: meetings[j].startTime.substring(11, 16),
            end: meetings[j].endTime.substring(11, 16),
            subject: meetings[j].subject,
            location: meetings[j].location,
          });
        }
      }
    }
    const newItems = {};
    Object.keys(agendaItems).forEach((key) => {
      newItems[key] = agendaItems[key];
    });

    setAgendaItems(newItems);
  };

  const loadItems = (day) => {
    const time = day.timestamp + 0 * 24 * 60 * 60 * 1000;
    const currentDate = timeToString(time);
    if (!agendaItems[currentDate]) {
      let time = day.timestamp - 7 * 24 * 60 * 60 * 1000;
      const startTime = timeToString(time);

      time = day.timestamp + 30 * 24 * 60 * 60 * 1000;
      const endTime = timeToString(time);

      handleAppointment(startTime, endTime, day);
    }
  };

  useEffect(() => {
    // console.log('personalalanderApiCall', accessToken, empID);
    if (!accessToken || !empID) {
      return;
    }
    getPersonalCalander('all');
  }, [accessToken, empID]);

  const onPullToRefresh = () => {
    getPersonalCalander(selectedFilter);
  };

  const renderItem = (item) => {
    if (!item) return;
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={styles.item}
        onPress={() => {
          if (item.location) {
            Linking.openURL(item.location).catch((err) => {
              // console.error('Failed opening page because: ', err);
              alert('رابط الاجتماع غير صحيح');
            });
          } else {
            alert('رابط الاجتماع غير موجود في الايميل');
          }
        }}
      >
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Text
              style={{
                color: item.textColor,
                fontFamily: '29LTAzer-Regular',
              }}
            >
              {item.start}
            </Text>
            <Text
              style={{
                color: item.textColor,
                fontFamily: '29LTAzer-Regular',
              }}
            >
              {item.end}
            </Text>
          </View>
          <View style={styles.appointmentBody}>
            <Text
              style={{
                color: item.textColor,
                textAlign: 'right',
                fontFamily: '29LTAzer-Regular',
              }}
            >
              {item.subject}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderEmpty = () => <View style={styles.noEventContainer}></View>;
  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };
  const _renderFilters = () => {
    return (
      <ScrollView
        horizontal
        ref={scrollRef}
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
                scrollRef.current.scrollTo({
                  animated: true,
                  x: i < 3 ? Dimensions.get('window').width : 0,
                });
                if (selectedFilter !== item.name) {
                  setSelectedFilter(item.name);
                  setActiveIndex(item.index);
                  getPersonalCalander(item.name);
                } else {
                  setSelectedFilter('all');
                  setActiveIndex(1);
                  getPersonalCalander('all');
                }
              }}
            >
              <View
                style={[
                  styles.detailsType,
                  {
                    backgroundColor:
                      activeIndex === item.index ? '#ddd4cd' : 'white',

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
  };
  return (
    <View style={styles.container}>
      <RefreshContainer refresh={false} onPullToRefresh={onPullToRefresh}>
        {_renderFilters()}
      </RefreshContainer>
      <View
        style={{
          flex: 70,
        }}
      >
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={agendaItems}
          loadItemsForMonth={loadItems}
          selected={new Date()}
          onDayPress={loadItems}
          renderItem={renderItem}
          renderEmptyDate={renderEmpty}
          rowHasChanged={rowHasChanged}
          markedDates={markedDate}
          markingType={'custom'}
          renderEmptyData={renderEmpty}
          theme={{
            textDayHeaderFontSize: 12,
            textDayHeaderFontFamily: '29LTAzer-Bold',
            textDayFontFamily: '29LTAzer-Regular',
            textMonthFontFamily: '29LTAzer-Regular',
            textDayFontSize: 20,
          }}
        />
        {isloading && <Loader style={styles.loader} />}
      </View>
    </View>
  );
};
export default PersonalCalander;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noEventContainer: {},
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
  appointmentHeader: {
    flexDirection: 'column',
    borderRightColor: '#000',
    borderRightWidth: 1,
    flex: 1,
    textAlign: 'right',
    backgroundColor: '#FFF',
  },
  appointmentBody: {
    flex: 7,
    backgroundColor: '#FFF',
  },
  imageWrapper: {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    zIndex: 999,
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
