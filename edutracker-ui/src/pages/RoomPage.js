import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const socket = io(API_URL);

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { userId, username } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [members, setMembers] = useState([]);
    const [roomCode, setRoomCode] = useState('');

    useEffect(() => {
        if (!userId || !username) {
            navigate('/rooms'); // Redirect if user is not authenticated
            return;
        }

        // Join room and fetch room details
        socket.emit('joinRoom', { roomId, userId, username });

        socket.on('messageReceived', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('updateMembers', (memberList) => {
            console.log("Updated members:", memberList);  // Debugging
            setMembers(memberList);
        });

        axios.get(`${API_URL}/rooms/room/${roomId}`)
            .then(res => {
                setRoomCode(res.data.code);
                setMembers(res.data.members || []); 
            })
            .catch(err => {
                console.error("Error fetching room details:", err);
                setMembers([]); // ✅ Fallback to empty array
            });


        return () => {
            socket.emit('leaveRoom', { roomId, userId });
            socket.disconnect();
        };
    }, [roomId, userId, username, navigate]);

    const sendMessage = () => {
        if (message.trim() !== '') {
            const msgData = { roomId, sender: username, text: message };

            socket.emit('sendMessage', msgData);
            setMessages(prev => [...prev, msgData]);
            setMessage('');
        }
    };

    const handleExit = () => {
        socket.emit('leaveRoom', { roomId, userId });
        navigate('/rooms');
    };

    return (
        <div>
            {/* Navbar */}
            <nav style={{ padding: '10px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Room Chat</h2>
                <button onClick={handleExit} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>Exit</button>
            </nav>

            {/* Room Code */}
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <h3>Room Code: {roomCode ? roomCode : 'Loading...'}</h3>
                <p>Share this code with others to let them join.</p>
            </div>

            {/* Members List */}
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <h3>Members in Room</h3>
                <ul>
                    {members.length > 0 ? (
                        members.map((member, index) => (
                            <li key={index}>{member.username} {member.userId === userId ? '(You)' : ''}</li>
                        ))
                    ) : (
                        <p>Loading members...</p>
                    )}
                </ul>
            </div>

            {/* Messages */}
            <div style={{ padding: '10px', height: '300px', overflowY: 'auto', borderBottom: '1px solid #ccc' }}>
                {messages.map((msg, i) => (
                    <div key={i}><strong>{msg.sender}:</strong> {msg.text}</div>
                ))}
            </div>

            {/* Message Input */}
            <div style={{ padding: '10px', display: 'flex' }}>
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: '5px' }}
                />
                <button onClick={sendMessage} style={{ marginLeft: '5px', padding: '5px 10px' }}>Send</button>
            </div>
        </div>
    );
};

export default RoomPage;
