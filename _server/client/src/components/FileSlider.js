import React from  "react";

function Page({files, selected}) {
    const file = files[selected];
    const type = file.file_mime.split("/")[0];
    let content = null;

    switch(type) {
        case "image":
            content = <img 
                alt=""
                src={`/${file.file_name}`}
                className="slider-content"
            ></img>
            break;
        case "video":
            content = "";
            content = <video controls>
                <source src={`/${file.file_name}`} type={file.file_mime}></source>
            </video>;
            break;
        default: break;
    }

    return (
        <div className="slider">
            {content}
        </div>
    );
}

function PageSelector({changePage, selected, length}) {

    const radio_el = [];

    const prev = function() {
        if(selected > 0)
            changePage(-1);
    }

    const next = function() {
        if(selected < length - 1)
            changePage(+1);
    }

    for(let i = 0; i < length; i++) {
        radio_el.push(
            <input readOnly={true} type="radio" name="slider-selector" key={i} checked={i === selected ? true : false}></input>
        );
    }

    return (
        <div className="slider-controller">
            <button onClick={prev}>&lt;-</button>
            {radio_el}
            <button onClick={next}>-&gt;</button>
        </div>
    );
}

export default function FileSlider({files}) {
    //Hooks
    const [selected, setSelected] = React.useState(0);

    //Functions
    const handlePageChange = function(value) {
        setSelected(selected + value);
    }

    //Render
    if(!files.length) return <div></div>;

    return (
        <div>
            <Page files={files} selected={selected}/>
            <PageSelector changePage={handlePageChange} selected={selected} length={files.length}/>
        </div>
    );
}