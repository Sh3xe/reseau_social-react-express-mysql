import React from "react";

import Message from "../Utils/Message.js";

import {Link} from "react-router-dom";
import {UserContext} from "../../App.js";
import {sendForm} from "../../utils.js";

// Sections
function PrivateSettings() {
    //Hooks
    const [messages, setMessages] = React.useState([]);
    const {user, refreshUser} = React.useContext(UserContext);
    const [state, setState] = React.useState({
        password: "",
        email: user.user_email
    });

    //Functions
    const handlePasswordUpdate = function(e) {
        e.preventDefault();
        
        const params = {
            method: "PATCH",
            url: "/api/dashboard",
            type: "json"
        }

        sendForm(params, {password: state.password}, (err) => { // ajouter les reponses
            if(!err) {
                refreshUser();
                setMessages([{
                    content: "Mot de passe modifié!",
                    col: "green"
                }]);
            } 
            else {
                setMessages([{
                    content: "Impossible de mettre à jour le mot de passe",
                    col: "red"
                }]);
            }
        });
    }

    const handleEmailUpdate = function(e) {
        e.preventDefault();
        
        const params = {
            method: "PATCH",
            url: "/api/dashboard",
            type: "json"
        }

        sendForm(params, {email: state.email}, (err) => { // ajouter les reponses
            if(!err) {
                refreshUser();
                setMessages([{
                    content: "E-mail modifié!",
                    col: "green"
                }]);
            } 
            else {
                setMessages([{
                    content: "Impossible de mettre à jour l'E-mail",
                    col: "red"
                }]);
            }
        });
    }

    const handleInputChange = function(e) {
        const value = e.target.value;

        switch(e.target.name) {
            case "email":
                if(value.length <= 255)
                    setState({...state, email: value});
                break;
            case "password":
                if(value.length <= 60)
                    setState({...state, password: value});
                break;
            default: break;
        }
    }

    //Render
    return (
        <React.Fragment>
            <Message messages={messages}/>
            <header className="login-head"> Paramètres Privés de <Link to={`/user/${user.user_id}`}>{user.user_name}</Link></header>
            <form className="login-form">
                <h3>Informations</h3>
                <hr/>
                <div>
                    <label htmlFor="email">E-mail <span className="char-counter">{`${state.email.length}/255`}</span></label>
                    <button className="confirmation-button"
                        onClick={handleEmailUpdate}
                    >Mettre à jour</button>
                </div>
                <input type="email" name="email"
                    className="input t1"
                    onChange={handleInputChange}
                    value={state.email}
                ></input>
                <div>
                    <label htmlFor="email">Mot de passe <span className="char-counter">{`${state.password.length}/60`}</span></label>
                    <button className="confirmation-button"
                        onClick={handlePasswordUpdate}
                    >Mettre à jour</button>
                </div>
                <input type="text" name="password"
                    className="input t1"
                    onChange={handleInputChange}
                    value={state.password}
                ></input>
            </form>
        </React.Fragment>
    );
}

