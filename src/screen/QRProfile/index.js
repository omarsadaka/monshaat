import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as rnfs from 'react-native-fs';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import vCard from 'react-native-vcards';
import Icon from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';
let profile = {};
const QRProfile = props => {
  const [state, setState] = useState({
    profileData: {},
    imageLoading: true,
  });
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.qrProfile) {
        setState({
          ...state,
          profileData: props.route.params.qrProfile,
        });
        profile = props.route.params.qrProfile;
      } else {
      }
    });
    return unsubscribe;
  }, [props.navigation]);

  function shareVcard() {
    let profileData = state.profileData;
    let deptDet = profileData.department_id
      ? profileData.department_id[1]
      : '-/-/-';
    let deptDetArr = deptDet.split('/');
    profileData.management = deptDetArr[1];
    profileData.dept = deptDetArr[2];
    profileData.sector = deptDetArr[0];
    if (profileData) {
      let contact = vCard();
      //set properties
      contact.formattedName = profileData.complete_name;
      contact.workPhone = profileData.work_phone
        ? '+96611834' + profileData.work_phone
        : '';
      contact.cellPhone = profileData.mobile_phone
        ? profileData.mobile_phone
        : '';
      contact.workEmail = profileData.work_email ? profileData.work_email : '';
      contact.title =
        profileData.job_id && profileData.job_id.length
          ? profileData.job_id[1]
          : '';
      contact['jobTitle'] = profileData.job_id[1];
      contact['department'] = profileData.dept;
      contact['management'] = profileData.management;
      const documentPath = rnfs.DocumentDirectoryPath;
      contact
        .saveToFile(documentPath + '/' + profileData.complete_name + '.vcf')
        .then(res => {
          Share.open({
            title: 'Save contact details',
            url:
              'file://' +
              documentPath +
              '/' +
              profileData.complete_name +
              '.vcf',
            type: 'text/x-vcalendar',
            subject: profileData.complete_name,
          });
        })
        .catch(err => {});
    }
  }
  let profileData = state.profileData;

  let postition =
    profileData.job_id && profileData.job_id.length
      ? profileData.job_id[1]
      : null;
  let qrCode =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    'N:' +
    profileData.family_name +
    ';' +
    profileData.name +
    '\n' +
    'FN:' +
    profileData.name +
    ' ' +
    profileData.family_name +
    '\n' +
    'ORG:منشآت\n' +
    'TITLE:' +
    postition +
    '\n' +
    'ADR:;;;;;;Saudi Arabia\n' +
    'TEL;WORK;VOICE:+96611834' +
    profileData.work_phone +
    '\n' +
    'TEL;CELL:' +
    profileData.mobile_phone +
    '\n' +
    'TEL;FAX:\n' +
    'EMAIL;WORK;INTERNET:' +
    profileData.work_email +
    '\n' +
    'URL:\n' +
    'END:VCARD\n';
  let qrCodeEncoded = encodeURIComponent(qrCode);
  let qrCodeImage =
    'https://chart.googleapis.com/chart?cht=qr&chl=' +
    qrCodeEncoded +
    '&chs=250x250&choe=UTF-8&chld=L|2';
  return (
    <View style={{ flex: 1, backgroundColor: '#f0f1f2' }}>
      <View>
        <Header {...props} back={false} cross={true} />
      </View>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <View style={styles.personalDataMainContainer}>
            <View style={styles.personalDataInnerContainer} />
            <View style={styles.profileImageContainer}>
              {profile.image ? (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${profile.image}`,
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                  }}
                  resizeMode="cover"
                  onError={() => setState({ ...state, imageLoading: false })}
                />
              ) : (
                <Image
                  source={require('../../assets/images/user.png')}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                  }}
                  resizeMode="cover"
                />
              )}
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor:
                    profile.emp_state === 'working' ? 'green' : 'red',
                  marginTop: -5,
                }}
              />
            </View>

            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <View>
                <Text>الاسم : {profile.complete_name}</Text>
              </View>
              <View style={{ paddingVertical: hp('0.5%') }}>
                <Text>
                  المسمى الوظيفي :{' '}
                  {profile.job_id && profile.job_id.length
                    ? profile.job_id[1]
                    : null}{' '}
                </Text>
              </View>
              <View style={{ paddingTop: hp('2%'), paddingBottom: hp('8%') }}>
                <Image
                  source={{
                    uri: qrCodeImage,
                  }}
                  style={{ width: 250, height: 250 }}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View>
              <TouchableOpacity style={styles.actionBtn} onPress={shareVcard}>
                <Text style={{ color: '#007598' }}>مشاركة الكود الخاص بي</Text>
                <Icon name="upload" size={25} color="#007598" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginVertical: hp('2%') }}>
            <View>
              <TouchableOpacity style={styles.actionBtn} onPress={shareVcard}>
                <Text style={{ color: '#007598' }}>الحفظ في مكتبة الصور</Text>
                <Icon name="download" size={25} color="#007598" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRProfile;

const styles = StyleSheet.create({
  headingTextContainer: {
    alignItems: 'flex-end',
    paddingVertical: hp('2%'),
  },
  headingText: {
    borderRadius: 25,
    paddingHorizontal: wp('2%'),
    backgroundColor: '#007598',
    paddingVertical: hp('1%'),
  },
  personalDataMainContainer: {
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: hp('2%'),
  },
  personalDataInnerContainer: {
    height: 50,
    backgroundColor: '#007598',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImageContainer: {
    width: '60%',
    alignItems: 'center',
    position: 'absolute',
    left: '20%',
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: hp('1%'),
    borderRadius: 20,
    paddingHorizontal: wp('2%'),
  },
});
