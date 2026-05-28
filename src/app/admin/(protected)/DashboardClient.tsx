"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";
import {
  Flame,
  UserCheck,
  FileText,
  Eye,
  Crown,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  data: {
    stats: {
      totalAds: number;
      activeAds: number;
      draftAds: number;
      archivedAds: number;
      vipAds: number;
    };
    categoryDistribution: { name: string; value: number }[];
    viewsTimeline: { name: string; Views: number; Ads: number }[];
    recentActivity: any[];
  };
}

const COLORS = ["#cf4f41", "#202e4d", "#f06e2e", "#10b981", "#8b5cf6"];

export default function DashboardClient({ data }: DashboardClientProps) {
  const { stats, categoryDistribution, viewsTimeline, recentActivity } = data;

  const cardData = [
    {
      title: "Total Listings",
      value: stats.totalAds,
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Active (Published)",
      value: stats.activeAds,
      icon: UserCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "VIP Placements",
      value: stats.vipAds,
      icon: Crown,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Pending Drafts",
      value: stats.draftAds,
      icon: Clock,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 font-sans select-none">
      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-muted-foreground">{card.title}</span>
                <h3 className="text-3xl font-extrabold text-foreground font-heading">{card.value}</h3>
              </div>
              <div className={`p-3.5 rounded-xl border ${card.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline (Area Chart) */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-foreground font-heading">Traffic & Registrations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Weekly overview of page views and new ad submissions.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cf4f41" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#cf4f41" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "0.5rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                  }}
                />
                <Area type="monotone" dataKey="Views" stroke="#cf4f41" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution (Bar Chart) */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-foreground font-heading">Ads by Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Total listing distribution across active categories.</p>
          </div>
          {categoryDistribution.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm">
              <Flame className="w-8 h-8 opacity-25 mb-2" />
              <span>No categories mapped.</span>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis type="number" stroke="#888888" fontSize={10} hide />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground font-heading">Recent Ad Submissions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">The latest ad submissions currently registered in the database.</p>
          </div>
          <Link
            href="/admin/listings"
            className="text-xs font-bold text-[#cf4f41] hover:text-[#b03d31] transition-colors flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No listing submissions found yet. Create one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3.5 pl-2">AD ID</th>
                  <th className="pb-3.5">Title</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Created Date</th>
                  <th className="pb-3.5 pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-foreground">
                {recentActivity.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-xs text-[#cf4f41]">{row.ad_id}</td>
                    <td className="py-3.5 font-semibold truncate max-w-xs">{row.title}</td>
                    <td className="py-3.5 text-muted-foreground">{row.category?.title || "Escort"}</td>
                    <td className="py-3.5 text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-2">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border
                          ${row.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : row.status === "archived"
                            ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        `}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
