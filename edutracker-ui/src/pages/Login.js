import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [usernameInput, setUsernameInput] = useState("");
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Retrieve context functions and variables
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
      const token = localStorage.getItem("token");
      const localUsername = localStorage.getItem("username");
      const storedAuraPoints = localStorage.getItem("auraPoints");
      const storedUserId = localStorage.getItem("userId");

      if (token) {
        try {
          // Validate token
          await axios.get("http://localhost:5000/api/auth/validate-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
          setUsername(localUsername);
          setAuraPoints(Number(storedAuraPoints));
          setEmail(email);
          setUserId(storedUserId); // Set userId from localStorage to context
          setProfilePic(localStorage.getItem("profilePicture"));
        } catch (error) {
          console.log("Token validation failed, logging out.");
          handleLogout(); // Call handleLogout from context to clear session
          setIsLoggedIn(false);
        }
      }
    };
    checkTokenValidity();
  }, [setUsername, setAuraPoints, setUserId, handleLogout, setProfilePic]);

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

      // Store details in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("auraPoints", auraPoints);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail); // Update local storage for email
      localStorage.setItem("totalTasks", totalTasks || 0);
      localStorage.setItem("completedTasks", completedTasks || 0);

      if (profilePicture) {
        localStorage.setItem("profilePicture", profilePicture);
        setProfilePic(profilePicture); // Update context
      } else {
        localStorage.removeItem("profilePicture");
        setProfilePic(null); // Clear profile picture in context if not available
      }

      // Update context
      setToken(token);
      setUsername(usernameInput);
      setUserId(userId);
      setAuraPoints(auraPoints);
      setEmail(userEmail); // Update context for email
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

    const decoded = JSON.parse(atob(credential.split(".")[1])); // Decoding the token to extract user info
    const emailPrefix = decoded.email.split("@")[0];
    const googleId = decoded.sub;
    try {
      const googleSignInResponse = await axios.post(
        "http://localhost:5000/api/auth/googleSign",
        {
          googleId, // Sending Google ID to backend
          username: emailPrefix, // Use email prefix as username
          email: decoded.email,
        }
      );

      const existingUser = googleSignInResponse.data;
      if (existingUser) {
        console.log("User exists:", existingUser); // Log user data
        localStorage.setItem("token", existingUser.token);
        localStorage.setItem("username", emailPrefix);
        localStorage.setItem("userId", existingUser.userId);
        localStorage.setItem("email", existingUser.email);
        localStorage.setItem("auraPoints", existingUser.auraPoints);

        if (existingUser.profilePicture) {
          localStorage.setItem("profilePicture", existingUser.profilePicture);
          setProfilePic(existingUser.profilePicture);
        }
        setToken(existingUser.token);
        setUsername(emailPrefix);
        setUserId(existingUser.userId);
        setAuraPoints(existingUser.auraPoints);
        setEmail(existingUser.email);

        navigate("/dashboard");
      } else {
        console.log("User does not exist, creating new user.");
        // If user does not exist, create a new user
        const newUserResponse = await axios.post(
          "http://localhost:5000/api/auth/signup",
          {
            email: decoded.email,
            username: emailPrefix,
            password: "google-auth", // No password for Google sign-in
          }
        );

        const newUser = newUserResponse.data;

        localStorage.setItem("token", newUser.token);
        localStorage.setItem("username", emailPrefix);
        localStorage.setItem("userId", newUser.userId);
        localStorage.setItem("email", newUser.email);
        localStorage.setItem("auraPoints", 0);

        if (existingUser.profilePicture) {
          localStorage.setItem("profilePicture", existingUser.profilePicture);
          setProfilePic(existingUser.profilePicture);
        }
        setToken(newUser.token);
        setUsername(emailPrefix);
        setUserId(newUser.userId);
        setEmail(newUser.email);
        setAuraPoints(0);

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar token={token} handleLogout={handleLogout} />

      {/* Responsive Gradient Background Container */}
      <div className="flex flex-col md:flex-row flex-grow bg-gradient-to-br from-purple-600 via-purple-500 to-purple-300 mt-16">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-10 text-white text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg md:text-2xl">We're glad to see you again.</p>
        </div>

        {/* Right Section */}
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
