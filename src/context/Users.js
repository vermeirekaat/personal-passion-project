import React, { createContext, useState } from "react";

const UsersProvider = ({ children }) => {

    const [users, setUsers] = useState([]);
    return (
        <usersContext.Provider value={[users, setUsers]}>
            {children}
        </usersContext.Provider>
    )
};

export const usersContext = createContext();
export default UsersProvider;