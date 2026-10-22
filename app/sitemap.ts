import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { certificates } from "@/lib/certificates";
import { SITE_URL } from "@/components/utils/externalLinks";

const baseUrl = SITE_URL;

/** Bump by hand when site copy changes, so crawlers see real change dates. */
const CONTENT_UPDATED = "2026-10-22";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated ?? CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const certificateRoutes: MetadataRoute.Sitemap = certificates.map((certificate) => ({
    url: `${baseUrl}/certificates/${certificate.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...certificateRoutes];
}
