import Moment from 'moment';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';

const RequestList = props => {
  const [state, setState] = useState({
    requestListData: [],
  });

  const renderRequestList = item => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          marginVertical: 8,
          marginHorizontal: 16,
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#eeeeee',
          alignItems: 'flex-start',
        }}
      >
        <TouchableOpacity
          style={{ width: '20%', alignItems: 'flex-start' }}
        ></TouchableOpacity>
        <View style={{ width: '80%' }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              textAlign: 'right',
              fontFamily: '29LTAzer-Regular',
            }}
          >
            {item.record_id}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: '29LTAzer-Regular',
              paddingVertical: 4,
              fontSize: 16,
              textAlign: 'right',
            }}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: 'gray',
              textAlign: 'right',
            }}
          >
            {Moment(item.ddate).format('D-MM-Y')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {props.requestDataList ? (
        <FlatList
          data={props.requestDataList}
          renderItem={({ item }) => renderRequestList(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <CustomActivityIndicator modalVisible={true}></CustomActivityIndicator>
      )}
    </View>
  );
};

export default RequestList;
