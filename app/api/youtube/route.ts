import { NextResponse } from "next/server";

/*youtube CHANNEL_ID */
const CHANNEL_ID = "UClkUsLmJzRndVXjCVEhJCKg";

const UPLOADS_PLAYLIST_ID =
  CHANNEL_ID.startsWith("UC")
    ? `UU${CHANNEL_ID.substring(2)}`
    : CHANNEL_ID;

const MAX_VIDEOS = 6;

type YouTubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
};

function decodeYouTubeText(value: string) {
  return value
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractVideoIds(html: string) {
  const ids: string[] = [];

  /*
   * The public playlist page contains video IDs in its HTML data.
   * We collect unique IDs in the order YouTube provides them.
   */
  const matches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);

  for (const match of matches) {
    const videoId = match[1];

    if (!ids.includes(videoId)) {
      ids.push(videoId);
    }

    if (ids.length >= MAX_VIDEOS) {
      break;
    }
  }

  return ids;
}

function extractTitle(html: string, videoId: string) {
  /*
   * First try Open Graph title.
   */
  const ogTitle =
    html.match(
      /<meta\s+property="og:title"\s+content="([^"]*)"/i
    )?.[1] ??
    html.match(
      /<meta\s+content="([^"]*)"\s+property="og:title"/i
    )?.[1];

  if (ogTitle) {
    return decodeYouTubeText(ogTitle);
  }

  /*
   * Fallback to title stored in YouTube page JSON.
   */
  const jsonTitle = html.match(
    /"title":"([^"]+)"/
  )?.[1];

  if (jsonTitle) {
    return decodeYouTubeText(jsonTitle);
  }

  return `YouTube Video ${videoId}`;
}

function extractPublishedDate(html: string) {
  /*
   * YouTube watch pages normally expose the publication date
   * in page metadata.
   */
  const itemPropDate =
    html.match(
      /itemprop="datePublished"\s+content="([^"]+)"/i
    )?.[1] ??
    html.match(
      /content="([^"]+)"\s+itemprop="datePublished"/i
    )?.[1];

  if (itemPropDate) {
    return itemPropDate;
  }

  /*
   * Fallback to YouTube JSON data.
   */
  const publishDate =
    html.match(
      /"publishDate":"([^"]+)"/
    )?.[1];

  if (publishDate) {
    return publishDate;
  }

  const uploadDate =
    html.match(
      /"uploadDate":"([^"]+)"/
    )?.[1];

  if (uploadDate) {
    return uploadDate;
  }

  /*
   * Prevent the frontend from receiving undefined.
   */
  return "";
}

async function loadVideoDetails(
  videoId: string
): Promise<YouTubeVideo> {
  const watchUrl =
    `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const response = await fetch(watchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 Chrome/130 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },

      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Video page returned ${response.status}`
      );
    }

    const html = await response.text();

    return {
      videoId,
      title: extractTitle(html, videoId),

      publishedAt: extractPublishedDate(html),

      thumbnail:
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,

      url: watchUrl,
    };
  } catch (error) {
    console.error(
      `Unable to load YouTube video ${videoId}:`,
      error
    );

    return {
      videoId,
      title: "YouTube Video",

      publishedAt: "",

      thumbnail:
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,

      url: watchUrl,
    };
  }
}

export async function GET() {
  try {
    const playlistUrl =
      `https://www.youtube.com/playlist?list=${UPLOADS_PLAYLIST_ID}`;

    const response = await fetch(playlistUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 Chrome/130 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },

      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      const body = await response.text();

      console.error("YouTube playlist failed:", {
        status: response.status,
        body: body.substring(0, 500),
      });

      return NextResponse.json(
        {
          error: "Unable to load YouTube playlist",
        },
        {
          status: 502,
        }
      );
    }

    const html = await response.text();

    const videoIds = extractVideoIds(html);

    console.log(
      "YouTube video IDs found:",
      videoIds
    );

    if (videoIds.length === 0) {
      console.error(
        "No YouTube video IDs found in playlist"
      );

      return NextResponse.json(
        {
          error: "No YouTube videos found",
        },
        {
          status: 404,
        }
      );
    }

    const videos = await Promise.all(
      videoIds
        .slice(0, MAX_VIDEOS)
        .map((videoId) =>
          loadVideoDetails(videoId)
        )
    );

    return NextResponse.json(videos);
  } catch (error) {
    console.error(
      "YouTube videos error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load YouTube videos",
      },
      {
        status: 500,
      }
    );
  }
}