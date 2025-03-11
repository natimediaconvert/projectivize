
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useTranslation } from '@/providers/i18n/TranslationProvider';

interface AuthCardProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const AuthCard: React.FC<AuthCardProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  handleSignIn,
  handleSignUp
}) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">QualiTasks</CardTitle>
        <CardDescription>{t('authDescription')}</CardDescription>
      </CardHeader>
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">{t('signIn')}</TabsTrigger>
          <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <SignInForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleSignIn={handleSignIn}
          />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignUpForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullName={fullName}
            setFullName={setFullName}
            loading={loading}
            handleSignUp={handleSignUp}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
