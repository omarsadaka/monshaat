import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import NewHeader from '../../components/NewHeader';
import TabNavigator from '../../components/TabNavigator';
import TeamCalender from './MyTeam';
import PersonalCalender from './personalCalander';

const CalenderWrapper = (props) => {
  const [activeTab, setActiveTab] = useState(1);
  const [active, setActive] = useState(1);

  const nav = useSelector((state) => state.NavigateTo.navigeteTo);

  useEffect(() => {
    if (nav.tabValue === 'team') {
      setActiveTab('team');
      // setActive(1);
    }
  }, [nav, props]);
  // alert(JSON.stringify(nav));
  return (
    <View style={styles.page}>
      <NewHeader {...props} back={false} title="التقويم" />
      <View style={styles.navWrapper}>
        {/* <TabNavigator
          label1=" تقويم الفريق"
          label2="  التقويم"
          baseColor="#008ac5"
          paddingVertical={10}
          borderRadius={10}
          onNavChange={value => {
            setActiveTab(value === 1 ? 'team' : 'me');
          }}
          active={active}
        /> */}
        <TouchableOpacity
          onPress={() => setActiveTab(2)}
          style={[
            styles.btn,
            { backgroundColor: activeTab != 1 ? '#007598' : '#FFFFFF' },
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: activeTab != 1 ? '#FFFFFF' : '#007598' },
            ]}
          >
            {' '}
            تقويم الفريق
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)}
          style={[
            styles.btn,
            { backgroundColor: activeTab == 1 ? '#007598' : '#FFFFFF' },
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: activeTab == 1 ? '#FFFFFF' : '#007598' },
            ]}
          >
            {' '}
            التقويم
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab == 1 ? (
        <PersonalCalender {...props} />
      ) : (
        <TeamCalender {...props} />
      )}
    </View>
  );
};

export default CalenderWrapper;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F0F1F2',
  },
  navWrapper: {
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
});
