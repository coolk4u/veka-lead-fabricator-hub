
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VekaCarousel from '@/components/VekaCarousel';
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardStats = {
    totalLeads: 45,
    openLeads: 12,
    inProgressLeads: 18,
    convertedLeads: 15
  };

  const monthlyData = [
    { month: 'Jan', leads: 32 },
    { month: 'Feb', leads: 28 },
    { month: 'Mar', leads: 35 },
    { month: 'Apr', leads: 42 },
    { month: 'May', leads: 38 },
    { month: 'Jun', leads: 45 }
  ];

  const handleLogout = () => {
    localStorage.removeItem('fabricatorLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">John Smith</h1>
            <p className="text-yellow-100">Database: 8301</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-yellow-500"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{dashboardStats.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{dashboardStats.openLeads}</div>
              <div className="text-sm text-gray-600">Open Leads</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/leads?status=in-progress')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{dashboardStats.inProgressLeads}</div>
              <div className="text-sm text-gray-600">In Progress</div>
              <ArrowRight className="w-4 h-4 mx-auto mt-1 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{dashboardStats.convertedLeads}</div>
              <div className="text-sm text-gray-600">Converted</div>
            </CardContent>
          </Card>
        </div>

        {/* Veka Carousel */}
        <VekaCarousel />

        {/* Monthly Leads Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Leads Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/leads')}
            className="bg-yellow-500 hover:bg-yellow-600 h-16 text-lg"
          >
            View All Leads
          </Button>
          <Button 
            onClick={() => navigate('/leads?status=in-progress')}
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 h-16 text-lg"
          >
            In Progress Leads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
