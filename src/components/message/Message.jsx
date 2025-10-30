import * as React from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { dismissMessage } from "../../actions/MessageActions";
import { useI18n } from "../../hooks/useI18n";
import { MESSAGE_DURATION } from "../../constants/DefaultConstants";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";

export const Message = ({ message }) => {
  const { formatMessage } = useI18n();
  const dispatch = useDispatch();
  const [progress, setProgress] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  const dismiss = useCallback(() => dispatch(dismissMessage(message)), [message, dispatch]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const startTime = Date.now();
    const timer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        dismiss();
      }, 400);
    }, MESSAGE_DURATION);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / MESSAGE_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [dismiss, message]);

  const size = 24;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
      }}
    >
      <Alert variant={message.type} onClose={dismiss} dismissible={true}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              opacity={0.2}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
          </svg>
          <span>{message.messageId ? formatMessage(message.messageId, message.values) : message.message}</span>
        </div>
      </Alert>
    </div>
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
