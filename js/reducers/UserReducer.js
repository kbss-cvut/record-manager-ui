import * as ActionConstants from "../constants/ActionConstants";

const initialState = {
    userCreation: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionConstants.UPDATE_USER:
            console.log("Reducer update user called.")
            return {...state, done: true}
        case ActionConstants.CREATE_USER_FETCHING:
            console.log("Creating new user.");
            return {
                ...state,
                userCreation: {
                    fetching: true
                }
            };
        case ActionConstants.CREATE_USER_COMPLETE:
            console.log("New user created.");
            return {
                ...state,
                userCreation: {
                    fetching: false,
                    error: false
                }
            };
        case ActionConstants.CREATE_USER_ERROR:
            console.log("Creating new user failed.");
            return {
                ...state,
                userCreation: {
                    fetching: false,
                    error: true
                }
            }
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