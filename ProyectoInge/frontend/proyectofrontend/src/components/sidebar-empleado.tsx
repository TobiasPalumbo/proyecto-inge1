'use client'; 

import * as React from "react";
import { ClipboardList, Car, Home } from "lucide-react";
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
  const pathname = usePathname(); // Obtiene la ruta actual

  // Define tus enlaces de navegación en un array
  const navLinks = [
    {
      title: "Inicio",
      url: "/dashboard-empleado", // Asegúrate de que esta URL sea la correcta para el inicio del empleado
      icon: <Home className="size-4" />,
    },
    {
      title: "Ver Reservas",
      url: "/dashboard-empleado/reservas", // Asegúrate de que esta URL sea la correcta
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Ver Alquileres",
      url: "/alquileres", // Asegúrate de que esta URL sea la correcta
      icon: <Car className="size-4" />,
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
                e.preventDefault(); // Previene la navegación si ya estamos en la página
                console.log(`Ya estás en la página: ${item.title}`);
                // Opcional: podrías agregar una pequeña notificación visual aquí.
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