import axios from "axios";
import cheerio from "cheerio";

/**
 * List of realistic browser User-Agents.
 * We will try these one-by-one if requests fail.
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Searches Jomashop for a fragrance query.
 * @param {string} query - e.g. "La Nuit de L'Homme"
 * @returns {Array} normalized product results
 */
export async function searchJomashop(query) {
  // Build the search URL safely
  const searchUrl = `https://www.jomashop.com/search?q=${encodeURIComponent(query)}`;

  // Fetch the page using fallback logic
  const response = await fetchWithFallback(searchUrl);

  // Load the returned HTML into cheerio
  const $ = cheerio.load(response.data);

  const results = [];

  // Loop through each product card
  $(".product-item").each((_, element) => {
    const name = $(element)
      .find(".product-name")
      .text()
      .trim();

    const priceText = $(element)
      .find(".price")
      .text()
      .replace("$", "")
      .trim();

    const relativeLink = $(element)
      .find("a")
      .attr("href");

    // Skip incomplete products
    if (!name || !priceText || !relativeLink) return;

    results.push({
      site: "Jomashop",
      name,
      price: parseFloat(priceText),
      link: `https://www.jomashop.com${relativeLink}`
    });
  });

  return results;
}
