import React from 'react';

const Home = ({ token }) => {
  return (
    <div>
      <h2>Home</h2>
      {token ? (
        <p>Your token: {token}</p>
      ) : (
        <p>Please log in to see your token.</p>
      )}
    </div>
  );
};

export default Home;
