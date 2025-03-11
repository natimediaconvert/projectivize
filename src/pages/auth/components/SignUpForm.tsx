
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/providers/i18n/TranslationProvider';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  loading: boolean;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  handleSignUp
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input 
            id="fullName" 
            placeholder="John Doe" 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-signup">{t('email')}</Label>
          <Input 
            id="email-signup" 
            type="email" 
            placeholder="email@example.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-signup">{t('password')}</Label>
          <Input 
            id="password-signup" 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('creatingAccount') : t('createAccount')}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
