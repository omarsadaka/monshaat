import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonTextInput from '../CommonTextInput';

export default function CommonReasonModal(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000055',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '90%',
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View style={{ width: '100%' }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  marginBottom: 16,
                  fontFamily: '29LTAzer-Regular',
                }}
              >
                سبب الرفض
              </Text>
              <View
                style={[
                  AppStyle.inputContainer,
                  { backgroundColor: '#ffffff' },
                ]}
              >
                <CommonTextInput
                  customStyle={true}
                  customStyleData={props.customStyleData}
                  changeText={props.changeText}
                  placeholder="سبب الرفض"
                  keyboardType="default"
                  value={props.value}
                  multiline={props.multiline}
                  onContentSizeChange={props.onContentSizeChange}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={{ ...AppStyle.btnPrimary, width: '45%' }}
                onPress={props.actionOk}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  إرسال
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...AppStyle.btnDanger, width: '45%' }}
                onPress={props.actionCancle}
              >
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: '29LTAzer-Regular',
                  }}
                >
                  الغاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
