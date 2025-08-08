import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogCreate() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    readTime: '5 min read',
  });

  const categories = [
    'general',
    'education',
    'healthcare',
    'environment',
    'community',
    'events',
    'success-stories',
    'partnerships',
    'youth',
    'volunteer'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload a featured image');
      return;
    }

    setLoading(true);

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `blog-images/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Prepare tags array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // Add blog post to Firestore
      const blogData = {
        ...formData,
        tags: tagsArray,
        image: imageUrl,
        author: currentUser.displayName || 'Admin',
        authorId: currentUser.uid,
        authorImage: currentUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.displayName || 'A'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        slug: formData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        metaDescription: formData.excerpt.substring(0, 160),
      };

      await addDoc(collection(db, 'blogs'), blogData);
      toast.success('Blog post created successfully');
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <>
      <Helmet>
        <title>Create Blog Post - Admin Dashboard</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <button 
          onClick={() => navigate('/admin/blog')} 
          className="btn btn-ghost gap-2"
        >
          <FiArrowLeft /> Back to Blog List
        </button>
      </div>

      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Title*</span>
                </div>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title" 
                  className="input input-bordered w-full" 
                  required
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Excerpt/Summary*</span>
                </div>
                <textarea 
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the blog post" 
                  className="textarea textarea-bordered w-full" 
                  rows="3"
                  required
                ></textarea>
              </label>
            </div>

            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Category*</span>
                </div>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Tags</span>
                </div>
                <input 
                  type="text" 
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas" 
                  className="input input-bordered w-full" 
                />
              </label>
            </div>

            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Read Time</span>
                </div>
                <input 
                  type="text" 
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g. 5 min read" 
                  className="input input-bordered w-full" 
                />
              </label>
            </div>

            <div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Featured Image*</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full" 
                  required
                />
              </label>
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md" 
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Content*</span>
                </div>
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleContentChange} 
                  modules={modules}
                  className="h-64 mb-12"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              onClick={() => navigate('/admin/blog')} 
              className="btn btn-ghost gap-2"
              disabled={loading}
            >
              <FiX /> Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <FiSave />
              )}
              Save Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}