import React, { useState } from 'react';
import TaskInputForm from '../components/taskInputForm.jsx';

const AddTaskCard = ({ onAdd }) => {
    const [showModal, setShowModal] = useState(false);

    const handleAddClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSave = (taskData) => {
        onAdd(taskData);
        handleCloseModal();
    };

    return (
        <>
            <div className="border border-dashed border-gray-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer sm:m-4 sm:max-w-md hover:bg-gray-200 h-48 " onClick={handleAddClick}>
                <span className="text-gray-500">+ Add Task</span>
            </div>
            {showModal && 
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <TaskInputForm 
                    onClose={handleCloseModal} 
                    onSave={handleSave}
                />
            </div>}
        </>
    );
};

export default AddTaskCard;