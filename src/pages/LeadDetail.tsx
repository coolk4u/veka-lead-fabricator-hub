import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LeadDetail = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [leadStatus, setLeadStatus] = useState('in-progress');

  // Mock lead data with Hyderabad address
  const leadData = {
    id: leadId,
    customerName: 'Priya Sharma',
    address: '205, Jubilee Hills, Road No. 36, Hyderabad - 500033',
    phone: '+91 98765 43210',
    email: 'priya.sharma@gmail.com',
    date: '14 Oct 2024, 09:12',
    status: 'in-progress',
    priority: 'medium',
    existingNotes: 'Customer interested in premium UPVC windows for 3BHK apartment. Requires quote for 8 windows and 2 sliding doors.',
    salesPerson: {
      name: 'Arun Kumar',
      phone: '+91 87654 32109',
      email: 'arun.kumar@veka.com',
      territory: 'Hyderabad Central'
    }
  };

  const vekaProducts = [
    'VEKA uPVC Windows',
    'VEKA Sliding Doors',
    'VEKA French Doors',
    'VEKA Bi-fold Doors',
    'VEKA Conservatory',
    'VEKA Composite Doors'
  ];

  const handleSaveNotes = () => {
    toast({
      title: "Notes saved successfully",
      description: "Lead information has been updated."
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setLeadStatus(newStatus);
    toast({
      title: "Status updated",
      description: `Lead status changed to ${newStatus.replace('-', ' ')}`
    });
  };

  const handlePhotoCapture = () => {
    toast({
      title: "Photo capture",
      description: "Camera functionality would be implemented here."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500 text-white';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/leads')}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Lead Details</h1>
            <p className="text-sm text-gray-500">Last Sync: 2 minutes ago</p>
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

      <div className="p-4 space-y-6">
        {/* Lead Information */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(leadData.priority)}`}></div>
                {leadData.id}
              </CardTitle>
              <Badge className={`${getStatusColor(leadStatus)} rounded-full px-3 py-1`}>
                {leadStatus === 'active' ? 'Unconfirmed' : 
                 leadStatus === 'in-progress' ? 'In Progress' : 
                 'Completed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{leadData.customerName}</h3>
              <div className="space-y-1 text-gray-600">
                <p>{leadData.address}</p>
                <p>{leadData.phone}</p>
                <p>{leadData.email}</p>
                <p className="text-sm text-gray-500">{leadData.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Person Information */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Sales Person Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-semibold">{leadData.salesPerson.name}</h4>
              <p className="text-gray-600">📞 {leadData.salesPerson.phone}</p>
              <p className="text-gray-600">✉️ {leadData.salesPerson.email}</p>
              <p className="text-gray-600">📍 {leadData.salesPerson.territory}</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={leadStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="rounded-xl h-12">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Unconfirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Product Requirements */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Product Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-select">Select Veka Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product-select" className="rounded-xl h-12">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {vekaProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedProduct && (
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-sm font-medium text-blue-800">Selected: {selectedProduct}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Capture */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Capture Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handlePhotoCapture}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl h-12"
            >
              📷 Click Photo
            </Button>
          </CardContent>
        </Card>

        {/* Existing Notes */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Existing Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">{leadData.existingNotes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Add Notes */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Add Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="rounded-xl"
              />
            </div>
            
            <Button 
              onClick={handleSaveNotes}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl h-12"
              disabled={!notes.trim()}
            >
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetail;
