// REVIEW: API URL is hardcoded. Move to an environment variable (e.g., import.meta.env.VITE_API_URL) so it can differ between development, staging, and production.
// REVIEW: No request timeout — Render free-tier instances sleep after inactivity and can take 30+ seconds to wake. The user sees "Loading..." with no progress indicator or timeout fallback. Consider using AbortController with a timeout.
export const fetchSoundStates = async () => {
  const response = await fetch("https://afisha-api.onrender.com/api/sounds");

  if (!response.ok) {
    throw new Error("Failed to fetch sound states");
  }

  const data = await response.json();

  // map _id from MongoDB to id for React
  return data.map((sound) => ({
    ...sound,
    id: sound._id,
  }));
};
