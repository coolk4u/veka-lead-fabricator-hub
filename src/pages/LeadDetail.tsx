import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LeadDetail = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [leadStatus, setLeadStatus] = useState('in-progress');

  // Mock lead data
  const leadData = {
    id: leadId,
    customerName: 'Echo Canyon',
    address: '5197 Enclave',
    phone: '+1 (555) 123-4567',
    email: 'contact@echocanyon.com',
    date: '14 Oct 2024, 09:12',
    status: 'in-progress',
    priority: 'medium',
    existingNotes: 'Customer interested in premium windows for new construction project. Requires quote for 12 windows.'
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
    // In a real app, this would save to a database
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
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
      <div className="bg-yellow-500 text-white p-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/leads')}
            className="text-white hover:bg-yellow-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Ticket</h1>
            <p className="text-yellow-100">Last Sync: 2 minutes ago</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lead Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(leadData.priority)}`}></div>
                {leadData.id}
              </CardTitle>
              <Badge className={getStatusColor(leadStatus)}>
                {leadStatus.replace('-', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{leadData.customerName}</h3>
              <p className="text-gray-600">{leadData.address}</p>
              <p className="text-gray-600">{leadData.phone}</p>
              <p className="text-gray-600">{leadData.email}</p>
              <p className="text-sm text-gray-500">{leadData.date}</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={leadStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Product Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Product Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-select">Select Veka Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product-select">
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
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Selected: {selectedProduct}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{leadData.existingNotes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Add Notes */}
        <Card>
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
              />
            </div>
            
            <Button 
              onClick={handleSaveNotes}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
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
