import { default as Moment, default as moment } from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

const ListViewItem = props => {
  let item = props.item;
  let statusText = '';
  let statusColor = '#F39C12';
  if (props.type === 'Vacation') {
    switch (item.state) {
      case 'draft':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'dm':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'hrm':
        statusText = 'عمليات الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'done':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      case 'cancel':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      case 'cutoff':
        statusText = 'مقطوع';
        statusColor = '#DD4B39';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      case 'confirm':
        statusText = 'للاعتماد';
        statusColor = '#008AC5';
        break;
      case 'validate1':
        statusText = 'الموافقة الثانية';
        statusColor = '#008AC5';
        break;
      case 'validate':
        statusText = 'مقبول';
        statusColor = '#7AC143';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  } else if (props.type === 'Mandate') {
    switch (item.state) {
      case 'draft':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'audit':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'sm':
        statusText = 'مدير القطاع';
        statusColor = '#008AC5';
        break;
      case 'humain':
        statusText = 'عمليات الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'gm_humain':
        statusText = 'مدير عام الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        statusText = 'نائب المحافظ للخدمات المشتركة';
        statusColor = '#008AC5';
        break;
      case 'hr_master':
        statusText = 'المحافظ';
        statusColor = '#008AC5';
        break;
      case 'confirm':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      case 'done_ticket':
        statusText = 'معتمد و تم حجز التذكرة';
        statusColor = '#008AC5';
        break;
      case 'pending':
        statusText = 'تحت الإجراء';
        statusColor = '#008AC5';
        break;
      case 'done':
        statusText = 'معتمد و تم امر الصرف';
        statusColor = '#7AC143';
        break;
      case 'finish':
        statusText = 'منتهي';
        statusColor = '#DD4B39';
        break;
      case 'canceled':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      case 'cutoff':
        statusText = 'مقطوع';
        statusColor = '#DD4B39';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  } else if (props.type === 'Leave') {
    switch (item.state) {
      case 'new':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'dm':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'hrm':
        statusText = 'عمليات الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      case 'cancel':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      case 'done':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  } else if (props.type === 'TechnicalRequest') {
    if (item.stage_id) {
      switch (item.stage_id[1]) {
        case 'مع فريق التواصل':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'مع فريق المرافق':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'مع فريق المعمل':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'طلبات مؤجلة':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'بإنتظار العميل':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'طلبات غير تقنية':
          statusText = item.stage_id[1];
          statusColor = '#7AC143';
          break;
        case 'جديدة':
          statusText = item.stage_id[1];
          statusColor = '#F39C12';
          break;
        case 'تحت الاجراء':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'بانتظار المستخدم':
          statusText = item.stage_id[1];
          statusColor = '#008AC5';
          break;
        case 'تم حل الطلب':
          statusText = item.stage_id[1];
          statusColor = '#7AC143';
          break;
        case 'تم الالغاء':
          statusText = item.stage_id[1];
          statusColor = '#DD4B39';
          break;
        default:
          statusText = item.stage_id[1];
          statusColor = '#727572';
          break;
      }
    }
  } else if (props.type === 'RemoteWork') {
    switch (item.state) {
      case 'draft':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'dm':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'humain':
        statusText = 'عمليات الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'done':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      case 'cancel':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  } else if (props.type === 'Purchase') {
    switch (item.state) {
      case 'draft':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'sm':
        statusText = 'مدير القطاع';
        statusColor = '#008AC5';
        break;
      case 'management_strategy':
        statusText = 'مشرف القطاع في ادارة المشاريع';
        statusColor = '#008AC5';
        break;
      case 'dmanagement_strategy_mgr':
        statusText = 'مدير مكتب ادارة المشاريع';
        statusColor = '#008AC5';
        break;
      case 'financial_audit':
        statusText = 'مدقق مالي';
        statusColor = '#008AC5';
        break;
      case 'financial_department':
        statusText = 'ادارة المالية';
        statusColor = '#008AC5';
        break;
      case 'authority_owner':
        statusText = 'صاحب الصلاحية';
        statusColor = '#008AC5';
        break;
      case 'contract_procurement':
        statusText = 'ادارة العقود و المشتريات';
        statusColor = '#008AC5';
        break;
      case 'waiting':
        statusText = 'طلب توضيح';
        statusColor = '#008AC5';
        break;
      case 'done':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      case 'cancelled':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      case 'under_put':
        statusText = 'تحت الطرح';
        statusColor = '#008AC5';
        break;
      case 'receiving_offers':
        statusText = 'إستلام العروض';
        statusColor = '#008AC5';
        break;
      case 'technical_analysis':
        statusText = 'التحليل الفني';
        statusColor = '#008AC5';
        break;
      case 'check_offers':
        statusText = 'فحص العروض';
        statusColor = '#008AC5';
        break;
      case 'awarding_baptism':
        statusText = 'الترسية/التعميد';
        statusColor = '#008AC5';
        break;
      case 'purchase_order':
        statusText = 'أمر الشراء المبدئي';
        statusColor = '#008AC5';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  } else if (props.type === 'Training') {
    switch (item.state) {
      case 'dm':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'draft':
        statusText = 'طلب';
        statusColor = '#F39C12';
        break;
      case 'training':
        statusText = 'قسم التدريب';
        statusColor = '#008AC5';
        break;
      case 'audit':
        statusText = 'المدير المباشر';
        statusColor = '#008AC5';
        break;
      case 'sm':
        statusText = 'مدير القطاع';
        statusColor = '#008AC5';
        break;
      case 'gm_humain':
        statusText = 'مدير عام الموارد البشرية';
        statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        statusText = 'نائب المحافظ للخدمات المشتركة';
        statusColor = '#008AC5';
        break;
      case 'hr_master':
        statusText = 'المحافظ';
        statusColor = '#008AC5';
        break;
      case 'confirm':
        statusText = 'اعتمد';
        statusColor = '#7AC143';
        break;
      case 'confirm_center':
        statusText = 'اعتماد المعهد';
        statusColor = '#008AC5';
        break;
      case 'done_ticket':
        statusText = 'معتمد وتم حجز التذكرة';
        statusColor = '#008AC5';
        break;
      case 'pending':
        statusText = 'تحت الإجراء';
        statusColor = '#008AC5';
        break;
      case 'done':
        statusText = 'معتمد و تم امر الصرف';
        statusColor = '#7AC143';
        break;
      case 'cancelled':
        statusText = 'ملغى';
        statusColor = '#DD4B39';
        break;
      case 'refuse':
        statusText = 'مرفوض';
        statusColor = '#DD4B39';
        break;
      default:
        statusText = item.state;
        statusColor = '#727572';
        break;
    }
  }
  if (statusColor === '') statusColor = '#727572';
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          marginVertical: 8,
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#eeeeee',
          alignItems: 'center',
        }}
      >
        {props.type !== 'All' ? (
          <View
            style={{
              width: '30%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: statusColor,
                borderRadius: 999,
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontFamily: '29LTAzer-Regular',
                }}
                numberOfLines={1}
              >
                {statusText}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'right',
                color: 'gray',
                marginTop: 8,
                fontFamily: '29LTAzer-Regular',
              }}
              numberOfLines={1}
            >
              {props.type === 'Vacation' ||
              props.type === 'Leave' ||
              props.type === 'Purchase'
                ? Moment(item.date).format('D-MM-Y')
                : props.type === 'Mandate'
                ? Moment(item.order_date).format('D-MM-Y')
                : props.type === 'RemoteWork' || props.type === 'Training'
                ? Moment(item.date_from).format('D-MM-Y')
                : props.type === 'TechnicalRequest'
                ? Moment(item.open_date).format('D-MM-Y')
                : null}
            </Text>
          </View>
        ) : (
          <View style={{ width: '30%', alignItems: 'center' }} />
        )}
        <View
          style={{ width: '70%', justifyContent: 'center', paddingLeft: 8 }}
        >
          <Text
            style={{
              fontSize: 14,
              textAlign: 'right',
              fontFamily: '29LTAzer-Regular',
            }}
            numberOfLines={1}
          >
            {item.id}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              textAlign: 'right',
              paddingVertical: 4,
              fontSize: 16,
              fontFamily: '29LTAzer-Regular',
            }}
          >
            {props.type === 'TechnicalRequest' || props.type === 'RemoteWork'
              ? item.description
              : props.type === 'Training'
              ? item.name
              : props.type === 'Leave'
              ? item.employee_id
              : props.type === 'Mandate'
              ? item.task_name
              : props.type === 'Purchase'
              ? item.description
              : props.type === 'Vacation'
              ? item.display_name
                ? item.display_name
                : '-'
              : item.name}
          </Text>
          <View>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'right',
                color: 'gray',
                fontFamily: '29LTAzer-Regular',
              }}
              numberOfLines={1}
            >
              {item.date_to ? moment(item.date_to).format('D-MM-Y') : ''}
              {item.date_from
                ? item.date_to
                  ? ' - ' + moment(item.date_from).format('D-MM-Y')
                  : moment(item.date_from).format('D-MM-Y')
                : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListViewItem;
