import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Users,
  Bell,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Risks</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stakeholders</p>
              <h3 className="text-2xl font-bold">156</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Communications</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Stakeholder Update #{i}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Metric #{i}</p>
                  <p className="text-xs text-gray-500">+12% from last month</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}