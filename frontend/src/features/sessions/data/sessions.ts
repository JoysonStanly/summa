// Mock data for the Sessions page
export interface Session {
  _id?: string;
  id?: string;
  title: string;
  date: string; // ISO date string
  timeRange?: string; // e.g. "10:00 AM - 11:30 AM"
  startTime?: string;
  endTime?: string;
  instructor?: string;
  thumbnailUrl?: string;
  category?: string;
  isLive?: boolean;
  participants?: string[];
  enrolledUsers?: string[];
}

// Upcoming sessions (empty for now to showcase the empty state)
export const upcomingSessions: Session[] = [
  // Uncomment to test with data
  /*
  {
    id: "session-1",
    title: "Advanced DSA Problem Solving",
    date: "2025-09-10T00:00:00.000Z",
    timeRange: "10:00 AM - 11:30 AM",
    instructor: "Alex Johnson",
    thumbnailUrl: "/images/session-dsa.jpg",
    category: "DSA",
    isLive: false
  },
  {
    id: "session-2",
    title: "System Design Interview Prep",
    date: "2025-09-12T00:00:00.000Z",
    timeRange: "2:00 PM - 4:00 PM",
    instructor: "Sarah Chen",
    thumbnailUrl: "/images/session-system-design.jpg",
    category: "System Design",
    isLive: false
  }
  */
];

// Previous sessions
export const previousSessions: Session[] = [
  {
    id: "prev-1",
    title: "Graph Algorithms Masterclass",
    date: "2025-09-01T00:00:00.000Z",
    timeRange: "11:00 AM - 1:00 PM",
    instructor: "Michael Park",
    thumbnailUrl: "/images/session-graph.jpg",
    category: "DSA"
  },
  {
    id: "prev-2",
    title: "Behavioral Interview Strategies",
    date: "2025-08-28T00:00:00.000Z",
    timeRange: "3:00 PM - 4:30 PM",
    instructor: "Emily Wong",
    thumbnailUrl: "/images/session-behavioral.jpg",
    category: "Career"
  },
  {
    id: "prev-3",
    title: "Dynamic Programming Deep Dive",
    date: "2025-08-25T00:00:00.000Z",
    timeRange: "10:00 AM - 12:30 PM",
    instructor: "David Miller",
    thumbnailUrl: "/images/session-dp.jpg",
    category: "DSA"
  },
  {
    id: "prev-4",
    title: "Database Systems & SQL Optimization",
    date: "2025-08-20T00:00:00.000Z",
    timeRange: "2:00 PM - 4:00 PM",
    instructor: "Priya Sharma",
    thumbnailUrl: "/images/session-sql.jpg",
    category: "Databases"
  }
];
