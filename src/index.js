import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetchPosts, fetchPostsIfNeeded } from './actions/index';
import rootReducer from './reducers/reducers';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, /* let us dispatch() functions */
    loggerMiddleware /* neat middleware that logs actions */
  )
)

store.dispatch(selectSubreddit('reactjs'))
store
  .dispatch(fetchPostsIfNeeded('reactjs'))
  .then(() => console.log(store.getState()))

ReactDOM.render(<App />, document.getElementById('root'));

