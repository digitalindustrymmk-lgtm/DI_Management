import React, { useState, useMemo } from 'react';
import { SearchIcon, FilterIcon, ChevronDownIcon, CheckCircleIcon, Loader2Icon, BriefcaseIcon, CalendarIcon, UserIcon } from '../components/Icons';
import { ACADEMIC_YEARS } from '../utils';

export default function BulkEditView({ db, employees, settings, addToast }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [filterClass, setFilterClass] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [updateData, setUpdateData] = useState({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchClass = filterClass ? emp.class === filterClass : true;
            const matchYear = filterYear ? emp.academicYear === filterYear : true;
            const isNumericId = /^\d+$/.test(emp.studentId || '');
            const term = searchTerm.toLowerCase();
            const matchSearch = (emp.name || '').toLowerCase().includes(term) || (emp.latinName || '').toLowerCase().includes(term) || (emp.studentId || '').toLowerCase().includes(term);
            return matchClass && matchYear && isNumericId && matchSearch;
        });
    }, [employees, filterClass, filterYear, searchTerm]);

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

    const applyBulkUpdate = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`តើអ្នកចង់កែប្រែទិន្នន័យសម្រាប់បុគ្គលិក ${selectedIds.size} នាក់ដែលបានជ្រើសរើសមែនទេ?`)) return;
        setIsApplying(true);
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
                addToast(`បានកែប្រែទិន្នន័យជោគជ័យសម្រាប់ ${selectedIds.size} នាក់`);
                setSelectedIds(new Set());
                setUpdateData({ group: '', section: '', position: '', academicYear: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' });
            } else { addToast("សូមជ្រើសរើសទិន្នន័យដែលត្រូវកែប្រែ", "error"); }
        } catch (error) { console.error(error); addToast("បរាជ័យក្នុងការកែប្រែ", "error"); } finally { setIsApplying(false); }
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
        <div className="h-full flex flex-col relative animate-fade-in">
            <div className="glass-panel p-4 rounded-3xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative w-full md:w-64 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" /></div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-slate-400" placeholder="ស្វែងរក..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100"><FilterIcon className="h-4 w-4 text-indigo-500" /><span className="text-xs font-bold text-indigo-600">Filter:</span></div>
                        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]"><option value="">គ្រប់ថ្នាក់</option>{settings?.classes?.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]"><option value="">គ្រប់ឆ្នាំសិក្សា</option>{ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">Total Found: <span className="text-indigo-600 text-sm">{filteredEmployees.length}</span></div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
                <div className="glass-panel rounded-3xl overflow-hidden bg-white/80">
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
                                    <td className="px-4 py-3"><div className="flex flex-wrap gap-2 text-xs"><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.class || 'No Class'}</span><span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{emp.academicYear || 'No Year'}</span></div></td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">No employees found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 glass-modal rounded-t-3xl border-t border-indigo-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 transform ${selectedIds.size > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center text-xs font-bold tracking-wider rounded-t-3xl">កែប្រែទិន្នន័យសម្រាប់ {selectedIds.size} នាក់</div>
                <div className="p-4 md:p-6 overflow-x-auto">
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
                    <button onClick={applyBulkUpdate} disabled={isApplying} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95">{isApplying ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <CheckCircleIcon className="h-4 w-4" />} រក្សាទុកការកែប្រែ</button>
                </div>
            </div>
        </div>
    );
}