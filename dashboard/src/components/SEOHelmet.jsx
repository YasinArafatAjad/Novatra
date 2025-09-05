import { Helmet } from 'react-helmet-async'

export const SEOHelmet = ({ 
  title = "Clothing Dashboard", 
  description = "Professional clothing website dashboard for inventory management, sales tracking, and customer analytics",
  keywords = "clothing, fashion, dashboard, inventory, sales, analytics"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}