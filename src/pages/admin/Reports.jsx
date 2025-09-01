import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiUsers, FiActivity, FiPieChart, FiBarChart2, FiTrendingUp, FiMessageCircle, FiBookOpen, FiCamera, FiGlobe, FiEye, FiHeart, FiShare2 } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [reportType, setReportType] = useState('overview');
  const [reportData, setReportData] = useState(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchReportData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample report data based on selected report type and time range
      let data;
      
      if (reportType === 'overview') {
        data = {
          summary: {
            totalUsers: 2847,
            activePrograms: 12,
            forumTopics: 156,
            storiesPublished: 89,
            galleryPhotos: 234,
            totalEngagement: 15420,
            growthRate: 18.5
          },
          userGrowth: [
            { month: 'Jan', users: 1850, active: 1420 },
            { month: 'Feb', users: 1920, active: 1480 },
            { month: 'Mar', users: 2050, active: 1620 },
            { month: 'Apr', users: 2180, active: 1750 },
            { month: 'May', users: 2320, active: 1890 },
            { month: 'Jun', users: 2450, active: 2010 },
            { month: 'Jul', users: 2580, active: 2140 },
            { month: 'Aug', users: 2690, active: 2220 },
            { month: 'Sep', users: 2750, active: 2280 },
            { month: 'Oct', users: 2820, active: 2340 },
            { month: 'Nov', users: 2847, active: 2380 },
            { month: 'Dec', users: 2847, active: 2380 }
          ],
          contentMetrics: [
            { type: 'Programs', count: 12, growth: 15.2 },
            { type: 'Stories', count: 89, growth: 22.8 },
            { type: 'Forum Topics', count: 156, growth: 31.5 },
            { type: 'Gallery Photos', count: 234, growth: 18.9 }
          ]
        };
      } else if (reportType === 'users') {
        data = {
          summary: {
            totalUsers: 2847,
            newUsers: 127,
            activeUsers: 2380,
            volunteerUsers: 456,
            retentionRate: 83.6,
            engagementRate: 67.2
          },
          usersByRole: [
            { role: 'Volunteers', count: 456, percentage: 16.0 },
            { role: 'Supporters', count: 1823, percentage: 64.0 },
            { role: 'Beneficiaries', count: 568, percentage: 20.0 }
          ],
          usersByLocation: [
            { country: 'United States', count: 1138, percentage: 40.0 },
            { country: 'Kenya', count: 568, percentage: 20.0 },
            { country: 'Guatemala', count: 427, percentage: 15.0 },
            { country: 'Honduras', count: 284, percentage: 10.0 },
            { country: 'Other', count: 430, percentage: 15.0 }
          ],
          monthlyActivity: [
            { month: 'Jan', logins: 8420, posts: 234, interactions: 1567 },
            { month: 'Feb', logins: 8890, posts: 267, interactions: 1689 },
            { month: 'Mar', logins: 9340, posts: 298, interactions: 1823 },
            { month: 'Apr', logins: 9780, posts: 312, interactions: 1945 },
            { month: 'May', logins: 10230, posts: 345, interactions: 2134 },
            { month: 'Jun', logins: 10680, posts: 378, interactions: 2298 },
            { month: 'Jul', logins: 11120, posts: 389, interactions: 2456 },
            { month: 'Aug', logins: 11450, posts: 401, interactions: 2567 },
            { month: 'Sep', logins: 11780, posts: 423, interactions: 2689 },
            { month: 'Oct', logins: 12100, posts: 445, interactions: 2834 },
            { month: 'Nov', logins: 12380, posts: 467, interactions: 2945 },
            { month: 'Dec', logins: 12380, posts: 467, interactions: 2945 }
          ]
        };
      } else if (reportType === 'programs') {
        data = {
          summary: {
            totalPrograms: 12,
            activePrograms: 10,
            completedPrograms: 8,
            totalBeneficiaries: 15420,
            averageBeneficiaries: 1285,
            successRate: 92.3
          },
          programsByCategory: [
            { category: 'Education', count: 4, beneficiaries: 6200 },
            { category: 'Healthcare', count: 3, beneficiaries: 4100 },
            { category: 'Water & Sanitation', count: 2, beneficiaries: 2800 },
            { category: 'Community Development', count: 2, beneficiaries: 1820 },
            { category: 'Emergency Relief', count: 1, beneficiaries: 500 }
          ],
          programsByLocation: [
            { location: 'Kenya', programs: 4, beneficiaries: 5680 },
            { location: 'Guatemala', programs: 3, beneficiaries: 4200 },
            { location: 'Honduras', programs: 3, beneficiaries: 3840 },
            { location: 'Philippines', programs: 2, beneficiaries: 1700 }
          ],
          monthlyProgress: [
            { month: 'Jan', beneficiaries: 12800, programs: 8 },
            { month: 'Feb', beneficiaries: 13200, programs: 9 },
            { month: 'Mar', beneficiaries: 13600, programs: 10 },
            { month: 'Apr', beneficiaries: 14000, programs: 10 },
            { month: 'May', beneficiaries: 14400, programs: 11 },
            { month: 'Jun', beneficiaries: 14800, programs: 11 },
            { month: 'Jul', beneficiaries: 15000, programs: 12 },
            { month: 'Aug', beneficiaries: 15200, programs: 12 },
            { month: 'Sep', beneficiaries: 15300, programs: 12 },
            { month: 'Oct', beneficiaries: 15400, programs: 12 },
            { month: 'Nov', beneficiaries: 15420, programs: 12 },
            { month: 'Dec', beneficiaries: 15420, programs: 12 }
          ]
        };
      } else if (reportType === 'engagement') {
        data = {
          summary: {
            totalEngagement: 15420,
            forumPosts: 1234,
            storyViews: 8950,
            galleryViews: 3420,
            socialShares: 1816,
            averageEngagement: 89.2
          },
          engagementByType: [
            { type: 'Story Views', count: 8950, percentage: 58.1 },
            { type: 'Gallery Views', count: 3420, percentage: 22.2 },
            { type: 'Social Shares', count: 1816, percentage: 11.8 },
            { type: 'Forum Posts', count: 1234, percentage: 8.0 }
          ],
          monthlyEngagement: [
            { month: 'Jan', views: 1120, shares: 89, posts: 67 },
            { month: 'Feb', views: 1245, shares: 98, posts: 78 },
            { month: 'Mar', views: 1380, shares: 112, posts: 89 },
            { month: 'Apr', views: 1456, shares: 123, posts: 95 },
            { month: 'May', views: 1567, shares: 134, posts: 108 },
            { month: 'Jun', views: 1689, shares: 145, posts: 119 },
            { month: 'Jul', views: 1798, shares: 156, posts: 127 },
            { month: 'Aug', views: 1890, shares: 167, posts: 134 },
            { month: 'Sep', views: 1945, shares: 178, posts: 142 },
            { month: 'Oct', views: 2034, shares: 189, posts: 151 },
            { month: 'Nov', views: 2123, shares: 198, posts: 159 },
            { month: 'Dec', views: 2123, shares: 198, posts: 159 }
          ],
          topContent: [
            { title: 'Clean Water Success in Kenya', type: 'Story', views: 1234, shares: 89 },
            { title: 'Education Program Graduation', type: 'Gallery', views: 987, shares: 67 },
            { title: 'Healthcare Mobile Clinic Updates', type: 'Forum', views: 756, shares: 45 },
            { title: 'Community Development Progress', type: 'Story', views: 689, shares: 34 },
            { title: 'Volunteer Opportunities Discussion', type: 'Forum', views: 567, shares: 23 }
          ]
        };
      } else if (reportType === 'moderation') {
        data = {
          summary: {
            totalReports: 23,
            pendingReports: 8,
            resolvedReports: 15,
            topicReports: 12,
            replyReports: 11,
            averageResolutionTime: 2.4
          },
          reportsByStatus: [
            { status: 'Pending', count: 8, percentage: 34.8 },
            { status: 'Resolved', count: 15, percentage: 65.2 }
          ],
          reportsByType: [
            { type: 'Topic Reports', count: 12, percentage: 52.2 },
            { type: 'Reply Reports', count: 11, percentage: 47.8 }
          ],
          recentReports: [
            {
              id: 'RPT001',
              type: 'Topic',
              title: 'Inappropriate language in discussion',
              reporter: 'John Doe',
              reported: '2 hours ago',
              status: 'pending',
              reason: 'Inappropriate content'
            },
            {
              id: 'RPT002',
              type: 'Reply',
              title: 'Spam content in reply',
              reporter: 'Jane Smith',
              reported: '4 hours ago',
              status: 'pending',
              reason: 'Spam'
            },
            {
              id: 'RPT003',
              type: 'Topic',
              title: 'Off-topic discussion',
              reporter: 'Mike Johnson',
              reported: '1 day ago',
              status: 'resolved',
              reason: 'Off-topic'
            },
            {
              id: 'RPT004',
              type: 'Reply',
              title: 'Harassment in comments',
              reporter: 'Sarah Wilson',
              reported: '2 days ago',
              status: 'resolved',
              reason: 'Harassment'
            },
            {
              id: 'RPT005',
              type: 'Topic',
              title: 'Misleading information',
              reporter: 'David Brown',
              reported: '3 days ago',
              status: 'pending',
              reason: 'Misinformation'
            }
          ]
        };
      }
      
      setReportData(data);
      setLoading(false);
    };

    fetchReportData();
  }, [timeRange, reportType]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportReport = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert('Report export functionality would be implemented here');
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
        <title>Reports & Analytics - Admin Dashboard</title>
        <meta name="description" content="View comprehensive reports and analytics for your organization." />
      </Helmet>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl mb-8">
        <div className="absolute inset-0 bg-[url('/src/assets/dot-pattern.svg')] opacity-20"></div>
        
        <div className="relative p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiBarChart2 className="w-4 h-4" />
              Reports & Analytics
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              Data Insights
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Track your organization's performance with comprehensive analytics and detailed reports.
            </p>

            {/* Export Button */}
            <button
              onClick={exportReport}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiDownload className="w-5 h-5" />
              Export Report
            </button>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Report Type Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Overview</option>
                <option value="users">User Analytics</option>
                <option value="programs">Program Performance</option>
                <option value="engagement">Content Engagement</option>
                <option value="moderation">Content Moderation</option>
              </select>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Content */}
      {reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportType === 'overview' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+{reportData.summary.growthRate}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.totalUsers)}</h3>
                  <p className="text-gray-600 text-sm">Total Users</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiGlobe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.activePrograms}</h3>
                  <p className="text-gray-600 text-sm">Active Programs</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+31.5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.forumTopics}</h3>
                  <p className="text-gray-600 text-sm">Forum Topics</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <FiActivity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+22.8%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.totalEngagement)}</h3>
                  <p className="text-gray-600 text-sm">Total Engagement</p>
                </div>
              </>
            )}
            
            {reportType === 'users' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+{reportData.summary.newUsers}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.totalUsers)}</h3>
                  <p className="text-gray-600 text-sm">Total Users</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiActivity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{reportData.summary.retentionRate}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.activeUsers)}</h3>
                  <p className="text-gray-600 text-sm">Active Users</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FiHeart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Volunteers</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.volunteerUsers}</h3>
                  <p className="text-gray-600 text-sm">Volunteer Users</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{reportData.summary.engagementRate}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.engagementRate}%</h3>
                  <p className="text-gray-600 text-sm">Engagement Rate</p>
                </div>
              </>
            )}
            
            {reportType === 'programs' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiGlobe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{reportData.summary.activePrograms} Active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.totalPrograms}</h3>
                  <p className="text-gray-600 text-sm">Total Programs</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Avg: {formatNumber(reportData.summary.averageBeneficiaries)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.totalBeneficiaries)}</h3>
                  <p className="text-gray-600 text-sm">Total Beneficiaries</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{reportData.summary.successRate}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.successRate}%</h3>
                  <p className="text-gray-600 text-sm">Success Rate</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <FiActivity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">Completed</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.completedPrograms}</h3>
                  <p className="text-gray-600 text-sm">Completed Programs</p>
                </div>
              </>
            )}
            
            {reportType === 'engagement' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiEye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+15.2%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.storyViews)}</h3>
                  <p className="text-gray-600 text-sm">Story Views</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCamera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+18.9%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.galleryViews)}</h3>
                  <p className="text-gray-600 text-sm">Gallery Views</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FiShare2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+12.3%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.socialShares)}</h3>
                  <p className="text-gray-600 text-sm">Social Shares</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <FiMessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+31.5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(reportData.summary.forumPosts)}</h3>
                  <p className="text-gray-600 text-sm">Forum Posts</p>
                </div>
              </>
            )}
            
            {reportType === 'moderation' && (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <FiActivity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{reportData.summary.pendingReports} Pending</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.totalReports}</h3>
                  <p className="text-gray-600 text-sm">Total Reports</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-orange-600 text-sm font-medium">Pending</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.pendingReports}</h3>
                  <p className="text-gray-600 text-sm">Pending Review</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">Resolved</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.resolvedReports}</h3>
                  <p className="text-gray-600 text-sm">Resolved Reports</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiBarChart2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{reportData.summary.averageResolutionTime}h avg</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{reportData.summary.averageResolutionTime}h</h3>
                  <p className="text-gray-600 text-sm">Avg Resolution Time</p>
                </div>
              </>
            )}
          </div>

          {/* Charts and Detailed Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {reportType === 'overview' && 'User Growth Trend'}
                  {reportType === 'users' && 'Monthly User Activity'}
                  {reportType === 'programs' && 'Program Progress'}
                  {reportType === 'engagement' && 'Monthly Engagement'}
                </h3>
                <FiBarChart2 className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Simplified chart representation */}
              <div className="space-y-4">
                {reportType === 'overview' && reportData.userGrowth.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{formatNumber(item.users)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{formatNumber(item.active)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reportType === 'users' && reportData.monthlyActivity.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{formatNumber(item.logins)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">{item.posts}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reportType === 'programs' && reportData.monthlyProgress.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{formatNumber(item.beneficiaries)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{item.programs}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {reportType === 'engagement' && reportData.monthlyEngagement.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">{formatNumber(item.views)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium">{item.shares}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {reportType === 'overview' && 'Content Distribution'}
                  {reportType === 'users' && 'Users by Role'}
                  {reportType === 'programs' && 'Programs by Category'}
                  {reportType === 'engagement' && 'Top Performing Content'}
                </h3>
                <FiPieChart className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {reportType === 'overview' && reportData.contentMetrics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.count}</span>
                      <span className="text-xs text-green-600">+{item.growth}%</span>
                    </div>
                  </div>
                ))}
                
                {reportType === 'users' && reportData.usersByRole.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatNumber(item.count)}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
                
                {reportType === 'programs' && reportData.programsByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.count} programs</span>
                      <span className="text-xs text-gray-500">{formatNumber(item.beneficiaries)} beneficiaries</span>
                    </div>
                  </div>
                ))}
                
                {reportType === 'engagement' && reportData.topContent.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.type}</div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <div className="text-sm font-medium">{formatNumber(item.views)}</div>
                      <div className="text-xs text-gray-500">{item.shares} shares</div>
                    </div>
                  </div>
                ))}
                
                {reportType === 'moderation' && reportData.recentReports.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.type} • {item.reason}</div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Data Tables */}
          {reportType === 'users' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Users by Location</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Country</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Users</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.usersByLocation.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{item.country}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatNumber(item.count)}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'programs' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Programs by Location</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Programs</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.programsByLocation.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{item.location}</td>
                        <td className="py-3 px-4 text-right font-medium">{item.programs}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{formatNumber(item.beneficiaries)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'moderation' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Report ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Content</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reporter</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.recentReports.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900 font-mono text-sm">{item.id}</td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900 font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.type}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.reporter}</td>
                        <td className="py-3 px-4 text-gray-600">{item.reason}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{item.reported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AdminLayout>
  );
}