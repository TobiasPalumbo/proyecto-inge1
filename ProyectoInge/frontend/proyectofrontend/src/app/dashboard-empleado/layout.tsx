import { EmployeeSidebar } from "@/components/sidebar-empleado"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import EmpleadoGuard from "@/components/Empleadoprotect"

export default function Page({
  children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <EmpleadoGuard>
    <SidebarProvider>
      <EmployeeSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard-admin">
                                    Inicio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                <BreadcrumbPage>…</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList> 
            </Breadcrumb>
                      </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                      {children}

        </div>
      </SidebarInset>
    </SidebarProvider>
    </EmpleadoGuard>
  )
}