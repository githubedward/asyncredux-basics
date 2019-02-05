import * as types from './types';
import fetch from 'cross-fetch';

// Action Creators
// actions governed by UI interactions
export function selectSubreddit(subreddit) {
  return {
    type: types.SELECT_SUBREDDIT,
    subreddit
  }
}

export function invalidateSubreddit(subreddit) {
  return {
    type: types.INVALIDATE_SUBREDDIT,
    subreddit
  }
}

// actions governed by network requests
export function requestsPosts(subreddit) {
  return {
    type: types.REQUEST_POSTS,
    subreddit
  }
}

export function receivePosts(subreddit, json) {
  return {
    type: types.REQUEST_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

// ASYNC ACTION CREATOR

// thunk action creator
function fetchPosts(subreddit) {
  // Thunk middleware passes the dispatch method as an argument to the function
  // thus making it able to dispatch action itself
  return function(dispatch) {
    // First dispatch: the app state is update to inform that the API call is starting.
    
    dispatch(requestsPosts(subreddit))

    // function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json(),
      // Do not use catch, because that will also catch
      // any errors in the dispatch and resulting render,
      // causing a loop of 'Unexpected batch number' errors.
      // https://github.com/facebook/react/issues/6895
      error => console.log('ERROR: ', error)
      )
      .then(json => dispatch(receivePosts(subreddit, json))
      // We can dispatch many times!
      // Here, we update the app state with the results of the API call.
      )
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    } else {
      return Promise.resolve()
    }
  }
}