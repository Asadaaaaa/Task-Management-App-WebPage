'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return 'Email is required';
    if (email.length < 9 || email.length > 68) return 'Email must be between 9 and 68 characters';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

const validateUsername = (username) => {
    if (!username || typeof username !== 'string') return 'Username is required';
    if (username.length < 3 || username.length > 30) return 'Username must be between 3 and 30 characters';
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, dots, and underscores';
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return 'Password is required';
    if (password.length < 6 || password.length > 18) return 'Password must be between 6 and 18 characters';
    const passwordRegex = /^\S+$/;
    if (!passwordRegex.test(password)) return 'Password cannot contain whitespace';
    return null;
};

// Disable SSR for the register form
const RegisterForm = dynamic(() => Promise.resolve(({ onSubmit, loading, error, fieldErrors }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors?.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700`}
                />
                {fieldErrors?.username && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
                )}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700`}
                />
                {fieldErrors?.email && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors?.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700`}
                />
                {fieldErrors?.password && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-2 px-4 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center`}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}), { ssr: false });

const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            router.push('/login');
        } catch (err) {
            setError(err.message || 'Something went wrong during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                <RegisterForm 
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    fieldErrors={fieldErrors}
                />
            </div>
        </div>
    );
};

export default RegisterPage;