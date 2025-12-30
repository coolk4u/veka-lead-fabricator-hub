import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, User, Settings } from 'lucide-react';

// Local Lead model
interface Lead {
  id: string;
  opportunityName: string;
  customerName: string;
  address: string;
  date: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
}

// Dummy data in JSON format
const DUMMY_LEADS: Lead[] = [
  {
    id: '1',
    opportunityName: 'Kitchen Renovation Project',
    customerName: 'John Smith',
    address: '123 Main St, New York, NY - 10001',
    date: 'Mar 15, 2024, 10:30 AM',
    status: 'active',
    priority: 'high'
  },
  {
    id: '2',
    opportunityName: 'Office Furniture Supply',
    customerName: 'Sarah Johnson',
    address: '456 Oak Ave, Chicago, IL - 60607',
    date: 'Mar 14, 2024, 2:15 PM',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: '3',
    opportunityName: 'Hotel Lobby Furniture',
    customerName: 'Robert Chen',
    address: '789 Pine St, San Francisco, CA - 94102',
    date: 'Mar 13, 2024, 9:45 AM',
    status: 'completed',
    priority: 'low'
  },
  {
    id: '4',
    opportunityName: 'Residential Sofa Set',
    customerName: 'Maria Garcia',
    address: '321 Elm St, Miami, FL - 33101',
    date: 'Mar 12, 2024, 4:20 PM',
    status: 'active',
    priority: 'high'
  },
  {
    id: '5',
    opportunityName: 'Conference Room Setup',
    customerName: 'David Wilson',
    address: '654 Birch Rd, Boston, MA - 02108',
    date: 'Mar 11, 2024, 11:10 AM',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: '6',
    opportunityName: 'Restaurant Dining Set',
    customerName: 'Lisa Thompson',
    address: '987 Cedar Ln, Seattle, WA - 98101',
    date: 'Mar 10, 2024, 3:45 PM',
    status: 'completed',
    priority: 'low'
  }
];

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load dummy data
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setLeads(DUMMY_LEADS);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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
            <p className="text-sm text-gray-500">Demo Data Loaded</p>
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
                      <span className="font-medium text-gray-600">{lead.opportunityName}</span>
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
