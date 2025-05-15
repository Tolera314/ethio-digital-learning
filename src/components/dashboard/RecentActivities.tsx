
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import ActivityItem from "@/components/ActivityItem";
import { UserActivity } from "@/hooks/useUserActivities";

interface RecentActivitiesProps {
  activities: UserActivity[];
  isLoading?: boolean;
  limit?: number;
}

export function RecentActivities({ 
  activities, 
  isLoading = false,
  limit = 3
}: RecentActivitiesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-white/5 animate-pulse">
            <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // If no activities, show a message
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No activities recorded yet. Start exploring!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, limit).map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
      
      {activities.length > 0 && (
        <div className="mt-4">
          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
            <Award size={16} className="mr-2" /> View All Activities
          </Button>
        </div>
      )}
    </div>
  );
}

export function RecentActivitiesCard({ activities, isLoading = false, limit = 3 }: RecentActivitiesProps) {
  return (
    <Card className="bg-black/40 border border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentActivities activities={activities} isLoading={isLoading} limit={limit} />
      </CardContent>
    </Card>
  );
}
