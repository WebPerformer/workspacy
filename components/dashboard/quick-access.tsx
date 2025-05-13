import React, { useEffect, useState } from "react";
import { Pencil, SquareArrowOutUpRight, Zap } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { projects } from "@/data/projects";

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
            <Button
              variant="ghost"
              className="text-accent"
              onClick={() => setOpen(true)}
            >
              <Pencil />
              <p className="hidden @[275px]:block text-sm">Customize</p>
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
                <div className="flex flex-col gap-2 bg-card rounded-lg p-2 border">
                  <div className="flex gap-2">
                    <div className="w-fit h-fit p-2 m-1 bg-primary rounded-lg">
                      <project.icon size={20} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-base font-medium line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-accent line-clamp-2">
                        {project.category}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-accent line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{project.category}</Badge>
                      <p className="hidden sm:block text-xs text-accent">
                        {project.createdAt.split("-").reverse().join("/")}
                      </p>
                    </div>
                    <SquareArrowOutUpRight size={16} className="text-accent" />
                  </div>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="pl-2 basis-full">
              <div className="flex items-center justify-center p-8 rounded-md border border-dashed">
                <p className="text-sm text-accent">No projects added</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="search..." />
        <div className="px-4 py-2 text-base font-medium text-accent">
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
                        ? "text-accent/50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <project.icon
                      size={16}
                      className={`${
                        tempSelectedProjects.includes(project.id)
                          ? "text-foreground"
                          : tempSelectedProjects.length >= MAX_PROJECTS
                          ? "text-accent/50"
                          : "text-accent"
                      }`}
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
