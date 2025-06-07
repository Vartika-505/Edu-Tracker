import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRank, setUserRank] = useState(null);
    const [userPoints, setUserPoints] = useState(null);

    const { username, token, handleLogout } = useContext(AuthContext);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/leaderboard');
                setUsers(response.data);
                if (username) {
                    const loggedInUser = response.data.find(user => user.username === username);
                    if (loggedInUser) {
                        setUserRank(response.data.indexOf(loggedInUser) + 1);
                        setUserPoints(loggedInUser.auraPoints);
                    }
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboard();
    }, [username]); 

    useEffect(() => {
        const interval = setInterval(() => {
            const fetchLeaderboard = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/leaderboard');
                    setUsers(response.data);

                    if (username) {
                        const loggedInUser = response.data.find(user => user.username === username);
                        if (loggedInUser) {
                            setUserRank(response.data.indexOf(loggedInUser) + 1);
                            setUserPoints(loggedInUser.auraPoints);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching leaderboard data:', error);
                }
            };
            fetchLeaderboard();
        }, 30000); 

        return () => clearInterval(interval); 
    }, [username]);

    const filteredUsers = users.filter(user => {
        return (
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.auraPoints.toString().includes(searchTerm)
        );
    });

    return (
        <>
            <Navbar token={token} handleLogout={handleLogout} />
            {userRank && username && (
                <div className="mt-[8vw] flex justify-center p-4 bg-purple-600 text-white rounded-lg w-full max-w-[400px] mx-auto border-4 border-purple-500">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Your Rank</p>
                        <p className="text-3xl font-bold">{userRank}</p>
                        <p className="text-sm">Aura Points: {userPoints}</p>
                    </div>
                </div>
            )}

            <div className="leaderboard p-6 mt-2">
                <h2 className="text-center text-2xl font-bold mb-4">Leaderboard</h2>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by username or aura points"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-full mt-[2vw]"
                    />
                </div>
                <table className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Rank</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Username</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Aura Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => {
                            const isCurrentUser = user.username === username;

                            return (
                                <tr
                                    key={user._id}
                                    className={`${isCurrentUser ? 'bg-purple-600 text-white' : ''}`}
                                >
                                    <td className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`}>
                                        {index + 1}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`}>
                                        {user.username}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`}>
                                        {user.auraPoints}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Leaderboard;