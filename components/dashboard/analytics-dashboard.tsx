"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Profile, Link } from "@/lib/types"
import { BarChart3, MousePointerClick, TrendingUp, Link2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { useMemo } from "react"

interface ClickData {
  id: string
  link_id: string
  clicked_at: string
  referrer: string | null
  country: string | null
  city: string | null
}

interface AnalyticsDashboardProps {
  profile: Profile
  links: Link[]
  clickData: ClickData[]
}

export function AnalyticsDashboard({ profile, links, clickData }: AnalyticsDashboardProps) {
  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)

  // Calculate clicks per link for bar chart
  const linkClicksData = links.map((link) => ({
    name: link.title.length > 15 ? link.title.substring(0, 15) + "..." : link.title,
    clicks: link.clicks || 0,
  }))

  // Calculate daily clicks for line chart
  const dailyClicks = useMemo(() => {
    const clicksByDay: Record<string, number> = {}
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      clicksByDay[dateStr] = 0
    }

    // Count clicks per day
    clickData.forEach((click) => {
      const dateStr = new Date(click.clicked_at).toISOString().split("T")[0]
      if (clicksByDay[dateStr] !== undefined) {
        clicksByDay[dateStr]++
      }
    })

    return Object.entries(clicksByDay).map(([date, clicks]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      clicks,
    }))
  }, [clickData])

  // Calculate top referrers
  const topReferrers = useMemo(() => {
    const referrerCounts: Record<string, number> = {}
    
    clickData.forEach((click) => {
      const referrer = click.referrer || "Direct"
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1
    })

    return Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }, [clickData])

  // Calculate average clicks per link
  const avgClicksPerLink = links.length > 0 ? Math.round(totalClicks / links.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your link performance and engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Links
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {links.filter((l) => l.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {links.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Clicks/Link
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClicksPerLink}</div>
            <p className="text-xs text-muted-foreground">Per active link</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last 30 Days
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickData.length}</div>
            <p className="text-xs text-muted-foreground">Total clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Clicks Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>Daily click activity for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyClicks}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Clicks by Link */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Link</CardTitle>
            <CardDescription>Performance of each link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {linkClicksData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={linkClicksData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No links yet. Add some links to see analytics.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Where your traffic comes from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrers.length > 0 ? (
                topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {referrer.name === "Direct" ? "Direct Traffic" : new URL(referrer.name).hostname}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {referrer.count} clicks
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  No referrer data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
