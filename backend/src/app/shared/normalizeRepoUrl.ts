/**
 * Duplicate detection is based on the student + the GitHub repository,
 * not on the exact string the student typed. GitHub URLs are case-insensitive
 * and ".git" or a trailing slash point to the same repository.
 */
export const normalizeRepoUrl = (url: string): string => {
  const withoutTrailingSlash = url.trim().replace(/\/+$/, "");
  const withoutGit = withoutTrailingSlash.endsWith(".git")
    ? withoutTrailingSlash.slice(0, -4)
    : withoutTrailingSlash;

  return withoutGit.toLowerCase();
};
