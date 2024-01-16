import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';

const CommonDatepicker = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 6,
        height: hp('6%'),
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          paddingHorizontal: wp('2.5%'),
          paddingVertical: hp('1%'),
          width: '20%',
        }}
      >
        <Icon name="calendar" size={20} color="#007598" />
      </View>
      <View style={{ width: '80%', alignItems: 'flex-end' }}>
        <DatePicker
          date={props.date}
          mode="date"
          placeholder="Select Date"
          format="DD/MM/YYYY"
          minDate={new Date()}
          maxDate={moment(new Date()).subtract(6570, 'days')}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={props.onDateChange}
          style={{ width: '100%' }}
          customStyles={{
            dateInput: {
              borderColor: 'transparent',
              width: '100%',
              alignItems: 'flex-end',
              paddingRight: wp('2%'),
            },
          }}
        />
      </View>
    </View>
  );
};

export default CommonDatepicker;
