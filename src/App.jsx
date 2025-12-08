import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';

// Components
import Sidebar from './components/layout/Sidebar';
import AppHeader from './components/layout/AppHeader';
import LoginView from './components/auth/LoginView';
import EmployeeListView from './components/employees/EmployeeListView';

// UI & Shared
import { ToastContainer, ConfirmModal } from './components/UI';
import EmployeeFormModal from './components/EmployeeFormModal';
import { useToast } from './hooks/useToast';
import { safeString } from './utils/helpers'; 

// Views
import Dashboard from './views/Dashboard';
import SettingsView from './views/SettingsView';
import BulkEditView from './views/BulkEditView';

function App() {
    const [user, setUser] = useState(null);
    const [adminProfile, setAdminProfile] = useState(null); 
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Data States
    const [employees, setEmployees] = useState([]);
    const [deletedEmployees, setDeletedEmployees] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true); 

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });
    
    const navigate = useNavigate();
    const { toasts, addToast, removeToast } = useToast();

    // --- FIREBASE AUTH ---
    useEffect(() => { 
        const unsubscribe = auth.onAuthStateChanged((u) => {
            if (u && (u.isAnonymous || !u.email)) {
                auth.signOut();
                setUser(null);
                localStorage.removeItem('user_session');
                setAdminProfile(null);
            } else {
                setUser(u);
                if (u) {
                    localStorage.setItem('user_session', JSON.stringify({ uid: u.uid, email: u.email }));
                } else {
                    localStorage.removeItem('user_session');
                    setAdminProfile(null);
                }
            }
            setLoading(false); 
        }); 
        return () => unsubscribe(); 
    }, []);

    // --- FIREBASE DATA ---
    useEffect(() => {
        if (!user) return;
        const dbRef = db.ref('students');
        const deletedRef = db.ref('deleted_students');
        const settingsRef = db.ref('settings');
        const adminRef = db.ref('userAdmin/' + user.uid);

        const handleData = (snapshot, setFn) => {
            const data = snapshot.val();
            if (data) {
                const formatted = Object.keys(data).map(key => {
                    const item = data[key] || {};
                    const schedule = item['កាលវិភាគ'] || {};
                    return { 
                        id: key, 
                        imageUrl: safeString(item['រូបថត'] || item.imageUrl), 
                        name: safeString(item['ឈ្មោះ'] || item.name), 
                        latinName: safeString(item['ឈ្មោះឡាតាំង']), 
                        gender: safeString(item['ភេទ']), 
                        dob: safeString(item['ថ្ងៃខែឆ្នាំកំណើត']), 
                        pob: safeString(item['ទីកន្លែងកំណើត']), 
                        studentId: safeString(item['អត្តលេខ']), 
                        academicYear: safeString(item['ឆ្នាំសិក្សា']), 
                        generation: safeString(item['ជំនាន់']), 
                        group: safeString(item['ក្រុម']), 
                        class: safeString(item['ថ្នាក់']), 
                        skill: safeString(item['ជំនាញ']), 
                        section: safeString(item['ផ្នែកការងារ']), 
                        position: safeString(item['តួនាទី']), 
                        telegram: safeString(item['តេឡេក្រាម']), 
                        mon: safeString(schedule['ចន្ទ'] || item['ចន្ទ']), 
                        tue: safeString(schedule['អង្គារ៍'] || item['អង្គារ៍']), 
                        wed: safeString(schedule['ពុធ'] || item['ពុធ']), 
                        thu: safeString(schedule['ព្រហស្បត្តិ៍'] || item['ព្រហស្បត្តិ៍']), 
                        fri: safeString(schedule['សុក្រ'] || item['សុក្រ']), 
                        sat: safeString(schedule['សៅរ៍'] || item['សៅរ៍']), 
                        sun: safeString(schedule['អាទិត្យ'] || item['អាទិត្យ']), 
                        originalData: item 
                    };
                });
                setFn(formatted.reverse());
            } else setFn([]);
        };

        dbRef.on('value', snap => { handleData(snap, setEmployees); setLoading(false); });
        deletedRef.on('value', snap => handleData(snap, setDeletedEmployees));
        settingsRef.on('value', snap => setSettings(snap.val() || {}));
        
        adminRef.on('value', snap => {
            const data = snap.val();
            if (data) setAdminProfile(data);
        });

        return () => { dbRef.off(); deletedRef.off(); settingsRef.off(); adminRef.off(); };
    }, [user]);

    // --- ACTIONS ---
    const handleLogin = async (email, password) => {
        setLoginLoading(true);
        setLoginError('');
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error("Login failed:", error);
            let msg = "Failed to sign in. Please check your credentials.";
            if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
            if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
            setLoginError(msg);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Sign Out',
            message: 'Are you sure you want to sign out?',
            onConfirm: async () => {
                await auth.signOut();
                localStorage.removeItem('user_session');
                setConfirmDialog(prev => ({...prev, isOpen: false}));
                addToast("Signed out successfully", "success");
            }
        });
    };

    const initiateDelete = useCallback((id) => {
        const emp = employees.find(e => e.id === id);
        setConfirmDialog({ 
            isOpen: true, 
            type: 'danger', 
            title: 'បញ្ជាក់ការលុប', 
            message: `តើអ្នកពិតជាចង់លុប "${emp?.name}" ទៅកាន់ធុងសំរាមមែនទេ?`, 
            onConfirm: async () => { 
                try { 
                    await db.ref(`deleted_students/${emp.id}`).set({ ...emp.originalData, deletedAt: Date.now() }); 
                    await db.ref(`students/${emp.id}`).remove(); 
                    setConfirmDialog(prev => ({...prev, isOpen: false})); 
                    addToast("បានបញ្ជូនទៅធុងសំរាម", 'success'); 
                } catch (error) { 
                    addToast("បរាជ័យក្នុងការលុប", 'error'); 
                } 
            } 
        });
    }, [employees, addToast]);

    const handleBulkDelete = useCallback((ids) => {
        if (!ids || ids.length === 0) return;
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'បញ្ជាក់ការលុបជាក្រុម',
            message: `តើអ្នកប្រាកដជាចង់លុបបុគ្គលិកចំនួន ${ids.length} នាក់ ទៅកាន់ធុងសំរាមមែនទេ?`,
            onConfirm: async () => {
                try {
                    const updates = {};
                    ids.forEach(id => {
                        const emp = employees.find(e => e.id === id);
                        if (emp) {
                            updates[`deleted_students/${id}`] = { ...emp.originalData, deletedAt: Date.now() };
                            updates[`students/${id}`] = null;
                        }
                    });
                    await db.ref().update(updates);
                    setConfirmDialog(prev => ({...prev, isOpen: false}));
                    addToast(`បានលុបចំនួន ${ids.length} នាក់ជោគជ័យ`, 'success');
                } catch (error) {
                    addToast("បរាជ័យក្នុងការលុបជាក្រុម", 'error');
                }
            }
        });
    }, [employees, addToast]);

    const handleRestore = useCallback((employee) => {
        setConfirmDialog({ 
            isOpen: true, 
            type: 'restore', 
            title: 'បញ្ជាក់ការស្តារ', 
            message: `តើអ្នកចង់ស្តារ "${employee.name}" ត្រឡប់មកវិញទេ?`, 
            onConfirm: async () => { 
                try { 
                    await db.ref(`students/${employee.id}`).set(employee.originalData); 
                    await db.ref(`deleted_students/${employee.id}`).remove(); 
                    setConfirmDialog(prev => ({ ...prev, isOpen: false })); 
                    addToast("បានស្តារទិន្នន័យជោគជ័យ", 'success'); 
                } catch (e) { 
                    addToast("បរាជ័យ", 'error'); 
                } 
            } 
        });
    }, [addToast]);

    const handlePermanentDelete = useCallback((id) => {
        setConfirmDialog({ 
            isOpen: true, 
            type: 'danger', 
            title: 'លុបជារៀងរហូត', 
            message: "តើអ្នកចង់លុបជារៀងរហូតមែនទេ? ទិន្នន័យមិនអាចយកមកវិញបានទេ។", 
            onConfirm: async () => { 
                try { 
                    await db.ref(`deleted_students/${id}`).remove(); 
                    setConfirmDialog(prev => ({ ...prev, isOpen: false })); 
                    addToast("លុបជាស្ថាពរជោគជ័យ", 'success'); 
                } catch (e) { 
                    addToast("បរាជ័យ", 'error'); 
                } 
            } 
        });
    }, [addToast]);

    const handleInlineUpdate = useCallback(async (id, field, value) => { 
        try { await db.ref(`students/${id}`).update({ [field]: value }); } 
        catch (error) { addToast("បរាជ័យក្នុងការកែប្រែ", 'error'); } 
    }, [addToast]);

    const stats = useMemo(() => ({ total: employees.length, male: employees.filter(e => e.gender === 'ប្រុស').length, female: employees.filter(e => e.gender === 'ស្រី').length }), [employees]);

    // --- RENDER ---
    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Loading HR Pro...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginView onLogin={handleLogin} loading={loginLoading} error={loginError} />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                adminProfile={adminProfile} 
                user={user} 
                handleLogout={handleLogout} 
            />
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>}

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <AppHeader setSidebarOpen={setSidebarOpen} adminProfile={adminProfile} user={user} />

                <main className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8 custom-scrollbar">
                    <Routes>
                        <Route path="/" element={<Dashboard stats={stats} onNavigate={(path) => navigate(path)} />} />
                        <Route path="/employees" element={
                            <EmployeeListView 
                                employees={employees} 
                                loading={loading}
                                settings={settings}
                                isModalOpen={isModalOpen}
                                onEdit={(emp) => { setCurrentEmployee(emp); setIsModalOpen(true); }}
                                onDelete={initiateDelete}
                                onInlineUpdate={handleInlineUpdate}
                                onCreate={() => { setCurrentEmployee(null); setIsModalOpen(true); }}
                                onBulkDelete={handleBulkDelete}
                            />
                        } />
                        <Route path="/recycle-bin" element={
                            <EmployeeListView 
                                employees={deletedEmployees}
                                loading={loading}
                                isRecycleBin={true}
                                onRestore={handleRestore}
                                onPermanentDelete={handlePermanentDelete}
                            />
                        } />

                        <Route path="/bulk-edit" element={<BulkEditView db={db} employees={employees} settings={settings} addToast={addToast} setConfirmDialog={setConfirmDialog}  />} />
                        <Route path="/settings" element={<SettingsView db={db} settings={settings} setConfirmDialog={setConfirmDialog} addToast={addToast} />} />
                    </Routes>
                </main>
            </div>

            {isModalOpen && <EmployeeFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employee={currentEmployee} db={db} addToast={addToast} settings={settings} />}
            <ConfirmModal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog(prev => ({...prev, isOpen: false}))} {...confirmDialog} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}

export default App;