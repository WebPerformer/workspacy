import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { GripVertical, Bolt, Plus } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { projects } from "@/data/projects";

function AppQuickAccess(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section ref={setNodeRef} style={style} className="z-10">
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col gap-2 justify-between sm:flex-row sm:items-center">
          <div className="flex items-center justify-between sm:justify-start sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-2">
              <Button
                size="drag"
                variant="secondary"
                {...attributes}
                {...listeners}
              >
                <GripVertical />
              </Button>
              <h1 className="text-lg sm:text-xl font-medium">Quick Access</h1>
            </div>
            <Button size="icon" variant="ghost">
              <Bolt />
            </Button>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="w-full sm:w-auto sm:bg-transparent sm:hover:bg-secondary/50"
              >
                <Plus />
                Add Project
              </Button>
            </div>
          </div>
        </div>
        <Carousel>
          <CarouselContent className="@container -ml-2">
            {projects.projectsMain[0].items.slice(0, 3).map((project, id) => (
              <CarouselItem
                key={id}
                className="pl-2 basis-7/8 @[600px]:basis-3/7 @[700px]:basis-3/8 @[1040px]:basis-1/3"
              >
                <div className="relative aspect-video rounded-md bg-muted border border-secondary overflow-clip">
                  <div className="absolute bottom-0 left-0 w-full flex items-center gap-2 bg-background px-4 py-2 text-sm">
                    <project.icon size={16} />
                    {project.title}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

export default AppQuickAccess;
