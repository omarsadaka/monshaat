import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconFe from 'react-native-vector-icons/Feather';

const Header = props => {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ paddingStart: 8 }}>
        {props.cross ? (
          <IconFe
            name="x"
            size={30}
            color="#007598"
            style={{ padding: 8 }}
            onPress={() => props.navigation.goBack()}
          />
        ) : props.back ? (
          <IconFe
            name="arrow-right"
            size={30}
            color="#007598"
            style={{ padding: 8 }}
            onPress={() => props.navigation.goBack()}
          />
        ) : (
          <IconFe
            name="menu"
            size={30}
            color="#007598"
            style={{ padding: 8 }}
            onPress={() => props.navigation.toggleDrawer()}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#20547a',
          }}
        >
          {props.title ? props.title : ''}
        </Text>
      </View>
      <View>
        {props.back ? (
          <View style={{ paddingVertical: 16, paddingHorizontal: 32 }}></View>
        ) : (
          <View>
            {/*<Icon*/}
            {/*  name="notifications-outline"*/}
            {/*  size={20}*/}
            {/*  color="#007598"*/}
            {/*  style={{padding: 5}}*/}
            {/*  onPress={() => props.navigation.navigate('Notifications')}*/}
            {/*/>*/}
            {/*<TouchableOpacity*/}
            {/*  style={styles.notificationDot}*/}
            {/*  onPress={() => props.navigation.navigate('Notifications')}*/}
            {/*/>*/}
            <View style={{ paddingVertical: 16, paddingHorizontal: 32 }}></View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  notificationDot: {
    backgroundColor: 'red',
    height: 9,
    width: 9,
    borderRadius: 4.5,
    position: 'absolute',
    right: 8,
    bottom: 15,
  },
});
