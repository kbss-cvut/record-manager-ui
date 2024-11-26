import * as React from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { dismissMessage } from "../../actions/MessageActions";
import { useI18n } from "../../hooks/useI18n";
import { MESSAGE_DURATION } from "../../constants/DefaultConstants";
import PropTypes from "prop-types";

export const Message = ({ message }) => {
  const { formatMessage } = useI18n();
  const dispatch = useDispatch();
  const dismiss = React.useCallback(() => dispatch(dismissMessage(message)), [message, dispatch]);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dismiss();
    }, MESSAGE_DURATION);
    return () => clearTimeout(timer);
  }, [dismiss, message]);

  return (
    <Alert variant={message.type} onClose={dismiss} dismissible={true}>
      {message.messageId ? formatMessage(message.messageId, message.values) : message.message}
    </Alert>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
    values: PropTypes.object,
    message: PropTypes.string,
  }).isRequired,
};

export default Message;
