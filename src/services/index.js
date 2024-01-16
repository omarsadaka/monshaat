export const isProductionMode = true;
const ServerConfigration = {
  baseUrl: isProductionMode
    ? 'https://me.monshaat.gov.sa' //http://172.25.50.24   https://me.monshaat.gov.sa
    : 'http://95.177.177.69:8070', //https://apis.monshaat.gov.sa
  userDB: isProductionMode ? 'smea' : 'smea',
  msgServer: false
    ? 'http://192.168.99.120:4000/'
    : isProductionMode
    ? 'https://chat.monshaat.gov.sa/'
    : 'http://20.84.62.97:4000/', 
  itsmBaseUrl: isProductionMode
    ? 'https://help.monshaat.gov.sa/api/tisu4/'
    : 'https://helpstg.monshaat.gov.sa/api/tisu4/',
  itsmAuthUrl: isProductionMode
    ? 'https://pservices.monshaat.gov.sa'
    : 'https://publicapis.monshaat.gov.sa',
  xـapiـkey: isProductionMode
    ? '73300dc3-87dd-473c-9b78-ed815702bdd7'
    : 'f09b189a-5eb2-4e60-b44a-8a047885b861',
  senderId: isProductionMode
    ? '3d34b3bf-aa8e-4b81-b56c-9fe8966dc3e2'
    : '96f30b78-7e9b-4f27-8599-c5e3b155fdf7',
};

// export const isProductionMode2 = false;
// const ServerConfigration2 = {
//   itsmBaseUrl: isProductionMode2
//     ? 'https://help.monshaat.gov.sa/api/tisu4/'
//     : 'https://helpstg.monshaat.gov.sa/api/tisu4/',
//   itsmAuthUrl: isProductionMode2
//     ? 'https://pservices.monshaat.gov.sa'
//     : 'https://publicapis.monshaat.gov.sa',
//   xـapiـkey: isProductionMode2
//     ? '73300dc3-87dd-473c-9b78-ed815702bdd7'
//     : 'f09b189a-5eb2-4e60-b44a-8a047885b861',
//   senderId: isProductionMode2
//     ? '3d34b3bf-aa8e-4b81-b56c-9fe8966dc3e2'
//     : '96f30b78-7e9b-4f27-8599-c5e3b155fdf7',
// };

export const baseUrl = ServerConfigration.baseUrl;
export const userDB = ServerConfigration.userDB;
export const msgServer = ServerConfigration.msgServer;

export const itsmBaseUrl = ServerConfigration.itsmBaseUrl;
export const itsmAuthUrl = ServerConfigration.itsmAuthUrl;
export const xـapiـkey = ServerConfigration.xـapiـkey;
export const senderId = ServerConfigration.senderId;
// export const itsmBaseUrl = ServerConfigration2.itsmBaseUrl;
// export const itsmAuthUrl = ServerConfigration2.itsmAuthUrl;
// export const xـapiـkey = ServerConfigration2.xـapiـkey;
// export const senderId = ServerConfigration2.senderId;

export const limit = 6;
export const otpTimer = 120;
export const otpTryLimit = 3;
export const EMP_NO = 'EMP_NO';
export const JOB_ID = 'JOB_ID';
export const DEPT_ID = 'DEPT_ID';
export const DEGREE_ID = 'DEGREE_ID';
export const GRADE_ID = 'GRADE_ID';
export const TYPE_ID = 'TYPE_ID';
export const remoteLog = (endpoint, data) => {
  return true;
};