function PublicSettings() {
    //Hooks
    const file_input_ref = React.useRef(null);
    const {user, refreshUser} = React.useContext(UserContext);

    const [messages, setMessages] = React.useState([]);
    const [state, setState] = React.useState({
        username: user.user_name || "",
        bio: user.user_bio || "",
        col1: user.col1,
        grd1: user.grd1,
        grd2: user.grd2
    });

    //Functions
    const handleUsernameUpdate = function(e) {
        e.preventDefault();
        
        const params = {
            method: "PATCH",
            url: "/api/dashboard",
            type: "json"
        }

        sendForm(params, {username: state.username}, (err) => { // ajouter les reponses
            if(!err) {
                refreshUser();
                setMessages([{
                    content: "Nom d'utilisateur modifié!",
                    col: "green"
                }]);
            } else {
                setMessages([{
                        content: "Impossible de mettre à jour le nom d'utilisateur",
                    col: "red"
                }]);
            }
        });
    }

    const handleBioUpdate = function(e) {
        e.preventDefault();
        
        const params = {
            method: "PATCH",
            url: "/api/dashboard",
            type: "json"
        }

        sendForm(params, {bio: state.bio}, (err) => { // ajouter les reponses
            if(!err) {
                refreshUser();
                setMessages([{
                    content: "Bio modifié!",
                    col: "green"
                }]);
            } 
            else {
                setMessages([{
                    content: "Impossible de mettre à jour la bio",
                    col: "red"
                }]);
            }
        });
    }

    const handleAvatarUpdate = function(e) {
        e.preventDefault();

        const form_data = new FormData();

        const params = {
            method: "PUT",
            url: `/api/dashboard/avatar`
        }

        form_data.append("avatar", file_input_ref.current.files[0]);

        sendForm(params, form_data, (err) => {
            if(!err) setMessages([{content: "Avatar Modifié!", col: "green"}]);
            else setMessages([{content: "Impossible de mettre à jour l'avatar", col: "red"}]);
        });
    }

    const handleInputChange = function(e) {
        const value = e.target.value;

        switch(e.target.name) {
            case "username":
                if(value.length <= 100)
                    setState({ ...state, username: value });
                break;
            case "userbio":
                if(value.length <= 1317)
                    setState({ ...state, bio: value }); 
                break;
            default: break;
        }
    }

    const handleColorUpdate = function(e) {
        e.preventDefault();
        
        const params = {
            method: "PATCH",
            url: "/api/dashboard",
            type: "json"
        }

        const colors = {
            col1: state.col1,
            grd1: state.grd1,
            grd2: state.grd2
        }

        sendForm(params, {colors}, (err) => { // ajouter les reponses
            if(!err) {
                refreshUser();
                setMessages([{
                    content: "Couleurs modifiées!",
                    col: "green"
                }]);
            } 
            else {
                setMessages([{
                    content: "Impossible de mettre à jour les couleurs",
                    col: "red"
                }]);
            }
        });
    }

    const handleColorChange = function(e) {
        const value = e.target.value;

        switch(e.target.name) {
            case "col1":
                setState({...state, col1: value});
                break;
            case "grd1":
                setState({...state, grd1: value});
                break;
            case "grd2":
                setState({...state, grd2: value});
                break;
            default: break;
        }
    }

    //render
    return (
        <React.Fragment>
            <Message messages={messages}/>
            <header className="login-head"> Paramètres Publics de <Link to={`/user/${user.user_id}`}>{user.user_name}</Link></header>
            <form className="login-form">
                <h3>Informations</h3>
                <hr/>
                <div>
                    <label htmlFor="username">Nom d'utilisateur <span className="char-counter">{`${state.username.length}/100`}</span></label>
                    <button className="confirmation-button"
                        onClick={handleUsernameUpdate}
                    >Mettre à jour</button>
                </div>
                    <input type="text" name="username"
                        className="input t1"
                        onChange={handleInputChange}
                        value={state.username}
                    ></input>
                <div>
                    <label htmlFor="userbio">Bio <span className="char-counter">{`${state.bio.length}/1317`}</span></label>
                    <button className="confirmation-button"
                        onClick={handleBioUpdate}
                    >Mettre à jour</button>
                </div>
                    <textarea type="text" name="userbio"
                        className="input t1"
                        onChange={handleInputChange}
                        value={state.bio}
                    ></textarea>
                <div>
                    <label htmlFor="avatar">Photo de profil</label>
                    <button className="confirmation-button"
                        onClick={handleAvatarUpdate}
                    >Mettre à jour</button>
                </div>
                    <input type="file" name="avatar"
                        ref={file_input_ref}
                    ></input>
                <h3>Couleurs du profil</h3>
                <hr />
                <button className="confirmation-button extended" onClick={handleColorUpdate}>Mettre à jour</button>
                <div className="color-container">
                    <input type="color" name="col1" 
                        value={state.col1}
                        onChange={handleColorChange}
                    />
                    <input type="color" name="grd1"
                        value={state.grd1}
                        onChange={handleColorChange}
                    />
                    <input type="color" name="grd2"
                        value={state.grd2}
                        onChange={handleColorChange}
                    />
                </div> 
                <div className="mini-profile" style={{background: `linear-gradient(${state.grd1}88, ${state.grd2}88)`}}>
                    <header className="mini-profile-header" style={{background: state.col1}}>
                        <img src="/default-avatar.png" alt=""/>
                        <span>Nom</span>
                    </header>
                    <main className="mini-profile-main">
                        <div className="mini-profile-prt1">
                            <div className="mini-profile-rect" style={{borderTopColor: state.col1}}></div>
                            <div className="mini-profile-rect" style={{borderTopColor: state.col1}}></div>
                        </div>
                        <div className="mini-profile-posts">
                            <div className="mini-profile-rect" style={{borderTopColor: state.col1}}></div>
                        </div>
                    </main>
                </div>
            </form>
        </React.Fragment>
    );
}

// Section selection
function Sections({section}) {
    // Redirect to the right section function
    // depending on the section prop

    let section_el = "";

    switch(section) {
        case "Public":
            section_el = < PublicSettings/>;
            break;
        case "Privée":
            section_el = < PrivateSettings/>;
            break;
        default: break;
    }

    //Render
    return (
        <div>{section_el}</div>
    );
}

function SectionSelector({changeSection}) {
    //Vars
    const sections = ["Public", "Privée"];
    let section_el = [];

    //Hooks
    const [section, setSection] = React.useState("Public");

    //Functions
    const handleSectionChange = function(e) {
        e.preventDefault();
        const value = e.target.innerText;

        // set the local section
        setSection(value);
        //change the section of the parent element
        changeSection(value);
    }

    sections.forEach( s => {
        section_el.push(
            <li className={s === section ? "selected" : ""} key={s}>
                <a href="/" onClick={handleSectionChange}>{s}</a>
            </li>
        );
    });

    //Render
    return (
        <ul>
            {section_el}
        </ul>
    );
}

// Main
export default function Dashborad() {
    const [section_name, setSectionName] = React.useState("Public");

    return (
        <React.Fragment>
        <aside className="container-aside">
            <SectionSelector changeSection={setSectionName}/>
        </aside>
        <div className="container-content">
            <Sections section={section_name}/>
        </div>
        </React.Fragment>
    );
}