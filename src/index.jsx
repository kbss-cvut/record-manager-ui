'use strict';

import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import reduxThunk from "redux-thunk";
import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import rootReducer from "./reducers";
import {errorLogger, historyLogger} from "./utils/HistoryLogger";
import App from './App';


// store initialization
const createStoreWithMiddleware = composeWithDevTools(
    applyMiddleware(reduxThunk, historyLogger),
)(createStore);

export const store = createStoreWithMiddleware(rootReducer);

window.onerror = (msg, source, line) => {
    errorLogger(msg, line, store);
    return false;
};
const app = document.getElementById('content');
const root = createRoot(app);
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
