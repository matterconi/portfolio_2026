import {
  DAYS_IN_GRAPH,
  GITHUB_USERNAME,
  getGitHubActivity,
  type GitHubActivityDay,
} from "../lib/github-activity";

const CELL_SIZE = 9;
const CELL_GAP = 3;
const GRAPH_LEFT = 15;
const GRAPH_TOP = 8;

const levelColors = ["#eef1f5", "#c7d7fe", "#8aabf8", "#4e7fe7", "#2563eb"];

function renderGraph(levels: GitHubActivityDay[]) {
  const cells = Array.from({ length: DAYS_IN_GRAPH }, (_, index) => {
    const cell = levels[index];
    const column = Math.floor(index / 7);
    const row = index % 7;
    const x = GRAPH_LEFT + column * (CELL_SIZE + CELL_GAP);
    const y = GRAPH_TOP + row * (CELL_SIZE + CELL_GAP);
    const fill = levelColors[cell?.level ?? 0];
    const label = cell ? `${cell.date}: activity level ${cell.level}` : "No public activity";

    return `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${fill}"><title>${label}</title></rect>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="660" height="100" viewBox="0 0 660 100" role="img" aria-labelledby="title description">
    <title id="title">GitHub activity for ${GITHUB_USERNAME}</title>
    <desc id="description">Public contribution activity over the last year.</desc>
    ${cells}
  </svg>`;
}

export async function GET() {
  const { levels } = await getGitHubActivity();

  return new Response(renderGraph(levels), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
