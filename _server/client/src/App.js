import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import Navigation from "./Navigation";
import Home from "./Home";
import Post from "./Post";

import "../public/style.css";

function App() {
    return (
        <Router>
            <Navigation />

            <Route path="/" exact component={Home}/>
            <Route path="/post" component={Post}/>
        </Router>
    );
}

export default App;
