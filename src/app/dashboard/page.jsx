'use client';

import React, { useState } from 'react';
import TaskCard from '../../components/taskCard.jsx';
import AddCard from '../../components/addCard.jsx';

const initialTasks = [
    { title: 'Task 1', description: 'Description 1', dueDate: '2023-10-01', status: 'Pending' },
    { title: 'Task 2', description: 'Description 2', dueDate: '2023-10-02', status: 'Completed' },
    { title: 'Task 3', description: 'Description 3 lorem fsdsdfsfs lorem fsdsdfsfs lorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslore fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfslorem fsdsdfsfs', dueDate: '2023-10-03', status: 'Pending' },
    { title: 'Task 4', description: 'Description 4', dueDate: '2023-10-04', status: 'Completed' },
    { title: 'Task 5', description: 'Description 5', dueDate: '2023-10-05', status: 'Pending' },
    { title: 'Task 6', description: 'Description 6', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
    { title: 'Task 7', description: 'Description 7', dueDate: '2023-10-06', status: 'Completed' },
];

const DashboardPage = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilter = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                            <a href="#" className="py-2 px-3 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-300 transition duration-300">Logout</a>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex justify-center flex-grow mt-2 mb-8 px-4">
                <div className="w-full max-w-6xl">
                    <div className="flex flex-row sm:flex-row justify-between items-center mb-4 text-center">
                        <h1 className="text-gray-700 text-2xl font-bold mb-4 sm:mb-0">Dashboard</h1>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select className="sm:w-fit px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 appearance-none" name="status" id="status" value={filterStatus} onChange={handleFilter}>
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                            <input type="text" placeholder="Search tasks..." className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={searchTerm} onChange={handleSearch} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                        {filteredTasks.map((task, index) => (
                            <TaskCard
                                key={index}
                                title={task.title}
                                description={task.description}
                                dueDate={task.dueDate}
                                status={task.status}
                                onEdit={() => console.log(`Edit ${task.title}`)}
                                onDelete={() => console.log(`Delete ${task.title}`)}
                            />
                        ))}
                        <AddCard/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;