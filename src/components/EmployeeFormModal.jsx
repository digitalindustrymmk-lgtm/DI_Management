import React, { useState, useEffect, useMemo } from 'react';

// --- INLINED UTILS (To ensure compilation) ---
const ACADEMIC_YEARS = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
const GENERATIONS = ["Gen 1", "Gen 2", "Gen 3", "Gen 4", "Gen 5", "Gen 6"];

// --- INLINED ICONS (To ensure compilation) ---
const XIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const CameraIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const UploadIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const UserIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BriefcaseIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const CalendarIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
const Loader2Icon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

export default function EmployeeFormModal({ isOpen, onClose, employee, db, addToast, settings }) {
    // Initialize form state
    const [formData, setFormData] = useState({ 
        name: '', latinName: '', gender: 'ប្រុស', dob: '', pob: '', 
        studentId: '', academicYear: '', generation: '', group: '', 
        class: '', skill: '', section: '', position: '', telegram: '', 
        imageUrl: '', 
        mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    // Load employee data if editing
    useEffect(() => { 
        if (employee) { 
            setFormData({ ...employee }); 
            setPreviewUrl(employee.imageUrl || ''); 
        } 
    }, [employee]);
    
    // Handle input changes
    const handleChange = (e) => { 
        const { name, value } = e.target; 
        
        // Validation: Khmer names only allow Khmer characters and spaces (optional strictness)
        if (name === 'name' && /[^ \u1780-\u17FF]/.test(value)) return; 
        
        // Validation: Latin names uppercase only
        if (name === 'latinName') {
            if (/[^a-zA-Z\s]/.test(value)) return;
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value })); 
    };

    // Handle Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return;
        
        // Limit image size (optional but recommended for Realtime DB)
        if (file.size > 1024 * 1024) { // 1MB limit
             alert("រូបភាពធំពេក! សូមជ្រើសរើសរូបភាពក្រោម 1MB");
             return;
        }

        const reader = new FileReader(); 
        reader.onloadend = () => { 
            setPreviewUrl(reader.result); 
            setFormData(prev => ({ ...prev, imageUrl: reader.result })); 
        }; 
        reader.readAsDataURL(file);
    };

    // --- MAIN SAVE LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            // 1. Validate ID
            if (!formData.studentId || formData.studentId.trim() === "") {
                alert("សូមបញ្ចូលអត្តលេខ (ID) ជាមុនសិន!");
                setLoading(false);
                return;
            }

            // 2. Validate Telegram
            if (formData.telegram && !/^(https?:\/\/)?(t\.me\/|telegram\.me\/)?[a-zA-Z0-9_]{5,}$/.test(formData.telegram)) {
                alert("តេឡេក្រាមត្រូវតែជា Link (ឧ. t.me/username)!"); 
                setLoading(false); 
                return;
            }

            // Prepare payload
            const dbPayload = {
                'ឈ្មោះ': formData.name, 
                'ឈ្មោះឡាតាំង': formData.latinName, 
                'ភេទ': formData.gender, 
                'ថ្ងៃខែឆ្នាំកំណើត': formData.dob, 
                'ទីកន្លែងកំណើត': formData.pob, 
                'អត្តលេខ': formData.studentId, // ID stored inside data
                'ឆ្នាំសិក្សា': formData.academicYear, 
                'ជំនាន់': formData.generation, 
                'ក្រុម': formData.group, 
                'ថ្នាក់': formData.class, 
                'ជំនាញ': formData.skill, 
                'ផ្នែកការងារ': formData.section, 
                'តួនាទី': formData.position, 
                'តេឡេក្រាម': formData.telegram, 
                'រូបថត': formData.imageUrl,
                'កាលវិភាគ': { 
                    'ចន្ទ': formData.mon, 'អង្គារ៍': formData.tue, 'ពុធ': formData.wed, 
                    'ព្រហស្បត្តិ៍': formData.thu, 'សុក្រ': formData.fri, 'សៅរ៍': formData.sat, 'អាទិត្យ': formData.sun 
                }
            };
            
            if (employee?.id) { 
                // --- EDIT MODE ---
                // We update the existing record based on the original ID key
                await db.ref(`students/${employee.id}`).update(dbPayload); 
                addToast("កែប្រែព័ត៌មានជោគជ័យ"); 
            } 
            else { 
                // --- CREATE MODE ---
                // 1. Check if ID exists first
                const snapshot = await db.ref(`students/${formData.studentId}`).once('value');
                
                if (snapshot.exists()) {
                    alert(`អត្តលេខ ${formData.studentId} មានរួចហើយ! សូមប្រើអត្តលេខផ្សេង។`);
                    setLoading(false);
                    return;
                }

                // 2. Save using Custom ID (e.g., students/001)
                await db.ref(`students/${formData.studentId}`).set(dbPayload); 
                addToast("បញ្ចូលទិន្នន័យថ្មីជោគជ័យ"); 
            }
            
            onClose();
        } catch (error) { 
            console.error(error); 
            addToast("បរាជ័យក្នុងការរក្សាទុក: " + error.message, 'error'); 
        } finally { 
            setLoading(false); 
        }
    };

    const isFormValid = useMemo(() => formData.name?.trim().length > 0 && formData.studentId?.trim().length > 0, [formData.name, formData.studentId]);

    const renderSelect = (label, name, options, required = false) => (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block tracking-wide">{label} {required && <span className="text-red-500">*</span>}</label>
            <select name={name} value={formData[name]} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern">
                <option value="">ជ្រើសរើស...</option>
                {options && options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-modal rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white animate-scale-in">
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{employee ? 'កែប្រែព័ត៌មាន' : 'បញ្ចូលបុគ្គលិកថ្មី'}</h2>
                        <p className="text-sm text-slate-500 font-medium">សូមបំពេញព័ត៌មានឱ្យបានត្រឹមត្រូវ</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grow custom-scrollbar bg-slate-50/30">
                    <div className="flex gap-10 flex-col lg:flex-row mb-8">
                        {/* Image & ID Section */}
                        <div className="flex flex-col items-center gap-6 lg:w-1/4">
                            <div className="relative group">
                                <div className="h-48 w-48 rounded-3xl border-4 border-white overflow-hidden bg-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                                    {previewUrl ? 
                                        <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" /> : 
                                        <div className="h-full w-full flex items-center justify-center text-slate-300"><CameraIcon className="h-16 w-16" /></div>
                                    }
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-3.5 rounded-2xl text-white cursor-pointer shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all ring-4 ring-white">
                                    <UploadIcon className="h-5 w-5" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            
                            <div className="w-full mt-4">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block text-center">លេខសម្គាល់ (ID) <span className="text-red-500">*</span></label>
                                <input 
                                    name="studentId" 
                                    value={formData.studentId} 
                                    onChange={handleChange} 
                                    disabled={!!employee} // Optional: Disable ID editing if you don't want them to change key
                                    className={`w-full p-4 border-slate-200 rounded-2xl bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-center font-mono font-bold text-xl text-indigo-600 tracking-widest shadow-sm input-modern ${!!employee ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    placeholder="ID..." 
                                />
                                {!!employee && <p className="text-[10px] text-center text-slate-400 mt-1">ID មិនអាចកែបានទេ (Edit)</p>}
                            </div>
                        </div>

                        {/* General Info */}
                        <div className="flex-1 space-y-8">
                            <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm">
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                                    <UserIcon className="h-5 w-5 text-indigo-500" />
                                    <h3 className="font-bold text-slate-800">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">ឈ្មោះ (ខ្មែរ) <span className="text-red-500">*</span></label><input name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern" /></div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">ឈ្មោះ (ឡាតាំង) <span className="text-red-500">*</span></label><input name="latinName" value={formData.latinName} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern" /></div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">ភេទ</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern">
                                            <option value="ប្រុស">ប្រុស</option>
                                            <option value="ស្រី">ស្រី</option>
                                        </select>
                                    </div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">ថ្ងៃកំណើត</label><input name="dob" value={formData.dob} onChange={handleChange} placeholder="DD/MM/YYYY" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern" /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">ទីកន្លែងកំណើត</label><input name="pob" value={formData.pob} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern" /></div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">តេឡេក្រាម Link</label><input name="telegram" value={formData.telegram} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern text-blue-600" /></div>
                                </div>
                            </div>

                            {/* Academic & Job Info */}
                            <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm">
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                                    <BriefcaseIcon className="h-5 w-5 text-purple-500" />
                                    <h3 className="font-bold text-slate-800">ការសិក្សា & ការងារ</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {renderSelect('ជំនាញ', 'skill', settings?.skills)}
                                    {renderSelect('ឆ្នាំសិក្សា', 'academicYear', ACADEMIC_YEARS)}
                                    {renderSelect('ជំនាន់', 'generation', GENERATIONS)}
                                    {renderSelect('ក្រុម', 'group', settings?.groups)}
                                    {renderSelect('ថ្នាក់', 'class', settings?.classes, true)}
                                    {renderSelect('ផ្នែក', 'section', settings?.sections)}
                                    <div className="md:col-span-2">{renderSelect('តួនាទី', 'position', settings?.positions)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm">
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
                            <CalendarIcon className="h-5 w-5 text-orange-500" />
                            <h3 className="font-bold text-slate-800">កាលវិភាគប្រចាំសប្តាហ៍</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, i) => (
                                <div key={day} className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">{['ចន្ទ','អង្គារ៍','ពុធ','ព្រហ','សុក្រ','សៅរ៍','អាទិត្យ'][i]}</label>
                                    <div className="relative">
                                        <select name={day} value={formData[day]} onChange={handleChange} className="w-full py-3 pl-3 pr-8 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer transition-all shadow-sm hover:border-indigo-300">
                                            <option value="">-</option>
                                            {settings?.schedules && settings.schedules.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                                            <ChevronDownIcon className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-8 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">បោះបង់</button>
                    <button onClick={handleSubmit} disabled={loading || !isFormValid} className="px-10 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all">
                        {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />} រក្សាទុក
                    </button>
                </div>
            </div>
        </div>
    );
}