"use client";

import * as React from "react";
import {
  Car,
  CalendarCheck,
  CalendarSearch,
  Users,
  MapPin,
  BadgeDollarSign,
  ChartNoAxesCombined,
  CalendarClock,
  ClipboardList,
  CornerDownLeft,
} from "lucide-react";
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

import { cn } from "@/lib/utils";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navLinks = [
    {
      title: "Automóviles",
      url: "/dashboard-admin/flota",
      icon: <Car className="size-4" />,
    },
    {
      title: "Reservas",
      url: "/dashboard-admin/reservas",
      icon: <ClipboardList className="size-4" />,
    },
    {
      title: "Alquileres",
      url: "/dashboard-admin/alquileres",
      icon: <CalendarCheck className="size-4" />,
    },
    {
      title: "Entregas",
      url: "/dashboard-admin/entregas",
      icon: <CalendarClock className="size-4" />,
    },
    {
      title: "Devoluciones",
      url: "/dashboard-admin/devoluciones",
      icon: <CornerDownLeft className="size-4" />,
    },
    
    {
      title: "Estadísticas",
      url: "/dashboard-admin/estadisticas",
      icon: <ChartNoAxesCombined className="size-4" />,
      children: [
        {
          title: "Autos Alquilados",
          url: "/dashboard-admin/estadisticas/autosAlquilados",
          icon: <CalendarSearch className="size-4" />
        },
        {
          title: "Clientes Registrados",
          url: "/dashboard-admin/estadisticas/clientesRegistrados",
          icon : <Users className="size-4" />,
        },
        {
          title: "Ingresos Semanales",
          url: "/dashboard-admin/estadisticas/ingresosSemanales",
          icon: <BadgeDollarSign className="size-4" />,
        },
      ],
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
            const isSectionActive = pathname.startsWith(item.url);
            const handleClick = (e: React.MouseEvent) => {
              if (isActive) {
                e.preventDefault();
                console.log(`Ya estás en la página: ${item.title}`);
              }
            };

            return (
              <React.Fragment key={item.url}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={handleClick}
                      className={cn(
                        "flex items-center gap-2",
                        isActive
                          ? "bg-amber-100 text-amber-600 font-semibold"
                          : "text-gray-900 hover:bg-gray-100 hover:text-amber-600"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {item.children &&
                  isSectionActive &&
                  item.children.map((child) => {
                    const isChildActive = pathname === child.url;
                    return (
                      <SidebarMenuItem key={child.url} className="pl-10">
                        <SidebarMenuButton asChild>
                          <Link
                            href={child.url}
                            className={cn(
                              "text-sm",
                              isChildActive
                                ? "bg-amber-100 text-amber-600 font-medium"
                                : "text-gray-700 hover:bg-gray-100 hover:text-amber-600"
                            )}
                          >
                            <>
                              {child.icon && (
                                <span>{child.icon}</span>
                              )}
                              {child.title}
                            </>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
