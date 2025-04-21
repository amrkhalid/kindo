
import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, FileText, ClipboardList } from "lucide-react";
import { kindergartens, children, groups, payments, auditLogs } from "@/lib/data";

const Index = () => {
  // Calculate stats
  const activeKindergartens = kindergartens.filter(k => k.isActive).length;
  const totalChildren = children.length;
  const totalGroups = groups.length;
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Recent logs
  const recentLogs = [...auditLogs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kindergarten Bloom Hub</h1>
          <p className="text-muted-foreground">Welcome to your kindergarten management dashboard</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Kindergartens"
            value={activeKindergartens}
            icon={<School className="h-4 w-4 text-muted-foreground" />}
            className="bg-kindergarten-green/20"
          />
          <StatsCard
            title="Total Children"
            value={totalChildren}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            className="bg-kindergarten-blue/20"
          />
          <StatsCard
            title="Groups"
            value={totalGroups}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            className="bg-kindergarten-yellow/20"
          />
          <StatsCard
            title="Total Payments"
            value={`$${totalPayments.toLocaleString()}`}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            className="bg-kindergarten-pink/20"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-2 rounded-md border animate-fadeInUp">
                    <div className="rounded-full p-2 bg-primary/10">
                      <ClipboardList className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{log.action} by {log.fullName}</p>
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Kindergartens</CardTitle>
              <CardDescription>Latest kindergartens added to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kindergartens
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((kindergarten) => (
                    <div key={kindergarten.id} className="flex items-start space-x-4 p-2 rounded-md border animate-fadeInUp">
                      <div className="rounded-full p-2 bg-kindergarten-green/20">
                        <School className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{kindergarten.name}</p>
                        <p className="text-sm text-muted-foreground">{kindergarten.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {kindergarten.isActive ? "Active" : "Inactive"} • Added {new Date(kindergarten.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
