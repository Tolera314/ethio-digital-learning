
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'instructor' | 'student';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('student'); // Default fallback
        } else {
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('student'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!role) return false;
    
    // Admin has access to everything
    if (role === 'admin') return true;
    
    // Instructor has access to instructor and student content
    if (role === 'instructor' && (requiredRole === 'instructor' || requiredRole === 'student')) {
      return true;
    }
    
    // Students only have access to student content
    return role === requiredRole;
  };

  const isAdmin = () => role === 'admin';
  const isInstructor = () => role === 'instructor';
  const isStudent = () => role === 'student';

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isInstructor,
    isStudent
  };
};
