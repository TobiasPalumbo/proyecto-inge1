'use client'; 

import * as React from "react";
import { ClipboardList, Car, Home, CalendarClock, CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from '@/lib/utils'; 

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

export function EmployeeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  
  const navLinks = [
    {
      title: "Reservas",
      url: "/dashboard-empleado/reservas", 
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Alquileres",
      url: "/dashboard-empleado/alquileres", 
      icon: <Car className="size-4" />,
    },
    
    {
      title: "Entregas",
      url: "/dashboard-empleado/entregas", 
      icon: <CalendarClock className="size-4" />,
    },
  {
      title: "Devoluciones",
      url: "/dashboard-empleado/devoluciones",
      icon: <CornerDownLeft className="size-4" />,
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/pagina-inicio"> 
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex flex-col leading-none">
              <span className="font-semibold">AlquilApp </span>
              <span className="text-xs text-muted-foreground">Empleado</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((item) => {
            // Determina si el enlace actual está activo
            const isActive = pathname === item.url;

            const handleClick = (e: React.MouseEvent) => {
              if (isActive) {
                e.preventDefault(); 
                console.log(`Ya estás en la página: ${item.title}`);

              }
            };

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    onClick={handleClick}
                    className={cn(
                      "flex items-center gap-2", // Clases base
                      isActive ? "bg-amber-100 text-amber-600 font-semibold" : "text-gray-900 hover:bg-gray-100 hover:text-amber-600" // Clases condicionales
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}