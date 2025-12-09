import React, { useState, useMemo } from 'react';
import { RotateCcwIcon, Trash2Icon, SearchIcon, UserIcon, AlertCircleIcon } from '../components/Icons'; // Ensure path is correct

// --- 📱 MOBILE CARD COMPONENT (Visible on Phones) ---
const TrashCard = ({ employee, onRestore, onPermanentDelete }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-4 relative overflow-hidden animate-scale-in">
        {/* Red status line on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-400"></div>

        <div className="flex items-start justify-between pl-3 mb-4">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0 grayscale">
                     {employee.imageUrl ? (
                        <img src={employee.imageUrl} alt={employee.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400"><UserIcon className="h-6 w-6" /></div>
                    )}
                </div>
                {/* Name & Info */}
                <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{employee.name}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-0.5">{employee.latinName}</p>
                </div>
            </div>
            {/* ID Badge */}
            <span className="bg-slate-100 text-slate-500 text-xs font-mono font-bold px-2 py-1 rounded-md">
                {employee.studentId}
            </span>
        </div>

        {/* Action Buttons (Full Width on Mobile) */}
        <div className="grid grid-cols-2 gap-3 pl-3">
            <button 
                onClick={() => onRestore(employee)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm active:scale-95 transition-transform border border-emerald-100"
            >
                <RotateCcwIcon className="w-4 h-4" /> Restore
            </button>
            <button 
                onClick={() => onPermanentDelete(employee.id)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm active:scale-95 transition-transform border border-red-100"
            >
                <Trash2Icon className="w-4 h-4" /> Delete
            </button>
        </div>
    </div>
);

// --- 💻 DESKTOP TABLE ROW (Visible on PC) ---
const TrashTableRow = ({ employee, onRestore, onPermanentDelete }) => (
    <tr className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-slate-200">
                    {employee.imageUrl ? (
                        <img src={employee.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center"><UserIcon className="h-5 w-5 text-slate-400" /></div>
                    )}
                </div>
                <div>
                    <div className="font-bold text-slate-700">{employee.name}</div>
                    <div className="text-xs text-slate-400 uppercase font-semibold tracking-wide">{employee.latinName}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-slate-200">
                {employee.studentId}
            </span>
        </td>
        <td className="px-6 py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-500 border border-red-100 text-xs font-medium">
                <AlertCircleIcon className="w-3 h-3"/> Deleted
            </div>
        </td>
        <td className="px-6 py-4 text-right">
            {/* Buttons appear on hover, or are semi-transparent */}
            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-60 group-hover:opacity-100 transition-all">
                <button onClick={() => onRestore(employee)} className="p-2 bg-white text-emerald-600 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-lg shadow-sm transition-all tooltip" title="Restore">
                    <RotateCcwIcon className="w-4 h-4" />
                </button>
                <button onClick={() => onPermanentDelete(employee.id)} className="p-2 bg-white text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition-all tooltip" title="Delete Forever">
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
        </td>
    </tr>
);

// --- 🚀 MAIN VIEW CONTROLLER ---
export default function RecycleBinView({ employees, loading, onRestore, onPermanentDelete }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        if (!employees) return [];
        return employees.filter(e => 
            e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            Loading...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Trash2Icon className="w-7 h-7 text-red-500" /> 
                        Recycle Bin
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and restore deleted employee records</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search deleted items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Trash2Icon className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">No deleted items found</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">Your recycle bin is empty. Deleted employees will appear here.</p>
                </div>
            )}

            {/* --- RESPONSIVE SWITCH --- */}
            
            {/* 1. MOBILE VIEW (Cards) - Hidden on md and up */}
            <div className="block md:hidden space-y-4">
                {filtered.map(emp => (
                    <TrashCard 
                        key={emp.id} 
                        employee={emp} 
                        onRestore={onRestore} 
                        onPermanentDelete={onPermanentDelete} 
                    />
                ))}
            </div>

            {/* 2. DESKTOP VIEW (Table) - Hidden on small screens */}
            {filtered.length > 0 && (
                <div className="hidden md:block bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Code</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(emp => (
                                <TrashTableRow 
                                    key={emp.id} 
                                    employee={emp} 
                                    onRestore={onRestore} 
                                    onPermanentDelete={onPermanentDelete} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}