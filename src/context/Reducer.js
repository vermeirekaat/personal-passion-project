const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'ADD_USER':
            return {
                ...state,
                users: state.users.concat(action.payload)
            };
        case 'LOSE_LIFE':
            return {
                ...state,
                users: state.users[0] = action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default Reducer;