import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { APP } from '@/constants/app';
import kendoLogo from '@/assets/kindo-logo.png';
import { getUserRole, login } from '@/api/Auth/Login';

// List of available languages with their directions
const languages = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'he', label: 'עברית', dir: 'rtl' }
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });

  // Change language handler
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  // Get the current language's direction
  const currentLanguage = languages.find(lang => lang.code === i18n.language);
  const isRTL = currentLanguage?.dir === 'rtl';

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);

  if (!formData.username || !formData.password) {
    setError(t('login.allFieldsRequired'));
    return;
  }

  try {
    const response = await login(formData);
    const token = response?.data?.token;
    const user = response?.data?.user;
    const is_superuser = user?.is_superuser;
    const user_id = user.id; 


    if (token && user_id) {
      localStorage.setItem('token', token);
      localStorage.setItem('is_superuser', is_superuser ? 'true' : 'false');

      const roleResponse = await getUserRole(user_id);
      const role = roleResponse?.data?.role;
      const kg_id = roleResponse?.data?.kg_id; 


      if (role) {
        localStorage.setItem('user_role', role);
        localStorage.setItem('selectedKG', kg_id);
      }

      navigate(APP.ROUTES.CHILDREN);
    } else {
      setError(t('login.invalidCredentials'));
    }
  } catch (err: any) {
    console.error('Login Error:', err);
    setError(t('login.invalidCredentials'));
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-end mb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Change Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="cursor-pointer"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col items-center">
            <img src={kendoLogo} alt="Kendo" className="h-12 w-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-center">
              {t('login.title')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder={t('login.usernamePlaceholder')}
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-[#1A5F5E] hover:bg-[#1A5F5E]/90">
              {t('login.signIn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 