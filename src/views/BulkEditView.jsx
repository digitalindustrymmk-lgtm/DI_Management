import React, { useState, useMemo } from 'react';

// --- INLINED CONSTANTS & ICONS ---

const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Loader2Icon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const BriefcaseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const XIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MapPinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// --- SEARCH CONTROLS (Moved Outside & Updated with Section Filter) ---
const SearchControls = ({ 
  searchTerm, setSearchTerm, 
  filterClass, setFilterClass, 
  filterYear, setFilterYear, 
  filterGroup, setFilterGroup, 
  filterSection, setFilterSection, // NEW: Section Filter Props
  uniqueClasses, uniqueYears, 
  uniqueGroups, 
  uniqueSections // NEW: Unique Sections List
}) => (
  <>
    <div className="relative w-full md:w-64 group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      </div>
      <input 
        type="text" 
        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400" 
        placeholder="ស្វែងរក..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    </div>
    
    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100 whitespace-nowrap">
        <FilterIcon className="h-4 w-4 text-indigo-500" />
        <span className="text-xs font-bold text-indigo-600">Filter:</span>
      </div>
      
      {/* Group Filter */}
      <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]">
        <option value="">គ្រប់ក្រុម</option>
        {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      {/* Class Filter */}
      <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]">
        <option value="">គ្រប់ថ្នាក់</option>
        {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* NEW: Section Filter */}
      <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]">
        <option value="">គ្រប់ផ្នែក</option>
        {uniqueSections.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Year Filter */}
      <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]">
        <option value="">គ្រប់ឆ្នាំសិក្សា</option>
        {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  </>
);

// --- MAIN COMPONENT ---

