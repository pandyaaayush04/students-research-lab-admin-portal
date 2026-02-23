import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck, BookOpen, Trophy, TrendingUp, Clock, Loader2, Calendar } from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  name: string;
  score: number;
  field: string;
  enrollment_no: string;
}

interface Activity {
  id: number;
  title: string;
  date: string;
  description?: string;
}

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
    fetchActivities();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Fetch all scores
      const { data: scoresData, error: scoresError } = await supabase
        .from("debate_scores")
        .select("enrollment_no, total_points");

      if (scoresError) throw scoresError;

      // Fetch student details
      const { data: studentsData, error: studentsError } = await supabase
        .from("students_details")
        .select("enrollment_no, student_name, department");

      if (studentsError) throw studentsError;

      // Aggregate scores by enrollment_no
      const scoreMap: { [key: string]: number } = {};
      (scoresData || []).forEach((score: any) => {
        const enrollNo = score.enrollment_no || "";
        const points = score.total_points || 0;
        if (enrollNo) {
          scoreMap[enrollNo] = (scoreMap[enrollNo] || 0) + points;
        }
      });

      // Create leaderboard entries
      const leaderboardData: LeaderboardEntry[] = (studentsData || [])
        .map((student: any) => ({
          name: student.student_name || "Unknown",
          score: Math.round(scoreMap[student.enrollment_no] || 0),
          field: student.department || "N/A",
          enrollment_no: student.enrollment_no,
        }))
        .filter((entry: LeaderboardEntry) => entry.score > 0)
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
        .slice(0, 5);

      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      toast({
        variant: "destructive",
        title: "Error fetching leaderboard",
        description: error.message,
      });
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      const sortedData = (data || []).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setActivities(sortedData);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Users} title="Total Students" value={48} subtitle="+3 this month" delay={0} />
        <StatCard icon={CalendarCheck} title="Today's Attendance" value="92%" subtitle="44 of 48 present" delay={0.05} />
        <StatCard icon={BookOpen} title="Research Papers" value={24} subtitle="6 pending review" delay={0.1} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-card rounded-2xl p-5 lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Score Leaderboard
            </h2>
            <span className="text-xs font-medium text-muted-foreground">Top 5</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No scores available yet
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((student, i) => (
                <motion.div
                  key={student.enrollment_no}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-primary/8 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.field}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-semibold text-foreground">{student.score}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="glass-card rounded-2xl p-5 lg:col-span-2"
        >
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            Recent Activities
          </h2>
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No activities yet
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(activity.date)}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
