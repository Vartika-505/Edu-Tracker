import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

const Notes = ({ username }) => {
    const {
        notes,
        createNote,
        fetchNotes,
        selectedSubject,
        setSelectedSubject,
        updateNote,
        setNotes
    } = useNotes();

    const [newFileContent, setNewFileContent] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFileSubject, setNewFileSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [hasFetchedNotes, setHasFetchedNotes] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId && !hasFetchedNotes) {
            fetchNotes();
            setHasFetchedNotes(true);
        }
    }, [userId, hasFetchedNotes, fetchNotes]);

    useEffect(() => {
        const uniqueSubjects = [...new Set(notes.map(n => n.subject).filter(Boolean))];
        setSubjects(uniqueSubjects);
        const filtered = selectedSubject
            ? notes.filter(n => n.subject === selectedSubject)
            : notes;
        setFilteredNotes(filtered);
    }, [notes, selectedSubject]);

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        localStorage.setItem('selectedSubject', subject);
        setShowTasks(false);
    };

    const handleAddNote = async () => {
        if (!newFileContent.trim() || !newFileName.trim() || !newFileSubject.trim()) return;
        const note = {
            title: newFileName,
            content: newFileContent,
            userId,
            subject: newFileSubject,
            createdAt: new Date().toISOString()
        };
        await createNote(note);
        resetEditor();
    };

    const handleSaveEdit = async (noteId) => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const updatedNote = {
            _id: noteId,
            title: newFileName,
            content: newFileContent,
            subject: newFileSubject
        };
        await updateNote(updatedNote);
        resetEditor();
    };

    const handleEditFile = (note) => {
        setEditingNoteId(note._id);
        setNewFileName(note.title);
        setNewFileContent(note.content);
        setNewFileSubject(note.subject);
    };

    const resetEditor = () => {
        setEditingNoteId(null);
        setNewFileContent('');
        setNewFileName('');
        setNewFileSubject('');
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
                sections: [{ children: [new Paragraph(content)] }]
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
                <body style="font-family: Arial; padding: 20px;">
                    <h1>${note.title}</h1>
                    <p><strong>Subject:</strong> ${note.subject}</p>
                    <p><strong>Created At:</strong> ${new Date(note.createdAt).toLocaleString()}</p>
                    <div style="white-space: pre-wrap;">${note.content}</div>
                </body>
            </html>
        `);
        newTab.document.close();
    };

    const confirmDelete = (noteId) => setDeleteNoteId(noteId);
    const cancelDelete = () => setDeleteNoteId(null);

    const deleteNote = async (noteId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${noteId}`, { method: 'DELETE' });
            if (res.ok) {
                setFilteredNotes(prev => prev.filter(n => n._id !== noteId));
                setNotes(prev => prev.filter(n => n._id !== noteId));
                cancelDelete();
            } else console.error('Failed to delete note');
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-16 px-4">
                <h2 className="text-2xl font-bold mb-4">Notes for {username}</h2>
                <div className="buttons flex gap-4 my-6">
    <button
        onClick={() => setEditingNoteId('new')}
        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition duration-200 shadow-md"
    >
        Create File
    </button>
    <button
        onClick={() => setShowTasks(!showTasks)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition duration-200 shadow-md"
    >
        {showTasks ? 'Hide Files' : 'View Files'}
    </button>
</div>



                {(editingNoteId === 'new') && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Create New File</h3>
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="File Name"
                            className="p-3 border rounded w-full mb-4"
                        />
                        <textarea
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                            placeholder="File Content"
                            className="p-3 border rounded w-full mb-4"
                            rows="4"
                        />
                        <input
                            type="text"
                            value={newFileSubject}
                            onChange={(e) => setNewFileSubject(e.target.value)}
                            placeholder="File Subject"
                            className="p-3 border rounded w-full mb-4"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddNote}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                            >
                                Add
                            </button>
                            <button
                                onClick={resetEditor}
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
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
                        className="p-3 border rounded w-full"
                    >
                        <option value="">Select Subject</option>
                        {subjects.length > 0
                            ? subjects.map((s, idx) => <option key={idx} value={s}>{s}</option>)
                            : <option value="">No subjects available</option>}
                    </select>
                </div>

                {showTasks && (
                    <div>
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map(note => (
                                <div key={note._id} className="bg-white p-6 mb-4 rounded shadow relative">
                                    {deleteNoteId === note._id && (
                                        <div className="absolute inset-0 bg-white/90 flex justify-center items-center z-20">
                                            <div className="bg-white p-6 rounded shadow-lg">
                                                <p className="text-xl mb-4">Confirm Delete?</p>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => deleteNote(note._id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
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
                                                className="p-3 border rounded w-full mb-4"
                                            />
                                            <textarea
                                                value={newFileContent}
                                                onChange={(e) => setNewFileContent(e.target.value)}
                                                placeholder="File Content"
                                                className="p-3 border rounded w-full mb-4"
                                                rows="4"
                                            />
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleSaveEdit(note._id)}
                                                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={resetEditor}
                                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold">{note.title}</h3>
                                            <p><strong>Subject:</strong> {note.subject}</p>
                                            <p className="mb-4"><strong>Created At:</strong> {new Date(note.createdAt).toLocaleString()}</p>
                                            <div className="flex flex-wrap gap-3">
    <button onClick={() => handleViewFile(note)} className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700 transition">View</button>
    <button onClick={() => handleEditFile(note)} className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600 transition">Edit</button>
    <button onClick={() => confirmDelete(note._id)} className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-700 transition">Delete</button>
    <button onClick={() => handleDownloadFile(note.title, note.content, 'pdf')} className="bg-purple-500 px-4 py-2 rounded text-white hover:bg-purple-700 transition">PDF</button>
    <button onClick={() => handleDownloadFile(note.title, note.content, 'txt')} className="bg-teal-500 px-4 py-2 rounded text-white hover:bg-teal-700 transition">TXT</button>
    <button onClick={() => handleDownloadFile(note.title, note.content, 'word')} className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-700 transition">Word</button>
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
