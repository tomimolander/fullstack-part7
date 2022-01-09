import storage from '../utils/storage'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.user
  default: return state
  }
}

export const setUserActive = () => {
  const user = storage.loadUser()
  return async dispatch => {
    dispatch({
      type: 'SET_USER',
      user: user,
    })
  }
}

export const setUserDeactive = () => {
  storage.logoutUser()
  return async dispatch => {
    dispatch({
      type: 'SET_USER',
      user: null,
    })
  }
}

export const setUserLogin = (user) => {
  return async dispatch => {
    storage.saveUser(user)
    dispatch({
      type: 'SET_USER',
      user: user,
    })
  }
}

export default reducer
