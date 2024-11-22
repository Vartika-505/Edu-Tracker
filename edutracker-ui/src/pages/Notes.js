import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

const Notes = ({ username }) => {
    const { notes, createNote, fetchNotes, selectedSubject, setSelectedSubject, updateNote, setNotes } = useNotes();

    const [newFileContent, setNewFileContent] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFileSubject, setNewFileSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null); // Track the ID of the note being edited
    const [deleteNoteId, setDeleteNoteId] = useState(null); // Track which note is being deleted
    const userId = localStorage.getItem('userId');
    const [hasFetchedNotes, setHasFetchedNotes] = useState(false);

    useEffect(() => {
        if (userId && !hasFetchedNotes) {
            fetchNotes();
            setHasFetchedNotes(true);
        }
    }, [userId, hasFetchedNotes, fetchNotes]);

    useEffect(() => {
        if (notes.length > 0) {
            const uniqueSubjects = [...new Set(notes.map((note) => note.subject).filter((subject) => subject))];
            setSubjects(uniqueSubjects);
        } else {
            setSubjects([]);
        }

        if (selectedSubject) {
            const notesForSubject = notes.filter((note) => note.subject === selectedSubject);
            setFilteredNotes(notesForSubject);
        } else {
            setFilteredNotes(notes);
        }
    }, [notes, selectedSubject]);

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        localStorage.setItem('selectedSubject', subject);
        setShowTasks(false);

        if (subject) {
            const notesForSubject = notes.filter((note) => note.subject === subject);
            setFilteredNotes(notesForSubject);
        } else {
            setFilteredNotes(notes);
        }
    };

    const handleAddNote = async () => {
        if (!newFileContent.trim() || !newFileName.trim() || !newFileSubject.trim()) return;
        const note = { title: newFileName, content: newFileContent, userId, subject: newFileSubject, createdAt: new Date().toISOString() };
        await createNote(note);
        setNewFileContent('');
        setNewFileName('');
        setNewFileSubject('');
        setEditingNoteId(null);
    };

    const handleSaveEdit = async (noteId) => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const updatedNote = { _id: noteId, title: newFileName, content: newFileContent, subject: newFileSubject };
        await updateNote(updatedNote);
        setEditingNoteId(null);
        setNewFileContent('');
        setNewFileName('');
        setNewFileSubject('');
    };

    const handleEditFile = (note) => {
        setEditingNoteId(note._id);
        setNewFileName(note.title);
        setNewFileContent(note.content);
        setNewFileSubject(note.subject);
    };

    const handleDownloadFile = async (title, content, format) => {
        if (format === 'txt') {
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${title}.txt`;
            link.click();
        } else if (format === 'pdf') {
            const pdf = new jsPDF();
            pdf.text(content, 10, 10);
            pdf.save(`${title}.pdf`);
        } else if (format === 'word') {
            const doc = new Document({
                sections: [
                    {
                        children: [new Paragraph(content)],
                    },
                ],
            });
            const blob = await Packer.toBlob(doc);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${title}.docx`;
            link.click();
        }
    };

    const handleViewFile = (note) => {
        const newTab = window.open();
        newTab.document.write(`
            <html>
                <head><title>${note.title}</title></head>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>${note.title}</h1>
                    <p><strong>Subject:</strong> ${note.subject}</p>
                    <p><strong>Created At:</strong> ${new Date(note.createdAt).toLocaleString()}</p>
                    <div style="white-space: pre-wrap;">${note.content}</div>
                </body>
            </html>
        `);
        newTab.document.close();
    };

    const confirmDelete = (noteId) => {
        setDeleteNoteId(noteId); // Show confirmation message for this specific note
    };

    const cancelDelete = () => {
        setDeleteNoteId(null); // Hide confirmation message
    };

    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setFilteredNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
                setDeleteNoteId(null); // Hide confirmation after deletion
                console.log('Note deleted successfully');
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setNewFileName('');
        setNewFileContent('');
        setNewFileSubject('');
    };

    return (
        <>
            <Navbar />
            <div className="mt-[10vw] px-4">
                <h2>Notes for {username}</h2>

                <div className="buttons flex gap-6 my-6">
                    <button
                        onClick={() => setEditingNoteId('new')}
                        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-700 transition duration-300"
                    >
                        Create File
                    </button>
                    <button
                        onClick={() => setShowTasks(!showTasks)}
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300"
                    >
                        {showTasks ? 'Hide Files' : 'View Files'}
                    </button>
                </div>

                {editingNoteId === 'new' && (
                    <div className="mt-6">
                        <h3>Create New File</h3>
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="File Name"
                            className="p-3 border rounded w-full mb-6"
                        />
                        <textarea
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                            placeholder="File Content"
                            className="p-3 border rounded w-full mb-6"
                            rows="4"
                        />
                        <input
                            type="text"
                            value={newFileSubject}
                            onChange={(e) => setNewFileSubject(e.target.value)}
                            placeholder="File Subject"
                            className="p-3 border rounded w-full mb-6"
                        />
                        <div className="flex gap-6 mt-6">
                            <button
                                onClick={handleAddNote}
                                className="bg-green-500 text-white px-8 py-4 rounded hover:bg-green-700 transition duration-300"
                            >
                                Add
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-8 py-4 rounded hover:bg-gray-700 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="my-6">
                    <select
                        value={selectedSubject || ''}
                        onChange={handleSubjectChange}
                        className="p-3 border rounded w-full mb-6"
                    >
                        <option value="">Select Subject</option>
                        {subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))
                        ) : (
                            <option value="">No subjects available</option>
                        )}
                    </select>
                </div>

                {showTasks && (
                    <div>
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <div key={note._id} className="bg-white p-6 mb-4 rounded shadow-md relative">
                                    {deleteNoteId === note._id && (
                                        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-20">
                                            <div className="bg-white p-6 rounded shadow-lg">
                                                <p className="text-xl mb-4">Confirm Delete?</p>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => deleteNote(note._id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editingNoteId === note._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                                placeholder="File Name"
                                                className="p-3 border rounded w-full mb-6"
                                            />
                                            <textarea
                                                value={newFileContent}
                                                onChange={(e) => setNewFileContent(e.target.value)}
                                                placeholder="File Content"
                                                className="p-3 border rounded w-full mb-6"
                                                rows="4"
                                            />
                                            <div className="flex gap-6 mt-6">
                                                <button
                                                    onClick={() => handleSaveEdit(note._id)}
                                                    className="bg-green-500 text-white px-8 py-4 rounded hover:bg-green-700 transition duration-300"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-500 text-white px-8 py-4 rounded hover:bg-gray-700 transition duration-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                                            <p className="mb-2">
                                                <strong>Subject:</strong> {note.subject}
                                            </p>
                                            <p className="mb-4">
                                                <strong>Created At:</strong> {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleViewFile(note)}
                                                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditFile(note)}
                                                    className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-700 transition duration-300"
                                                >
                                                    Edit
                                                </button>
                                                {deleteNoteId !== note._id && (
                                                    <button
                                                        onClick={() => confirmDelete(note._id)}
                                                        className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-700 transition duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDownloadFile(note.title, note.content, 'pdf')}
                                                    className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-700 transition duration-300"
                                                >
                                                    Download as PDF
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadFile(note.title, note.content, 'txt')}
                                                    className="bg-teal-500 text-white px-6 py-3 rounded hover:bg-teal-700 transition duration-300"
                                                >
                                                    Download as TXT
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadFile(note.title, note.content, 'word')}
                                                    className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-700 transition duration-300"
                                                >
                                                    Download as Word
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No notes available.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};


export default Notes;
