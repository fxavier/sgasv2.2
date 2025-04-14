"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, AlertTriangle, Briefcase, Users, Bell, MessageSquare, 
  Mail, FileText, ChevronLeft, ChevronRight, LineChart, FolderOpen, 
  Building2, Leaf, ChevronDown, Scale, FileSearch, ClipboardCheck, 
  FileSpreadsheet, Target, ListChecks, GraduationCap, CalendarClock, 
  CheckSquare, Table, HardHat, FileWarning, ChevronFirst as FirstAid, 
  Zap, AlertOctagon, FileQuestion, FileCheck, UserPlus, Recycle, 
  FileType, Files, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Identification of Risks and Impacts",
    icon: AlertTriangle,
    href: "/risks",
    submenu: [
      {
        title: "FR.AS.002 Env. & Impact Assessment",
        icon: FileSearch,
        href: "/risks/impact-assessment",
      },
      {
        title: "FR.AS.003 Legal Requirement Control",
        icon: Scale,
        href: "/risks/legal-requirements",
      },
      {
        title: "FR.AS.023 Environmental & Screening Form",
        icon: ClipboardCheck,
        href: "/risks/screening-form",
      },
      {
        title: "MOD.AS.02 Preliminary Environmental Form",
        icon: FileSpreadsheet,
        href: "/risks/preliminary-form",
      }
    ]
  },
  {
    title: "Management Programs",
    icon: Briefcase,
    href: "/programs",
    submenu: [
      {
        title: "Strategic Objective",
        icon: Target,
        href: "/programs/strategic-objective",
      },
      {
        title: "Specific Objective",
        icon: ListChecks,
        href: "/programs/specific-objective",
      }
    ]
  },
  {
    title: "Organization Capacity and Competency",
    icon: Users,
    href: "/organization",
    submenu: [
      {
        title: "FR.AS.005 Training Needs",
        icon: GraduationCap,
        href: "/organization/training-needs",
      },
      {
        title: "FR.AS.006 Training Plans",
        icon: CalendarClock,
        href: "/organization/training-plans",
      },
      {
        title: "FR.AS.007 Training Effectiveness Assessment",
        icon: CheckSquare,
        href: "/organization/training-effectiveness",
      },
      {
        title: "FR.AS.006 Training Matrix",
        icon: Table,
        href: "/organization/training-matrix",
      },
      {
        title: "FR.AS.038 OHS ACTING",
        icon: HardHat,
        href: "/organization/ohs-acting",
      }
    ]
  },
  {
    title: "Emergency Preparedness and Response",
    icon: Bell,
    href: "/emergency",
    submenu: [
      {
        title: "FR.AS.009 Incident Report",
        icon: FileWarning,
        href: "/emergency/incident-report",
      },
      {
        title: "FR.AS.011 First Aid Kit Checklist",
        icon: FirstAid,
        href: "/emergency/first-aid-checklist",
      },
      {
        title: "FR.AS.028 Incident Flash Report",
        icon: Zap,
        href: "/emergency/incident-flash-report",
      }
    ]
  },
  {
    title: "Stakeholder Engagement",
    icon: MessageSquare,
    href: "/stakeholders",
  },
  {
    title: "External Communications & Grievance Mechanisms",
    icon: Mail,
    href: "/communications",
    submenu: [
      {
        title: "FR.AS.013 Non Compliance Control",
        icon: AlertOctagon,
        href: "/communications/non-compliance",
      },
      {
        title: "FR.AS.013_Claim And Complain Control",
        icon: FileQuestion,
        href: "/communications/claim-control",
      },
      {
        title: "FR.AS.026 Complaints and Claims Registration Form",
        icon: FileCheck,
        href: "/communications/complaints-registration",
      },
      {
        title: "FR.AS.033 Worker Grievance",
        icon: UserPlus,
        href: "/communications/worker-grievance",
      }
    ]
  },
  {
    title: "Ongoing Reporting to affected Communities",
    icon: FileText,
    href: "/reporting",
  },
  {
    title: "Resource Efficiency & Pollution",
    icon: Leaf,
    href: "/resource-efficiency",
    submenu: [
      {
        title: "FR.AS.032 Waste Management",
        icon: Trash2,
        href: "/resource-efficiency/waste-management",
      }
    ]
  },
  {
    title: "Monitoring and Review",
    icon: LineChart,
    href: "/monitoring",
    submenu: [
      {
        title: "FR.AS.031 Waste Transfer Log",
        icon: Recycle,
        href: "/monitoring/waste-transfer-log",
      }
    ]
  },
  {
    title: "Document Management",
    icon: FolderOpen,
    href: "/documents",
    submenu: [
      {
        title: "Document Type",
        icon: FileType,
        href: "/documents/document-type",
      },
      {
        title: "Document",
        icon: Files,
        href: "/documents/document",
      }
    ]
  },
  {
    title: "Department Management",
    icon: Building2,
    href: "/departments",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(current =>
      current.includes(title)
        ? current.filter(item => item !== title)
        : [...current, title]
    );
  };

  return (
    <div
      className={cn(
        "sidebar-width h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300",
        collapsed && "collapsed"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <div className={cn("flex items-center", collapsed && "hidden")}>
          <h1 className="text-xl font-bold text-primary">Admin</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <>
                  <div
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-md transition-colors cursor-pointer",
                      (pathname === item.href || item.submenu.some(sub => pathname === sub.href))
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-100",
                      collapsed && "justify-center"
                    )}
                    onClick={() => !collapsed && toggleSubmenu(item.title)}
                  >
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedMenus.includes(item.title) && "transform rotate-180"
                          )}
                        />
                      </>
                    )}
                  </div>
                  {!collapsed && expandedMenus.includes(item.title) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                            pathname === subItem.href
                              ? "bg-primary text-primary-foreground"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 mr-3" />
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}