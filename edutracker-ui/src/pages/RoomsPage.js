import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const RoomsPage = () => {
    const { userId } = useContext(AuthContext); // Get userId from context
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log("RoomsPage received userId:", userId);
        if (!userId) {
            console.error("Error: userId is missing!");
            return;
        }

        axios.get(`${API_URL}/rooms/${userId}`)
            .then(res => setRooms(res.data))
            .catch(err => console.error("Error fetching rooms:", err));
    }, [userId]);

    const createRoom = () => {
        if (!userId || !roomName) {
            console.error("User ID and Room Name are required to create a room.");
            return;
        }

        axios.post(`${API_URL}/rooms/create`, { userId, name: roomName })
            .then(res => navigate(`/room/${res.data._id}`))
            .catch(err => console.error("Error creating room:", err));
    };

    const joinRoom = () => {
        if (!userId || !joinCode) {
            console.error("User ID and Join Code are required to join a room.");
            return;
        }

        axios.post(`${API_URL}/rooms/join`, { userId, code: joinCode })
            .then(res => navigate(`/room/${res.data._id}`))
            .catch(err => console.error("Error joining room:", err));
    };

    return (
        <div>
            <h1>Rooms</h1>
            {!userId && <h2 style={{ color: 'red' }}>Error: User ID is missing. Please log in.</h2>}

            <h2>Create Room</h2>
            <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Room Name" />
            <button onClick={createRoom}>Create</button>

            <h2>Join Room</h2>
            <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Room Code" />
            <button onClick={joinRoom}>Join</button>

            <h2>Previous Rooms</h2>
            {rooms.map(room => (
                <div key={room._id}>
                    <span>{room.name} ({room.code})</span>
                    <button onClick={() => navigate(`/room/${room._id}`)}>Rejoin</button>
                </div>
            ))}
        </div>
    );
};

export default RoomsPage;
