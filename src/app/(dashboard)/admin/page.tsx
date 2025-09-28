"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, GraduationCap, UserCheck, BookOpen, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalParents: number
  totalClasses: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
  })
  const [loading, setLoading] = useState(true)

  

  const quickActions = [
    {
      title: "Add New Student",
      description: "Register a new student in the system",
      href: "/admin/students/new",
      icon: GraduationCap,
    },
    {
      title: "Add New Teacher",
      description: "Add a new teacher to the faculty",
      href: "/admin/teachers/new",
      icon: UserCheck,
    },
    {
      title: "Add New Parent",
      description: "Register a new parent account",
      href: "/admin/parents/new",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your school today.</p>
        </div>
        <Button asChild>
          <Link href="/admin/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={loading ? "..." : stats.totalStudents}
          description="Active students enrolled"
          icon={GraduationCap}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Teachers"
          value={loading ? "..." : stats.totalTeachers}
          description="Active faculty members"
          icon={UserCheck}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Parents"
          value={loading ? "..." : stats.totalParents}
          description="Registered parent accounts"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Classes"
          value={loading ? "..." : stats.totalClasses}
          description="Currently running classes"
          icon={BookOpen}
          trend={{ value: 2, isPositive: true }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={action.href}>
                  <Plus className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions in your school management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <div className="p-1 bg-green-100 rounded-full">
                  <GraduationCap className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student registered</p>
                  <p className="text-xs text-muted-foreground">John Doe joined Class 10A</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded-full">
                  <UserCheck className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Teacher profile updated</p>
                  <p className="text-xs text-muted-foreground">Sarah Smith updated contact info</p>
                </div>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <div className="p-1 bg-purple-100 rounded-full">
                  <Users className="h-3 w-3 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Parent account created</p>
                  <p className="text-xs text-muted-foreground">New parent registered for Jane Doe</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

       
        
      </div>
    </div>
  )
}
