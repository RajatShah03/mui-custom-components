import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import styled from 'styled-components';
import SuccessIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/CancelOutlined';
import WarningIcon from '@material-ui/icons/ReportProblemOutlined';

const borderColors = {
  success: '#4CAF50',
  error: '#e20074',
  warning: '#FE9A3A',
};

const StyledAlert = styled(Alert)`
  min-width: 20rem;
  max-width: 30rem;
  min-height: 5rem;
  max-height: 8rem;
  border-left: 1rem solid ${({severity}) => borderColors[severity]};
  align-items: center;
  background-color: #FFFFFF !important;
  padding: 1rem !important;

  .MuiAlert-message {
    font-family: Roboto;
    font-size: 1rem;
    font-weight: 500;
    color: #242241;
    text-transform: capitalize;
  }

  & > .MuiAlert-action button:focus {
    outline: none;
  }
`;

const StyledAlertTitle = styled(AlertTitle)`
  max-height: 3.6rem;
  overflow: hidden;
  font-size: 0.8rem !important;
  font-weight: normal !important;
  color: #242241;
  text-transform: none;
  margin: 0 !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const Success = styled(SuccessIcon)`
  color: #4CAF50 !important;
`;
const Error = styled(ErrorIcon)`
  color: #e20074 !important;
`;
const Warning = styled(WarningIcon)`
  color: #FE9A3A !important;
`;

const AlertToast = () => {
  const init = {open: false, message: ''};
  const alert = useSelector(state => state.alert_toast);
  const dispatch = useDispatch();

  const [alertState, setAlertState] = useState(init);

  const handleOpen = (alertObj) => {
    setAlertState({open: true, ...alertObj});
  };

  const handleClose = () => {
    dispatch({ type: 'ALERT_TOAST', data: null });
    setAlertState(init);
  };

  useEffect(() => {
    if (alert) {
      handleOpen(alert);
    } else {
      handleClose();
    }
  }, [alert]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={alertState.open}
      onClose={handleClose}
      transitionDuration={{
        enter: 400,
        exit: 30,
      }}
    >
      <StyledAlert
        elevation={3}
        severity={alertState.severity}
        iconMapping={{
          success: <Success />,
          error: <Error />,
          warning: <Warning />,
        }}
        onClose={handleClose}
      >
        {alertState.severity !== 'success' && alertState.severity}
        <StyledAlertTitle>
          {alertState.message}
        </StyledAlertTitle>
      </StyledAlert>
    </Snackbar>
  );
};

export default AlertToast;
