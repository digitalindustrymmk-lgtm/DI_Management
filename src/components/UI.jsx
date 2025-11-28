import React, { useState, useEffect, useRef, memo } from 'react';
import { CheckCircleIcon, AlertCircleIcon, XIcon, AlertTriangleIcon, RotateCcwIcon } from './Icons';

// --- TOAST NOTIFICATIONS ---
export const ToastContainer = ({ toasts, removeToast }) => (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl shadow-slate-200/50 transform transition-all animate-fade-in border ${t.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-red-600 border-red-100'}`}>
                {t.type === 'success' ? <div className="bg-emerald-100 p-1.5 rounded-full"><CheckCircleIcon className="h-4 w-4" /></div> : <div className="bg-red-100 p-1.5 rounded-full"><AlertCircleIcon className="h-4 w-4" /></div>}
                <span className="font-medium text-sm text-slate-700">{t.message}</span>
                <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 hover:bg-slate-100 p-1 rounded-md transition-all"><XIcon className="h-4 w-4" /></button>
            </div>
        ))}
    </div>
);

// --- FIXED EDITABLE CELL ---
export const EditableCell = memo(({ value, onSave, className, options }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);

    // Sync internal state when parent value changes
    useEffect(() => { setTempValue(value); }, [value]);

    // Focus input when editing starts
    useEffect(() => { 
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // Handle saving for Text Inputs (Blur event)
    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onSave(tempValue);
        }
    };

    // Handle saving for Dropdowns (Change event)
    const handleSelectChange = (e) => {
        const newValue = e.target.value;
        setTempValue(newValue); 
        onSave(newValue); // Save IMMEDIATELLY using the event value, not state
        setIsEditing(false); // Close edit mode immediately
    };

    if (isEditing) {
        // --- DROPDOWN MODE ---
        if (options && options.length > 0) {
            return (
                <select
                    ref={inputRef}
                    value={tempValue}
                    onChange={handleSelectChange} // Use the new handler
                    onBlur={() => setIsEditing(false)} // Just close on blur, don't save (saving happens on change)
                    className={`w-full min-w-[100px] p-1.5 border-2 border-indigo-400 rounded-lg bg-white text-slate-900 outline-none text-sm shadow-lg animate-in fade-in zoom-in duration-200 ${className}`}
                >
                    <option value="" disabled>Select...</option>
                    {/* Ensure current value is shown even if not in options list initially */}
                    {!options.includes(value) && value && <option value={value}>{value}</option>}
                    {options.map((opt, idx) => (
                        <option key={`${opt}-${idx}`} value={opt}>{opt}</option>
                    ))}
                </select>
            )
        }

        // --- TEXT INPUT MODE ---
        return (
            <input 
                ref={inputRef} 
                value={tempValue} 
                onChange={(e) => setTempValue(e.target.value)} 
                onBlur={handleBlur} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        inputRef.current.blur(); // Trigger blur to save
                    } else if (e.key === 'Escape') {
                        setTempValue(value); // Revert
                        setIsEditing(false);
                    }
                }} 
                className={`w-full min-w-[80px] p-1.5 border-2 border-indigo-400 rounded-lg bg-white text-slate-900 outline-none text-sm shadow-lg animate-in fade-in zoom-in duration-200 ${className}`} 
            />
        );
    }

    // --- VIEW MODE ---
    return (
        <div 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
            className={`cursor-pointer group hover:bg-indigo-50 hover:text-indigo-700 px-2 py-1.5 -mx-2 rounded-lg transition-all border border-transparent hover:border-indigo-100 min-h-[32px] flex items-center relative ${className}`}
            title="Click to edit"
        >
            <span className="truncate w-full">
                {value || <span className="text-slate-300 italic text-xs">Empty</span>}
            </span>
            {/* Visual indicator on hover */}
            <span className="absolute right-1 opacity-0 group-hover:opacity-40 text-[10px] text-indigo-400">▼</span>
        </div>
    );
});

// --- STAT CARD ---
export const StatCard = memo(({ icon: Icon, label, value, color }) => (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group">
        <div className={`p-4 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-1">{label}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
        </div>
    </div>
));

// --- CONFIRM MODAL ---
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 animate-scale-in shadow-2xl relative">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-5 ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        {type === 'danger' ? <AlertTriangleIcon className="h-8 w-8" /> : <RotateCcwIcon className="h-8 w-8" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">{message}</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                        <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                            {type === 'danger' ? 'Confirm' : 'Restore'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};