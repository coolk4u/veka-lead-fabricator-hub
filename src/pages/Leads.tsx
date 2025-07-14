import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, User, Settings } from 'lucide-react';

// Salesforce Opportunity API shape
interface OpportunityRecord {
  Id: string;
  Name: string;
  StageName: string;
  CreatedDate: string;
  Account?: {
    BillingStreet?: string;
    BillingCity?: string;
    BillingState?: string;
    BillingPostalCode?: string;
  };
  OpportunityContactRoles?: {
    records?: {
      Contact?: {
        FirstName?: string;
        LastName?: string;
      };
    }[];
  };
}

// Local Lead model
interface Lead {
  id: string; // Opportunity ID (internal use)
  opportunityName: string;
  customerName: string;
  address: string;
  date: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
}

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Step 1: Fetch Access Token
  useEffect(() => {
    const fetchAccessToken = async () => {
      const salesforceUrl = 'https://gtmdataai-dev-ed.develop.my.salesforce.com/services/oauth2/token';
      const clientId = '3MVG9OGq41FnYVsFObrvP_I4DU.xo6cQ3wP75Sf7rxOPMtz0Ofj5RIDyM83GlmVkGFbs_0aLp3hlj51c8GQsq';
      const clientSecret = 'A9699851D548F0C076BB6EB07C35FEE1822752CF5B2CC7F0C002DC4ED9466492';

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      try {
        const response = await axios.post(salesforceUrl, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        setAccessToken(response.data.access_token);
        console.log('✅ Access Token:', response.data.access_token);
      } catch (err) {
        console.error('❌ Failed to fetch access token:', err);
      }
    };

    fetchAccessToken();
  }, []);

  // Step 2: Fetch Opportunity Data After Token is Available
  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://gtmdataai-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=SELECT+Id,Name,StageName,CreatedDate,Fabricator_Name__c,Length__c,Breadth__c,Depth__c,Quantity__c,LeadSource,Account.Id,Account.Name,Account.BillingStreet,Account.BillingCity,Account.BillingState,Account.BillingPostalCode,Account.BillingCountry,(SELECT+Id,Quantity,UnitPrice,TotalPrice,PricebookEntry.Product2.Name,PricebookEntry.Product2.ProductCode,PricebookEntry.Product2.Description+FROM+OpportunityLineItems),(SELECT+Contact.Id,Contact.FirstName,Contact.LastName+FROM+OpportunityContactRoles)+FROM+Opportunity+WHERE+Fabricator_Name__c='Rajesh Kumar'",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        );

        const transformed: Lead[] = (response.data.records as OpportunityRecord[]).map((opp) => {
          const contact = opp.OpportunityContactRoles?.records?.[0]?.Contact || {};
          const customerName = `${contact.FirstName || ''} ${contact.LastName || ''}`.trim();
          const address = `${opp.Account?.BillingStreet || ''}, ${opp.Account?.BillingCity || ''}, ${opp.Account?.BillingState || ''} - ${opp.Account?.BillingPostalCode || ''}`;
          const status = opp.StageName || 'unknown';
          const date = new Date(opp.CreatedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

          let priority: 'high' | 'medium' | 'low' = 'low';
          if (status.includes('closed')) priority = 'high';
          else if (status.includes('in')) priority = 'medium';

          return {
            id: opp.Id,
            opportunityName: opp.Name,
            customerName,
            address,
            status,
            date,
            priority,
          };
        });

        setLeads(transformed);
      } catch (error: any) {
        console.error('Error fetching opportunities:', error.response?.data || error.message);
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.opportunityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
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

  const handleFilterClick = (status: string | null) => {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Leads ({filteredLeads.length})</h1>
            <p className="text-sm text-gray-500">Last Sync: Just now</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="icon" className="rounded-full"><User className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Settings className="w-5 h-5" /></Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="p-4">
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 rounded-xl h-12 bg-white/70 backdrop-blur-sm"
        />

        <div className="flex gap-2 flex-wrap mb-4">
          {['all', 'active', 'in-progress', 'completed'].map(s => (
            <Badge
              key={s}
              className={`cursor-pointer px-4 py-2 rounded-full bg-white/90 text-gray-800 border border-gray-300 shadow-sm ${statusFilter === s ? 'bg-blue-200' : ''}`}
              onClick={() => handleFilterClick(s === 'all' ? null : s)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                      <span className="font-medium text-gray-600">{lead.opportunityName}</span> {/* 👈 Name shown here */}
                      <span className="text-sm text-gray-500">{lead.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{lead.customerName}</h3>
                    <p className="text-sm text-gray-600 mb-1">Delivery to:</p>
                    <p className="text-sm text-gray-800">{lead.address}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(lead.status)} rounded-full px-3 py-1`}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No leads found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
