import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function CommonTextInput(props) {
  return (
    <TextInput
      style={props.customStyle ? props.customStyleData : styles.defaultStyle}
      onChangeText={props.changeText}
      value={props.value}
      secureTextEntry={props.secureText}
      keyboardType={props.keyboardType}
      placeholder={props.placeholder}
      editable={props.editable !== false}
      multiline={props.multiline}
      onSubmitEditing={props.onSubmitEditing}
      autoCapitalize={props.autoCapitalize}
      placeholderTextColor={
        props.placeholderTextColor ? props.placeholderTextColor : '#99b4c8'
      }
      placeholderStyle={props.placeholderStyle}
      maxLength={props.maxLength}
      onEndEditing={props.onSubmit}
      onContentSizeChange={props.onContentSizeChange}
      onFocus={props.onFocus}
      autoCompleteType={props.autoCompleteType}
    />
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    borderBottomWidth: 0.6,
    borderColor: '#e3e3e3',
    height: 50,
    fontFamily: '29LTAzer-Regular',
  },
});
