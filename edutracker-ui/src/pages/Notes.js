import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext'; 
import Navbar from './Navbar';

const Notes = ({ username }) => {
    const { notes, createNote } = useNotes();
    const [newFileName, setNewFileName] = useState(''); // Renamed for clarity
    const [newFileContent, setNewFileContent] = useState(''); // Renamed for clarity
    const [showTasks, setShowTasks] = useState(false); // Toggle for tasks display
    const [showEditor, setShowEditor] = useState(false); // Toggle for editor display
    const userId = localStorage.getItem('userId');

    const handleAddNote = async () => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const note = { title: newFileName, content: newFileContent, userId }; // Assign title as file name and content as body
        await createNote(note);
        setNewFileContent('');
        setNewFileName('');
        setShowEditor(false); // Close editor after creating note
    };

    return (
        <>
            <Navbar />
            <div className="mt-[10vw] px-4">
                <h2>Notes for {username}</h2>

                <div className="buttons flex gap-4 my-4">
                    <button 
                        onClick={() => setShowTasks(!showTasks)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {showTasks ? "Hide Files" : "View Files"}
                    </button>

                    <button 
                        onClick={() => setShowEditor(!showEditor)} 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        {showEditor ? "Close Editor" : "Create File"}
                    </button>
                </div>

                {/* File Editor Section */}
                {showEditor && (
                    <div className="note-editor bg-gray-100 p-4 rounded shadow mb-4">
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="File name"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                            placeholder="File content"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <button 
                            onClick={handleAddNote} 
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add File
                        </button>
                    </div>
                )}

                {/* File Display Section */}
                {showTasks && (
                    <div>
                        <h3>All Files</h3>
                        {notes.length === 0 ? (
                            <p>No files available.</p>
                        ) : (
                            notes.map((note) => (
                                <div key={note._id} className="task bg-white p-4 mb-2 rounded shadow">
                                    <h4 className="text-lg font-semibold">{note.title}</h4> {/* File name */}
                                    <p>{note.content}</p> {/* File content */}
                                    <small>{new Date(note.createdAt).toLocaleString()}</small>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Notes;
