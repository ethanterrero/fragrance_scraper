import cheerio from "cheerio";
import { fetchWithFallback } from "@/utils/fetchWithFallback";

export async function searchFragranceNet(query) {
  const searchUrl = `https://www.fragrancenet.com/search/${encodeURIComponent(query)}`;

  const response = await fetchWithFallback(searchUrl);
  const $ = cheerio.load(response.data);

  const results = [];

  $(".product-card").each((_, el) => {
    const name = $(el).find(".product-name").text().trim();
    const priceText = $(el).find(".price").first().text().replace("$", "").trim();
    const link = $(el).find("a").attr("href");

    if (!name || !priceText || !link) return;

    results.push({
      site: "FragranceNet",
      name,
      price: parseFloat(priceText),
      link: `https://www.fragrancenet.com${link}`
    });
  });

  return results;
}
