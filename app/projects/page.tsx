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
} from "@/components/ui/pagination";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { projects } from "@/data/projects";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const allProjects = projects.projectsMain[0].items;
  const totalPages = Math.ceil(allProjects.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [open, setOpen] = useState(false);

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
              className="w-full text-accent hover:text-foreground bg-transparent hover:bg-secondary/50"
              onClick={() => setOpen(true)}
            >
              <Search size={16} />
              <p className="hidden @[275px]:block text-sm">Search</p>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 @[475px]:grid-cols-2 @[700px]:grid-cols-3 gap-2">
          {currentProjects.map((project, id) => (
            <div
              key={id}
              className="flex flex-col gap-4 bg-card rounded-lg p-2 border"
            >
              <div className="flex flex-col gap-1 px-2">
                <h4 className="text-lg font-medium line-clamp-1">
                  {project.title}
                </h4>
                <p className="text-xs text-accent line-clamp-2">
                  {project.description}
                </p>
              </div>
              <Image
                src={project.image}
                alt={project.title}
                className="w-full h-30 object-cover rounded-lg"
              />
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{project.category}</Badge>
                  <p className="hidden sm:block text-xs text-accent">
                    {project.createdAt.split("-").reverse().join("/")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquareMore size={16} className="text-accent" />
                  <p className="text-xs text-accent">13</p>
                </div>
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
              <Link href={`/projects/${project.title}`}>
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
