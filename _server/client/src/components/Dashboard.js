import React from "react";

import Message from "./Message.js";

import {Link} from "react-router-dom";
import {UserContext} from "../App.js";
import {sendForm} from "../utils.js";

// Sections
function PrivateSettings() {
    //Hooks
    const {user} = React.useContext(UserContext);

    //Functions

    //Render
    return (
        <React.Fragment>
            <header className="login-head"> Paramètres Privés de <Link to={`/user/${user.user_id}`}>{user.user_name}</Link></header>
            <form className="login-form">
                <div>
                    <label htmlFor="email">E-Mail</label>
                    <input type="text" name="email"
                        className="input t1"
                    ></input>
                </div>
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
        bio: user.user_bio || ""
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

    const handleInputUpdate = function(e) {
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

    //render
    return (
        <React.Fragment>
            <Message messages={messages}/>
            <header className="login-head"> Paramètres Publics de <Link to={`/user/${user.user_id}`}>{user.user_name}</Link></header>
            <form className="login-form">
                <div>
                    <label htmlFor="username">Nom d'utilisateur <span className="char-counter">{`${state.username.length}/100`}</span></label>
                    <button className="confirmation-button"
                        onClick={handleUsernameUpdate}
                    >Mettre à jour</button>
                </div>
                    <input type="text" name="username"
                        className="input t1"
                        onChange={handleInputUpdate}
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
                        onChange={handleInputUpdate}
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