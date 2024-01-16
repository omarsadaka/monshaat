import { ActionSheetIOS, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const captions = {
  image: 'صورة',
  document: 'ملف',
  cancel: 'إلغاء',
  title: 'اختر نوع المرفق',
};
export const pick = () => {
  if (Platform.OS === 'ios') {
    return _pickIOS();
  }

  return new Promise((resolve, reject) => {
    return _pickDocument(resolve, reject);
  });
};

export const _pickIOS = () => {
  return new Promise((resolve, reject) => {
    const { image, document, cancel, title } = captions;
    const options = [image, document, cancel];
    const handlers = [_pickImage, _pickDocument, _pickClosed];
    const cancelButtonIndex = options.indexOf(cancel);

    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex, title },
      buttonIndex => {
        handlers[buttonIndex](resolve, reject);
      },
    );
  });
};

export const _pickImage = (resolve, reject) => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.3,
      // maxHeight: 200,
      // maxWidth: 200,
    },
    response => {
      if (response.didCancel) {
        reject(new Error('Action cancelled!'));
      } else {
        response = renameKey(response, 'fileName', 'name');
        response = renameKey(response, 'fileSize', 'size');
        resolve(response);
      }
    },
  );
};

export const _pickDocument = async (resolve, reject) => {
  var data;
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    resolve(result);
  } catch {
    reject(new Error('Action cancelled!'));
  }
};

export const _pickClosed = (_, reject) => {
  reject(new Error('Action cancelled!'));
};

export const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);

  const targetKey = clonedObj[key];

  delete clonedObj[key];

  clonedObj[newKey] = targetKey;

  return clonedObj;
};
const clone = obj => Object.assign({}, obj);
