"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project, ProjectCategory } from "../data/projects";
import { FadeArticle } from "./motion";

type ProjectFilter = {
  id: string;
  label: string;
  category?: ProjectCategory;
};

type ProjectCollectionProps = {
  id: string;
  projects: Project[];
  archive?: boolean;
  showCount?: boolean;
  maxResults?: number;
  showFilterCounts?: boolean;
  allLabel?: string;
  projectOrderByFilter?: Record<string, string[]>;
};

const categoryFilters: ProjectFilter[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI", category: "AI" },
  { id: "3d", label: "3D", category: "3D" },
  { id: "motion", label: "Motion design", category: "Motion design" },
  { id: "backend", label: "Backend", category: "Backend" },
];

function matchesFilter(project: Project, filter?: ProjectFilter) {
  if (!filter?.category) {
    return true;
  }

  return project.categories.includes(filter.category);
}

export function ProjectCollection({
  id,
  projects,
  archive = false,
  showCount = false,
  maxResults,
  showFilterCounts = true,
  allLabel = "All",
  projectOrderByFilter,
}: ProjectCollectionProps) {
  const [activeFilterId, setActiveFilterId] = useState("all");
  const availableFilters = categoryFilters
    .map((filter) => ({
      ...filter,
      label: filter.id === "all" ? allLabel : filter.label,
      count: projects.filter((project) => matchesFilter(project, filter)).length,
    }))
    .filter((filter) => filter.id === "all" || filter.count > 0);
  const activeFilter = availableFilters.find((filter) => filter.id === activeFilterId);
  const matchingProjects = projects.filter((project) => matchesFilter(project, activeFilter));
  const preferredOrder = projectOrderByFilter?.[activeFilterId];
  const orderIndex = new Map(preferredOrder?.map((title, index) => [title, index]));
  const filteredProjects = preferredOrder
    ? [...matchingProjects].sort(
        (a, b) =>
          (orderIndex.get(a.title) ?? Number.MAX_SAFE_INTEGER) -
          (orderIndex.get(b.title) ?? Number.MAX_SAFE_INTEGER),
      )
    : matchingProjects;
  const visibleProjects = maxResults ? filteredProjects.slice(0, maxResults) : filteredProjects;

  return (
    <>
      <div className="project-filter-bar">
        <div className="project-filters" role="group" aria-label="Filter projects">
          {availableFilters.map((filter) => (
            <button
              className="project-filter"
              type="button"
              aria-controls={id}
              aria-pressed={activeFilterId === filter.id}
              data-active={activeFilterId === filter.id ? "true" : undefined}
              key={filter.id}
              onClick={() => setActiveFilterId(filter.id)}
            >
              <span>{filter.label}</span>
              {showFilterCounts ? (
                <span className="project-filter-count" aria-hidden="true">
                  {filter.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {showCount ? (
          <span className="project-result-count" aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </span>
        ) : null}
      </div>

      <div
        className={`projects${archive ? " projects-archive-list" : ""}`}
        id={id}
      >
        {visibleProjects.map((project, index) => (
          <FadeArticle
            className="project-card"
            delay={Math.min(index * (archive ? 0.045 : 0.065), 0.18)}
            key={project.title}
          >
            <a
              className="project-row"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
            >
              <h3>{project.title}</h3>
              <div className="project-details">
                <p>{project.description}</p>
                <div className="tags" aria-label={`${project.title} technologies`}>
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <span className="project-arrow" aria-hidden="true">
                ↗
              </span>
              <div className="project-preview" aria-hidden="true">
                <Image src={project.image} alt="" fill sizes="280px" />
              </div>
            </a>
          </FadeArticle>
        ))}
      </div>
    </>
  );
}
