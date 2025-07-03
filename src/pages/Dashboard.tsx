
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VekaCarousel from '@/components/VekaCarousel';
import { User, Settings } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardStats = {
    totalLeads: 45,
    openLeads: 13,
    inProgressLeads: 2,
    convertedLeads: 18
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Rajesh Kumar</h1>
          <p className="text-sm text-gray-500">Fabricator ID: 8301</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-red-500 text-white rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1">{dashboardStats.openLeads}</div>
              <div className="text-red-100 text-sm">Unconfirmed</div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-blue-500 text-white rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/leads?status=in-progress')}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1">{dashboardStats.inProgressLeads}</div>
              <div className="text-blue-100 text-sm">In Progress</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-600 text-white rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1">4</div>
              <div className="text-gray-300 text-sm">Unclosed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500 text-white rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-1">{dashboardStats.convertedLeads}</div>
              <div className="text-green-100 text-sm">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Service Work Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-600 text-white rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-blue-200 mb-2">TODAY</div>
              <div className="text-lg font-semibold mb-4">Service Work</div>
              <div className="space-y-1 text-sm">
                <div>Rajesh Kumar</div>
                <div className="text-blue-200">Banjara Hills, Hyderabad</div>
                <div className="text-blue-200">Door - Window, 500034</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-600 text-white rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="text-sm text-blue-200 mb-2">TODAY</div>
              <div className="text-lg font-semibold mb-4">Service Work</div>
              <div className="space-y-1 text-sm">
                <div>Priya Sharma</div>
                <div className="text-blue-200">Jubilee Hills, Hyderabad</div>
                <div className="text-blue-200">Conservatory, 500033</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Veka Carousel */}
        <VekaCarousel />

        {/* Monthly Leads Chart */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Monthly Leads Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/leads')}
            className="bg-blue-500 hover:bg-blue-600 h-16 text-lg rounded-2xl shadow-lg"
          >
            View All Leads
          </Button>
          <Button 
            onClick={() => navigate('/leads?status=in-progress')}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 h-16 text-lg rounded-2xl shadow-lg"
          >
            In Progress Leads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
