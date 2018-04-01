import {axiosBackend} from "./index";

export function logAction(action, author, timestamp) {
    const type = action.type;
    axiosBackend.post('rest/action-history', {author, timestamp, type, payload: JSON.stringify(action)});
}