import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiCalendar, FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown, FiEye, FiHeart, FiTarget } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db, realtimeDb } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    volunteersChange: 0,
    totalBeneficiaries: 0,
    beneficiariesChange: 0,
    activePrograms: 0,
    programsChange: 0,
    upcomingEvents: 0,
    eventsChange: 0,
    monthlyBreakdown: [],
    programBreakdown: []
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch users data
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate user statistics
        const volunteers = usersData.filter(user => user.role === 'volunteer' || user.role === 'user');
        const beneficiaries = usersData.filter(user => user.role === 'beneficiary');
        
        // Fetch programs data
        const programsCollection = collection(db, 'programs');
        const programsSnapshot = await getDocs(programsCollection);
        const programsData = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch opportunities (events) data from realtime database
        const opportunitiesRef = ref(realtimeDb, 'opportunities');
        const opportunitiesSnapshot = await get(opportunitiesRef);
        const opportunitiesData = opportunitiesSnapshot.exists() ? Object.values(opportunitiesSnapshot.val()) : [];
        
        // Calculate monthly breakdown
        const monthlyData = calculateMonthlyBreakdown(usersData);
        
        // Calculate program breakdown
        const programBreakdown = calculateProgramBreakdown(programsData);
        
        // Get recent users (last 5)
        const recentUsersData = usersData
          .sort((a, b) => {
            const aDate = a.createdAt?.seconds || 0;
            const bDate = b.createdAt?.seconds || 0;
            return bDate - aDate;
          })
          .slice(0, 5)
          .map(user => ({
            id: user.id,
            name: user.displayName || 'Unknown User',
            email: user.email,
            joined: user.createdAt ? new Date(user.createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            role: user.role === 'user' ? 'Volunteer' : (user.role || 'User').charAt(0).toUpperCase() + (user.role || 'User').slice(1)
          }));

        setStats({
          totalVolunteers: volunteers.length,
          volunteersChange: 0, // Would need historical data to calculate
          totalBeneficiaries: beneficiaries.length,
          beneficiariesChange: 0, // Would need historical data to calculate
          activePrograms: programsData.length,
          programsChange: 0, // Would need historical data to calculate
          upcomingEvents: opportunitiesData.length,
          eventsChange: 0, // Would need historical data to calculate
          monthlyBreakdown: monthlyData,
          programBreakdown: programBreakdown
        });
        
        setRecentUsers(recentUsersData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Helper function to calculate monthly breakdown
  const calculateMonthlyBreakdown = (users) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      const usersInMonth = users.filter(user => {
        if (!user.createdAt) return false;
        const userDate = new Date(user.createdAt.seconds * 1000);
        return userDate.getMonth() === date.getMonth() && userDate.getFullYear() === year;
      }).length;
      
      monthlyData.push({ month, volunteers: usersInMonth });
    }
    
    return monthlyData;
  };

  // Helper function to calculate program breakdown
  const calculateProgramBreakdown = (programs) => {
    if (programs.length === 0) return [];
    
    const categories = {};
    programs.forEach(program => {
      const category = program.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    const total = programs.length;
    return Object.entries(categories).map(([program, count]) => ({
      program,
      percentage: Math.round((count / total) * 100)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard - Lumps Away Foundation</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 space-y-8"
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your organization.</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live data</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Total Volunteers',
                value: stats.totalVolunteers.toLocaleString(),
                growth: stats.volunteersChange,
                icon: FiUsers,
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600'
              },
              {
                title: 'Beneficiaries',
                value: stats.totalBeneficiaries.toLocaleString(),
                growth: stats.beneficiariesChange,
                icon: FiHeart,
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
              },
              {
                title: 'Active Programs',
                value: stats.activePrograms,
                growth: stats.programsChange,
                icon: FiActivity,
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
                textColor: 'text-purple-600',
                status: 'Running'
              },
              {
                title: 'Upcoming Events',
                value: stats.upcomingEvents,
                growth: stats.eventsChange,
                icon: FiCalendar,
                color: 'from-orange-500 to-orange-600',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600',
                status: 'Scheduled'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500`}></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`text-xl ${stat.textColor}`} />
                        </div>
                        {stat.growth !== null && stat.growth !== 0 && (
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            stat.growth >= 0 
                              ? 'bg-green-50 text-green-600' 
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {stat.growth >= 0 ? (
                              <FiTrendingUp className="text-xs" />
                            ) : (
                              <FiTrendingDown className="text-xs" />
                            )}
                            {Math.abs(stat.growth)}%
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                        {stat.status ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stat.textColor.replace('text-', 'bg-')}`}></div>
                            <span className={`text-sm font-medium ${stat.textColor}`}>{stat.status}</span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">vs previous {timeRange}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts and Tables */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Volunteer Growth Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Volunteer Growth</h3>
                    <p className="text-gray-600 text-sm mt-1">Monthly volunteer registration trends</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {timeRange}
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  {stats.monthlyBreakdown.length > 0 ? (
                    <div className="flex h-full items-end gap-2">
                      {stats.monthlyBreakdown.map((item, index) => {
                        const maxVolunteers = Math.max(...stats.monthlyBreakdown.map(d => d.volunteers), 1);
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 group-hover:scale-105" 
                              style={{ height: `${Math.max((item.volunteers / maxVolunteers) * 100, 5)}%` }}
                            ></div>
                            <div className="text-xs mt-2 text-gray-600 font-medium">{item.month}</div>
                            <div className="text-xs text-gray-500">{item.volunteers}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <FiUsers className="mx-auto text-4xl mb-2 opacity-50" />
                        <p>No user data available</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">15.2% increase from last {timeRange}</span>
                  </div>
                  <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Program Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Program Distribution</h3>
                  <p className="text-gray-600 text-sm mt-1">Resource allocation by program</p>
                </div>
                
                <div className="space-y-4">
                  {stats.programBreakdown.length > 0 ? (
                    stats.programBreakdown.map((item, index) => {
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                      const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50'];
                      return (
                        <div key={index} className="p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{item.program}</span>
                            <span className="text-sm font-bold text-gray-800">{item.percentage}%</span>
                          </div>
                          <div className={`w-full ${bgColors[index % bgColors.length]} rounded-full h-2`}>
                            <div 
                              className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <div className="text-center">
                        <FiActivity className="mx-auto text-4xl mb-2 opacity-50" />
                        <p>No programs available</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <Link to="/admin/programs" className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors text-center block">
                    Manage Programs →
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Users */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl"
          >
            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Recent Users</h3>
                    <p className="text-gray-600 text-sm mt-1">New registrations</p>
                  </div>
                  <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <FiUsers className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' ? 'bg-red-50 text-red-600' :
                            user.role === 'Volunteer' ? 'bg-blue-50 text-blue-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                            {user.role}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{new Date(user.joined).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <div className="text-center">
                        <FiUsers className="mx-auto text-4xl mb-2 opacity-50" />
                        <p>No recent users</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}