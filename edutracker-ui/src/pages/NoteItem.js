import React from 'react';

const NoteItem = ({ note }) => {
    const handleViewFile = (content) => {
        const newWindow = window.open();
        newWindow.document.write(content);
    };

    return (
        <div>
            {/* Only show file name */}
            <h3 
                className="cursor-pointer text-lg font-semibold"
                onClick={() => handleViewFile(note.content)}
            >
                {note.title}.txt
            </h3>
            {/* Content is hidden, only file name is displayed */}
            <small>{new Date(note.createdAt).toLocaleString()}</small>
        </div>
    );
};

export default NoteItem;
