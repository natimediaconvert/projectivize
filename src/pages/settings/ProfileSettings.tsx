
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/providers/i18n/TranslationProvider';
import { supabase } from '@/integrations/supabase/client';

export default function ProfileSettings() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Initialize form with user data
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.profile_picture || null);
    }
  }, [profile, user, authLoading, navigate]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: t('error'),
          description: t('fileTooLarge'),
          variant: 'destructive',
        });
        return;
      }
      
      setAvatarFile(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      setUploading(true);
      
      // Create unique file path
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `profiles/${user.id}/avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      let profilePictureUrl = profile?.profile_picture || null;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          profilePictureUrl = newAvatarUrl;
        }
      }
      
      // Only update the fields that are valid for the DB schema
      await updateProfile({
        full_name: fullName,
        profile_picture: profilePictureUrl,
      });
      
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{t('profileSettings')}</CardTitle>
          <CardDescription>{t('updateProfile')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback>{fullName?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer px-4 py-2 border rounded-md hover:bg-muted">
                  {t('changeAvatar')}
                </Label>
                <Input 
                  id="avatar" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t('emailChangeInfo')}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || authLoading}
            >
              {uploading ? t('uploading') : t('saveChanges')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
