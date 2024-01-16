import React, { useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { useDispatch, useSelector } from 'react-redux';
import * as loadingAction from '../../redux/action/loadingAction';
import { showMessage } from 'react-native-flash-message';
import CustomPreviewModel from '../CustomPreviewModel/CustomPreviewModel';
const OrderViewAttatchment = (props) => {
  const [isVesible, setIsVesible] = useState(false);
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const getFileExtention = (name) => {
    return /[.]/.exec(name) ? /[^.]+$/.exec(name) : undefined;
  };

  const mimeType = (extension) => {
    if (extension.toLowerCase().includes('pdf')) {
      return 'application/pdf';
    } else if (extension.toLowerCase().includes('xlsx')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (extension.toLowerCase().includes('xls')) {
      return 'application/vnd.ms-excel';
    } else if (extension.toLowerCase().includes('png')) {
      return 'image/png';
    } else if (extension.toLowerCase().includes('jpg')) {
      return 'image/jpg';
    } else if (extension.toLowerCase().includes('jpeg')) {
      return 'image/jpeg';
    } else if (extension.toLowerCase().includes('jpe')) {
      return 'image/jpe';
    } else if (extension.toLowerCase().includes('mp4')) {
      return 'video/mp4';
    } else if (extension.toLowerCase().includes('3gpp')) {
      return 'video/3gpp';
    } else if (extension.toLowerCase().includes('webm')) {
      return 'video/webm';
    } else if (extension.toLowerCase().includes('ogv')) {
      return 'video/ogg';
    } else if (extension.toLowerCase().includes('mpeg')) {
      return 'video/mpeg';
    } else if (extension.toLowerCase().includes('avi')) {
      return 'video/x-msvideo';
    } else if (extension.toLowerCase().includes('docx')) {
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (extension.toLowerCase().includes('doc')) {
      return 'application/msword';
    } else if (extension.toLowerCase().includes('ppt')) {
      return 'application/vnd.ms-powerpoint';
    } else if (extension.toLowerCase().includes('pptx')) {
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else {
      return extension;
    }
  };

  const download = () => {
    dispatch(loadingAction.commonLoader(true));
    var date = new Date();
    var file_ext = getFileExtention(attatchment.name);
    file_ext = '.' + file_ext[0];
    const imageDate = attatchment.url;
    // console.log('imageDate', imageDate);
    const dirs = RNFetchBlob.fs.dirs;
    if (Platform.OS == 'android') {
      let path =
        dirs.DownloadDir +
        '/file_12345' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        file_ext;
      RNFetchBlob.fs
        .writeFile(path, imageDate, 'base64')
        .then((res) => {
          dispatch(loadingAction.commonLoader(false));
          setTimeout(async () => {
            RNFetchBlob.android.actionViewIntent(path, mimeType(file_ext));
          }, 500);
          showMessage({
            style: {
              alignItems: 'flex-end',
            },
            type: 'success',
            message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
          });
        })
        .catch((err) => {
          dispatch(loadingAction.commonLoader(false));
          showMessage({
            style: {
              alignItems: 'flex-end',
            },
            type: 'danger',
            message: 'غير قادر على التحميل',
          });
        });
    } else {
      let path =
        dirs.DownloadDir +
        '/file_123' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        file_ext;
      RNFetchBlob.fs
        .writeFile(path, RNFetchBlob.base64.encode(imageDate), 'base64')
        .then((res) => {
          dispatch(loadingAction.commonLoader(false));
          setTimeout(async () => {
            RNFetchBlob.ios.previewDocument(path);
          }, 500);
          showMessage({
            style: {
              alignItems: 'flex-end',
            },
            type: 'success',
            message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
          });
        })
        .catch((err) => {
          dispatch(loadingAction.commonLoader(false));
          showMessage({
            style: {
              alignItems: 'flex-end',
            },
            type: 'danger',
            message: 'غير قادر على التحميل',
          });
        });
    }
  };

  return (
    <View style={props.styleCon ? props.styleCon : styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>المرفقات</Text>
        <View style={styles.attatchmentsContainer}>
          {props.attatchments.map((attatchment) => (
            <TouchableOpacity
              onPress={() => {
                setUrl(attatchment.url);
                setType(getFileExtention(attatchment.name));
                setIsVesible(true);
              }}
              style={styles.attatchmentsItem}
            >
              <Text style={styles.text2}>
                {' '}
                {props.isContractOrder
                  ? props.isContractOrder
                  : 'عرض المرفقات'}{' '}
              </Text>
              <Image
                resizeMode="contain"
                source={require('../../assets/images/order/images.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Image
        resizeMode="contain"
        source={require('../../assets/images/order/attatchments.png')}
        style={props.style ? props.style : styles.icon}
      />
      <CustomPreviewModel
        isVesible={isVesible}
        onClosePress={() => setIsVesible(false)}
        type={type}
        data={url}
      />
    </View>
  );
};

export default OrderViewAttatchment;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  attatchmentsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  attatchmentsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 8,
  },
  text1: {
    fontSize: Dimensions.get('window').width * 0.027,
    color: 'gray', //'#7698B1',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    textAlign: 'right',
  },
  text2: {
    color: '#7698B1',
    fontFamily: '29LTAzer-Regular',
    marginVertical: 2,
    fontSize: 16,
    textAlign: 'right',
    marginHorizontal: 10,
    marginTop: 8,
  },
});
