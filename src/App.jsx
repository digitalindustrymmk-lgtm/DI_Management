import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { DatabaseIcon, LayoutGridIcon, UsersIcon, CheckSquareIcon, Trash2Icon, SettingsIcon, LogOutIcon, MenuIcon, BellIcon, SearchIcon, PlusIcon, ListIcon, Edit2Icon, UserIcon, SendIcon, ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon, XIcon } from './components/Icons'; 
import { ToastContainer, ConfirmModal, EditableCell } from './components/UI';
import Dashboard from './views/Dashboard';
import SettingsView from './views/SettingsView';
import BulkEditView from './views/BulkEditView';
import EmployeeFormModal from './components/EmployeeFormModal';
import { ACADEMIC_YEARS, GENERATIONS, GENDER_OPTIONS, safeString } from './utils';

// --- HELPER: SMART SEARCH NORMALIZER ---
const normalizeString = (str) => {
    if (!str) return '';
    return String(str).toLowerCase().replace(/\s+/g, '');
};

// Hook for Toasts
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return { toasts, addToast, removeToast };
};

// --- SUB-COMPONENTS (Card, Row, TrashRow) ---
const EmployeeCard = memo(({ employee, onEdit, onDelete, index }) => (
    <div className="group bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: `${index * 50}ms` }} onDoubleClick={onEdit}>
        <div className="p-6 flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-blue-50 z-0"></div>
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-2 group-hover:translate-x-0">
                <button onClick={(e) => {e.stopPropagation(); onEdit();}} className="text-indigo-600 bg-white hover:bg-indigo-50 p-2 rounded-xl shadow-sm transition-colors border border-indigo-100"><Edit2Icon className="h-4 w-4" /></button>
                <button onClick={(e) => {e.stopPropagation(); onDelete();}} className="text-rose-500 bg-white hover:bg-rose-50 p-2 rounded-xl shadow-sm transition-colors border border-rose-100"><Trash2Icon className="h-4 w-4" /></button>
            </div>
            <div className="relative z-10 mt-4">
                <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 bg-white relative group-hover:ring-4 group-hover:ring-indigo-100 transition-all">
                    {employee.imageUrl ? <img src={employee.imageUrl} alt={employee.name} className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><UserIcon className="h-12 w-12" /></div>}
                </div>
                <div className="absolute bottom-5 right-1 h-5 w-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-0.5">{employee.name}</h3>
            <p className="text-slate-500 text-sm font-medium">{employee.latinName}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-blue-100/50 text-blue-600 rounded-lg text-xs font-bold">{employee.skill || 'No Skill'}</span>
                <span className="px-3 py-1 bg-purple-100/50 text-purple-600 rounded-lg text-xs font-bold">{employee.group || 'No Group'}</span>
            </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 mt-auto backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-slate-500 flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">ID</span><span className="font-semibold text-slate-700">{employee.studentId}</span></div>
                <div className="text-slate-500 flex flex-col text-right"><span className="text-[10px] uppercase font-bold text-slate-400">Gender</span><span className={`font-semibold ${employee.gender === 'ស្រី' ? 'text-pink-500' : 'text-indigo-500'}`}>{employee.gender}</span></div>
                <div className="col-span-2 flex items-center gap-2 text-slate-500 truncate pt-2 border-t border-slate-200/50">
                    <div className="p-1.5 bg-blue-100 rounded-full text-blue-600"><SendIcon className="h-3 w-3" /></div>
                    <span className="truncate text-xs font-medium text-blue-600 hover:underline cursor-pointer">{employee.telegram || 'No Telegram'}</span>
                </div>
            </div>
        </div>
    </div>
));

