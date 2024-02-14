import * as React from "react";
import {useSelector} from "react-redux";
import Message from "./Message";
import {MESSAGE_DISPLAY_COUNT} from "../../constants/DefaultConstants";

export const Messages = () => {
    const messages = useSelector((state) => state.messages);
    const count =
        messages.length < MESSAGE_DISPLAY_COUNT
            ? messages.length
            : MESSAGE_DISPLAY_COUNT;
    const toRender = messages.slice(0, count);
    return (
        <div className={"message-container messages-" + count}>
            {toRender.map((m) => (
                <Message key={m.timestamp} message={m}/>
            ))}
        </div>
    );
};

export default Messages;
