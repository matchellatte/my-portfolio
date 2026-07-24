import profileData from "../../data/profile.json";
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import contactData from "../../data/contact.json";
import type { IntentResult, RetrievedContext } from "./types";

/**
 * Given a classified intent, return only the JSON slice relevant to it.
 * We never send the entire portfolio to the model — e.g. asking about the
 * ERP project retrieves only that one project object, not all five.
 */
export function retrieveContext(result: IntentResult): RetrievedContext {
  switch (result.intent) {
    case "project": {
      const slugs = result.projectSlugs ?? [];
      const matched =
        slugs.length > 0
          ? projectsData.projects.filter((p) => slugs.includes(p.slug))
          : projectsData.projects.map(({ name, description, technologies }) => ({
              name,
              description,
              technologies,
            })); // no specific project named → send lightweight summaries only
      return { label: `project(${slugs.join(",") || "all-summary"})`, data: matched };
    }

    case "experience":
      return { label: "experience", data: experienceData.experience };

    case "education":
      return { label: "education", data: educationData };

    case "tech_stack":
      return { label: "skills", data: skillsData.categories };

    case "availability":
      return {
        label: "availability",
        data: { availability: profileData.availability, contact: contactData.email },
      };

    case "about":
    case "unknown":
    default:
      return {
        label: "profile",
        data: {
          shortBio: profileData.shortBio,
          currentFocus: profileData.currentFocus,
          interests: profileData.interests,
        },
      };
  }
}