const EmployeeRow = memo(({ employee, onEdit, onDelete, onInlineUpdate, index, settings }) => (
    <tr className="group hover:bg-indigo-50/30 transition-colors animate-fade-in border-b border-slate-100 last:border-0" onDoubleClick={onEdit}>
        <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur-sm group-hover:bg-indigo-50/50 z-20 border-r border-slate-100">
            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition-colors"><Edit2Icon className="h-4 w-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-rose-500 hover:bg-rose-100 p-2 rounded-lg transition-colors"><Trash2Icon className="h-4 w-4" /></button>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap sticky left-[88px] bg-white/90 backdrop-blur-sm group-hover:bg-indigo-50/50 z-20 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white">
                    {employee.imageUrl ? <img className="h-full w-full object-cover" src={employee.imageUrl} alt="" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-5 w-5" /></div>}
                </div>
                <div className="ml-3"><div className="font-bold text-slate-800 text-sm"><EditableCell value={employee.name} onSave={(val) => onInlineUpdate(employee.id, 'ឈ្មោះ', val)} /></div></div>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-medium"><EditableCell value={employee.latinName} onSave={(val) => onInlineUpdate(employee.id, 'ឈ្មោះឡាតាំង', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm"><EditableCell value={employee.gender} onSave={(val) => onInlineUpdate(employee.id, 'ភេទ', val)} options={GENDER_OPTIONS} className={`font-semibold ${employee.gender === 'ស្រី' ? 'text-pink-500' : 'text-indigo-500'}`} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-mono"><div className="bg-slate-100 px-2 py-1 rounded text-center text-xs font-bold text-slate-700"><EditableCell value={employee.studentId} onSave={(val) => onInlineUpdate(employee.id, 'អត្តលេខ', val)} /></div></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.skill} onSave={(val) => onInlineUpdate(employee.id, 'ជំនាញ', val)} options={settings?.skills} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
            <div className="flex flex-col">
                <span className="font-semibold text-slate-700"><EditableCell value={employee.group} onSave={(val) => onInlineUpdate(employee.id, 'ក្រុម', val)} options={settings?.groups} /></span>
                <span className="text-[10px] text-slate-400"><EditableCell value={employee.class} onSave={(val) => onInlineUpdate(employee.id, 'ថ្នាក់', val)} options={settings?.classes} /></span>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.section} onSave={(val) => onInlineUpdate(employee.id, 'ផ្នែកការងារ', val)} options={settings?.sections} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 text-xs font-medium text-center"><EditableCell value={employee.position} onSave={(val) => onInlineUpdate(employee.id, 'តួនាទី', val)} options={settings?.positions} /></div></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
            <div className="flex flex-col">
                <span><EditableCell value={employee.academicYear} onSave={(val) => onInlineUpdate(employee.id, 'ឆ្នាំសិក្សា', val)} options={ACADEMIC_YEARS} /></span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">Gen: <EditableCell value={employee.generation} onSave={(val) => onInlineUpdate(employee.id, 'ជំនាន់', val)} options={GENERATIONS} /></span>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.dob} onSave={(val) => onInlineUpdate(employee.id, 'ថ្ងៃខែឆ្នាំកំណើត', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate" title={employee.pob}><EditableCell value={employee.pob} onSave={(val) => onInlineUpdate(employee.id, 'ទីកន្លែងកំណើត', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500 cursor-pointer font-medium hover:underline"><EditableCell value={employee.telegram} onSave={(val) => onInlineUpdate(employee.id, 'តេឡេក្រាម', val)} /></td>
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, idx) => {
            const dayKh = ['ចន្ទ', 'អង្គារ៍', 'ពុធ', 'ព្រហស្បត្តិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'][idx];
            return <td key={day} className="px-4 py-3 whitespace-nowrap text-center border-l border-slate-100 text-sm font-medium text-slate-700 bg-slate-50/30"><EditableCell value={employee[day]} onSave={(val) => onInlineUpdate(employee.id, `កាលវិភាគ/${dayKh}`, val)} options={settings?.schedules} /></td>
        })}
    </tr>
), (prev, next) => prev.employee === next.employee && prev.index === next.index && prev.settings === next.settings);

