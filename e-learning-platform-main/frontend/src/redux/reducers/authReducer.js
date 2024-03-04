import ACTIONS from '../actions/'

const initialState = {
    user: [],
    isLogged: false,
    isAdmin: false,
    loading: false
}

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogged: true,
                loading: true,
            }
        case ACTIONS.GET_USER:
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                // sper ca e corecta verificarea asta aici
                isAdmin: action.payload.user.roles.includes("admin")
            }
        default:
            return state
    }
}

export default authReducer