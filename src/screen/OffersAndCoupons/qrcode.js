import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import NewHeader from '../../components/NewHeader';

const QrCodeOffers = props => {
  const [formData, setFormData] = useState('');
  const isFocused = useIsFocused();

  const [state, setState] = useState({
    isLoading: true,
    offersLists: [],
    modalVisible: false,
  });

  useEffect(() => {
    if (props.route.params && props.route.params.item) {
      let a = props.route.params.item;
      // console.log('iteeeeem-----', a);

      setFormData(a);
    }
  }, [isFocused, props.route.params.item, formData]);

  const segs = [{ data: formData, mode: 'Byte' }];
  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="   العروض و المزايا " />
      <View style={{ marginTop: -20, zIndex: 99, height: '88%' }}>
        <View style={styles.cardContainer}>
          <View
            style={[
              styles.section,
              {
                justifyContent: 'center',
                flexDirection: 'column',
                top: 130,
              },
            ]}
          >
            <View style={{ alignSelf: 'center', top: -50 }}>
              <QRCode value={segs} size={220} />
            </View>
            <View
              style={{
                top: -30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* <Text
                style={{
                  top: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontFamily: "29LTAzer-Regular",
                  fontSize: 15,
                  color: "#20547a",
                }}
              >
                {"  الرقم المرجعي:" +
                  " " +
                  (props.route.params && props.route.params.item)}
              </Text> */}
              <Text
                style={{
                  top: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontFamily: '29LTAzer-Bold',
                  fontSize: 15,
                  color: '#20547a',
                }}
              >
                في حال استخدام ال QRCode تكون قد استخدمت هذا العرض{' '}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
export default QrCodeOffers;
const styles = StyleSheet.create({
  section: {
    padding: 24,
    // height: 200,
    paddingVertical: 24,
    width: '100%',
    flexDirection: 'row',
  },
  cardContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    flexGrow: 1,
    paddingTop: 20,
    height: '100%',
  },
});
