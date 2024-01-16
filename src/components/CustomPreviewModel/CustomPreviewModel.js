import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import PDFView from 'react-native-view-pdf';
import Modal from 'react-native-modal';
import LoadingView from './LoadingView';
import { Icon } from 'react-native-elements';

const CustomPreviewModel = ({ isVesible, onClosePress, data, type }) => {
  const [loadinng, setLoading] = useState(false);
  const renderImage = () => {
    return (
      <View style={styles.imageContainner}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${data}` }}
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          resizeMode="contain"
        />
        {loadinng && <LoadingView />}
      </View>
    );
  };

  const renderPdf = () => {
    return (
      <View
        style={{
          width: '95%',
          height: Dimensions.get('window').height * 0.83,
          marginBottom: 5,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
        >
          <PDFView
            fadeInDuration={250.0}
            style={styles.pdf}
            resource={data}
            resourceType={'base64'}
            onLoad={() => console.log(`PDF rendered from base64`)}
            // onLoadStart={() => setLoading(true)}
            // onLoadEnd={() => setLoading(false)}
            onError={error => console.log('Cannot render PDF', error)}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`current page: ${page}`);
            }}
          />
          {/* {loadinng && <LoadingView />} */}
        </ScrollView>
      </View>
    );
  };
  return (
    <Modal
      isVisible={isVesible}
      onBackdropPress={onClosePress}
      // swipeDirection="left"
    >
      <View style={styles.modal}>
        <View
          style={{
            width: '95%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            flexDirection: 'row',
          }}
        >
          <Icon
            name="x-circle"
            type="feather"
            size={22}
            color="red"
            onPress={onClosePress}
          />
          {/* {isContractOrder ? (
            <Icon
              name="download"
              type="feather"
              size={22}
              color="green"
              onPress={onDownloadPress}
            />
          ) : null} */}
        </View>
        {type == 'png' || type == 'jpg' || type == 'jpeg' ? (
          renderImage()
        ) : type == 'pdf' ? (
          renderPdf()
        ) : (
          <Text style={styles.text}>
            غير قادر على فتح هذا الملف يدعم فقط الصور وملفات ال pdf
          </Text>
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowOpacity: 0.3,
    borderRadius: 10,
  },
  imageContainner: {
    width: '100%',
    alignItems: 'center',
  },
  pdf: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '97%',
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default CustomPreviewModel;
