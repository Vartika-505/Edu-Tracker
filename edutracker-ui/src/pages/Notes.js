import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from './Navbar';

const Notes = ({ username }) => {
    const { notes, createNote, fetchNotes, selectedSubject, setSelectedSubject } = useNotes();
    const [newFileName, setNewFileName] = useState('');
    const [newFileContent, setNewFileContent] = useState('');
    const [newSubject, setNewSubject] = useState(''); // New state for adding subject
    const [subjects, setSubjects] = useState(['Math', 'Science', 'History']); // Initial subjects
    const [showTasks, setShowTasks] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const userId = localStorage.getItem('userId');

    // Load the selectedSubject from localStorage if it exists
    useEffect(() => {
        const savedSubject = localStorage.getItem('selectedSubject');
        if (savedSubject) {
            setSelectedSubject(savedSubject); // Set the saved subject to state
        }
    }, [setSelectedSubject]);

    useEffect(() => {
        if (userId && selectedSubject) {
            fetchNotes(userId, selectedSubject);
        }
    }, [userId, selectedSubject, fetchNotes]);

    const handleAddNote = async () => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const note = { title: newFileName, content: newFileContent, userId, subject: selectedSubject };
        await createNote(note);
        setNewFileContent('');
        setNewFileName('');
        setShowEditor(false);
    };

    const handleAddSubject = () => {
        if (newSubject.trim() && !subjects.includes(newSubject)) {
            setSubjects([...subjects, newSubject]);
            setNewSubject('');
        }
    };

    // Save edited file
    const handleSaveEdit = async () => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const updatedNote = { ...editingNote, title: newFileName, content: newFileContent };
        await createNote(updatedNote); // Modify this function to update the note in the DB
        setEditingNote(null);
        setNewFileContent('');
        setNewFileName('');
        setShowEditor(false);
    };

    // View file content in a new window
    const handleViewFile = (content) => {
        const newWindow = window.open();
        newWindow.document.write(content);
    };

    // Download the file as .txt
    const handleDownloadFile = (title, content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.txt`;
        link.click();
    };

    // Edit an existing file
    const handleEditFile = (note) => {
        setEditingNote(note); // Set the note to be edited
        setNewFileName(note.title);
        setNewFileContent(note.content);
        setShowEditor(true); // Open the editor
    };

    // Update selected subject and store it in localStorage
    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        localStorage.setItem('selectedSubject', subject); // Store the selected subject in localStorage
    };

    return (
        <>
            <Navbar />
            <div className="mt-[10vw] px-4">
                <h2>Notes for {username}</h2>

                <div className="my-4">
                    {/* Subject Selection */}
                    <select 
                        onChange={handleSubjectChange} 
                        value={selectedSubject} 
                        className="mb-4 p-2 border rounded"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                        ))}
                    </select>

                    {/* New Subject Input */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Add new subject"
                            className="p-2 border rounded"
                        />
                        <button 
                            onClick={handleAddSubject} 
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Subject
                        </button>
                    </div>
                </div>

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
                            onClick={editingNote ? handleSaveEdit : handleAddNote} 
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {editingNote ? 'Save Edit' : 'Add File'}
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
                                    <h4 
                                        className="text-lg font-semibold cursor-pointer" 
                                        onClick={() => handleViewFile(note.content)}
                                    >
                                        {note.title}.txt
                                    </h4>
                                    <button
                                        onClick={() => handleDownloadFile(note.title, note.content)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-2"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleEditFile(note)}
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                                    >
                                        Edit
                                    </button>
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
