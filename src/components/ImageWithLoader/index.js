import axios from 'axios';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { baseUrl } from '../../services/index';

export default function App({ base, source: { uri }, onPress, onLongPress }) {
  const [height, setHeight] = useState(100);
  const [showLoader, stSHowLoader] = useState(true);
  const [error, setError] = useState(false);
  const [url, setUrl] = useState(null);
  const accessToken = useSelector(state => state.LoginReducer.accessToken);

  const FixedWidth = 100;
  const styles = StyleSheet.create({
    wrapper: {
      width: FixedWidth,
      backgroundColor: 'white',
    },
    loader: {
      width: 20,
      height: 20,
      left: '45%',
      top: '40%',
    },
  });
  React.useEffect(() => {
    if (!base) {
      return;
    }
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

          setHeight(rationHeight);
        });
        setUrl(`data:image/png;base64,${e.data[0].datas}`);
        stSHowLoader(false);
      })
      .catch(err => {
        setError(true);
        console.log('err');
        console.log('error', err);
      });
  }, [base]);

  if (error || !base) {
    return <Text>error display image</Text>;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => {}}
      style={styles.wrapper}
    >
      {showLoader && (
        <Image
          source={require('../../assets/images/gif/128.gif')}
          style={styles.loader}
        />
      )}
      <Image
        style={{ width: FixedWidth, height }}
        source={{
          uri: url,
        }}
        resizeMode="stretch"
      />
    </TouchableOpacity>
  );
}
