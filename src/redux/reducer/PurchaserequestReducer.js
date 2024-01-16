import { logout } from '../constants/index';

const initialState = {
  purchaseTypes: '',
  strategicPlanTypes: '',
  purchaseInitiativeTypes: '',
  purchaseProgramTypes: '',
  purchaseRequestResponse: '',
  purchaseAttachmentTypes: '',
  purchaseApprovedOrders: [],
  purchaseRequisitionRequestResponse: '',
  purchaseContractRequestResponse: '',
  workOrderRequestResponse: '',
  hrPayslipRunRequestResponse: '',
  hrPayslipRequestResponse: '',
};

export const PURCHASE_ATTACHMENT_TYPE = 'PURCHASE_ATTACHMENT_TYPE';
export const PURCHASE_APPROVED_ORDERS = 'PURCHASE_APPROVED_ORDERS';

const PurchaseTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'PURCHASE_TYPES': {
      return {
        ...state,
        purchaseTypes: action.value,
      };
    }
    case 'PLAN_TYPES': {
      return {
        ...state,
        strategicPlanTypes: action.value,
      };
    }
    case 'INITIATIVE_TYPES': {
      return {
        ...state,
        purchaseInitiativeTypes: action.value,
      };
    }
    case 'PROGRAM_TYPES': {
      return {
        ...state,
        purchaseProgramTypes: action.value,
      };
    }
    case 'PURCHASE_REQUEST_POST': {
      return {
        ...state,
        purchaseRequestResponse: action.value,
      };
    }
    case 'REQUISITION_REQUEST_POST': {
      return {
        ...state,
        purchaseRequisitionRequestResponse: action.value,
      };
    }
    case 'CONTRACT_REQUEST_POST': {
      return {
        ...state,
        purchaseContractRequestResponse: action.value,
      };
    }

    case 'HRPAYSRUN_REQUEST_POST': {
      return {
        ...state,
        hrPayslipRunRequestResponse: action.value,
      };
    }
    case 'HRPAYS_REQUEST_POST': {
      return {
        ...state,
        hrPayslipRequestResponse: action.value,
      };
    }

    case 'WORKORDER_REQUEST_POST': {
      return {
        ...state,
        workOrderRequestResponse: action.value,
      };
    }
    case PURCHASE_ATTACHMENT_TYPE: {
      return {
        ...state,
        purchaseAttachmentTypes: action.value,
      };
    }
    case PURCHASE_APPROVED_ORDERS: {
      return {
        ...state,
        purchaseApprovedOrders: action.value,
      };
    }
    default:
      return state;
  }
};

export default PurchaseTypeReducer;
