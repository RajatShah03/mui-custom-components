import store from '../../src/store/createStore';

export const customErrMessages = {
  500: {
    message: 'Something went wrong! Please try again.',
    severity: 'error',
  },
  501: {
    message: 'We couldn\'t process your request! Please try again.',
    severity: 'error',
  },
  502: {
    message:
      'The server encountered a temporary error' +
      ', and could not complete your request.',
    severity: 'error',
  },
  504: {
    message: 'The server could not respond! Please try again.',
    severity: 'error',
  },
  400: {
    message: 'We ran into a problem! Please try again.',
    severity: 'error',
  },
  401: {
    message: 'Please log in to continue.',
    severity: 'warning',
  },
  403: {
    message: 'You don\'t have authorization to perform this action.',
    severity: 'error',
  },
  404: {
    message: 'Page not found!',
    severity: 'error',
  },
  405: {
    message: 'The requested method is not allowed.',
    severity: 'error',
  },
  406: {
    message: 'We ran into a problem! Please try again.',
    severity: 'error',
  },
  412: {
    message: 'We weren\'t able to upload the file! Please try again.',
    severity: 'error',
  },
  415: {
    message:
      'Please try a different type of media file. We do not support this file type.',
    severity: 'error',
  },
};

const getMessage = (error) => {
  const status = error.response ? error.response.status : null;
  if (status === 401) {
    store.dispatch({ type: 'SET_LOGIN', data: true });
  }
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  } else {
    return status ? customErrMessages[status].message : error.message;
  }
};
const getSeverity = (error) => {
  const status = error.response ? error.response.status : null;
  return status ? customErrMessages[status].severity : 'error';
};

/**
 * useAlert hook
 * For handling app wide error | warning | success
 * uses gatsby navigate for navigation
 * 
 * @example {system-error-alert and navigate}
 *  const { errorAlert, errorAlertAndNavigate } = useAlert();
 *  try {
 *    pass
 *  } catch (e) {
 *    errorAlert(e); // without navigation
 *    errorAlertAndNavigate(e, 'path'); // with navigation
 *  }
 * 
 * @example {custom error alert and navigate}
 *  const { customErrorAlert, customErrorAlertAndNavigate } = useAlert();
 *  ...
 *  customErrorAlert('error message'); // without navigation
 *  customErrorAlertAndNavigate('error message', 'path'); // with navigation
 * 
 * @example {success alert and navigate}
 *  const { successAlert, successAlertAndNavigate } = useAlert();
 *  ...
 *  successAlert('success message'); // without navigation
 *  successAlertAndNavigate('success message', 'path'); // with navigation
 */

export default function useAlert() {
  const ErrorAlert = (error) => {
    store.dispatch({
      type: 'ALERT_TOAST',
      data: { message: getMessage(error), severity: getSeverity(error) },
    });
  };
  
  const ErrorAlertAndNavigate = (error, navigate) => {
    navigate();
    setTimeout(() => {
      store.dispatch({
        type: 'ALERT_TOAST',
        data: { message: getMessage(error), severity: getSeverity(error) },
      });
    }, 500);
  };
  
  const CustomErrorAlert = (msg) => {
    store.dispatch({
      type: 'ALERT_TOAST',
      data: { message: msg, severity: 'error' }
    });
  };
  
  const CustomErrorAlertAndNavigate = (msg, navigate) => {
    navigate();
    setTimeout(() => {
      store.dispatch({
        type: 'ALERT_TOAST',
        data: { message: msg, severity: 'error' },
      });
    }, 600);
  };
  
  const CustomWarningAlertAndNavigate = (msg, navigate) => {
    navigate();
    setTimeout(() => {
      store.dispatch({
        type: 'ALERT_TOAST',
        data: { message: msg, severity: 'warning' },
      });
    }, 600);
  };

  const successAlert = (success) => {
    store.dispatch({
      type: 'ALERT_TOAST',
      data: { message: success, severity: 'success' },
    });
  };

  const successAlertAndNavigate = (success, navigate) => {
    navigate();
    store.dispatch({
      type: 'ALERT_TOAST',
      data: { message: success, severity: 'success' },
    });
  };

  return {
    errorAlert: ErrorAlert,
    errorAlertAndNavigate: ErrorAlertAndNavigate,
    customErrorAlert: CustomErrorAlert,
    customErrorAlertAndNavigate: CustomErrorAlertAndNavigate,
    customWarningAlertAndNavigate: CustomWarningAlertAndNavigate,
    successAlert,
    successAlertAndNavigate,
  };
}
