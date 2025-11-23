import React from "react";

export default function SystemSettings() {
  return <div>SystemSettings</div>;
}

// "use client";
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { Switch } from "../../../components/ui/switch";
// import { Settings, Bell } from "lucide-react";
// import { toast } from "sonner";
// import { PasswordConfirmation } from "../../../components/PasswordConfirmation";

// export default function SystemSettings() {
//   const [isBackupRunning, setIsBackupRunning] = useState(false);
//   const [showPasswordConfirmation, setShowPasswordConfirmation] =
//     useState(false);
//   const [pendingAction, setPendingAction] = useState<{
//     action: () => void;
//     title: string;
//     description: string;
//   } | null>(null);

//   const [settings, setSettings] = useState({
//     libraryName: "University Library",
//     maxBooks: "5",
//     loanPeriod: "14",
//     autoRenewal: true,
//     overdueAlerts: true,
//     returnReminders: true,
//     reminderDays: "3",
//     dailyReports: false,
//   });

//   const requirePasswordConfirmation = (
//     action: () => void,
//     title: string,
//     description: string
//   ) => {
//     setPendingAction({ action, title, description });
//     setShowPasswordConfirmation(true);
//   };

//   const handlePasswordConfirmed = () => {
//     if (pendingAction) {
//       pendingAction.action();
//       setPendingAction(null);
//     }
//     setShowPasswordConfirmation(false);
//   };

//   const handlePasswordCancelled = () => {
//     setPendingAction(null);
//     setShowPasswordConfirmation(false);
//   };

//   const saveSettings = () => {
//     toast.success("Settings saved successfully!");
//   };

//   const resetSettings = () => {
//     setSettings({
//       libraryName: "University Library",
//       maxBooks: "5",
//       loanPeriod: "14",
//       autoRenewal: true,
//       overdueAlerts: true,
//       returnReminders: true,
//       reminderDays: "3",
//       dailyReports: false,
//     });
//     toast.success("Settings reset to defaults!");
//   };

//   const runManualBackup = async () => {
//     setIsBackupRunning(true);

//     try {
//       // Simulate backup process
//       toast.info("Starting manual backup...");

//       // Simulate backup time (3 seconds)
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       toast.success("Manual backup completed successfully!");
//     } catch (error) {
//       toast.error("Backup failed. Please try again.");
//     } finally {
//       setIsBackupRunning(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-2xl mb-2 flex items-center gap-2">
//           <Settings className="h-6 w-6" />
//           System Settings
//         </h1>
//         <p className="text-muted-foreground">
//           Configure system-wide settings and preferences.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* General Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Settings className="h-5 w-5" />
//               General Settings
//             </CardTitle>
//             <CardDescription>Basic system configuration</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="library-name">Library Name</Label>
//               <Input
//                 id="library-name"
//                 value={settings.libraryName}
//                 onChange={(e) =>
//                   setSettings({ ...settings, libraryName: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="max-books">Max Books Per Student</Label>
//               <Input
//                 id="max-books"
//                 type="number"
//                 value={settings.maxBooks}
//                 onChange={(e) =>
//                   setSettings({ ...settings, maxBooks: e.target.value })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="loan-period">Default Loan Period (days)</Label>
//               <Input
//                 id="loan-period"
//                 type="number"
//                 value={settings.loanPeriod}
//                 onChange={(e) =>
//                   setSettings({ ...settings, loanPeriod: e.target.value })
//                 }
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="auto-renewal">Enable Auto-renewal</Label>
//               <Switch
//                 id="auto-renewal"
//                 checked={settings.autoRenewal}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, autoRenewal: checked })
//                 }
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notification Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bell className="h-5 w-5" />
//               Notification Settings
//             </CardTitle>
//             <CardDescription>Email and alert preferences</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="overdue-alerts">Overdue Book Alerts</Label>
//               <Switch
//                 id="overdue-alerts"
//                 checked={settings.overdueAlerts}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, overdueAlerts: checked })
//                 }
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="return-reminders">Return Reminders</Label>
//               <Switch
//                 id="return-reminders"
//                 checked={settings.returnReminders}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, returnReminders: checked })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="reminder-days">Days Before Due Date</Label>
//               <Input
//                 id="reminder-days"
//                 type="number"
//                 value={settings.reminderDays}
//                 onChange={(e) =>
//                   setSettings({ ...settings, reminderDays: e.target.value })
//                 }
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="daily-reports">Daily Reports</Label>
//               <Switch
//                 id="daily-reports"
//                 checked={settings.dailyReports}
//                 onCheckedChange={(checked) =>
//                   setSettings({ ...settings, dailyReports: checked })
//                 }
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Save Settings */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex gap-4">
//             <Button
//               onClick={() =>
//                 requirePasswordConfirmation(
//                   saveSettings,
//                   "Save System Settings",
//                   "You are about to save changes to system settings. This will affect how the library system operates for all users."
//                 )
//               }
//             >
//               Save All Settings
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() =>
//                 requirePasswordConfirmation(
//                   resetSettings,
//                   "Reset System Settings",
//                   "You are about to reset all system settings to their default values. This action will overwrite any custom configurations."
//                 )
//               }
//             >
//               Reset to Defaults
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Password Confirmation Dialog */}
//       <PasswordConfirmation
//         isOpen={showPasswordConfirmation}
//         onClose={handlePasswordCancelled}
//         onConfirm={handlePasswordConfirmed}
//         title={pendingAction?.title || ""}
//         description={pendingAction?.description || ""}
//         actionName="Confirm Changes"
//         userRole="admin"
//       />
//     </div>
//   );
// }
