import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import rootSaga from "./saga";
import logger from "redux-logger";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// initial state
const initialState = {}

// add all middleware here
const middleware = [sagaMiddleware]

// devtools setup
const devTools = process.env.NODE_ENV === 'production' ? applyMiddleware(...middleware) : composeWithDevTools(applyMiddleware(...middleware, logger))

// create the store with middleware
const store = createStore(reducer, initialState, devTools);

// export store
export default store;

// run saga
sagaMiddleware.run(rootSaga);