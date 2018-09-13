import React from 'react';
import { Alert } from 'react-gears';
import PropTypes from 'prop-types';

const messages = {
  default: 'Sorry, something went wrong.',
  edit: {
    success: 'Successfully updated the Property Group.',
    error: 'Failed to edit Property Group. Please try again.',
    notFound: 'Failed to update Property Group because it no longer exists.'
  },
  add: {
    success: 'Successfully added a Property Group.',
    error: 'Failed to add a Property Group. Please try again.'
  },
  delete: {
    success: 'Successfully deleted the Property Group',
    error: 'Failed to delete Property Group. Please try again.'
  }
};

function getAlertMessage(action, type) {
  return messages[action] && messages[action][type] ? messages[action][type] : messages.default;
}

const AlertMessage = ({ action, type }) => (
  <Alert dismissible icon color={type === 'success' ? 'success' : 'danger'}>
    {getAlertMessage(action, type)}
  </Alert>
);

AlertMessage.propTypes = {
  action: PropTypes.string,
  type: PropTypes.string
};

export default AlertMessage;
