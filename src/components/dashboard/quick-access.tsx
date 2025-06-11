import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SquarePen, Zap } from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";

import { projects } from "@/src/data/projects";

function QuickAccess() {
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [tempSelectedProjects, setTempSelectedProjects] = useState<number[]>(
    []
  );
  const allProjects = projects.projectsMain[0].items;
  const MAX_PROJECTS = 5;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedProjects.length === 0 && allProjects.length > 0) {
      const initialProjects = allProjects
        .slice(0, Math.min(MAX_PROJECTS, allProjects.length))
        .map((project) => project.id);
      setSelectedProjects(initialProjects);
      setTempSelectedProjects(initialProjects);
    }
  }, []);

  const filteredProjects = allProjects.filter((project) =>
    selectedProjects.includes(project.id)
  );

  const handleProjectToggle = (projectId: number) => {
    setTempSelectedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      } else {
        if (prev.length >= MAX_PROJECTS) {
          return prev;
        }
        return [...prev, projectId];
      }
    });
  };

  const handleSave = async () => {
    try {
      // TODO: Add your database save logic here
      // Example:
      // await saveToDatabase(tempSelectedProjects);

      console.log(tempSelectedProjects);

      setSelectedProjects(tempSelectedProjects);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save projects:", error);
      // TODO: Add error handling/notification
    }
  };

  const handleCancel = () => {
    setTempSelectedProjects(selectedProjects);
    setOpen(false);
  };

  const formattedUpdatedAt = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <section className="flex flex-col gap-4">
      <Carousel className="flex flex-col gap-4 @container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <h3 className="text-lg font-medium">Quick Access</h3>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <CarouselPrevious className="static h-6 w-6 translate-y-0" />
              <CarouselNext className="static h-6 w-6 translate-y-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setOpen(true)}>
              <SquarePen />
              <p className="hidden @[275px]:block text-sm">Custom</p>
            </Button>
          </div>
        </div>
        <CarouselContent className="@container -ml-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, id) => (
              <CarouselItem
                key={id}
                className="pl-2 basis-7/8 @[600px]:basis-3/7 @[1040px]:basis-1/3"
              >
                <Link href={`${project.url}`}>
                  <div className="flex flex-col gap-12 bg-card rounded-lg p-4 overflow-clip">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <div className="w-fit h-fit p-2 bg-secondary border rounded-lg">
                          <project.icon size={20} />
                        </div>
                        <div className="w-full flex flex-col @[690px]:flex-row @[690px]:items-center @[690px]:justify-between">
                          <h4 className="text-base font-medium line-clamp-1">
                            {project.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            Updated At: <br className="hidden @[690px]:block" />
                            <span>{formattedUpdatedAt(project.updatedAt)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="h-11">
                        <p className="text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>{project.category}</Badge>
                      </div>
                      <p>v1.54</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="pl-2 basis-full">
              <div className="flex items-center justify-center p-8 rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No projects added
                </p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="search..." />
        <div className="px-4 py-2 text-base font-medium text-muted-foreground">
          Projects selected: {tempSelectedProjects.length}/{MAX_PROJECTS}
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {allProjects.map((project) => (
            <CommandGroup key={project.title}>
              <CommandItem
                key={project.title}
                onSelect={() => handleProjectToggle(project.id)}
                className={`${
                  tempSelectedProjects.includes(project.id)
                    ? "text-foreground bg-accent/5 border border-secondary"
                    : tempSelectedProjects.length >= MAX_PROJECTS
                    ? "bg-background border cursor-not-allowed"
                    : "bg-background border"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={project.title}
                    checked={tempSelectedProjects.includes(project.id)}
                    disabled={
                      !tempSelectedProjects.includes(project.id) &&
                      tempSelectedProjects.length >= MAX_PROJECTS
                    }
                    onCheckedChange={() => handleProjectToggle(project.id)}
                  />
                  <Label
                    htmlFor={project.title}
                    className={`flex items-center gap-2 ${
                      !tempSelectedProjects.includes(project.id) &&
                      tempSelectedProjects.length >= MAX_PROJECTS
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <project.icon
                      size={16}
                      className={`${!tempSelectedProjects.includes(
                        project.id
                      )} && "text-muted-foreground"`}
                    />
                    {project.title}
                  </Label>
                </div>
              </CommandItem>
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CommandDialog>
    </section>
  );
}

export default QuickAccess;
