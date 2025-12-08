import { useState } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return { toasts, addToast, removeToast };
};