import React from 'react';

import {BrowserRouter as Router} from "react-router-dom";

import SiteRouter from "./Routes.js";
import Navigation from "./components/Navigation.js";

import "./style.css";

export const UserContext = React.createContext({
    user: undefined,
    setUser: () => {}
});

export default function App() {

    const [user, setUser] = React.useState(undefined);

    React.useEffect(() => {
        fetch("/api/current_user")
            .then(res => res.json())
            .then(user => setUser(user))
            .catch(() => {
                setUser(false);
            })
    }, []);

    const value = {
        user,
        setUser
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