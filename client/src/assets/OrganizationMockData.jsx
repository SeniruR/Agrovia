export const mockFarmers = [
  {
    id: 'F001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Farm Road, Rural County, State 12345',
    farmSize: 150,
    cropTypes: ['Corn', 'Soybeans', 'Wheat'],
    experience: 12,
    status: 'pending',
    applicationDate: '2024-01-15T10:30:00Z',
    documents: [
      {
        id: 'doc1',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license.pdf',
        uploadDate: '2024-01-15T10:30:00Z'
      },
      {
        id: 'doc2',
        name: 'Insurance Certificate',
        type: 'PDF',
        url: '/documents/insurance.pdf',
        uploadDate: '2024-01-15T10:32:00Z'
      }
    ],
    notes: 'Experienced farmer with excellent references. Has been farming organically for the past 5 years.'
  },
  {
    id: 'F002',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+1 (555) 234-5678',
    address: '456 Valley Road, Farm County, State 12346',
    farmSize: 85,
    cropTypes: ['Tomatoes', 'Peppers', 'Lettuce'],
    experience: 8,
    status: 'approved',
    applicationDate: '2024-01-12T14:20:00Z',
    documents: [
      {
        id: 'doc3',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license-2.pdf',
        uploadDate: '2024-01-12T14:20:00Z'
      }
    ],
    notes: 'Specializes in organic vegetables. Strong community involvement.'
  },
  {
    id: 'F003',
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Hill Street, Agriculture Town, State 12347',
    farmSize: 200,
    cropTypes: ['Cotton', 'Peanuts'],
    experience: 15,
    status: 'pending',
    applicationDate: '2024-01-18T09:15:00Z',
    documents: [
      {
        id: 'doc4',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license-3.pdf',
        uploadDate: '2024-01-18T09:15:00Z'
      },
      {
        id: 'doc5',
        name: 'Soil Test Results',
        type: 'PDF',
        url: '/documents/soil-test.pdf',
        uploadDate: '2024-01-18T09:20:00Z'
      }
    ]
  },
  {
    id: 'F004',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 456-7890',
    address: '321 Green Lane, Harvest City, State 12348',
    farmSize: 45,
    cropTypes: ['Herbs', 'Spinach', 'Kale'],
    experience: 6,
    status: 'rejected',
    applicationDate: '2024-01-10T16:45:00Z',
    documents: [
      {
        id: 'doc6',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license-4.pdf',
        uploadDate: '2024-01-10T16:45:00Z'
      }
    ],
    notes: 'Application rejected due to incomplete documentation. Applicant may resubmit with additional required documents.'
  },
  {
    id: 'F005',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 567-8901',
    address: '654 Prairie Avenue, Crop County, State 12349',
    farmSize: 300,
    cropTypes: ['Barley', 'Oats', 'Rye'],
    experience: 20,
    status: 'approved',
    applicationDate: '2024-01-08T11:30:00Z',
    documents: [
      {
        id: 'doc7',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license-5.pdf',
        uploadDate: '2024-01-08T11:30:00Z'
      },
      {
        id: 'doc8',
        name: 'Equipment Inventory',
        type: 'PDF',
        url: '/documents/equipment.pdf',
        uploadDate: '2024-01-08T11:35:00Z'
      }
    ],
    notes: 'Long-standing member of the farming community with excellent track record.'
  },
  {
    id: 'F006',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1 (555) 678-9012',
    address: '987 Meadow Drive, Field Town, State 12350',
    farmSize: 120,
    cropTypes: ['Apples', 'Pears', 'Cherries'],
    experience: 10,
    status: 'pending',
    applicationDate: '2024-01-20T13:00:00Z',
    documents: [
      {
        id: 'doc9',
        name: 'Farm License',
        type: 'PDF',
        url: '/documents/farm-license-6.pdf',
        uploadDate: '2024-01-20T13:00:00Z'
      },
      {
        id: 'doc10',
        name: 'Organic Certification',
        type: 'PDF',
        url: '/documents/organic-cert.pdf',
        uploadDate: '2024-01-20T13:05:00Z'
      }
    ],
    notes: 'Fruit farmer transitioning to organic methods. Good references from suppliers.'
  }
];

export const mockStats = {
  totalApplications: 6,
  pendingApplications: 3,
  approvedApplications: 2,
  rejectedApplications: 1,
  thisWeekApplications: 4
};