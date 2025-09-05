import { Link } from 'react-router-dom'
import { FiHome, FiSearch } from 'react-icons/fi'
import SEOHelmet from '../components/SEOHelmet'

const NotFound = () => {
  return (
    <>
      <SEOHelmet 
        title="Page Not Found"
        description="The page you're looking for doesn't exist"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 pt-16 lg:pt-20">
        <div className="max-w-lg w-full text-center">
          <div className="animate-bounce-in">
            {/* 404 Number */}
            <div className="text-8xl lg:text-9xl font-bold text-primary-500 mb-4">
              404
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 btn-hover"
              >
                <FiHome className="w-5 h-5 mr-2" />
                Go Home
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                <FiSearch className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You might be looking for:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/products?category=gadgets"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Gadgets
                </Link>
                <Link
                  to="/products?category=clothing"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clothing
                </Link>
                <Link
                  to="/about"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound