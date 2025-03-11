
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { Loader2 } from 'lucide-react';

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSignIn
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSignIn}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="email@example.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password')}</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
          aria-live="polite"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('signingIn')}
            </span>
          ) : (
            t('signIn')
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
