import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs } from "@/api/Subscribtion/AuditLog/AuditLog";
import type { SubscriptionAuditLogItem } from "@/api/Subscribtion/AuditLog/AuditLog";

export default function AuditLogsPage() {
  const { t, i18n } = useTranslation();
  const [auditLogs, setAuditLogs] = useState<SubscriptionAuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  useEffect(() => {
    setLoading(true);
    getAuditLogs(15, page)
      .then((response) => {
        setAuditLogs((prev) =>
          page === 1 ? response.data.data : [...prev, ...response.data.data]
        );
        setTotalPages(response.data.totalPages);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error fetching audit logs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      if (page >= totalPages) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages]);

  const columns = [
    {
      key: "created_at",
      title: t("auditLogs.timestamp"),
      render: (value: string) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleString()}
        </div>
      ),
    },
    {
      key: "action",
      title: t("auditLogs.action"),
      render: (value: string) => (
        <Badge
          className={cn(
            value === "LOGIN" && "bg-green-100 text-green-800",
            value === "UPDATE" && "bg-blue-100 text-blue-800",
            value === "DELETE" && "bg-red-100 text-red-800",
            value === "CREATE" && "bg-yellow-100 text-yellow-800",
            value === "VIEW" && "bg-gray-100 text-gray-800"
          )}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "user",
      title: t("auditLogs.user"),
      render: (_: any, record: SubscriptionAuditLogItem) => (
        <div className="font-medium text-[#1A5F5E]">
          {record.user?.first_name} {record.user?.last_name}
        </div>
      ),
    },
    {
      key: "description",
      title: t("auditLogs.details"),
      render: (value: string) => <div className="text-sm">{value}</div>,
    },
  ];

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <div className={cn("border-b pb-4", isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold text-[#1A5F5E]">
          {t("auditLogs.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("auditLogs.description")}
        </p>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={auditLogs} searchable />
      </Card>
    </div>
  );
}
