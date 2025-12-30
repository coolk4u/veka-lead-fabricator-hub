import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronLeft, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CameraCapture from '@/components/CameraCapture';

interface SalesPerson {
  name: string;
  phone: string;
  email: string;
  territory: string;
}

interface Product {
  id: string;
  name: string;
}

interface LeadData {
  id: string;
  opportunityName: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  date: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  existingNotes: string;
  salesPerson: SalesPerson;
  products: Product[];
}

// Dummy data in JSON format
const DUMMY_LEADS: Record<string, LeadData> = {
  '1': {
    id: '1',
    opportunityName: 'Premium UPVC Windows Installation',
    customerName: 'Rajesh Sharma',
    address: 'H.No 12-34, Jubilee Hills, Hyderabad - 500033',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    date: 'Apr 15, 2024, 10:30 AM',
    status: 'Field Visit - Sales Rep',
    priority: 'high',
    existingNotes: 'Customer interested in premium UPVC windows for their new villa. Looking for noise reduction and thermal insulation features. Budget: ₹5-7 lakhs.',
    salesPerson: {
      name: 'Sai Kiran',
      phone: '+91 87654 32109',
      email: 'sai.kiran@veka.com',
      territory: 'Hyderabad Central'
    },
    products: [
      { id: '101', name: 'UPVC Sliding Window' },
      { id: '102', name: 'UPVC Casement Window' },
      { id: '103', name: 'UPVC French Window' },
      { id: '104', name: 'UPVC Tilt & Turn Window' }
    ]
  },
  '2': {
    id: '2',
    opportunityName: 'Office Partition Glass Work',
    customerName: 'Priya Patel',
    address: 'Tech Park, Hitech City, Hyderabad - 500081',
    phone: '+91 87654 32198',
    email: 'priya.patel@techcorp.com',
    date: 'Apr 14, 2024, 2:15 PM',
    status: 'Qualification',
    priority: 'medium',
    existingNotes: 'Office renovation project. Requires tempered glass partitions for 20 cabins and conference room. Timeline: 4 weeks.',
    salesPerson: {
      name: 'Sai Kiran',
      phone: '+91 87654 32109',
      email: 'sai.kiran@veka.com',
      territory: 'Hyderabad Central'
    },
    products: [
      { id: '201', name: 'Tempered Glass Partition' },
      { id: '202', name: 'Frosted Glass Panel' },
      { id: '203', name: 'Glass Door with Frame' }
    ]
  },
  '3': {
    id: '3',
    opportunityName: 'Residential Balcony Railings',
    customerName: 'Anil Kumar',
    address: 'Flat 304, Skyline Apartments, Banjara Hills, Hyderabad - 500034',
    phone: '+91 76543 21987',
    email: 'anil.kumar@example.com',
    date: 'Apr 13, 2024, 11:00 AM',
    status: 'Prospecting',
    priority: 'low',
    existingNotes: 'Looking for SS railings for 3 balconies. Prefer powder coating in black color.',
    salesPerson: {
      name: 'Sai Kiran',
      phone: '+91 87654 32109',
      email: 'sai.kiran@veka.com',
      territory: 'Hyderabad Central'
    },
    products: [
      { id: '301', name: 'SS 304 Railings' },
      { id: '302', name: 'Powder Coated Railings' },
      { id: '303', name: 'Glass + SS Combination' }
    ]
  }
};

const DUMMY_STATUS_OPTIONS = [
  'Prospecting',
  'Qualification',
  'Field Visit - Sales Rep',
  'Needs Analysis',
  'Assigned to Fabricator',
  'Field Visit - Fabricator',
  'Proposal/Price Quote',
  'Negotiation/Review',
  'Closed Won',
  'Closed Lost'
];

