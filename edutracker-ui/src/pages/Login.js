import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext"; 
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const {
    token,
    setToken,
    email,
    setEmail,
    setUsername,
    setUserId,
    setAuraPoints,
    handleLogout,
    setProfilePic,
  } = useContext(AuthContext);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem("token");
      const localUsername = localStorage.getItem("username");
      const storedAuraPoints = localStorage.getItem("auraPoints");
      const storedUserId = localStorage.getItem("userId");
      const storedEmail = localStorage.getItem("email"); 
      const storedProfilePic = localStorage.getItem("profilePicture");

      if (storedToken) {
        try {
          await axios.get("http://localhost:5000/api/auth/validate-token", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          
          setIsLoggedIn(true);
          
          setToken(storedToken);
          setUsername(localUsername || '');
          setAuraPoints(Number(storedAuraPoints) || 0);
          setEmail(storedEmail || '');
          setUserId(storedUserId || '');
          setProfilePic(storedProfilePic || '');
          
        } catch (error) {
          console.log("Token validation failed, logging out.");
          handleLogout(); 
          setIsLoggedIn(false);
        }
      }
    };
    checkTokenValidity();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username: usernameInput,
          password,
        }
      );

      const {
        token,
        auraPoints,
        userId,
        email: userEmail,
        profilePicture,
        totalTasks,
        completedTasks,
      } = response.data;

      setToken(token);
      setUsername(usernameInput);
      setUserId(userId);
      setAuraPoints(auraPoints);
      setEmail(userEmail);
      
      if (profilePicture) {
        setProfilePic(profilePicture);
      } else {
        setProfilePic(''); 
      }

      localStorage.setItem("totalTasks", totalTasks || 0);
      localStorage.setItem("completedTasks", completedTasks || 0);

      setMessage("Login successful!");
      setUsernameInput("");
      setPassword("");
      setIsLoggedIn(true);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        `Login failed! ${
          error.response?.data?.message ||
          error.message ||
          "Please try again later."
        }`
      );
    }
  };

  const handleGoogleSignIn = async (response) => {
    const { credential } = response;
    if (!credential) {
      console.error("Token ID or Profile object is missing.");
      return;
    }

    const decoded = JSON.parse(atob(credential.split(".")[1])); 
    const emailPrefix = decoded.email.split("@")[0];
    const googleId = decoded.sub;
    
    try {
      const googleSignInResponse = await axios.post(
        "http://localhost:5000/api/auth/googleSign",
        {
          googleId,
          username: emailPrefix, 
          email: decoded.email,
        }
      );

      const existingUser = googleSignInResponse.data;
      if (existingUser) {
        console.log("User exists:", existingUser); 
        
        setToken(existingUser.token);
        setUsername(emailPrefix);
        setUserId(existingUser.userId);
        setAuraPoints(existingUser.auraPoints);
        setEmail(existingUser.email);

        if (existingUser.profilePicture) {
          setProfilePic(existingUser.profilePicture);
        } else {
          setProfilePic('');
        }

        navigate("/dashboard");
      } else {
        console.log("User does not exist, creating new user.");
        const newUserResponse = await axios.post(
          "http://localhost:5000/api/auth/signup",
          {
            email: decoded.email,
            username: emailPrefix,
            password: "google-auth", 
          }
        );

        const newUser = newUserResponse.data;
        setToken(newUser.token);
        setUsername(emailPrefix);
        setUserId(newUser.userId);
        setEmail(newUser.email);
        setAuraPoints(0);
        if (newUser.profilePicture) {
          setProfilePic(newUser.profilePicture);
        } else {
          setProfilePic('');
        }

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar token={token} handleLogout={handleLogout} />
      <div className="flex flex-col md:flex-row flex-grow bg-gradient-to-br from-purple-600 via-purple-500 to-purple-300 mt-16">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 text-white text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg md:text-2xl">We're glad to see you again.</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10">
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-md">
            {isLoggedIn ? (
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-purple-600">
                  Welcome Back!
                </h2>
                <p className="text-base md:text-lg mb-4">
                  You are already logged in.
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 mb-4 w-full"
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 w-full"
                >
                  Go to Home
                </button>
                {message && <p className="mt-4 text-green-500">{message}</p>}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-purple-600">
                  Login
                </h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <button
                  type="submit"
                  className="bg-purple-400 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full mb-4"
                >
                  Login
                </button>
                <div className="flex justify-center mb-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSignIn}
                    onError={() => console.log("Google Sign-In Error")}
                  />
                </div>
                {message && (
                  <p className="mt-4 text-red-500 text-center">{message}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;