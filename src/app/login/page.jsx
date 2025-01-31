'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const validateEmailOrUsername = (value) => {
    if (!value || typeof value !== 'string') return 'Email or Username is required';
    if (value.length < 3 || value.length > 68) return 'Email or Username must be between 3 and 68 characters';
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return 'Password is required';
    if (password.length < 6 || password.length > 18) return 'Password must be between 6 and 18 characters';
    const passwordRegex = /^\S+$/;
    if (!passwordRegex.test(password)) return 'Password cannot contain whitespace';
    return null;
};

// Disable SSR for the login form
const LoginForm = dynamic(() => Promise.resolve(({ onSubmit, loading, error, fieldErrors }) => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">Email or Username:</label>
                <input
                    type="text"
                    id="emailOrUsername"
                    name="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`mt-1 block w-full px-3 py-2 border ${fieldErrors?.emailOrUsername ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700`}
                />
                {fieldErrors?.emailOrUsername && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.emailOrUsername}</p>
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
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center">
                <a href="/register" className="text-indigo-600 hover:underline">
                    Register
                </a>
            </div>
        </form>
    );
}), { ssr: false });

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const validateForm = (formData) => {
        const errors = {
            emailOrUsername: validateEmailOrUsername(formData.emailOrUsername),
            password: validatePassword(formData.password),
        };

        const hasErrors = Object.values(errors).some(error => error !== null);
        if (hasErrors) {
            setFieldErrors(errors);
            return false;
        }

        return true;
    };

    const handleSubmit = async (formData) => {
        if (!validateForm(formData)) {
            return;
        }

        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in cookie (expires in 7 days)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);
            document.cookie = `token=${data.data.token}; expires=${expirationDate.toUTCString()}; path=/`;

            // Login successful, redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            setError(err.message || 'Something went wrong during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                <LoginForm 
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    fieldErrors={fieldErrors}
                />
            </div>
        </div>
    );
};

export default LoginPage;
