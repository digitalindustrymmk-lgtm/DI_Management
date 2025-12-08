import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuIcon, BellIcon } from '../Icons';

const AppHeader = ({ setSidebarOpen, adminProfile, user }) => {
    const location = useLocation();
    
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

    return (
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
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-slate-700">{adminProfile?.username || user?.email || 'Admin User'}</div>
                        <div className="text-xs text-slate-400 font-medium">{adminProfile?.role || 'Loading...'}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white">
                        {adminProfile?.username ? adminProfile.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;