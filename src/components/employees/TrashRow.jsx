import React, { memo } from 'react';
import { RotateCcwIcon, Trash2Icon, UserIcon } from '../Icons';

const TrashRow = memo(({ employee, onRestore, onPermanentDelete, index }) => (
    <tr className="group hover:bg-red-50/50 transition-colors animate-fade-in border-b border-slate-100">
        <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur-sm group-hover:bg-red-50/30 z-20 border-r border-slate-100">
            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onRestore(employee)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg transition-colors" title="ស្តារវិញ"><RotateCcwIcon className="h-4 w-4" /></button>
                <button onClick={() => onPermanentDelete(employee.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors" title="លុបជារៀងរហូត"><Trash2Icon className="h-4 w-4" /></button>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 border-2 border-slate-100 rounded-full overflow-hidden opacity-70 grayscale">
                    {employee.imageUrl ? <img className="h-full w-full object-cover" src={employee.imageUrl} alt="" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-5 w-5" /></div>}
                </div>
                <div className="ml-3"><div className="font-bold text-slate-700 text-sm">{employee.name}</div></div>
            </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-500">{employee.latinName}</td>
        <td className="px-4 py-3 text-sm font-mono bg-slate-50 rounded text-center">{employee.studentId}</td>
        <td className="px-4 py-3 text-sm text-red-400 italic">Deleted just now</td>
    </tr>
));

export default TrashRow;