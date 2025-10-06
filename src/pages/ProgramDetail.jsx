import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiClock, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        const programDoc = doc(db, 'programs', id);
        const programSnapshot = await getDoc(programDoc);
        
        if (programSnapshot.exists()) {
          const programData = {
            id: programSnapshot.id,
            ...programSnapshot.data(),
            createdAt: programSnapshot.data().createdAt?.toDate?.() || new Date(),
            updatedAt: programSnapshot.data().updatedAt?.toDate?.() || new Date()
          };
          setProgram(programData);
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error('Error fetching program:', error);
        setProgram(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-16 md:py-24 flex justify-center items-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading program details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!program) {
    return (
      <MainLayout>
        <div className="container-custom py-16 md:py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
          <p className="mb-8">The program you're looking for doesn't exist or has been removed.</p>
          <Link to="/programs" className="btn btn-primary">
            <FiArrowLeft className="mr-2" /> Back to Programs
          </Link>
        </div>
      </MainLayout>
    );
  }

  const tabContent = {
    overview: (
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">About This Program</h3>
          <div className="whitespace-pre-line text-base-content/80">
            {program.longDescription}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Program Goals</h3>
          <ul className="space-y-2">
            {(program?.goals || []).map((goal, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-6 w-6 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Current Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(program?.impact || []).map((impact, index) => (
              <div key={index} className="bg-base-300/50 p-4 rounded-lg">
                <svg className="h-6 w-6 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>{impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Photo Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
              {(program?.gallery || []).map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={image} 
                    alt={`${program.title} - Gallery image ${index + 1}`} 
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">Image {index + 1}</span>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Program Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {(program?.team || []).map((member, index) => (
                <div key={index} className="flex items-center space-x-3 group relative">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={member.image} alt={member.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{member.name}</div>
                    <div className="text-sm opacity-70">{member.role}</div>
                  </div>
                  
                  {/* Detailed Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{member.name}</div>
                          <div className="text-sm text-pink-600 font-medium">{member.role}</div>
                          <div className="text-xs text-gray-500">{member.experience} years experience</div>
                        </div>
                      </div>
                      
                      {/* Bio */}
                      {member.bio && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-700 leading-relaxed">{member.bio}</p>
                        </div>
                      )}
                      
                      {/* Education */}
                      {member.education && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-800 mb-1">Education</div>
                          <div className="text-xs text-gray-600">{member.education}</div>
                        </div>
                      )}
                      
                      {/* Specialties */}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-800 mb-2">Specialties</div>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Contact */}
                      {member.email && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs font-semibold text-gray-800 mb-1">Contact</div>
                          <div className="text-xs text-blue-600 hover:text-blue-800">{member.email}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-1px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    updates: (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-6">Program Updates</h3>
        <div className="grid gap-6">
          {(program?.updates || []).map((update, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.02]">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-200/40 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-1">{update.title}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-blue-600">{update.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-blue-700">UPDATE #{index + 1}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-gray-700 leading-relaxed">{update.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    faq: (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="grid gap-6">
          {(program?.faqs || []).map((faq, index) => (
            <div key={index} className="group">
              <div className="collapse collapse-plus bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <input type="radio" name="faq-accordion" className="peer" /> 
                <div className="collapse-title text-lg font-semibold text-gray-800 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="flex-1">{faq.question}</span>
                  </div>
                </div>
                <div className="collapse-content bg-white"> 
                  <div className="pt-4 pb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{program.title} - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content={program.description} />
      </Helmet>

      <div className="relative h-96 bg-gray-100">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/programs" className="btn btn-sm btn-ghost gap-1 mb-4">
                <FiArrowLeft /> Back to Programs
              </Link>
              <h1 className="text-4xl font-bold mb-2">{program.title}</h1>
              <p className="text-lg mb-4 max-w-2xl">{program.description}</p>
              <div className="flex flex-wrap gap-4">
                <span className="badge badge-lg">{program.category}</span>
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  <span>{program.startDate} - {program.endDate}</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  <span>{Array.isArray(program.participants) ? program.participants.length.toLocaleString() : (program.participants || 0).toLocaleString()} participants</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="tabs tabs-boxed mb-8">
              <a 
                className={`tab ${activeTab === 'overview' ? 'tab-active text-primary' : 'text-black bg-white/80 hover:bg-white hover:text-gray-500'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </a>
              <a 
                className={`tab ${activeTab === 'updates' ? 'tab-active text-primary' : 'text-black bg-white/80 hover:bg-white hover:text-gray-500'}`}
                onClick={() => setActiveTab('updates')}
              >
                Updates
              </a>
              <a 
                className={`tab ${activeTab === 'faq' ? 'tab-active text-primary' : 'text-black bg-white/80 hover:bg-white hover:text-gray-500'}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </a>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-green-50/50 border border-green-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
              <div className="p-6 bg-white">
                  <div className="space-y-3">
                    <div dangerouslySetInnerHTML={{
                      __html: `
                        <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
                        <a class="dbox-donation-button" style="background: rgb(223, 24, 167); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: 100%; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px; justify-content: center; border: 2px solid rgb(223, 24, 167);" href="https://donorbox.org/survive-and-thrive-804282?"><img src="https://donorbox.org/images/white_logo.svg" alt="Donate with DonorBox"/>Donate to This Program</a>
                      `
                    }} />
                  <Link to="/volunteer" className="w-full border-2 border-primary text-primary hover:bg-orange-50 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <FiClock className="w-5 h-5" /> Volunteer Your Time
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-200/40 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FiShare2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Share This Program</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <button className="group bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">Facebook</span>
                  </button>
                  
                  <button className="group bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">Twitter</span>
                  </button>
                  
                  <button className="group bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">Email</span>
                  </button>
                  
                  <button className="group bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl p-4 transition-all duration-300 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <FiShare2 />
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-700">More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
}