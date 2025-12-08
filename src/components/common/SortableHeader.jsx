import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '../Icons';

const SortableHeader = ({ 
    label, 
    sortKey, 
    currentSort, 
    onOpenSort, 
    className = "" 
}) => {
    // 🛡️ SAFETY CHECK: Provide a fallback if currentSort is undefined
    const safeSort = currentSort || { key: null, direction: 'asc' };

    return (
        <th 
            className={`px-4 py-4 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group select-none ${className}`}
            onClick={() => onOpenSort(sortKey, label)}
        >
            <div className="flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1.5">
                    {label}
                    <span className="text-slate-400 flex flex-col">
                        {safeSort.key === sortKey ? (
                            safeSort.direction === 'asc' ? <ArrowUpIcon className="h-3 w-3 text-indigo-600" /> : <ArrowDownIcon className="h-3 w-3 text-indigo-600" />
                        ) : (
                            <div className="opacity-0 group-hover:opacity-50 transition-opacity">
                               <ArrowUpIcon className="h-2 w-2 mb-[-2px]" />
                               <ArrowDownIcon className="h-2 w-2" />
                            </div>
                        )}
                    </span>
                </div>
            </div>
        </th>
    );
};

export default SortableHeader;