import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiFilter, FiDownload, FiEye, FiCheck, FiX, FiDollarSign, FiCalendar, FiPieChart } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [stats, setStats] = useState({
    totalAmount: 0,
    averageAmount: 0,
    totalDonations: 0,
    pendingAmount: 0
  });
  
  const donationsPerPage = 10;

  useEffect(() => {
    // Simulate API fetch
    const fetchDonations = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample donations data
      const donationsData = [
        {
          id: 'DON-2023-001',
          donor: {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com'
          },
          amount: 100.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Education Fund',
          status: 'completed',
          date: '2023-06-15',
          paymentMethod: 'Credit Card',
          notes: 'Keep up the good work!'
        },
        {
          id: 'DON-2023-002',
          donor: {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com'
          },
          amount: 25.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Clean Water Initiative',
          status: 'completed',
          date: '2023-06-14',
          paymentMethod: 'PayPal',
          notes: ''
        },
        {
          id: 'DON-2023-003',
          donor: {
            id: 5,
            name: 'David Wilson',
            email: 'd.wilson@example.com'
          },
          amount: 500.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Emergency Relief',
          status: 'completed',
          date: '2023-06-10',
          paymentMethod: 'Bank Transfer',
          notes: 'Please use for the flood victims'
        },
        {
          id: 'DON-2023-004',
          donor: {
            id: 9,
            name: 'James Martin',
            email: 'james.m@example.com'
          },
          amount: 75.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Education Fund',
          status: 'completed',
          date: '2023-06-05',
          paymentMethod: 'Credit Card',
          notes: ''
        },
        {
          id: 'DON-2023-005',
          donor: {
            id: 14,
            name: 'Nancy Walker',
            email: 'nancy.w@example.com'
          },
          amount: 150.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Community Development',
          status: 'completed',
          date: '2023-06-01',
          paymentMethod: 'PayPal',
          notes: 'Happy to support!'
        },
        {
          id: 'DON-2023-006',
          donor: {
            id: 3,
            name: 'Michael Brown',
            email: 'm.brown@example.com'
          },
          amount: 50.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Clean Water Initiative',
          status: 'pending',
          date: '2023-06-16',
          paymentMethod: 'Credit Card',
          notes: ''
        },
        {
          id: 'DON-2023-007',
          donor: {
            id: 10,
            name: 'Patricia White',
            email: 'patricia.w@example.com'
          },
          amount: 30.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Education Fund',
          status: 'completed',
          date: '2023-05-15',
          paymentMethod: 'Credit Card',
          notes: ''
        },
        {
          id: 'DON-2023-008',
          donor: {
            id: 12,
            name: 'Jessica Clark',
            email: 'jessica.c@example.com'
          },
          amount: 75.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Community Development',
          status: 'completed',
          date: '2023-05-20',
          paymentMethod: 'PayPal',
          notes: ''
        },
        {
          id: 'DON-2023-009',
          donor: {
            id: 5,
            name: 'David Wilson',
            email: 'd.wilson@example.com'
          },
          amount: 200.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Emergency Relief',
          status: 'failed',
          date: '2023-06-12',
          paymentMethod: 'Credit Card',
          notes: 'Card declined'
        },
        {
          id: 'DON-2023-010',
          donor: {
            id: 9,
            name: 'James Martin',
            email: 'james.m@example.com'
          },
          amount: 75.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Education Fund',
          status: 'completed',
          date: '2023-05-05',
          paymentMethod: 'Credit Card',
          notes: ''
        },
        {
          id: 'DON-2023-011',
          donor: {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com'
          },
          amount: 25.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Clean Water Initiative',
          status: 'completed',
          date: '2023-05-14',
          paymentMethod: 'PayPal',
          notes: ''
        },
        {
          id: 'DON-2023-012',
          donor: {
            id: 14,
            name: 'Nancy Walker',
            email: 'nancy.w@example.com'
          },
          amount: 50.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Community Development',
          status: 'pending',
          date: '2023-06-15',
          paymentMethod: 'Bank Transfer',
          notes: 'Waiting for bank confirmation'
        },
        {
          id: 'DON-2023-013',
          donor: {
            id: 13,
            name: 'Daniel Lewis',
            email: 'daniel.l@example.com'
          },
          amount: 25.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Education Fund',
          status: 'completed',
          date: '2023-06-08',
          paymentMethod: 'PayPal',
          notes: ''
        },
        {
          id: 'DON-2023-014',
          donor: {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com'
          },
          amount: 100.00,
          currency: 'USD',
          type: 'monthly',
          program: 'Emergency Relief',
          status: 'completed',
          date: '2023-05-15',
          paymentMethod: 'Credit Card',
          notes: ''
        },
        {
          id: 'DON-2023-015',
          donor: {
            id: 5,
            name: 'David Wilson',
            email: 'd.wilson@example.com'
          },
          amount: 150.00,
          currency: 'USD',
          type: 'one-time',
          program: 'Clean Water Initiative',
          status: 'completed',
          date: '2023-06-02',
          paymentMethod: 'Bank Transfer',
          notes: ''
        }
      ];
      
      setDonations(donationsData);
      
      // Calculate statistics
      const totalAmount = donationsData.reduce((sum, donation) => 
        donation.status !== 'failed' ? sum + donation.amount : sum, 0);
      
      const completedDonations = donationsData.filter(d => d.status === 'completed');
      const pendingAmount = donationsData
        .filter(d => d.status === 'pending')
        .reduce((sum, d) => sum + d.amount, 0);
      
      setStats({
        totalAmount,
        averageAmount: completedDonations.length > 0 ? 
          totalAmount / completedDonations.length : 0,
        totalDonations: completedDonations.length,
        pendingAmount
      });
      
      setLoading(false);
    };

    fetchDonations();
  }, []);

  // Get all unique statuses
  const statuses = ['all', ...new Set(donations.map(donation => donation.status))];
  
  // Get all unique donation types
  const types = ['all', ...new Set(donations.map(donation => donation.type))];

  // Sort donations
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (sortConfig.key === 'donor') {
      return sortConfig.direction === 'asc' 
        ? a.donor.name.localeCompare(b.donor.name)
        : b.donor.name.localeCompare(a.donor.name);
    }
    
    // Default sort by date
    return sortConfig.direction === 'asc' 
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  // Filter donations based on search term, status, type, and date range
  const filteredDonations = sortedDonations.filter(donation => {
    const matchesSearch = 
      donation.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      donation.donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || donation.status === selectedStatus;
    
    const matchesType = selectedType === 'all' || donation.type === selectedType;
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange.from) {
      matchesDateRange = matchesDateRange && donation.date >= dateRange.from;
    }
    if (dateRange.to) {
      matchesDateRange = matchesDateRange && donation.date <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  const updateDonationStatus = (id, newStatus) => {
    // In a real app, this would call an API to update the donation status
    setDonations(donations.map(donation => 
      donation.id === id ? { ...donation, status: newStatus } : donation
    ));
    
    if (selectedDonation && selectedDonation.id === id) {
      setSelectedDonation({ ...selectedDonation, status: newStatus });
    }
  };

  const exportDonations = () => {
    // In a real app, this would generate a CSV file for download
    alert('In a real application, this would download a CSV file with donation data.');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading donations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Donations - Ronsen Hope Christian Foundation Uganda Admin</title>
        <meta name="description" content="Admin panel for managing donations" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Donations</h1>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-outline btn-sm gap-1"
                onClick={exportDonations}
              >
                <FiDownload size={16} /> Export
              </button>
              <Link to="/admin/reports/donations" className="btn btn-primary btn-sm gap-1">
                <FiPieChart size={16} /> Reports
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiDollarSign className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Total Donations</h3>
                  <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <FiCheck className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Completed Donations</h3>
                  <p className="text-2xl font-bold">{stats.totalDonations}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-3 rounded-full">
                  <FiDollarSign className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Average Donation</h3>
                  <p className="text-2xl font-bold">${stats.averageAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-3 rounded-full">
                  <FiCalendar className="text-warning" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Pending Amount</h3>
                  <p className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search donations..." 
                  className="input input-bordered w-full pr-10" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select 
                  className="select select-bordered w-full md:w-auto" 
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)} {status === 'all' ? 'Status' : ''}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="select select-bordered w-full md:w-auto" 
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type === 'one-time' ? 'One-time' : type.charAt(0).toUpperCase() + type.slice(1)} {type === 'all' ? 'Types' : ''}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="input input-bordered w-32" 
                    value={dateRange.from}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, from: e.target.value });
                      setCurrentPage(1);
                    }}
                  />
                  <span>to</span>
                  <input 
                    type="date" 
                    className="input input-bordered w-32" 
                    value={dateRange.to}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, to: e.target.value });
                      setCurrentPage(1);
                    }}
                  />
                </div>
                
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedType('all');
                    setDateRange({ from: '', to: '' });
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('donor')}
                    >
                      <div className="flex items-center">
                        Donor
                        {sortConfig.key === 'donor' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortConfig.key === 'amount' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Program</th>
                    <th>Type</th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'date' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDonations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No donations found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    currentDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td>{donation.id}</td>
                        <td>
                          <div className="font-medium">{donation.donor.name}</div>
                          <div className="text-xs text-base-content/70">{donation.donor.email}</div>
                        </td>
                        <td>
                          <div className="font-medium">${donation.amount.toFixed(2)}</div>
                          <div className="text-xs text-base-content/70">{donation.paymentMethod}</div>
                        </td>
                        <td>{donation.program}</td>
                        <td>
                          <span className={`badge ${donation.type === 'monthly' ? 'badge-secondary' : 'badge-ghost'}`}>
                            {donation.type === 'one-time' ? 'One-time' : 'Monthly'}
                          </span>
                        </td>
                        <td>{new Date(donation.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button 
                              className="btn btn-xs btn-ghost"
                              onClick={() => handleViewDetails(donation)}
                            >
                              <FiEye size={14} />
                            </button>
                            
                            {donation.status === 'pending' && (
                              <button 
                                className="btn btn-xs btn-ghost text-success"
                                onClick={() => updateDonationStatus(donation.id, 'completed')}
                                title="Mark as Completed"
                              >
                                <FiCheck size={14} />
                              </button>
                            )}
                            
                            {donation.status === 'pending' && (
                              <button 
                                className="btn btn-xs btn-ghost text-error"
                                onClick={() => updateDonationStatus(donation.id, 'failed')}
                                title="Mark as Failed"
                              >
                                <FiX size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-base-content/70">
                  Showing {indexOfFirstDonation + 1}-{Math.min(indexOfLastDonation, filteredDonations.length)} of {filteredDonations.length} donations
                </div>
                <div className="join">
                  <button 
                    className="join-item btn btn-sm"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`join-item btn btn-sm ${currentPage === number + 1 ? 'btn-active' : ''}`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="join-item btn btn-sm"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Donation Details Modal */}
      {showDetailsModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Donation Details</h3>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDonation(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Donation Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">ID:</span>
                    <span className="font-medium">{selectedDonation.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Amount:</span>
                    <span className="font-medium">${selectedDonation.amount.toFixed(2)} {selectedDonation.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Date:</span>
                    <span className="font-medium">{new Date(selectedDonation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Type:</span>
                    <span className="font-medium">{selectedDonation.type === 'one-time' ? 'One-time' : 'Monthly'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Program:</span>
                    <span className="font-medium">{selectedDonation.program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Payment Method:</span>
                    <span className="font-medium">{selectedDonation.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Status:</span>
                    <span className={`font-medium ${getStatusTextColor(selectedDonation.status)}`}>
                      {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Donor Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Name:</span>
                    <span className="font-medium">{selectedDonation.donor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Email:</span>
                    <span className="font-medium">{selectedDonation.donor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Donor ID:</span>
                    <span className="font-medium">{selectedDonation.donor.id}</span>
                  </div>
                  <div className="mt-4">
                    <Link to={`/admin/users/${selectedDonation.donor.id}`} className="btn btn-sm btn-outline w-full">
                      View Donor Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedDonation.notes && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Notes</h4>
                <div className="bg-base-200 p-3 rounded-lg">
                  {selectedDonation.notes}
                </div>
              </div>
            )}
            
            <div className="divider"></div>
            
            <div className="flex justify-between">
              <div>
                {selectedDonation.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        updateDonationStatus(selectedDonation.id, 'completed');
                        setShowDetailsModal(false);
                      }}
                    >
                      <FiCheck size={16} /> Mark as Completed
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        updateDonationStatus(selectedDonation.id, 'failed');
                        setShowDetailsModal(false);
                      }}
                    >
                      <FiX size={16} /> Mark as Failed
                    </button>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-sm"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDonation(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Helper functions for badge colors
function getStatusBadgeColor(status) {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'failed':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
}

function getStatusTextColor(status) {
  switch (status) {
    case 'completed':
      return 'text-success';
    case 'pending':
      return 'text-warning';
    case 'failed':
      return 'text-error';
    default:
      return '';
  }
}