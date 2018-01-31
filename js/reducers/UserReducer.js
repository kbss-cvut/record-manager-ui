import * as ActionConstants from "../constants/ActionConstants";

export default function (state = null, action) {
    switch (action.type) {
        case ActionConstants.UPDATE_USER:
            console.log("Reducer update user called.")
            return { ...state, done: true}
    }
    return state;
}
// export default function () {
//     return {
//         firstName: '',
//         lastName: '',
//         username: '',
//         emailAddress: '',
//         password: Utils.generatePassword(),
//         isAdmin: false,
//         isNew: true
//     };
// }