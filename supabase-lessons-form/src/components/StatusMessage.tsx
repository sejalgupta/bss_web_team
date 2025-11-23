import React from 'react';
import { Status } from '../types';

interface StatusMessageProps {
  type: Status['type'];
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  if (!message) return null;

  return (
    <div className={`status-message ${type}`}>
      {message}
    </div>
  );
};

export default StatusMessage;