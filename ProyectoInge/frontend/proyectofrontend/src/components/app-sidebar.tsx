'use client'; 

import * as React from "react";
import { Car, CalendarCheck, BarChart2, Users, MapPin } from "lucide-react";
import Link from "next/link"; 
import { usePathname } from "next/navigation"; 

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

// Utilidad para concatenar clases condicionalmente (asumiendo que tienes una similar o puedes crearla)
import { cn } from '@/lib/utils'; // Si tienes una utilidad como `clsx` o `classnames`

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Obtiene la ruta actual

  const navLinks = [
    {
      title: "Automóviles",
      url: "/dashboard-admin/flota", // Asegúrate de que las URLs aquí coincidan con tus rutas reales
      icon: <Car className="size-4" />,
    },
    {
      title: "Reservas",
      url: "/dashboard-admin/reservas",
      icon: <CalendarCheck className="size-4" />,
    },
    {
      title: "Estadísticas",
      url: "/dashboard-admin/estadisticas",
      icon: <BarChart2 className="size-4" />,
    },
    {
      title: "Empleados",
      url: "/dashboard-admin/empleados",
      icon: <Users className="size-4" />,
    },
    {
      title: "Sucursales",
      url: "/dashboard-admin/sucursales",
      icon: <MapPin className="size-4" />,
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/pagina-inicio"> 
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex flex-col leading-none">
              <span className="font-semibold">AlquilApp Car</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((item) => {
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
                      "flex items-center gap-2",
                      isActive ? "bg-amber-100 text-amber-600 font-semibold" : "text-gray-900 hover:bg-gray-100 hover:text-amber-600"
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