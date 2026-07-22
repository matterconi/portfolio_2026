export const GITHUB_USERNAME = "matterconi";
export const DAYS_IN_GRAPH = 371;

export type GitHubActivityDay = {
  date: string;
  level: number;
};

export type GitHubActivity = {
  levels: GitHubActivityDay[];
  total: number | null;
};

function extractActivity(html: string): GitHubActivity {
  const cells = html.match(/<[^>]+data-date="[^"]+"[^>]*>/g) ?? [];
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : null;

  const levels = cells
    .map((cell) => {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const level = Number(cell.match(/data-level="([0-4])"/)?.[1] ?? 0);

      return date ? { date, level } : null;
    })
    .filter((cell): cell is GitHubActivityDay => cell !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-DAYS_IN_GRAPH);

  return { levels, total };
}

export async function getGitHubActivity(): Promise<GitHubActivity> {
  try {
    const response = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "portfolio-light",
      },
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      return extractActivity(await response.text());
    }
  } catch {
    // Keep the tracker available when GitHub is temporarily unreachable.
  }

  return { levels: [], total: null };
}
