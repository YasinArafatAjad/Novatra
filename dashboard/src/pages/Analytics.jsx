import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { DashboardCard } from '../components/DashboardCard'

const Analytics = () => {
  return (
    <>
      <SEOHelmet 
        title="Analytics - Clothing Dashboard"
        description="Detailed analytics and insights for your clothing business"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Conversion Rate"
              value="3.2%"
              change="+0.4%"
              icon="📈"
              color="green"
            />
            <DashboardCard
              title="Avg Order Value"
              value="৳87.50"
              change="+৳12.30"
              icon="💵"
              color="blue"
            />
            <DashboardCard
              title="Return Rate"
              value="2.1%"
              change="-0.3%"
              icon="🔄"
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-4">
                {[
                  { category: 'Dresses', percentage: 35, sales: '৳12,450' },
                  { category: 'Tops', percentage: 28, sales: '৳9,870' },
                  { category: 'Bottoms', percentage: 22, sales: '৳7,650' },
                  { category: 'Accessories', percentage: 15, sales: '৳4,230' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-gray-900">{item.sales}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[65, 80, 75, 90, 85, 95, 88].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-400 rounded-t transition-all duration-700 hover:bg-primary-500"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Analytics