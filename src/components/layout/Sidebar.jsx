import React from 'react';
import { NavLink } from 'react-router-dom';
import { DatabaseIcon, LayoutGridIcon, UsersIcon, CheckSquareIcon, Trash2Icon, SettingsIcon, LogOutIcon } from '../Icons';

const Sidebar = ({ sidebarOpen, setSidebarOpen, adminProfile, user, handleLogout }) => {
    return (
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
                    <p className="text-white text-sm font-bold mb-0.5">{adminProfile?.username || user?.email || 'Admin'}</p>
                    <p className="text-white/60 text-xs font-medium opacity-80 mb-3">{adminProfile?.role || 'User'}</p>
                    
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all text-sm font-bold backdrop-blur-sm"><LogOutIcon className="h-4 w-4" /> Sign Out</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;