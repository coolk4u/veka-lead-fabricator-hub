
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    {
      id: 'FT-000932',
      customerName: 'God Detailing',
      address: '620 N. Pope',
      date: '13 Oct 2024, 14:11',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'FT-002263',
      customerName: 'Echo Canyon',
      address: '5197 Enclave',
      date: '14 Oct 2024, 09:12',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: 'FT-003317',
      customerName: 'Echo Canyon',
      address: '4310 Anson, Christoval',
      date: '13 Oct 2024, 23:06',
      status: 'in-progress',
      priority: 'low'
    },
    {
      id: 'FT-003318',
      customerName: 'Riverside Construction',
      address: '1234 Main Street',
      date: '15 Oct 2024, 10:30',
      status: 'completed',
      priority: 'high'
    },
    {
      id: 'FT-003319',
      customerName: 'Green Valley Homes',
      address: '5678 Oak Avenue',
      date: '15 Oct 2024, 15:45',
      status: 'active',
      priority: 'medium'
    }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSearch = !searchTerm || 
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-yellow-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Tickets ({filteredLeads.length})</h1>
            <p className="text-yellow-100">Last Sync: 1 day, 11 hours, 12 minutes ago</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Search and Filters */}
        <div className="mb-4">
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant={!statusFilter ? "default" : "secondary"} className="cursor-pointer">
              All
            </Badge>
            <Badge variant={statusFilter === 'active' ? "default" : "secondary"} className="cursor-pointer">
              Active
            </Badge>
            <Badge variant={statusFilter === 'in-progress' ? "default" : "secondary"} className="cursor-pointer">
              In Progress
            </Badge>
            <Badge variant={statusFilter === 'completed' ? "default" : "secondary"} className="cursor-pointer">
              Completed
            </Badge>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <Card 
              key={lead.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/lead/${lead.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                      <span className="font-medium text-gray-600">{lead.id}</span>
                      <span className="text-sm text-gray-500">{lead.date}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1">{lead.customerName}</h3>
                    <p className="text-sm text-gray-600 mb-2">Delivery to:</p>
                    <p className="text-sm text-gray-800">{lead.address}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status.replace('-', ' ')}
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
