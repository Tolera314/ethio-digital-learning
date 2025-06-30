
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Basic info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  // Role and professional info
  const [desiredRole, setDesiredRole] = useState('student');
  const [educationLevel, setEducationLevel] = useState('');
  const [institution, setInstitution] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>([]);
  const [motivation, setMotivation] = useState('');
  const [howDidYouHear, setHowDidYouHear] = useState('');

  // Professional links
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Emergency contact
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

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
        // Save additional user details
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert({
            user_id: data.user.id,
            phone,
            address,
            date_of_birth: dateOfBirth || null,
            gender: gender || null,
            education_level: educationLevel,
            institution,
            years_of_experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
            specialization,
            preferred_subjects: preferredSubjects,
            motivation,
            how_did_you_hear: howDidYouHear,
            linkedin_profile: linkedinProfile,
            github_profile: githubProfile,
            portfolio_url: portfolioUrl,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactPhone
          });

        if (detailsError) {
          console.error('Error saving user details:', detailsError);
        }

        // Update user role if not student
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

  const handleSubjectToggle = (subject: string) => {
    setPreferredSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art',
    'Music', 'Physical Education', 'Foreign Languages', 'Economics',
    'Psychology', 'Philosophy', 'Engineering', 'Medicine', 'Business'
  ];

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="desiredRole">I want to join as a *</Label>
        <Select value={desiredRole} onValueChange={setDesiredRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="educationLevel">Education Level</Label>
        <Select value={educationLevel} onValueChange={setEducationLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high_school">High School</SelectItem>
            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
            <SelectItem value="masters">Master's Degree</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="institution">Institution/University</Label>
        <Input
          id="institution"
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>

      {desiredRole === 'instructor' && (
        <>
          <div>
            <Label htmlFor="yearsOfExperience">Years of Teaching Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="specialization">Specialization/Field of Expertise</Label>
            <Input
              id="specialization"
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
        </>
      )}

      <div>
        <Label>Preferred Subjects/Areas of Interest</Label>
        <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject}
                checked={preferredSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectToggle(subject)}
              />
              <Label htmlFor={subject} className="text-sm">{subject}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="motivation">Why do you want to join our platform?</Label>
        <Textarea
          id="motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
        <Select value={howDidYouHear} onValueChange={setHowDidYouHear}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social_media">Social Media</SelectItem>
            <SelectItem value="search_engine">Search Engine</SelectItem>
            <SelectItem value="friend_referral">Friend Referral</SelectItem>
            <SelectItem value="advertisement">Advertisement</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
        <Input
          id="linkedinProfile"
          type="url"
          value={linkedinProfile}
          onChange={(e) => setLinkedinProfile(e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
        />
      </div>

      <div>
        <Label htmlFor="githubProfile">GitHub Profile</Label>
        <Input
          id="githubProfile"
          type="url"
          value={githubProfile}
          onChange={(e) => setGithubProfile(e.target.value)}
          placeholder="https://github.com/your-username"
        />
      </div>

      <div>
        <Label htmlFor="portfolioUrl">Portfolio/Website URL</Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://your-portfolio.com"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Emergency Contact</h4>
        
        <div>
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input
            id="emergencyContactName"
            type="text"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
          <Input
            id="emergencyContactPhone"
            type="tel"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Step {currentStep} of 3: {
            currentStep === 1 ? 'Basic Information' :
            currentStep === 2 ? 'Academic & Professional Details' :
            'Additional Information & Emergency Contact'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!fullName || !email || !password || !confirmPassword)) ||
                  (currentStep === 2 && !desiredRole)
                }
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
