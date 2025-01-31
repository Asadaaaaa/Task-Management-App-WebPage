import React, { useState } from 'react';
import TaskInputForm from '../components/taskInputForm.jsx';
import TaskDetail from '../components/taskDetail.jsx'; // Import TaskDetail component

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

const TaskCard = ({ title, description, dueDate, status, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); // State for TaskDetail modal

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCardClick = () => {
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
    };

    // Format the date on the client side only
    const formattedDate = typeof window !== 'undefined' ? formatDate(dueDate) : dueDate;

    return (
        <>
            <div onClick={handleCardClick} className="bg-white shadow-md rounded-lg p-4 mb-4 md:max-w-md w-full cursor-pointer relative">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-700">{title}</h3>
                    <span className={`px-2 py-1 rounded ${status && status.toLowerCase() === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                        {status}
                    </span>
                </div>
                <div className="h-24 mb-2">
                    <p className="text-gray-500 mb-4 flex-grow overflow-hidden" style={{ maxHeight: '100px' }}>{description}</p>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Due: {formattedDate}</span>
                        <div className="space-x-2">
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <TaskInputForm
                        title={title}
                        description={description}
                        dueDate={dueDate}
                        status={status}
                        onClose={handleCloseModal}
                        onSave={(updatedTask) => {
                            onEdit(updatedTask);
                            handleCloseModal();
                        }}
                    />
                </div>
            )}
            {showDetailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <TaskDetail
                        isOpen={showDetailModal}
                        toggleModal={handleCloseDetailModal}
                        title={title}
                        description={description}
                        dueDate={formattedDate}
                    />
                </div>
            )}
        </>
    );
};

export default TaskCard;