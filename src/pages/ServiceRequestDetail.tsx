
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, Settings, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ServiceRequestDetail = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  // Mock data - in real app this would come from API
  const serviceRequest = {
    id: requestId,
    customerName: 'Rajesh Kumar',
    address: 'Plot 45, Banjara Hills, Hyderabad - 500034',
    phone: '+91 9876543210',
    issue: 'Window handle broken',
    description: 'The window handle in the living room has broken and needs immediate replacement. Customer unable to open/close the window.',
    priority: 'high',
    status: 'open',
    date: '2024-01-15',
    assignedTime: '10:00 AM',
    technicianName: 'Rajesh Kumar',
    technicianId: '8301'
  };

  const handleMarkComplete = () => {
    if (!actionTaken.trim()) {
      toast({
        title: "Action Required",
        description: "Please describe the action taken to fix the issue.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Request Completed",
      description: "Service request has been marked as completed successfully."
    });
    
    navigate('/service-requests');
  };

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
            onClick={() => navigate('/service-requests')}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Service Request</h1>
            <p className="text-sm text-gray-500">{serviceRequest.id}</p>
          </div>
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

      <div className="p-4 space-y-4">
        {/* Customer Info Card */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(serviceRequest.priority)}`}></div>
                {serviceRequest.customerName}
              </CardTitle>
              <Badge className={`${getStatusColor(serviceRequest.status)} rounded-full px-3 py-1`}>
                {serviceRequest.status === 'open' ? 'Open' : 
                 serviceRequest.status === 'in-progress' ? 'In Progress' : 
                 'Completed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-800">{serviceRequest.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="text-sm text-gray-800">{serviceRequest.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Scheduled Time</p>
                <p className="text-sm text-gray-800">{serviceRequest.date} at {serviceRequest.assignedTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issue Details Card */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Issue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Issue Type</p>
                <p className="text-sm font-medium text-red-600">{serviceRequest.issue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-800">{serviceRequest.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Priority</p>
                <Badge className={`${getPriorityColor(serviceRequest.priority)} text-white rounded-full px-3 py-1 text-xs`}>
                  {serviceRequest.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technician Info Card */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Assigned Technician</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-sm text-gray-800">{serviceRequest.technicianName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Technician ID</p>
                <p className="text-sm text-gray-800">{serviceRequest.technicianId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Taken */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Action Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the action taken to fix the issue..."
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="rounded-xl border-gray-200 min-h-[100px]"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any additional notes or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl border-gray-200 min-h-[100px]"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleMarkComplete}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 text-white rounded-2xl shadow-lg"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
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

export default ServiceRequestDetail;
