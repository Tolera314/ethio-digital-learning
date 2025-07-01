
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Mail, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Basic signup info only
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [desiredRole, setDesiredRole] = useState('student');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            desired_role: desiredRole
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        if (desiredRole !== 'student') {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: desiredRole as 'instructor' })
            .eq('user_id', data.user.id);

          if (roleError) {
            console.error('Error updating user role:', roleError);
          }
        }
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto glass-morphism border-white/20 shadow-2xl">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
          <UserCheck className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl lg:text-3xl font-bold text-white">Join Our Community</CardTitle>
        <CardDescription className="text-gray-300 text-base lg:text-lg">
          Create your account and start learning
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white font-medium text-sm">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus text-sm"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium text-sm">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium text-sm">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white font-medium text-sm">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 input-focus text-sm"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredRole" className="text-white font-medium text-sm">I want to join as *</Label>
            <Select value={desiredRole} onValueChange={setDesiredRole}>
              <SelectTrigger className="h-10 bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-purple-400 transition-all duration-300 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="student" className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">Student</SelectItem>
                <SelectItem value="instructor" className="text-white hover:bg-purple-600/20 focus:bg-purple-600/20">Instructor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-hover text-sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-gray-400">Already have an account?</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToLogin}
          className="w-full h-10 border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-semibold rounded-xl transition-all duration-300 btn-hover text-sm"
        >
          Sign In Instead
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
