import type {
  Project,
  Course,
  Skill,
  AboutContent,
  SocialLinks,
  PortfolioData,
} from "../data/types";

type Locale = "en" | "it";

/** Load all projects for the given locale. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const data = await import(`../data/${locale}/projects.json`);
  return data.default;
}

/** Load all courses for the given locale. */
export async function getCourses(locale: Locale): Promise<Course[]> {
  const data = await import(`../data/${locale}/courses.json`);
  return data.default;
}

/** Load all skills for the given locale. */
export async function getSkills(locale: Locale): Promise<Skill[]> {
  const data = await import(`../data/${locale}/skills.json`);
  return data.default;
}

/** Load the about content for the given locale. */
export async function getAbout(locale: Locale): Promise<AboutContent> {
  const data = await import(`../data/${locale}/about.json`);
  return data.default;
}

/** Load social links for the given locale. */
export async function getSocial(locale: Locale): Promise<SocialLinks> {
  const data = await import(`../data/${locale}/social.json`);
  return data.default;
}

/** Load all portfolio data for the given locale. */
export async function getPortfolioData(
  locale: Locale
): Promise<PortfolioData> {
  const [about, projects, experience, skills, social] = await Promise.all([
    getAbout(locale),
    getProjects(locale),
    getCourses(locale),
    getSkills(locale),
    getSocial(locale),
  ]);

  return { about, projects, experience, skills, social };
}
