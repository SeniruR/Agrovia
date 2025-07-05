import React from 'react';
import { Package, TrendingUp, Users, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, Badge, Button, Grid, Container } from '../ui';

const ExampleDashboard = () => {
  // Sample data
  const stats = [
    {
      title: 'Total Crops',
      value: '156',
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'text-agrovia-600',
      bgColor: 'bg-agrovia-100'
    },
    {
      title: 'Active Orders',
      value: '89',
      change: '+8%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+15%',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue',
      value: 'Rs. 45,780',
      change: '-3%',
      changeType: 'decrease',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentOrders = [
    { id: 1, customer: 'John Silva', crop: 'Rice', quantity: '50kg', status: 'completed', amount: 'Rs. 2,500' },
    { id: 2, customer: 'Mary Fernando', crop: 'Tomatoes', quantity: '25kg', status: 'pending', amount: 'Rs. 1,875' },
    { id: 3, customer: 'David Perera', crop: 'Carrots', quantity: '30kg', status: 'processing', amount: 'Rs. 1,200' },
    { id: 4, customer: 'Sarah Kumari', crop: 'Potatoes', quantity: '40kg', status: 'completed', amount: 'Rs. 1,600' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-neutral-600">
            Welcome back! Here's what's happening with your farm today.
          </p>
        </div>

        {/* Stats Cards */}
        <Grid cols={4} gap="md" className="mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-600">{stat.title}</p>
            </Card>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid cols={3} gap="lg">
          {/* Recent Orders */}
          <div className="col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Recent Orders
                </h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium text-neutral-900">
                            {order.customer}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            {order.crop} - {order.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge status={order.status}>
                        {order.status}
                      </Badge>
                      <span className="font-semibold text-neutral-900">
                        {order.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Crop
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Orders
                </Button>
                
                <Button variant="ghost" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial Reports
                </Button>
              </div>
            </Card>

            {/* Performance Summary */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                This Month
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Orders Completed</span>
                  <span className="font-semibold text-agrovia-600">42</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Customer Satisfaction</span>
                  <span className="font-semibold text-agrovia-600">4.8/5</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Response Time</span>
                  <span className="font-semibold text-agrovia-600">2.3h</span>
                </div>
              </div>
            </Card>
          </div>
        </Grid>

        {/* Action Bar */}
        <div className="mt-8 p-6 bg-agrovia-50 rounded-xl border border-agrovia-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-agrovia-900 mb-1">
                Ready to expand your reach?
              </h3>
              <p className="text-agrovia-700">
                List more crops and connect with buyers across Sri Lanka.
              </p>
            </div>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ExampleDashboard;
