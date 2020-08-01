import React from "react";

import Message from "../Utils/Message.js";
import {formatDate, getUrlQuery} from "../../utils.js";
import {Link} from "react-router-dom";

function Post({post}) {
    return (
        <div className="post">
            <div className="post-header">
                <img src={`/${post.user_avatar}`} alt=""/>
                <div className="post-infos">
                    <div className="post-subtitle">
                        Par <strong><Link to={`/user/${post.post_user}`}>{post.user_name}</Link></strong> le {formatDate(new Date(post.post_date))}
                    </div>
                    <div className="post-subtitle"> {post.post_date !== post.post_edit_date ? <abbr title={formatDate(post.post_edit_date)}> (Modifié)</abbr> : ""} {post.post_views} vue(s)</div>
                </div>
            </div>
            <div className="post-preview">
                <Link className="post-preview-content" to={`/post/${post.post_id}`}>{`${post.post_title.substr(0, 33)}...`}</Link>
            </div>
        </div>
    );
}

function CategorySelector({category, changeCategory}) {

    const handleCategoryChange = function(e) {
        e.preventDefault();
        changeCategory(e.target.innerText);
    }

    const categories = ["Tout", "Jeux vidéos", "Memes"];
    
    let categories_el = [];
    categories.forEach(e => {
        categories_el.push(
        <li key={e} className={e === category ? "selected" : ""}>
            <a href="/" onClick={handleCategoryChange}>{e}</a>
        </li>);
    });

    return (
        <React.Fragment>
            <h1>Catégories</h1>
            <ul>
				{categories_el}
            </ul>
        </React.Fragment>
    );
}

function PostsContainer({start, posts, changePage}) {
    //Vars
    const step = 14;

    //Functions
    const pagePlus = function() {
        if(posts.length > step)
            changePage(1);
    }

    const pageMinus = function() {
        if(start >= step) 
            changePage(-1);
    }

    //Render
    let post_el = [];

    posts.forEach(post => {
        post_el.push(<Post key={post_el.length} post={post} />);
    });

    // We get 1 more element to know if there is another page
    // but we don't want to display this element
    if(post_el.length === step + 1) post_el.pop();

    return (
       <React.Fragment>
        <div className="posts-feed">
            {post_el}
        </div>
        { posts.length > 14 || start >=14 ? // If there is another page or if we are not in the first page we display the "next" and "prev"
            <div className="page-controller">
                <button className="button norm" onClick={pageMinus}>Page précédente</button>
                <button className="button norm" onClick={pagePlus}>Page suivante</button>
            </div> : ""
        }
        </React.Fragment>
    );
}

export default function Posts() {
    //Hooks
    const [state, setState] = React.useState({
        category: "Tout",
        search: "",
        start: 0,
    });

    const step = 14;

    const [posts, setPosts] = React.useState([]);
    const [search_timeout, setSearchTimeout] = React.useState(null);
    const [messages, setMessages] = React.useState([]);

    //Functions
    const handleSearchChange = function(e) {
        //handle the search query change
        const value = e.target.value;
        setState({
            ...state,
            search: value
        });
    }

    const handleCategoryChange = function(new_category) {
        setState({...state, start: 0, category: new_category});
    }

    const handlePageChange = function(value) {
        if(value === -1) {
            setState({ ...state, start: state.start - step });
        } else if(value === 1) {
            setState({ ...state, start: state.start + step });
        }
    }
    
    const searchPosts = function() {
        const url_query = getUrlQuery({
            start: state.start,
            search: state.search,
            step: step + 1,
            category: state.category
        }); // returns a "?key1=value1&key2=val2"

        const url = "api/posts?" + url_query;

        fetch(url)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(() => setMessages([{content: "Erreur de chargement", col:"red"}]));
    };

    React.useEffect(searchPosts, [state.category, state.start]);

    React.useEffect(() => {
        if(search_timeout) {
            clearTimeout(search_timeout);
        }
        setSearchTimeout(setTimeout(searchPosts, 500));
        // eslint-disable-next-line
    }, [state.search]);

    //Page
    return (
        <React.Fragment>
        <aside className="container-aside">
            <CategorySelector changeCategory={handleCategoryChange} category={state.category}/>
        </aside>
        <div className="container-content">
            <form action="" method="get" className="search-bar">
                <input 
                    type="text" className="input t2" placeholder="Rechercher" 
                    onChange={handleSearchChange}
                />
            </form>
            <Message messages={messages}/>
            <PostsContainer start={state.start} posts={posts} changePage={handlePageChange}/>
        </div>
        </React.Fragment>
    );
}