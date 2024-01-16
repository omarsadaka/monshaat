import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import LinearGradient from 'react-native-linear-gradient';
import Modal3 from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconFe from 'react-native-vector-icons/Feather';
import SeenIcon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import io from 'socket.io-client';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonPopup from '../../components/CommonPopup';
import ImageModalPrveView from '../../components/ImagePreviewModal';
import ImageWithLoader from '../../components/ImageWithLoader';
import NewHeader from '../../components/NewHeader';
import {
  clearMsgs,
  deleteMsg,
  getCorrespondnatList,
  getCountUnseen,
  getMessages,
  getOldMessages,
} from '../../redux/action/messageActions';
import * as profileAction from '../../redux/action/profileAction';
import { baseUrl, msgServer } from '../../services';
import { pick } from '../../services/AttachmentPicker';

const socket = io(msgServer);

const fileLimt = 1024;
const imgExtensions = ['jpeg', 'jpg', 'png'];
const extentionsArray = [...imgExtensions, 'pdf'];
const isImage = imageName => {
  const fileExtension = imageName
    ?.split('.')
    .pop()
    .toLowerCase();
  if (imgExtensions.indexOf(fileExtension) < 0) {
    return false;
  }
  return true;
};

const MessagesFeed = props => {
  const dispatch = useDispatch();
  const [modal2, setModal2] = useState(false);
  const [showMaximumUpload, setShowMaximumUpload] = useState(false);
  const chatMesssages = useSelector(state => state.messageReducer.messages);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);
  const localUser = useSelector(
    state => state.ProfileReducer.userProfileData[0],
  );
  const correspStore = useSelector(
    state => state.ProfileReducer.corresProfileData[0],
  );
  const isLoading = useSelector(state => state.ProfileReducer.isLoading);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showMaximumUploadFile, setShowMaximumUploadFile] = useState(false);
  const [chatMessage, setChatMessage] = useState({
    content: '',
    sender: '',
    reciver: '',
  });
  const [state, setState] = useState({
    keyboardOffset: 0,
    filename: [],
    arrayData: [],
    loadingAttachment: false,
  });
  const [correspondant, setCorrespondant] = useState({});
  const [showUoloadError, setShowUploadError] = useState(false);
  const [showImagePreView, setShowImagePreView] = useState(null);
  const [messageToPreview, setMessageToPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.route.params.correspondant) {
      setCorrespondant(props.route.params.correspondant);
    } else if (props.route.params.correspondantId) {
      (async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const id = parseInt(props.route.params.correspondantId, 10);
          const data = {
            id,
            accessToken: token,
          };
          dispatch({ type: 'PROFILE_LOADING', value: true });
          dispatch(profileAction.getCorrProfileData(data));
        }
      })();
    }
  }, [props.route.params.correspondant, props.route.params.correspondantId]);
  useEffect(() => {
    correspStore && setCorrespondant(correspStore);
  }, [correspStore]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    if (!correspondant || !localUser) {
      return;
    }
    correspondant &&
      dispatch(
        getOldMessages(localUser.complete_name, correspondant.complete_name),
      );
    correspondant && dispatch(getMessages(socket));

    clearTimeout(timeout);
    let timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [correspondant, localUser]);

  console.log('localUser', localUser);
  const isFocused = useIsFocused();
  useEffect(() => {
    localUser && dispatch(getCountUnseen(localUser.id));
  }, [isFocused]);

  useEffect(() => {
    props.navigation.addListener('beforeRemove', e => {
      dispatch(clearMsgs());
    });
  }, [props.navigation]);

  function groupedDays(messages) {
    return messages.reduce((acc, el, i) => {
      const messageDay = moment(el.created_at).format('DD MMM YYYY');
      if (acc[messageDay]) {
        return { ...acc, [messageDay]: acc[messageDay].concat([el]) };
      }
      return { ...acc, [messageDay]: [el] };
    }, {});
  }

  // console.log('chatMesssages', chatMesssages);

  function generateItems(messages) {
    const days = groupedDays(messages);
    const sortedDays = Object.keys(days).sort(
      (x, y) =>
        moment(y, 'DD MMM YYYY').unix() - moment(x, 'DD MMM YYYY').unix(),
    );
    const items = sortedDays.reduce((acc, date) => {
      const sortedMessages = days[date].sort(
        (x, y) => new Date(y.created_at) - new Date(x.created_at),
      );
      return acc.concat([...sortedMessages, { type: 'day', date, id: date }]);
    }, []);
    return items;
  }
  const renderMoreOptions = () => {
    return (
      <View style={styles.moreOptions}>
        <TouchableWithoutFeedback
          disabled={!correspondant.work_phone}
          onPress={() => {
            correspondant.work_phone
              ? Linking.openURL(`tel:96611834${correspondant.work_phone}`)
              : showMessage({
                  style: {
                    alignItems: 'flex-end',
                    fontFamily: '29LTAzer-Regular',
                  },
                  type: 'danger',
                  message: 'غير ممكن',
                });
            //setShowHover(false);
          }}
        >
          <View style={styles.IconContainer}>
            <Image
              resizeMode="contain"
              style={
                correspondant.work_phone ? styles.icon : styles.iconDisabled
              }
              source={require('../../assets/images/phone2.png')}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          disabled={!correspondant.mobile_phone}
          onPress={() => {
            correspondant.mobile_phone
              ? Linking.openURL(`tel:+966${correspondant.mobile_phone}`)
              : showMessage({
                  style: {
                    alignItems: 'flex-end',
                    fontFamily: '29LTAzer-Regular',
                  },
                  type: 'danger',
                  message: 'غير ممكن',
                });
            //setShowHover(false);
          }}
        >
          <View style={styles.IconContainer}>
            <Image
              resizeMode="contain"
              style={
                correspondant.mobile_phone ? styles.icon : styles.iconDisabled
              }
              source={require('../../assets/images/iphone.png')}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          disabled={!correspondant.work_email}
          onPress={() => {
            correspondant.work_email
              ? Linking.openURL(`mailto:${correspondant.work_email}`)
              : showMessage({
                  style: {
                    alignItems: 'flex-end',
                    fontFamily: '29LTAzer-Regular',
                  },
                  type: 'danger',
                  message: 'غير ممكن',
                });
            //setShowHover(false);
          }}
        >
          <View style={styles.IconContainer}>
            <Image
              resizeMode="contain"
              style={
                correspondant.work_email ? styles.icon : styles.iconDisabled
              }
              source={require('../../assets/images/@.png')}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const submitChatMessage = async () => {
    let attachemnts = false;
    let isMaxImageValid = true;
    state.filename.length ? (attachemnts = true) : (attachemnts = false);
    let IsFileValidExtension = true;
    if (attachemnts) {
      state.arrayData.map((item, i) => {
        const fileExtension = item.name
          ?.split('.')
          .pop()
          .toLowerCase();
        if (extentionsArray.indexOf(fileExtension) < 0) {
          IsFileValidExtension = false;
        }
      });
      if (!IsFileValidExtension) {
        return setShowUploadError(true);
      }
      const fileExtension = state.filename[0].name
        ?.split('.')
        .pop()
        .toLowerCase();
      if (!IsFileValidExtension) {
        return setShowUploadError(true);
      }
      if (extentionsArray.indexOf(fileExtension) < 0) {
        return;
      }
    }

    state.arrayData.map(f => {
      // console.log('size,type', f.size / 1024, f.type.split('/')[0] === 'image');
      if (f.size) {
        // console.log('-------file-size-fine-', f.size);
        if (f.size / 1024 > fileLimt && f.type.split('/')[0] === 'image') {
          isMaxImageValid = false;
        } else {
        }
      }
    });

    if (!isMaxImageValid) {
      setShowMaximumUpload(true);
      setState({
        ...state,
        filename: [],
        arrayData: [],
        loadingAttachment: false,
      });
      return;
    }
    const formBody = new FormData();
    state.arrayData.forEach(async fileItem => {
      formBody.append('files', fileItem);
    });
    const SuccessCallBack = (odooIds = []) => {
      if (state.arrayData.length > 0) {
        state.arrayData.map((item, i) => {
          console.log(odooIds[i]);
          socket.emit('chat message', {
            seen: false,
            content:
              i === 0
                ? chatMessage.content.trim().length > 0
                  ? chatMessage.content.trim()
                  : ''
                : item.name,
            sender: localUser.complete_name,
            reciver: correspondant.complete_name,
            senderId: localUser.id,
            reciverId: correspondant.id, //employee_id[0] id
            attachemnts: true,
            attachemntName: item.name,
            attachemntId: odooIds[i] || '',
          });
        });
      } else {
        socket.emit('chat message', {
          seen: false,
          content:
            chatMessage.content.trim().length > 0
              ? chatMessage.content.trim()
              : state.filename[0].name,
          sender: localUser.complete_name,
          reciver: correspondant.complete_name,
          senderId: localUser.id,
          reciverId: correspondant.id, //employee_id[0] id
          attachemnts: false,
          attachemntName: '',
        });
      }
      console.log('chatMessage', chatMessage);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            data: {
              correspondant: localUser.id.toString(),
            },
            notification: {
              title: ` رسالة من ${localUser.complete_name}`,
              body: chatMessage.content ? chatMessage.content : '',
              sound: 'default',
            },
          },
          reciverId: correspondant.id.toString(), //employee_id[0] id
        }),
      };

      fetch(`${msgServer}notif_reciver`, requestOptions)
        .then(response => response.json())
        .then(data => {
          dispatch(getCorrespondnatList(localUser.id, accessToken));
        });
      setChatMessage({ content: '', sender: '', reciver: '' });
    };
    if (attachemnts) {
      setState({ ...state, loadingAttachment: true });
      const formBodyPost = new FormData();
      state.arrayData.forEach(async fileItem => {
        formBodyPost.append('files', fileItem);
      });
      console.log('formBody', formBody);
      axios
        .post(
          `${baseUrl}/api/attachments/upload?res_model=chat.server.attachment&res_id=1`,
          formBody,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then(e => {
          console.log('e.data', e.data);
          SuccessCallBack(e.data);
          setState({
            ...state,
            arrayData: [],
            filename: [],
            loadingAttachment: false,
          });
        })
        .catch(err => {
          // console.log('error', err);
        });
    } else {
      SuccessCallBack();
    }
  };

  function formatTime(time) {
    var d = new Date(time),
      hours = d.getHours(),
      mins = d.getMinutes();
    // return d.toLocaleTimeString();
    return (
      hours +
      ':' +
      (mins >= 11 ? mins - 1 : mins != 0 ? '0' + (mins - 1) : '0' + mins)
    );
  }
  const handleMsgLongClick = message => {
    setModal2(false);
    dispatch(deleteMsg(message));
  };
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
            ]).then(stat => {
              if (
                stat['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
              ) {
                dispatch({ type: 'COMMON_LOADER', value: true });
                let mDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
                let options = {
                  fileCache: true,
                  addAndroidDownloads: {
                    useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                    notification: true,
                    path: mDir + '/' + fileName, // this is the path where your downloaded file will live in
                    description: 'Downloading file.',
                    mime: `image/${fileName.split('.')[1]}`,
                    // Make the file scannable  by media scanner
                    mediaScannable: true,
                  },
                };
                config(options)
                  .fetch('GET', baseUrl + '/api/attachment/download/' + id, {
                    Authorization: 'Bearer ' + accessToken,
                  })

                  .then(res => {
                    RNFetchBlob.android.actionViewIntent(
                      res.path(),
                      `image/${fileName.split('.')[1]}`,
                    );
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
            let mDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
            let options = {
              fileCache: true,
              addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: true,
                path: mDir + '/' + fileName, // this is the path where your downloaded file will live in
                description: 'Downloading file.',
                mediaScannable: true,
                mime: `image/${fileName.split('.')[1]}`,
              },
            };

            config(options)
              .fetch('GET', baseUrl + '/api/attachment/download/' + id, {
                Authorization: 'Bearer ' + accessToken,
              })
              .then(res => {
                RNFetchBlob.android.actionViewIntent(
                  res.path(),
                  `image/${fileName.split('.')[1]}`,
                );
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

  const [msgToDelete, setMsgToDelete] = useState({});

  function renderItemRefactor({ item, i }) {
    // console.log('localUser.image', localUser.image);
    if (item.type && item.type === 'day') {
      return <Text style={styles.messageFeedItem}>{item.date}</Text>;
    } else {
      let message = item;
      console.log('message', message);
      const textAlign =
        message.sender === correspondant.complete_name ? 'left' : 'right';
      const color = message.deleted ? 'black' : '#7b9eb8';

      return (message.sender === localUser.complete_name &&
        message.reciver === correspondant.complete_name) ||
        (message.reciver === localUser.complete_name &&
          message.sender === correspondant.complete_name) ? (
        <View>
          <View
            style={
              message.sender === correspondant.complete_name
                ? styles.msgElementIsFromLocalUser
                : styles.msgElementIsToLocalUser
            }
          >
            <TouchableOpacity
              disabled={message.sender !== correspondant.complete_name}
              key={correspondant && correspondant.id}
              onPress={() => {
                props.navigation.navigate('ManagerProfile', {
                  profileData: correspondant,
                });
              }}
            >
              {/* omar */}
              {/* {correspondant.image &&
              correspondant.image !== '' &&
              localUser.image &&
              localUser.image !== '' ? (
                <Image
                  source={{
                    uri:
                      message.sender === correspondant.complete_name
                        ? `data:image/jpeg;base64,${correspondant.image}`
                        : `data:image/jpeg;base64,${localUser.image}`,
                  }}
                  style={styles.employeeImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.employeeImage}
                  resizeMode="cover"
                />
              )} */}

              {message.sender === correspondant.complete_name ? (
                correspondant.image && correspondant.image != '' ? (
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${correspondant.image}`,
                    }}
                    style={styles.employeeImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/user.png')}
                    style={styles.employeeImage}
                    resizeMode="cover"
                  />
                )
              ) : localUser.image && localUser.image != '' ? (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${localUser.image}`,
                  }}
                  style={styles.employeeImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.employeeImage}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
            <TouchableWithoutFeedback
              disabled={
                (message.sender === correspondant.complete_name &&
                  !message.attachemnts) ||
                message.deleted
              }
              onLongPress={() => {
                if (
                  message.sender === localUser.complete_name &&
                  !message.deleted &&
                  !message.attachemntName
                ) {
                  setMsgToDelete(message);
                  setModal2(true);
                }
              }}
            >
              <View
                key={i}
                style={[
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    paddingVertical: message.attachemntName ? 1 : 15,
                  },
                  message.sender === correspondant.complete_name
                    ? styles.recievdTextMessageStyle
                    : styles.sentTextMessageStyle,
                ]}
              >
                {/* image-text   attachment-text  text    */}
                {/* ----------case-----text------*/}
                {message.deleted ? (
                  <Text style={{ color, textAlign, marginTop: 5 }}>
                    هذه الرسالة تم حذفها
                  </Text>
                ) : message.content !== message.attachemntName &&
                  !message.attachemntName ? (
                  <Text style={{ color, textAlign }}>{message.content}</Text>
                ) : null}

                {/*------case----images */}
                {!message.deleted &&
                message.attachemntName &&
                isImage(message.attachemntName) ? (
                  <View>
                    {message.content !== message.attachemntName && (
                      <Text style={{ color, textAlign }}>
                        {message.content}
                      </Text>
                    )}
                    <View style={styles.pressToDeleteContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowImagePreView(
                            `${msgServer}${message.attachemntName}`,
                          );
                          setMessageToPreview(message);
                        }}
                      >
                        <ImageWithLoader
                          onPress={() => {
                            setShowImagePreView(
                              `${msgServer}${message?.attachemntName}`,
                            );
                            setMessageToPreview(message);
                          }}
                          base={message.attachemntId}
                          source={{
                            uri: `${msgServer}${message?.attachemntName}`,
                            priority: FastImage.priority.high,
                          }}
                          style={styles.imagePreview}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {/*------case----files */}
                {!message.deleted &&
                message.attachemntName &&
                !isImage(message.attachemntName) ? (
                  <View>
                    {message.content !== message.attachemntName && (
                      <Text style={{ textAlign, color }}>
                        {message.content}
                      </Text>
                    )}
                    <View style={styles.attachement}>
                      <TouchableOpacity
                        onPress={() => {
                          return props.navigation.navigate('PdfViewer', {
                            uri: `${msgServer}${message.attachemntName}`,
                            name: message.attachemntName,
                            base: message.attachemntId,
                            message,
                          });
                        }}
                      >
                        {/* displayPDF */}
                        <Image
                          source={require('../../assets/images/pdfIcon.png')}
                          style={styles.pdfIcon}
                        />
                        <Text style={styles.attachementName} numberOfLines={1}>
                          {message.attachemntName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                <View style={styles.seenIconAndCreatedAtContainer}>
                  <Text style={styles.createdAt}>
                    {formatTime(message.created_at)}
                  </Text>
                  {message.sender === localUser.complete_name &&
                    message.seen && (
                      <SeenIcon
                        name="checkmark-done"
                        size={20}
                        color={'#007598'}
                      />
                    )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      ) : (
        <View />
      );
    }
  }

  const addFile = async () => {
    if (state.arrayData.length > 2) {
      return setShowMaximumUploadFile(true);
    }
    if (Platform.OS === 'ios') {
      return fnUpload();
    }
    checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
      .then(statuses => {
        if (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'denied') {
          //
        } else if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'blocked'
        ) {
          // console.log('permission denied');
        } else {
          fnUpload();
        }
        if (
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
            RESULTS.UNAVAILABLE &&
          statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] !==
            RESULTS.GRANTED
        ) {
          requestMultiple([
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ]).then(statuses => {
            if (
              statuses['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
            ) {
              fnUpload();
            }
          });
        }
      })
      .catch(e => {
        // console.log('permission denied');
      });
  };
  const fnUpload = async () => {
    try {
      const mFile = await pick();
      if (mFile) {
        let arrayData = [...state.arrayData];
        let filename = [...state.filename];
        arrayData.push(mFile);
        filename.push({ name: mFile.name });
        setState({ ...state, arrayData, filename });
      }
    } catch (err) {
      // console.log('fileErr chat', err);
      throw err;
    }
  };
  const removeFile = name => {
    if (name) {
      let arrayData = [...state.arrayData];
      let filename = [...state.filename];
      let i = filename.indexOf(name);
      if (i > -1) {
        arrayData.splice(i, 1);
        filename.splice(i, 1);
        setState({ ...state, arrayData, filename });
      }
    }
  };
  const DisplayLoader =
    isLoading || !correspondant || !localUser || !chatMesssages;
  return (
    <View style={[AppStyle.page, styles.mainContainer]}>
      <LinearGradient
        colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
        style={styles.linearGradientContainer}
      >
        <NewHeader {...props} fetchMessage back={true} title="محادثات" />

        <View style={styles.chatContainer}>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: -Dimensions.get('window').height * 0.035,
            }}
          >
            <View
              style={{
                paddingRight: 8,
                paddingBottom: 8,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                marginBottom: 10,
                flexDirection: 'row-reverse',
                alignItems: 'center',
              }}
              key={correspondant.id}
            >
              <View style={AppStyle.employeeDetailsContainer}>
                <View>
                  <TouchableOpacity
                    key={correspondant && correspondant.id}
                    onPress={() => {
                      props.navigation.navigate('ManagerProfile', {
                        profileData: correspondant,
                      });
                    }}
                  >
                    {correspondant.image ? (
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${correspondant.image}`,
                        }}
                        style={styles.employeeImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={require('../../assets/images/user.png')}
                        style={styles.employeeImage}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    flexDirection: 'column',
                    direction: 'rtl',
                    alignItems:
                      Platform.OS === 'android' ? 'flex-end' : 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.itemMonshaatText}>
                    {correspondant.sector_id ? correspondant.sector_id[1] : ''}
                  </Text>
                  <Text style={styles.itemMonshaatName}>
                    {correspondant.complete_name}
                  </Text>
                  <Text style={styles.itemMonshaatJob}>
                    {correspondant.job_id && correspondant.job_id !== 'false'
                      ? correspondant.job_id[1]
                      : ''}
                  </Text>
                </View>
              </View>
              {renderMoreOptions()}
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              width: '90%',
              borderRadius: 20,
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
              flex: 1,
              marginBottom: Dimensions.get('window').height * 0.007,
              // height: Dimensions.get('window').height * 0.72,
            }}
          >
            <FlatList
              ListHeaderComponent={() => {
                if (DisplayLoader) {
                  return (
                    <Image
                      source={require('../../assets/images/gif/128.gif')}
                      style={{
                        width: 30,
                        height: 30,
                        marginHorizontal: 160,
                        marginBottom: Dimensions.get('window').height / 1.7,
                        marginTop: 20,
                      }}
                    />
                  );
                }
                return null;
              }}
              contentContainerStyle={styles.ScrollView}
              data={DisplayLoader ? [] : generateItems(chatMesssages)}
              inverted={chatMesssages.length > 0 ? true : false}
              keyExtractor={item =>
                item.id ? item.id.toString() : item.created_at
              }
              renderItem={renderItemRefactor}
              // ListEmptyComponent={() => {
              //   return (
              //     <View>
              //       {!loading ? (
              //         <View style={styles.noMessageContainer}>
              //           <View>
              //             <TouchableOpacity
              //               key={correspondant && correspondant.id}
              //               onPress={() => {
              //                 props.navigation.navigate('Profile', {
              //                   profileData: correspondant,
              //                 });
              //               }}
              //             >
              //               {correspondant.image ? (
              //                 <Image
              //                   source={{
              //                     uri: `data:image/jpeg;base64,${correspondant.image}`,
              //                   }}
              //                   style={[
              //                     styles.employeeImage,
              //                     { marginBottom: 0 },
              //                   ]}
              //                   resizeMode="cover"
              //                 />
              //               ) : (
              //                 <Image
              //                   source={require('../../assets/images/user.png')}
              //                   style={[
              //                     styles.employeeImage,
              //                     { marginBottom: 0 },
              //                   ]}
              //                   resizeMode="cover"
              //                 />
              //               )}
              //             </TouchableOpacity>
              //           </View>

              //           <Text style={styles.itemMonshaatName}>
              //             {correspondant.complete_name}
              //           </Text>
              //           <Text style={styles.itemMonshaatJob}>
              //             {correspondant.job_id &&
              //             correspondant.job_id !== 'false'
              //               ? correspondant.job_id[1]
              //               : ''}
              //           </Text>
              //         </View>
              //       ) : null}
              //     </View>
              //   );
              // }}
            />
            <View
              style={{
                backgroundColor: '#fff',
                width: '93%',
                borderRadius: 8,
                flexDirection: 'row',
                alignSelf: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                // overflow: 'hidden',
                marginBottom:
                  Platform.OS === 'ios'
                    ? isKeyboardVisible
                      ? heightPercentageToDP(0.5)
                      : Dimensions.get('screen').height * 0.02
                    : isKeyboardVisible
                    ? heightPercentageToDP(1)
                    : Dimensions.get('window').height * 0.01,
              }}
            >
              <View
                style={{
                  flex: 9,
                  marginBottom: 5,
                }}
              >
                <View>
                  {state.filename.length
                    ? state.filename.map((item, index) => (
                        <View
                          style={{
                            flexDirection: 'row-reverse',
                            marginBottom: 10,
                          }}
                          key={index}
                        >
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              backgroundColor: '#efefef',
                              alignSelf: 'stretch',
                              flexGrow: 1,
                              borderRadius: 6,
                            }}
                          >
                            <View style={{ flexGrow: 1, flex: 1 }}>
                              <Text
                                style={{
                                  padding: 10,
                                  width: '100%',
                                  overflow: 'hidden',
                                  textAlign: 'right',
                                  fontFamily: '29LTAzer-Regular',
                                }}
                                numberOfLines={1}
                              >
                                {item.name}
                              </Text>
                            </View>
                            {state.loadingAttachment ? (
                              <ActivityIndicator
                                style={{ marginHorizontal: 5 }}
                                size="small"
                                color="#007598"
                              />
                            ) : (
                              <IconFe
                                name="paperclip"
                                size={20}
                                color={'#007598'}
                                style={{
                                  marginRight: 8,
                                  padding: 10,
                                }}
                              />
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              removeFile(item);
                            }}
                          >
                            <IconFe
                              name="x"
                              size={20}
                              color={'red'}
                              style={{
                                marginRight: 8,
                                padding: 10,
                                backgroundColor: '#efefef',
                                borderRadius: 6,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                    : null}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      height: 50,
                      padding: 5,
                      borderColor: '#0474c0',
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 5,
                      justifyContent: 'center',
                      marginTop: '5%',
                    }}
                  >
                    <TouchableOpacity onPress={addFile}>
                      <IconFe name="paperclip" size={20} color={'#007598'} />
                    </TouchableOpacity>
                    <TextInput
                      style={[
                        {
                          flex: 1,
                          marginHorizontal: 5,
                          textAlign: 'right',
                          fontFamily: '29LTAzer-Regular',
                        },
                      ]}
                      placeholder="اكتب هنا"
                      placeholderTextColor="#414141"
                      autoCorrect={false}
                      multiline={true}
                      value={chatMessage.content}
                      expanded={true}
                      onChangeText={text =>
                        setChatMessage({ ...chatMessage, content: text })
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={{ marginTop: 10 }}
                    disabled={state.loadingAttachment}
                    onPress={submitChatMessage}
                  >
                    <IconFe
                      name="send"
                      style={{ top: 2, right: 2 }}
                      size={30}
                      color={'#007598'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {Platform.OS === 'ios' && <KeyboardSpacer topSpacing={5} />}
          </View>
        </View>

        <CommonPopup
          visible={modal2}
          text={'    هل تريد حذف هذه الرسالة؟'}
          text2={'مسح'}
          onClose={() => {
            if (!modal2) {
              return;
            }
            handleMsgLongClick(msgToDelete);
          }}
          onCancel={() => {
            setModal2(false);
          }}
        />
        <Modal3
          isVisible={showUoloadError}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.notificationsTitleContainer}>
                <Text style={styles.notificationsTitleText}>
                  خطأ في الارفاق
                </Text>
                <Image
                  source={require('../../assets/images/logo3.png')}
                  style={styles.notificationImage}
                />
              </View>
              <View style={styles.hr} />
              <Text style={styles.modalText}>مسموح فقط بالصور وملفات pdf</Text>
              <View style={styles.notificationsButtonsContainer}>
                <TouchableHighlight
                  style={styles.notificationsButtonDisplay}
                  onPress={() => setShowUploadError(false)}
                >
                  <Text style={styles.notificationsTextDisplay}>حسناً</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal3>
        <Modal3
          isVisible={showMaximumUpload}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.notificationsTitleContainer}>
                <Text style={styles.notificationsTitleText}>
                  خطأ في الارفاق
                </Text>
                <Image
                  source={require('../../assets/images/logo3.png')}
                  style={styles.notificationImage}
                />
              </View>
              <View style={styles.hr} />
              <Text
                style={styles.modalText}
              >{`حجم الصورة تجاوز الحجم المسموح به`}</Text>
              <View style={styles.notificationsButtonsContainer}>
                <TouchableHighlight
                  style={styles.notificationsButtonDisplay}
                  onPress={() => setShowMaximumUpload(false)}
                >
                  <Text style={styles.notificationsTextDisplay}>حسناً</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal3>
        <Modal3
          isVisible={showMaximumUploadFile}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.notificationsTitleContainer}>
                <Text style={styles.notificationsTitleText}>
                  خطأ في الارفاق
                </Text>
                <Image
                  source={require('../../assets/images/logo3.png')}
                  style={styles.notificationImage}
                />
              </View>
              <View style={styles.hr} />
              <Text
                style={styles.modalText}
              >{`الحد الاقصي للارفاق ٣ ملفات`}</Text>
              <View style={styles.notificationsButtonsContainer}>
                <TouchableHighlight
                  style={styles.notificationsButtonDisplay}
                  onPress={() => setShowMaximumUploadFile(false)}
                >
                  <Text style={styles.notificationsTextDisplay}>حسناً</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal3>
        <ImageModalPrveView
          show={showImagePreView !== null}
          handleDownload={base => {
            dowloadAttachmentBaseUpdated(
              messageToPreview.attachemntName,
              messageToPreview.attachemntId,
            );
          }}
          onClose={() => {
            setShowImagePreView(null);
            setMessageToPreview(null);
          }}
          handleDelet={() => {
            dispatch(deleteMsg(messageToPreview));
          }}
          uri={showImagePreView}
          base={messageToPreview?.attachemntId}
        />
      </LinearGradient>
    </View>
  );
};

const textMessageStyle = {
  marginHorizontal: 10,
  borderWidth: 0.5,
  borderRadius: 20,
  borderColor: 'white',
  maxWidth: Dimensions.get('window').width / 2,
  marginBottom: 10,
  paddingHorizontal: 15,
};
const styles = StyleSheet.create({
  moreOptions: {
    marginTop: 100,
    flexDirection: 'row-reverse',
    flex: 1,
    flexGrow: 0.55,
    zIndex: 50000,
  },

  icon: {
    width: 20,
    height: 20,
  },
  iconDisabled: {
    width: 20,
    height: 20,
    tintColor: 'grey',
  },
  IconContainer: {
    backgroundColor: 'white',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    margin: 5,
  },

  employeeDetailsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    flex: 1,
    flexGrow: 1,
    elevation: 10,
    zIndex: 50000,
  },
  pdfIcon: {
    alignSelf: 'center',
    width: wp('14%'),
    height: hp('10%'),
  },
  attachementName: {
    fontFamily: '29LTAzer-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  chatContainer: {
    flex: 1,
    flexGrow: 1,
  },
  linearGradientContainer: { flex: 1 },
  recievdTextMessageStyle: {
    ...textMessageStyle,
    backgroundColor: '#e0f7ff',
    alignSelf: 'flex-start',
  },
  sentTextMessageStyle: {
    ...textMessageStyle,
    backgroundColor: '#f5fdff',
    alignSelf: 'flex-end',
  },
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#F0F1F2',
  },
  createdAt: { marginHorizontal: 3 },
  seenIconAndCreatedAtContainer: {
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  dowloadIcon: { marginHorizontal: 10 },

  attachement: {
    flexDirection: 'row-reverse',
    alignSelf: 'center',
  },
  pressToshowImage: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'center',
  },
  msgElementIsFromLocalUser: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  msgElementIsToLocalUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },

  messageFeedItem: {
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 0,
    fontFamily: '29LTAzer-Regular',
  },
  imagePreview: {
    width: 100,
    height: 100,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  SafeAreaView: {
    flex: 1,
    top: 100,
    paddingBottom: 5,
  },
  TextInput: {
    backgroundColor: 'white',
    textAlign: 'right',
    fontFamily: '29LTAzer-Regular',
  },
  noMessageContainer: {
    marginTop: Dimensions.get('window').height * 0.52,
    alignItems: 'center',
  },
  TextInputContainer: {
    borderWidth: 1,
    borderColor: '#0474c0',
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 10,
    borderRadius: 10,
    height: 'auto',
    minHeight: 45,
    paddingHorizontal: 10,
  },
  ScrollView: {
    height: 'auto',
    paddingBottom: 100,
    marginTop: 20,
  },
  message: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 50,
    marginLeft: 50,
  },
  type: {
    color: '#FF0000',
  },
  chatText: {
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    textAlign: 'left',
  },
  itemMonshaatText: {
    color: '#18ab91',
    fontSize: 10,
    paddingVertical: 3,
    fontFamily: '29LTAzer-Regular',
  },
  itemMonshaatName: {
    color: '#20547a',
    fontSize: 16,
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
  },
  itemMonshaatJob: {
    color: '#7b9eb8',
    fontSize: 12,
    fontFamily: '29LTAzer-Regular',
    paddingVertical: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingTop: 10,
    width: '80%',
    alignItems: 'flex-end',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  modalTextt: {
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 18,
    color: '#424242',
  },
  hr: {
    height: 0.8,
    width: '112%',
    alignSelf: 'center',
    backgroundColor: '#dbdbdb',
    marginBottom: 20,
  },
  notificationsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: -10,
  },
  notificationImage: {
    width: 23,
    height: 23,
    borderRadius: 5,
    marginLeft: 10,
  },
  notificationsTitleText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#424242',
  },
  notificationsButtonsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  notificationsButtonDisplay: {
    backgroundColor: '#11708e',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  notificationsButtonCancel: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11708e',
  },
  notificationsTextDisplay: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#fff',
  },
  notificationsTextCancel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: '29LTAzer-Regular',
    fontSize: 16,
    color: '#11708e',
  },
  hover: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: 'white',
    minHeight: 30,
    width: 120,
    paddingVertical: 2,
    top: 5,
    position: 'absolute',
    zIndex: 100000,
    marginRight: wp('50%'),
    borderRadius: 10,
  },
  label: {
    fontWeight: '500',
    textAlign: 'right',
    marginVertical: 3,
    paddingRight: 10,
    fontFamily: '29LTAzer-Regular',
    fontSize: 14,
  },
  dotsIcStyle: {
    position: 'absolute',
    right: 0,
  },
  employeeImage: {
    borderRadius: 999,
    borderColor: '#eaeaea',
    borderWidth: 2,
    width: 54,
    height: 54,
    marginBottom: 20,
  },
});
export default MessagesFeed;
