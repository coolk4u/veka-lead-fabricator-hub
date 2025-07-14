import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
  Id: string;
  Name: string;
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

const LeadDetail = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();

  const [accessToken, setAccessToken] = useState<string | null>(null);
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

  // Fetch Salesforce access token
  useEffect(() => {
    const fetchAccessToken = async () => {
      const tokenUrl = 'https://gtmdataai-dev-ed.develop.my.salesforce.com/services/oauth2/token';
      const clientId = '3MVG9OGq41FnYVsFObrvP_I4DU.xo6cQ3wP75Sf7rxOPMtz0Ofj5RIDyM83GlmVkGFbs_0aLp3hlj51c8GQsq';
      const clientSecret = 'A9699851D548F0C076BB6EB07C35FEE1822752CF5B2CC7F0C002DC4ED9466492';

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      try {
        const response = await axios.post(tokenUrl, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        setAccessToken(response.data.access_token);
        console.log('🔐 Access Token Fetched:', response.data.access_token);
      } catch (error) {
        console.error('❌ Failed to fetch access token:', error);
      }
    };

    fetchAccessToken();
  }, []);

  // Fetch lead data using access token
  useEffect(() => {
    const fetchLead = async () => {
      if (!accessToken || !leadId) return;

      try {
        const response = await axios.get(
          `https://gtmdataai-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=SELECT+Id,Name,StageName,CreatedDate,Description,Account.BillingStreet,Account.BillingCity,Account.BillingState,Account.BillingPostalCode,(SELECT+Contact.FirstName,Contact.LastName,Contact.Email,Contact.Phone+FROM+OpportunityContactRoles),(SELECT+Id,PricebookEntry.Product2.Name+FROM+OpportunityLineItems)+FROM+Opportunity+WHERE+Id='${leadId}'`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        );

        const opp = response.data.records[0];
        const contact = opp.OpportunityContactRoles?.records?.[0]?.Contact ?? {};
        const customerName = `${contact.FirstName ?? ''} ${contact.LastName ?? ''}`.trim();
        const address = `${opp.Account?.BillingStreet ?? ''}, ${opp.Account?.BillingCity ?? ''}, ${opp.Account?.BillingState ?? ''} - ${opp.Account?.BillingPostalCode ?? ''}`;
        const status = opp.StageName ?? 'unknown';
        const date = new Date(opp.CreatedDate).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        let priority: 'high' | 'medium' | 'low' = 'low';
        if (status.toLowerCase().includes('closed')) priority = 'high';
        else if (status.toLowerCase().includes('field') || status.toLowerCase().includes('in')) priority = 'medium';

        type OpportunityLineItem = {
          Id: string;
          PricebookEntry?: {
            Product2?: {
              Name?: string;
            };
          };
        };

        const products: Product[] =
          opp.OpportunityLineItems?.records?.map((item: OpportunityLineItem) => ({
            Id: item.Id,
            Name: item.PricebookEntry?.Product2?.Name ?? 'Unknown Product'
          })) ?? [];

        const salesPerson: SalesPerson = {
          name: 'Sai Kiran',
          phone: '+91 87654 32109',
          email: 'sai.kiran@veka.com',
          territory: 'Hyderabad Central'
        };

        setLeadData({
          id: opp.Id,
          opportunityName: opp.Name,
          customerName,
          address,
          phone: contact.Phone ?? 'N/A',
          email: contact.Email ?? 'N/A',
          date,
          status,
          priority,
          existingNotes: opp.Description ?? 'Customer interested in premium UPVC windows...',
          salesPerson,
          products
        });

        setLeadStatus(status);
      } catch (error) {
        console.error('Error fetching lead data:', error);
      }
    };

    fetchLead();
  }, [accessToken, leadId]);

  const handleSaveNotes = async () => {
    if (!accessToken || !leadData?.id) return;

    try {
      await axios.post(
        'https://gtmdataai-dev-ed.develop.my.salesforce.com/services/apexrest/updateVisitNotes',
        {
          type: 'opportunity',
          opportunityId: leadData.id,
          notes,
          stageName: "Assign to Fabricator",
          length: productLength,
          breadth: productBreadth,
          height: productHeight,
          quantity: productQuantity
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: '*/*'
          }
        }
      );

      toast({
        title: 'Opportunity is updated',
        description: 'Opportunity updated in Salesforce.'
      });
      navigate('/leads');
    } catch (error) {
      console.error('Failed to update opportunity:', error);
      toast({
        title: 'Error',
        description: 'Could not update opportunity.'
      });
    }
  };



  const handleStatusChange = (newStatus: string) => {
    setLeadStatus(newStatus);
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
            <p className="text-sm text-gray-500">Last Sync: Just now</p>
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
                {[
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
                ].map(status => (
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
                <SelectItem key={product.Id} value={product.Name}>
                  {product.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Length"
                value={productLength}
                onChange={(e) => setProductLength(e.target.value)}
                className="border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Width"
                value={productBreadth}
                onChange={(e) => setProductBreadth(e.target.value)}
                className="border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Thickness"
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
