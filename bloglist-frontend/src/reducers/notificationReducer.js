const initialState = null
var timeout

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET':
    return action.data
  case 'CLEAR':
    return action.data
  default: return state
  }
}

export const setNotification = (message, type, time) => {
  return async dispatch => {
    clearTimeout(timeout)
    dispatch({
      type: 'SET',
      data: {
        message,
        type
      }
    })
    timeout = setTimeout(() => {
      dispatch({
        type: 'SET',
        data: null
      })
    }, time*1000)
  }
}

export default reducer