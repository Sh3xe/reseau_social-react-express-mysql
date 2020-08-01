import React from "react";
import {Link} from "react-router-dom";

import {UserContext} from "../App.js";

export default function() {
    const {user, setUser} = React.useContext(UserContext);

    const handleLogout = function(e) {
        e.preventDefault();
        
        fetch("/api/logout")
            .then(() => {
                setUser(false);
            });
    }

    return (
        <header className="site-header">
            <div className="header-container">
                <ul className="site-nav">
                    <li><Link to="/">Accueil</Link></li>
                    <li className="dropdown">
                        <Link to="/post-redirection">Posts</Link>
                        <ul className="dropdown-content">
                            <li><Link to="/posts">Chercher</Link></li>
                            <li><Link to="/upload">Mettre en ligne</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <Link to="/community-redirection">Communauté</Link>
                        <ul className="dropdown-content">
                            <li><Link to="/chatrooms">Salons</Link></li>
                            <li><Link to="/users">utilisateurs</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/games">Jeux</Link></li>
                </ul>
                <ul className="site-user">
                    <li className="dropdown">
                        <Link to="/me-redirection">Mon compte</Link>
                        <ul className="dropdown-content">
                            <li><Link to={`/user/${user.user_id}`}>Profil</Link></li>
                            <li><Link to="/dashboard">Paramètres</Link></li>
                            <li><a href="/" onClick={handleLogout}>Se deconnecter</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
}