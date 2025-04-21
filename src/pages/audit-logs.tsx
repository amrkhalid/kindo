
import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DataTable } from "@/components/ui/data-table";
import { auditLogs } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const AuditLogsPage = () => {
  const getBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-500';
      case 'UPDATE':
        return 'bg-blue-500';
      case 'DELETE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const columns = [
    {
      key: "action",
      title: "Action",
      render: (value: string) => (
        <Badge className={getBadgeColor(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: "fullName",
      title: "Full Name",
    },
    {
      key: "message",
      title: "Message",
    },
    {
      key: "description",
      title: "Description",
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">System audit trails and activity records</p>

        <DataTable
          columns={columns}
          data={auditLogs}
          title="All Audit Logs"
        />
      </div>
    </MainLayout>
  );
};

export default AuditLogsPage;
