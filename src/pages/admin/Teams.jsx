import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiUsers, FiUser, FiUpload } from 'react-icons/fi';
import { ref, push, onValue, off, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { realtimeDb, storage } from '../../firebase/config';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    icon: ''
  });

  const [memberForm, setMemberForm] = useState({ name: '', role: '', avatar: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch teams from Firebase
  useEffect(() => {
    const teamsRef = ref(realtimeDb, 'teams');
    
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
      setLoading(false);
    });

    return () => off(teamsRef, 'value', unsubscribe);
  }, []);

  // Handle team operations
  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const teamsRef = ref(realtimeDb, 'teams');
      await push(teamsRef, {
        ...teamForm,
        members: [],
        createdAt: new Date().toISOString()
      });
      setTeamForm({ name: '', description: '', icon: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      const teamRef = ref(realtimeDb, `teams/${editingTeam.id}`);
      await update(teamRef, {
        name: teamForm.name,
        description: teamForm.description,
        icon: teamForm.icon,
        updatedAt: new Date().toISOString()
      });
      setEditingTeam(null);
      setTeamForm({ name: '', description: '', icon: '' });
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const teamRef = ref(realtimeDb, `teams/${teamId}`);
        await remove(teamRef);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploadingImage(true);
    try {
      const imageRef = storageRef(storage, `team-members/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Upload image
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setMemberForm({ ...memberForm, avatar: imageUrl });
      }
    }
  };

  // Handle member operations
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const team = teams.find(t => t.id === showAddMemberForm);
      const updatedMembers = [...(team.members || []), {
        id: Date.now().toString(),
        ...memberForm
      }];
      
      const teamRef = ref(realtimeDb, `teams/${showAddMemberForm}`);
      await update(teamRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
      
      setMemberForm({ name: '', role: '', avatar: '' });
      setImagePreview(null);
      setShowAddMemberForm(null);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const team = teams.find(t => t.id === editingMember.teamId);
      const updatedMembers = team.members.map(member => 
        member.id === editingMember.memberId ? { ...member, ...memberForm } : member
      );
      
      const teamRef = ref(realtimeDb, `teams/${editingMember.teamId}`);
      await update(teamRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
      
      setEditingMember(null);
      setMemberForm({ name: '', role: '', avatar: '' });
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleDeleteMember = async (teamId, memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        const team = teams.find(t => t.id === teamId);
        const updatedMembers = team.members.filter(member => member.id !== memberId);
        
        const teamRef = ref(realtimeDb, `teams/${teamId}`);
        await update(teamRef, {
          members: updatedMembers,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const startEditTeam = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      icon: team.icon
    });
  };

  const startEditMember = (teamId, member) => {
    setEditingMember({ teamId, memberId: member.id });
    setMemberForm({
      name: member.name,
      role: member.role,
      avatar: member.avatar
    });
    setImagePreview(member.avatar);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Manage your organization's teams and members</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Team
          </button>
        </div>

        {/* Add Team Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Team</h3>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={teamForm.icon}
                    onChange={(e) => setTeamForm({ ...teamForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="🎯"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Save Team
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setTeamForm({ name: '', description: '', icon: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Teams List */}
        <div className="grid gap-6">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md border overflow-hidden"
            >
              {/* Team Header */}
              <div className="p-6 border-b border-gray-200">
                {editingTeam?.id === team.id ? (
                  <form onSubmit={handleUpdateTeam} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                        <input
                          type="text"
                          value={teamForm.name}
                          onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <input
                          type="text"
                          value={teamForm.icon}
                          onChange={(e) => setTeamForm({ ...teamForm, icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={teamForm.description}
                        onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeam(null);
                          setTeamForm({ name: '', description: '', icon: '' });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{team.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                        <p className="text-gray-600 mt-1">{team.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <FiUsers className="w-4 h-4" />
                          {team.members?.length || 0} members
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddMemberForm(team.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <FiUser className="w-3 h-3" />
                        Add Member
                      </button>
                      <button
                        onClick={() => startEditTeam(team)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <FiEdit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Member Form */}
              {showAddMemberForm === team.id && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-lg font-semibold mb-4">Add Team Member</h4>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={memberForm.name}
                          onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={memberForm.role}
                          onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            disabled={uploadingImage}
                          />
                          {uploadingImage && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                              Uploading image...
                            </div>
                          )}
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <FiSave className="w-4 h-4" />
                        Add Member
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMemberForm(null);
                          setMemberForm({ name: '', role: '', avatar: '' });
                          setImagePreview(null);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Team Members */}
              {team.members && team.members.length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Team Members</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.members.map((member) => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                        {editingMember?.teamId === team.id && editingMember?.memberId === member.id ? (
                          <form onSubmit={handleUpdateMember} className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={memberForm.name}
                                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                              <input
                                type="text"
                                value={memberForm.role}
                                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
                              <div className="space-y-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  disabled={uploadingImage}
                                />
                                {uploadingImage && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                                    Uploading image...
                                  </div>
                                )}
                                {imagePreview && (
                                  <div className="mt-2">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1 text-sm"
                              >
                                <FiSave className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMember(null);
                                  setMemberForm({ name: '', role: '', avatar: '' });
                                  setImagePreview(null);
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm"
                              >
                                <FiX className="w-3 h-3" />
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-center">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200"
                            />
                            <h5 className="font-semibold text-gray-900">{member.name}</h5>
                            <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => startEditMember(team.id, member)}
                                className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 transition-colors flex items-center gap-1"
                              >
                                <FiEdit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMember(team.id, member.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center gap-1"
                              >
                                <FiTrash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first team.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <FiPlus className="w-4 h-4" />
              Add Your First Team
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}