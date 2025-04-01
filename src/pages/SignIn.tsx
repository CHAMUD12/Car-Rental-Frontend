import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError("All fields are required!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:3000/auth/login", {
                username,
                password,
            });

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("username", username);

            window.dispatchEvent(new Event('storage'));

            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-rose-500 mb-6 text-center">Sign In</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-rose-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-rose-600 transition duration-300 disabled:bg-gray-400"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="mt-4 text-center text-gray-700">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-rose-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
