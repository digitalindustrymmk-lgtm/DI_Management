import React, { useState, useEffect, useMemo } from 'react';
import { 
    XIcon, CameraIcon, UploadIcon, UserIcon, BriefcaseIcon, 
    CalendarIcon, ChevronDownIcon, Loader2Icon, CheckCircleIcon 
} from './Icons';

// --- UPDATED CONSTANTS TO MATCH YOUR SCREENSHOT DATA ---
// Added "ឆ្នាំទី១", "ឆ្នាំទី២" etc. so the dropdown can catch the data
const ACADEMIC_YEARS = [
    "2023-2024", "2024-2025", "2025-2026", "2026-2027", 
    "ឆ្នាំទី១", "ឆ្នាំទី២", "ឆ្នាំទី៣", "ឆ្នាំទី៤" 
];

// Added "ទី១", "ទី២" etc. to match the "Gen: ទី៣" in your image
const GENERATIONS = [
    "Gen 1", "Gen 2", "Gen 3", "Gen 4", "Gen 5", "Gen 6",
    "ទី១", "ទី២", "ទី៣", "ទី៤", "ទី៥", "ទី៦"
];

// --- CLOUDINARY CONFIGURATION ---
const CLOUD_NAME = "dsruankj0"; 
const UPLOAD_PRESET = "staff_app"; 

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
    const [imageFile, setImageFile] = useState(null); 

    // --- EFFECT: LOAD DATA INTO FORM ---
    useEffect(() => { 
        if (isOpen) {
            if (employee) { 
                // !!! DEBUG: Check the console to see exactly what data is coming in
                console.log("Editing Employee Data:", employee);

                setFormData({ 
                    name: employee.name || '', 
                    latinName: employee.latinName || '', 
                    gender: employee.gender || 'ប្រុស', 
                    dob: employee.dob || '', 
                    pob: employee.pob || '', 
                    studentId: employee.studentId || '', 
                    
                    // These must match the options exactly to show up in the dropdown
                    academicYear: employee.academicYear || '', 
                    generation: employee.generation || '', 
                    group: employee.group || '', 
                    class: employee.class || '', 
                    skill: employee.skill || '', 
                    section: employee.section || '', 
                    position: employee.position || '', 
                    telegram: employee.telegram || '', 
                    imageUrl: employee.imageUrl || '', 
                    
                    mon: employee.mon || '', 
                    tue: employee.tue || '', 
                    wed: employee.wed || '', 
                    thu: employee.thu || '', 
                    fri: employee.fri || '', 
                    sat: employee.sat || '', 
                    sun: employee.sun || '' 
                }); 
                setPreviewUrl(employee.imageUrl || ''); 
                setImageFile(null); 
            } else {
                setPreviewUrl('');
                setImageFile(null);
                setFormData({ 
                    name: '', latinName: '', gender: 'ប្រុស', dob: '', pob: '', 
                    studentId: '', academicYear: '', generation: '', group: '', 
                    class: '', skill: '', section: '', position: '', telegram: '', 
                    imageUrl: '', 
                    mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' 
                });
            }
        }
    }, [isOpen, employee]);
    
    const handleChange = (e) => { 
        const { name, value } = e.target; 
        
        if (name === 'name' && /[^ \u1780-\u17FF]/.test(value)) return; 
        
        if (name === 'latinName') {
            if (/[^a-zA-Z\s]/.test(value)) return;
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value })); 
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; if (!file) return;
        if (file.size > 5 * 1024 * 1024) { 
             alert("រូបភាពធំពេក! សូមជ្រើសរើសរូបភាពក្រោម 5MB");
             return;
        }
        setImageFile(file);
        const reader = new FileReader(); 
        reader.onloadend = () => setPreviewUrl(reader.result); 
        reader.readAsDataURL(file);
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        if (!response.ok) throw new Error("Cloudinary upload failed");
        const data = await response.json();
        return data.secure_url; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            if (!formData.studentId || formData.studentId.trim() === "") {
                alert("សូមបញ្ចូលអត្តលេខ (ID) ជាមុនសិន!");
                setLoading(false);
                return;
            }

            if (formData.telegram && !/^(https?:\/\/)?(t\.me\/|telegram\.me\/)?[a-zA-Z0-9_]{5,}$/.test(formData.telegram)) {
                alert("តេឡេក្រាមត្រូវតែជា Link (ឧ. t.me/username)!"); 
                setLoading(false); 
                return;
            }

            let finalImageUrl = formData.imageUrl; 
            if (imageFile) {
                try {
                    finalImageUrl = await uploadToCloudinary(imageFile);
                } catch (uploadError) {
                    alert("បរាជ័យក្នុងការ Upload រូបភាព។");
                    setLoading(false);
                    return;
                }
            }

            const dbPayload = {
                'ឈ្មោះ': formData.name, 
                'ឈ្មោះឡាតាំង': formData.latinName, 
                'ភេទ': formData.gender, 
                'ថ្ងៃខែឆ្នាំកំណើត': formData.dob, 
                'ទីកន្លែងកំណើត': formData.pob, 
                'អត្តលេខ': formData.studentId,
                'ឆ្នាំសិក្សា': formData.academicYear, 
                'ជំនាន់': formData.generation, 
                'ក្រុម': formData.group, 
                'ថ្នាក់': formData.class, 
                'ជំនាញ': formData.skill, 
                'ផ្នែកការងារ': formData.section, 
                'តួនាទី': formData.position, 
                'តេឡេក្រាម': formData.telegram, 
                'រូបថត': finalImageUrl,
                'កាលវិភាគ': { 
                    'ចន្ទ': formData.mon, 'អង្គារ៍': formData.tue, 'ពុធ': formData.wed, 
                    'ព្រហស្បត្តិ៍': formData.thu, 'សុក្រ': formData.fri, 'សៅរ៍': formData.sat, 'អាទិត្យ': formData.sun 
                }
            };
            
            if (employee && employee.id) { 
                await db.ref(`students/${employee.id}`).update(dbPayload); 
                addToast("កែប្រែព័ត៌មានជោគជ័យ", "success"); 
            } else { 
                const snapshot = await db.ref(`students/${formData.studentId}`).once('value');
                if (snapshot.exists()) {
                    alert(`អត្តលេខ ${formData.studentId} មានរួចហើយ!`);
                    setLoading(false);
                    return;
                }
                await db.ref(`students/${formData.studentId}`).set(dbPayload); 
                addToast("បញ្ចូលទិន្នន័យថ្មីជោគជ័យ", "success"); 
            }
            onClose();
        } catch (error) { 
            console.error(error); 
            addToast("បរាជ័យ: " + error.message, 'error'); 
        } finally { 
            setLoading(false); 
        }
    };

    const isFormValid = useMemo(() => formData.name?.trim().length > 0 && formData.studentId?.trim().length > 0, [formData.name, formData.studentId]);

    // Ensure options is always an array to prevent crashes
    const renderSelect = (label, name, options = [], required = false) => (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block tracking-wide">{label} {required && <span className="text-red-500">*</span>}</label>
            <select name={name} value={formData[name]} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50/50 outline-none input-modern">
                <option value="">ជ្រើសរើស...</option>
                {/* Dynamic Option Rendering:
                   If the current value from DB (formData[name]) is NOT in the options list, 
                   we add it as a hidden option so the user can see it but is encouraged to change it.
                */}
                {formData[name] && !options.includes(formData[name]) && (
                    <option value={formData[name]}>{formData[name]} (Current)</option>
                )}
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white animate-scale-in">
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{employee ? 'កែប្រែព័ត៌មាន' : 'បញ្ចូលបុគ្គលិកថ្មី'}</h2>
                        <p className="text-sm text-slate-500 font-medium">សូមបំពេញព័ត៌មានឱ្យបានត្រឹមត្រូវ</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grow custom-scrollbar bg-slate-50/30">
                    <div className="flex gap-10 flex-col lg:flex-row mb-8">
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
                                <input name="studentId" value={formData.studentId} onChange={handleChange} disabled={!!employee} className={`w-full p-4 border-slate-200 rounded-2xl bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-center font-mono font-bold text-xl text-indigo-600 tracking-widest shadow-sm input-modern ${!!employee ? 'opacity-70 cursor-not-allowed' : ''}`} placeholder="ID..." />
                            </div>
                        </div>

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

                <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-8 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">បោះបង់</button>
                    <button onClick={handleSubmit} disabled={loading || !isFormValid} className="px-10 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all">
                        {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />} {employee ? 'កែប្រែ' : 'រក្សាទុក'}
                    </button>
                </div>
            </div>
        </div>
    );
}