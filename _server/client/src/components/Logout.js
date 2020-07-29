import React from "react";

import {UserContext} from "../App.js";

export default function Logout({history}) {

    //We remove the user and the session cookie, we go to the "/" page

    const {setUser} = React.useContext(UserContext);

    fetch("/api/logout");

    setUser(undefined);

    history.push("/");

    return (<div></div>);
}