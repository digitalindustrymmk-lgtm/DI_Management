import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FilterIcon, SearchIcon, PlusIcon, Trash2Icon, CheckSquareIcon, XIcon, LayoutGridIcon, ListIcon, RotateCcwIcon, PrinterIcon 
} from '../Icons';
import SortOptionsModal from '../common/SortOptionsModal';
import SortableHeader from '../common/SortableHeader';
import PaginationControls from '../common/PaginationControls';
import PrintOptionsModal from '../common/PrintOptionsModal'; // <--- NEW IMPORT
import EmployeeCard from './EmployeeCard';
import EmployeeRow from './EmployeeRow';
import TrashRow from './TrashRow';
import { normalizeString } from '../../utils/helpers';

const EmployeeListView = ({ 
    employees, 
    loading, 
    settings,
    isRecycleBin = false, 
    isModalOpen,
    onEdit, 
    onDelete, 
    onRestore, 
    onPermanentDelete, 
    onInlineUpdate, 
    onCreate,
    onBulkDelete
}) => {
    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'grid' : 'list');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState(new Set());
    
    // --- PRINT MODAL STATE ---
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    // --- FILTERS & SORTING STATE ---
    const [filterGroup, setFilterGroup] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // --- SORT MODAL STATE ---
    const [sortModalData, setSortModalData] = useState(null); 

    const itemsPerPage = 50;
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode('grid');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setSelectedIds(new Set());
    }, [isRecycleBin]);
    
    const tableContainerRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e) => { isDragging.current = true; if(tableContainerRef.current) { startX.current = e.pageX - tableContainerRef.current.offsetLeft; scrollLeft.current = tableContainerRef.current.scrollLeft; tableContainerRef.current.classList.add('cursor-grabbing'); } };
    const onMouseLeave = () => { isDragging.current = false; if(tableContainerRef.current) tableContainerRef.current.classList.remove('cursor-grabbing'); };
    const onMouseUp = () => { isDragging.current = false; if(tableContainerRef.current) tableContainerRef.current.classList.remove('cursor-grabbing'); };
    const onMouseMove = (e) => { if (!isDragging.current) return; e.preventDefault(); if(tableContainerRef.current) { const x = e.pageX - tableContainerRef.current.offsetLeft; const walk = (x - startX.current) * 2; tableContainerRef.current.scrollLeft = scrollLeft.current - walk; } };

    // Derived Unique Values for Filters
    const uniqueGroups = useMemo(() => {
        const groups = employees.map(emp => emp.group).filter(g => g && g.trim() !== '');
        return [...new Set(groups)].sort();
    }, [employees]);

    const uniqueClasses = useMemo(() => {
        const classes = employees.map(emp => emp.class).filter(c => c && c.trim() !== '');
        return [...new Set(classes)].sort();
    }, [employees]);

    const uniqueYears = useMemo(() => {
        const years = employees.map(emp => emp.academicYear).filter(y => y && y.trim() !== '');
        return [...new Set(years)].sort();
    }, [employees]);

    // NEW: Unique Sections
    const uniqueSections = useMemo(() => {
        const sections = employees.map(emp => emp.section).filter(s => s && s.trim() !== '');
        return [...new Set(sections)].sort();
    }, [employees]);

    // Filtering Logic
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = !searchTerm || 
                normalizeString(emp.name).includes(normalizeString(searchTerm)) || 
                normalizeString(emp.latinName).includes(normalizeString(searchTerm)) || 
                normalizeString(emp.studentId).includes(normalizeString(searchTerm));
            
            const matchesGroup = !filterGroup || emp.group === filterGroup;
            const matchesClass = !filterClass || emp.class === filterClass;
            const matchesYear = !filterYear || emp.academicYear === filterYear;

            return matchesSearch && matchesGroup && matchesClass && matchesYear;
        });
    }, [employees, searchTerm, filterGroup, filterClass, filterYear]);

    // --- SORTING LOGIC ---
    const sortedEmployees = useMemo(() => {
        let sortableItems = [...filteredEmployees];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key] ? String(a[sortConfig.key]) : '';
                const valB = b[sortConfig.key] ? String(b[sortConfig.key]) : '';
                
                if (sortConfig.key === 'studentId') {
                    return sortConfig.direction === 'asc' 
                        ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
                        : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
                }
                if (sortConfig.key === 'name') {
                    return sortConfig.direction === 'asc'
                        ? valA.localeCompare(valB, 'km')
                        : valB.localeCompare(valA, 'km');
                }
                return sortConfig.direction === 'asc'
                    ? valA.localeCompare(valB, 'en', { sensitivity: 'base' })
                    : valB.localeCompare(valA, 'en', { sensitivity: 'base' });
            });
        }
        return sortableItems;
    }, [filteredEmployees, sortConfig]);

    // --- HANDLE SORT MODAL ---
    const handleOpenSortModal = (key, label) => {
        setSortModalData({ 
            key, 
            label, 
            currentKey: sortConfig.key, 
            currentDirection: sortConfig.direction 
        });
    };

    const handleConfirmSort = (key, direction, clear = false) => {
        if (clear) {
             setSortConfig({ key: null, direction: 'asc' });
        } else {
             setSortConfig({ key, direction });
        }
        setSortModalData(null); 
    };

    useEffect(() => setCurrentPage(1), [searchTerm, filterGroup, filterClass, filterYear]);

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
        }
    };

    const currentItems = sortedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

    return (
        <>
            <SortOptionsModal 
                isOpen={!!sortModalData} 
                sortData={sortModalData} 
                onClose={() => setSortModalData(null)} 
                onConfirmSort={handleConfirmSort} 
            />

            <PrintOptionsModal 
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                employees={employees} // Pass ALL employees so modal can filter
                uniqueGroups={uniqueGroups}
                uniqueClasses={uniqueClasses}
                uniqueSections={uniqueSections}
            />

            {!isRecycleBin && !isModalOpen && (
                <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-4 z-[90]">
                      {selectedIds.size > 0 && (
                           <button 
                            onClick={() => { onBulkDelete(Array.from(selectedIds)); setSelectedIds(new Set()); }}
                            className="h-14 w-14 bg-red-600 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-red-500/40 shadow-xl"
                        >
                            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-red-100">{selectedIds.size}</span>
                            <Trash2Icon className="h-6 w-6" />
                        </button>
                    )}
                    <button onClick={toggleSelectAll} className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${selectedIds.size > 0 && selectedIds.size === filteredEmployees.length ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-100'}`} style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}><CheckSquareIcon className="h-6 w-6" /></button>
                    <button onClick={() => setShowMobileSearch(!showMobileSearch)} className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${showMobileSearch ? 'bg-slate-700 text-white rotate-90' : 'bg-white text-indigo-600 border border-indigo-100'}`} style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}>{showMobileSearch ? <PlusIcon className="h-6 w-6 rotate-45" /> : <SearchIcon className="h-6 w-6" />}</button>
                    <button onClick={onCreate} className="h-14 w-14 bg-indigo-600 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)' }}><PlusIcon className="h-7 w-7" /></button>
                </div>
            )}

            <div className={`md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-md transition-opacity duration-300 ${showMobileSearch ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMobileSearch(false)}>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 shadow-2xl transition-transform duration-300 ${showMobileSearch ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-lg">Search & Filter</h3>
                        <button onClick={() => setShowMobileSearch(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><XIcon className="h-5 w-5" /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" /></div>
                            <input type="text" className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Search name, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full py-3 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold outline-none">
                                <option value="">All Groups</option>
                                {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full py-3 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold outline-none">
                                <option value="">All Classes</option>
                                {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full py-3 px-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold outline-none col-span-2">
                                <option value="">All Academic Years</option>
                                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>

                        <button onClick={() => setShowMobileSearch(false)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold mt-2 shadow-lg shadow-indigo-200">Show Results ({filteredEmployees.length})</button>
                    </div>
                </div>
            </div>

            <div className="space-y-6 animate-fade-in relative min-h-[500px]">
                <div className={`glass-panel p-4 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20 transition-all duration-300 ${!showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
                    
                    <div className={`flex flex-1 gap-3 items-center w-full transition-all duration-300 ${showMobileSearch ? 'block' : 'hidden md:flex'}`}>
                        <div className="relative w-full md:w-64 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" /></div>
                            <input type="text" className="block w-full pl-12 pr-4 py-2.5 border-none rounded-2xl bg-white/50 focus:bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 font-medium text-sm" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="hidden xl:flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100 whitespace-nowrap">
                                <FilterIcon className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-bold text-indigo-600">Filter:</span>
                            </div>
                            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200 min-w-[100px] hover:border-indigo-300 transition-colors cursor-pointer"><option value="">Group</option>{uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}</select>
                            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200 min-w-[100px] hover:border-indigo-300 transition-colors cursor-pointer"><option value="">Class</option>{uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}</select>
                            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px] hover:border-indigo-300 transition-colors cursor-pointer"><option value="">Year</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select>
                            {(filterGroup || filterClass || filterYear) && (
                                <button onClick={() => { setFilterGroup(''); setFilterClass(''); setFilterYear(''); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reset Filters"><RotateCcwIcon className="h-4 w-4" /></button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        {!isRecycleBin && (
                            <>
                            {selectedIds.size > 0 ? (
                                <div className="hidden md:flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl animate-fade-in">
                                    <span className="text-sm font-bold text-indigo-700">{selectedIds.size} Selected</span>
                                    <button 
                                        onClick={() => { onBulkDelete(Array.from(selectedIds)); setSelectedIds(new Set()); }}
                                        className="flex items-center gap-2 bg-white text-red-600 px-3 py-1.5 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2Icon className="h-4 w-4" /> Delete
                                    </button>
                                    <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-slate-600"><XIcon className="h-4 w-4" /></button>
                                </div>
                            ) : (
                                <div className="hidden md:flex bg-white/50 p-1.5 rounded-xl items-center ring-1 ring-slate-200">
                                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGridIcon className="h-5 w-5" /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon className="h-5 w-5" /></button>
                                    
                                    {/* PRINT BUTTON */}
                                    <button onClick={() => setIsPrintModalOpen(true)} className="p-2.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all ml-1" title="Export PDF">
                                        <PrinterIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                            {viewMode === 'grid' && (
                                <button onClick={toggleSelectAll} className="hidden md:flex items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all" title="Select All">
                                    <CheckSquareIcon className={`h-5 w-5 ${selectedIds.size > 0 && selectedIds.size === filteredEmployees.length ? 'text-indigo-600' : ''}`} />
                                </button>
                            )}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentItems.map((emp, idx) => (
                                        <EmployeeCard 
                                            key={emp.id} 
                                            employee={emp} 
                                            onEdit={() => onEdit(emp)} 
                                            onDelete={() => onDelete(emp.id)} 
                                            index={idx}
                                            isSelected={selectedIds.has(emp.id)} 
                                            onToggleSelect={toggleSelect} 
                                        />
                                    ))}
                                </div>
                                <PaginationControls 
                                    className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center bg-white/80 mt-6"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={sortedEmployees.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        ) : (
                            <div className="glass-panel rounded-3xl overflow-hidden pb-0 bg-white/80">
                                <div ref={tableContainerRef} className="overflow-x-auto cursor-grab active:cursor-grabbing custom-scrollbar" onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
                                    <table className="min-w-full divide-y divide-slate-100">
                                        <thead className="bg-slate-50/80 backdrop-blur-md">
                                            <tr>
                                                <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-30 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                                                    {!isRecycleBin ? (
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedIds.size > 0 && selectedIds.size === filteredEmployees.length}
                                                                onChange={toggleSelectAll}
                                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                            />
                                                            <span>Action</span>
                                                        </div>
                                                    ) : "Action"}
                                                </th>
                                                
                                                {/* --- FIXED: Sticky + Sortable Header (Removed nested <th>) --- */}
                                                <SortableHeader 
                                                    label="Name / Profile" 
                                                    sortKey="name" 
                                                    currentSort={sortConfig} 
                                                    onOpenSort={handleOpenSortModal} 
                                                    className="px-0 py-0 sticky left-[88px] bg-slate-50 z-30 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]"
                                                />
                                                
                                                <SortableHeader label="Latin Name" sortKey="latinName" currentSort={sortConfig} onOpenSort={handleOpenSortModal} />
                                                
                                                {isRecycleBin ? (<><th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">ID</th><th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th></>) : (
                                                    <>
                                                        <SortableHeader label="Gender" sortKey="gender" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[100px]" />
                                                        <SortableHeader label="ID" sortKey="studentId" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[120px]" />
                                                        <SortableHeader label="Skill" sortKey="skill" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[150px]" />
                                                        <SortableHeader label="Group" sortKey="group" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[100px]" />
                                                        <SortableHeader label="Class" sortKey="class" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[100px]" />
                                                        <SortableHeader label="Section" sortKey="section" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[150px]" />
                                                        <SortableHeader label="Position" sortKey="position" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[150px]" />
                                                        <SortableHeader label="Academic" sortKey="academicYear" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[150px]" />
                                                        <SortableHeader label="DOB" sortKey="dob" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[120px]" />
                                                        <SortableHeader label="POB" sortKey="pob" currentSort={sortConfig} onOpenSort={handleOpenSortModal} className="min-w-[150px]" />
                                                        <th className="px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider min-w-[150px]">Telegram</th>
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <th key={d} className="px-4 py-4 text-center text-xs font-extrabold text-slate-500 uppercase border-l border-slate-200/50 min-w-[100px] bg-slate-100/30">{d}</th>)}
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {currentItems.map((emp, idx) => isRecycleBin ? 
                                                <TrashRow key={emp.id} employee={emp} onRestore={onRestore} onPermanentDelete={onPermanentDelete} index={idx} /> : 
                                                <EmployeeRow 
                                                    key={emp.id} 
                                                    employee={emp} 
                                                    onEdit={() => onEdit(emp)} 
                                                    onDelete={() => onDelete(emp.id)} 
                                                    onInlineUpdate={onInlineUpdate} 
                                                    index={idx} 
                                                    settings={settings}
                                                    isSelected={selectedIds.has(emp.id)} 
                                                    onToggleSelect={toggleSelect} 
                                                />
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <PaginationControls 
                                    className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={sortedEmployees.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default EmployeeListView;