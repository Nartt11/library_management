import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Key, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChangePasswordProps {
  trigger?: React.ReactNode;
}

export function ChangePassword({ trigger }: ChangePasswordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'current' | 'new'>('current');

  const handleCurrentPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock password validation - accept any non-empty password
    if (currentPassword.trim()) {
      setStep('new');
    } else {
      toast.error('Please enter your current password');
    }
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.trim()) {
      // Show success notification
      toast.success('Successfully changed');
      
      // Reset form and close dialog
      setCurrentPassword('');
      setNewPassword('');
      setStep('current');
      setIsOpen(false);
    } else {
      toast.error('Please enter a new password');
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setCurrentPassword('');
      setNewPassword('');
      setStep('current');
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Key className="h-4 w-4" />
      Change Password
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            {step === 'current' 
              ? 'Enter your current password to continue'
              : 'Enter your new password'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'current' ? (
          <form onSubmit={handleCurrentPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Enter your new password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('current')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Update Password
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}