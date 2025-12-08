import React, { memo } from 'react';
import { Edit2Icon, Trash2Icon, UserIcon } from '../Icons';
import { EditableCell } from '../UI'; 
import { ACADEMIC_YEARS, GENERATIONS, GENDER_OPTIONS } from '../../utils/helpers'; 

const EmployeeRow = memo(({ employee, onEdit, onDelete, onInlineUpdate, index, settings, isSelected, onToggleSelect }) => (
    <tr className={`group transition-colors animate-fade-in border-b border-slate-100 last:border-0 ${isSelected ? 'bg-indigo-50' : 'hover:bg-indigo-50/30'}`} onDoubleClick={onEdit}>
        <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white/90 backdrop-blur-sm z-20 border-r border-slate-100">
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={isSelected || false} 
                    onChange={(e) => onToggleSelect(employee.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition-colors"><Edit2Icon className="h-4 w-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-rose-500 hover:bg-rose-100 p-2 rounded-lg transition-colors"><Trash2Icon className="h-4 w-4" /></button>
                </div>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap sticky left-[88px] bg-white/90 backdrop-blur-sm z-20 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white">
                    {employee.imageUrl ? <img className="h-full w-full object-cover" src={employee.imageUrl} alt="" /> : <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400"><UserIcon className="h-5 w-5" /></div>}
                </div>
                <div className="ml-3"><div className="font-bold text-slate-800 text-sm"><EditableCell value={employee.name} onSave={(val) => onInlineUpdate(employee.id, 'ឈ្មោះ', val)} /></div></div>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-medium"><EditableCell value={employee.latinName} onSave={(val) => onInlineUpdate(employee.id, 'ឈ្មោះឡាតាំង', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm"><EditableCell value={employee.gender} onSave={(val) => onInlineUpdate(employee.id, 'ភេទ', val)} options={GENDER_OPTIONS} className={`font-semibold ${employee.gender === 'ស្រី' ? 'text-pink-500' : 'text-indigo-500'}`} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-mono"><div className="bg-slate-100 px-2 py-1 rounded text-center text-xs font-bold text-slate-700"><EditableCell value={employee.studentId} onSave={(val) => onInlineUpdate(employee.id, 'អត្តលេខ', val)} /></div></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.skill} onSave={(val) => onInlineUpdate(employee.id, 'ជំនាញ', val)} options={settings?.skills} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-semibold text-slate-700"><EditableCell value={employee.group} onSave={(val) => onInlineUpdate(employee.id, 'ក្រុម', val)} options={settings?.groups} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 text-[10px] text-slate-400"><EditableCell value={employee.class} onSave={(val) => onInlineUpdate(employee.id, 'ថ្នាក់', val)} options={settings?.classes} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.section} onSave={(val) => onInlineUpdate(employee.id, 'ផ្នែកការងារ', val)} options={settings?.sections} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 text-xs font-medium text-center"><EditableCell value={employee.position} onSave={(val) => onInlineUpdate(employee.id, 'តួនាទី', val)} options={settings?.positions} /></div></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
            <div className="flex flex-col">
                <span><EditableCell value={employee.academicYear} onSave={(val) => onInlineUpdate(employee.id, 'ឆ្នាំសិក្សា', val)} options={ACADEMIC_YEARS} /></span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">Gen: <EditableCell value={employee.generation} onSave={(val) => onInlineUpdate(employee.id, 'ជំនាន់', val)} options={GENERATIONS} /></span>
            </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600"><EditableCell value={employee.dob} onSave={(val) => onInlineUpdate(employee.id, 'ថ្ងៃខែឆ្នាំកំណើត', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 max-w-xs truncate" title={employee.pob}><EditableCell value={employee.pob} onSave={(val) => onInlineUpdate(employee.id, 'ទីកន្លែងកំណើត', val)} /></td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500 cursor-pointer font-medium hover:underline"><EditableCell value={employee.telegram} onSave={(val) => onInlineUpdate(employee.id, 'តេឡេក្រាម', val)} /></td>
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day, idx) => {
            const dayKh = ['ចន្ទ', 'អង្គារ៍', 'ពុធ', 'ព្រហស្បត្តិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'][idx];
            return <td key={day} className="px-4 py-3 whitespace-nowrap text-center border-l border-slate-100 text-sm font-medium text-slate-700 bg-slate-50/30"><EditableCell value={employee[day]} onSave={(val) => onInlineUpdate(employee.id, `កាលវិភាគ/${dayKh}`, val)} options={settings?.schedules} /></td>
        })}
    </tr>
), (prev, next) => prev.employee === next.employee && prev.index === next.index && prev.settings === next.settings && prev.isSelected === next.isSelected);

export default EmployeeRow;