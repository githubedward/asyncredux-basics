import * as types from './types';

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
    type: type.REQUEST_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}