const TrashRow = memo(({ employee, onRestore, onPermanentDelete, index }) => (
    <tr className="group hover:bg-red-50/50 transition-colors animate-fade-in border-b border-slate-100">
        <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur-sm group-hover:bg-red-50/30 z-20 border-r border-slate-100">
            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onRestore(employee)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg transition-colors" title="ស្តារវិញ"><RotateCcwIcon className="h-4 w-4" /></button>
                <button onClick={() => onPermanentDelete(employee.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors" title="លុបជារៀងរហូត"><Trash2Icon className="h-4 w-4" /></button>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 border-2 border-slate-100 rounded-full overflow-hidden opacity-70 grayscale">
                    {employee.imageUrl ? <img className="h-full w-full object-cover" src={employee.imageUrl} alt="" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-5 w-5" /></div>}
                </div>
                <div className="ml-3"><div className="font-bold text-slate-700 text-sm">{employee.name}</div></div>
            </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-500">{employee.latinName}</td>
        <td className="px-4 py-3 text-sm font-mono bg-slate-50 rounded text-center">{employee.studentId}</td>
        <td className="px-4 py-3 text-sm text-red-400 italic">Deleted just now</td>
    </tr>
));

// --- NEW COMPONENT: Encapsulated Employee List View ---
const EmployeeListView = ({ 
    employees, 
    loading, 
    settings,
    isRecycleBin = false, 
    onEdit, 
    onDelete, 
    onRestore, 
    onPermanentDelete, 
    onInlineUpdate, 
    onCreate 
}) => {
    // 1. Initialize viewMode based on screen size (Grid for mobile, List for desktop)
    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'grid' : 'list');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false); // State for mobile search bar toggle
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    
    // Force Grid View on Mobile Resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode('grid');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Table Dragging Refs
    const tableContainerRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => { isDragging.current = true; if(tableContainerRef.current) { startX.current = e.pageX - tableContainerRef.current.offsetLeft; scrollLeft.current = tableContainerRef.current.scrollLeft; tableContainerRef.current.classList.add('cursor-grabbing'); } };
    const onMouseLeave = () => { isDragging.current = false; if(tableContainerRef.current) tableContainerRef.current.classList.remove('cursor-grabbing'); };
    const onMouseUp = () => { isDragging.current = false; if(tableContainerRef.current) tableContainerRef.current.classList.remove('cursor-grabbing'); };
    const onMouseMove = (e) => { if (!isDragging.current) return; e.preventDefault(); if(tableContainerRef.current) { const x = e.pageX - tableContainerRef.current.offsetLeft; const walk = (x - startX.current) * 2; tableContainerRef.current.scrollLeft = scrollLeft.current - walk; } };

    // --- SEARCH LOGIC (NORMALIZED) ---
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        const term = normalizeString(searchTerm);
        return employees.filter(emp => 
            normalizeString(emp.name).includes(term) || 
            normalizeString(emp.latinName).includes(term) || 
            normalizeString(emp.studentId).includes(term)
        );
    }, [employees, searchTerm]);

    // Reset page on search
    useEffect(() => setCurrentPage(1), [searchTerm]);

    const currentItems = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // --- REUSABLE PAGINATION COMPONENT ---
    const PaginationControls = ({ className }) => (
        <div className={className}>
            <div className="text-xs font-medium text-slate-500 mb-2 md:mb-0">
                Showing {filteredEmployees.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
            </div>
            <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 shadow-sm transition-all active:scale-95"><ChevronLeftIcon className="h-4 w-4" /></button>
                <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm min-w-[80px] text-center flex items-center justify-center">{currentPage} / {Math.max(totalPages, 1)}</div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 shadow-sm transition-all active:scale-95"><ChevronRightIcon className="h-4 w-4" /></button>
            </div>
        </div>
    );

    return (
        <>
            {/* 1. MOBILE FLOATING ACTION BUTTONS - MOVED OUTSIDE THE ANIMATED DIV */}
            {/* This ensures they are truly FIXED to the viewport and not affected by parent animations */}
            {!isRecycleBin && (
                <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-4 z-[100]">
                    <button 
                        onClick={() => setShowMobileSearch(!showMobileSearch)} 
                        className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${showMobileSearch ? 'bg-slate-700 text-white rotate-90' : 'bg-white text-indigo-600 border border-indigo-100'}`}
                        style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                    >
                        {showMobileSearch ? <PlusIcon className="h-6 w-6 rotate-45" /> : <SearchIcon className="h-6 w-6" />}
                    </button>

                    <button 
                        onClick={onCreate} 
                        className="h-14 w-14 bg-indigo-600 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
                        style={{ boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)' }}
                    >
                        <PlusIcon className="h-7 w-7" />
                    </button>
                </div>
            )}

            {/* 2. MAIN CONTENT (ANIMATED) */}
            <div className="space-y-6 animate-fade-in relative min-h-[500px]">
                {/* Toolbar */}
                <div className={`glass-panel p-4 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 transition-all duration-300 ${!showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
                    
                    {/* Search Bar - Hidden on Mobile unless Toggled */}
                    <div className={`relative w-full md:w-96 group transition-all duration-300 ${showMobileSearch ? 'block' : 'hidden md:block'}`}>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" /></div>
                        <input type="text" className="block w-full pl-12 pr-4 py-3 border-none rounded-2xl bg-white/50 focus:bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 font-medium" placeholder="ស្វែងរក..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        {!isRecycleBin && (
                            <>
                            {/* Hidden md:flex = Only show on Desktop */}
                            <div className="hidden md:flex bg-white/50 p-1.5 rounded-xl items-center ring-1 ring-slate-200">
                                <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGridIcon className="h-5 w-5" /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon className="h-5 w-5" /></button>
                            </div>
                            {/* Hidden md:flex = Create Button only on Desktop (Mobile uses FAB) */}
                            <button onClick={onCreate} className="hidden md:flex flex-1 md:flex-none items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:-translate-y-1 transition-all"><PlusIcon className="h-5 w-5" /><span className="hidden sm:inline">បង្កើតថ្មី</span><span className="sm:hidden">New</span></button>
                            </>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="bg-white/50 h-64 rounded-3xl"></div>)}</div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-slate-300">
                        <div className="bg-slate-100 p-6 rounded-full mb-4 text-slate-400">{isRecycleBin ? <Trash2Icon className="h-10 w-10" /> : <SearchIcon className="h-10 w-10" />}</div>
                        <h3 className="text-xl font-bold text-slate-700">មិនមានទិន្នន័យ</h3>
                    </div>
                ) : (
                    <>
                        {(viewMode === 'grid' && !isRecycleBin) ? (
                            <>
                                {/* --- GRID VIEW --- */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentItems.map((emp, idx) => <EmployeeCard key={emp.id} employee={emp} onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp.id)} index={idx} />)}
                                </div>
                                {/* --- PAGINATION FOR GRID VIEW --- */}
                                <PaginationControls className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center bg-white/80 mt-6" />
                            </>
                        ) : (
                            <div className="glass-panel rounded-3xl overflow-hidden pb-0 bg-white/80">
                                {/* --- LIST VIEW --- */}
                                <div ref={tableContainerRef} className="overflow-x-auto cursor-grab active:cursor-grabbing custom-scrollbar" onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <thead className="bg-slate-50/80 backdrop-blur-md">
                                            <tr>
                                                <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-30 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">Action</th>
                                                <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider sticky left-[88px] bg-slate-50 z-30 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">Profile</th>
                                                <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[140px]">Latin Name</th>
                                                {isRecycleBin ? (<><th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">ID</th><th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th></>) : (
                                                    <>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[100px]">Gender</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[120px]">ID</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Skill</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Group Info</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Section</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Position</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Academic</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[120px]">DOB</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">POB</th>
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Telegram</th>
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <th key={d} className="px-4 py-4 text-center text-xs font-extrabold text-slate-500 uppercase border-l border-slate-200/50 min-w-[100px] bg-slate-100/30">{d}</th>)}
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {currentItems.map((emp, idx) => isRecycleBin ? 
                                                <TrashRow key={emp.id} employee={emp} onRestore={onRestore} onPermanentDelete={onPermanentDelete} index={idx} /> : 
                                                <EmployeeRow key={emp.id} employee={emp} onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp.id)} onInlineUpdate={onInlineUpdate} index={idx} settings={settings} />
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* --- PAGINATION FOR LIST VIEW --- */}
                                <PaginationControls className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

// --- MAIN APP COMPONENT ---
function App() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [deletedEmployees, setDeletedEmployees] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const { toasts, addToast, removeToast } = useToast();

    // Firebase Data Fetching
    useEffect(() => { const unsubscribe = auth.onAuthStateChanged((u) => setUser(u)); auth.signInAnonymously().catch((error) => { console.error("Sign in failed:", error); addToast("បរាជ័យក្នុងការ Sign In", 'error'); }); return () => unsubscribe(); }, []);
    
    useEffect(() => {
        if (!user) return;
        const dbRef = db.ref('students');
        const deletedRef = db.ref('deleted_students');
        const settingsRef = db.ref('settings');

        const handleData = (snapshot, setFn) => {
            const data = snapshot.val();
            if (data) {
                const formatted = Object.keys(data).map(key => {
                    const item = data[key] || {};
                    const schedule = item['កាលវិភាគ'] || {};
                    return { id: key, imageUrl: safeString(item['រូបថត'] || item.imageUrl), name: safeString(item['ឈ្មោះ'] || item.name), latinName: safeString(item['ឈ្មោះឡាតាំង']), gender: safeString(item['ភេទ']), dob: safeString(item['ថ្ងៃខែឆ្នាំកំណើត']), pob: safeString(item['ទីកន្លែងកំណើត']), studentId: safeString(item['អត្តលេខ']), academicYear: safeString(item['ឆ្នាំសិក្សា']), generation: safeString(item['ជំនាន់']), group: safeString(item['ក្រុម']), class: safeString(item['ថ្នាក់']), skill: safeString(item['ជំនាញ']), section: safeString(item['ផ្នែកការងារ']), position: safeString(item['តួនាទី']), telegram: safeString(item['តេឡេក្រាម']), mon: safeString(schedule['ចន្ទ'] || item['ចន្ទ']), tue: safeString(schedule['អង្គារ៍'] || item['អង្គារ៍']), wed: safeString(schedule['ពុធ'] || item['ពុធ']), thu: safeString(schedule['ព្រហស្បត្តិ៍'] || item['ព្រហស្បត្តិ៍']), fri: safeString(schedule['សុក្រ'] || item['សុក្រ']), sat: safeString(schedule['សៅរ៍'] || item['សៅរ៍']), sun: safeString(schedule['អាទិត្យ'] || item['អាទិត្យ']), originalData: item };
                });
                setFn(formatted.reverse());
            } else setFn([]);
        };

        dbRef.on('value', snap => { handleData(snap, setEmployees); setLoading(false); });
        deletedRef.on('value', snap => handleData(snap, setDeletedEmployees));
        settingsRef.on('value', snap => setSettings(snap.val() || {}));
        return () => { dbRef.off(); deletedRef.off(); settingsRef.off(); };
    }, [user]);

    const stats = useMemo(() => ({ total: employees.length, male: employees.filter(e => e.gender === 'ប្រុស').length, female: employees.filter(e => e.gender === 'ស្រី').length }), [employees]);

    // Data Handlers
    const initiateDelete = useCallback((id) => {
        const emp = employees.find(e => e.id === id);
        setConfirmDialog({ isOpen: true, type: 'danger', title: 'បញ្ជាក់ការលុប', message: `តើអ្នកពិតជាចង់លុប "${emp?.name}" ទៅកាន់ធុងសំរាមមែនទេ?`, onConfirm: async () => { try { await db.ref(`deleted_students/${emp.id}`).set({ ...emp.originalData, deletedAt: Date.now() }); await db.ref(`students/${emp.id}`).remove(); setConfirmDialog(prev => ({...prev, isOpen: false})); addToast("បានបញ្ជូនទៅធុងសំរាម", 'success'); } catch (error) { addToast("បរាជ័យក្នុងការលុប", 'error'); } } });
    }, [employees]);

    const handleRestore = useCallback((employee) => {
        setConfirmDialog({ isOpen: true, type: 'restore', title: 'បញ្ជាក់ការស្តារ', message: `តើអ្នកចង់ស្តារ "${employee.name}" ត្រឡប់មកវិញទេ?`, onConfirm: async () => { try { await db.ref(`students/${employee.id}`).set(employee.originalData); await db.ref(`deleted_students/${employee.id}`).remove(); setConfirmDialog(prev => ({ ...prev, isOpen: false })); addToast("បានស្តារទិន្នន័យជោគជ័យ", 'success'); } catch (e) { addToast("បរាជ័យ", 'error'); } } });
    }, []);

    const handlePermanentDelete = useCallback((id) => {
        setConfirmDialog({ isOpen: true, type: 'danger', title: 'លុបជារៀងរហូត', message: "តើអ្នកចង់លុបជារៀងរហូតមែនទេ? ទិន្នន័យមិនអាចយកមកវិញបានទេ។", onConfirm: async () => { try { await db.ref(`deleted_students/${id}`).remove(); setConfirmDialog(prev => ({ ...prev, isOpen: false })); addToast("លុបជាស្ថាពរជោគជ័យ", 'success'); } catch (e) { addToast("បរាជ័យ", 'error'); } } });
    }, []);

    const handleInlineUpdate = useCallback(async (id, field, value) => { try { await db.ref(`students/${id}`).update({ [field]: value }); } catch (error) { addToast("បរាជ័យក្នុងការកែប្រែ", 'error'); } }, []);

    // Helper Component for Sidebar and Header (Needs access to location)
    const MainLayout = () => {
        const location = useLocation();
        const navigate = useNavigate();

        const getTitle = () => {
            switch(location.pathname) {
                case '/': return 'Dashboard Overview';
                case '/employees': return 'Employee Management';
                case '/recycle-bin': return 'Recycle Bin';
                case '/settings': return 'System Settings';
                case '/bulk-edit': return 'Bulk Edit Mode';
                default: return 'HR Pro';
            }
        };

        const navLinkClass = (path) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${location.pathname === path ? 'active-nav-item shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`;

        return (
            <div className="flex h-screen overflow-hidden">
                <aside className={`fixed inset-y-4 left-4 z-50 w-72 glass-sidebar rounded-3xl transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:inset-y-0 md:left-0 md:rounded-none md:border-r md:bg-slate-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'} flex flex-col shadow-2xl`}>
                    <div className="h-24 flex items-center justify-center border-b border-white/5">
                        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"><DatabaseIcon className="h-8 w-8 text-blue-500" /> HR PRO</div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                        <NavLink to="/" onClick={() => setSidebarOpen(false)} className={({isActive}) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'active-nav-item shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><LayoutGridIcon className="h-5 w-5" /> ផ្ទាំងគ្រប់គ្រង</NavLink>
                        <NavLink to="/employees" onClick={() => setSidebarOpen(false)} className={({isActive}) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'active-nav-item shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><UsersIcon className="h-5 w-5" /> បុគ្គលិក</NavLink>
                        <NavLink to="/bulk-edit" onClick={() => setSidebarOpen(false)} className={({isActive}) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'active-nav-item shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><CheckSquareIcon className="h-5 w-5" /> កែប្រែទិន្នន័យ</NavLink>
                        <NavLink to="/recycle-bin" onClick={() => setSidebarOpen(false)} className={({isActive}) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Trash2Icon className="h-5 w-5" /> ធុងសំរាម</NavLink>
                        <div className="my-6 border-t border-white/5"></div>
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">System</p>
                        <NavLink to="/settings" onClick={() => setSidebarOpen(false)} className={({isActive}) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'active-nav-item shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><SettingsIcon className="h-5 w-5" /> ការកំណត់</NavLink>
                    </div>
                    <div className="p-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-4 text-center">
                            <p className="text-white text-xs font-medium opacity-80 mb-2">Logged in as Admin</p>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all text-sm font-bold backdrop-blur-sm"><LogOutIcon className="h-4 w-4" /> Sign Out</button>
                        </div>
                    </div>
                </aside>

                {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>}

                <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <header className="h-20 glass-panel border-b-0 m-4 rounded-3xl flex items-center justify-between px-8 z-30 shrink-0 sticky top-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"><MenuIcon className="h-6 w-6" /></button>
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 hidden sm:block">
                                {getTitle()}
                            </h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative"><BellIcon className="h-6 w-6 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer" /><span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span></div>
                            <div className="h-8 w-[1px] bg-slate-200"></div>
                            <div className="flex items-center gap-3"><div className="text-right hidden md:block"><div className="text-sm font-bold text-slate-700">Admin User</div><div className="text-xs text-slate-400 font-medium">Super Admin</div></div><div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white">A</div></div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8 custom-scrollbar">
                        <Routes>
                            <Route path="/" element={<Dashboard stats={stats} onNavigate={(path) => navigate(path)} />} />
                            <Route path="/employees" element={
                                <EmployeeListView 
                                    employees={employees} 
                                    loading={loading}
                                    settings={settings}
                                    onEdit={(emp) => { setCurrentEmployee(emp); setIsModalOpen(true); }}
                                    onDelete={initiateDelete}
                                    onInlineUpdate={handleInlineUpdate}
                                    onCreate={() => { setCurrentEmployee(null); setIsModalOpen(true); }}
                                />
                            } />
                            <Route path="/recycle-bin" element={
                                <EmployeeListView 
                                    employees={deletedEmployees}
                                    loading={loading}
                                    isRecycleBin={true}
                                    onRestore={handleRestore}
                                    onPermanentDelete={handlePermanentDelete}
                                />
                            } />

                            <Route path="/bulk-edit" element={<BulkEditView db={db} employees={employees} settings={settings} addToast={addToast} setConfirmDialog={setConfirmDialog}  />} />
                            <Route path="/settings" element={<SettingsView db={db} settings={settings} setConfirmDialog={setConfirmDialog} addToast={addToast} />} />
                        </Routes>
                    </main>
                </div>
            </div>
        );
    };

    return (
        // REMOVED <Router> here because it is provided by main.jsx
        <>
            <MainLayout />
            {isModalOpen && <EmployeeFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employee={currentEmployee} db={db} addToast={addToast} settings={settings} />}
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog(prev => ({...prev, isOpen: false}))} {...confirmDialog} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

export default App;