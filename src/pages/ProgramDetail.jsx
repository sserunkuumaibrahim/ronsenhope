import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiClock, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API fetch
    const fetchProgram = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample program data
      const programData = {
        id: parseInt(id),
        title: 'Clean Water Initiative',
        category: 'environment',
        location: 'East Africa',
        participants: 5000,
        startDate: 'January 2023',
        endDate: 'December 2025',
        description: 'Providing clean and safe drinking water to communities in need through sustainable water solutions.',
        longDescription: `Access to clean water is a fundamental human right, yet millions of people around the world still lack this basic necessity. Our Clean Water Initiative aims to address this critical issue by implementing sustainable water solutions in communities across East Africa.

Through a combination of well-drilling, rainwater harvesting systems, and water purification technologies, we're working to ensure that families have reliable access to safe drinking water. This not only improves health outcomes but also reduces the time spent collecting water, allowing children to attend school and adults to engage in productive activities.

Our approach involves close collaboration with local communities to ensure that solutions are appropriate for their specific needs and can be maintained long-term. We also provide education on water conservation, hygiene practices, and system maintenance to maximize the impact of our interventions.`,
        image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1520116468816-95b69f847357?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1616544030366-f320c7e1be46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ],
        progress: 75,
        budget: 500000,
        raised: 375000,
        goals: [
          'Provide clean water access to 100,000 people',
          'Install 500 water wells across the region',
          'Reduce waterborne diseases by 80% in target communities',
          'Train 1,000 local technicians in system maintenance'
        ],
        impact: [
          '5,000 people now have access to clean water',
          '50 wells installed in 25 communities',
          '60% reduction in waterborne diseases reported',
          '120 local technicians trained'
        ],
        team: [
          { 
            name: 'Dr. Sarah Johnson', 
            role: 'Program Director', 
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            experience: 12,
            email: 'sarah.johnson@cleanwater.org',
            specialties: ['Water Systems Management', 'Public Health', 'Project Leadership'],
            education: 'PhD in Environmental Engineering, MIT',
            bio: 'Leading water access initiatives across Africa for over a decade with expertise in sustainable development.'
          },
          { 
            name: 'Michael Ochieng', 
            role: 'Regional Coordinator', 
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            experience: 8,
            email: 'michael.ochieng@cleanwater.org',
            specialties: ['Community Engagement', 'Local Partnerships', 'Cultural Integration'],
            education: 'MSc in Development Studies, University of Nairobi',
            bio: 'Native to the region with deep understanding of local communities and sustainable development practices.'
          },
          { 
            name: 'Emma Williams', 
            role: 'Water Engineer', 
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            experience: 6,
            email: 'emma.williams@cleanwater.org',
            specialties: ['Well Drilling', 'Pump Systems', 'Water Quality Testing'],
            education: 'BEng in Civil Engineering, Imperial College London',
            bio: 'Specialized in designing and implementing water infrastructure solutions for rural communities.'
          },
          { 
            name: 'David Mutua', 
            role: 'Community Liaison', 
            image: 'https://randomuser.me/api/portraits/men/75.jpg',
            experience: 10,
            email: 'david.mutua@cleanwater.org',
            specialties: ['Community Mobilization', 'Training Programs', 'Stakeholder Relations'],
            education: 'BA in Social Work, Kenyatta University',
            bio: 'Experienced in building trust and facilitating collaboration between international organizations and local communities.'
          }
        ],
        updates: [
          { date: 'June 15, 2023', title: 'New Region Added', content: 'We\'re expanding our program to include the northern districts, reaching an additional 15 communities.' },
          { date: 'April 3, 2023', title: 'Training Complete', content: '50 new technicians have completed their training and are now supporting their local water systems.' },
          { date: 'February 20, 2023', title: 'Milestone Reached', content: 'We\'ve completed our 50th well installation, providing clean water to over 5,000 people.' }
        ],
        faqs: [
          { question: 'How are communities selected for this program?', answer: 'Communities are selected based on a needs assessment that considers current water access, population density, and vulnerability factors. We work closely with local governments and community leaders to identify priority areas.' },
          { question: 'What technologies are being used?', answer: 'We implement a range of solutions including deep wells with hand pumps, solar-powered pumping systems, rainwater harvesting structures, and point-of-use water purification methods. The specific technology is chosen based on local conditions and needs.' },
          { question: 'How is sustainability ensured?', answer: 'We train local technicians to maintain the systems and establish water committees that collect small user fees to fund ongoing maintenance. We also partner with local governments to ensure long-term support.' },
          { question: 'Can I volunteer for this program?', answer: 'Yes! We welcome volunteers with relevant skills, particularly in engineering, public health, and community development. Visit our volunteer page to learn more.' }
        ]
      };
      
      setProgram(programData);
      setLoading(false);
    };

    fetchProgram();
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
            {program.goals.map((goal, index) => (
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
            {program.impact.map((impact, index) => (
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
              {program.gallery.map((image, index) => (
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
              {program.team.map((member, index) => (
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
                              <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
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
          {program.updates.map((update, index) => (
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
          {program.faqs.map((faq, index) => (
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
        <title>{program.title} - Charity NGO</title>
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
                  <span>{program.participants.toLocaleString()} participants</span>
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
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-200/40 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Program Progress</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Fundraising Goal</span>
                    <span className="text-lg font-bold text-green-600">${program.budget.toLocaleString()}</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full transition-all duration-1000 ease-out relative" 
                        style={{ width: `${program.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white drop-shadow-lg">{program.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">${program.raised.toLocaleString()} raised</span>
                    <span className="text-gray-600">${(program.budget - program.raised).toLocaleString()} remaining</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                  <div className="space-y-3">
                    <div dangerouslySetInnerHTML={{
                      __html: `
                        <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
                        <a class="dbox-donation-button" style="background: rgb(223, 24, 167); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: 100%; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px; justify-content: center;" href="https://donorbox.org/survive-and-thrive-804282?"><img src="https://donorbox.org/images/white_logo.svg" alt="Donate with DonorBox"/>Donate to This Program</a>
                      `
                    }} />
                  <Link to="/volunteer" className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
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