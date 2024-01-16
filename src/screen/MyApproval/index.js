import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import * as homeMyRequestActions from '../../redux/action/homeMyRequestAction';

const MyApprovalList = props => {
  const dispatch = useDispatch();
  const handleApprovalRequest = item => {
    let navigation = props.navigation;
    dispatch(homeMyRequestActions.EditableorNot(false));
    if (props.menuTab === 'Vacation') {
      navigation.navigate('NewLeaveRequest', {
        comeFrom: 'MyRequest',
        item: item,
      });
    } else if (props.menuTab === 'Mandate') {
      navigation.navigate('MandateRequest', {
        item: item,
      });
    } else if (props.menuTab === 'Leave') {
      navigation.navigate('LeaveRequest', {
        item: item,
      });
    } else if (props.menuTab === 'TechnicalRequest') {
      navigation.navigate('TechnicalRequest', { item: item });
    } else if (props.menuTab === 'RemoteWork') {
      navigation.navigate('RemoteRequest', {
        item: item,
      });
    } else if (props.menuTab === 'Purchase') {
      navigation.navigate('NewPurchaseRequest', {
        item: item,
      });
    } else if (props.menuTab === 'Training') {
      navigation.navigate('TrainingRequest', {
        item: item,
      });
    }
  };

  const renderRequestList = item => {
    let statusText = '';
    switch (item.state) {
      case 'draft': {
        statusText = 'طلب';
        break;
      }
      case 'audit': {
        statusText = 'المدير المباشر';
        break;
      }
      case 'sm': {
        statusText = "طمدير القطاع'لب";
        break;
      }
      case 'humain': {
        statusText = "عمليات الموارد البشرية'";
        break;
      }
      case 'gm_humain': {
        statusText = 'دير عام الموارد البشرية';
        break;
      }
      case 'vp_hr_master': {
        statusText = 'نائب المحافظ للخدمات المشتركة';
        break;
      }
      case 'hr_master': {
        statusText = 'المحافظ';
        break;
      }
      case 'confirm': {
        statusText = 'اعتمد';
        break;
      }
      case 'done_ticket': {
        statusText = 'معتمد و تم حجز التذكرة';
        break;
      }
      case 'pending': {
        statusText = 'تحت اإلجراء';
        break;
      }
      case 'done': {
        statusText = 'معتمد و تم امر الصرف';
        break;
      }
      case 'finish': {
        statusText = 'منتهي';
        break;
      }
      case 'cancelled': {
        statusText = 'ملغى';
        break;
      }
      case 'Closed Completed':
        statusText = 'مغلقة كاملة';
        break;
      case 'Closed In Completed':
        statusText = 'مغلقة غير مكتملة';
        break;
      case 'cutoff': {
        statusText = 'مقطوع';
        break;
      }
      case 'refuse': {
        statusText = 'مرفوض';
        break;
      }
      case 'new': {
        statusText = 'طلب';
        break;
      }
      case 'dm': {
        statusText = 'المدير المباشر';
        break;
      }
      case 'hrm': {
        statusText = 'عمليات الموارد البشرية';
        break;
      }
      case 'refuse': {
        statusText = 'مرفوض';
        break;
      }
      case 'done': {
        statusText = 'اعتمد';
        break;
      }
      case 'cancel': {
        statusText = 'ملغى';
        break;
      }
      case 'management_strategy': {
        statusText = 'مشرف القطاع في ادارة المشاريع';
        break;
      }
      case 'dmanagement_strategy_mgr': {
        statusText = 'مدير مكتب ادارة المشاريع';
        break;
      }
      case 'financial_audit': {
        statusText = 'مدقق مالي';
        break;
      }
      case 'financial_department': {
        statusText = 'ادارة المالية';
        break;
      }
      case 'authority_owner': {
        statusText = 'صاحب الصالحية';
        break;
      }
      case 'contract_procurement': {
        statusText = 'ادارة العقود و المشتريات';
        break;
      }
      case 'waiting': {
        statusText = 'طلب توضيح';
        break;
      }
      case 'new': {
        statusText = 'طلب';
        break;
      }
      case 'gm_humain': {
        statusText = 'مدير عام الموارد البشرية';
        break;
      }
      case 'candidate': {
        statusText = 'الترشح';
        break;
      }
      case 'cutoff': {
        statusText = 'مقطوع';
        break;
      }
      case 'validate1': {
        statusText = 'Second Approval';
        break;
      }
      case 'validate': {
        statusText = 'Approved';
        break;
      }
      case 'working': {
        statusText = 'على رأس العمل';
        break;
      }
      case 'suspended': {
        statusText = 'مكفوف اليد';
        break;
      }
      case 'outside': {
        statusText = 'مكلف خارجي';
        break;
      }
      case 'terminated': {
        statusText = 'مطوي قيده';
        break;
      }
      case 'Requested': {
        statusText = 'مطلوب';
        break;
      }
      default: {
        statusText = item.state;
        break;
      }
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          marginVertical: 8,
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderRadius: 6,

          alignItems: 'center',
        }}
      >
        {props.menuTab !== 'All' ? (
          <TouchableOpacity
            style={{ width: '30%', alignItems: 'center' }}
            onPress={() => handleApprovalRequest(item)}
          >
            <View
              style={{
                width: '80%',
                backgroundColor:
                  item.state === 'accepted'
                    ? '#A5D6A7'
                    : item.state === 'refuse'
                    ? '#EF9A9A'
                    : '#FFE082',
                borderRadius: 15,
                alignItems: 'center',
                paddingVertical: hp('0.3%'),
              }}
            >
              <Text
                style={{
                  color:
                    item.state === 'accepted'
                      ? 'white'
                      : item.state === 'refuse'
                      ? 'white'
                      : 'black',
                  paddingHorizontal: 3,
                }}
                numberOfLines={1}
              >
                {props.menuTab === 'TechnicalRequest'
                  ? item && item.stage_id && item.stage_id.length
                    ? item.stage_id[1]
                    : item.stage_id
                  : statusText}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ width: '30%', alignItems: 'center' }}
          ></TouchableOpacity>
        )}
        <View
          style={{ width: '70%', justifyContent: 'center', paddingRight: 10 }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: 'right',
              paddingVertical: 5,
              fontFamily: '29LTAzer-Regular',
            }}
            numberOfLines={1}
          >
            {item.id}
          </Text>
          <Text
            numberOfLines={1}
            style={{ textAlign: 'right', fontFamily: '29LTAzer-Regular' }}
          >
            {props.menuTab === 'TechnicalRequest' ||
            props.menuTab === 'RemoteWork' ||
            props.menuTab === 'Training'
              ? item.name
              : props.menuTab === 'Leave'
              ? item.employee_id
              : props.menuTab === 'Mandate'
              ? item.task_name
              : props.menuTab === 'Purchase'
              ? item.description
              : props.menuTab === 'Vacation' && props.menuCat === 'approval'
              ? item.holiday_status_id
                ? item.holiday_status_id[1]
                : '-'
              : item.name}
          </Text>
          <View>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'right',
                color: 'gray',
                paddingVertical: 5,
                fontFamily: '29LTAzer-Regular',
              }}
              numberOfLines={1}
            >
              {props.menuTab === 'Vacation' ||
              props.menuTab === 'Leave' ||
              props.menuTab === 'Purchase'
                ? item.date
                : props.menuTab === 'Mandate'
                ? item.order_date
                : props.menuTab === 'RemoteWork' || props.menuTab === 'Training'
                ? item.date_from
                : props.menuTab === 'TechnicalRequest'
                ? item.open_date
                : null}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={props.requestDataList}
      renderItem={({ item }) => renderRequestList(item)}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default MyApprovalList;
