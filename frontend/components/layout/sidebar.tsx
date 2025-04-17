"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingCart, Package, ShoppingBag, Calendar, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Clientes",
    href: "/clientes",
  },
  {
    icon: ShoppingCart,
    label: "Vendas",
    href: "/vendas",
  },
  {
    icon: Package,
    label: "Estoque",
    href: "/estoque",
  },
  {
    icon: ShoppingBag,
    label: "Compras",
    href: "/compras",
  },
  {
    icon: Receipt,
    label: "Contas a Receber",
    href: "/contas-a-receber",
  },
  {
    icon: Calendar,
    label: "Agendamentos",
    href: "/agendamentos",
  },
  {
    icon: Receipt,
    label: "Notas Fiscais",
    href: "/notas-fiscais",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-background border-r">
      <div className="p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-foreground hover:bg-accent transition-colors",
                isActive && "bg-accent font-medium",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
