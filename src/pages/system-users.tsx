import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Key, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { PageHeader } from "@/components/ui/page-header";
import {
  getUsers,
  createUser,
  deleteUser,
  resetUserPassword,
  updateUser,
} from "@/api/User/user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SystemUser {
  id: string;
  id_no: string;
  username: string;
  email: string;
  first_name?: string;
  second_name?: string;
  third_name?: string;
  last_name?: string;
  gender?: "male" | "female";
  phone_number?: string;
  address?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  password?: string;
}

const SystemUsersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState<Omit<SystemUser, "id">>({
    id_no: "",
    username: "",
    email: "",
    first_name: "",
    second_name: "",
    third_name: "",
    last_name: "",
    gender: "male",
    password: "",
    phone_number: "",
    address: "",
    is_active: true,
    is_superuser: false,
    created_at: "",
    updated_at: "",
  });
  const [page, setPage] = useState(1);

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];

  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: "male" | "female") => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleAddUser = async () => {
    try {
      await createUser(formData);
      toast({ title: t("systemUsers.addSuccess"), variant: "success" });
      setIsAddDialogOpen(false);
      setFormData({
        id_no: "",
        username: "",
        email: "",
        first_name: "",
        second_name: "",
        third_name: "",
        last_name: "",
        gender: "male",
        password: "",
        phone_number: "",
        address: "",
        is_active: true,
      });
      getUsers(15, page).then((res) => setUsers(res.data.data));
    } catch (error: any) {
      toast({
        title: t("systemUsers.addError"),
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, {
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        is_active: formData.is_active,
      });

      toast({
        title: t("systemUsers.editSuccess"),
        variant: "success",
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);

      const res = await getUsers(15, page);
      setUsers(res.data.data);
    } catch (error: any) {
      toast({
        title: t("systemUsers.editError"),
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);

      toast({
        title: t("systemUsers.deleteSuccess"),
        variant: "success",
      });

      // بعد الحذف: إعادة تحميل المستخدمين
      const res = await getUsers(15, page);
      setUsers(res.data.data);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: t("systemUsers.deleteError"),
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };
  const handleResetPassword = async () => {
    if (!selectedUser?.id || !newPassword) return;

    try {
      await resetUserPassword(selectedUser.id, newPassword);

      toast({
        title: t("systemUsers.passwordResetSuccess"),
        variant: "success",
      });

      setIsResetPasswordDialogOpen(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: t("systemUsers.passwordResetError"),
        description:
          error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  // useEffect(() => {
  //   setLoading(true);
  //   getUsers(limit, page)
  //     .then((res) => {
  //       setUsers(res.data.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching users:", err);
  //       setLoading(false);
  //     });
  // }, [limit, page]);

  useEffect(() => {
    setLoading(true);
    getUsers(15, page)
      .then((res) => {
        setUsers((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && page < totalPages && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading]);

  const getFullName = (user: SystemUser) => {
    const names = [
      user.first_name,
      user.second_name,
      user.third_name,
      user.last_name,
    ].filter(Boolean);
    return names.join(" ");
  };

  const columns = [
    {
      key: "id_no" as keyof SystemUser,
      title: t("table.headers.systemUsers.idNo"),
      render: (value: string) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {value}
        </div>
      ),
    },
    {
      key: "username" as keyof SystemUser,
      title: t("table.headers.systemUsers.username"),
      render: (value: string) => (
        <div
          className={cn(
            "font-medium text-[#1A5F5E]",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {value}
        </div>
      ),
    },
    {
      key: "email" as keyof SystemUser,
      title: t("table.headers.systemUsers.email"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value}
        </div>
      ),
    },
    {
      key: "first_name" as keyof SystemUser,
      title: t("table.headers.systemUsers.fullName"),
      render: (_: string, user: SystemUser) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {getFullName(user)}
        </div>
      ),
    },
    {
      key: "gender" as keyof SystemUser,
      title: t("table.headers.systemUsers.gender"),
      render: (value: "male" | "female") => (
        <Badge
          className={cn(
            value === "male"
              ? "bg-blue-100 text-blue-800"
              : "bg-pink-100 text-pink-800",
            isRTL ? "ml-2" : "mr-2"
          )}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "phone_number" as keyof SystemUser,
      title: t("table.headers.systemUsers.phoneNumber"),
      render: (value: string) => (
        <div
          className={cn("text-gray-600", isRTL ? "text-right" : "text-left")}
        >
          {value}
        </div>
      ),
    },
    {
      key: "is_active" as keyof SystemUser,
      title: t("table.headers.systemUsers.status"),
      render: (value: boolean) => (
        <Badge
          className={
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {value ? t("common.active") : t("common.inactive")}
        </Badge>
      ),
    },
    {
      key: "actions" as keyof SystemUser,
      title: t("table.headers.systemUsers.actions"),
      render: (_: string, user: SystemUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setFormData({
                  id_no: user.id_no,
                  username: user.username,
                  email: user.email,
                  first_name: user.first_name,
                  second_name: user.second_name,
                  third_name: user.third_name,
                  last_name: user.last_name,
                  gender: user.gender,
                  password: user.password,
                  phone_number: user.phone_number,
                  address: user.address,
                  is_active: user.is_active,
                });
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {t("systemUsers.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setIsResetPasswordDialogOpen(true);
              }}
            >
              <Key className="h-4 w-4 mr-2" />
              {t("systemUsers.resetPassword")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("systemUsers.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={t("navigation.systemUsers")}
        description={t("systemUsers.description")}
        isRTL={isRTL}
      >
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("systemUsers.add")}
        </Button>
      </PageHeader>

      <Card className="p-6">
        <DataTable
          data={users}
          columns={columns}
          searchable
          pagination
          pageSize={15}
          isLoading={loading}
        />
      </Card>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle>{t("systemUsers.add")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1A5F5E] pb-1 border-b">
                {t("systemUsers.personalInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-sm font-medium">
                    {t("systemUsers.firstName")}
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="second_name" className="text-sm font-medium">
                    {t("systemUsers.secondName")}
                  </Label>
                  <Input
                    id="second_name"
                    name="second_name"
                    value={formData.second_name}
                    onChange={handleInputChange}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="third_name" className="text-sm font-medium">
                    {t("systemUsers.thirdName")}
                  </Label>
                  <Input
                    id="third_name"
                    name="third_name"
                    value={formData.third_name}
                    onChange={handleInputChange}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-sm font-medium">
                    {t("systemUsers.lastName")}
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="id_no" className="text-sm font-medium">
                    {t("systemUsers.idNo")}
                  </Label>
                  <Input
                    id="id_no"
                    name="id_no"
                    value={formData.id_no}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    {t("systemUsers.gender")}
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: value as "male" | "female",
                      }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={t("systemUsers.selectGender")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">
                        {t("systemUsers.male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("systemUsers.female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1A5F5E] pb-1 border-b">
                {t("systemUsers.contactInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("systemUsers.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    {t("systemUsers.phoneNumber")}
                  </Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="address" className="text-sm font-medium">
                    {t("systemUsers.address")}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1A5F5E] pb-1 border-b">
                {t("systemUsers.accountInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-medium">
                    {t("systemUsers.username")}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("systemUsers.password")}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-9">
              {t("systemUsers.add")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle>{t("systemUsers.edit")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditUser();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1A5F5E] pb-1 border-b">
                {t("systemUsers.contactInfo")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("systemUsers.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    {t("systemUsers.phoneNumber")}
                  </Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="address" className="text-sm font-medium">
                    {t("systemUsers.address")}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1A5F5E] pb-1 border-b">
                {t("systemUsers.accountInfo")}
              </h3>
              <div className="grid gap-4">
                <Label htmlFor="is_active" className="text-sm font-medium">
                  {t("systemUsers.status")}
                </Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: value === "active",
                    }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={t("systemUsers.selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t("systemUsers.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("systemUsers.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-9">
              {t("systemUsers.update")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={(open) => {
          setIsResetPasswordDialogOpen(open);
          if (!open) {
            setNewPassword("");
            setSelectedUser(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold">
              {t("systemUsers.resetPassword")}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                {t("systemUsers.newPassword")}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-9"
              />
            </div>
            <Button type="submit" className="w-full h-9">
              {t("systemUsers.resetPassword")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onConfirm={() => handleDeleteUser(selectedUser?.id || "")}
        title={t("systemUsers.deleteConfirmTitle")}
        description={t("systemUsers.deleteConfirmMessage")}
      />
    </div>
  );
};

export default SystemUsersPage;
