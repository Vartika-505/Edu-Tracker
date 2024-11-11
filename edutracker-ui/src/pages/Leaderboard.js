import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch leaderboard data from the backend
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/leaderboard');
                setUsers(response.data); // Set the fetched users in the state
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchLeaderboard(); // Call the function to fetch leaderboard data
    }, []);

    return (
        <div className="leaderboard">
            <h2 className="text-center text-2xl font-bold mb-4">Leaderboard</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Rank</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Username</th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-600 uppercase">Aura Points</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-700">
                                {index + 1} {/* Rank */}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-700">
                                {user.username}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b text-gray-700">
                                {user.auraPoints}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
