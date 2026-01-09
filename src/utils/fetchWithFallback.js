import axios from "axios";
import { USER_AGENTS } from "./userAgents";

/**
 * Delay helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches a URL using fallback User-Agents and delays
 */
export async function fetchWithFallback(url) {
  let lastError = null;

  for (const userAgent of USER_AGENTS) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": userAgent,
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9"
        },
        timeout: 8000
      });

      return response;

    } catch (error) {
      lastError = error;
      await sleep(1500);
    }
  }

  throw lastError;
}
