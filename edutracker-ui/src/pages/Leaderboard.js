import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Leaderboard = ({ username }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRank, setUserRank] = useState(null); // Store current user's rank
    const [userPoints, setUserPoints] = useState(null); // Store current user's aura points

    useEffect(() => {
        // Fetch leaderboard data from the backend
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/leaderboard');
                setUsers(response.data); // Set the fetched users in the state

                // Find the current user's rank and aura points
                const loggedInUser = response.data.find(user => user.username === username);
                if (loggedInUser) {
                    setUserRank(response.data.indexOf(loggedInUser) + 1); // Rank is index + 1
                    setUserPoints(loggedInUser.auraPoints); // Set user's aura points
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboard(); // Fetch leaderboard data
    }, [username]); // Dependency on username to trigger the fetch when it changes

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        return (
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) || // Match username
            user.auraPoints.toString().includes(searchTerm) // Match aura points
        );
    });

    return (
        <>
            <Navbar />

            {/* User Rank Box with Purple Background and Outline */}
            {userRank && (
                <div
                    className="mt-[8vw] flex justify-center p-4 bg-purple-600 text-white rounded-lg w-full max-w-[400px] mx-auto border-4 border-purple-500"
                >
                    <div className="text-center">
                        <p className="text-lg font-semibold">Your Rank</p>
                        <p className="text-3xl font-bold">{userRank}</p>
                        <p className="text-sm">Aura Points: {userPoints}</p>
                    </div>
                </div>
            )}

            <div className="leaderboard p-6 mt-2"> {/* Added mt-20 to prevent overlap with navbar */}
                <h2 className="text-center text-2xl font-bold mb-4">Leaderboard</h2>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by username or aura points"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        className="px-4 py-2 border rounded-lg w-full mt-[2vw]"
                    />
                </div>

                {/* Table */}
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
                            // Check if the user is the current user
                            const isCurrentUser = user.username === username;

                            return (
                                <tr
                                    key={user._id}
                                    className={`${isCurrentUser ? 'bg-purple-600 text-white' : ''}`} // Background color for current user's row
                                >
                                    <td
                                        className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`} // Background color for rank
                                    >
                                        {index + 1} {/* Rank */}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`} // Background color for username
                                    >
                                        {user.username}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-no-wrap border-b text-gray-700 ${isCurrentUser ? 'bg-purple-600 text-white' : ''}`} // Background color for aura points
                                    >
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
