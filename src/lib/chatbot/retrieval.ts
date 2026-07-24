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

    case "contact":
      return { label: "contact", data: contactData };

    case "resume":
      return {
        label: "resume",
        data: {
          resumeUrl: contactData.resumeUrl,
          resumeNote: contactData.resumeNote,
          email: contactData.email,
          linkedin: contactData.linkedin,
        },
      };

    case "greeting":
      // Small talk doesn't need much — just enough to reply warmly and
      // naturally in character, without dragging in unrelated data.
      return {
        label: "greeting",
        data: {
          name: profileData.name,
          role: profileData.role,
          shortBio: profileData.shortBio,
          currentFocus: profileData.currentFocus,
        },
      };

    case "off_topic":
      // Deliberately no portfolio data — nothing here for the model to
      // ground an in-scope answer in, which is exactly the point. It
      // declines using the scope rule in the system prompt instead.
      return { label: "off_topic", data: null };

    case "about":
    case "unknown":
    default:
      // Generous default: enough about Grechelle (bio, focus, interests,
      // location, skills categories, project names, and contact) that an
      // unclassified question still gets a real, well-grounded answer
      // instead of a dead end.
      return {
        label: "profile+overview",
        data: {
          name: profileData.name,
          role: profileData.role,
          location: profileData.location,
          shortBio: profileData.shortBio,
          longBio: profileData.longBio,
          currentFocus: profileData.currentFocus,
          interests: profileData.interests,
          skillCategories: skillsData.categories.map((c) => c.category),
          projectNames: projectsData.projects.map((p) => p.name),
          contact: { email: contactData.email, linkedin: contactData.linkedin },
        },
      };
  }
}