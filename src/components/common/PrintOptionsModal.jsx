import React, { useState, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
    XIcon, PrinterIcon, Loader2Icon, PlusIcon, Trash2Icon, 
    CheckIcon, CheckCircleIcon, AlertCircleIcon 
} from '../Icons'; 

// --- IMPORT YOUR LOGO HERE ---
import logoImage from "../../assets/di3-copy.png";

// -- CONFIGURATION --
const ROWS_PORTRAIT = 36;
const ROWS_LANDSCAPE = 24;

const DEFAULT_COLUMNS = [
    { key: 'index', label: 'NO.' },
    { key: 'studentId', label: 'ID' },
    { key: 'name', label: 'ឈ្មោះ (KH)' },
    { key: 'latinName', label: 'Name (EN)' },
    { key: 'gender', label: 'ភេទ' },
    { key: 'dob', label: 'ថ្ងៃកំណើត' },
    { key: 'position', label: 'តួនាទី' },
    { key: 'group', label: 'ក្រុម' },
    { key: 'section', label: 'ផ្នែក' },
    { key: 'class', label: 'ថ្នាក់' },
    { key: 'academicYear', label: 'ឆ្នាំសិក្សា' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'attendance', label: 'ATTENDANCE' },
];

export default function PrintOptionsModal({
    isOpen,
    onClose,
    employees = []
}) {
    // -- State --
    const [reportTitle] = useState('Digital Industry');
    const [exportScope, setExportScope] = useState('all');
    const [scopeValue, setScopeValue] = useState('');
    
    // -- Loading & Toast State --
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentProcessingPage, setCurrentProcessingPage] = useState(0);
    const [toast, setToast] = useState(null); 

    const [dataColumns, setDataColumns] = useState(
        DEFAULT_COLUMNS.map(c => ({
            ...c,
            selected: ['index', 'studentId', 'name', 'gender', 'position', 'group', 'attendance'].includes(c.key)
        }))
    );

    const [customColumns, setCustomColumns] = useState([]);

    // -- Toast Timer --
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // -- Handlers --
    const toggleDataColumn = (key) => {
        setDataColumns(prev => prev.map(c => c.key === key ? { ...c, selected: !c.selected } : c));
    };

    const addCustomColumn = () => {
        setCustomColumns([...customColumns, { id: Date.now(), label: 'Check', type: 'checkbox' }]);
    };

    const removeCustomColumn = (id) => {
        setCustomColumns(prev => prev.filter(c => c.id !== id));
    };

    const updateCustomColumn = (id, field, value) => {
        setCustomColumns(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    // -- Helper: Get Unique & Cleaned Options --
    const getUniqueOptions = (field) => {
        const map = new Map();
        employees.forEach(emp => {
            const rawVal = emp[field];
            if (!rawVal) return;
            
            const val = String(rawVal).trim();
            const key = val.toLowerCase();
            
            if (!map.has(key)) {
                map.set(key, val);
            } else {
                if (val === "IT Support") {
                    map.set(key, val);
                } else if (val[0] === val[0].toUpperCase() && map.get(key)[0] !== map.get(key)[0].toUpperCase()) {
                      map.set(key, val);
                }
            }
        });
        return Array.from(map.values()).sort();
    };

    const uniqueGroups = useMemo(() => getUniqueOptions('group'), [employees]);
    const uniqueSections = useMemo(() => getUniqueOptions('section'), [employees]);
    const uniqueClasses = useMemo(() => getUniqueOptions('class'), [employees]);

    // -- Derived State --
    const activeDataColumns = dataColumns.filter(c => c.selected);
    const totalColumns = activeDataColumns.length + customColumns.length;
    const isLandscape = totalColumns > 8;
    const rowsPerPage = isLandscape ? ROWS_LANDSCAPE : ROWS_PORTRAIT;

    // -- Filter Logic --
    const filteredData = useMemo(() => {
        if (exportScope === 'all') return employees;
        if (!scopeValue) return employees;
        
        return employees.filter(emp => {
            const val = emp[exportScope];
            return val && String(val).trim().toLowerCase() === scopeValue.trim().toLowerCase();
        });
    }, [employees, exportScope, scopeValue]);

    // -- PAGINATION LOGIC --
    const pages = useMemo(() => {
        const chunks = [];
        for (let i = 0; i < filteredData.length; i += rowsPerPage) {
            chunks.push(filteredData.slice(i, i + rowsPerPage));
        }
        return chunks;
    }, [filteredData, rowsPerPage]);

    // -- DOWNLOAD LOGIC --
    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        setProgress(0);
        setCurrentProcessingPage(0);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const orientation = isLandscape ? 'landscape' : 'portrait';
            const doc = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: 'a4'
            });

            const pageElements = document.querySelectorAll('.printable-page');
            if (pageElements.length === 0) {
                setToast({ type: 'error', message: 'No pages found to print.' });
                setIsGenerating(false);
                return;
            }

            const totalPages = pageElements.length;

            for (let i = 0; i < totalPages; i++) {
                setCurrentProcessingPage(i + 1);
                
                const page = pageElements[i];
                const captureWidth = isLandscape ? 1555 : 1100;
                const captureHeight = isLandscape ? 1100 : 1555;

                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    windowWidth: captureWidth,
                    width: captureWidth,
                    windowHeight: captureHeight,
                    height: captureHeight,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                const pdfWidth = isLandscape ? 297 : 210;
                const pdfHeight = isLandscape ? 210 : 297;

                if (i > 0) doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                const percent = Math.round(((i + 1) / totalPages) * 100);
                setProgress(percent);
            }

            doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
            setToast({ type: 'success', message: 'PDF Downloaded Successfully!' });
            
            setTimeout(() => {
                setIsGenerating(false);
            }, 800);

        } catch (err) {
            console.error("PDF Generation Error:", err);
            setToast({ type: 'error', message: 'Failed to generate PDF.' });
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;
    const today = new Date().toLocaleDateString('en-GB');

    return (
        <>
            {/* --- TOAST NOTIFICATION --- */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 fade-in duration-300 border ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
                    <div className="p-2 bg-white/20 rounded-full">
                        {toast.type === 'success' ? <CheckIcon className="h-6 w-6" /> : <AlertCircleIcon className="h-6 w-6" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
                        <p className="text-sm font-medium opacity-90">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* --- LOADING OVERLAY --- */}
            {isGenerating && (
                <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-md text-center">
                        <div className="relative mb-6">
                            <div className="h-20 w-20 border-4 border-slate-600 rounded-full mx-auto"></div>
                            <div className="h-20 w-20 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto absolute top-0 left-0 right-0 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg">
                                {progress}%
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">Generating PDF...</h3>
                        <p className="text-slate-400 text-sm mb-6">Processing page {currentProcessingPage} of {pages.length}</p>
                        
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODERN UI MODAL --- */}
            <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-slate-900/5">
                    
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                                <PrinterIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Print Settings</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isLandscape ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {isLandscape ? 'Landscape' : 'Portrait'}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        • {filteredData.length} Records • {pages.length} Pages
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Body - Grid Layout */}
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            
                            {/* COLUMN 1: FILTERING */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Filter Scope
                                    </h3>
                                    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
                                        {['all', 'group', 'section', 'class'].map(scope => (
                                            <button
                                                key={scope}
                                                onClick={() => { setExportScope(scope); setScopeValue(''); }}
                                                className={`flex-1 py-2 text-[11px] font-bold uppercase rounded-lg transition-all duration-200 ${
                                                    exportScope === scope 
                                                    ? 'bg-slate-800 text-white shadow-md' 
                                                    : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                            >
                                                {scope}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className={`mt-4 transition-all duration-300 ${exportScope !== 'all' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none h-0'}`}>
                                         <div className="relative">
                                            <select 
                                                value={scopeValue} 
                                                onChange={(e) => setScopeValue(e.target.value)} 
                                                className="w-full p-3 pl-4 border border-slate-200 rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none shadow-sm text-slate-700"
                                            >
                                                <option value="">Select Specific {exportScope}...</option>
                                                {exportScope === 'group' && uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                                                {exportScope === 'section' && uniqueSections.map(s => <option key={s} value={s}>{s}</option>)}
                                                {exportScope === 'class' && uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                         </div>
                                    </div>
                                </section>

                                {/* Extra Columns Section */}
                                <section>
                                    <div className="flex justify-between items-end mb-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-1 bg-teal-500 rounded-full"></div> Custom Columns
                                        </h3>
                                        <button onClick={addCustomColumn} className="text-[10px] flex items-center gap-1 bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg font-bold hover:bg-teal-100 transition-colors border border-teal-100">
                                            <PlusIcon className="h-3 w-3" /> Add New
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {customColumns.length === 0 && (
                                            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                                <p className="text-[10px] text-slate-400 font-medium">No custom columns added.</p>
                                            </div>
                                        )}
                                        {customColumns.map((col) => (
                                            <div key={col.id} className="p-3 bg-white border border-slate-200 shadow-sm rounded-xl relative group hover:border-teal-300 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input 
                                                        value={col.label} 
                                                        onChange={(e) => updateCustomColumn(col.id, 'label', e.target.value)} 
                                                        className="flex-1 text-xs font-bold text-slate-700 bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300" 
                                                        placeholder="Header Name" 
                                                    />
                                                    <button onClick={() => removeCustomColumn(col.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2Icon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                    {['blank', 'checkbox'].map(type => (
                                                        <button 
                                                            key={type} 
                                                            onClick={() => updateCustomColumn(col.id, 'type', type)} 
                                                            className={`flex-1 py-1 text-[9px] font-bold rounded-md uppercase transition-all ${col.type === type ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* COLUMN 2 & 3: DATA COLUMNS (Spans 2 cols) */}
                            <div className="lg:col-span-2 flex flex-col h-full">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Visible Data Columns
                                </h3>
                                
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
                                    <div className="overflow-y-auto custom-scrollbar pr-2 pb-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            {dataColumns.map((col) => (
                                                <div 
                                                    key={col.key} 
                                                    onClick={() => toggleDataColumn(col.key)}
                                                    className={`
                                                        cursor-pointer select-none relative p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group
                                                        ${col.selected 
                                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                                            : 'bg-slate-50 border-transparent hover:border-slate-200 hover:bg-slate-100'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${col.selected ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                            {col.key}
                                                        </span>
                                                        <span className={`text-sm font-bold font-battambang ${col.selected ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                                            {col.label}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className={`
                                                        h-5 w-5 rounded-full flex items-center justify-center transition-colors
                                                        ${col.selected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent'}
                                                    `}>
                                                        <CheckIcon className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                        <p className="text-xs text-slate-400">
                                            Currently showing <span className="text-indigo-600 font-bold">{activeDataColumns.length}</span> data columns + <span className="text-teal-600 font-bold">{customColumns.length}</span> custom columns.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center">
                         <div className="text-xs text-slate-400 font-medium">
                            Paper Size: <span className="text-slate-700 font-bold">A4</span>
                         </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} disabled={isGenerating} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 text-sm transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={handleDownloadPDF} 
                                disabled={filteredData.length === 0 || isGenerating} 
                                className="px-4 md:px-8 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:shadow-indigo-200 flex items-center gap-2 text-sm transform active:scale-95 transition-all disabled:opacity-50 disabled:transform-none"
                            >
                                {isGenerating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <PrinterIcon className="h-4 w-4" />}
                                <span className="hidden md:inline">
                                    {isGenerating ? 'Processing...' : 'Download PDF'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HIDDEN PRINT AREA --- */}
            {/* Logic for centering checkboxes is in the CSS below (.custom-cell-center) */}
            <div style={{ position: 'absolute', top: 0, left: '-9999px', width: isLandscape ? '1555px' : '1100px' }}>
                <div id="pdf-content-area" style={{ width: '100%', backgroundColor: 'white' }}>
                    
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
                        
                        .printable-page {
                            width: ${isLandscape ? '1555px' : '1100px'};
                            height: ${isLandscape ? '1100px' : '1555px'}; 
                            padding: 40px;
                            background: white;
                            position: relative;
                            box-sizing: border-box;
                            overflow: hidden;
                        }

                        .pdf-wrapper { font-family: 'Inter', 'Battambang', sans-serif; color: #0f172a; height: 100%; }
                        
                        .header-container {
                            display: flex; justify-content: space-between; align-items: flex-end;
                            margin-bottom: 20px; border-bottom: 2px solid #0f172a; padding-bottom: 15px;
                        }

                        .header-left { display: flex; align-items: center; gap: 15px; }
                        
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            border: 1px solid #cbd5e1; 
                        }
                        
                        th {
                            background-color: #f1f5f9; 
                            color: #334155; 
                            font-weight: 700;
                            text-transform: uppercase; 
                            padding: 10px 5px;
                            text-align: center;
                            font-size: 14px; 
                            border: 1px solid #cbd5e1; 
                            white-space: nowrap;
                        }

                        td {
                            padding: 8px 5px; 
                            vertical-align: middle;
                            font-size: 13px;
                            border: 1px solid #e2e8f0; 
                            text-align: center; /* Default center for text */
                            height: 100%; /* Important for flex child */
                        }

                        .custom-cell-center {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                            min-height: 24px; /* Ensure visual height if empty */
                        }
                        
                        tr:nth-child(even) { background-color: #f8fafc; }

                        .box-check {
                            width: 18px; height: 18px; 
                            border: 2px solid #94a3b8; 
                            border-radius: 4px; 
                            display: block; /* changed to block for flex container */
                        }
                        
                        .footer-text {
                            position: absolute; bottom: 30px; right: 40px;
                            text-align: right; font-size: 10px; color: #64748b; font-weight: bold;
                        }
                    `}</style>

                    {pages.map((pageData, pageIndex) => (
                        <div key={pageIndex} className="printable-page">
                            <div className="pdf-wrapper">
                                <div className="header-container">
                                    <div className="header-left">
                                        <img src={logoImage} alt="Logo" style={{ height: '50px', objectFit: 'contain' }} />
                                        <div>
                                            <h1 style={{ fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', margin: 0 }} className="font-battambang">
                                                {reportTitle}
                                            </h1>
                                            <span style={{ fontSize: '10px', color: '#64748b' }}>Generated by HR PRO System</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                                        <p>DATE: <span style={{ color: '#0f172a' }}>{today}</span></p>
                                        {scopeValue && <p className="uppercase">FILTER: <span style={{ color: '#0f172a' }}>{scopeValue}</span></p>}
                                    </div>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            {activeDataColumns.map((col) => (
                                                <th key={col.key} className="font-battambang">{col.label}</th>
                                            ))}
                                            {customColumns.map((col) => (
                                                <th key={col.id}>{col.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageData.map((emp, idx) => {
                                            const globalIndex = (pageIndex * rowsPerPage) + idx + 1;
                                            return (
                                                <tr key={emp.id || idx}>
                                                    {activeDataColumns.map((col) => (
                                                        <td key={col.key} className="font-battambang">
                                                            {col.key === 'index' ? globalIndex : (emp[col.key] || '-')}
                                                        </td>
                                                    ))}
                                                    {customColumns.map((col) => (
                                                        <td key={col.id}>
                                                            <div className="custom-cell-center">
                                                                {col.type === 'checkbox' && <div className="box-check"></div>}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="footer-text">
                                    Page {pageIndex + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}