import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const { createNote } = useNotes();  // Use the context hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { title, content, tags: tags.split(',') };
    createNote(noteData);  // Call createNote from context
  };

  return (
    <div>
      <h2>Create a Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Create Note</button>
      </form>
    </div>
  );
};

export default CreateNote;
