import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IconFe from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { AppStyle } from '../../assets/style/AppStyle';
import CommonDropdown from '../../components/CommonDropdown';
import CommonFormButton from '../../components/CommonFormButton';
import CommonPopup from '../../components/CommonPopup';
import CommonTextInput from '../../components/CommonTextInput';
import Loader from '../../components/loader';
import NewHeader from '../../components/NewHeader';
import OrderHeader from '../../components/OrderHeader';
import OrderViewAttatchment from '../../components/OrderViewAttatchment';
import OrderViewItem from '../../components/OrderViewItem';
import * as loadingAction from '../../redux/action/loadingAction';
import * as technicalAction from '../../redux/action/technicalAction';
import { baseUrl, getStatus } from '../../services';
import { pick } from '../../services/AttachmentPicker';
import { AnnalyticsFirebase } from '../../utils/analyticsFirebase';
import { ClearPushNotification } from '../../utils/clearPushNotification';

let viewType = 'new';
let item = null;
const TechnicalRequestNew = props => {
  const [state, setState] = useState({
    type: 'technical',
    subType: 'new',
  });
  const editableData = useSelector(
    state => state.HomeMyRequestReducer.editable,
  );
  return (
    <LinearGradient
      colors={['#d5e6ed', '#ffffff', '#d5e6ed']}
      style={{ flex: 1 }}
    >
      <NewHeader {...props} back={true} title="الطلبات" />
      <View
        style={[
          AppStyle.cardContainer,
          { backgroundColor: !editableData ? '#F5F5F5' : '#FFF' },
        ]}
      >
        <KeyboardAwareScrollView>
          <View style={{ alignItems: 'center', paddingBottom: 32 }}>
            <OrderHeader
              {...props}
              title="مركز الطلبات والدعم"
              icon={require('../../assets/images/da3m.png')}
            />
            <View style={{ width: '90%' }}>
              <View style={styles.heading}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: 16, alignSelf: 'flex-end', marginBottom: 5 },
                  ]}
                >
                  الرجاء اختيار نوع التذكرة
                </Text>
              </View>

              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={[
                    styles.mandateTypebtn,
                    {
                      backgroundColor:
                        state.type === 'technical' ? '#007297' : '#90909080',
                    },
                  ]}
                  onPress={() => {
                    editableData
                      ? setState({
                          ...state,
                          type: 'technical',
                        })
                      : null;
                  }}
                >
                  <Text style={styles.mandateTypeText}>تقنية</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.mandateTypebtn,
                    {
                      backgroundColor:
                        state.type === 'nonTechnical' ? '#007297' : '#90909080',
                    },
                  ]}
                  onPress={() => {
                    if (editableData) {
                      setState({
                        ...state,
                        type: 'nonTechnical',
                      });
                    }
                  }}
                >
                  <Text style={styles.mandateTypeText}>غير تقنية</Text>
                </TouchableOpacity>
              </View>
              {state.type === 'technical' && (
                <>
                  <View style={styles.heading}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 16,
                          alignSelf: 'flex-end',
                          marginBottom: 5,
                        },
                      ]}
                    >
                      الرجاء اختيار نوع التذكرة التقنية
                    </Text>
                  </View>

                  <View style={styles.rowContainer}>
                    <TouchableOpacity
                      style={[
                        styles.mandateTypebtn,
                        {
                          backgroundColor:
                            state.subType === 'new' ? '#007297' : '#90909080',
                        },
                      ]}
                      onPress={() => {
                        editableData
                          ? setState({
                              ...state,
                              subType: 'new',
                            })
                          : null;
                      }}
                    >
                      <Text style={styles.mandateTypeText}>ابلاغ عن مشكلة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.mandateTypebtn,
                        {
                          backgroundColor:
                            state.subType === 'change'
                              ? '#007297'
                              : '#90909080',
                        },
                      ]}
                      onPress={() => {
                        if (editableData) {
                          setState({
                            ...state,
                            subType: 'change',
                          });
                        }
                      }}
                    >
                      <Text style={styles.mandateTypeText}>طلب خدمة</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            <View style={{ width: '60%' }}>
              {editableData ? (
                <CommonFormButton
                  {...props}
                  buttonText="اختيار"
                  onPress={() => {
                    props.navigation.navigate(
                      state.type == 'nonTechnical'
                        ? 'TechnicalRequestOld'
                        : state.subType == 'change'
                        ? 'TechnicalRequestService'
                        : 'TechnicalRequest',
                      {
                        subType: state.subType,
                      },
                    );
                  }}
                />
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </LinearGradient>
  );
};

export default TechnicalRequestNew;

const styles = StyleSheet.create({
  heading: {
    alignItems: 'flex-end',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
    paddingRight: wp('4%'),
  },

  input: {
    // height: "100%",
    textAlign: 'right',
    paddingRight: wp('2%'),
    fontFamily: '29LTAzer-Regular',
    color: '#20547a',
    fontSize: hp('1.5%'),
    paddingVertical: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'right',
    marginTop: hp('1%'),
    marginRight: wp('4%'),
    fontFamily: '29LTAzer-Regular',
  },
  inputContainer: {
    backgroundColor: 'white',
    height: 'auto',
    minHeight: 45,
    borderRadius: 6,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#20547a',
    fontFamily: '29LTAzer-Regular',
  },
  mandateTypebtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: '#90909080',
    borderRadius: 6,
    width: '49%',
  },
  mandateTypeText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: '29LTAzer-Regular',
  },
  rowContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