export default function BulkEditView({ db, employees, settings, addToast, setConfirmDialog }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    
    // Search & Filter State
    const [filterClass, setFilterClass] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [filterSection, setFilterSection] = useState(''); // NEW: Section Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    
    // Edit & Modal State
    const [isApplying, setIsApplying] = useState(false);
    const [viewEmployee, setViewEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState('personal'); 
    const [updateData, setUpdateData] = useState({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });

    const uniqueClasses = useMemo(() => {
        const classes = employees.map(emp => emp.class).filter(c => c && c.trim() !== '');
        return [...new Set(classes)].sort();
    }, [employees]);

    const uniqueYears = useMemo(() => {
        const years = employees.map(emp => emp.academicYear).filter(y => y && y.trim() !== '');
        return [...new Set(years)].sort();
    }, [employees]);

    const uniqueGroups = useMemo(() => {
        const groups = employees.map(emp => emp.group).filter(g => g && g.trim() !== '');
        return [...new Set(groups)].sort();
    }, [employees]);

    // NEW: Unique Sections Calculation
    const uniqueSections = useMemo(() => {
        const sections = employees.map(emp => emp.section).filter(s => s && s.trim() !== '');
        return [...new Set(sections)].sort();
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchClass = filterClass ? emp.class === filterClass : true;
            const matchYear = filterYear ? emp.academicYear === filterYear : true;
            const matchGroup = filterGroup ? emp.group === filterGroup : true;
            const matchSection = filterSection ? emp.section === filterSection : true; // NEW: Section Filter Logic
            const isNumericId = /^\d+$/.test(emp.studentId || '');

            const cleanSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, '');
            const cleanName = (emp.name || '').toLowerCase().replace(/\s+/g, '');
            const cleanLatinName = (emp.latinName || '').toLowerCase().replace(/\s+/g, '');
            const cleanId = (emp.studentId || '').toLowerCase().replace(/\s+/g, '');

            const matchSearch = cleanName.includes(cleanSearchTerm) || 
                                cleanLatinName.includes(cleanSearchTerm) || 
                                cleanId.includes(cleanSearchTerm);
            
            return matchClass && matchYear && matchGroup && matchSection && isNumericId && matchSearch;
        });
    }, [employees, filterClass, filterYear, filterGroup, filterSection, searchTerm]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(filteredEmployees.map(e => e.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const handleUpdateChange = (field, value) => setUpdateData(prev => ({ ...prev, [field]: value }));

    const executeBulkUpdate = async () => {
        setIsApplying(true);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));

        const updates = {};
        const fieldsToUpdate = {};
        
        if(updateData.group) fieldsToUpdate['ក្រុម'] = updateData.group;
        if(updateData.section) fieldsToUpdate['ផ្នែកការងារ'] = updateData.section;
        if(updateData.position) fieldsToUpdate['តួនាទី'] = updateData.position;
        if(updateData.academicYear) fieldsToUpdate['ឆ្នាំសិក្សា'] = updateData.academicYear;
        
        const scheduleFields = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const khmerDays = ['ចន្ទ', 'អង្គារ៍', 'ពុធ', 'ព្រហស្បត្តិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'];
        
        selectedIds.forEach(id => {
            Object.keys(fieldsToUpdate).forEach(key => { updates[`students/${id}/${key}`] = fieldsToUpdate[key]; });
            scheduleFields.forEach((day, idx) => { if(updateData[day]) { updates[`students/${id}/កាលវិភាគ/${khmerDays[idx]}`] = updateData[day]; } });
        });

        try {
            if (Object.keys(updates).length > 0) {
                await db.ref().update(updates);
                addToast(`បានកែប្រែទិន្នន័យជោគជ័យសម្រាប់ ${selectedIds.size} នាក់`, 'success');
                setSelectedIds(new Set());
                setUpdateData({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });
            } else { 
                addToast("សូមជ្រើសរើសទិន្នន័យដែលត្រូវកែប្រែ", "warning"); 
            }
        } catch (error) { 
            console.error(error); 
            addToast("បរាជ័យក្នុងការកែប្រែ", "error"); 
        } finally { 
            setIsApplying(false); 
        }
    };

    const handleApplyClick = () => {
        if (selectedIds.size === 0) {
            addToast("សូមជ្រើសរើសបុគ្គលិកជាមុនសិន", "warning");
            return;
        }

        const hasFields = Object.values(updateData).some(val => val !== '');
        if (!hasFields) {
            addToast("សូមជ្រើសរើសព័ត៌មានដែលត្រូវកែប្រែ", "warning");
            return;
        }

        setConfirmDialog({
            isOpen: true,
            type: 'warning',
            title: 'បញ្ជាក់ការកែប្រែ',
            message: `តើអ្នកចង់កែប្រែទិន្នន័យសម្រាប់បុគ្គលិកចំនួន ${selectedIds.size} នាក់ដែលបានជ្រើសរើសមែនទេ?`,
            onConfirm: executeBulkUpdate
        });
    };

    const renderSelect = (label, name, options, placeholder = "មិនកែប្រែ") => (
        <div className="min-w-[140px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">{label}</label>
            <div className="relative">
                <select value={updateData[name]} onChange={(e) => handleUpdateChange(name, e.target.value)} className={`w-full py-2 pl-2 pr-6 border rounded-xl outline-none text-xs font-bold appearance-none transition-all ${updateData[name] ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <option value="">{placeholder}</option>
                    {options && options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none opacity-50"><ChevronDownIcon className="h-3 w-3" /></div>
            </div>
        </div>
    );

    return (
        <>
            {/* 1. MAIN CONTENT */}
            <div className="h-full flex flex-col relative animate-fade-in">
                {/* DESKTOP HEADER (Hidden on Mobile) */}
                <div className="hidden md:flex glass-panel p-4 rounded-3xl flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4 shrink-0">
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                        <SearchControls 
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterClass={filterClass}
                            setFilterClass={setFilterClass}
                            filterYear={filterYear}
                            setFilterYear={setFilterYear}
                            filterGroup={filterGroup}
                            setFilterGroup={setFilterGroup}
                            filterSection={filterSection} // PASS SECTION FILTER
                            setFilterSection={setFilterSection} // PASS SECTION SETTER
                            uniqueClasses={uniqueClasses}
                            uniqueYears={uniqueYears}
                            uniqueGroups={uniqueGroups}
                            uniqueSections={uniqueSections} // PASS UNIQUE SECTIONS
                        />
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">Total Found: <span className="text-indigo-600 text-sm">{filteredEmployees.length}</span></div>
                </div>

                {/* MOBILE HEADER - Just the count */}
                <div className="md:hidden flex justify-between items-center mb-4 px-2">
                    <h2 className="text-lg font-bold text-slate-700">បុគ្គលិក ({filteredEmployees.length})</h2>
                    <div className="text-xs text-slate-500 italic">Double tap for full detail</div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 px-1 md:px-0">
                    
                    {/* TABLE VIEW (DESKTOP) */}
                    <div className="hidden md:block glass-panel rounded-3xl overflow-hidden bg-white/80">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/90 backdrop-blur sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left w-12"><input type="checkbox" onChange={handleSelectAll} checked={filteredEmployees.length > 0 && selectedIds.size === filteredEmployees.length} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" /></th>
                                    <th className="px-4 py-3 text-left text-xs font-extrabold text-slate-500 uppercase">Profile</th>
                                    <th className="px-4 py-3 text-left text-xs font-extrabold text-slate-500 uppercase">ID / Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-extrabold text-slate-500 uppercase">Current Info</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className={`hover:bg-indigo-50/30 transition-colors ${selectedIds.has(emp.id) ? 'bg-indigo-50/60' : ''}`} onClick={() => handleSelectOne(emp.id)}>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(emp.id)} onChange={() => handleSelectOne(emp.id)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" /></td>
                                        <td className="px-4 py-3"><div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200">{emp.imageUrl ? <img src={emp.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-5 w-5" /></div>}</div></td>
                                        <td className="px-4 py-3"><div className="flex flex-col"><span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mb-1">{emp.studentId}</span><span className="text-sm font-bold text-slate-700">{emp.name}</span><span className="text-xs text-slate-400">{emp.latinName}</span></div></td>
                                        <td className="px-4 py-3"><div className="flex flex-wrap gap-2 text-xs"><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.class || 'No Class'}</span><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.academicYear || 'No Year'}</span><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.group || 'No Group'}</span><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.section || 'No Section'}</span></div></td>
                                    </tr>
                                ))}
                                {filteredEmployees.length === 0 && <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">No employees found</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* CARD VIEW (MOBILE) */}
                    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <input type="checkbox" id="selectAllMobile" onChange={handleSelectAll} checked={filteredEmployees.length > 0 && selectedIds.size === filteredEmployees.length} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer" />
                            <label htmlFor="selectAllMobile" className="text-sm font-bold text-slate-600">Select All</label>
                        </div>
                        {filteredEmployees.map((emp) => (
                            <div 
                                key={emp.id} 
                                onDoubleClick={() => { setViewEmployee(emp); setActiveTab('personal'); }}
                                onClick={() => handleSelectOne(emp.id)}
                                className={`glass-panel p-4 rounded-2xl border transition-all active:scale-[0.98] relative overflow-hidden ${selectedIds.has(emp.id) ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-transparent bg-white'}`}
                            >
                                 {/* Selection Indicator */}
                                 <div className="absolute top-3 right-3">
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds.has(emp.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                        {selectedIds.has(emp.id) && <CheckCircleIcon className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                        {emp.imageUrl ? <img src={emp.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-6 w-6" /></div>}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mb-0.5">{emp.studentId}</span>
                                        <span className="text-sm font-bold text-slate-700 truncate">{emp.name}</span>
                                        <span className="text-xs text-slate-400 truncate">{emp.latinName}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                                    <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-600 font-medium">{emp.class || 'No Class'}</span>
                                    <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-600 font-medium">{emp.academicYear || 'No Year'}</span>
                                    <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-600 font-medium">{emp.group || 'No Group'}</span>
                                </div>
                            </div>
                        ))}
                         {filteredEmployees.length === 0 && <div className="text-center py-10 text-slate-400 italic col-span-full">No employees found</div>}
                    </div>
                </div>

                {/* BULK EDIT PANEL (Inside container to position absolutely at bottom) */}
                <div className={`absolute bottom-0 left-0 right-0 glass-modal rounded-t-3xl border-t border-indigo-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 transform z-20 ${selectedIds.size > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center text-xs font-bold tracking-wider rounded-t-3xl">កែប្រែទិន្នន័យសម្រាប់ {selectedIds.size} នាក់</div>
                    <div className="p-4 md:p-6 overflow-x-auto custom-scrollbar">
                        <div className="flex gap-6 min-w-max">
                            <div className="flex gap-3 pr-6 border-r border-slate-200">
                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs whitespace-nowrap"><BriefcaseIcon className="h-4 w-4" /> ការងារ:</div>
                                {renderSelect('ក្រុម', 'group', settings?.groups)}
                                {renderSelect('ផ្នែក', 'section', settings?.sections)}
                                {renderSelect('តួនាទី', 'position', settings?.positions)}
                                {renderSelect('ឆ្នាំសិក្សា', 'academicYear', ACADEMIC_YEARS)} 
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2 text-orange-500 font-bold text-xs whitespace-nowrap"><CalendarIcon className="h-4 w-4" /> កាលវិភាគ:</div>
                                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, i) => (
                                    <div key={day} className="min-w-[80px]">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block text-center">{['ចន្ទ','អង្គារ៍','ពុធ','ព្រហ','សុក្រ','សៅរ៍','អាទិត្យ'][i]}</label>
                                        <select value={updateData[day]} onChange={(e) => handleUpdateChange(day, e.target.value)} className={`w-full py-1.5 px-1 border rounded-lg text-xs font-bold outline-none text-center ${updateData[day] ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200'}`}>
                                            <option value="">-</option>
                                            {settings?.schedules?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-white/50 flex justify-end">
                        <button onClick={handleApplyClick} disabled={isApplying} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95">{isApplying ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <CheckCircleIcon className="h-4 w-4" />} រក្សាទុកការកែប្រែ</button>
                    </div>
                </div>
            </div>

            {/* 2. FIXED OVERLAYS (OUTSIDE Main Container to allow true Fixed positioning) */}

            {/* MOBILE FLOATING SEARCH BUTTON */}
            <button 
                onClick={() => setShowMobileSearch(true)}
                className={`md:hidden fixed z-[50] bottom-6 right-4 h-12 w-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 ${selectedIds.size > 0 ? 'translate-y-[-200px]' : ''}`} 
            >
                <SearchIcon className="h-6 w-6" />
            </button>

            {/* MOBILE SEARCH OVERLAY (Fixed Full Screen Overlay) */}
            <div className={`md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-md transition-opacity duration-300 ${showMobileSearch ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMobileSearch(false)}>
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 shadow-2xl transition-transform duration-300 ${showMobileSearch ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 text-lg">ស្វែងរក & Filter</h3>
                        <button onClick={() => setShowMobileSearch(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><XIcon className="h-5 w-5" /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <SearchControls 
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterClass={filterClass}
                            setFilterClass={setFilterClass}
                            filterYear={filterYear}
                            setFilterYear={setFilterYear}
                            filterGroup={filterGroup}
                            setFilterGroup={setFilterGroup}
                            filterSection={filterSection} // PASS SECTION
                            setFilterSection={setFilterSection} // PASS SECTION SETTER
                            uniqueClasses={uniqueClasses}
                            uniqueYears={uniqueYears}
                            uniqueGroups={uniqueGroups}
                            uniqueSections={uniqueSections} // PASS SECTIONS
                        />
                        <button onClick={() => setShowMobileSearch(false)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold mt-2 shadow-lg shadow-indigo-200">បង្ហាញលទ្ធផល ({filteredEmployees.length})</button>
                    </div>
                </div>
            </div>

            {/* EMPLOYEE FULL DETAIL MODAL (Fixed Full Screen Overlay) */}
            {viewEmployee && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        
                        {/* Header with Gradient & Close */}
                        <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-700 shrink-0">
                            <button onClick={() => setViewEmployee(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-full text-white transition-all"><XIcon className="h-5 w-5" /></button>
                            <div className="absolute -bottom-10 left-6">
                                <div className="h-24 w-24 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-white">
                                    {viewEmployee.imageUrl ? <img src={viewEmployee.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><UserIcon className="h-12 w-12" /></div>}
                                </div>
                            </div>
                        </div>

                        {/* Identity Section */}
                        <div className="pt-12 px-6 pb-4 shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">{viewEmployee.name}</h2>
                                    <p className="text-slate-500 font-medium">{viewEmployee.latinName}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-mono font-bold border border-indigo-100">{viewEmployee.studentId}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${viewEmployee.gender === 'ស្រី' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>{viewEmployee.gender}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-6 border-b border-slate-100 shrink-0 gap-6 overflow-x-auto no-scrollbar">
                            <button onClick={() => setActiveTab('personal')} className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'personal' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                Personal
                                {activeTab === 'personal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
                            </button>
                            <button onClick={() => setActiveTab('work')} className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'work' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                Work & Study
                                {activeTab === 'work' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
                            </button>
                            <button onClick={() => setActiveTab('schedule')} className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'schedule' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                                Schedule
                                {activeTab === 'schedule' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
                            </button>
                        </div>

                        {/* Tab Content (Scrollable) */}
                        <div className="overflow-y-auto custom-scrollbar p-6 flex-1 bg-slate-50/50">
                            
                            {activeTab === 'personal' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CalendarIcon className="h-5 w-5" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Date of Birth</p>
                                                <p className="text-sm font-semibold text-slate-700">{viewEmployee.dob || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MapPinIcon className="h-5 w-5" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Place of Birth</p>
                                                <p className="text-sm font-semibold text-slate-700 leading-relaxed">{viewEmployee.pob || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><SendIcon className="h-5 w-5" /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Telegram</p>
                                                <p className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">{viewEmployee.telegram || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'work' && (
                                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="col-span-2 bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200 mb-2">
                                        <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Current Position</p>
                                        <p className="text-xl font-bold">{viewEmployee.position || 'N/A'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Section</p>
                                        <p className="text-sm font-bold text-slate-700">{viewEmployee.section || '-'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Group</p>
                                        <p className="text-sm font-bold text-slate-700">{viewEmployee.group || '-'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Class</p>
                                        <p className="text-sm font-bold text-slate-700">{viewEmployee.class || '-'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Generation</p>
                                        <p className="text-sm font-bold text-slate-700">{viewEmployee.generation || '-'}</p>
                                    </div>
                                    <div className="col-span-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Academic Year</p>
                                            <p className="text-sm font-bold text-slate-700">{viewEmployee.academicYear || '-'}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">
                                            {viewEmployee.skill || 'No Skill'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'schedule' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, i) => {
                                        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i];
                                        const schedule = viewEmployee[day];
                                        const isToday = new Date().getDay() === (i + 1) % 7;

                                        return (
                                            <div key={day} className={`flex items-center p-3 rounded-2xl border ${isToday ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${isToday ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    {dayName.substring(0, 3)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-xs font-bold mb-0.5 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{dayName}</p>
                                                    <p className={`text-sm font-medium ${schedule ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                                        {schedule || 'No Schedule'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}