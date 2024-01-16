import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

const InternalRequest = (props) => {
  const renderRequestList = (item) => {
    let viewItem = {
      status: null,
      lineOne: item.name,
      // lineOne: null,

      lineTwo: ' من ' + item.date_from + ' الى ' + item.date_to,
      // lineTwo: null,
      lineFour: 'المدة:' + ' ' + item.number_of_days + ' ' + 'أيام',
      // lineFour: null,

      lineDescription: 'المركز التدريبي:' + ' ' + item.training_center,
      // lineDescription: null,

      addLineOne: null,
    };

    return (
      // <Wraper item={item} >
      <TouchableOpacity
        // style={styles.familyContainer}
        onPress={() =>
          props.navigation.navigate('FormInternalCourses', {
            item: item,
            // viewType: props.menu,
          })
        }
      >
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '30%',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {viewItem.lineFour ? (
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'right',
                  fontFamily: '29LTAzer-Regular',
                }}
                numberOfLines={1}
              >
                {viewItem.lineFour}
              </Text>
            ) : null}

            {viewItem.lineDescription ? (
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'right',
                  fontFamily: '29LTAzer-Regular',
                }}
                numberOfLines={2}
              >
                {viewItem.lineDescription}
              </Text>
            ) : null}
          </View>
          <View
            style={{ width: '70%', justifyContent: 'center', paddingLeft: 8 }}
          >
            {viewItem.lineOne ? (
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'right',
                  fontFamily: '29LTAzer-Bold',
                  color: '#20547a',
                }}
                numberOfLines={1}
              >
                {/* {viewItem.status} */}
                {viewItem.lineOne}
              </Text>
            ) : null}

            {viewItem.lineTwo ? (
              <Text
                numberOfLines={1}
                style={{
                  textAlign: 'right',
                  paddingVertical: 4,
                  fontSize: 14,
                  fontFamily: '29LTAzer-Regular',
                }}
              >
                {viewItem.lineTwo}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
      // </Wraper>
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
export default InternalRequest;

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
