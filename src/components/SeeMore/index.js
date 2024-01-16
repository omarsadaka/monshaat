import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SeeMore = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>عرض المزيد</Text>
      <Ionicons name="eye-outline" size={20} color={'#20547a'} />
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-down" size={20} color={'#20547a'} />
      </View>
    </View>
  );
};

export default SeeMore;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor: '#fff',
    borderTopColor: '#efefef',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    paddingBottom: 0,
    marginBottom: 0,
  },
  iconContainer: {
    position: 'absolute',
    left: 8,
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
    marginHorizontal: 8,
    fontSize: 16,
  },
});
