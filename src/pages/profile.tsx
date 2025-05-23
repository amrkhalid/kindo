import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { getUserProfile, updateUserProfile } from "@/api/Profile/profile";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();

  const [profile, setProfile] = useState({
    id: "",
    id_no: "",
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    is_superuser: false,
    created_at: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedData = {
        phone_number: profile.phone_number,
        // first_name: profile.first_name,
        // last_name: profile.last_name,
        email: profile.email,
      };
      const response = await updateUserProfile(updatedData);
      setProfile(response.data);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile", error);
      console.log("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
    { code: "he", label: "עברית", dir: "rtl" },
  ];
  const isRTL =
    languages.find((lang) => lang.code === i18n.language)?.dir === "rtl";

  return (
    <div className={cn("space-y-4 p-4 sm:p-6", isRTL ? "rtl" : "ltr")}>
      <PageHeader
        title={t("profile.title")}
        description={t("profile.description")}
        isRTL={isRTL}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile.first_name?.charAt(0)}
                  {profile.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>
              {profile.first_name} {profile.last_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {profile.is_superuser ? "Administrator" : "User"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span>{profile.phone_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Joined:</span>
              <span>{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{t("profile.personalInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">{t("profile.firstName")}</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">{t("profile.lastName")}</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("profile.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90"
                  disabled={loading}
                >
                  {loading ? t("profile.saving") : t("profile.save")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
