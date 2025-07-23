"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Receipt, 
  Wallet, 
  ChartBar, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transações", href: "/transactions", icon: Receipt },
  { name: "Categorias", href: "/categories", icon: Wallet },
  { name: "Relatórios", href: "/reports", icon: ChartBar },
  { name: "Configurações", href: "/settings", icon: Settings },
];

interface SidebarProps {
  userName?: string;
}

export function Sidebar({ userName = "Usuário" }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold">Maatz Financeiro</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 space-y-4">
        <div className="px-3">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{userName}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Gerenciar conta</p>
        </div>
        
        <form action="/api/auth/logout" method="POST">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-white dark:bg-zinc-900">
        <NavContent />
      </div>
    </>
  );
}