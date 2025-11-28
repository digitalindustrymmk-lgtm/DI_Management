import React, { useState } from 'react';
import { SettingsIcon, Trash2Icon } from '../components/Icons';
import { ToastContainer } from '../components/UI';

export default function SettingsView({ db, settings, setConfirmDialog, addToast }) {
    const [activeCategory, setActiveCategory] = useState('skills');
    const [newItem, setNewItem] = useState('');

    const categories = [
        { id: 'skills', label: 'ជំនាញ (Skills)' },
        { id: 'groups', label: 'ក្រុម (Groups)' },
        { id: 'classes', label: 'ថ្នាក់ (Classes)' },
        { id: 'sections', label: 'ផ្នែក (Sections)' },
        { id: 'positions', label: 'តួនាទី (Positions)' },
        { id: 'schedules', label: 'កាលវិភាគ (Schedules)' },
    ];

    const handleAddItem = async () => {
        if (!newItem.trim()) return;
        try {
            const currentItems = settings?.[activeCategory] || [];
            if (currentItems.includes(newItem)) { addToast('មានរួចហើយ!', 'error'); return; }
            await db.ref(`settings/${activeCategory}`).set([...currentItems, newItem]);
            setNewItem(''); addToast('បានបន្ថែមជោគជ័យ');
        } catch (error) { console.error(error); addToast('បរាជ័យ', 'error'); }
    };

    const handleDeleteItem = (itemToDelete) => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'លុបការកំណត់',
            message: `តើអ្នកពិតជាចង់លុប "${itemToDelete}" ចេញពីបញ្ជីមែនទេ?`,
            onConfirm: async () => {
                try {
                    const currentItems = settings?.[activeCategory] || [];
                    await db.ref(`settings/${activeCategory}`).set(currentItems.filter(item => item !== itemToDelete));
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    addToast('បានលុបជោគជ័យ');
                } catch (error) { console.error(error); addToast('បរាជ័យ', 'error'); }
            }
        });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-xl text-blue-600"><SettingsIcon className="h-6 w-6" /></div> ការកំណត់ Dropdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                <div className="glass-panel rounded-3xl p-4 h-fit">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-2">
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full text-left px-3 py-3 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 flex justify-between items-center text-sm md:text-base ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 transform scale-105' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}>
                                <span className="truncate">{cat.label}</span> {activeCategory === cat.id && <div className="hidden md:block h-2 w-2 bg-white rounded-full animate-pulse shrink-0"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-3 glass-panel rounded-3xl p-5 md:p-8 min-h-[500px]">
                    <h3 className="text-xl font-bold text-slate-700 mb-6 border-b border-slate-200/50 pb-4">{categories.find(c => c.id === activeCategory)?.label} List</h3>
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddItem()} placeholder="បញ្ចូលឈ្មោះថ្មី..." className="flex-1 px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none shadow-sm input-modern w-full" />
                        <button onClick={handleAddItem} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 w-full sm:w-auto">បន្ថែម</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {settings?.[activeCategory]?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:shadow-md transition-all">
                                <span className="font-semibold text-slate-700 break-words">{item}</span>
                                <button onClick={() => handleDeleteItem(item)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"><Trash2Icon className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}