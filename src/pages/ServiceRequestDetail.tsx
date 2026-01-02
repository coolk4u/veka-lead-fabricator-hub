import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, Settings, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ServiceRequestDetail {
  id: string;
  displayId: string;
  customerName: string;
  address: string;
  phone: string;
  issue: string;
  priority: string;
  status: string;
  date: string;
  assignedTime: string;
  technicianName: string;
  technicianId: string;
  description: string;
}

// Dummy data for service requests
const DUMMY_SERVICE_REQUESTS: ServiceRequestDetail[] = [
  {
    id: '1',
    displayId: 'SR-001',
    customerName: 'John Smith',
    address: '123 Main St, New York, NY 10001, USA',
    phone: '+1 (555) 123-4567',
    issue: 'HVAC System Failure',
    priority: 'high',
    status: 'open',
    date: '2024-01-15',
    assignedTime: '10:30 AM',
    technicianName: 'Rajesh Kumar',
    technicianId: '8301',
    description: 'Customer reported complete HVAC system failure. No cooling or heating functions working.'
  },
  {
    id: '2',
    displayId: 'SR-002',
    customerName: 'Sarah Johnson',
    address: '456 Oak Ave, Chicago, IL 60601, USA',
    phone: '+1 (555) 987-6543',
    issue: 'Refrigerator Not Cooling',
    priority: 'medium',
    status: 'in-progress',
    date: '2024-01-14',
    assignedTime: '2:00 PM',
    technicianName: 'Michael Chen',
    technicianId: '8302',
    description: 'Refrigerator running but not maintaining cold temperature. Suspected compressor issue.'
  },
  {
    id: '3',
    displayId: 'SR-003',
    customerName: 'Robert Williams',
    address: '789 Pine Rd, Los Angeles, CA 90001, USA',
    phone: '+1 (555) 456-7890',
    issue: 'Washing Machine Leak',
    priority: 'low',
    status: 'completed',
    date: '2024-01-13',
    assignedTime: '9:00 AM',
    technicianName: 'David Miller',
    technicianId: '8303',
    description: 'Water leakage during spin cycle. Drain hose may be clogged or damaged.'
  }
];

const ServiceRequestDetail = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { toast } = useToast();

  const [notes, setNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [serviceRequest, setServiceRequest] = useState<ServiceRequestDetail | null>(null);

  // Fetch service request details from dummy data
  useEffect(() => {
    const fetchRequestDetail = () => {
      if (!requestId) return;

      // Simulate API delay
      setTimeout(() => {
        // Find the request by displayId or fallback to first one
        const request = DUMMY_SERVICE_REQUESTS.find(req => 
          req.displayId === requestId || req.id === requestId
        ) || DUMMY_SERVICE_REQUESTS[0];
        
        setServiceRequest(request);
      }, 300);
    };

    fetchRequestDetail();
  }, [requestId]);

  const handleMarkComplete = () => {
    if (!actionTaken.trim()) {
      toast({
        title: "Action Required",
        description: "Please describe the action taken to fix the issue.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Completed",
        description: "Service request has been updated successfully."
      });

      // Simulate navigation after success
      setTimeout(() => {
        navigate('/service-requests');
      }, 1000);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!serviceRequest) {
    return <div className="p-6 text-gray-600">Loading service request...</div>;
  }

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
            <span className="font-medium text-gray-600">{serviceRequest.displayId}</span>
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
        {/* Customer Info */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(serviceRequest.priority)}`}></div>
                {serviceRequest.customerName}
              </CardTitle>
              <Badge className={`${getStatusColor(serviceRequest.status)} rounded-full px-3 py-1`}>
                {serviceRequest.status === 'open'
                  ? 'Open'
                  : serviceRequest.status === 'in-progress'
                  ? 'In Progress'
                  : 'Completed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
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
              <p className="text-sm text-gray-800">
                {serviceRequest.date} at {serviceRequest.assignedTime}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Issue Info */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
          </CardContent>
        </Card>

        {/* Technician Info */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Assigned Technician</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="text-sm text-gray-800">{serviceRequest.technicianName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Technician ID</p>
              <p className="text-sm text-gray-800">{serviceRequest.technicianId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Job Performed</CardTitle>
          </CardHeader>
          <CardContent>
          <select
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select an action taken</option>
            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            <option value="Replaced Under Warranty">Replaced Under Warranty</option>
            <option value="Awaiting Customer Response">Awaiting Customer Response</option>
            <option value="Not Covered">Not Covered</option>
            <option value="Repair Completed">Repair Completed</option>
          </select>
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
    </div>
  );
};

export default ServiceRequestDetail;
