import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const CHANNEL_ID = "UClkUsLmJzRndVXjCVEhJCKg";

export async function GET() {
  try {
    const feedUrl =
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

    const response = await fetch(feedUrl, {
      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to load YouTube feed");
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const data = parser.parse(xml);

    const entries = data?.feed?.entry ?? [];

    const entryList = Array.isArray(entries)
      ? entries
      : [entries];

    const videos = entryList.slice(0, 6).map((entry: any) => {
      const videoId = entry["yt:videoId"];

      return {
        videoId,
        title: entry.title,
        publishedAt: entry.published,
        thumbnail:
          entry["media:group"]?.["media:thumbnail"]?.["@_url"] ??
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("YouTube feed error:", error);

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
