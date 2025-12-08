import React, { memo } from 'react';
import { Edit2Icon, Trash2Icon, UserIcon, SendIcon } from '../Icons';

const EmployeeCard = memo(({ employee, onEdit, onDelete, index, isSelected, onToggleSelect }) => (
    <div className={`group relative bg-white/70 backdrop-blur-md rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col animate-fade-in ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50' : 'border-white/60'}`} style={{ animationDelay: `${index * 50}ms` }} onDoubleClick={onEdit}>
        <div className="absolute top-3 left-3 z-20">
            <input 
                type="checkbox" 
                checked={isSelected || false} 
                onChange={(e) => { e.stopPropagation(); onToggleSelect(employee.id); }}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
        </div>
        <div className="p-6 flex flex-col items-center text-center relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-blue-50 z-0"></div>
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-2 group-hover:translate-x-0">
                <button onClick={(e) => {e.stopPropagation(); onEdit();}} className="text-indigo-600 bg-white hover:bg-indigo-50 p-2 rounded-xl shadow-sm transition-colors border border-indigo-100"><Edit2Icon className="h-4 w-4" /></button>
                <button onClick={(e) => {e.stopPropagation(); onDelete();}} className="text-rose-500 bg-white hover:bg-rose-50 p-2 rounded-xl shadow-sm transition-colors border border-rose-100"><Trash2Icon className="h-4 w-4" /></button>
            </div>
            <div className="relative z-10 mt-4">
                <div className="h-28 w-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 bg-white relative group-hover:ring-4 group-hover:ring-indigo-100 transition-all">
                    {employee.imageUrl ? <img src={employee.imageUrl} alt={employee.name} className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><UserIcon className="h-12 w-12" /></div>}
                </div>
                <div className="absolute bottom-5 right-1 h-5 w-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-0.5">{employee.name}</h3>
            <p className="text-slate-500 text-sm font-medium">{employee.latinName}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-blue-100/50 text-blue-600 rounded-lg text-xs font-bold">{employee.skill || 'No Skill'}</span>
                <span className="px-3 py-1 bg-purple-100/50 text-purple-600 rounded-lg text-xs font-bold">{employee.group || 'No Group'}</span>
            </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 mt-auto backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-slate-500 flex flex-col"><span className="text-[10px] uppercase font-bold text-slate-400">ID</span><span className="font-semibold text-slate-700">{employee.studentId}</span></div>
                <div className="text-slate-500 flex flex-col text-right"><span className="text-[10px] uppercase font-bold text-slate-400">Gender</span><span className={`font-semibold ${employee.gender === 'ស្រី' ? 'text-pink-500' : 'text-indigo-500'}`}>{employee.gender}</span></div>
                <div className="col-span-2 flex items-center gap-2 text-slate-500 truncate pt-2 border-t border-slate-200/50">
                    <div className="p-1.5 bg-blue-100 rounded-full text-blue-600"><SendIcon className="h-3 w-3" /></div>
                    <span className="truncate text-xs font-medium text-blue-600 hover:underline cursor-pointer">{employee.telegram || 'No Telegram'}</span>
                </div>
            </div>
        </div>
    </div>
));

export default EmployeeCard;