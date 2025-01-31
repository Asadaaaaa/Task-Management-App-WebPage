'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '../../components/taskCard.jsx';
import AddCard from '../../components/addCard.jsx';

const validateTask = (task) => {
    const errors = {};
    
    // Validate title
    if (!task.title) {
        errors.title = 'Title is required';
    } else if (task.title.length < 1 || task.title.length > 100) {
        errors.title = 'Title must be between 1 and 100 characters';
    }

    // Validate description
    if (task.description && task.description.length > 500) {
        errors.description = 'Description must not exceed 500 characters';
    }

    // Validate dueDate
    if (!task.dueDate) {
        errors.dueDate = 'Due date is required';
    } else {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        if (!datePattern.test(task.dueDate)) {
            errors.dueDate = 'Invalid date format. Use ISO 8601 format';
        }
    }

    // Validate status
    if (task.status && !['pending', 'completed'].includes(task.status.toLowerCase())) {
        errors.status = 'Status must be either pending or completed';
    }

    return Object.keys(errors).length === 0 ? null : errors;
};

const DashboardPage = () => {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/tasks`, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
            setTasks(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        const errors = validateTask(taskData);
        if (errors) {
            return { success: false, errors };
        }

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }

            await fetchTasks(); // Refresh tasks list
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        const errors = validateTask(taskData);
        if (errors) {
            return { success: false, errors };
        }

        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update task');
            }

            await fetchTasks(); // Refresh tasks list
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/primary/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            await fetchTasks(); // Refresh tasks list
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilter = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <nav className="bg-white shadow mb-4 sticky top-0 w-full z-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between">
                        <div className="flex space-x-4">
                            <div className="flex items-center py-5 text-gray-700">
                                <span className="font-bold">Task List</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button 
                                onClick={handleLogout}
                                className="py-2 px-3 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-300 transition duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex justify-center flex-grow mt-2 mb-8 px-4">
                <div className="w-full max-w-6xl">
                    <div className="flex flex-row sm:flex-row justify-between items-center mb-4 text-center">
                        <h1 className="text-gray-700 text-2xl font-bold mb-4 sm:mb-0">Dashboard</h1>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select 
                                className="sm:w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 appearance-none" 
                                name="status" 
                                id="status" 
                                value={filterStatus} 
                                onChange={handleFilter}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder="Search tasks..." 
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" 
                                value={searchTerm} 
                                onChange={handleSearch} 
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                id={task._id}
                                title={task.title}
                                description={task.description}
                                dueDate={task.dueDate}
                                status={task.status}
                                onEdit={(updatedTask) => handleUpdateTask(task._id, updatedTask)}
                                onDelete={() => handleDeleteTask(task._id)}
                            />
                        ))}
                        <AddCard onAdd={handleCreateTask} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;