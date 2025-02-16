import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { SidebarMenuButton } from "@workspace/ui/components/sidebar"
import { Folder, Plus } from "lucide-react"
import { ReactElement } from "react"

export const NewWorkspace = (): ReactElement => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton size="lg" className="text-sm">
          <Plus className="size-4" />
          <span className="ml-2">
            New Project
          </span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
            <Folder className="h-5 w-5 text-primary" />
          </div>

          <DialogHeader>
            <DialogTitle className="sm:text-center">Create a New Workspace</DialogTitle>
            <DialogDescription className="sm:text-center">Set up a new workspace for your project.</DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="workspace-name"
                className="peer ps-9"
                placeholder="Workspace Name"
                type="text"
                aria-label="Workspace Name"
              />

              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Folder size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="workspace-description"
                className="peer ps-9"
                placeholder="Description (optional)"
                type="text"
                aria-label="Description"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
          <Button type="button" className="w-full">
            Create Workspace
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By creating a workspace, you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms of Service
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  )
}