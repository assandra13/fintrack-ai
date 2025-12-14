import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Sidebar from './components/common/Sidebar';
import BottomNav from './components/common/BottomNav';
import Header from './components/common/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Wallets from './pages/Wallets';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Bills from './pages/Bills';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div className="animate-spin" style={{ fontSize: '2rem' }}>⏳</div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div className="app-layout" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Header />
                <main style={{
                    flex: 1,
                    padding: 'var(--space-6)',
                    paddingBottom: 'calc(var(--space-6) + 80px)', // Extra padding for bottom nav on mobile
                    background: 'var(--bg-primary)',
                }}>
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DataProvider>
                    <NotificationProvider>
                        <BrowserRouter>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />

                                {/* Protected routes */}
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <AppLayout><Dashboard /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/transactions" element={
                                    <ProtectedRoute>
                                        <AppLayout><Transactions /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/wallets" element={
                                    <ProtectedRoute>
                                        <AppLayout><Wallets /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/categories" element={
                                    <ProtectedRoute>
                                        <AppLayout><Categories /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/budgets" element={
                                    <ProtectedRoute>
                                        <AppLayout><Budgets /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/goals" element={
                                    <ProtectedRoute>
                                        <AppLayout><Goals /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/bills" element={
                                    <ProtectedRoute>
                                        <AppLayout><Bills /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/reports" element={
                                    <ProtectedRoute>
                                        <AppLayout><Reports /></AppLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                    <ProtectedRoute>
                                        <AppLayout><Settings /></AppLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Default redirect */}
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                            </Routes>
                        </BrowserRouter>
                    </NotificationProvider>
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
