import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';
import PDFView from 'react-native-view-pdf';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { AppStyle } from '../../assets/style/AppStyle';
import NewHeader from '../../components/NewHeader';
import { deleteMsg } from '../../redux/action/messageActions';
import { baseUrl } from '../../services';

const PdfViewer = props => {
  const [loading, setLoading] = useState(true);
  const [showToolTip, setShowToolTip] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showLoitteText, setShowLoitteText] = useState(false);
  const [pdfBase, setPdfBase] = useState(null);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  const dispatch = useDispatch();

  const {
    navigation,
    route: {
      params: { uri, name, message, base },
    },
  } = props;
  React.useEffect(() => {
    let url = `${baseUrl}/api/search_read/ir.attachment?domain=[["id","=",${base}]]&fields=["datas"]`;
    console.log('wwwwwwggghh', url);
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
        let URI = `data:application/pdf;base64,${e.data[0].datas}`;
        setPdfBase(e.data[0].datas);
      })
      .catch(err => {
        // console.log('error', err);
        setLoading(false);
      });
  }, []);

  const dowloadAttachmentBaseUpdated = async (fileName = '1.png', id) => {
    const { config, fs } = RNFetchBlob;
    if (Platform.OS === 'ios') {
      const { dirs } = RNFetchBlob.fs;
      const dirToSave = dirs.DocumentDir;
      const configfb = {
        fileCache: false,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: '',
        },
        android: configfb,
      });

      RNFetchBlob.config(configOptions)
        .fetch('GET', baseUrl + '/api/attachment/download/' + id, {
          Authorization: 'Bearer ' + accessToken,
        })
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(res.path(), res.data, 'base64');
            setTimeout(async () => {
              RNFetchBlob.ios.previewDocument(res.path());
            }, 500);
          }
        })
        .catch(e => {
          // console.log('The file saved to ERROR', e.message);
        });
    } else {
      // android
      checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
        .then(statuses => {
          if (
            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'denied'
          ) {
            requestMultiple([
              PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
              PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            ]).then(statuses => {
              if (
                statuses['android.permission.READ_EXTERNAL_STORAGE'] ===
                'granted'
              ) {
                dispatch({ type: 'COMMON_LOADER', value: true });
                let mDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
                let options = {
                  fileCache: true,
                  addAndroidDownloads: {
                    useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                    notification: true,
                    path: mDir + '/' + fileName, // this is the path where your downloaded file will live in
                    description: 'Downloading file.',
                    mime: `application/pdf`,
                  },
                };
                config(options)
                  .fetch('GET', baseUrl + '/api/attachment/download/' + id, {
                    Authorization: 'Bearer ' + accessToken,
                  })

                  .then(res => {
                    dispatch({ type: 'COMMON_LOADER', value: false });
                  })
                  .catch(errorMessage => {
                    // console.log('errorMessage', errorMessage);
                  });
                return;
              }
            });
            //
          } else if (
            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'blocked'
          ) {
            // console.log('permission denied');
          } else {
            dispatch({ type: 'COMMON_LOADER', value: true });
            let mDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
            let options = {
              fileCache: true,
              addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: true,
                path: mDir + '/' + fileName, // this is the path where your downloaded file will live in
                description: 'Downloading file.',
                mime: `application/pdf`,
              },
            };

            config(options)
              .fetch('GET', baseUrl + '/api/attachment/download/' + id, {
                Authorization: 'Bearer ' + accessToken,
              })
              .then(res => {
                dispatch({ type: 'COMMON_LOADER', value: false });
              })
              .catch(errorMessage => {
                // console.log('errorMessage', errorMessage);
              });
            return;
          }
        })
        .catch(e => {
          // console.log('permission denied');
        });
    }
  };
  return (
    <View style={[AppStyle.page, styles.wrapper]}>
      <LinearGradient
        colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
        style={styles.linear}
      >
        <NewHeader
          {...props}
          back={true}
          hasToolTip
          title={name}
          onToolTipPress={() => {
            setShowToolTip(!showToolTip);
          }}
        />
        {showToolTip && (
          <View style={styles.toolTipWrapper}>
            <TouchableOpacity
              style={styles.laberBtn}
              onPress={() => {
                setShowToolTip(!showToolTip);
                dowloadAttachmentBaseUpdated(message.attachemntName, base);
              }}
            >
              <Text style={styles.label}>تحميل</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.laberBtn}
              onPress={() => {
                setShowToolTip(false);
                dispatch(deleteMsg(message));
                setDeleted(true);
              }}
            >
              <Text style={styles.label}>حذف</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.laberBtn}
              onPress={() => {
                setShowToolTip(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.label}>تراجع</Text>
            </TouchableOpacity>
          </View>
        )}
        {!deleted && loading && (
          <Image
            source={require('../../assets/images/gif/128.gif')}
            style={styles.loader}
          />
        )}
        {deleted ? (
          <View style={styles.loitteWrapper}>
            <LottieView
              source={require('../../assets/loitte/success.json')}
              autoPlay
              loop={false}
              style={styles.loitte}
              onAnimationFinish={() => {
                // setTimeout(() => {
                //   setShowLoitteText(true);
                // }, 1000);
                setTimeout(() => {
                  props.navigation.goBack();
                }, 500);
              }}
            />
            {showLoitteText && (
              <Animatable.Text
                animation="pulse"
                easing="ease-out"
                iterationCount={1}
                style={styles.loitteText}
              >
                تم حذف الملف
              </Animatable.Text>
            )}
          </View>
        ) : (
          <PDFView
            fadeInDuration={250.0}
            style={styles.pdf}
            resource={pdfBase}
            resourceType={'base64'}
            onLoad={() => {
              setLoading(false);
            }}
            onError={error => {
              //  console.log(error);
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

export default PdfViewer;
const styles = StyleSheet.create({
  wrapper: { flexDirection: 'column', backgroundColor: '#F0F1F2' },
  linear: { flex: 1 },
  toolTipWrapper: {
    position: 'absolute',
    left: 10,
    zIndex: 10000,
    backgroundColor: 'white',
    top: Platform.OS === 'ios' ? Dimensions.get('window').height / 11 : 33,
  },
  pdf: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 15,
  },
  laberBtn: {
    backgroundColor: 'white',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: 3.0,

    elevation: 24,
    //  borderRadius: 8,
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  loitteWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.8,
  },
  loitte: {
    width: 300,
    height: 300,
  },
  loitteText: {
    marginTop: -80,
    fontWeight: '600',
    fontSize: 15,
  },
  loader: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});
