"use client";

import { useEffect, useState } from "react";

import { getRecentActivity } from "@/lib/stats/recentActivity";

/* --------------------------------------------------
   Recent Activity Test Page
-------------------------------------------------- */

export default function RecentActivityPage() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const data = getRecentActivity();

    setActivity(data);
  }, []);

  return (
    <main>
      <h1>Recent Activity</h1>

      <pre>{JSON.stringify(activity, null, 2)}</pre>
    </main>
  );
}
