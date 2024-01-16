import { logout } from '../constants/index';

const initialState = {
  paymentOrderResponse: '',
  purchaseOrderResponse: '',
  purchaseAddBudgetResponse: '',
  cretAchievementResponse: '',
  internalCoursesResponse: '',
  resignationResponse: '',
};

export const PAYMENT_ORDER_RESPONSE = 'PAYMENT_ORDER_RESPONSE';
export const PAYMENT_ORDER_CLEAR = 'PAYMENT_ORDER_CLEAR';
export const PURCHASE_ORDER_RESPONSE = 'PURCHASE_ORDER_RESPONSE';
export const PURCHASE_ORDER_CLEAR = 'PURCHASE_ORDER_CLEAR';
export const PURCHASE_ADD_BUDGET_RESPONSE = 'PURCHASE_ADD_BUDGET_RESPONSE';
export const PURCHASE_ADD_BUDGET_CLEAR = 'PURCHASE_ADD_BUDGET_CLEAR';
export const CERT_ACHIEVEMENT_RESPONSE = 'CERT_ACHIEVEMENT_RESPONSE';
export const CERT_ACHIEVEMENT_CLEAR = 'CERT_ACHIEVEMENT_CLEAR';
export const INTERNAL_COURSES_RESPONSE = 'INTERNAL_COURSES_RESPONSE';
export const INTERNAL_COURSES_CLEAR = 'INTERNAL_COURSES_CLEAR';
export const RESIGNATION_RESPONSE = 'RESIGNATION_RESPONSE';
export const RESIGNATION_CLEAR = 'RESIGNATION_CLEAR';

const ApprovalReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case PAYMENT_ORDER_RESPONSE: {
      return {
        ...state,
        paymentOrderResponse: action.value,
      };
    }
    case PAYMENT_ORDER_CLEAR: {
      return {
        ...state,
        paymentOrderResponse: '',
      };
    }
    case PURCHASE_ORDER_RESPONSE: {
      return {
        ...state,
        purchaseOrderResponse: action.value,
      };
    }
    case PURCHASE_ORDER_CLEAR: {
      return {
        ...state,
        purchaseOrderResponse: '',
      };
    }
    case PURCHASE_ADD_BUDGET_RESPONSE: {
      return {
        ...state,
        purchaseAddBudgetResponse: action.value,
      };
    }
    case RESIGNATION_RESPONSE: {
      return {
        ...state,
        resignationResponse: action.value,
      };
    }
    case RESIGNATION_CLEAR: {
      return {
        ...state,
        resignationResponse: '',
      };
    }
    case PURCHASE_ADD_BUDGET_CLEAR: {
      return {
        ...state,
        purchaseAddBudgetResponse: '',
      };
    }
    case CERT_ACHIEVEMENT_RESPONSE: {
      return {
        ...state,
        cretAchievementResponse: action.value,
      };
    }
    case CERT_ACHIEVEMENT_CLEAR: {
      return {
        ...state,
        cretAchievementResponse: '',
      };
    }
    case INTERNAL_COURSES_RESPONSE: {
      return {
        ...state,
        internalCoursesResponse: action.value,
      };
    }
    case INTERNAL_COURSES_CLEAR: {
      return {
        ...state,
        internalCoursesResponse: '',
      };
    }
    default:
      return state;
  }
};

export default ApprovalReducer;
