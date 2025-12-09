import React from 'react';
import { UsersIcon, UserCheckIcon, UserPlusIcon, HomeIcon, PlusIcon, SearchIcon, SettingsIcon } from '../components/Icons'; // Ensure you have these icons or similar

// 1. Enhanced Minimal Card Component
const ModernStatCard = ({ icon: Icon, label, value, color, delay }) => (
    <div 
        className={`relative overflow-hidden bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group ${delay}`}
    >
        {/* Decorative Background Blob */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>
        
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">{label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${color} transform group-hover:rotate-6 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        
        {/* Fake trend indicator for UX/UI feel */}
        <div className="mt-4 flex items-center text-xs font-medium text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <span>↑ Active</span>
        </div>
    </div>
);

// 2. Quick Action Button Component
const ActionButton = ({ icon: Icon, label, onClick, colorClass }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95"
    >
        <div className={`p-3 rounded-full mb-2 ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
    </button>
);

export default function Dashboard({ stats, onNavigate }) {
    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 sm:px-6">
            
            {/* SECTION 1: Welcome Hero (Gradient Style) */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-200 text-white p-8 md:p-12 animate-fade-in">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <HomeIcon className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-wider uppercase">Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            Welcome to <br/> <span className="text-indigo-200">HR System Pro</span>
                        </h1>
                        <p className="text-indigo-100 text-lg max-w-lg leading-relaxed opacity-90">
                            គ្រប់គ្រងទិន្នន័យបុគ្គលិករបស់អ្នកដោយងាយស្រួល និងមានប្រសិទ្ធភាពខ្ពស់។
                        </p>
                    </div>
                    
                    {/* Call to Action Button */}
                    <button 
                        onClick={() => onNavigate('employees')} 
                        className="group relative px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        <span className="flex items-center gap-2">
                            ចាប់ផ្តើមគ្រប់គ្រង
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* SECTION 2: Statistics (Responsive Grid) */}
            {/* On Mobile: grid-cols-2 (side by side) for a minimal look. On Desktop: grid-cols-3 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <ModernStatCard 
                    icon={UsersIcon} 
                    label="Total Staff" 
                    value={stats.total} 
                    color="bg-blue-500" 
                    delay="animate-[fade-in_0.4s]"
                />
                <ModernStatCard 
                    icon={UserCheckIcon} 
                    label="Male" 
                    value={stats.male} 
                    color="bg-indigo-500" 
                    delay="animate-[fade-in_0.6s]"
                />
                <ModernStatCard 
                    icon={UserPlusIcon} 
                    label="Female" 
                    value={stats.female} 
                    color="bg-pink-500" 
                    delay="animate-[fade-in_0.8s]"
                />
            </div>

            {/* SECTION 3: Quick Actions (New UX Addition) */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Quick Actions</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    <ActionButton 
                        icon={PlusIcon} // Assuming you have a Plus icon
                        label="Add New" 
                        colorClass="bg-emerald-100 text-emerald-600"
                        onClick={() => onNavigate('employees')}
                    />
                     <ActionButton 
                        icon={UsersIcon} 
                        label="View All" 
                        colorClass="bg-blue-100 text-blue-600"
                        onClick={() => onNavigate('employees')}
                    />
                    {/* Placeholder for future features */}
                    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 rounded-2xl opacity-50">
                        <span className="text-xs text-slate-400">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
}