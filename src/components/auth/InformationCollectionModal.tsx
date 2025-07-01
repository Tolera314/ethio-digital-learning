
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';

interface InformationCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InformationCollectionModal: React.FC<InformationCollectionModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useRole();

  // Personal info
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  // Academic/Professional info
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
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
          emergency_contact_phone: emergencyContactPhone,
          profile_completed: true
        }
      });

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "Your information has been saved successfully.",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save information",
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              <SelectItem value="male" className="hover:bg-blue-50 focus:bg-blue-50">Male</SelectItem>
              <SelectItem value="female" className="hover:bg-blue-50 focus:bg-blue-50">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="educationLevel" className="text-sm font-medium text-gray-700">Education Level</Label>
        <Select value={educationLevel} onValueChange={setEducationLevel}>
          <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="high_school" className="hover:bg-blue-50 focus:bg-blue-50">High School</SelectItem>
            <SelectItem value="bachelors" className="hover:bg-blue-50 focus:bg-blue-50">Bachelor's Degree</SelectItem>
            <SelectItem value="masters" className="hover:bg-blue-50 focus:bg-blue-50">Master's Degree</SelectItem>
            <SelectItem value="phd" className="hover:bg-blue-50 focus:bg-blue-50">PhD</SelectItem>
            <SelectItem value="other" className="hover:bg-blue-50 focus:bg-blue-50">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution" className="text-sm font-medium text-gray-700">Institution/University</Label>
        <Input
          id="institution"
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {role === 'instructor' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience" className="text-sm font-medium text-gray-700">Years of Teaching Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              min="0"
              className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">Specialization/Field of Expertise</Label>
            <Input
              id="specialization"
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          {role === 'instructor' ? 'Subjects You Can Teach' : 'Preferred Subjects/Areas of Interest'}
        </Label>
        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-3 p-2 rounded hover:bg-white transition-colors">
              <Checkbox
                id={subject}
                checked={preferredSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectToggle(subject)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor={subject} className="text-sm text-gray-700 cursor-pointer">{subject}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation" className="text-sm font-medium text-gray-700">
          {role === 'instructor' ? 'Why do you want to teach on our platform?' : 'Why do you want to join our platform?'}
        </Label>
        <Textarea
          id="motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={3}
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="howDidYouHear" className="text-sm font-medium text-gray-700">How did you hear about us?</Label>
        <Select value={howDidYouHear} onValueChange={setHowDidYouHear}>
          <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="social_media" className="hover:bg-blue-50 focus:bg-blue-50">Social Media</SelectItem>
            <SelectItem value="search_engine" className="hover:bg-blue-50 focus:bg-blue-50">Search Engine</SelectItem>
            <SelectItem value="friend_referral" className="hover:bg-blue-50 focus:bg-blue-50">Friend Referral</SelectItem>
            <SelectItem value="advertisement" className="hover:bg-blue-50 focus:bg-blue-50">Advertisement</SelectItem>
            <SelectItem value="other" className="hover:bg-blue-50 focus:bg-blue-50">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="linkedinProfile" className="text-sm font-medium text-gray-700">LinkedIn Profile</Label>
        <Input
          id="linkedinProfile"
          type="url"
          value={linkedinProfile}
          onChange={(e) => setLinkedinProfile(e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubProfile" className="text-sm font-medium text-gray-700">GitHub Profile</Label>
        <Input
          id="githubProfile"
          type="url"
          value={githubProfile}
          onChange={(e) => setGithubProfile(e.target.value)}
          placeholder="https://github.com/your-username"
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">Portfolio/Website URL</Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://your-portfolio.com"
          className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4 text-gray-900">Emergency Contact</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">Emergency Contact Name</Label>
            <Input
              id="emergencyContactName"
              type="text"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">Emergency Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-gray-600">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Personal Information' :
              currentStep === 2 ? 'Academic & Professional Details' :
              'Additional Information & Emergency Contact'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-6 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Profile
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InformationCollectionModal;
