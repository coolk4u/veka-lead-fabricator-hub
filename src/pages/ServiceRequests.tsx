import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ServiceRequest {
  id: string;
  contactName: string;
  address: string;
  issue: string;
  priority: string;
  status: string;
  date: string;
  assignedTime: string;
}

const ServiceRequests = () => {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const getAccessToken = async () => {
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
    } catch (err) {
      console.error('❌ Error fetching access token:', err);
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const queryUrl =
          "https://gtmdataai-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=SELECT+Id,Contact.Name,Contact.Phone,CaseNumber,Priority,CreatedDate,Reason,Account.BillingStreet,Account.BillingCity,Account.BillingState,Account.BillingPostalCode,Account.BillingCountry+FROM+Case+WHERE+Contact.Name+!=+NULL+AND+Fabricator_Name__c='Rajesh Kumar'";

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const records = response.data.records;

        const formattedData: ServiceRequest[] = records.map((record: any) => {
          const createdDate = parseISO(record.CreatedDate);
          return {
            id: record.CaseNumber,
            contactName: record.Contact?.Name || 'No Contact',
            address: `${record.Account?.BillingStreet || ''}, ${record.Account?.BillingCity || ''}, ${record.Account?.BillingState || ''}, ${record.Account?.BillingPostalCode || ''}, ${record.Account?.BillingCountry || ''}`,
            issue: record.Reason || 'General Issue',
            priority: record.Priority?.toLowerCase() || 'low',
            status:
              record.Priority?.toLowerCase() === 'high'
                ? 'open'
                : record.Priority?.toLowerCase() === 'medium'
                ? 'in-progress'
                : 'completed',
            date: format(createdDate, 'yyyy-MM-dd'),
            assignedTime: format(createdDate, 'p'),
          };
        });

        setServiceRequests(formattedData);
      } catch (error) {
        console.error('❌ Error fetching service requests:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredRequests = serviceRequests.filter((request) => {
    if (!selectedDate) return true;
    return request.date === format(selectedDate, 'yyyy-MM-dd');
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
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
          <Button variant="outline" onClick={() => setShowCalendar(!showCalendar)} className="w-full justify-start rounded-xl h-12 bg-white/70">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedDate ? format(selectedDate, 'PPP') : 'All requests - Select date to filter'}
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
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedDate(undefined);
                  setShowCalendar(false);
                }}>
                  Clear Filter
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Requests List */}
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
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(request.priority)}`} />
                      <span className="font-medium text-gray-600">{request.id}</span>
                      <span className="text-sm text-gray-500">{request.date} {request.assignedTime}</span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{request.contactName}</h3>
                    <p className="text-sm text-gray-600 mb-1">Issue:</p>
                    <p className="text-sm text-red-600 font-medium mb-2">{request.issue}</p>
                    <p className="text-sm text-gray-600 mb-1">Address:</p>
                    <p className="text-sm text-gray-800">{request.address}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(request.status)} rounded-full px-3 py-1`}>
                      {request.status === 'open' ? 'Open' : request.status === 'in-progress' ? 'In Progress' : 'Completed'}
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
