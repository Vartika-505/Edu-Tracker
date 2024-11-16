import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import Navbar from './Navbar';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

const Notes = ({ username }) => {
    const { notes, createNote, fetchNotes, selectedSubject, setSelectedSubject, updateNote } = useNotes();

    const [newFileContent, setNewFileContent] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFileSubject, setNewFileSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [viewingNoteId, setViewingNoteId] = useState(null); // state to manage which note to view

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

        // Hide files when subject changes
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
        const note = { title: newFileName, content: newFileContent, userId, subject: newFileSubject, createdAt: new Date().toISOString() }; // Added createdAt
        await createNote(note);
        // Automatically close the editor after adding the note
        setNewFileContent('');
        setNewFileName('');
        setNewFileSubject('');
        setEditingNoteId(null); // Close editor after creating a new note
    };

    const handleSaveEdit = async (noteId) => {
        if (!newFileContent.trim() || !newFileName.trim()) return;
        const updatedNote = { _id: noteId, title: newFileName, content: newFileContent, subject: newFileSubject };
        await updateNote(updatedNote);
        setEditingNoteId(null); // Close editor after saving
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
        // Open the note in a new tab
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

    return (
        <>
            <Navbar />
            <div className="mt-[10vw] px-4">
                <h2>Notes for {username}</h2>

                <div className="buttons flex gap-4 my-4">
                    <button
                        onClick={() => setEditingNoteId('new')}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Create File
                    </button>
                    <button
                        onClick={() => setShowTasks(!showTasks)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {showTasks ? 'Hide Files' : 'View Files'}
                    </button>
                </div>

                <div className="my-4">
                    <select
                        value={selectedSubject || ''}
                        onChange={handleSubjectChange}
                        className="p-2 border rounded w-full mb-4"
                    >
                        <option value="">Select Subject</option>
                        {subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))
                        ) : (
                            <option disabled>No Subjects Available</option>
                        )}
                    </select>
                </div>

                {showTasks && (
                    <div>
                        <h3>All Files</h3>
                        {filteredNotes.length === 0 ? (
                            <p>No files available for this subject.</p>
                        ) : (
                            filteredNotes.map((note) => (
                                <div key={note._id} className="task bg-white p-4 mb-2 rounded shadow">
                                    <h4 className="text-lg font-semibold cursor-pointer">{note.title}</h4>
                                    <p><strong>Created at:</strong> {new Date(note.createdAt).toLocaleString()}</p> {/* Display creation time */}
                                    <div className="download-options flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleDownloadFile(note.title, note.content, 'txt')}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                                        >
                                            Download as TXT
                                        </button>
                                        <button
                                            onClick={() => handleDownloadFile(note.title, note.content, 'pdf')}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Download as PDF
                                        </button>
                                        <button
                                            onClick={() => handleDownloadFile(note.title, note.content, 'word')}
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            Download as Word
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleEditFile(note)}
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleViewFile(note)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-4"
                                    >
                                        View
                                    </button>

                                    {editingNoteId === note._id && (
                                        <div className="note-editor bg-gray-100 p-4 rounded shadow mt-4">
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                                placeholder="File Title"
                                                className="w-full p-2 mb-2 border rounded"
                                            />
                                            <textarea
                                                value={newFileContent}
                                                onChange={(e) => setNewFileContent(e.target.value)}
                                                placeholder="File Content"
                                                className="w-full p-2 mb-2 border rounded"
                                            />
                                            <input
                                                type="text"
                                                value={newFileSubject}
                                                onChange={(e) => setNewFileSubject(e.target.value)}
                                                placeholder="Enter Subject"
                                                className="w-full p-2 mb-2 border rounded"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(note._id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setEditingNoteId(null)} // Close editor manually
                                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Add or Edit Note Form */}
                {(editingNoteId === 'new' || editingNoteId !== null) && (
                    <div className="note-editor bg-gray-100 p-4 rounded shadow mt-4">
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="File Title"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                            placeholder="File Content"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            value={newFileSubject}
                            onChange={(e) => setNewFileSubject(e.target.value)}
                            placeholder="Enter Subject"
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddNote}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Create Note
                            </button>
                            <button
                                onClick={() => setEditingNoteId(null)} // Close editor manually
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Notes;
