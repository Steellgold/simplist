"use client";

import { useEffect, useState, type ReactElement } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomCard } from "@/components/ui/custom-card";
import { ChevronRight, Plus } from "lucide-react";
import { NewProjectDialog } from "@/components/new-project.dialog";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project.store";
import { cn } from "@/utils";
import { specialFont } from "@/components/ui/font";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  posts: {
    projectId: string;
  }[];
};

const Home = (): ReactElement => {
  const [isLogged, setIsLogged] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const { setProjects: setStoreProjects } = useProjectStore();

  useEffect(() => {
    setIsLoading(true);

    const fetchProjects = async(): Promise<void> => {
      const authResponse = await fetch("/auth/is-logged");
      const authSchema = z.object({
        isLogged: z.boolean()
      }).safeParse(await authResponse.json());

      if (!authSchema.success) {
        console.error(authSchema.error);
        toast.error("Failed to check if you are logged in");
        setIsLoading(false);
        setIsLogged(false);
        return;
      }

      if (!authSchema.data.isLogged) {
        setIsLoading(false);
        setIsLogged(false);
        return;
      }

      setIsLogged(true);

      const response = await fetch("/api/user/projects");

      const schema = z.object({
        projects: z.array(z.object({
          id: z.string(),
          name: z.string(),
          createdAt: z.string(),
          posts: z.array(z.object({
            projectId: z.string()
          }))
        }))
      }).safeParse(await response.json());

      if (!schema.success) {
        console.error(schema.error);
        toast.error("Failed to fetch projects");
        return;
      }

      setProjects(schema.data.projects);
      setStoreProjects(schema.data.projects.map(({ id, name }) => ({ id, name })));
      setIsLoading(false);
    };

    void fetchProjects();
  }, [setProjects, setStoreProjects]);

  if (!isLogged) return <>You are not logged in</>;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-40" />
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">You have no projects</h1>
        <p className="text-lg text-muted-foreground">To start creating posts, begin by creating a project</p>

        <div className="my-2"></div>

        <NewProjectDialog isFirst>
          <Button>
            <Plus className="h-4" />Create a project
          </Button>
        </NewProjectDialog>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="mb-3 bg-[#1a1a1a] p-3 rounded-md flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col">
          <p className={cn(specialFont.className, "text-2xl")}>Hello there! 👋</p>
          <p className="text-muted-foreground text-sm">
            Remember, you can always create a new project, or click on an existing one to view its posts
          </p>
        </div>

        <NewProjectDialog isFirst={false}>
          <Button size={"sm"} className="mt-2 sm:mt-0 w-full sm:w-auto">
            <Plus className="h-4" />New project
          </Button>
        </NewProjectDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/${project.id}`}>
            <CustomCard className="w-full h-36 border-2 hover:cursor-pointer transition-colors group">
              <CardHeader className="flex flex-row justify-between">
                <div className="flex flex-col justify-center">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.posts.length} post{project.posts.length === 1 ? "" : "s"} in this project
                  </CardDescription>
                </div>

                <ChevronRight
                  size={24}
                  className="text-[#252525] group-hover:text-[#5c5c5c] transition-all transform group-hover:translate-x-1" />
              </CardHeader>
            </CustomCard>
          </Link>
        ))}
      </div>
    </div>
  );
};


export default Home;