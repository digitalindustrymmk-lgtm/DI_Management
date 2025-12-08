import React from 'react';
import { XIcon, RotateCcwIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon } from '../Icons';

const SortOptionsModal = ({ isOpen, onClose, sortData, onConfirmSort }) => {
    if (!isOpen || !sortData) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-fade-in border border-white/20">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Sort By</h3>
                            <p className="text-sm text-indigo-500 font-medium">{sortData.label}</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => onConfirmSort(sortData.key, 'asc')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${sortData.currentDirection === 'asc' && sortData.currentKey === sortData.key ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'}`}
                        >
                            <span className="font-bold flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><ArrowUpIcon className="h-4 w-4" /></div>
                                Ascending (A-Z / 0-9)
                            </span>
                            {sortData.currentDirection === 'asc' && sortData.currentKey === sortData.key && <CheckIcon className="h-5 w-5 text-indigo-600" />}
                        </button>

                        <button 
                            onClick={() => onConfirmSort(sortData.key, 'desc')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${sortData.currentDirection === 'desc' && sortData.currentKey === sortData.key ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'}`}
                        >
                            <span className="font-bold flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><ArrowDownIcon className="h-4 w-4" /></div>
                                Descending (Z-A / 9-0)
                            </span>
                            {sortData.currentDirection === 'desc' && sortData.currentKey === sortData.key && <CheckIcon className="h-5 w-5 text-indigo-600" />}
                        </button>

                        <div className="border-t border-slate-100 my-4"></div>

                        <button 
                            onClick={() => onConfirmSort(sortData.key, null, true)} // Clear sort
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <RotateCcwIcon className="h-4 w-4" />
                            Reset / Clear Sort
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortOptionsModal;