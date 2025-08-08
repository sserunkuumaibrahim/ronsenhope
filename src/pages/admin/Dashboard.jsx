import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiActivity, FiCalendar, FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown, FiEye } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    // Simulate API fetch
    const fetchDashboardData = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample dashboard data
      const statsData = {
        totalDonations: 45750,
        donationsChange: 12.5,
        totalDonors: 1250,
        donorsChange: 8.3,
        activePrograms: 12,
        programsChange: 20,
        upcomingEvents: 5,
        eventsChange: -10,
        monthlyBreakdown: [
          { month: 'Jan', donations: 3200 },
          { month: 'Feb', donations: 3800 },
          { month: 'Mar', donations: 2900 },
          { month: 'Apr', donations: 3600 },
          { month: 'May', donations: 4100 },
          { month: 'Jun', donations: 4500 },
          { month: 'Jul', donations: 5200 },
          { month: 'Aug', donations: 4800 },
          { month: 'Sep', donations: 5500 },
          { month: 'Oct', donations: 4900 },
          { month: 'Nov', donations: 5100 },
          { month: 'Dec', donations: 6200 }
        ],
        programBreakdown: [
          { program: 'Clean Water', percentage: 35 },
          { program: 'Education', percentage: 25 },
          { program: 'Healthcare', percentage: 20 },
          { program: 'Community Development', percentage: 15 },
          { program: 'Emergency Relief', percentage: 5 }
        ]
      };
      
      // Sample recent donations
      const recentDonationsData = [
        {
          id: 1,
          donor: 'John Smith',
          email: 'john.smith@example.com',
          amount: 100,
          program: 'Clean Water Initiative',
          date: '2023-06-15',
          status: 'completed'
        },
        {
          id: 2,
          donor: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          amount: 50,
          program: 'Education for All',
          date: '2023-06-14',
          status: 'completed'
        },
        {
          id: 3,
          donor: 'Michael Brown',
          email: 'm.brown@example.com',
          amount: 200,
          program: 'Healthcare Access',
          date: '2023-06-13',
          status: 'completed'
        },
        {
          id: 4,
          donor: 'Emily Davis',
          email: 'emily.d@example.com',
          amount: 75,
          program: 'Community Development',
          date: '2023-06-12',
          status: 'completed'
        },
        {
          id: 5,
          donor: 'David Wilson',
          email: 'd.wilson@example.com',
          amount: 150,
          program: 'Emergency Relief',
          date: '2023-06-11',
          status: 'completed'
        }
      ];
      
      // Sample recent users
      const recentUsersData = [
        {
          id: 1,
          name: 'Alice Cooper',
          email: 'alice.cooper@example.com',
          joined: '2023-06-15',
          role: 'user'
        },
        {
          id: 2,
          name: 'Bob Johnson',
          email: 'bob.j@example.com',
          joined: '2023-06-14',
          role: 'user'
        },
        {
          id: 3,
          name: 'Carol Smith',
          email: 'carol.smith@example.com',
          joined: '2023-06-13',
          role: 'volunteer'
        },
        {
          id: 4,
          name: 'Dave Brown',
          email: 'dave.b@example.com',
          joined: '2023-06-12',
          role: 'user'
        },
        {
          id: 5,
          name: 'Eve Wilson',
          email: 'eve.w@example.com',
          joined: '2023-06-11',
          role: 'donor'
        }
      ];
      
      setStats(statsData);
      setRecentDonations(recentDonationsData);
      setRecentUsers(recentUsersData);
      setLoading(false);
    };

    fetchDashboardData();
  }, [timeRange]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard - Charity NGO</title>
        <meta name="description" content="Admin dashboard for Charity NGO" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Dashboard Overview
          </motion.h1>
          
          <select 
            className="select select-bordered select-sm" 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Total Donations</p>
                    <h3 className="text-2xl font-bold">${stats.totalDonations.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-primary/10 text-primary">
                    <FiDollarSign size={24} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  {stats.donationsChange >= 0 ? (
                    <div className="flex items-center text-success">
                      <FiArrowUp size={16} />
                      <span className="ml-1">{stats.donationsChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-error">
                      <FiArrowDown size={16} />
                      <span className="ml-1">{Math.abs(stats.donationsChange)}%</span>
                    </div>
                  )}
                  <span className="text-xs text-base-content/70 ml-2">vs previous {timeRange}</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Total Donors</p>
                    <h3 className="text-2xl font-bold">{stats.totalDonors.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-secondary/10 text-secondary">
                    <FiUsers size={24} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  {stats.donorsChange >= 0 ? (
                    <div className="flex items-center text-success">
                      <FiArrowUp size={16} />
                      <span className="ml-1">{stats.donorsChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-error">
                      <FiArrowDown size={16} />
                      <span className="ml-1">{Math.abs(stats.donorsChange)}%</span>
                    </div>
                  )}
                  <span className="text-xs text-base-content/70 ml-2">vs previous {timeRange}</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Active Programs</p>
                    <h3 className="text-2xl font-bold">{stats.activePrograms}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-accent/10 text-accent">
                    <FiActivity size={24} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  {stats.programsChange >= 0 ? (
                    <div className="flex items-center text-success">
                      <FiArrowUp size={16} />
                      <span className="ml-1">{stats.programsChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-error">
                      <FiArrowDown size={16} />
                      <span className="ml-1">{Math.abs(stats.programsChange)}%</span>
                    </div>
                  )}
                  <span className="text-xs text-base-content/70 ml-2">vs previous {timeRange}</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">Upcoming Events</p>
                    <h3 className="text-2xl font-bold">{stats.upcomingEvents}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-info/10 text-info">
                    <FiCalendar size={24} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  {stats.eventsChange >= 0 ? (
                    <div className="flex items-center text-success">
                      <FiArrowUp size={16} />
                      <span className="ml-1">{stats.eventsChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-error">
                      <FiArrowDown size={16} />
                      <span className="ml-1">{Math.abs(stats.eventsChange)}%</span>
                    </div>
                  )}
                  <span className="text-xs text-base-content/70 ml-2">vs previous {timeRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Donations Chart */}
            <div className="card bg-base-100 shadow-lg lg:col-span-2">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title">Donations Overview</h3>
                  <div className="badge badge-primary">{timeRange}</div>
                </div>
                
                <div className="h-64 w-full">
                  {/* In a real app, this would be a chart component */}
                  <div className="flex h-full items-end">
                    {stats.monthlyBreakdown.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary/80 rounded-t-sm" 
                          style={{ height: `${(item.donations / 6500) * 100}%` }}
                        ></div>
                        <div className="text-xs mt-2">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <FiTrendingUp className="text-success mr-1" />
                    <span className="text-sm">12.5% increase from last {timeRange}</span>
                  </div>
                  <Link to="/admin/donations" className="btn btn-sm btn-ghost">View Details</Link>
                </div>
              </div>
            </div>

            {/* Program Distribution */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title mb-4">Program Distribution</h3>
                
                <div className="space-y-4">
                  {stats.programBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span>{item.program}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link to="/admin/programs" className="btn btn-sm btn-ghost w-full">Manage Programs</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Donations */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title">Recent Donations</h3>
                  <Link to="/admin/donations" className="btn btn-sm btn-ghost">View All</Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Amount</th>
                        <th>Program</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td>
                            <div className="font-medium">{donation.donor}</div>
                            <div className="text-xs text-base-content/70">{donation.email}</div>
                          </td>
                          <td>${donation.amount}</td>
                          <td>{donation.program}</td>
                          <td>{new Date(donation.date).toLocaleDateString()}</td>
                          <td>
                            <Link to={`/admin/donations/${donation.id}`} className="btn btn-xs btn-ghost">
                              <FiEye size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title">Recent Users</h3>
                  <Link to="/admin/users" className="btn btn-sm btn-ghost">View All</Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{new Date(user.joined).toLocaleDateString()}</td>
                          <td>
                            <span className="badge badge-outline">{user.role}</span>
                          </td>
                          <td>
                            <Link to={`/admin/users/${user.id}`} className="btn btn-xs btn-ghost">
                              <FiEye size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}