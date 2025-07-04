
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VekaCarousel from '@/components/VekaCarousel';
import { User, Settings, Bell, Gift } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardStats = {
    totalLeads: 45,
    openLeads: 13,
    inProgressLeads: 2,
    convertedLeads: 18,
    serviceRequests: 8
  };

  const monthlyData = [
    { month: 'Jan', leads: 32 },
    { month: 'Feb', leads: 28 },
    { month: 'Mar', leads: 35 },
    { month: 'Apr', leads: 42 },
    { month: 'May', leads: 38 },
    { month: 'Jun', leads: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-600" />
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div>
          <p className="text-gray-600 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Rajesh Kumar</h1>
          <p className="text-sm text-gray-500">Check our latest updates</p>
        </div>

        {/* Main Feature Card - Now Clickable */}
        <Card 
          className="bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 text-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => navigate('/leads')}
        >
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Lead Management</h3>
                <p className="text-white/90 text-sm">Active leads tracking</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">+2</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>{dashboardStats.totalLeads} Total</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                <span>{dashboardStats.inProgressLeads} Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                <span>{dashboardStats.convertedLeads} Converted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests Widget */}
        <Card 
          className="bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => navigate('/service-requests')}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Open Service Requests</h3>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{dashboardStats.serviceRequests}</span>
              </div>
            </div>
            <p className="text-white/90 text-sm">Assigned to your team</p>
          </CardContent>
        </Card>

        {/* Recent Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Recent leads</h2>
              <p className="text-sm text-gray-500">Assigned to your team</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={() => navigate('/leads')}
            >
              →
            </Button>
          </div>

          <div className="space-y-3">
            <div 
              className="flex items-center gap-3 p-3 bg-white/70 rounded-2xl cursor-pointer hover:bg-white/90 transition-colors"
              onClick={() => navigate('/lead/LD-001')}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Rajesh Reddy - Windows</p>
                <p className="text-xs text-gray-500">Banjara Hills</p>
              </div>
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-white/70 rounded-2xl cursor-pointer hover:bg-white/90 transition-colors"
              onClick={() => navigate('/lead/LD-002')}
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Priya Sharma - Doors</p>
                <p className="text-xs text-gray-500">Jubilee Hills</p>
              </div>
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">⚠</span>
              </div>
            </div>
          </div>
        </div>

        {/* Veka Carousel */}
        <VekaCarousel />

        {/* Monthly Leads Chart */}
        <Card className="rounded-3xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Monthly Leads Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rewards Tile */}
        <Card className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-3xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Total Rewards Earned</h3>
                </div>
                <div className="text-3xl font-bold mb-1">₹2,000</div>
                <p className="text-white/90 text-sm">in last one month</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎁</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/dashboard')}>
            <div className="w-6 h-6 mb-1 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🏠</span>
            </div>
            <span className="text-xs text-blue-500 font-medium">Home</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/leads')}>
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">📋</span>
            </div>
            <span className="text-xs text-gray-500">Leads</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/service-requests')}>
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">🔧</span>
            </div>
            <span className="text-xs text-gray-500">Service</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3">
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">📊</span>
            </div>
            <span className="text-xs text-gray-500">Reports</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3">
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">☰</span>
            </div>
            <span className="text-xs text-gray-500">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
