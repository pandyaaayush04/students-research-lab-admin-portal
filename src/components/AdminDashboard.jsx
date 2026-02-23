import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
    LogOut, 
    Users, 
    Calendar, 
    Award, 
    FileText,
    Settings,
    BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                navigate('/admin/login');
                return;
            }
            
            setUser(user);
        } catch (error) {
            console.error('Error checking user:', error);
            navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 via-white to-primary/20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statsCards = [
        { title: 'Total Members', value: '36', icon: Users, color: 'bg-blue-500' },
        { title: 'Active Sessions', value: '12', icon: Calendar, color: 'bg-green-500' },
        { title: 'Achievements', value: '24', icon: Award, color: 'bg-purple-500' },
        { title: 'Reports', value: '8', icon: FileText, color: 'bg-orange-500' },
    ];

    const quickActions = [
        { title: 'Manage Members', icon: Users, link: '/admin/members' },
        { title: 'View Statistics', icon: BarChart3, link: '/admin/stats' },
        { title: 'Settings', icon: Settings, link: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-white to-primary/20">
            {/* Header */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-800">SRL Admin</h1>
                                <p className="text-xs text-slate-500">Dashboard</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-black text-slate-800 mb-2">
                        Welcome back! 👋
                    </h2>
                    <p className="text-slate-600">
                        Here's what's happening with SRL today
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-black text-slate-800">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} rounded-xl p-3`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-black text-slate-800 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action) => (
                            <button
                                key={action.title}
                                onClick={() => navigate(action.link)}
                                className="flex items-center gap-3 p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl hover:shadow-md transition-all group"
                            >
                                <div className="bg-secondary rounded-lg p-2 group-hover:scale-110 transition-transform">
                                    <action.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-slate-800">
                                    {action.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-black text-slate-800 mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold">New member</span> joined the lab
                            </p>
                            <span className="ml-auto text-xs text-slate-500">2 hours ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold">Session</span> completed successfully
                            </p>
                            <span className="ml-auto text-xs text-slate-500">5 hours ago</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold">Achievement</span> unlocked by team
                            </p>
                            <span className="ml-auto text-xs text-slate-500">1 day ago</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
