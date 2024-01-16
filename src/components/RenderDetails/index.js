import React from 'react';
import { Text, View } from 'react-native';
const RenderDetails = rowData => {
  return (
    <View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: '29LTAzer-Bold',
            fontSize: 15,
            color: '#4E7D89',
          }}
        >
          {rowData.time}
        </Text>
      </View>

      {!rowData.title.includes('طلب') ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#4E7D89',
            backgroundColor: '#4E7D89',
            borderRadius: 10,
            width: 150,
            display: 'flex',
            alignSelf: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: '29LTAzer-Bold',
              fontSize: 15,
              color: 'white',
            }}
          >
            {rowData.isFromMobile
              ? 'موافقة من خلال التطبيق'
              : 'موافقة من خلال البوابة'}
          </Text>
        </View>
      ) : (
        <View
          style={{
            borderRadius: 10,
            width: 150,
            display: 'flex',
            alignSelf: 'center',
          }}
        ></View>
      )}
    </View>
  );
};
export default RenderDetails;
