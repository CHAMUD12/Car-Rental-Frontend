import { useState, useEffect } from "react";
import {
    Menu as MenuIcon,
    LogIn,
    UserPlus,
    LogOut
} from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { FaCar, FaCreditCard, FaHome, FaUsers } from "react-icons/fa";

export function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("accessToken");
            const storedUsername = localStorage.getItem("username");

            if (token && storedUsername) {
                setIsLoggedIn(true);
                setUsername(storedUsername);
            } else {
                setIsLoggedIn(false);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        navigate("/signin");
    };

    return (
        <div
            className={`bg-black text-white shadow-2xl transition-all duration-300 ease-in-out h-screen flex flex-col ${
                isSidebarOpen ? "w-64" : "w-20"
            }`}
        >
            <div className="p-4 flex flex-col h-full">
                <button
                    onClick={toggleSidebar}
                    className="text-white p-3 rounded-lg transition duration-300 hover:bg-rose-600 hover:text-white shadow-lg"
                >
                    <MenuIcon
                        className={`w-7 h-7 transition-transform transform ${
                            isSidebarOpen ? "rotate-180" : ""
                        } hover:scale-110`}
                    />
                </button>
                {isSidebarOpen && (
                    <h1 className="text-2xl font-bold text-rose-400 mt-4">CAR RENTAL</h1>
                )}
                <ul className="flex flex-col space-y-4 mt-6">
                    {isLoggedIn ? (
                        <>
                            {/* Main Navigation Links (only visible when logged in) */}
                            {[
                                { to: "/", icon: FaHome, label: "Dashboard" },
                                { to: "/customer", icon: FaUsers, label: "Customer" },
                                { to: "/car", icon: FaCar, label: "Car" },
                                { to: "/booking", icon: FaCreditCard, label: "Booking" },
                            ].map(({ to, icon: Icon, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="flex items-center space-x-4 p-3 rounded-lg bg-white text-gray-900 shadow-md transition duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-300 hover:text-white hover:shadow-xl"
                                    >
                                        <Icon className="w-6 h-6 text-gray-700 transition duration-300 group-hover:text-white" />
                                        {isSidebarOpen && <span>{label}</span>}
                                    </Link>
                                </li>
                            ))}

                            {/* User Info & Logout (when logged in) */}
                            {isSidebarOpen && (
                                <div className="mt-auto mb-4 text-center">
                                    <p className="text-rose-400 mb-2">Logged in as:</p>
                                    <p className="font-bold mb-4">{username}</p>
                                </div>
                            )}

                            <li className="mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-4 p-3 rounded-lg bg-rose-500 text-white shadow-md transition duration-300 hover:bg-rose-600 hover:shadow-xl"
                                >
                                    <LogOut className="w-6 h-6" />
                                    {isSidebarOpen && <span>Sign Out</span>}
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Authentication Links (only visible when logged out) */}
                            <li>
                                <Link
                                    to="/signin"
                                    className="flex items-center space-x-4 p-3 rounded-lg bg-white text-gray-900 shadow-md transition duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-300 hover:text-white hover:shadow-xl"
                                >
                                    <LogIn className="w-6 h-6 text-gray-700 transition duration-300 group-hover:text-white" />
                                    {isSidebarOpen && <span>Sign In</span>}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="flex items-center space-x-4 p-3 rounded-lg bg-white text-gray-900 shadow-md transition duration-300 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-300 hover:text-white hover:shadow-xl"
                                >
                                    <UserPlus className="w-6 h-6 text-gray-700 transition duration-300 group-hover:text-white" />
                                    {isSidebarOpen && <span>Sign Up</span>}
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}
