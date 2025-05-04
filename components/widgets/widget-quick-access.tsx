import Image from "next/image";
import { useState, useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap, CircleAlert } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { projects } from "@/data/projects";
import WidgetQuickDialogContent from "./widget-quick-access-dialog";

function AppQuickAccess(props: any) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const allProjects = projects.projectsMain[0].items;

  useEffect(() => {
    if (selectedProjects.length === 0 && allProjects.length > 0) {
      const initialProjects = allProjects
        .slice(0, Math.min(3, allProjects.length))
        .map((project) => project.title);
      setSelectedProjects(initialProjects);
    }
  }, []);

  const filteredProjects = allProjects.filter((project) =>
    selectedProjects.includes(project.title)
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    cursor: isDragging ? "grabbing" : "auto",
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className="z-10"
      data-draggable="true"
    >
      <div className="flex flex-col gap-6 @container">
        <div className="w-full flex gap-2 flex-col justify-between @[275px]:flex-row @[275px]:items-center">
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <h1 className="text-lg sm:text-xl font-medium">Quick Access</h1>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full @[275px]:text-accent @[275px]:hover:text-foreground @[275px]:bg-transparent @[275px]:hover:bg-secondary/50"
                  >
                    <Plus />
                    Add Project
                  </Button>
                </DialogTrigger>
                <WidgetQuickDialogContent
                  selectedProjects={selectedProjects}
                  setSelectedProjects={setSelectedProjects}
                  onSave={handleDialogClose}
                />
              </Dialog>
            </div>
          </div>
        </div>
        <Carousel>
          <CarouselContent className="@container -ml-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, id) => (
                <CarouselItem
                  key={id}
                  className="pl-2 basis-7/8 @[600px]:basis-3/7 @[1040px]:basis-1/3"
                >
                  <div className="relative aspect-video rounded-md bg-muted border overflow-clip">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute bottom-0 left-0 w-full flex items-center gap-2 bg-background px-4 py-2 text-sm">
                      <project.icon size={16} />
                      {project.title}
                    </div>
                  </div>
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
        <Badge variant="outline">
          <CircleAlert size={16} />
          Just up to three projects allowed.
        </Badge>
      </div>
    </section>
  );
}

export default AppQuickAccess;
