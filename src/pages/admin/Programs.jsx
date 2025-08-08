import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiDownload, FiEye, FiCheck, FiX, FiCalendar } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  
  const programsPerPage = 10;

  useEffect(() => {
    // Simulate API fetch
    const fetchPrograms = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample programs data
      const programsData = [
        {
          id: 1,
          name: 'Clean Water Initiative',
          description: 'Providing clean water solutions to communities in need.',
          category: 'Water & Sanitation',
          status: 'active',
          startDate: '2023-01-15',
          endDate: '2023-12-31',
          budget: 50000,
          raised: 32500,
          beneficiaries: 5000,
          location: 'Multiple Regions',
          coordinator: 'Sarah Johnson',
          image: 'https://example.com/images/water-initiative.jpg'
        },
        {
          id: 2,
          name: 'Education for All',
          description: 'Supporting education in underprivileged communities.',
          category: 'Education',
          status: 'active',
          startDate: '2023-02-01',
          endDate: '2023-11-30',
          budget: 75000,
          raised: 45000,
          beneficiaries: 2000,
          location: 'Urban Centers',
          coordinator: 'Michael Brown',
          image: 'https://example.com/images/education-program.jpg'
        },
        {
          id: 3,
          name: 'Emergency Relief Fund',
          description: 'Providing immediate assistance to disaster-affected areas.',
          category: 'Emergency',
          status: 'active',
          startDate: '2023-03-10',
          endDate: null, // Ongoing program
          budget: 100000,
          raised: 85000,
          beneficiaries: 10000,
          location: 'Global',
          coordinator: 'David Wilson',
          image: 'https://example.com/images/emergency-relief.jpg'
        },
        {
          id: 4,
          name: 'Community Development',
          description: 'Building sustainable infrastructure in rural communities.',
          category: 'Development',
          status: 'active',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          budget: 120000,
          raised: 78000,
          beneficiaries: 15000,
          location: 'Rural Areas',
          coordinator: 'Jennifer Lee',
          image: 'https://example.com/images/community-dev.jpg'
        },
        {
          id: 5,
          name: 'Healthcare Access',
          description: 'Improving access to healthcare in underserved regions.',
          category: 'Health',
          status: 'active',
          startDate: '2023-04-01',
          endDate: '2024-03-31',
          budget: 90000,
          raised: 42000,
          beneficiaries: 8000,
          location: 'Multiple Regions',
          coordinator: 'Robert Taylor',
          image: 'https://example.com/images/healthcare.jpg'
        },
        {
          id: 6,
          name: 'Youth Empowerment',
          description: 'Providing skills and opportunities for disadvantaged youth.',
          category: 'Education',
          status: 'active',
          startDate: '2023-03-15',
          endDate: '2023-09-15',
          budget: 45000,
          raised: 30000,
          beneficiaries: 1000,
          location: 'Urban Centers',
          coordinator: 'Patricia White',
          image: 'https://example.com/images/youth-program.jpg'
        },
        {
          id: 7,
          name: 'Sustainable Agriculture',
          description: 'Promoting sustainable farming practices in rural communities.',
          category: 'Food & Agriculture',
          status: 'active',
          startDate: '2023-02-15',
          endDate: '2024-02-14',
          budget: 65000,
          raised: 40000,
          beneficiaries: 3000,
          location: 'Rural Areas',
          coordinator: 'James Martin',
          image: 'https://example.com/images/agriculture.jpg'
        },
        {
          id: 8,
          name: 'Women Empowerment',
          description: 'Supporting women entrepreneurs and leaders in communities.',
          category: 'Gender Equality',
          status: 'active',
          startDate: '2023-05-01',
          endDate: '2024-04-30',
          budget: 55000,
          raised: 25000,
          beneficiaries: 2500,
          location: 'Multiple Regions',
          coordinator: 'Lisa Anderson',
          image: 'https://example.com/images/women-empowerment.jpg'
        },
        {
          id: 9,
          name: 'Digital Literacy',
          description: 'Teaching digital skills to bridge the technology gap.',
          category: 'Education',
          status: 'planned',
          startDate: '2023-07-01',
          endDate: '2023-12-31',
          budget: 40000,
          raised: 15000,
          beneficiaries: 1500,
          location: 'Urban Centers',
          coordinator: 'Thomas Harris',
          image: 'https://example.com/images/digital-literacy.jpg'
        },
        {
          id: 10,
          name: 'Environmental Conservation',
          description: 'Protecting natural habitats and promoting conservation.',
          category: 'Environment',
          status: 'active',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          budget: 80000,
          raised: 50000,
          beneficiaries: 0, // Indirect beneficiaries
          location: 'Protected Areas',
          coordinator: 'Jessica Clark',
          image: 'https://example.com/images/conservation.jpg'
        },
        {
          id: 11,
          name: 'Mental Health Support',
          description: 'Providing mental health services and awareness programs.',
          category: 'Health',
          status: 'planned',
          startDate: '2023-08-01',
          endDate: '2024-07-31',
          budget: 60000,
          raised: 20000,
          beneficiaries: 5000,
          location: 'Urban Centers',
          coordinator: 'Daniel Lewis',
          image: 'https://example.com/images/mental-health.jpg'
        },
        {
          id: 12,
          name: 'Elderly Care',
          description: 'Supporting elderly individuals with care and community services.',
          category: 'Social Services',
          status: 'active',
          startDate: '2023-03-01',
          endDate: '2024-02-29',
          budget: 70000,
          raised: 45000,
          beneficiaries: 2000,
          location: 'Multiple Regions',
          coordinator: 'Nancy Walker',
          image: 'https://example.com/images/elderly-care.jpg'
        },
        {
          id: 13,
          name: 'Refugee Support',
          description: 'Providing assistance to refugees and displaced persons.',
          category: 'Humanitarian',
          status: 'active',
          startDate: '2023-01-15',
          endDate: null, // Ongoing program
          budget: 110000,
          raised: 75000,
          beneficiaries: 7500,
          location: 'Global',
          coordinator: 'Christopher Young',
          image: 'https://example.com/images/refugee-support.jpg'
        },
        {
          id: 14,
          name: 'Childhood Nutrition',
          description: 'Ensuring proper nutrition for children in vulnerable communities.',
          category: 'Health',
          status: 'completed',
          startDate: '2022-07-01',
          endDate: '2023-06-30',
          budget: 55000,
          raised: 55000,
          beneficiaries: 4000,
          location: 'Multiple Regions',
          coordinator: 'Emily Davis',
          image: 'https://example.com/images/child-nutrition.jpg'
        },
        {
          id: 15,
          name: 'Vocational Training',
          description: 'Providing job skills training for unemployed individuals.',
          category: 'Education',
          status: 'planned',
          startDate: '2023-09-01',
          endDate: '2024-08-31',
          budget: 65000,
          raised: 25000,
          beneficiaries: 1200,
          location: 'Urban Centers',
          coordinator: 'John Smith',
          image: 'https://example.com/images/vocational-training.jpg'
        }
      ];
      
      setPrograms(programsData);
      setLoading(false);
    };

    fetchPrograms();
  }, []);

  // Get all unique categories
  const categories = ['all', ...new Set(programs.map(program => program.category))];
  
  // Get all unique statuses
  const statuses = ['all', ...new Set(programs.map(program => program.status))];

  // Sort programs
  const sortedPrograms = [...programs].sort((a, b) => {
    if (sortConfig.key === 'raised' || sortConfig.key === 'budget' || sortConfig.key === 'beneficiaries') {
      return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
    }
    
    if (sortConfig.key === 'progress') {
      const progressA = (a.raised / a.budget) * 100;
      const progressB = (b.raised / b.budget) * 100;
      return sortConfig.direction === 'asc' ? progressA - progressB : progressB - progressA;
    }
    
    if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
      // Handle null endDate (ongoing programs)
      if (sortConfig.key === 'endDate') {
        if (a.endDate === null && b.endDate === null) return 0;
        if (a.endDate === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (b.endDate === null) return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      return sortConfig.direction === 'asc' 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    }
    
    // Default sort by name
    return sortConfig.direction === 'asc' 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  // Filter programs based on search term, category, and status
  const filteredPrograms = sortedPrograms.filter(program => {
    const matchesSearch = 
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the program
    setPrograms(programs.filter(program => program.id !== programToDelete.id));
    setShowDeleteModal(false);
    setProgramToDelete(null);
  };

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setShowDetailsModal(true);
  };

  const exportPrograms = () => {
    // In a real app, this would generate a CSV file for download
    alert('In a real application, this would download a CSV file with program data.');
  };

  // Calculate progress percentage
  const calculateProgress = (raised, budget) => {
    return Math.min(Math.round((raised / budget) * 100), 100);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading programs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Programs - Charity NGO Admin</title>
        <meta name="description" content="Admin panel for managing charity programs" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Programs</h1>
            
            <div className="flex gap-2">
              <Link to="/admin/programs/new" className="btn btn-primary btn-sm gap-1">
                <FiPlus size={16} /> Add Program
              </Link>
              <button 
                className="btn btn-outline btn-sm gap-1"
                onClick={exportPrograms}
              >
                <FiDownload size={16} /> Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FiCalendar className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Active Programs</h3>
                  <p className="text-2xl font-bold">
                    {programs.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-3 rounded-full">
                  <FiCheck className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Total Budget</h3>
                  <p className="text-2xl font-bold">
                    ${programs.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-3 rounded-full">
                  <FiCheck className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Total Raised</h3>
                  <p className="text-2xl font-bold">
                    ${programs.reduce((sum, p) => sum + p.raised, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-3 rounded-full">
                  <FiCheck className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content/70">Beneficiaries</h3>
                  <p className="text-2xl font-bold">
                    {programs.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search programs..." 
                  className="input input-bordered w-full pr-10" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="select select-bordered w-full md:w-auto" 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                
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
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
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
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Program Name
                        {sortConfig.key === 'name' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Category</th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center">
                        Start Date
                        {sortConfig.key === 'startDate' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('budget')}
                    >
                      <div className="flex items-center">
                        Budget
                        {sortConfig.key === 'budget' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('progress')}
                    >
                      <div className="flex items-center">
                        Progress
                        {sortConfig.key === 'progress' && (
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
                  {currentPrograms.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No programs found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    currentPrograms.map((program) => (
                      <tr key={program.id}>
                        <td>
                          <div className="font-medium">{program.name}</div>
                          <div className="text-xs text-base-content/70 truncate max-w-xs">{program.description}</div>
                        </td>
                        <td>{program.category}</td>
                        <td>
                          <div>{new Date(program.startDate).toLocaleDateString()}</div>
                          <div className="text-xs text-base-content/70">
                            {program.endDate ? `to ${new Date(program.endDate).toLocaleDateString()}` : 'Ongoing'}
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">${program.budget.toLocaleString()}</div>
                          <div className="text-xs text-base-content/70">${program.raised.toLocaleString()} raised</div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <progress 
                              className={`progress ${getProgressColor(calculateProgress(program.raised, program.budget))} w-24`} 
                              value={program.raised} 
                              max={program.budget}
                            ></progress>
                            <span className="text-sm">
                              {calculateProgress(program.raised, program.budget)}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(program.status)}`}>
                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <button 
                              className="btn btn-xs btn-ghost"
                              onClick={() => handleViewDetails(program)}
                            >
                              <FiEye size={14} />
                            </button>
                            <Link to={`/admin/programs/${program.id}/edit`} className="btn btn-xs btn-ghost">
                              <FiEdit size={14} />
                            </Link>
                            <button 
                              className="btn btn-xs btn-ghost text-error"
                              onClick={() => handleDeleteClick(program)}
                            >
                              <FiTrash2 size={14} />
                            </button>
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
                  Showing {indexOfFirstProgram + 1}-{Math.min(indexOfLastProgram, filteredPrograms.length)} of {filteredPrograms.length} programs
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

      {/* Program Details Modal */}
      {showDetailsModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{selectedProgram.name}</h3>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProgram(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-base-content/80">{selectedProgram.description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Program Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Category:</span>
                      <span className="font-medium">{selectedProgram.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Status:</span>
                      <span className={`font-medium ${getStatusTextColor(selectedProgram.status)}`}>
                        {selectedProgram.status.charAt(0).toUpperCase() + selectedProgram.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Start Date:</span>
                      <span className="font-medium">{new Date(selectedProgram.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">End Date:</span>
                      <span className="font-medium">
                        {selectedProgram.endDate ? new Date(selectedProgram.endDate).toLocaleDateString() : 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Location:</span>
                      <span className="font-medium">{selectedProgram.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Coordinator:</span>
                      <span className="font-medium">{selectedProgram.coordinator}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Budget & Progress</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Total Budget:</span>
                      <span className="font-medium">${selectedProgram.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Amount Raised:</span>
                      <span className="font-medium">${selectedProgram.raised.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Remaining:</span>
                      <span className="font-medium">
                        ${Math.max(0, selectedProgram.budget - selectedProgram.raised).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-base-content/70">Funding Progress:</span>
                        <span className="font-medium">
                          {calculateProgress(selectedProgram.raised, selectedProgram.budget)}%
                        </span>
                      </div>
                      <progress 
                        className={`progress ${getProgressColor(calculateProgress(selectedProgram.raised, selectedProgram.budget))} w-full`} 
                        value={selectedProgram.raised} 
                        max={selectedProgram.budget}
                      ></progress>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Beneficiaries:</span>
                      <span className="font-medium">{selectedProgram.beneficiaries.toLocaleString()}</span>
                    </div>
                    <div className="mt-4">
                      <Link to={`/admin/programs/${selectedProgram.id}/reports`} className="btn btn-sm btn-outline w-full">
                        View Detailed Reports
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Link to={`/admin/programs/${selectedProgram.id}/edit`} className="btn btn-sm btn-primary">
                  <FiEdit size={16} /> Edit Program
                </Link>
                <button 
                  className="btn btn-sm btn-error"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleDeleteClick(selectedProgram);
                  }}
                >
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
              <button 
                className="btn btn-sm"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProgram(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete the program <span className="font-semibold">{programToDelete?.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setProgramToDelete(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={confirmDelete}
              >
                Delete
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
    case 'active':
      return 'badge-success';
    case 'planned':
      return 'badge-info';
    case 'completed':
      return 'badge-secondary';
    default:
      return 'badge-ghost';
  }
}

function getStatusTextColor(status) {
  switch (status) {
    case 'active':
      return 'text-success';
    case 'planned':
      return 'text-info';
    case 'completed':
      return 'text-secondary';
    default:
      return '';
  }
}

function getProgressColor(percentage) {
  if (percentage >= 100) return 'progress-success';
  if (percentage >= 75) return 'progress-primary';
  if (percentage >= 50) return 'progress-accent';
  if (percentage >= 25) return 'progress-warning';
  return 'progress-error';
}