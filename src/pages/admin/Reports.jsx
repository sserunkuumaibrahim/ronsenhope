import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiDollarSign, FiUsers, FiActivity, FiPieChart, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [reportType, setReportType] = useState('donations');
  const [reportData, setReportData] = useState(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchReportData = async () => {
      setLoading(true);
      // In a real app, this would be an API call with timeRange and reportType as parameters
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample report data based on selected report type and time range
      let data;
      
      if (reportType === 'donations') {
        data = {
          summary: {
            totalAmount: 125750,
            averageAmount: 83.83,
            totalDonations: 1500,
            recurringDonations: 450,
            oneTimeDonations: 1050,
            growthRate: 12.5
          },
          byProgram: [
            { name: 'Education Fund', amount: 35000, percentage: 27.8 },
            { name: 'Clean Water Initiative', amount: 28500, percentage: 22.7 },
            { name: 'Emergency Relief', amount: 25000, percentage: 19.9 },
            { name: 'Community Development', amount: 20250, percentage: 16.1 },
            { name: 'Healthcare Access', amount: 17000, percentage: 13.5 }
          ],
          byMonth: [
            { month: 'Jan', amount: 8500 },
            { month: 'Feb', amount: 9200 },
            { month: 'Mar', amount: 10500 },
            { month: 'Apr', amount: 9800 },
            { month: 'May', amount: 11200 },
            { month: 'Jun', amount: 12500 },
            { month: 'Jul', amount: 11800 },
            { month: 'Aug', amount: 10900 },
            { month: 'Sep', amount: 12000 },
            { month: 'Oct', amount: 13500 },
            { month: 'Nov', amount: 15000 },
            { month: 'Dec', amount: 850 }
          ],
          byPaymentMethod: [
            { method: 'Credit Card', amount: 75450, percentage: 60 },
            { method: 'PayPal', amount: 25150, percentage: 20 },
            { method: 'Bank Transfer', amount: 18862.5, percentage: 15 },
            { method: 'Other', amount: 6287.5, percentage: 5 }
          ]
        };
      } else if (reportType === 'users') {
        data = {
          summary: {
            totalUsers: 3500,
            activeUsers: 2800,
            newUsers: 350,
            growthRate: 10,
            volunteers: 450,
            donors: 1200
          },
          byRole: [
            { role: 'Donors', count: 1200, percentage: 34.3 },
            { role: 'Regular Users', count: 1500, percentage: 42.9 },
            { role: 'Volunteers', count: 450, percentage: 12.9 },
            { role: 'Staff', count: 300, percentage: 8.6 },
            { role: 'Admins', count: 50, percentage: 1.4 }
          ],
          byMonth: [
            { month: 'Jan', count: 200 },
            { month: 'Feb', count: 220 },
            { month: 'Mar', count: 250 },
            { month: 'Apr', count: 230 },
            { month: 'May', count: 270 },
            { month: 'Jun', count: 300 },
            { month: 'Jul', count: 280 },
            { month: 'Aug', count: 260 },
            { month: 'Sep', count: 290 },
            { month: 'Oct', count: 320 },
            { month: 'Nov', count: 350 },
            { month: 'Dec', count: 30 }
          ],
          byActivity: [
            { activity: 'Very Active', count: 1050, percentage: 30 },
            { activity: 'Active', count: 1750, percentage: 50 },
            { activity: 'Occasional', count: 525, percentage: 15 },
            { activity: 'Inactive', count: 175, percentage: 5 }
          ]
        };
      } else if (reportType === 'programs') {
        data = {
          summary: {
            totalPrograms: 15,
            activePrograms: 10,
            plannedPrograms: 3,
            completedPrograms: 2,
            totalBudget: 1000000,
            totalRaised: 650000
          },
          byCategory: [
            { category: 'Education', count: 4, percentage: 26.7 },
            { category: 'Health', count: 3, percentage: 20 },
            { category: 'Water & Sanitation', count: 2, percentage: 13.3 },
            { category: 'Emergency', count: 2, percentage: 13.3 },
            { category: 'Development', count: 2, percentage: 13.3 },
            { category: 'Other', count: 2, percentage: 13.3 }
          ],
          byStatus: [
            { status: 'Active', count: 10, percentage: 66.7 },
            { status: 'Planned', count: 3, percentage: 20 },
            { status: 'Completed', count: 2, percentage: 13.3 }
          ],
          byFunding: [
            { program: 'Clean Water Initiative', budget: 50000, raised: 32500 },
            { program: 'Education for All', budget: 75000, raised: 45000 },
            { program: 'Emergency Relief Fund', budget: 100000, raised: 85000 },
            { program: 'Community Development', budget: 120000, raised: 78000 },
            { program: 'Healthcare Access', budget: 90000, raised: 42000 }
          ]
        };
      } else if (reportType === 'impact') {
        data = {
          summary: {
            totalBeneficiaries: 75000,
            communitiesServed: 120,
            countriesReached: 15,
            volunteersEngaged: 450,
            projectsCompleted: 25
          },
          byProgram: [
            { program: 'Clean Water Initiative', beneficiaries: 15000, percentage: 20 },
            { program: 'Education for All', beneficiaries: 12000, percentage: 16 },
            { program: 'Emergency Relief Fund', beneficiaries: 25000, percentage: 33.3 },
            { program: 'Community Development', beneficiaries: 18000, percentage: 24 },
            { program: 'Healthcare Access', beneficiaries: 5000, percentage: 6.7 }
          ],
          byRegion: [
            { region: 'Africa', beneficiaries: 30000, percentage: 40 },
            { region: 'Asia', beneficiaries: 22500, percentage: 30 },
            { region: 'South America', beneficiaries: 15000, percentage: 20 },
            { region: 'Other', beneficiaries: 7500, percentage: 10 }
          ],
          byYear: [
            { year: '2018', beneficiaries: 10000 },
            { year: '2019', beneficiaries: 12500 },
            { year: '2020', beneficiaries: 15000 },
            { year: '2021', beneficiaries: 17500 },
            { year: '2022', beneficiaries: 20000 }
          ]
        };
      }
      
      setReportData(data);
      setLoading(false);
    };

    fetchReportData();
  }, [timeRange, reportType]);

  const exportReport = () => {
    // In a real app, this would generate a PDF or CSV file for download
    alert(`In a real application, this would download a ${reportType} report for the selected time range.`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading report data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Reports & Analytics - Charity NGO Admin</title>
        <meta name="description" content="Admin panel for viewing reports and analytics" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-outline btn-sm gap-1"
                onClick={exportReport}
              >
                <FiDownload size={16} /> Export Report
              </button>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`btn btn-sm ${reportType === 'donations' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setReportType('donations')}
                  >
                    <FiDollarSign size={16} /> Donations
                  </button>
                  <button 
                    className={`btn btn-sm ${reportType === 'users' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setReportType('users')}
                  >
                    <FiUsers size={16} /> Users
                  </button>
                  <button 
                    className={`btn btn-sm ${reportType === 'programs' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setReportType('programs')}
                  >
                    <FiActivity size={16} /> Programs
                  </button>
                  <button 
                    className={`btn btn-sm ${reportType === 'impact' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setReportType('impact')}
                  >
                    <FiTrendingUp size={16} /> Impact
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="select select-bordered select-sm" 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {reportType === 'donations' && (
                <>
                  <SummaryCard 
                    icon={<FiDollarSign className="text-primary" size={24} />}
                    title="Total Donations"
                    value={`$${reportData.summary.totalAmount.toLocaleString()}`}
                    trend={`${reportData.summary.growthRate > 0 ? '+' : ''}${reportData.summary.growthRate}%`}
                    trendUp={reportData.summary.growthRate > 0}
                  />
                  <SummaryCard 
                    icon={<FiDollarSign className="text-secondary" size={24} />}
                    title="Average Donation"
                    value={`$${reportData.summary.averageAmount.toFixed(2)}`}
                  />
                  <SummaryCard 
                    icon={<FiActivity className="text-accent" size={24} />}
                    title="Total Transactions"
                    value={reportData.summary.totalDonations.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiCalendar className="text-success" size={24} />}
                    title="Recurring Donations"
                    value={reportData.summary.recurringDonations.toLocaleString()}
                    subtitle={`${Math.round((reportData.summary.recurringDonations / reportData.summary.totalDonations) * 100)}% of total`}
                  />
                </>
              )}
              
              {reportType === 'users' && (
                <>
                  <SummaryCard 
                    icon={<FiUsers className="text-primary" size={24} />}
                    title="Total Users"
                    value={reportData.summary.totalUsers.toLocaleString()}
                    trend={`${reportData.summary.growthRate > 0 ? '+' : ''}${reportData.summary.growthRate}%`}
                    trendUp={reportData.summary.growthRate > 0}
                  />
                  <SummaryCard 
                    icon={<FiUsers className="text-secondary" size={24} />}
                    title="Active Users"
                    value={reportData.summary.activeUsers.toLocaleString()}
                    subtitle={`${Math.round((reportData.summary.activeUsers / reportData.summary.totalUsers) * 100)}% of total`}
                  />
                  <SummaryCard 
                    icon={<FiUsers className="text-accent" size={24} />}
                    title="New Users"
                    value={reportData.summary.newUsers.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiUsers className="text-success" size={24} />}
                    title="Donors"
                    value={reportData.summary.donors.toLocaleString()}
                    subtitle={`${Math.round((reportData.summary.donors / reportData.summary.totalUsers) * 100)}% of total`}
                  />
                </>
              )}
              
              {reportType === 'programs' && (
                <>
                  <SummaryCard 
                    icon={<FiActivity className="text-primary" size={24} />}
                    title="Total Programs"
                    value={reportData.summary.totalPrograms.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiActivity className="text-secondary" size={24} />}
                    title="Active Programs"
                    value={reportData.summary.activePrograms.toLocaleString()}
                    subtitle={`${Math.round((reportData.summary.activePrograms / reportData.summary.totalPrograms) * 100)}% of total`}
                  />
                  <SummaryCard 
                    icon={<FiDollarSign className="text-accent" size={24} />}
                    title="Total Budget"
                    value={`$${reportData.summary.totalBudget.toLocaleString()}`}
                  />
                  <SummaryCard 
                    icon={<FiDollarSign className="text-success" size={24} />}
                    title="Total Raised"
                    value={`$${reportData.summary.totalRaised.toLocaleString()}`}
                    subtitle={`${Math.round((reportData.summary.totalRaised / reportData.summary.totalBudget) * 100)}% of budget`}
                  />
                </>
              )}
              
              {reportType === 'impact' && (
                <>
                  <SummaryCard 
                    icon={<FiUsers className="text-primary" size={24} />}
                    title="Total Beneficiaries"
                    value={reportData.summary.totalBeneficiaries.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiActivity className="text-secondary" size={24} />}
                    title="Communities Served"
                    value={reportData.summary.communitiesServed.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiActivity className="text-accent" size={24} />}
                    title="Countries Reached"
                    value={reportData.summary.countriesReached.toLocaleString()}
                  />
                  <SummaryCard 
                    icon={<FiUsers className="text-success" size={24} />}
                    title="Volunteers Engaged"
                    value={reportData.summary.volunteersEngaged.toLocaleString()}
                  />
                </>
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {reportType === 'donations' && (
                  <>
                    <ChartCard 
                      title="Donations by Program"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byProgram.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.name}</span>
                              <span className="font-medium">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                    
                    <ChartCard 
                      title="Donations by Payment Method"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byPaymentMethod.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.method}</span>
                              <span className="font-medium">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-secondary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                  </>
                )}
                
                {reportType === 'users' && (
                  <>
                    <ChartCard 
                      title="Users by Role"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byRole.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.role}</span>
                              <span className="font-medium">{item.count.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                    
                    <ChartCard 
                      title="Users by Activity Level"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byActivity.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.activity}</span>
                              <span className="font-medium">{item.count.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-secondary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                  </>
                )}
                
                {reportType === 'programs' && (
                  <>
                    <ChartCard 
                      title="Programs by Category"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byCategory.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.category}</span>
                              <span className="font-medium">{item.count} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                    
                    <ChartCard 
                      title="Programs by Status"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byStatus.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.status}</span>
                              <span className="font-medium">{item.count} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-secondary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                  </>
                )}
                
                {reportType === 'impact' && (
                  <>
                    <ChartCard 
                      title="Impact by Program"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byProgram.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.program}</span>
                              <span className="font-medium">{item.beneficiaries.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                    
                    <ChartCard 
                      title="Impact by Region"
                      icon={<FiPieChart size={18} />}
                    >
                      <div className="space-y-3 mt-4">
                        {reportData.byRegion.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.region}</span>
                              <span className="font-medium">{item.beneficiaries.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className="bg-secondary h-2.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                  </>
                )}
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {reportType === 'donations' && (
                  <ChartCard 
                    title="Monthly Donations"
                    icon={<FiBarChart2 size={18} />}
                  >
                    <div className="h-64 mt-4">
                      <div className="flex h-full items-end">
                        {reportData.byMonth.map((item, index) => {
                          const maxAmount = Math.max(...reportData.byMonth.map(m => m.amount));
                          const height = (item.amount / maxAmount) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-4/5 bg-primary rounded-t" 
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs mt-1">{item.month}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ChartCard>
                )}
                
                {reportType === 'users' && (
                  <ChartCard 
                    title="Monthly New Users"
                    icon={<FiBarChart2 size={18} />}
                  >
                    <div className="h-64 mt-4">
                      <div className="flex h-full items-end">
                        {reportData.byMonth.map((item, index) => {
                          const maxCount = Math.max(...reportData.byMonth.map(m => m.count));
                          const height = (item.count / maxCount) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-4/5 bg-primary rounded-t" 
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs mt-1">{item.month}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ChartCard>
                )}
                
                {reportType === 'programs' && (
                  <ChartCard 
                    title="Program Funding Progress"
                    icon={<FiBarChart2 size={18} />}
                  >
                    <div className="space-y-4 mt-4">
                      {reportData.byFunding.map((item, index) => {
                        const percentage = Math.round((item.raised / item.budget) * 100);
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span>{item.program}</span>
                              <span className="font-medium">${item.raised.toLocaleString()} of ${item.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Funding Progress</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getProgressColor(percentage)}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ChartCard>
                )}
                
                {reportType === 'impact' && (
                  <ChartCard 
                    title="Impact Growth by Year"
                    icon={<FiBarChart2 size={18} />}
                  >
                    <div className="h-64 mt-4">
                      <div className="flex h-full items-end">
                        {reportData.byYear.map((item, index) => {
                          const maxBeneficiaries = Math.max(...reportData.byYear.map(y => y.beneficiaries));
                          const height = (item.beneficiaries / maxBeneficiaries) * 100;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-4/5 bg-primary rounded-t" 
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs mt-1">{item.year}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ChartCard>
                )}
                
                {/* Additional Chart or Table */}
                <ChartCard 
                  title={getAdditionalChartTitle(reportType)}
                  icon={<FiActivity size={18} />}
                >
                  <div className="p-4 flex justify-center items-center h-48 border-2 border-dashed border-base-300 rounded-lg mt-4">
                    <div className="text-center text-base-content/70">
                      <FiBarChart2 size={48} className="mx-auto mb-2 opacity-50" />
                      <p>In a real application, this would display an interactive chart or detailed table.</p>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

// Helper Components
function SummaryCard({ icon, title, value, subtitle, trend, trendUp }) {
  return (
    <div className="bg-base-100 rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3">
        <div className="bg-base-200 p-3 rounded-full">
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-base-content/70">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-base-content/70 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-base-100 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h3>
      </div>
      {children}
    </div>
  );
}

// Helper functions
function getAdditionalChartTitle(reportType) {
  switch (reportType) {
    case 'donations':
      return 'Donation Trends Analysis';
    case 'users':
      return 'User Engagement Metrics';
    case 'programs':
      return 'Program Performance Indicators';
    case 'impact':
      return 'Impact Sustainability Index';
    default:
      return 'Additional Analysis';
  }
}

function getProgressColor(percentage) {
  if (percentage >= 100) return 'bg-success';
  if (percentage >= 75) return 'bg-primary';
  if (percentage >= 50) return 'bg-accent';
  if (percentage >= 25) return 'bg-warning';
  return 'bg-error';
}