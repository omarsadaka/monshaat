import moment from 'moment';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

const AppendedQuestionnary = (props) => {
  const renderRequestList = (item) => {
    let viewItem = {
      status: null,
      lineOne: item.title,
      addLineOne: null,
    };

    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Questionary', {
            item: item,
            isRequired: item.survey_vals[0].is_required,
          });
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: '#FCFCFC',
          marginVertical: 8,
          marginHorizontal: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E7F0F4',
          justifyContent: 'space-between',
          alignItems: 'center',
          elevation: 2,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 1 },
        }}
      >
        {/* <View
          style={{
            width: '25%',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#FCFCFC',
              borderRadius: 6,
              alignItems: 'center',
              paddingHorizontal: 8,
              marginTop: 8,
              width: '100%',
              paddingVertical: 3,
            }}
            onPress={() =>
              props.navigation.navigate('Questionary', {
                item: item,
                isRequired: item.survey_vals[0].is_required,
              })
            }
          >
            <View>
              <Text
                style={{
                  color: '#ffffff',
                  textAlign: 'center',
                  fontFamily: '29LTAzer-Regular',
                  paddingVertical: 5,
                }}
                numberOfLines={2}
              >
                عرض{' '}
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {viewItem.lineOne ? (
            <Text
              style={{
                fontSize: 20,
                textAlign: 'right',
                fontFamily: '29LTAzer-Bold',
                color: '#4B4B4B',
              }}
              numberOfLines={2}
            >
              {viewItem.lineOne}
            </Text>
          ) : null}
          {/* data */}
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginTop: 7,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                textAlign: 'right',
                fontFamily: '29LTAzer-Regular',
                color: '#4B4B4B',
              }}
              numberOfLines={1}
            >
              إلى{' '}
              {item.survey_vals
                ? item.survey_vals[0].end_date != false
                  ? moment(item.survey_vals[0].end_date).format('DD-MM-YYYY')
                  : 'غير محدد'
                : 'غير محدد'}
            </Text>
            <View style={{ width: 8 }} />
            <Text
              style={{
                fontSize: 12,
                textAlign: 'right',
                fontFamily: '29LTAzer-Regular',
                color: '#4B4B4B',
              }}
              numberOfLines={1}
            >
              من{' '}
              {item.survey_vals
                ? moment(item.survey_vals[0].create_date).format('DD-MM-YYYY')
                : '---'}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require('../../assets/images/new_logo.png')
            }
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        data={props.requestDataList}
        onRefresh={props.onMRefresh}
        refreshing={false}
        renderItem={({ item }) => renderRequestList(item)}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};
export default AppendedQuestionnary;

const styles = StyleSheet.create({
  rightContainer: {
    backgroundColor: 'red',
    height: '83%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginTop: 8,
  },
  rightText: {
    color: 'white',
    margin: '6%',
    marginTop: '8%',
    textAlignVertical: 'center',
    textAlign: 'left',
    fontFamily: '29LTAzer-Regular',
  },
});
