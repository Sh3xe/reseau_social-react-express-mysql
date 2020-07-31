import React from "react";

import {Link} from "react-router-dom";
import {formatDate, sendForm, getUrlQuery} from "../utils.js";
import {UserContext} from "../App.js";

import FileSlider from "./FileSlider.js";
import Message from "./Message.js";

function Comment({comment, refresh}) {
    //Hooks
    const {user} = React.useContext(UserContext);

    const [state, setState] = React.useState({
        editing: false,
        comment_content: comment.comment_content
    });

    //Functions
    const deleteComment = function() {
        fetch(`/api/post/${comment.comment_post}/comment/${comment.comment_id}`, {
            method: "DELETE"
        }).then(() => refresh());
    }

    const toggleEditState = function() {
        if(state.editing) {
            const params = {
                url: `/api/post/${comment.comment_post}/comment/${comment.comment_id}`,
                method: "PATCH",
                type: "json"
            }

            sendForm(params, {content: state.comment_content}, (err) => {
                if(!err) refresh();
            });
        }
        setState({...state, editing: !state.editing});
    }

    const cancelEdit = function() {
        setState({
            ...state,
            comment_content: comment.comment_content,
            editing: false
        });
    }

    const handleCommentChange = function(e) {
        const value = e.target.value;
        if(state.editing && value.length <= 250) {
            setState({...state, comment_content: value});
        }
    }

    //Render
    return (
        <div className="comment">
            <div className="comment-header">
                <img src={`/${comment.user_avatar}`} alt="" />
                Par <Link to={`/user/${comment.comment_user}`}>{comment.user_name}</Link> le {formatDate(new Date(comment.comment_date))}
                { user.user_id === comment.comment_user ?
                    <React.Fragment>
                        <button className="confirmation-button" onClick={deleteComment}>Supprimer</button>
                        {state.editing ? <button className="confirmation-button" onClick={cancelEdit}>Annuler</button> : ""}
                        <button className="confirmation-button" onClick={toggleEditState}>
                            { state.editing ? "Enregister" : "Modifier"}
                        </button> { state.editing ? `${state.comment_content.length}/250` : ""}
                    </React.Fragment> : ""
                }
            </div>
            <div className="comment-content"> 
                { state.editing ? 
                    <textarea className="edit-comment" 
                        value={state.comment_content}
                        onChange={handleCommentChange}
                    ></textarea> :
                    comment.comment_content
                }
            </div>
        </div>
    );
}

function Comments({post_id}) {
    //Hooks
    const [state, setState] = React.useState({
        comment_content: "",
        start: 0,
        step: 9
    });

    const [comments, setComments] = React.useState([]);
    const [comments_el, setCommentsElement] = React.useState([]);

    //Functions
    const handleFormChange = function(e) {
        const value = e.target.value;
        if(value.length <= 250) {
            setState({...state, comment_content: value });
        }
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
                getComments();
            } else console.log("problème");
        });
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

    const getComments = function() {
        const url_query = getUrlQuery({
            start: state.start,
            step: 9
        });

        fetch(`/api/post/${post_id}/comments?${url_query}`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(() => console.log("pasbien"))
    }

    React.useEffect(getComments, [post_id, state.start]);

    React.useEffect(() => {
        let el = [];
        for(let i = 0; i < comments.length; i++) {
            el.push(
                <Comment key={i} comment={comments[i]} refresh={getComments}/>
            );
        }
        setCommentsElement(el);
        // eslint-disable-next-line
    }, [comments]);

    return (
        <React.Fragment>
        <form className="comment-form">
            <textarea className="input t1" placeholder="Laisser un commentaire"
                onChange={handleFormChange} value={state.comment_content}
            ></textarea>
            <button className="button col1" onClick={handleSubmit}>Submit</button>
            <span className="char-counter">{`${state.comment_content.length}/250`}</span>
        </form>
        <div className="comments">
            {comments_el}
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

    React.useEffect(fetchVoteValues, [post_id]);

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
            <img src={`/${post.user_avatar}`} alt=""/>
            <div className="post-infos">
                <h1 className="post-title"> {post.post_title} </h1>
                <div className="post-subtitle">
                    Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                    {post.post_date !== post.post_edit_date ? `, modifié le ${formatDate(post.post_edit_date)}` : ""} 
                    , {post.post_views} vue(s)
                </div>
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

        fetch(`/api/post/${post_id}/views`, {method: "POST"});
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