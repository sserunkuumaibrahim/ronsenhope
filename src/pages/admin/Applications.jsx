import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiTrash2, FiFilter, FiDownload, FiMail, FiPhone, FiMapPin, FiClock, FiUser, FiCheckCircle, FiXCircle, FiFileText } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const applicationsCollection = collection(db, 'applications');
        const applicationsSnapshot = await getDocs(applicationsCollection);
        const applicationsData = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate?.() || doc.data().submittedAt
        }));
        
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search and filters
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.opportunity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOpportunity = selectedOpportunity === 'all' || application.opportunity === selectedOpportunity;
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    
    return matchesSearch && matchesOpportunity && matchesStatus;
  });

  const handleDeleteApplication = (application) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'applications', applicationToDelete.id));
      setApplications(applications.filter(app => app.id !== applicationToDelete.id));
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'pending': return <FiClock className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueOpportunities = [...new Set(applications.map(app => app.opportunity))];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Volunteer Applications - Admin - Ronsen Hope Christian Foundation Uganda</title>
      </Helmet>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Applications</h1>
            <p className="text-gray-600 mt-2">Manage and review volunteer applications</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiXCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Opportunity Filter */}
            <select
              value={selectedOpportunity}
              onChange={(e) => setSelectedOpportunity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Opportunities</option>
              {uniqueOpportunities.map(opportunity => (
                <option key={opportunity} value={opportunity}>{opportunity}</option>
              ))}
            </select>
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {application.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {application.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.opportunity}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        {application.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.experience}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'approved')}
                              className="text-green-600 hover:text-green-900 p-1 rounded transition-colors duration-200"
                              title="Approve"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                              title="Reject"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteApplication(application)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">No applications match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FiXCircle className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <FiMail className="w-4 h-4" />
                        {selectedApplication.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        {selectedApplication.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        {selectedApplication.location}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Application Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Application Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Opportunity</label>
                      <p className="text-gray-900">{selectedApplication.opportunity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience Level</label>
                      <p className="text-gray-900">{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p className="text-gray-900">{formatDate(selectedApplication.submittedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interests */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Areas of Interest</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Availability */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.availability.map((time, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Message */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Message</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedApplication.message}
                </p>
              </div>
              
              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="mt-6 flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'approved');
                      setSelectedApplication(null);
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'rejected');
                      setSelectedApplication(null);
                    }}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FiXCircle className="w-4 h-4" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiTrash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Application</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the application from <strong>{applicationToDelete?.name}</strong>?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}