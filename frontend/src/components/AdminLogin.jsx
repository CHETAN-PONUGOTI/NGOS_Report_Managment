import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:3000/api/auth/login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/dashboard', { replace: true });
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('Network error. Could not connect to the server.');
        }
    };

    return (
        <div className="card max-w-sm mx-auto mt-20">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Admin Login</h2>
            {error && (
                <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-700">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field mt-1"
                    />
                </div>
                <button type="submit" className="primary-button w-full">
                    Log In
                </button>
                <p className="text-xs text-center text-gray-500 pt-2">Demo Credentials: admin / password</p>
            </form>
        </div>
    );
};

export default AdminLogin;