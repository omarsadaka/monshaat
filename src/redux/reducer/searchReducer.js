import { logout } from '../constants/index';

const initialState = {
  managerData: '',
  deptData: '',
  colData: '',
  managerData2: '',
  deptData2: '',
  colData2: '',
  managerLoading: false,
  deptLoading: false,
  colLoading: false,
  searchLoading: false,
  searchData: '',
};

const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case logout: {
      return initialState;
    }
    case 'SEARCH_LOADING': {
      return {
        ...state,
        searchLoading: action.value,
      };
    }
    case 'SEARCH_MANAGER_LOADING': {
      return {
        ...state,
        managerLoading: action.value,
      };
    }
    case 'SEARCH_DEPT_LOADING': {
      return {
        ...state,
        deptLoading: action.value,
      };
    }
    case 'SEARCH_COL_LOADING': {
      return {
        ...state,
        deptLoading: action.value,
      };
    }
    case 'MANAGER_DATA': {
      return {
        ...state,
        managerData: action.value,
        managerLoading: false,
      };
    }

    case 'DEPT_DATA': {
      return {
        ...state,
        deptData: action.value,
        deptLoading: false,
      };
    }

    case 'COL_DATA': {
      return {
        ...state,
        colData: action.value,
        colLoading: false,
      };
    }

    case 'MANAGER_DATA2': {
      return {
        ...state,
        managerData2: action.value,
        managerLoading: false,
      };
    }

    case 'DEPT_DATA2': {
      return {
        ...state,
        deptData2: action.value,
        deptLoading: false,
      };
    }

    case 'COL_DATA2': {
      return {
        ...state,
        colData2: action.value,
        colLoading: false,
      };
    }

    case 'SEARCH_DATA': {
      return {
        ...state,
        searchData: action.value,
        searchLoading: false,
      };
    }

    default:
      return state;
  }
};

export default SearchReducer;
