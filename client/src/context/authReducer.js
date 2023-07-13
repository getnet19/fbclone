const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        user: null,
        isFeaching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isFeaching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isFeaching: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
