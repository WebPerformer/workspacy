import React from "react";
import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { projects } from "@/data/projects";

function WidgetQuickDialogContent({
  selectedProjects,
  setSelectedProjects,
  onSave,
}: {
  selectedProjects: string[];
  setSelectedProjects: (projects: string[]) => void;
  onSave: () => void;
}) {
  const [tempSelectedProjects, setTempSelectedProjects] =
    useState<string[]>(selectedProjects);
  const allProjects = projects.projectsMain[0].items;

  useEffect(() => {
    setTempSelectedProjects(selectedProjects);
  }, [selectedProjects]);

  const handleToggleProject = (projectTitle: string) => {
    setTempSelectedProjects((prev) => {
      if (prev.includes(projectTitle)) {
        return prev.filter((title) => title !== projectTitle);
      } else {
        if (prev.length < 3) {
          return [...prev, projectTitle];
        }
        return prev;
      }
    });
  };

  const handleSave = () => {
    setSelectedProjects(tempSelectedProjects);
    onSave();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Projects {tempSelectedProjects.length}/3</DialogTitle>
        <DialogDescription>
          Choose up to three projects to display in your Quick Access.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 mb-2 max-h-[135px] overflow-y-auto scrollbar-dialog">
        {allProjects.map((project, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`project-${index}`}
              checked={tempSelectedProjects.includes(project.title)}
              disabled={
                tempSelectedProjects.length >= 3 &&
                !tempSelectedProjects.includes(project.title)
              }
              onCheckedChange={() => handleToggleProject(project.title)}
            />
            <label
              htmlFor={`project-${index}`}
              className="text-sm font-medium flex items-center gap-1 peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground"
            >
              <project.icon size={16} />
              {project.title}
            </label>
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default WidgetQuickDialogContent;
