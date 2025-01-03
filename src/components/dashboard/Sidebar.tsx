import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import {
  Users,
  Dumbbell,
  Box,
  Calendar,
  BarChart3,
  Settings,
  BookUp,
  Nut,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/services/AuthContext";
import { useNavigate } from "react-router";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  items?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  {
    icon: <Nut className="h-5 w-5" />,
    label: "Users",
    href: "/users",
    isActive: false,
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Members",
    href: "/members",
    isActive: false,
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    label: "Equipment",
    href: "/equipments",
    isActive: false,
  },
  {
    icon: <Box className="h-5 w-5" />,
    label: "Room",
    href: "/rooms",
    isActive: false,
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Training Package",
    href: "/training-packages",
    isActive: false,
  },
  {
    icon: <BookUp className="h-5 w-5" />,
    label: "Type Package",
    href: "/type-packages",
    isActive: false,
  }
  ,
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Usage",
    href: "/usages",
    isActive: false,
  },
];

const Sidebar = ({ items = defaultNavItems, className }: SidebarProps) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={cn("w-[280px] h-full bg-white border-r px-4 py-6", className)}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8">
          <a href="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Gym Manager</span>
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {items.map((item, index) => (
            <Button
              key={index}
              variant={item.isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-3 py-6",
                item.isActive && "bg-secondary"
              )}
              asChild
            >
              <a href={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </a>
            </Button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
