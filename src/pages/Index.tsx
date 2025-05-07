import React from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { School, Users, FileText, TrendingUp, Calendar } from "lucide-react";
import { kindergartens, children, groups, payments } from "@/lib/data";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

const Index = () => {
  const { t, i18n } = useTranslation();
  
  // List of available languages with their directions
  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'he', label: 'עברית', dir: 'rtl' }
  ];

  const isRTL = languages.find(lang => lang.code === i18n.language)?.dir === 'rtl';

  // Calculate stats
  const activeKindergartens = kindergartens.filter(k => k.isActive).length;
  const totalChildren = children.length;
  const totalGroups = groups.length;
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Sample data for charts - replace with actual data
  const monthlyData = [
    { name: 'Jan', children: 65, payments: 4000 },
    { name: 'Feb', children: 72, payments: 4500 },
    { name: 'Mar', children: 85, payments: 5100 },
    { name: 'Apr', children: 90, payments: 5400 },
    { name: 'May', children: 95, payments: 5800 },
    { name: 'Jun', children: 102, payments: 6200 },
  ];

  const recentKindergartens = [
    { name: "Sunshine Kids", date: "2024-03-15", location: "Downtown" },
    { name: "Little Stars", date: "2024-03-14", location: "West Side" },
    { name: "Happy Learners", date: "2024-03-13", location: "North District" },
    { name: "Bright Minds", date: "2024-03-12", location: "East End" },
  ];

  return (
    <div className={cn("space-y-6 p-4 sm:p-6", isRTL ? "rtl" : "ltr")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Kindergartens"
          value={activeKindergartens}
          icon={<School className="h-5 w-5 text-white" />}
          className="bg-[#1A5F5E] border-[#1A5F5E]/20 hover:bg-[#1A5F5E]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title="Total Children"
          value={totalChildren}
          icon={<Users className="h-5 w-5 text-white" />}
          className="bg-[#165690] border-[#165690]/20 hover:bg-[#165690]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title="Groups"
          value={totalGroups}
          icon={<Users className="h-5 w-5 text-white" />}
          className="bg-[#CC9400] border-[#CC9400]/20 hover:bg-[#CC9400]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title="Total Payments"
          value={`$${totalPayments.toLocaleString()}`}
          icon={<FileText className="h-5 w-5 text-white" />}
          className="bg-[#2F742C] border-[#2F742C]/20 hover:bg-[#2F742C]/90 transition-colors shadow-lg"
          color="white"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Children Growth Chart */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#165690]" />
              Children Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="children" 
                    stroke="#165690" 
                    fill="#165690" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Kindergarten Additions */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <School className="h-5 w-5 text-[#1A5F5E]" />
              Recent Kindergarten Additions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentKindergartens.map((k, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 rounded-full bg-[#1A5F5E]/10">
                    <Calendar className="h-4 w-4 text-[#1A5F5E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-500">
                      Added on {new Date(k.date).toLocaleDateString()} • {k.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
