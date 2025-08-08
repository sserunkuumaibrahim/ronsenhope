import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(blogsQuery);
      const blogsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'Unknown date'
      }));
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setBlogs(blogs.filter(blog => blog.id !== id));
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Blog Management - Admin Dashboard</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link to="/admin/blog/create" className="btn btn-primary gap-2">
          <FiPlus /> Create New Post
        </Link>
      </div>

      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Search blogs..." 
              className="input input-bordered w-full pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No blog posts found</p>
            {blogs.length > 0 && searchTerm && (
              <p className="text-base-content/70 mt-2">Try adjusting your search criteria</p>
            )}
            {blogs.length === 0 && (
              <Link to="/admin/blog/create" className="btn btn-primary mt-4 gap-2">
                <FiPlus /> Create your first blog post
              </Link>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div className="font-medium">{blog.title}</div>
                        <div className="text-sm opacity-70 truncate max-w-xs">{blog.excerpt}</div>
                      </td>
                      <td>
                        <div className="badge badge-primary">{blog.category}</div>
                      </td>
                      <td>{blog.createdAt}</td>
                      <td>
                        <div className="flex space-x-2">
                          <Link to={`/blog/${blog.id}`} className="btn btn-sm btn-ghost" title="View">
                            <FiEye />
                          </Link>
                          <Link to={`/admin/blog/edit/${blog.id}`} className="btn btn-sm btn-ghost" title="Edit">
                            <FiEdit />
                          </Link>
                          <button 
                            onClick={() => handleDelete(blog.id)} 
                            className="btn btn-sm btn-ghost text-error" 
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}