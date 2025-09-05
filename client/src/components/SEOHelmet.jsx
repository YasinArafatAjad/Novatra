import { Helmet } from 'react-helmet-async'

const SEOHelmet = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website'
}) => {
  const siteName = import.meta.env.VITE_WEBSITE_NAME || 'TechStyle'
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const defaultDescription = 'Modern ecommerce platform for gadgets and clothing with fast delivery and secure payments'
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  )
}

export default SEOHelmet