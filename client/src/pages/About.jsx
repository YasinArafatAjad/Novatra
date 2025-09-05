import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import SEOHelmet from '../components/SEOHelmet'
import { useTheme } from '../contexts/ThemeContext'

const About = () => {
  const { isDark } = useTheme()

  useEffect(() => {
    // Animate sections on mount
    gsap.fromTo('.about-section', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
    )
  }, [])

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Fashion industry veteran with 15+ years of experience in retail and e-commerce.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Creative director passionate about sustainable fashion and innovative design.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience Manager',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dedicated to ensuring every customer has an exceptional shopping experience.'
    }
  ]

  const values = [
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'We are committed to eco-friendly practices and sustainable fashion choices.'
    },
    {
      icon: '✨',
      title: 'Quality',
      description: 'Every product is carefully selected and tested to meet our high standards.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Building a community of fashion enthusiasts who share our values.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Constantly evolving to bring you the latest trends and technologies.'
    }
  ]

  return (
    <>
      <SEOHelmet 
        title="About Us"
        description="Learn about TechStyle's mission, values, and the team behind your favorite fashion destination."
        keywords="about techstyle, fashion company, sustainable clothing, team"
      />

      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-primary-50 to-blue-50'}`}>
          <div className="container mx-auto px-4">
            <div className="about-section max-w-4xl mx-auto text-center">
              <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                About TechStyle
              </h1>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We're passionate about bringing you the latest in fashion and technology. 
                Our mission is to make high-quality, stylish clothing accessible to everyone 
                while maintaining our commitment to sustainability and innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="about-section">
                <h2 className={`text-3xl lg:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Our Story
                </h2>
                <div className={`space-y-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Founded in 2020, TechStyle began as a small startup with a big vision: 
                    to revolutionize the way people shop for clothing online. We noticed a 
                    gap in the market for a platform that combined cutting-edge technology 
                    with sustainable fashion practices.
                  </p>
                  <p>
                    What started as a team of three passionate individuals has grown into 
                    a thriving company serving thousands of customers worldwide. We've 
                    maintained our core values while scaling our operations to meet the 
                    growing demand for conscious fashion choices.
                  </p>
                  <p>
                    Today, we continue to innovate and expand our offerings, always keeping 
                    our customers and the planet at the heart of everything we do.
                  </p>
                </div>
              </div>
              <div className="about-section">
                <img
                  src="https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our team working together"
                  className="rounded-2xl shadow-xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <div className="about-section text-center mb-16">
              <h2 className={`text-3xl lg:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Our Values
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                These core principles guide every decision we make and every product we offer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className={`about-section text-center p-6 rounded-xl card-hover ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value.title}
                  </h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="about-section text-center mb-16">
              <h2 className={`text-3xl lg:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Meet Our Team
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                The passionate individuals behind TechStyle's success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className={`about-section text-center p-6 rounded-xl card-hover ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-500">
          <div className="container mx-auto px-4 text-center">
            <div className="about-section max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Discover our latest collections and become part of the TechStyle family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-white text-primary-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 btn-hover"
                >
                  Shop Now
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-500 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About