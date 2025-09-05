import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SEOHelmet } from '../components/SEOHelmet';
import { useNotification } from '../contexts/NotificationContext';
import { useApi } from '../hooks/useApi';

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'T-Shirt',
    siteDescription: 'Professional clothing dashboard',
    contactEmail: 'admin@T-Shirt.com',
    supportPhone: '+1-234-567-8900',
    address: {
      street: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    businessSettings: {
      currency: 'BDT',
      taxRate: 8,
      shippingFee: 10,
      freeShippingThreshold: 100
    },
    emailSettings: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'T-Shirt Team'
    },
    branding: {
      darkLogo: '',
      lightLogo: '',
      favicon: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { showSuccess, showError } = useNotification();
  const { apiCall } = useApi();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiCall('/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      // Settings might not exist yet, use defaults
      console.log('Using default settings');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiCall('/settings', {
        method: 'POST',
        data: settings
      });
      showSuccess(response.message || 'Settings updated successfully');
    } catch (error) {
      console.error('Settings save error:', error);
      showError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'branding', name: 'Branding', icon: '🎨' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'email', name: 'Email', icon: '📧' }
  ];

  return (
    <>
      <SEOHelmet 
        title="Website Settings - T-Shirt Admin"
        description="Configure website settings and preferences"
      />
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600 mt-1">Configure your website settings and preferences</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-neutral-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                      <input
                        type="tel"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Business Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        <input
                          type="text"
                          value={settings.address.street}
                          onChange={(e) => setSettings({
                            ...settings,
                            address: {...settings.address, street: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={settings.address.city}
                          onChange={(e) => setSettings({
                            ...settings,
                            address: {...settings.address, city: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={settings.address.state}
                          onChange={(e) => setSettings({
                            ...settings,
                            address: {...settings.address, state: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={settings.address.zipCode}
                          onChange={(e) => setSettings({
                            ...settings,
                            address: {...settings.address, zipCode: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={settings.address.country}
                          onChange={(e) => setSettings({
                            ...settings,
                            address: {...settings.address, country: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Settings */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={settings.businessSettings.currency}
                        onChange={(e) => setSettings({
                          ...settings,
                          businessSettings: {...settings.businessSettings, currency: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.businessSettings.taxRate}
                        onChange={(e) => setSettings({
                          ...settings,
                          businessSettings: {...settings.businessSettings, taxRate: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.businessSettings.shippingFee}
                        onChange={(e) => setSettings({
                          ...settings,
                          businessSettings: {...settings.businessSettings, shippingFee: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.businessSettings.freeShippingThreshold}
                        onChange={(e) => setSettings({
                          ...settings,
                          businessSettings: {...settings.businessSettings, freeShippingThreshold: parseFloat(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Settings */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Upload your brand assets to customize the appearance of your dashboard and website.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dark Logo URL</label>
                      <input
                        type="url"
                        value={settings?.branding?.darkLogo || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          branding: {...settings.branding, darkLogo: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://example.com/dark-logo.png"
                      />
                      {settings?.branding?.darkLogo && (
                        <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                          <img 
                            src={settings?.branding?.darkLogo} 
                            alt="Dark Logo Preview" 
                            className="h-8 object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Light Logo URL</label>
                      <input
                        type="url"
                        value={settings?.branding?.lightLogo}
                        onChange={(e) => setSettings({
                          ...settings,
                          branding: {...settings.branding, lightLogo: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://example.com/light-logo.png"
                      />
                      {settings?.branding?.lightLogo && (
                        <div className="mt-2 p-3 bg-white border rounded-lg">
                          <img 
                            src={settings?.branding?.lightLogo} 
                            alt="Light Logo Preview" 
                            className="h-8 object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                      <input
                        type="url"
                        value={settings?.branding?.favicon}
                        onChange={(e) => setSettings({
                          ...settings,
                          branding: {...settings.branding, favicon: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://example.com/favicon.ico"
                      />
                      {settings?.branding?.favicon && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
                          <img 
                            src={settings?.branding?.favicon} 
                            alt="Favicon Preview" 
                            className="h-4 w-4 object-contain"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <span className="text-sm text-gray-600">Favicon Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Settings */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.socialMedia.facebook}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialMedia: {...settings.socialMedia, facebook: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.socialMedia.instagram}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialMedia: {...settings.socialMedia, instagram: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                      <input
                        type="url"
                        value={settings.socialMedia.twitter}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialMedia: {...settings.socialMedia, twitter: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={settings.socialMedia.linkedin}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialMedia: {...settings.socialMedia, linkedin: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="https://linkedin.com/company/yourpage"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Email settings are used for sending order confirmations, password resets, and notifications.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                      <input
                        type="text"
                        value={settings.emailSettings.smtpHost}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, smtpHost: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                      <input
                        type="number"
                        value={settings.emailSettings.smtpPort}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, smtpPort: parseInt(e.target.value)}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                      <input
                        type="text"
                        value={settings.emailSettings.smtpUser}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, smtpUser: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                      <input
                        type="password"
                        value={settings.emailSettings.smtpPassword}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, smtpPassword: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                      <input
                        type="email"
                        value={settings.emailSettings.fromEmail}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, fromEmail: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                      <input
                        type="text"
                        value={settings.emailSettings.fromName}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailSettings: {...settings.emailSettings, fromName: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default WebsiteSettings;