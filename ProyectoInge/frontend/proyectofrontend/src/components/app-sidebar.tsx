import * as React from "react"
import { Car, CalendarCheck, BarChart2, Users } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
    const data = {
  navMain: [
    {
      title: "Automóviles",
      url: "/dashboard/automoviles",
      items: [],
    },
    {
      title: "Reservas",
      url: "/dashboard/reservas",
      items: [],
    },
    {
      title: "Estadísticas",
      url: "/dashboard/estadisticas",
      items: [],
    },
    {
      title: "Empleados",
      url: "/dashboard/empleados",
      items: [],
    },
  ],
}



    return (
    <Sidebar {...props}>
      <SidebarHeader>
          <Link href="/pagina-inicio" >
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex flex-col leading-none">
            <span className="font-semibold">AlquilApp</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
         </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="dashboard-admin/flota" className="flex items-center gap-2">
                <Car className="size-4" />
                Ver Automóviles
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/reservas" className="flex items-center gap-2">
                <CalendarCheck className="size-4" />
                Ver Reservas
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/estadisticas" className="flex items-center gap-2">
                <BarChart2 className="size-4" />
                Ver Estadísticas
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/empleados" className="flex items-center gap-2">
                <Users className="size-4" />
                Ver Empleados
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
