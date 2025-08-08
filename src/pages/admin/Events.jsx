import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiX, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    status: 'upcoming',
    image: ''
  });

  useEffect(() => {
    // Simulate API fetch
    const fetchEvents = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample events data
      const sampleEvents = [
        {
          id: 1,
          title: 'Annual Charity Gala',
          description: 'Join us for our annual fundraising gala with dinner, entertainment, and silent auction.',
          date: '2023-12-15',
          time: '18:00',
          location: 'Grand Ballroom, Hilton Hotel',
          capacity: 200,
          registered: 175,
          status: 'upcoming',
          image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Charity+Gala'
        },
        {
          id: 2,
          title: 'Community Clean-up Day',
          description: 'Volunteer to help clean up local parks and streets. Equipment and refreshments provided.',
          date: '2023-11-05',
          time: '09:00',
          location: 'Central Park',
          capacity: 50,
          registered: 50,
          status: 'completed',
          image: 'https://placehold.co/600x400/22c55e/ffffff?text=Clean-up+Day'
        },
        {
          id: 3,
          title: 'Charity Run for Education',
          description: '5K run/walk to raise funds for educational programs in underserved communities.',
          date: '2024-03-20',
          time: '08:00',
          location: 'Riverside Park',
          capacity: 300,
          registered: 120,
          status: 'upcoming',
          image: 'https://placehold.co/600x400/f97316/ffffff?text=Charity+Run'
        },
        {
          id: 4,
          title: 'Holiday Food Drive',
          description: 'Collecting non-perishable food items for local food banks during the holiday season.',
          date: '2023-12-01',
          time: '10:00',
          location: 'Multiple Locations',
          capacity: 0,
          registered: 0,
          status: 'upcoming',
          image: 'https://placehold.co/600x400/a855f7/ffffff?text=Food+Drive'
        },
        {
          id: 5,
          title: 'Volunteer Appreciation Dinner',
          description: 'A special dinner to thank our dedicated volunteers for their service throughout the year.',
          date: '2023-10-10',
          time: '19:00',
          location: 'Community Center',
          capacity: 100,
          registered: 85,
          status: 'completed',
          image: 'https://placehold.co/600x400/ec4899/ffffff?text=Volunteer+Dinner'
        },
        {
          id: 6,
          title: 'Youth Mentorship Workshop',
          description: 'Training session for new mentors in our youth development program.',
          date: '2024-01-15',
          time: '14:00',
          location: 'Education Center',
          capacity: 30,
          registered: 12,
          status: 'upcoming',
          image: 'https://placehold.co/600x400/14b8a6/ffffff?text=Mentorship+Workshop'
        },
        {
          id: 7,
          title: 'Fundraising Concert',
          description: 'Live music event featuring local artists to raise funds for our programs.',
          date: '2024-02-28',
          time: '20:00',
          location: 'City Auditorium',
          capacity: 500,
          registered: 320,
          status: 'upcoming',
          image: 'https://placehold.co/600x400/f43f5e/ffffff?text=Fundraising+Concert'
        }
      ];
      
      setEvents(sampleEvents);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'capacity') {
      comparison = a.capacity - b.capacity;
    } else if (sortBy === 'registered') {
      comparison = a.registered - b.registered;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open modal for adding new event
  const openAddModal = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      status: 'upcoming',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing event
  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      status: event.status,
      image: event.image
    });
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create/update the event
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...formData } : event
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      const newEvent = {
        id: events.length + 1,
        ...formData,
        registered: 0,
        image: formData.image || `https://placehold.co/600x400/3b82f6/ffffff?text=${encodeURIComponent(formData.title)}`
      };
      setEvents([...events, newEvent]);
    }
    
    setIsModalOpen(false);
  };

  // Handle event deletion
  const handleDelete = () => {
    // In a real app, this would be an API call to delete the event
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setIsDeleteModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading events...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Events Management - Charity NGO Admin</title>
        <meta name="description" content="Admin panel for managing charity events" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Events Management</h1>
            
            <button 
              className="btn btn-primary btn-sm gap-1"
              onClick={openAddModal}
            >
              <FiPlus size={16} /> Add New Event
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-base-100 rounded-lg shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-grow">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="input input-bordered w-full" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
                    <FiSearch size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="form-control">
                  <select 
                    className="select select-bordered" 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <select 
                    className="select select-bordered" 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="capacity">Sort by Capacity</option>
                    <option value="registered">Sort by Registrations</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-outline btn-square"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-base-100 rounded-lg shadow-lg overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.length > 0 ? (
                  currentEvents.map(event => (
                    <tr key={event.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={event.image} alt={event.title} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{event.title}</div>
                            <div className="text-sm opacity-70 line-clamp-1">{event.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm opacity-70">
                          <FiClock size={14} />
                          <span>{event.time}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <FiMapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <FiUsers size={14} />
                          <span>
                            {event.capacity > 0 ? 
                              `${event.registered}/${event.capacity}` : 
                              'Unlimited'}
                          </span>
                        </div>
                        {event.capacity > 0 && (
                          <progress 
                            className={`progress ${getCapacityProgressColor(event.registered, event.capacity)} w-full h-1.5`} 
                            value={event.registered} 
                            max={event.capacity}
                          ></progress>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-ghost btn-xs"
                            onClick={() => openEditModal(event)}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => openDeleteModal(event)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No events found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button 
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button 
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button 
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}

          {/* Event Form Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-base-300 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">
                        {selectedEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Event Title</span>
                          </label>
                          <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="input input-bordered w-full" 
                            required
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Description</span>
                          </label>
                          <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered h-24" 
                            required
                          ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Date</span>
                            </label>
                            <input 
                              type="date" 
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className="input input-bordered" 
                              required
                            />
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Time</span>
                            </label>
                            <input 
                              type="time" 
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              className="input input-bordered" 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Location</span>
                          </label>
                          <input 
                            type="text" 
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="input input-bordered" 
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Capacity (0 for unlimited)</span>
                            </label>
                            <input 
                              type="number" 
                              name="capacity"
                              value={formData.capacity}
                              onChange={handleInputChange}
                              className="input input-bordered" 
                              min="0"
                              required
                            />
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Status</span>
                            </label>
                            <select 
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="select select-bordered" 
                              required
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Image URL (optional)</span>
                          </label>
                          <input 
                            type="text" 
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="input input-bordered" 
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit"
                        className="btn btn-primary w-full sm:w-auto sm:ml-2"
                      >
                        {selectedEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button 
                        type="button"
                        className="btn btn-ghost w-full sm:w-auto mt-3 sm:mt-0"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && selectedEvent && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-base-300 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4 text-error">
                      Delete Event
                    </h3>
                    
                    <p>Are you sure you want to delete the event <strong>"{selectedEvent.title}"</strong>?</p>
                    <p className="mt-2 text-sm">This action cannot be undone.</p>
                  </div>
                  
                  <div className="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button"
                      className="btn btn-error w-full sm:w-auto sm:ml-2"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button 
                      type="button"
                      className="btn btn-ghost w-full sm:w-auto mt-3 sm:mt-0"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}

// Helper functions
function getStatusBadgeColor(status) {
  switch (status) {
    case 'upcoming':
      return 'badge-primary';
    case 'completed':
      return 'badge-success';
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
}

function getCapacityProgressColor(registered, capacity) {
  const percentage = (registered / capacity) * 100;
  if (percentage >= 90) return 'progress-error';
  if (percentage >= 75) return 'progress-warning';
  return 'progress-success';
}