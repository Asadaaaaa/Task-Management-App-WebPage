import React, { useState, useEffect } from 'react';

const formatDateForInput = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        return '';
    }
};

const TaskInputForm = ({ onClose, onSave, title: initialTitle, description: initialDescription, dueDate: initialDueDate, status: initialStatus }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Only set form data on client side
        if (typeof window !== 'undefined') {
            setFormData({
                title: initialTitle || '',
                description: initialDescription || '',
                dueDate: initialDueDate ? formatDateForInput(initialDueDate) : '',
                status: initialStatus || 'pending'
            });
        }
    }, [initialTitle, initialDescription, initialDueDate, initialStatus]);

    const validateForm = () => {
        const errors = {};
        
        // Validate title
        if (!formData.title) {
            errors.title = 'Title is required';
        } else if (formData.title.length < 1 || formData.title.length > 100) {
            errors.title = 'Title must be between 1 and 100 characters';
        }

        // Validate description
        if (formData.description && formData.description.length > 500) {
            errors.description = 'Description must not exceed 500 characters';
        }

        // Validate dueDate
        if (!formData.dueDate) {
            errors.dueDate = 'Due date is required';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Convert date to ISO 8601 format
        const date = new Date(formData.dueDate);
        date.setHours(23, 59, 59, 999);
        const isoDate = date.toISOString();

        const taskData = {
            ...formData,
            dueDate: isoDate
        };

        onSave(taskData);
    };

    // Only render the form on the client side
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <span className="text-gray-500 cursor-pointer float-right text-2xl" onClick={onClose}>&times;</span>
                <h2 className="text-2xl mb-4 text-gray-700">{initialTitle ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700`}
                            rows="3"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-gray-700">Due Date:</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700`}
                        />
                        {errors.dueDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-gray-700">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="mt-1 h-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskInputForm;