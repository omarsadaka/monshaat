import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import * as loadingAction from '../redux/action/loadingAction';
import { baseUrl } from '../services';
import { EncryptUrl } from '../services/EncryptUrl';

const mimeType = extension => {
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
export async function openDocumentService(attachmentId, dispatch, accessToken) {
  var file_name = '';
  checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
    async statuses => {
      if (
        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ===
          RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        dispatch(loadingAction.commonLoader(true));
        let secretUrl = await EncryptUrl(
          baseUrl +
            `/api/call/all.requests/get_attachment_details?kwargs={"attachment_id": ${attachmentId}}`,
        );
        const attachmentInfo = await fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then(response => response.json())
          .then(responseData => {
            file_name = responseData[0].name;
          });

        if (Array.isArray(attachmentInfo) && !attachmentInfo.length) {
          dispatch(loadingAction.commonLoader(false));
          showMessage({
            style: { alignItems: 'flex-end' },
            type: 'danger',
            message: 'غير قادر على تحميل',
          });
          return;
        }
        if (Platform.OS === 'ios') {
          // const { name } = attachmentInfo[0];
          const name = file_name;
          const { dirs } = RNFetchBlob.fs;
          const dirToSave =
            Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
          const configfb = {
            fileCache: false,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: `${name
              .split('.')
              .slice(0, -1)
              .join('.')}`,
            path: `${dirToSave}/${name}`,
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
            .fetch(
              'GET',
              baseUrl + '/api/attachment/download/' + attachmentId,
              {
                Authorization: 'Bearer ' + accessToken,
              },
            )
            .then(res => {
              if (Platform.OS === 'ios') {
                RNFetchBlob.fs.writeFile(res.path(), res.data, 'base64');
                setTimeout(async () => {
                  RNFetchBlob.ios.previewDocument(res.path());
                }, 500);
              }
              dispatch(loadingAction.commonLoader(false));
              showMessage({
                style: { alignItems: 'flex-end' },
                type: 'success',
                message: 'اكتمل تنزيل المرفق.',
              });
            })
            .catch(e => {
              // console.log('The file saved to ERROR', e.message);
            });
        } else {
          // const { name } = attachmentInfo[0];
          const name = file_name;
          const extension = name.split('.')[1];
          const { config, fs, android } = RNFetchBlob;
          let mDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
          let options = {
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
              notification: true,
              title: name,
              mediaScannable: true,
              path: `${mDir}/monshaat/${name}`,
              description: 'Downloading file.',
              mime: mimeType(extension),
            },
          };
          await config(options)
            .fetch(
              'GET',
              baseUrl + '/api/attachment/download/' + attachmentId,
              {
                Authorization: 'Bearer ' + accessToken,
              },
            )
            .then(res => {
              android.actionViewIntent(
                `${mDir}/monshaat/${name}`,
                mimeType(extension),
              );

              dispatch(loadingAction.commonLoader(false));
              showMessage({
                style: { alignItems: 'flex-end' },
                type: 'success',
                message: 'اكتمل تنزيل المرفق. تحقق من مجلد التنزيل.',
              });
            })
            .catch(err => {
              // console.log('attachmentInfo err', err);
              dispatch(loadingAction.commonLoader(false));
              showMessage({
                style: { alignItems: 'flex-end' },
                type: 'danger',
                message: 'غير قادر على تحميل',
              });
            });
        }
      } else {
        showMessage({
          style: { alignItems: 'flex-end' },
          type: 'danger',
          message: 'يرجى تقديم إذن الوصول من إعدادات التطبيق بجهازك',
        });
      }
    },
  );
}
