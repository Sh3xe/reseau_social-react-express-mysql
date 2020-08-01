import React from  "react";

function Page({files, selected}) {
    //get the file obj and the filetype form the mimetype
    const file = files[selected];
    const type = file.file_mime.split("/")[0];
    let content = undefined;

    //get the right element depending on the filetype
    switch(type) {
        case "image":
            content = <img 
                alt=""
                src={`/${file.file_name}`}
                className="slider-content"
            ></img>
            break;
        case "video":
            content = <video className="slider-content" controls>
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
        changePage(-1);
    }

    const next = function() {
        changePage(+1);
    }

    for(let i = 0; i < length; i++) {
        radio_el.push(
            <input readOnly={true} type="radio" name="slider-selector" key={i} checked={i === selected ? true : false}></input>
        );
    }

    return (
        <div className="slider-controller">
            {length !== 1 ? 
            <React.Fragment>
                <button onClick={prev}>&lt;</button>
                {radio_el}
                <button onClick={next}>&gt;</button>
            </React.Fragment> : ""
            }
        </div>
    );
}

export default function FileSlider({files}) {
    //Hooks
    const [selected, setSelected] = React.useState(0);

    //Functions
    const handlePageChange = function(value) {
        if(selected + value < 0) {
            setSelected(files.length - 1)
        } else if(selected + value > files.length - 1) {
            setSelected(0)
        } else {
            setSelected(selected + value);
        }
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