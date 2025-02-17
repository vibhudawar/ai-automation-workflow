import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbList,
 BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {WorkflowCard} from "@/components/workflow-card";
import {workflows} from "./contants";

export default function Page() {
 return (
  <>
   <header className="flex h-16 shrink-0 items-center gap-2">
    <div className="flex items-center gap-2 px-4">
     <SidebarTrigger className="-ml-1" />
     <Separator orientation="vertical" className="mr-2 h-4" />
     <Breadcrumb>
      <BreadcrumbList>
       <BreadcrumbItem className="hidden md:block">
        <BreadcrumbPage>Dashboard</BreadcrumbPage>
       </BreadcrumbItem>
      </BreadcrumbList>
     </Breadcrumb>
    </div>
   </header>
   <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
     {workflows.map((workflow) => (
      <WorkflowCard key={workflow.id} {...workflow} />
     ))}
    </div>
   </div>
  </>
 );
}
