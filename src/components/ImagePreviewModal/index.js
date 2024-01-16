import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../services/index';

let FixedWidth = Dimensions.get('window').width / 1.2;
const ImageModalPrveView = ({
  show,
  onClose,
  uri,
  handleDownload,
  handleDelet,
  base = 94937,
}) => {
  const [height, setHight] = useState(200);
  const [showLoader, setShowLoader] = useState(true);
  const [url, setUrl] = useState(null);
  const [showHover, setShowHover] = useState(false);
  const DeviceHeight = Dimensions.get('window').height;
  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const MaxHeight =
    Platform.OS === 'android' ? DeviceHeight / 1.1 : DeviceHeight / 1.2;
  const modalRef = useRef(null);
  useEffect(() => {
    if (show) {
      axios
        .get(
          `${baseUrl}/api/search_read/ir.attachment?domain=[["id","=",${base}]]&fields=["datas"]`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
        .then(e => {
          let URI = `data:image/png;base64,${e.data[0].datas}`;

          Image.getSize(URI, (w, h) => {
            let ratio = w / h;
            let rationHeight = FixedWidth / ratio;

            setHight(
              rationHeight > MaxHeight ? DeviceHeight / 1.1 : rationHeight,
            );
            setShowLoader(false);
          });
          setUrl(`data:image/png;base64,${e.data[0].datas}`);
        })
        .catch(err => {
          // console.log('err');
          // console.log('error', err);
        });
    } else {
      setShowHover(false);
      setHight(200);
      setShowLoader(true);
      setUrl(null);
    }
  }, [show]);
  return (
    <Modal
      swipeDirection="down"
      backdropOpacity={showLoader ? 0.3 : 0.9}
      onSwipeComplete={onClose}
      ref={modalRef}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      isVisible={show}
      animationInTiming={1000}
      animationOutTiming={200}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={100}
    >
      <View
        style={{
          minHeight: height,
          width: '100%',
        }}
      >
        <View style={styles.flex}>
          <TouchableOpacity
            style={styles.flexEnd}
            onPress={() => setShowHover(!showHover)}
            disabled={showLoader}
          >
            <MaterialCommunityIcons
              size={30}
              color="white"
              name="dots-vertical"
              // style={{ alignSelf: "flex-end" }}
            />
          </TouchableOpacity>
          {showHover && (
            <View style={styles.hover}>
              <TouchableOpacity
                onPress={() => {
                  setShowHover(false);
                  onClose();
                  handleDownload(base);
                }}
              >
                <Text style={styles.label}>تحميل</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowHover(false);
                  onClose();
                  handleDelet();
                }}
              >
                <Text style={styles.label}>حذف</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowHover(false);
                  onClose();
                }}
              >
                <Text style={styles.label}>اغلاق</Text>
              </TouchableOpacity>
            </View>
          )}
          {showLoader && (
            <Image
              source={require('../../assets/images/gif/128.gif')}
              style={styles.wrapper}
            />
          )}
          <View
            style={{
              width: FixedWidth,
              height,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Image
              style={styles.image}
              source={{
                uri: url,
              }}
              resizeMode="stretch"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '500',
    textAlign: 'right',
    marginVertical: 10,
    paddingRight: 10,
  },
  image: { width: '100%', height: '100%', flex: 1 },
  wrapper: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: '48%',
    right: '45%',
    zIndex: 4000,
  },
  hover: {
    backgroundColor: 'white',
    minHeight: 30,
    width: 50,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    top: 30,
    position: 'absolute',
    zIndex: 1000,
  },
  flex: { flex: 1 },
  flexEnd: { alignItems: 'flex-end' },
});

export default ImageModalPrveView;
