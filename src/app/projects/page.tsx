"use client";

import Image from "next/image";
import { useState } from "react";
import { Layers, Search, MessageSquareMore } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { Button } from "@/src/components/ui/button";

import { projects } from "@/src/data/projects";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const allProjects = projects.projectsMain[0].items;
  const totalPages = Math.ceil(allProjects.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [open, setOpen] = useState(false);

  const formattedUpdatedAt = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <section className="flex flex-col gap-12 sm:gap-18">
      <div className="flex flex-col gap-4 @container">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            <h3 className="text-lg font-medium">Projects Gallery</h3>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(true)}
            >
              <Search size={16} />
              <p className="hidden @[275px]:block text-sm">Search</p>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 @[700px]:grid-cols-2 gap-2">
          {currentProjects.map((project, id) => (
            <div
              key={id}
              className="flex flex-col gap-12 bg-card rounded-lg p-4 border overflow-clip"
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="w-fit h-fit p-2 bg-secondary border rounded-lg">
                    <project.icon size={20} />
                  </div>
                  <div className="w-full flex flex-col @[800px]:flex-row @[800px]:items-center @[800px]:justify-between @[800px]:gap-2">
                    <h4 className="text-base font-medium line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-muted-foreground text-nowrap">
                      Updated At: <br className="hidden @[800px]:block" />
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
          ))}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.max(currentPage - 1, 1));
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isNearCurrent =
              page === 1 ||
              page === totalPages ||
              Math.abs(currentPage - page) <= 1;

            if (
              totalPages > 5 &&
              !isNearCurrent &&
              (page === 2 || page === totalPages - 1)
            ) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (totalPages <= 5 || isNearCurrent) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            return null;
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(Math.min(currentPage + 1, totalPages));
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {allProjects.map((project) => (
            <CommandGroup key={project.title}>
              <Link href={`${project.url}`}>
                <CommandItem key={project.title}>
                  <project.icon size={16} />
                  {project.title}
                </CommandItem>
              </Link>
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </section>
  );
}

export default Projects;
