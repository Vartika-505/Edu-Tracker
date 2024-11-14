import React, { useState } from 'react';
import axios from 'axios';

const AddNote = ({ userId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/notes', {
                title,
                content,
                subject,
                tags: tags.split(',').map(tag => tag.trim()), // Convert comma-separated string to array
                userId,
            });

            setSuccess('Note added successfully');
            setError('');
        } catch (err) {
            setError('Error creating note');
            setSuccess('');
        }
    };

    return (
        <div>
            <h1>Add a New Note</h1>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div>
                    <label>Subject:</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </div>
                <div>
                    <label>Tags (comma-separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <button type="submit">Add Note</button>
            </form>
        </div>
    );
};

export default Note;
