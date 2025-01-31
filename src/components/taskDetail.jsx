import React from 'react';

const Modal = ({ isOpen, toggleModal, title, description, dueDate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
            <div className="bg-white p-6 rounded shadow-lg relative w-96 h-72">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
                    <span 
                        className="cursor-pointer text-gray-700 w-8 h-8 text-center flex items-center justify-center text-2xl" 
                        onClick={toggleModal}
                    >
                        &times;
                    </span>
                </div>
                
                <div className="h-40 mb-4 text-gray-700 overflow-auto">
                    <p>{description}</p>
                </div>
                <p className="text-gray-700">Due Date: {dueDate}</p>
            </div>
        </div>
    );
};

export default Modal;
