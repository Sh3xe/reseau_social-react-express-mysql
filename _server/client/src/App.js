import React from 'react';

import {BrowserRouter as Router} from "react-router-dom";

import SiteRouter from "./Routes.js";
import Navigation from "./components/Navigation.js";

import "./style.css";

export const UserContext = React.createContext({
    user: undefined,
    setUser: () => {},
    refreshUser: () => {}
});

export default function App() {

    const [user, setUser] = React.useState(undefined);

    const getUser = function() {
        fetch("/api/current_user")
            .then(res => res.json())
            .then(user => setUser(user))
            .catch(() => {
                setUser(false);
            })
    }

    React.useEffect(getUser, []);

    const value = {
        user,
        setUser,
        refreshUser: getUser
    }
    
    return (
        <UserContext.Provider value={value}>
            <Router>
                {user !== false && user !== undefined ? <Navigation /> : ""}
                {user !== undefined ? <SiteRouter /> : ""}
            </Router>
        </UserContext.Provider>
    );
}