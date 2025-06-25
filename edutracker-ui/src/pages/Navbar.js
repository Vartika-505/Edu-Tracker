import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../images/logo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { token, username, handleLogout, profilePic } = useContext(AuthContext);
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/home");
    setIsOpen(false);
  };

  const navLinkClass = (path, isMobile = false) => {
    const isActive = currentPath === path;
    const baseStyle = "flex items-center px-4 py-2 transition-all duration-300";

    if (isMobile) {
      return `${baseStyle} rounded-md ${
        isActive ? "bg-[#9d4edd] text-white" : "text-[#7636aa]"
      }`;
    } else {
      return `${baseStyle} h-full ${
        isActive ? "bg-[#9d4edd] text-white rounded-b-3xl" : "text-[#7636aa]"
      }`;
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-10 w-full px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <img src={logo} alt="EduTracker Logo" width="100px" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#7636aa]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center items-center h-full absolute right-0 m-[1vw]">
          <ul className="flex gap-5 mr-10 h-full items-stretch">
            {!token ? (
              <>
                <li className="h-full">
                  <Link to="/home" className={navLinkClass("/home")}>
                    Home
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/about" className={navLinkClass("/about")}>
                    About
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/services" className={navLinkClass("/services")}>
                    Services
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/contact" className={navLinkClass("/contact")}>
                    Contact
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="h-full">
                  <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                    Dashboard
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/timetable" className={navLinkClass("/timetable")}>
                    Timetable
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/tasks" className={navLinkClass("/tasks")}>
                    Tasks
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/notes" className={navLinkClass("/notes")}>
                    Notes
                  </Link>
                </li>
                <li className="h-full">
                  <Link
                    to="/leaderboard"
                    className={navLinkClass("/leaderboard")}
                  >
                    Leaderboard
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/chat" className={navLinkClass("/chat")}>
                    Chat
                  </Link>
                </li>
                <li className="h-full">
                  <Link to="/profile" className={navLinkClass("/profile")}>
                    <div className="flex items-center mr-4">
                      <img
                        src={profilePic || "https://api-private.atlassian.com/users/2dff6b099a5ac2f4baab1bb770899247/avatar"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="ml-2 font-semibold">{username}</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!token ? (
            <>
              <Link to="/signup">
                <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 mr-2">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogoutAndRedirect}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex justify-center mt-4">
          <div className="bg-white rounded-xl shadow-lg w-11/12 p-4">
            <ul className="flex flex-col gap-2">
              {!token ? (
                <>
                  <li>
                    <Link
                      to="/home"
                      className={navLinkClass("/home", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className={navLinkClass("/about", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className={navLinkClass("/services", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className={navLinkClass("/contact", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup">
                      <button className="w-full text-blue-600 py-2 rounded hover:bg-gray-100">
                        Sign Up
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/login">
                      <button className="w-full text-blue-600 py-2 rounded hover:bg-gray-100">
                        Login
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={navLinkClass("/dashboard", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/timetable"
                      className={navLinkClass("/timetable", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Timetable
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tasks"
                      className={navLinkClass("/tasks", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Tasks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notes"
                      className={navLinkClass("/notes", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Notes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leaderboard"
                      className={navLinkClass("/leaderboard", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      className={navLinkClass("/chat", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      Chat
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className={navLinkClass("/profile", true)}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <img
                          src={profilePic || "https://via.placeholder.com/40"}
                          className="w-8 h-8 rounded-full"
                          alt="Profile"
                        />
                        <span className="ml-2 font-semibold">{username}</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogoutAndRedirect}
                      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
