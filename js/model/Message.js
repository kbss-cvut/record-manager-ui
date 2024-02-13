export const MessageType = {
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    ERROR: "danger"
};

export default class Message {

    constructor(data) {
        this.mMessage = data.message;
        this.mMessageId = data.messageId;
        this.mValues = data.values;
        this.mType = data.type || MessageType.INFO;
        this.mTimetamp = Date.now();
    }

    get message() {
        return this.mMessage;
    }

    get messageId() {
        return this.mMessageId;
    }

    get values() {
        return this.mValues;
    }

    get type() {
        return this.mType;
    }

    get timestamp() {
        return this.mTimetamp;
    }
}

export function successMessage(messageId, values) {
    return new Message({
        messageId,
        values,
        type: MessageType.SUCCESS
    });
}

export function infoMessage(messageId, values) {
    return new Message({
        messageId,
        values,
        type: MessageType.INFO
    });
}

export function errorMessage(messageId, values) {
    return new Message({
        messageId,
        values,
        type: MessageType.ERROR
    });
}
