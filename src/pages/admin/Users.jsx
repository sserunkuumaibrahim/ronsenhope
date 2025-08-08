import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiUserPlus, FiFilter, FiDownload, FiMail, FiCheck, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'joined', direction: 'desc' });
  
  const usersPerPage = 10;

  useEffect(() => {
    // Simulate API fetch
    const fetchUsers = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample users data
      const usersData = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'admin',
          status: 'active',
          joined: '2023-01-15',
          lastLogin: '2023-06-15',
          donations: 5,
          totalDonated: 500
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          role: 'user',
          status: 'active',
          joined: '2023-02-20',
          lastLogin: '2023-06-14',
          donations: 3,
          totalDonated: 150
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'm.brown@example.com',
          role: 'volunteer',
          status: 'active',
          joined: '2023-03-10',
          lastLogin: '2023-06-10',
          donations: 2,
          totalDonated: 200
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          role: 'user',
          status: 'inactive',
          joined: '2023-03-15',
          lastLogin: '2023-05-20',
          donations: 1,
          totalDonated: 75
        },
        {
          id: 5,
          name: 'David Wilson',
          email: 'd.wilson@example.com',
          role: 'donor',
          status: 'active',
          joined: '2023-04-05',
          lastLogin: '2023-06-12',
          donations: 4,
          totalDonated: 350
        },
        {
          id: 6,
          name: 'Jennifer Lee',
          email: 'jennifer.l@example.com',
          role: 'user',
          status: 'active',
          joined: '2023-04-12',
          lastLogin: '2023-06-08',
          donations: 2,
          totalDonated: 100
        },
        {
          id: 7,
          name: 'Robert Taylor',
          email: 'robert.t@example.com',
          role: 'volunteer',
          status: 'active',
          joined: '2023-04-18',
          lastLogin: '2023-06-13',
          donations: 0,
          totalDonated: 0
        },
        {
          id: 8,
          name: 'Lisa Anderson',
          email: 'lisa.a@example.com',
          role: 'user',
          status: 'pending',
          joined: '2023-05-02',
          lastLogin: null,
          donations: 0,
          totalDonated: 0
        },
        {
          id: 9,
          name: 'James Martin',
          email: 'james.m@example.com',
          role: 'donor',
          status: 'active',
          joined: '2023-05-10',
          lastLogin: '2023-06-11',
          donations: 3,
          totalDonated: 250
        },
        {
          id: 10,
          name: 'Patricia White',
          email: 'patricia.w@example.com',
          role: 'user',
          status: 'active',
          joined: '2023-05-15',
          lastLogin: '2023-06-09',
          donations: 1,
          totalDonated: 50
        },
        {
          id: 11,
          name: 'Thomas Harris',
          email: 'thomas.h@example.com',
          role: 'user',
          status: 'inactive',
          joined: '2023-05-20',
          lastLogin: '2023-05-25',
          donations: 0,
          totalDonated: 0
        },
        {
          id: 12,
          name: 'Jessica Clark',
          email: 'jessica.c@example.com',
          role: 'volunteer',
          status: 'active',
          joined: '2023-05-25',
          lastLogin: '2023-06-14',
          donations: 1,
          totalDonated: 75
        },
        {
          id: 13,
          name: 'Daniel Lewis',
          email: 'daniel.l@example.com',
          role: 'user',
          status: 'active',
          joined: '2023-06-01',
          lastLogin: '2023-06-10',
          donations: 1,
          totalDonated: 25
        },
        {
          id: 14,
          name: 'Nancy Walker',
          email: 'nancy.w@example.com',
          role: 'donor',
          status: 'active',
          joined: '2023-06-05',
          lastLogin: '2023-06-15',
          donations: 2,
          totalDonated: 200
        },
        {
          id: 15,
          name: 'Christopher Young',
          email: 'chris.y@example.com',
          role: 'user',
          status: 'pending',
          joined: '2023-06-10',
          lastLogin: null,
          donations: 0,
          totalDonated: 0
        }
      ];
      
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Get all unique roles
  const roles = ['all', ...new Set(users.map(user => user.role))];
  
  // Get all unique statuses
  const statuses = ['all', ...new Set(users.map(user => user.status))];

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] === null) return 1;
    if (b[sortConfig.key] === null) return -1;
    
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  // Filter users based on search term, role, and status
  const filteredUsers = sortedUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the user
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const exportUsers = () => {
    // In a real app, this would generate a CSV file for download
    alert('In a real application, this would download a CSV file with user data.');
  };

  const sendInvite = (email) => {
    // In a real app, this would send an invitation email
    alert(`In a real application, this would send an invitation email to ${email}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Users - Charity NGO Admin</title>
        <meta name="description" content="Admin panel for managing users" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Manage Users</h1>
            
            <div className="flex gap-2">
              <button 
                className="btn btn-primary btn-sm gap-1"
                onClick={() => document.getElementById('add-user-modal').showModal()}
              >
                <FiUserPlus size={16} /> Add User
              </button>
              <button 
                className="btn btn-outline btn-sm gap-1"
                onClick={exportUsers}
              >
                <FiDownload size={16} /> Export
              </button>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  placeholder="Search users..." 
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
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)} {role === 'all' ? 'Roles' : ''}
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
                      {status.charAt(0).toUpperCase() + status.slice(1)} {status === 'all' ? 'Status' : ''}
                    </option>
                  ))}
                </select>
                
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('all');
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
                        Name
                        {sortConfig.key === 'name' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Email</th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        {sortConfig.key === 'role' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === 'status' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('joined')}
                    >
                      <div className="flex items-center">
                        Joined
                        {sortConfig.key === 'joined' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('totalDonated')}
                    >
                      <div className="flex items-center">
                        Donations
                        {sortConfig.key === 'totalDonated' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No users found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="font-medium">{user.name}</div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{new Date(user.joined).toLocaleDateString()}</td>
                        <td>
                          <div className="flex flex-col">
                            <span>${user.totalDonated}</span>
                            <span className="text-xs text-base-content/70">{user.donations} donations</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <Link to={`/admin/users/${user.id}`} className="btn btn-xs btn-ghost">
                              <FiEdit size={14} />
                            </Link>
                            <button 
                              className="btn btn-xs btn-ghost text-error"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <FiTrash2 size={14} />
                            </button>
                            {user.status === 'pending' && (
                              <button 
                                className="btn btn-xs btn-ghost text-info"
                                onClick={() => sendInvite(user.email)}
                              >
                                <FiMail size={14} />
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
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* Add User Modal */}
      <dialog id="add-user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New User</h3>
          <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="Enter full name" className="input input-bordered" />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Enter email address" className="input input-bordered" />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select className="select select-bordered w-full">
                <option disabled selected>Select a role</option>
                <option value="user">User</option>
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-control mb-6">
              <label className="label cursor-pointer">
                <span className="label-text">Send invitation email</span> 
                <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
              </label>
            </div>
            
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => document.getElementById('add-user-modal').close()}>Cancel</button>
              <button type="button" className="btn btn-primary">Add User</button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete the user <span className="font-semibold">{userToDelete?.name}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
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
function getRoleBadgeColor(role) {
  switch (role) {
    case 'admin':
      return 'badge-primary';
    case 'volunteer':
      return 'badge-secondary';
    case 'donor':
      return 'badge-accent';
    default:
      return 'badge-ghost';
  }
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'inactive':
      return 'badge-warning';
    case 'pending':
      return 'badge-info';
    default:
      return 'badge-ghost';
  }
}