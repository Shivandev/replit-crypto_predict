import { useEffect, useState } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  // Update the page title
  useEffect(() => {
    document.title = "Settings | Cryptedict";
  }, []);
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toast } = useToast();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    username: "johndoe",
    bio: "Crypto enthusiast and investor since 2017."
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsNotifications: false,
    marketSummaries: true,
    predictionAlerts: true,
    newsDigest: false
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showPortfolio: false,
    showPredictions: true,
    dataCollection: true
  });
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: isDarkMode ? "dark" : "light",
    chartStyle: "candlestick",
    defaultTimeframe: "7d"
  });
  
  const handleProfileChange = (field: string, value: string) => {
    setProfileForm({
      ...profileForm,
      [field]: value
    });
  };
  
  const handleNotificationToggle = (field: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: !notificationSettings[field as keyof typeof notificationSettings]
    });
  };
  
  const handlePrivacyToggle = (field: string) => {
    setPrivacySettings({
      ...privacySettings,
      [field]: !privacySettings[field as keyof typeof privacySettings]
    });
  };
  
  const handleAppearanceChange = (field: string, value: string) => {
    if (field === 'theme') {
      // Toggle dark mode if theme is changed
      if ((value === 'dark' && !isDarkMode) || (value === 'light' && isDarkMode)) {
        toggleDarkMode();
      }
    }
    
    setAppearanceSettings({
      ...appearanceSettings,
      [field]: value
    });
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally dispatch a mutation to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleSavePreferences = () => {
    // This would normally dispatch a mutation to update preferences
    toast({
      title: "Preferences Saved",
      description: "Your preference settings have been updated successfully.",
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally dispatch a mutation to change password
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully. Please use your new password the next time you log in.",
    });
  };
  
  const handleResetData = () => {
    // Confirm before resetting data
    if (confirm("Are you sure you want to reset all your data? This action cannot be undone.")) {
      // This would normally dispatch actions to reset various data stores
      toast({
        title: "Data Reset Complete",
        description: "All your data has been reset successfully.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={profileForm.fullName} 
                    onChange={(e) => handleProfileChange("fullName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={profileForm.username}
                    onChange={(e) => handleProfileChange("username", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    placeholder="Tell the community about yourself..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications about market updates, price alerts, and platform activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Notification Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Email Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Receive important alerts and updates via email
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailAlerts} 
                      onCheckedChange={() => handleNotificationToggle("emailAlerts")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive push notifications in your browser or mobile device
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications} 
                      onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive text message alerts for important events
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsNotifications} 
                      onCheckedChange={() => handleNotificationToggle("smsNotifications")}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Market Summaries</Label>
                      <p className="text-sm text-gray-500">
                        Daily and weekly summaries of market performance
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketSummaries} 
                      onCheckedChange={() => handleNotificationToggle("marketSummaries")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Prediction Alerts</Label>
                      <p className="text-sm text-gray-500">
                        Notifications when AI generates new price predictions
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.predictionAlerts} 
                      onCheckedChange={() => handleNotificationToggle("predictionAlerts")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">News Digest</Label>
                      <p className="text-sm text-gray-500">
                        Weekly roundup of important crypto news and developments
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.newsDigest} 
                      onCheckedChange={() => handleNotificationToggle("newsDigest")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile, portfolio, and how your data is used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Profile Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Public Profile</Label>
                      <p className="text-sm text-gray-500">
                        Allow other users to view your profile information
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.publicProfile} 
                      onCheckedChange={() => handlePrivacyToggle("publicProfile")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Show Portfolio</Label>
                      <p className="text-sm text-gray-500">
                        Make your portfolio visible to other users
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.showPortfolio} 
                      onCheckedChange={() => handlePrivacyToggle("showPortfolio")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Show Predictions</Label>
                      <p className="text-sm text-gray-500">
                        Allow others to see your saved predictions
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.showPredictions} 
                      onCheckedChange={() => handlePrivacyToggle("showPredictions")}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Data Collection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Usage Data Collection</Label>
                      <p className="text-sm text-gray-500">
                        Allow us to collect anonymous usage data to improve our services
                      </p>
                    </div>
                    <Switch 
                      checked={privacySettings.dataCollection} 
                      onCheckedChange={() => handlePrivacyToggle("dataCollection")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how Cryptedict looks and feels to match your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Display Options</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      onValueChange={(value) => handleAppearanceChange("theme", value)}
                      defaultValue={appearanceSettings.theme}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="chart-style">Chart Style</Label>
                    <Select 
                      onValueChange={(value) => handleAppearanceChange("chartStyle", value)}
                      defaultValue={appearanceSettings.chartStyle}
                    >
                      <SelectTrigger id="chart-style">
                        <SelectValue placeholder="Select Chart Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candlestick">Candlestick</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="default-timeframe">Default Timeframe</Label>
                    <Select 
                      onValueChange={(value) => handleAppearanceChange("defaultTimeframe", value)}
                      defaultValue={appearanceSettings.defaultTimeframe}
                    >
                      <SelectTrigger id="default-timeframe">
                        <SelectValue placeholder="Select Default Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to maintain account security.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Change Password</Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your data and account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Reset Data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Clear your settings, preferences, and saved data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleResetData}>
                    Reset All Data
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
