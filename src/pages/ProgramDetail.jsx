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
          { name: 'Dr. Sarah Johnson', role: 'Program Director', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
          { name: 'Michael Ochieng', role: 'Regional Coordinator', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { name: 'Emma Williams', role: 'Water Engineer', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
          { name: 'David Mutua', role: 'Community Liaison', image: 'https://randomuser.me/api/portraits/men/75.jpg' }
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
            <h3 className="text-2xl font-semibold mb-4">Photo Gallery</h3>
            <div className="grid grid-cols-2 gap-2">
              {program.gallery.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${program.title} - Gallery image ${index + 1}`} 
                  className="rounded-lg object-cover w-full h-32"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Program Team</h3>
            <div className="grid grid-cols-2 gap-4">
              {program.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={member.image} alt={member.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{member.name}</div>
                    <div className="text-sm opacity-70">{member.role}</div>
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
        <h3 className="text-2xl font-semibold mb-4">Program Updates</h3>
        <div className="space-y-6">
          {program.updates.map((update, index) => (
            <div key={index} className="card bg-base-300/50">
              <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="card-title">{update.title}</h4>
                  <span className="text-sm opacity-70">{update.date}</span>
                </div>
                <p>{update.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    faq: (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {program.faqs.map((faq, index) => (
            <div key={index} className="collapse collapse-plus bg-base-300/50">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-lg font-medium">
                {faq.question}
              </div>
              <div className="collapse-content"> 
                <p>{faq.answer}</p>
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

      <div className="relative h-96 bg-base-300">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-300 to-transparent"></div>
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

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="tabs tabs-boxed mb-8">
              <a 
                className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </a>
              <a 
                className={`tab ${activeTab === 'updates' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('updates')}
              >
                Updates
              </a>
              <a 
                className={`tab ${activeTab === 'faq' ? 'tab-active' : ''}`}
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
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4">Program Progress</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Fundraising Goal</span>
                    <span>${program.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${program.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>${program.raised.toLocaleString()} raised</span>
                    <span>{program.progress}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="btn btn-primary w-full gap-2">
                    <FiDollarSign /> Donate to This Program
                  </button>
                  <button className="btn btn-outline w-full gap-2">
                    <FiClock /> Volunteer Your Time
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4">Share This Program</h3>
                <div className="flex justify-between">
                  <button className="btn btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>
                  <button className="btn btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </button>
                  <button className="btn btn-circle btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </button>
                  <button className="btn btn-circle btn-outline">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-4">Related Programs</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" 
                      alt="Education Program" 
                      className="rounded-md w-16 h-16 object-cover"
                    />
                    <div>
                      <h4 className="font-medium">Education for All</h4>
                      <p className="text-sm text-base-content/70 line-clamp-2">Ensuring access to quality education for underprivileged children.</p>
                      <Link to="/programs/2" className="text-primary text-sm hover:underline">View Program</Link>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" 
                      alt="Sustainable Farming" 
                      className="rounded-md w-16 h-16 object-cover"
                    />
                    <div>
                      <h4 className="font-medium">Sustainable Farming</h4>
                      <p className="text-sm text-base-content/70 line-clamp-2">Teaching sustainable agricultural practices to improve food security.</p>
                      <Link to="/programs/4" className="text-primary text-sm hover:underline">View Program</Link>
                    </div>
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