export const isAccessible = async (model, accessToken) => {
  let mURL = `${baseUrl}/api/access/rights/?model=${model}`;
  // let secretUrl = await EncryptUrl(mURL);

  const result = await fetch(mURL, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((res) => res.json());
  remoteLog(mURL, result);
  return result;
};

export const formatTime = (intTime) => {
  return (
    intTime -
    (intTime % 1) +
    ':' +
    (Math.round((intTime % 1) * 60) > 9
      ? Math.round((intTime % 1) * 60)
      : Math.round((intTime % 1) * 60) + '0')
  );
};

export const getStatus = (menuTab, status) => {
  let response = {
    statusText: '',
    statusColor: '#727572',
  };

  if (menuTab === 'HRLetter') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#008AC5';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'hrm':
        response.statusText = 'عمليات الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'تم طباعة';
        response.statusColor = '#7AC143';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'cutoff':
        response.statusText = 'مقطوع';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'confirm':
        response.statusText = 'للاعتماد';
        response.statusColor = '#008AC5';
        break;
      case 'validate1':
        response.statusText = 'الموافقة الثانية';
        response.statusColor = '#008AC5';
        break;
      case 'validate':
        response.statusText = 'مقبول';
        response.statusColor = '#7AC143';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'Vacation') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'hrm':
        response.statusText = 'عمليات الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'cutoff':
        response.statusText = 'مقطوع';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'confirm':
        response.statusText = 'للاعتماد';
        response.statusColor = '#008AC5';
        break;
      case 'validate1':
        response.statusText = 'الموافقة الثانية';
        response.statusColor = '#008AC5';
        break;
      case 'validate':
        response.statusText = 'مقبول';
        response.statusColor = '#7AC143';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'Mandate') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'audit':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'sm':
        response.statusText = 'مدير القطاع';
        response.statusColor = '#008AC5';
        break;
      case 'humain':
        response.statusText = 'عمليات الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'gm_humain':
        response.statusText = 'مدير عام الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        response.statusText = 'نائب المحافظ للخدمات المشتركة';
        response.statusColor = '#008AC5';
        break;
      case 'hr_master':
        response.statusText = 'المحافظ';
        response.statusColor = '#008AC5';
        break;
      case 'confirm':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'done_ticket':
        response.statusText = 'معتمد و تم حجز التذكرة';
        response.statusColor = '#008AC5';
        break;
      case 'pending':
        response.statusText = 'تحت الإجراء';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'معتمد و تم امر الصرف';
        response.statusColor = '#7AC143';
        break;
      case 'finish':
        response.statusText = 'منتهي';
        response.statusColor = '#DD4B39';
        break;
      case 'canceled':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'cutoff':
        response.statusText = 'مقطوع';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'Leave') {
    switch (status) {
      case 'new':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'hrm':
        response.statusText = 'عمليات الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'TechnicalRequest') {
    switch (status) {
      case 'مع فريق التواصل':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'مع فريق المرافق':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'مع فريق المعمل':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'طلبات مؤجلة':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'بإنتظار العميل':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'طلبات غير تقنية':
        response.statusText = status;
        response.statusColor = '#7AC143';
        break;
      case 'جديدة':
        response.statusText = status;
        response.statusColor = '#F39C12';
        break;
      case 'New':
        response.statusText = 'جديد';
        response.statusColor = '#F39C12';
        break;
      case 'Pending':
        response.statusText = 'تحت الإجراء';
        response.statusColor = '#008AC5';
        break;
      case 'بانتظار المستخدم':
        response.statusText = status;
        response.statusColor = '#008AC5';
        break;
      case 'تم حل الطلب':
        response.statusText = status;
        response.statusColor = '#7AC143';
        break;
      case 'تم الالغاء':
        response.statusText = status;
        response.statusColor = '#DD4B39';
        break;
      case 'Open':
        response.statusText = 'مفتوح';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'RemoteWork') {
    switch (status) {
      case 'draft':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'humain':
        response.statusText = 'عمليات الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'Purchase') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'sm':
        response.statusText = 'مدير القطاع';
        response.statusColor = '#008AC5';
        break;
      case 'management_strategy':
        response.statusText = 'مشرف القطاع في ادارة المشاريع';
        response.statusColor = '#008AC5';
        break;
      case 'dmanagement_strategy_mgr':
        response.statusText = 'مدير مكتب ادارة المشاريع';
        response.statusColor = '#008AC5';
        break;
      case 'financial_audit':
        response.statusText = 'مدقق مالي';
        response.statusColor = '#008AC5';
        break;
      case 'financial_department':
        response.statusText = 'ادارة المالية';
        response.statusColor = '#008AC5';
        break;
      case 'authority_owner':
        response.statusText = 'صاحب الصلاحية';
        response.statusColor = '#008AC5';
        break;
      case 'contract_procurement':
        response.statusText = 'ادارة العقود و المشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'waiting':
        response.statusText = 'طلب توضيح';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'cancelled':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'under_put':
        response.statusText = 'تحت الطرح';
        response.statusColor = '#008AC5';
        break;
      case 'receiving_offers':
        response.statusText = 'إستلام العروض';
        response.statusColor = '#008AC5';
        break;
      case 'technical_analysis':
        response.statusText = 'التحليل الفني';
        response.statusColor = '#008AC5';
        break;
      case 'check_offers':
        response.statusText = 'فحص العروض';
        response.statusColor = '#008AC5';
        break;
      case 'awarding_baptism':
        response.statusText = 'الترسية/التعميد';
        response.statusColor = '#008AC5';
        break;
      case 'purchase_order':
        response.statusText = 'أمر الشراء المبدئي';
        response.statusColor = '#008AC5';
        break;
      case 'purchase_requisition':
        response.statusText = 'اتفاقية الشراء';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'PaymentOrder') {
    switch (status) {
      case 'prepare':
        response.statusText = 'اعداد';
        response.statusColor = '#F39C12';
        break;
      case 'account_manager':
        response.statusText = 'مدير المحاسبة';
        response.statusColor = '#008AC5';
        break;
      case 'review':
        response.statusText = 'مراجعة الميزانية';
        response.statusColor = '#008AC5';
        break;
      case 'financial_manager':
        response.statusText = 'مدير الإدارة المالية';
        response.statusColor = '#008AC5';
        break;
      case 'gm_financial_purchasing_department':
        response.statusText = 'مدير عام الإدارة المالية و المشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'financial_observer':
        response.statusText = 'المراقب المالي';
        response.statusColor = '#008AC5';
        break;
      case 'his_authority':
        response.statusText = 'صاحب الصلاحية';
        response.statusColor = '#008AC5';
        break;
      case 'hr_master':
        response.statusText = 'المحافظ';
        response.statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        response.statusText = 'نائب المحافظ للخدمات المشتركة';
        response.statusColor = '#008AC5';
        break;
      case 'payment_supervisor':
        response.statusText = 'مشرف مدفوعات';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'PurchaseOrder') {
    switch (status) {
      case 'draft':
        response.statusText = ' طلب شراء مبدئي';
        response.statusColor = '#F39C12';
        break;
      case 'sent':
        response.statusText = ' تم إرسال طلب الشراء المدئي';
        response.statusColor = '#008AC5';
        break;
      case 'to_approve':
        response.statusText = ' للموافقة';
        response.statusColor = '#008AC5';
        break;
      case 'to approve':
        response.statusText = ' للموافقة';
        response.statusColor = '#008AC5';
        break;
      case 'purchase_manager':
        response.statusText = 'مدير المشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'manager_contracts_purchasing_department':
        response.statusText = ' مدير إدارة العقود و المشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'gm_financial_purchasing_department':
        response.statusText = 'مدير عام الإدارة المالية و المشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        response.statusText = ' نائب المحافظ للخدمات المشتركة';
        response.statusColor = '#008AC5';
        break;
      case 'hr_master':
        response.statusText = 'المحافظ';
        response.statusColor = '#008AC5';
        break;
      case 'purchase':
        response.statusText = 'أمر شراء';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'مغلق';
        response.statusColor = '#7AC143';
        break;
      case 'refuse':
        response.statusText = 'رفض';
        response.statusColor = '#DD4B39';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;

      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'Training') {
    switch (status) {
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'training':
        response.statusText = 'قسم التدريب';
        response.statusColor = '#008AC5';
        break;
      case 'audit':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'sm':
        response.statusText = 'مدير القطاع';
        response.statusColor = '#008AC5';
        break;
      case 'gm_humain':
        response.statusText = 'مدير عام الموارد البشرية';
        response.statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        response.statusText = 'نائب المحافظ للخدمات المشتركة';
        response.statusColor = '#008AC5';
        break;
      case 'hr_master':
        response.statusText = 'المحافظ';
        response.statusColor = '#008AC5';
        break;
      case 'confirm':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'confirm_center':
        response.statusText = 'اعتماد المعهد';
        response.statusColor = '#008AC5';
        break;
      case 'done_ticket':
        response.statusText = 'معتمد وتم حجز التذكرة';
        response.statusColor = '#008AC5';
        break;
      case 'pending':
        response.statusText = 'تحت الإجراء';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'معتمد و تم امر الصرف';
        response.statusColor = '#7AC143';
        break;
      case 'cancelled':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'AddBudget') {
    switch (status) {
      case 'draft':
        response.statusText = ' طلب شراء مبدئي';
        response.statusColor = '#F39C12';
        break;
      case 'financial_audit':
        response.statusText = 'المدقق المالي';
        response.statusColor = '#008AC5';
        break;
      case 'financial_department':
        response.statusText = 'مدير المالية';
        response.statusColor = '#008AC5';
        break;
      case 'authority_owner':
        response.statusText = 'صاحب الصلاحية';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'مغلق';
        response.statusColor = '#7AC143';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'CertificateAchievement') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'sector_project_management':
        response.statusText = 'مشرف القطاع في ادارة المشاريع';
        response.statusColor = '#008AC5';
        break;
      case 'project_management_office':
        response.statusText = 'مكتب ادارة المشاريع';
        response.statusColor = '#008AC5';
        break;
      case 'sm':
        response.statusText = 'مدير القطاع';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  } else if (menuTab === 'CustodyRequest') {
    switch (status) {
      case 'draft':
        response.statusText = 'طلب';
        response.statusColor = '#F39C12';
        break;
      case 'dm':
        response.statusText = 'المدير المباشر';
        response.statusColor = '#008AC5';
        break;
      case 'financial_department':
        response.statusText = 'مدير الإدارة المالية';
        response.statusColor = '#008AC5';
        break;
      case 'done':
        response.statusText = 'اعتمد';
        response.statusColor = '#7AC143';
        break;
      case 'cancel':
        response.statusText = 'ملغى';
        response.statusColor = '#DD4B39';
        break;
      case 'closed':
        response.statusText = 'اقفال';
        response.statusColor = '#DD4B39';
        break;
      case 'refuse':
        response.statusText = 'مرفوض';
        response.statusColor = '#DD4B39';
        break;
      case 'hr_master':
        response.statusText = 'المحافظ';
        response.statusColor = '#008AC5';
        break;
      case 'financial_purchasing_mgr':
        response.statusText = 'مدير عام الإدارة المالية والمشتريات';
        response.statusColor = '#008AC5';
        break;
      case 'vp_hr_master':
        response.statusText = 'نائب المحافظ';
        response.statusColor = '#7AC143';
        break;
      default:
        response.statusText = status;
        response.statusColor = '#727572';
        break;
    }
  }
  return response;
};
