import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi'
import { useApi } from '../hooks/useApi'
import { gsap } from 'gsap'
import SEOHelmet from '../components/SEOHelmet'
import ProductCard from '../components/ProductCard'
import BannerSlider from '../components/BannerSlider'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()

  useEffect(() => {
    loadFeaturedProducts()
    animateElements()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const response = await apiCall('/products/public/featured')
      if (response.data.success) {
        setFeaturedProducts(response.data.data)
      }
    } catch (error) {
      console.error('Error loading featured products:', error)
      // Set some mock products for demo
      setFeaturedProducts([
        {
          _id: '1',
          name: 'Summer Dress',
          price: 89.99,
          category: 'Dresses',
          stock: 10,
          images: [{ url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' }]
        },
        {
          _id: '2',
          name: 'Classic Shirt',
          price: 45.50,
          category: 'Tops',
          stock: 15,
          images: [{ url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' }]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const animateElements = () => {
    // Animate hero section
    gsap.fromTo('.hero-content', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    )

    // Animate feature cards
    gsap.fromTo('.feature-card', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.2, delay: 0.5 }
    )

    // Animate product cards
    gsap.fromTo('.product-card', 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.8 }
    )
  }

  const features = [
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Secure Payment',
      description: 'Your payment information is safe'
    },
    {
      icon: <FiHeadphones className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it'
    },
    {
      icon: <FiStar className="w-8 h-8" />,
      title: 'Quality Products',
      description: 'Only the best products for you'
    }
  ]

  return (
    <>
      <SEOHelmet 
        title="Home"
        description="Discover the latest gadgets and trendy clothing at TechStyle. Quality products, fast delivery, and exceptional customer service."
        keywords="ecommerce, gadgets, clothing, electronics, fashion, online shopping"
      />

      <div className="pt-16 lg:pt-20">
        {/* Banner Slider */}
        <BannerSlider />

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-dark-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="feature-card text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className="text-primary-500 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50 dark:bg-dark-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our handpicked selection of the best products across all categories
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <div key={product._id} className="product-card">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 btn-hover"
              >
                View All Products
                <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white dark:bg-dark-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Find exactly what you're looking for in our organized categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link
                to="/products?category=gadgets"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white card-hover"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Gadgets & Electronics</h3>
                  <p className="text-blue-100 mb-4">Latest tech gadgets and electronic devices</p>
                  <div className="inline-flex items-center text-white font-medium">
                    Shop Now <FiArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              </Link>

              <Link
                to="/products?category=clothing"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 p-8 text-white card-hover"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Fashion & Clothing</h3>
                  <p className="text-pink-100 mb-4">Trendy clothes and fashion accessories</p>
                  <div className="inline-flex items-center text-white font-medium">
                    Shop Now <FiArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive deals.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="bg-white text-primary-500 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300 btn-hover"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home