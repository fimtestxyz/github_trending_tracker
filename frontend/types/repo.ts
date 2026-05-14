export interface Repo {
  owner: String;
  name: String;
  description: String;
  language: string;
  stars: string;
  forks: string;
  stars_gained: string;
  avatar: string;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  "HTML/CSS": "#e34c26",
  Ruby: "#701516",
  Unknown: "#8b949e",
};
