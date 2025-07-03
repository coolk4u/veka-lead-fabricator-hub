
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const ServiceRequests = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const serviceRequests = [
    {
      id: 'SR-001',
      customerName: 'Rajesh Kumar',
      address: 'Plot 45, Banjara Hills, Hyderabad - 500034',
      issue: 'Window handle broken',
      priority: 'high',
      status: 'open',
      date: '2024-01-15',
      assignedTime: '10:00 AM'
    },
    {
      id: 'SR-002',
      customerName: 'Priya Sharma',
      address: '205, Jubilee Hills, Road No. 36, Hyderabad - 500033',
      issue: 'Door lock mechanism issue',
      priority: 'medium',
      status: 'in-progress',
      date: '2024-01-15',
      assignedTime: '2:00 PM'
    },
    {
      id: 'SR-003',
      customerName: 'Venkat Rao',
      address: '12-3-456, Begumpet, Hyderabad - 500016',
      issue: 'Glass panel replacement',
      priority: 'low',
      status: 'open',
      date: '2024-01-16',
      assignedTime: '11:00 AM'
    },
    {
      id: 'SR-004',
      customerName: 'Sanjay Gupta',
      address: '78, Kukatpally Housing Board, Hyderabad - 500072',
      issue: 'Weather strip replacement',
      priority: 'medium',
      status: 'completed',
      date: '2024-01-14',
      assignedTime: '9:00 AM'
    }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    if (!selectedDate) return true;
    return request.date === format(selectedDate, 'yyyy-MM-dd');
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Service Requests</h1>
            <p className="text-sm text-gray-500">({filteredRequests.length} requests)</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar Filter */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full justify-start rounded-xl h-12 bg-white/70"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
          </Button>
          
          {showCalendar && (
            <Card className="mt-2 p-4 bg-white/90 backdrop-blur-sm rounded-2xl">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                className="rounded-md border-0"
              />
            </Card>
          )}
        </div>

        {/* Service Requests List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm"
              onClick={() => navigate(`/service-request/${request.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`}></div>
                      <span className="font-medium text-gray-600">{request.id}</span>
                      <span className="text-sm text-gray-500">{request.assignedTime}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{request.customerName}</h3>
                    <p className="text-sm text-gray-600 mb-1">Issue:</p>
                    <p className="text-sm text-red-600 font-medium mb-2">{request.issue}</p>
                    <p className="text-sm text-gray-600 mb-1">Address:</p>
                    <p className="text-sm text-gray-800">{request.address}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(request.status)} rounded-full px-3 py-1`}>
                      {request.status === 'open' ? 'Open' : 
                       request.status === 'in-progress' ? 'In Progress' : 
                       'Completed'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No service requests found for the selected date.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/dashboard')}>
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">🏠</span>
            </div>
            <span className="text-xs text-gray-500">Home</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/leads')}>
            <div className="w-6 h-6 mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-xs">📋</span>
            </div>
            <span className="text-xs text-gray-500">Leads</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 px-3" onClick={() => navigate('/service-requests')}>
            <div className="w-6 h-6 mb-1 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🔧</span>
            </div>
            <span className="text-xs text-blue-500 font-medium">Service</span>
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

export default ServiceRequests;
