'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  sales_growth: number;
  created_at: string;
}

export default function SalesDashboard() {
  const [salesData, setSalesData] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesSummary();
  }, []);

  const fetchSalesSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sales-summary`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales summary');
      }
      
      const data = await response.json();
      setSalesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={fetchSalesSummary}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              No sales data is currently available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={fetchSalesSummary}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const kpiCards = [
    {
      title: 'Total Sales',
      value: formatNumber(salesData.total_sales),
      description: 'Total number of sales',
      icon: ShoppingCart,
      trend: salesData.sales_growth,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(salesData.total_revenue),
      description: 'Total revenue generated',
      icon: DollarSign,
      trend: salesData.sales_growth,
    },
    {
      title: 'Sales Growth',
      value: formatPercentage(salesData.sales_growth),
      description: 'Growth compared to last period',
      icon: TrendingUp,
      trend: salesData.sales_growth,
    },
    {
      title: 'Last Updated',
      value: new Date(salesData.created_at).toLocaleDateString(),
      description: new Date(salesData.created_at).toLocaleTimeString(),
      icon: Users,
      trend: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
        <button
          onClick={fetchSalesSummary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                  {card.trend !== 0 && (
                    <span className={`text-xs font-medium ${
                      card.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.trend > 0 ? '↗' : '↘'} {Math.abs(card.trend).toFixed(1)}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
