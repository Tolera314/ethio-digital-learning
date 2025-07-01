
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
    <div className="space-y-4">
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

      {role === 'instructor' && (
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
        <Label>
          {role === 'instructor' ? 'Subjects You Can Teach' : 'Preferred Subjects/Areas of Interest'}
        </Label>
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
        <Label htmlFor="motivation">
          {role === 'instructor' ? 'Why do you want to teach on our platform?' : 'Why do you want to join our platform?'}
        </Label>
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Personal Information' :
              currentStep === 2 ? 'Academic & Professional Details' :
              'Additional Information & Emergency Contact'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
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
