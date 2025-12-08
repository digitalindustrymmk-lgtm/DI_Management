import React, { useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { XIcon, PrinterIcon, Loader2Icon, PlusIcon, Trash2Icon } from '../Icons';

// --- IMPORT YOUR LOGO HERE ---
import logoImage from "../../assets/di3-copy.png";

// -- CONFIGURATION --
// Adjusted rows to fit new larger font sizes
// Portrait: ~32 rows fits with 16px/14px fonts
// Landscape: ~20 rows fits
const ROWS_PORTRAIT = 31;
const ROWS_LANDSCAPE = 20;

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
    employees = [], 
    uniqueGroups, 
    uniqueSections, 
    uniqueClasses 
}) {
    // -- State --
    const [reportTitle] = useState('Digital Industry'); 
    const [exportScope, setExportScope] = useState('all');
    const [scopeValue, setScopeValue] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [dataColumns, setDataColumns] = useState(
        DEFAULT_COLUMNS.map(c => ({ 
            ...c, 
            selected: ['index', 'studentId', 'name', 'gender', 'position', 'group', 'attendance'].includes(c.key) 
        }))
    );

    const [customColumns, setCustomColumns] = useState([]);

    // -- Handlers --
    const toggleDataColumn = (key) => {
        setDataColumns(prev => prev.map(c => c.key === key ? { ...c, selected: !c.selected } : c));
    };

    const updateHeaderLabel = (key, newLabel) => {
        setDataColumns(prev => prev.map(c => c.key === key ? { ...c, label: newLabel } : c));
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

    // -- Derived State --
    const activeDataColumns = dataColumns.filter(c => c.selected);
    const totalColumns = activeDataColumns.length + customColumns.length;
    const isLandscape = totalColumns > 8;
    const rowsPerPage = isLandscape ? ROWS_LANDSCAPE : ROWS_PORTRAIT;

    // -- Filter Logic --
    const filteredData = useMemo(() => {
        if (exportScope === 'all') return employees;
        if (!scopeValue) return employees; 
        return employees.filter(emp => emp[exportScope] === scopeValue);
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
        const delayTime = 1000 + (pages.length * 20);
        
        setTimeout(async () => {
            try {
                const orientation = isLandscape ? 'landscape' : 'portrait';
                const doc = new jsPDF({
                    orientation: orientation,
                    unit: 'mm',
                    format: 'a4'
                });

                const pageElements = document.querySelectorAll('.printable-page');
                if (pageElements.length === 0) {
                    alert("No pages found to print.");
                    setIsGenerating(false);
                    return;
                }

                for (let i = 0; i < pageElements.length; i++) {
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
                        height: captureHeight
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    const pdfWidth = isLandscape ? 297 : 210;
                    const pdfHeight = isLandscape ? 210 : 297;

                    if (i > 0) doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }

                doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
                setIsGenerating(false);

            } catch (err) {
                console.error("PDF Generation Error:", err);
                setIsGenerating(false);
            }
        }, delayTime);
    };

    if (!isOpen) return null;
    const today = new Date().toLocaleDateString('en-GB');

    return (
        <>
            {/* UI MODAL (Settings) */}
            <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white">
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
                                <PrinterIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Download PDF</h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    {isLandscape ? 'Landscape Mode (Many Columns)' : 'Portrait Mode'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Filter Section */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Filter Data</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'group', 'section', 'class'].map(scope => (
                                            <label key={scope} className={`flex-1 cursor-pointer border rounded-lg p-2 flex justify-center ${exportScope === scope ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600'}`}>
                                                <input type="radio" name="scope" value={scope} checked={exportScope === scope} onChange={() => { setExportScope(scope); setScopeValue(''); }} className="hidden" />
                                                <span className="capitalize font-bold text-[10px]">{scope}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {exportScope !== 'all' && (
                                        <select value={scopeValue} onChange={(e) => setScopeValue(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-bold bg-slate-50">
                                            <option value="">-- Select {exportScope} --</option>
                                            {exportScope === 'group' && uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                                            {exportScope === 'section' && uniqueSections.map(s => <option key={s} value={s}>{s}</option>)}
                                            {exportScope === 'class' && uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    )}
                                    <div className="text-xs font-bold text-indigo-700 bg-indigo-50 p-2.5 rounded-lg text-center border border-indigo-100 mt-2">
                                        Records: <span className="text-lg ml-1">{filteredData.length}</span> 
                                        <span className="text-slate-400 font-normal ml-2">({pages.length} Pages)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Columns Section */}
                            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Select Columns</h3>
                                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {dataColumns.map((col) => (
                                        <div key={col.key} className={`flex items-center gap-3 p-2 rounded-lg border ${col.selected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'}`}>
                                            <input type="checkbox" checked={col.selected} onChange={() => toggleDataColumn(col.key)} className="h-4 w-4 rounded text-indigo-600 cursor-pointer" />
                                            <input value={col.label} onChange={(e) => updateHeaderLabel(col.key, e.target.value)} className="flex-1 bg-transparent text-xs font-bold outline-none" disabled={!col.selected} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Extra Columns Section */}
                            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Extra Columns</h3>
                                    <button onClick={addCustomColumn} className="text-[10px] flex items-center gap-1 bg-slate-800 text-white px-2 py-1 rounded-md font-bold hover:bg-black transition-colors">
                                        <PlusIcon className="h-3 w-3" /> Add
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {customColumns.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                                            <p className="text-[10px] text-slate-400">No custom columns.</p>
                                        </div>
                                    )}
                                    {customColumns.map((col) => (
                                        <div key={col.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl relative group">
                                            <button onClick={() => removeCustomColumn(col.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500">
                                                <Trash2Icon className="h-3.5 w-3.5" />
                                            </button>
                                            <input value={col.label} onChange={(e) => updateCustomColumn(col.id, 'label', e.target.value)} className="w-full text-xs font-bold border-b border-slate-300 bg-transparent mb-2 focus:border-indigo-500 outline-none" placeholder="Header Name" />
                                            <div className="flex gap-2">
                                                {['blank', 'checkbox'].map(type => (
                                                    <button key={type} onClick={() => updateCustomColumn(col.id, 'type', type)} className={`flex-1 py-1 text-[9px] rounded uppercase transition-colors ${col.type === type ? 'bg-slate-800 text-white' : 'bg-white border text-slate-500'}`}>{type}</button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                        <button onClick={onClose} disabled={isGenerating} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 text-sm">Cancel</button>
                        <button onClick={handleDownloadPDF} disabled={filteredData.length === 0 || isGenerating} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 text-sm transform active:scale-95 transition-all disabled:opacity-50">
                            {isGenerating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <PrinterIcon className="h-4 w-4" />}
                            {isGenerating ? `Processing ${pages.length} Pages...` : 'Download PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* -- HIDDEN CONTENT AREA -- */}
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
                        
                        /* --- TABLE STYLES --- */
                        table { 
                            width: 100%; 
                            border-collapse: collapse; /* Ensures borders touch each other */
                            border: 1px solid #cbd5e1; /* Outer border */
                        }
                        
                        /* HEADER STYLING */
                        th {
                            background-color: #f1f5f9; 
                            color: #334155; 
                            font-weight: 700;
                            text-transform: uppercase; 
                            padding: 12px 10px; /* More padding */
                            
                            /* UPDATED: Center text, larger font, full borders */
                            text-align: center;
                            font-size: 18px; 
                            border: 1px solid #cbd5e1; /* Full grid border */
                            white-space: nowrap;
                        }

                        /* BODY STYLING */
                        td {
                            padding: 10px; 
                            vertical-align: middle;
                            
                            /* UPDATED: Larger font, full borders */
                            font-size: 15px;
                            border: 1px solid #e2e8f0; /* Full grid border */
                            
                            /* Default center alignment for data */
                        }
                        
                        /* Optional: Left align specific columns like Names if needed */
                        /* td:nth-child(3) { text-align: left; } */
                        
                        tr:nth-child(even) { background-color: #f8fafc; }

                        .box-check {
                            width: 16px; height: 16px; border: 2px solid #cbd5e1; 
                            border-radius: 4px; display: inline-block;
                        }
                        
                        /* FOOTER */
                        .footer-text {
                            position: absolute;
                            bottom: 30px; 
                            right: 40px;
                            text-align: right;
                            font-size: 10px;
                            color: #64748b;
                            font-weight: bold;
                        }
                    `}</style>

                    {/* RENDER PAGES LOOP */}
                    {pages.map((pageData, pageIndex) => (
                        <div key={pageIndex} className="printable-page">
                            <div className="pdf-wrapper">
                                
                                {/* HEADER */}
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

                                {/* TABLE */}
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
                                                            {col.type === 'checkbox' && <div className="box-check"></div>}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* FOOTER */}
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