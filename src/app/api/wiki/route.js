const WIKI_PARSE_API = "https://en.wikipedia.org/w/api.php";

// Server-side cache — persists across requests for the lifetime of the server process
const cache = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return Response.json({ error: "Missing title parameter" }, { status: 400 });
  }

  // Check server cache
  if (cache.has(title)) {
    return Response.json(cache.get(title));
  }

  const params = new URLSearchParams({
    action: "parse",
    page: title.replace(/_/g, " "),
    prop: "text|displaytitle|headhtml",
    format: "json",
    origin: "*",
    disableeditsection: "true",
    disabletoc: "false",
  });

  try {
    const res = await fetch(`${WIKI_PARSE_API}?${params}`);
    if (!res.ok) {
      return Response.json({ error: "Wikipedia API error" }, { status: 502 });
    }

    const data = await res.json();
    if (data.error) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const headHtml = data.parse.headhtml?.["*"] || "";
    const cssLinks = [];
    const linkRegex = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g;
    let match;
    while ((match = linkRegex.exec(headHtml)) !== null) {
      let href = match[1];
      if (href.startsWith("//")) href = "https:" + href;
      if (href.startsWith("/")) href = "https://en.wikipedia.org" + href;
      cssLinks.push(href);
    }

    const article = {
      title: data.parse.displaytitle || data.parse.title,
      html: data.parse.text["*"],
      cssLinks,
    };

    // Cache the result
    cache.set(title, article);

    return Response.json(article);
  } catch {
    return Response.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
