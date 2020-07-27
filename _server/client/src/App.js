import React from 'react';

import {BrowserRouter as Router} from "react-router-dom";
import Cookies from "js-cookie";

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
        if(Cookies.get("user")) {
            fetch("api/current_user")
                .then(res => res.json())
                .then(user => setUser(user))
        }
    }, []);

    const value = React.useMemo(() => {
        return {
            user,
            setUser
        }
    }, [user, setUser]);

    return (
        <UserContext.Provider value={value}>
            <Router>
                {user ? <Navigation /> : ""}
                {user !== undefined ? <SiteRouter /> : ""}
            </Router>
        </UserContext.Provider>
    );
}