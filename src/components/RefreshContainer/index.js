import React from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
const RefreshContainer = props => {
  return (
    <ScrollView
      contentContainerStyle={props.contentContainerStyle}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={props.onPullToRefresh} />
      }
      style={styles.container}
    >
      {props.children}
    </ScrollView>
  );
};

export default RefreshContainer;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
