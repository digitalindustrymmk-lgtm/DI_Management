import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- CONSTANTS & ICONS ---
const ACADEMIC_YEARS = ["ឆ្នាំទី១", "ឆ្នាំទី២", "ឆ្នាំទី៣", "ឆ្នាំទី៤"];
const ITEMS_PER_PAGE = 50;

const Icons = {
  Search: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Filter: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
  Sliders: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>,
  Check: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>,
  Edit: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Briefcase: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  Calendar: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  User: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Loader: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
  ChevronLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>,
  ChevronRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6" /></svg>,
  ListCheck: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 6h6"/><path d="M16 12h6"/><path d="M16 18h6"/><path d="M5.5 5.5l1.5 1.5 2.5-2.5"/><path d="M5.5 11.5l1.5 1.5 2.5-2.5"/><path d="M5.5 17.5l1.5 1.5 2.5-2.5"/></svg>
};

// --- HELPER COMPONENTS ---

const SelectField = ({ label, value, onChange, options, placeholder = "មិនកែប្រែ (Keep Current)" }) => {
  const isCustom = value && value !== '' && !options.includes(value);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative group">
        <select 
          value={value} 
          onChange={onChange} 
          className={`w-full appearance-none rounded-xl border-2 px-4 py-3 text-sm font-bold outline-none transition-all 
          ${value 
            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
        >
          <option value="">{placeholder}</option>
          {isCustom && <option value={value}>{value} (Current)</option>}
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
        </div>
      </div>
    </div>
  );
};

const ScheduleCard = ({ dayLabel, value, onChange, options }) => {
  const isActive = value && value !== '';
  return (
    <div className={`p-2 rounded-xl border-2 transition-all duration-200 ${isActive ? 'bg-white border-orange-400 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}`}>
      <div className="text-[10px] font-extrabold text-slate-400 uppercase text-center mb-1.5">{dayLabel}</div>
      <select 
        value={value} 
        onChange={onChange}
        className={`w-full bg-transparent text-center text-xs font-bold outline-none cursor-pointer ${isActive ? 'text-orange-600' : 'text-slate-400'}`}
      >
        <option value="">-</option>
        {value && !options?.includes(value) && <option value={value}>{value}</option>}
        {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
};

const FilterPill = ({ label, value, onChange, options }) => (
  <div className="relative w-full">
    <label className="text-[10px] font-extrabold text-slate-400 uppercase mb-1 block ml-1">{label}</label>
    <div className="relative">
      <select 
        value={value} 
        onChange={onChange}
        className={`w-full appearance-none py-3 pl-4 pr-10 rounded-xl text-sm font-bold border-2 outline-none transition-all cursor-pointer
        ${value ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-white'}`}
      >
        <option value="">All {label}s</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icons.Filter className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${value ? 'text-indigo-200' : 'text-slate-400'}`} />
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function BulkEditView({ db, employees, settings, addToast, setConfirmDialog }) {
  // State
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef(null);
  const topRef = useRef(null); // Ref for scrolling to top

  // Filter State
  const [filterClass, setFilterClass] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterSection, setFilterSection] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // --- NEW UNIFIED MOBILE STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Edit Form Data
  const [updateData, setUpdateData] = useState({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });

  // Constants
  const activeFilterCount = [filterClass, filterYear, filterGroup, filterSection].filter(Boolean).length;

  // --- RESET PAGE ---
  useEffect(() => {
    setCurrentPage(1);
  }, [filterClass, filterYear, filterGroup, filterSection, searchTerm]);

  // --- PRE-FILL DATA ---
  useEffect(() => {
    if (selectedIds.size === 0) {
      setUpdateData({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });
      return;
    }
    const selectedEmps = employees.filter(e => selectedIds.has(e.id));
    if (selectedEmps.length === 0) return;

    const normalize = (val) => (val === null || val === undefined) ? '' : String(val).trim();
    const fieldsToCheck = ['group', 'section', 'position', 'academicYear', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const newFormState = {};

    fieldsToCheck.forEach(field => {
      const firstValue = normalize(selectedEmps[0][field]);
      const isUniform = selectedEmps.every(emp => normalize(emp[field]) === firstValue);
      newFormState[field] = (isUniform && firstValue !== '') ? selectedEmps[0][field] : '';
    });
    setUpdateData(newFormState);
  }, [selectedIds, employees]);

  // --- DERIVED DATA ---
  const uniqueOptions = useMemo(() => {
    const getUnique = (key) => [...new Set(employees.map(e => e[key]).filter(x => x))].sort();
    return {
      classes: getUnique('class'),
      years: getUnique('academicYear'),
      groups: getUnique('group'),
      sections: getUnique('section')
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // 1. Check Filters
      const matches = [
        !filterClass || emp.class === filterClass,
        !filterYear || emp.academicYear === filterYear,
        !filterGroup || emp.group === filterGroup,
        !filterSection || emp.section === filterSection,
        /^\d+$/.test(emp.studentId || ''), 
      ];
      if (!matches.every(Boolean)) return false;

      // 2. Check Search (FIXED: allow spaces for names)
      const term = searchTerm.toLowerCase().trim(); // Removed .replace(/\s+/g, '') to allow spaces
      const name = (emp.name || '').toLowerCase();
      const latinName = (emp.latinName || '').toLowerCase();
      const id = (emp.studentId || '').toLowerCase();

      return name.includes(term) || 
             latinName.includes(term) || 
             id.includes(term);
    });
  }, [employees, filterClass, filterYear, filterGroup, filterSection, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const displayedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  const isAllSelected = filteredEmployees.length > 0 && selectedIds.size === filteredEmployees.length;

  // --- HANDLERS ---
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  const handleSelectOne = (id) => {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedIds(newSet);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // SCROLL TO TOP LOGIC (Robust Method)
      // 1. Try standard window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // 2. Try element scroll (in case inside a container)
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const resetFilters = () => {
    setFilterClass('');
    setFilterYear('');
    setFilterGroup('');
    setFilterSection('');
    setSearchTerm('');
  };

  const executeBulkUpdate = async () => {
    setIsApplying(true);
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    setIsEditModalOpen(false);

    const updates = {};
    const fieldsToMap = { 'group': 'ក្រុម', 'section': 'ផ្នែកការងារ', 'position': 'តួនាទី', 'academicYear': 'ឆ្នាំសិក្សា' };
    
    selectedIds.forEach(id => {
      Object.entries(fieldsToMap).forEach(([key, dbKey]) => {
        if(updateData[key] !== '') updates[`students/${id}/${dbKey}`] = updateData[key];
      });
      ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((day, idx) => {
        const khDay = ['ចន្ទ', 'អង្គារ៍', 'ពុធ', 'ព្រហស្បត្តិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'][idx];
        if(updateData[day] !== '') updates[`students/${id}/កាលវិភាគ/${khDay}`] = updateData[day];
      });
    });

    try {
      if (Object.keys(updates).length > 0) {
        await db.ref().update(updates);
        addToast(`Successfully updated ${selectedIds.size} employees`, 'success');
        setSelectedIds(new Set());
      } else { 
        addToast("No changes detected to apply", "warning"); 
      }
    } catch (error) { 
      console.error(error); 
      addToast("Update failed", "error"); 
    } finally { 
      setIsApplying(false); 
    }
  };

  const handleApplyClick = () => {
    const hasFields = Object.values(updateData).some(val => val !== '');
    if (!hasFields) return addToast("Please select at least one field to update", "warning");

    setConfirmDialog({
      isOpen: true,
      type: 'warning',
      title: 'Confirm Bulk Update',
      message: `Are you sure you want to update data for ${selectedIds.size} selected employees?`,
      onConfirm: executeBulkUpdate
    });
  };

  return (
    <>
    {/* --- MAIN CONTENT WRAPPER (ANIMATED) --- */}
    <div ref={topRef} className="min-h-screen flex flex-col relative animate-fade-in bg-slate-50/50">
      
      {/* --- DESKTOP HEADER (STICKY) --- */}
      <div className="hidden md:block sticky top-0 z-30 p-4 pb-0">
        <div className="glass-panel px-6 py-4 rounded-3xl flex flex-row gap-6 justify-between items-center shadow-lg shadow-slate-200/50 border border-white/60 relative backdrop-blur-xl bg-white/80">
          
          {/* Select All */}
          <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAllSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                {isAllSelected && <Icons.Check className="w-4 h-4 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={isAllSelected} onChange={toggleSelectAll} />
              <span className={`text-sm font-bold ${isAllSelected ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Select All</span>
            </label>
          </div>

          {/* Desktop Search */}
          <div className="relative flex-1 max-w-xl group">
            <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 font-bold transition-all placeholder:font-medium placeholder:text-slate-400"
              placeholder="Search by ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Desktop Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsDesktopFiltersOpen(!isDesktopFiltersOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all border-2 select-none active:scale-95
              ${isDesktopFiltersOpen || activeFilterCount > 0 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
            >
              <Icons.Sliders className="h-5 w-5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-indigo-600 px-2 py-0.5 rounded-md text-xs font-extrabold min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {isDesktopFiltersOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDesktopFiltersOpen(false)} />
                <div className="absolute top-full right-0 mt-3 w-[500px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in slide-in-from-top-2 z-20">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                              <Icons.Filter className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg">Filter Options</h3>
                      </div>
                      {(activeFilterCount > 0 || searchTerm) && (
                          <button onClick={resetFilters} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg">
                              <Icons.X className="h-3.5 w-3.5" /> Clear
                          </button>
                      )}
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <FilterPill label="Group" value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} options={uniqueOptions.groups} />
                      <FilterPill label="Section" value={filterSection} onChange={(e) => setFilterSection(e.target.value)} options={uniqueOptions.sections} />
                      <FilterPill label="Class" value={filterClass} onChange={(e) => setFilterClass(e.target.value)} options={uniqueOptions.classes} />
                      <FilterPill label="Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} options={uniqueOptions.years} />
                   </div>
                   <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-500">
                          Found <span className="text-indigo-600 text-base">{filteredEmployees.length}</span> results
                      </span>
                      <button onClick={() => setIsDesktopFiltersOpen(false)} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                          View Results
                      </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- LIST CONTENT --- */}
      <div className="p-4 md:p-6 pb-32">
        {/* Mobile Header (Updated: No Checkbox here) */}
        <div className="md:hidden flex justify-between items-end mb-4 px-1">
          <div>
            <h2 className="text-xl font-black text-slate-800">Employees</h2>
            <p className="text-xs text-slate-500 font-medium">Found: <span className="text-indigo-600 font-bold">{filteredEmployees.length}</span></p>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Icons.Search className="h-10 w-10 opacity-30" />
            </div>
            <p className="font-bold">No employees found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
            <button onClick={resetFilters} className="mt-6 text-indigo-600 font-bold text-sm hover:underline bg-indigo-50 px-4 py-2 rounded-lg">Clear All Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
              {displayedEmployees.map(emp => {
                const isSelected = selectedIds.has(emp.id);
                return (
                  <div 
                    key={emp.id}
                    onClick={() => handleSelectOne(emp.id)}
                    className={`relative group p-4 rounded-2xl border-2 transition-all cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-xl shadow-indigo-100 ring-0 transform scale-[1.01]' 
                      : 'bg-white border-slate-100 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1'}`}
                  >
                    <div className={`absolute top-4 right-4 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all z-10
                      ${isSelected ? 'bg-indigo-600 border-indigo-600 scale-110' : 'border-slate-200 bg-white group-hover:border-indigo-400'}`}>
                      {isSelected && <Icons.Check className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl overflow-hidden shrink-0 border-2 transition-colors ${isSelected ? 'border-indigo-200' : 'border-slate-100 bg-slate-50'}`}>
                        {emp.imageUrl ? <img src={emp.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300"><Icons.User className="h-6 w-6" /></div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold mb-1">
                          {emp.studentId}
                        </div>
                        <h3 className={`font-bold truncate transition-colors ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>{emp.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{emp.latinName}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex gap-2 text-[10px] font-bold text-slate-500 uppercase overflow-hidden">
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-200 truncate max-w-[80px]">{emp.group || 'N/A'}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-200 truncate max-w-[80px]">{emp.section || 'N/A'}</span>
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-200 ml-auto">{emp.academicYear || 'N/A'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:hover:border-slate-200 transition-all active:scale-95"
                >
                  <Icons.ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="hidden sm:flex gap-2">
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm border-2 transition-all
                          ${currentPage === page 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="w-10 h-10 flex items-center justify-center text-slate-300 font-bold">...</span>;
                    }
                    return null;
                  })}
                </div>
                <div className="sm:hidden font-bold text-slate-600 text-sm bg-white px-4 py-2 rounded-xl border border-slate-200">
                  Page {currentPage} of {totalPages}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:hover:border-slate-200 transition-all active:scale-95"
                >
                  <Icons.ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* --- FIXED ELEMENTS (OUTSIDE THE ANIMATED DIV) --- */}
    
    {/* 1. SINGLE UNIFIED MOBILE FAB (Search, Filter & Select All Stack) */}
    <div className="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        {/* NEW: Select All Floating Button */}
        <button 
            onClick={toggleSelectAll}
            className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all border-2 
            ${isAllSelected 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-300' 
                : 'bg-white text-slate-500 border-slate-200 shadow-slate-200'}`}
        >
            {isAllSelected ? <Icons.Check className="h-6 w-6" /> : <Icons.ListCheck className="h-6 w-6" />}
        </button>

        {/* Existing: Search/Menu Button */}
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-4 border-white/20
            ${(searchTerm || activeFilterCount > 0) ? 'bg-indigo-600 text-white shadow-indigo-300' : 'bg-slate-800 text-white shadow-slate-400'}`}
        >
            <Icons.Search className="h-6 w-6" />
            {activeFilterCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border border-white">
                {activeFilterCount}
            </span>
            )}
        </button>
    </div>

    {/* 2. UNIFIED MOBILE MENU (Search + Filters in one view) */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-full bg-white rounded-t-[2rem] shadow-2xl p-6 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto flex flex-col">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-12 bg-slate-200 rounded-full"></div>
          
          <div className="flex justify-between items-center mb-6 mt-2">
            <h2 className="text-xl font-black text-slate-800">Search & Filters</h2>
            <button onClick={resetFilters} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Reset All</button>
          </div>
          
          {/* Combined Search Input */}
          <div className="mb-6">
            <div className="relative group">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                <input 
                    ref={searchInputRef}
                    type="text" 
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-bold text-lg transition-all text-slate-800 placeholder:text-slate-400"
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 rounded-full text-slate-500 hover:bg-slate-300"
                    >
                        <Icons.X className="h-3 w-3" />
                    </button>
                )}
            </div>
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <FilterPill label="Group" value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} options={uniqueOptions.groups} />
            <FilterPill label="Section" value={filterSection} onChange={(e) => setFilterSection(e.target.value)} options={uniqueOptions.sections} />
            <FilterPill label="Class" value={filterClass} onChange={(e) => setFilterClass(e.target.value)} options={uniqueOptions.classes} />
            <FilterPill label="Year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} options={uniqueOptions.years} />
          </div>
          
          <button onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all">
              Show {filteredEmployees.length} Results
          </button>
        </div>
      </div>
    )}

    {/* --- FLOATING EDIT ACTION BAR --- */}
    <div className={`fixed bottom-6 left-0 right-0 flex justify-center z-30 transition-all duration-300 ${selectedIds.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 mx-4 max-w-lg w-full">
        <div className="bg-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-inner">
          <span className="bg-white text-indigo-700 px-1.5 rounded text-xs">{selectedIds.size}</span>
          <span>Selected</span>
        </div>
        <div className="flex-1 text-xs text-slate-400 font-medium truncate hidden sm:block">
          Ready to update details
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedIds(new Set())} className="text-slate-300 hover:text-white text-xs font-bold px-3 py-2 hover:bg-white/10 rounded-lg transition-colors">
            Clear
          </button>
          <button onClick={() => setIsEditModalOpen(true)} className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 shadow-lg">
            <Icons.Edit className="h-4 w-4" /> Edit
          </button>
        </div>
      </div>
    </div>

    {/* --- BULK EDIT MODAL --- */}
    {isEditModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Bulk Edit</h2>
              <p className="text-sm text-slate-500 font-medium">Updating <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{selectedIds.size} employees</span></p>
            </div>
            <button onClick={() => setIsEditModalOpen(false)} className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-wider mb-2">
                  <Icons.Briefcase className="h-4 w-4" /> Employment Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Group (ក្រុម)" name="group" value={updateData.group} onChange={(e) => setUpdateData({...updateData, group: e.target.value})} options={settings?.groups} />
                  <SelectField label="Section (ផ្នែក)" name="section" value={updateData.section} onChange={(e) => setUpdateData({...updateData, section: e.target.value})} options={settings?.sections} />
                  <SelectField label="Position (តួនាទី)" name="position" value={updateData.position} onChange={(e) => setUpdateData({...updateData, position: e.target.value})} options={settings?.positions} />
                  <SelectField label="Academic Year" name="academicYear" value={updateData.academicYear} onChange={(e) => setUpdateData({...updateData, academicYear: e.target.value})} options={ACADEMIC_YEARS} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-orange-500 font-bold uppercase text-xs tracking-wider mb-2">
                  <Icons.Calendar className="h-4 w-4" /> Weekly Schedule
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, i) => (
                    <ScheduleCard 
                      key={day}
                      dayLabel={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]}
                      value={updateData[day]}
                      onChange={(e) => setUpdateData({...updateData, [day]: e.target.value})}
                      options={settings?.schedules}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
            <button onClick={handleApplyClick} disabled={isApplying} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50">
              {isApplying ? <Icons.Loader className="h-5 w-5 animate-spin" /> : <Icons.Check className="h-5 w-5" />} Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}