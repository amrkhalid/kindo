import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { School, Users, FileText, Calendar, TrendingUp, DollarSign, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// List of available languages with their directions
const languages = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'he', label: 'עברית', dir: 'rtl' }
];

// Sample data for charts
const monthlyEnrollmentData = [
  { month: 'Jan', children: 180, target: 200 },
  { month: 'Feb', children: 195, target: 200 },
  { month: 'Mar', children: 210, target: 200 },
  { month: 'Apr', children: 225, target: 200 },
  { month: 'May', children: 240, target: 200 },
  { month: 'Jun', children: 245, target: 200 }
];

const ageGroupData = [
  { name: '2-3 years', value: 80 },
  { name: '3-4 years', value: 120 },
  { name: '4-5 years', value: 45 }
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 35000 },
  { month: 'Feb', revenue: 48000, expenses: 36000 },
  { month: 'Mar', revenue: 51000, expenses: 37000 },
  { month: 'Apr', revenue: 49000, expenses: 38000 },
  { month: 'May', revenue: 52000, expenses: 39000 },
  { month: 'Jun', revenue: 52500, expenses: 40000 }
];

const recentActivityData = [
  { id: 1, type: 'enrollment', description: 'New child enrolled in Group A', time: '2 hours ago' },
  { id: 2, type: 'payment', description: 'Monthly payment received from Parent B', time: '4 hours ago' },
  { id: 3, type: 'attendance', description: 'Attendance marked for Group C', time: '6 hours ago' }
];

const COLORS = ['#1A5F5E', '#165690', '#CC9400'];

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language);
  const isRTL = currentLanguage?.dir === 'rtl';
  const { stats } = useSelector((state: RootState) => state.dashboard);

  return (
    <div className={cn("space-y-6 p-6", isRTL ? "rtl" : "ltr")}>
      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.activeKindergartens')}
          value={stats.activeKindergartens}
          icon={<School className="h-5 w-5 text-white" />}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90 transition-colors shadow-lg"
        />
        <StatsCard
          title={t('dashboard.totalChildren')}
          value={stats.totalChildren}
          icon={<Users className="h-5 w-5 text-white" />}
          className="bg-[#165690] hover:bg-[#165690]/90 transition-colors shadow-lg"
        />
        <StatsCard
          title={t('dashboard.totalTeachers')}
          value={stats.totalTeachers}
          icon={<BookOpen className="h-5 w-5 text-white" />}
          className="bg-[#CC9400] hover:bg-[#CC9400]/90 transition-colors shadow-lg"
        />
        <StatsCard
          title={t('dashboard.totalClasses')}
          value={stats.totalClasses}
          icon={<Clock className="h-5 w-5 text-white" />}
          className="bg-[#2F742C] hover:bg-[#2F742C]/90 transition-colors shadow-lg"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.enrollmentTrends')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnrollmentData}>
                <defs>
                  <linearGradient id="colorChildren" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A5F5E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1A5F5E" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="children" 
                  stroke="#1A5F5E" 
                  fillOpacity={1} 
                  fill="url(#colorChildren)" 
                />
                <Line type="monotone" dataKey="target" stroke="#CC9400" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.ageDistribution')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.financialOverview')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#1A5F5E" name={t('dashboard.revenue')} />
              <Bar dataKey="expenses" fill="#CC9400" name={t('dashboard.expenses')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="rounded-full p-2 bg-primary/10">
                    {activity.type === 'enrollment' && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-primary" />}
                    {activity.type === 'attendance' && <Calendar className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Parent-Teacher Meeting</p>
                  <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">End of Year Celebration</p>
                  <p className="text-sm text-muted-foreground">Next Friday at 2:00 PM</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Summer Program Registration</p>
                  <p className="text-sm text-muted-foreground">Starts next Monday</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 