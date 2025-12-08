import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

const PaginationControls = ({ className, currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => (
    <div className={className}>
        <div className="text-xs font-medium text-slate-500 mb-2 md:mb-0">
            Showing {totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
                disabled={currentPage === 1} 
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 shadow-sm transition-all active:scale-95"
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm min-w-[80px] text-center flex items-center justify-center">
                {currentPage} / {Math.max(totalPages, 1)}
            </div>
            
            <button 
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-600 shadow-sm transition-all active:scale-95"
            >
                <ChevronRightIcon className="h-4 w-4" />
            </button>
        </div>
    </div>
);

export default PaginationControls;