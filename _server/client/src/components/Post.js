import React from "react";

import {Link} from "react-router-dom";
import {formatDate, sendForm, getUrlQuery, escapeAndParse} from "../utils.js";
import {UserContext} from "../App.js";

import FileSlider from "./FileSlider.js";
import Message from "./Message.js";

function Comments({post_id, history}) {
    //Hooks
    const [state, setState] = React.useState({
        comment_content: "",
        start: 0,
        step: 9
    });

    const {user} = React.useContext(UserContext);
    const [comments, setComments] = React.useState([]);

    //Functions
    const handleFormChange = function(e) {
        const value = e.target.value;
        if(value.length > 250) return;

        setState({
            ...state,
            comment_content: value
        });
    }

    const handleSubmit = function(e) {
        e.preventDefault();

        const params = {
            url: `/api/post/${post_id}/comments`,
            method: "POST",
            type: "json"
        }

        const form_body = {
            content: state.comment_content
        }

        sendForm(params, form_body, (err) => {
            if(!err) {
                history.push(`/post/${post_id}`);
            } else console.log("problème");
        });
    }

    const deleteComment = function(comment_id) {
        fetch(`/api/post/${post_id}/comment/${comment_id}`, {
            method: "DELETE"
        });
    }

    const getCommentsElement = function() {
        let el = [];
        for(let i = 0; i < comments.length; i++) {
            el.push(
                <div className="comment" key={i}>
                    <div className="comment-header">
                        Par <Link to={`/user/${comments[i].comment_user}`}>{comments[i].user_name}</Link> le {formatDate(new Date(comments[i].comment_date))}
                        { user.user_id === comments[i].comment_user ?
                            <button className="confirmation-button" onClick={() => {
                                deleteComment(comments[i].comment_id)
                            }}>Supprimer</button> : ""
                        }
                    </div>
                    <div className="comment-content"> {comments[i].comment_content}</div>
                </div>
            );
        }

        return el;
    }

    const prev = function() {
        if(state.start >= 8) {
            setState({
                ...state,
                start: state.start - 8
            });
        }
    }

    const next = function() {
        if(comments.length > 8) {
            setState({
                ...state,
                start: state.start + 8
            });
        }
    }

    React.useEffect(() => {
        const url_query = getUrlQuery({
            start: state.start,
            step: 9
        });

        fetch(`/api/post/${post_id}/comments?${url_query}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(() => console.log("pasbien"))
    }, [post_id, state.start]);

    let comment_el = getCommentsElement();

    return (
        <React.Fragment>
        <form className="comment-form">
            <textarea className="input t1" placeholder="Laisser un commentaier (/250)"
                onChange={handleFormChange} value={state.comment_content}
            ></textarea>
            <button className="button col1" onClick={handleSubmit}>Submit</button>
        </form>
        <div className="comments">
            {comment_el}
            { comments.length > 8 || state.start >=8?
            <div className="page-controller">
                <button className="button norm" onClick={prev}>Page précédente</button>
                <button className="button norm" onClick={next}>Page suivante</button>
            </div>: ""}
        </div>
        </React.Fragment>
    );
}

function AsideController({curr_user, post_user, post_id, history}) {

    //Hooks
    const [state, setState] = React.useState({
        message: false,
        report_content: "",
    });

    //Functions
    const showMessage = function(e) {
        switch(e.target.innerText) {
            case "Signaler":
                setState({...state, message:"report"});
                break;
            case "Supprimer":
                setState({...state, message:"delete"});
                break;
            default: break;
        }
    }

    const handleReportContentChange = function(e) {
        if(e.target.value.length <=250) {
            const value = e.target.value;
            setState({...state, report_content: value});
        }
    }

    const handleClose = function() {
        setState({...state, message: false});
    }

    const handleReport = function() {
        const content = {
            content: state.report_content.substr(0, 250)
        };

        const params = {
            url: `/api/post/${post_id}/report`,
            method: "POST",
            type: "json"
        }

        sendForm(params, content, (err) => {
            handleClose();
        });
    }

    const handleRemove = function() {
        fetch(`/api/post/${post_id}`, {method:"DELETE"})
            .then( res => {
                if(res.ok) {
                    history.push("/posts");
                } else {
                    console.log("problème")
                }
            })
    }

    return (
        <React.Fragment>
        <button className="button norm" onClick={showMessage}>Signaler</button>
        { curr_user.user_id === post_user ?
            <React.Fragment>
            <Link to={`/post/${post_id}/edit`}><button className="button norm" >Modifier</button></Link>
            <button className="button norm" onClick={showMessage}>Supprimer</button>
            </React.Fragment> : ""
        }
        
        { state.message === "delete" ? 
        <div className="aside-confirmation">
            <p> Voulez vous supprimer ce Post? </p>
            <button onClick={handleRemove}>Suprimmer</button>
            <button onClick={handleClose}>Annuler</button>
        </div> : ""
        }

        { state.message === "report" ?
        <div className="aside-confirmation">
            <span className="char-counter">{`${state.report_content.length}/250`}</span>
            <textarea 
                placeholder="Raison (250 charactères)"
                onChange={handleReportContentChange}
                value={state.report_content}
            ></textarea>
            <button onClick={handleReport}>Signaler</button>
            <button onClick={handleClose}>Annuler</button>
        </div> : ""
        }

        </React.Fragment>
    );
}

function VoteForm({post_id}) {
    //Hooks
    const [votes, setVotes] = React.useState(0);

    const form_params = {
        method: "PUT",
        url: `/api/post/${post_id}/votes`,
        type: "json"
    }

    //Function
    const voteUp = function() {
        sendForm(form_params, {value: 1}, (err) => {
            if(!err) fetchVoteValues();
        });
    }

    const voteDown = function() {
        sendForm(form_params, {value: -1}, (err) => {
            if(!err) fetchVoteValues();
        });
    }

    const cancelVote = function() {
        sendForm(form_params, {value: 0}, (err) => {
            if(!err) fetchVoteValues();
        });
    }

    const fetchVoteValues = function() {
        fetch(`/api/post/${post_id}/votes`)
            .then(res => res.json())
            .then(votes => setVotes(votes[0].value))
            .catch(() => console.log("can't get the votes"))
    }

    React.useEffect(() => {
        fetchVoteValues();
        // eslint-disable-next-line
    }, [post_id]);

    //Render
    return (
        <div className="vote-form">
        <div className="vote-buttons">
            <button className="vote-up" onClick={voteUp}>+</button>
            <button className="vote-down" onClick={voteDown}>-</button>
        </div>
        <div className={`vote-value ${votes < 0 ? "down" : "up"}`} onClick={cancelVote}> {votes} </div>
        </div>
    );
}

function PostContent({post, files}) {
    return (
    <div className="post">
        <div className="post-header">
            <img src="https://via.placeholder.com/64.png/09f/fff" alt=""/>
            <div className="post-infos">
                <h1 className="post-title"> {post.post_title} </h1>
                <span className="post-subtitle">
                    Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                    {post.post_date !== post.post_edit_date ? `, modifié le ${formatDate(post.post_edit_date)}` : ""}
                </span>
            </div>
            <VoteForm post_id={post.post_id}/>
        </div>
        <FileSlider className="" files={files}/>
        <div className="post-content"> {post.post_content} </div>
    </div>);
}

export default function Post(props) {
    //Hooks
    const [post, setPost] = React.useState({});
    const [messages, setMessages] = React.useState("");
    const [files, setFiles] = React.useState([]);

    const {user} = React.useContext(UserContext);
    const {post_id} = props.match.params;

    //Functions
    React.useEffect(() => {
        fetch(`/api/post/${post_id}`)
            .then(res => res.json())
            .then(post => setPost(post))
            .catch(() => setMessages([{content: "Impossible de trouver ce post", col:"red"}]))

        fetch(`/api/post/${post_id}/files`)
            .then(res => res.json())
            .then(files => setFiles(files))
            .catch(()=>{
                setFiles([]);
            });
    }, [post_id]);
    
    return (
        <React.Fragment>
        <aside className="container-aside post-buttons">
            <AsideController post_user={post.post_user} curr_user={user} post_id={post_id} history={props.history}/>
        </aside>
        <div className="container-content">
            <Message messages={messages} />
            <PostContent post={post} files={files}/>
            <hr/>
            <Comments post_id={post.post_id} history={props.history}/>
        </div>
        </React.Fragment>
    );
}