const LeadDetail = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();

  const [notes, setNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [leadStatus, setLeadStatus] = useState('in-progress');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [productLength, setProductLength] = useState('');
  const [productBreadth, setProductBreadth] = useState('');
  const [productHeight, setProductHeight] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  // Fetch lead data from dummy data
  useEffect(() => {
    const fetchLead = () => {
      if (!leadId) return;

      // Simulate API delay
      setTimeout(() => {
        const lead = DUMMY_LEADS[leadId];
        if (lead) {
          setLeadData(lead);
          setLeadStatus(lead.status);
        } else {
          // Fallback to first lead if ID not found
          const firstLead = Object.values(DUMMY_LEADS)[0];
          setLeadData(firstLead);
          setLeadStatus(firstLead.status);
        }
      }, 300); // Small delay to simulate network request
    };

    fetchLead();
  }, [leadId]);

  const handleSaveNotes = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    toast({
      title: 'Success!',
      description: `Notes saved for ${leadData?.customerName}`
    });
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/leads');
    }, 500);
  };

  const handleStatusChange = (newStatus: string) => {
    setLeadStatus(newStatus);
    
    // Update lead data with new status
    if (leadData) {
      setLeadData({
        ...leadData,
        status: newStatus
      });
    }
    
    toast({
      title: 'Status updated',
      description: `Lead status changed to ${newStatus}`
    });
  };

  const handlePhotoCapture = (photoData: string) => {
    setCapturedPhotos(prev => [...prev, photoData]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Prospecting': return 'bg-yellow-100 text-yellow-800';
      case 'Qualification': return 'bg-purple-100 text-purple-800';
      case 'Field Visit - Sales Rep': return 'bg-blue-100 text-blue-800';
      case 'Needs Analysis': return 'bg-indigo-100 text-indigo-800';
      case 'Assigned to Fabricator': return 'bg-teal-100 text-teal-800';
      case 'Field Visit - Fabricator': return 'bg-cyan-100 text-cyan-800';
      case 'Proposal/Price Quote': return 'bg-emerald-100 text-emerald-800';
      case 'Negotiation/Review': return 'bg-orange-100 text-orange-800';
      case 'Closed Won': return 'bg-green-500 text-white';
      case 'Closed Lost': return 'bg-red-500 text-white';
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

  if (!leadData) return <div className="p-4">Loading lead details...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/leads')} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Lead Details</h1>
            <p className="text-sm text-gray-500">Lead ID: {leadData.id}</p>
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
        {/* Lead Info */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(leadData.priority)}`}></div>
                {leadData.opportunityName}
              </CardTitle>
              <Badge className={`${getStatusColor(leadStatus)} rounded-full px-3 py-1`}>
                {leadStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <h3 className="font-semibold text-lg">{leadData.customerName}</h3>
            <p>{leadData.address}</p>
            <p>{leadData.phone}</p>
            <p>{leadData.email}</p>
            <p className="text-sm text-gray-500">{leadData.date}</p>
          </CardContent>
        </Card>

        {/* Sales Person Info */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Sales Person Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{leadData.salesPerson.name}</p>
            <p>📞 {leadData.salesPerson.phone}</p>
            <p>✉️ {leadData.salesPerson.email}</p>
            <p>📍 {leadData.salesPerson.territory}</p>
          </CardContent>
        </Card>

        {/* Update Status */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={leadStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="rounded-xl h-12 bg-white text-black">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {DUMMY_STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Product Requirements Section */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Product Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="rounded-xl h-12 bg-white text-black">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {leadData.products.map(product => (
                  <SelectItem key={product.id} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="Length (ft)"
                  value={productLength}
                  onChange={(e) => setProductLength(e.target.value)}
                  className="border p-2 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Width (ft)"
                  value={productBreadth}
                  onChange={(e) => setProductBreadth(e.target.value)}
                  className="border p-2 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Thickness (mm)"
                  value={productHeight}
                  onChange={(e) => setProductHeight(e.target.value)}
                  className="border p-2 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  className="border p-2 rounded-xl"
                />
              </div>
            )}
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

        {/* Photo Capture */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Capture Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowCamera(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl h-12"
            >
              📷 Click Photo
            </Button>
            {capturedPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {capturedPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="rounded-lg h-32 object-cover border"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Notes */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Add Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add your notes here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="rounded-xl"
            />
            <Button
              onClick={handleSaveNotes}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl h-12"
              disabled={!notes.trim()}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>

      {showCamera && <CameraCapture onPhotoCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />}
    </div>
  );
};

export default LeadDetail;
