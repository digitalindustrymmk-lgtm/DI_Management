import React from 'react';
import { StatCard } from '../components/UI';
import { UsersIcon, UserCheckIcon, UserPlusIcon, HomeIcon } from '../components/Icons';

export default function Dashboard({ stats, onNavigate }) {
    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={UsersIcon} label="Total Employees" value={stats.total} color="bg-blue-500" />
                <StatCard icon={UserCheckIcon} label="Male Staff" value={stats.male} color="bg-indigo-500" />
                <StatCard icon={UserPlusIcon} label="Female Staff" value={stats.female} color="bg-pink-500" />
            </div>
            <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="bg-indigo-50 p-6 rounded-full mb-6 animate-scale-in"><HomeIcon className="h-16 w-16 text-indigo-500" /></div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Welcome to HR System Pro</h2>
                <p className="text-slate-500 max-w-lg text-lg mb-8">គ្រប់គ្រងទិន្នន័យបុគ្គលិករបស់អ្នកដោយងាយស្រួល និងមានប្រសិទ្ធភាពខ្ពស់។</p>
                <button onClick={() => onNavigate('employees')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-300 hover:-translate-y-1 transition-all">ចាប់ផ្តើមគ្រប់គ្រង</button>
            </div>
        </div>
    );
}