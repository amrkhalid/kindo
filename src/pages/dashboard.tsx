import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { School, Users, FileText, Calendar, TrendingUp, DollarSign, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
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

  // Sample data - replace with actual data from your API
  const stats = {
    activeKindergartens: 12,
    totalChildren: 245,
    totalGroups: 18,
    totalPayments: 52500,
    monthlyGrowth: '+15%',
    attendanceRate: '95%',
    totalTeachers: 45,
    totalClasses: 24,
    averageAttendance: '92%'
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")}>
      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.activeKindergartens')}
          value={stats.activeKindergartens}
          icon={<School className="h-5 w-5 text-white" />}
          className="bg-[#1A5F5E] border-[#1A5F5E]/20 hover:bg-[#1A5F5E]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.totalChildren')}
          value={stats.totalChildren}
          icon={<Users className="h-5 w-5 text-white" />}
          className="bg-[#165690] border-[#165690]/20 hover:bg-[#165690]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.totalTeachers')}
          value={stats.totalTeachers}
          icon={<BookOpen className="h-5 w-5 text-white" />}
          className="bg-[#CC9400] border-[#CC9400]/20 hover:bg-[#CC9400]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.totalClasses')}
          value={stats.totalClasses}
          icon={<Clock className="h-5 w-5 text-white" />}
          className="bg-[#2F742C] border-[#2F742C]/20 hover:bg-[#2F742C]/90 transition-colors shadow-lg"
          color="white"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('dashboard.monthlyGrowth')}
          value={stats.monthlyGrowth}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          className="bg-[#1A5F5E] border-[#1A5F5E]/20 hover:bg-[#1A5F5E]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.attendanceRate')}
          value={stats.attendanceRate}
          icon={<Calendar className="h-5 w-5 text-white" />}
          className="bg-[#165690] border-[#165690]/20 hover:bg-[#165690]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.totalPayments')}
          value={`$${stats.totalPayments.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          className="bg-[#CC9400] border-[#CC9400]/20 hover:bg-[#CC9400]/90 transition-colors shadow-lg"
          color="white"
        />
        <StatsCard
          title={t('dashboard.averageAttendance')}
          value={stats.averageAttendance}
          icon={<Users className="h-5 w-5 text-white" />}
          className="bg-[#2F742C] border-[#2F742C]/20 hover:bg-[#2F742C]/90 transition-colors shadow-lg"
          color="white"
        />
      </div>

      {/* Additional Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('dashboard.noRecentActivity')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('dashboard.noUpcomingEvents')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 