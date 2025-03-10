
export interface Translations {
  english: string;
  hebrew: string;
  dashboard: string;
  myDay: string;
  tasks: string;
  projects: string;
  team: string;
  reports: string;
  goals: string;
  settings: string;
  // Auth-related strings
  signIn: string;
  signUp: string;
  signOut: string;
  email: string;
  password: string;
  fullName: string;
  welcomeBack: string;
  error: string;
  signupSuccess: string;
  checkEmail: string;
  profile: string;
  updateProfile: string;
  saveChanges: string;
  cancel: string;
  changeAvatar: string;
  uploading: string;
  fileTooLarge: string;
  emailChangeInfo: string;
  signingIn: string;
  creatingAccount: string;
  createAccount: string;
  signedOut: string;
  profileUpdated: string;
  profileSettings: string;
  authDescription: string;
  accessDenied: string;
  unauthorizedDescription: string;
  backToHome: string;
  goBack: string;
  // Theme-related strings
  lightMode: string;
  darkMode: string;
  highContrastMode: string;
  systemTheme: string;
  // Accessibility
  skipToContent: string;
}

export const translations: Record<string, Translations> = {
  en: {
    english: "English",
    hebrew: "Hebrew",
    dashboard: "Dashboard",
    myDay: "My Day",
    tasks: "Tasks",
    projects: "Projects",
    team: "Team",
    reports: "Reports",
    goals: "Goals",
    settings: "Settings",
    // Auth-related strings
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    welcomeBack: "Welcome back!",
    error: "Error",
    signupSuccess: "Account created successfully",
    checkEmail: "Please check your email for confirmation",
    profile: "Profile",
    updateProfile: "Update your profile information",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    changeAvatar: "Change Avatar",
    uploading: "Uploading...",
    fileTooLarge: "File is too large (max 2MB)",
    emailChangeInfo: "Contact support to change your email",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    createAccount: "Create Account",
    signedOut: "You have been signed out",
    profileUpdated: "Profile updated successfully",
    profileSettings: "Profile Settings",
    authDescription: "Sign in to your account or create a new one",
    accessDenied: "Access Denied",
    unauthorizedDescription: "You don't have permission to access this page. Please contact your administrator if you believe this is an error.",
    backToHome: "Back to Home",
    goBack: "Go Back",
    // Theme-related strings
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    highContrastMode: "High Contrast Mode",
    systemTheme: "System Theme",
    // Accessibility
    skipToContent: "Skip to content",
  },
  he: {
    english: "אנגלית",
    hebrew: "עברית",
    dashboard: "לוח בקרה",
    myDay: "היום שלי",
    tasks: "משימות",
    projects: "פרויקטים",
    team: "צוות",
    reports: "דוחות",
    goals: "יעדים",
    settings: "הגדרות",
    // Auth-related strings
    signIn: "התחברות",
    signUp: "הרשמה",
    signOut: "התנתקות",
    email: "אימייל",
    password: "סיסמה",
    fullName: "שם מלא",
    welcomeBack: "ברוך שובך!",
    error: "שגיאה",
    signupSuccess: "החשבון נוצר בהצלחה",
    checkEmail: "אנא בדוק את האימייל שלך לאישור",
    profile: "פרופיל",
    updateProfile: "עדכן את פרטי הפרופיל שלך",
    saveChanges: "שמור שינויים",
    cancel: "ביטול",
    changeAvatar: "שנה תמונת פרופיל",
    uploading: "מעלה...",
    fileTooLarge: "הקובץ גדול מדי (מקסימום 2MB)",
    emailChangeInfo: "צור קשר עם התמיכה כדי לשנות את האימייל שלך",
    signingIn: "מתחבר...",
    creatingAccount: "יוצר חשבון...",
    createAccount: "צור חשבון",
    signedOut: "התנתקת בהצלחה",
    profileUpdated: "הפרופיל עודכן בהצלחה",
    profileSettings: "הגדרות פרופיל",
    authDescription: "התחבר לחשבון שלך או צור חשבון חדש",
    accessDenied: "הגישה נדחתה",
    unauthorizedDescription: "אין לך הרשאה לגשת לדף זה. אנא צור קשר עם המנהל שלך אם אתה מאמין שזו טעות.",
    backToHome: "חזרה לדף הבית",
    goBack: "חזור",
    // Theme-related strings
    lightMode: "מצב בהיר",
    darkMode: "מצב כהה",
    highContrastMode: "מצב ניגודיות גבוהה",
    systemTheme: "ערכת נושא של המערכת",
    // Accessibility
    skipToContent: "דלג לתוכן",
  },
};
