import * as React from "react"
import { ClipboardList, Car, Home } from "lucide-react"
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

export function EmployeeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
            <Link href="/pagina-inicio" >
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
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/reservas" className="flex items-center gap-2">
                <ClipboardList className="size-4" />
                Ver Reservas
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/alquileres" className="flex items-center gap-2">
                <Car className="size-4" />
                Ver Alquileres
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
