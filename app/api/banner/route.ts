import { NextResponse } from "next/server";

type Banner = {
  id: number;
  enabled: boolean;
  startDate: string;
  endDate: string;
  occasion: "birthday" | "anniversary" | "memorial" | "special" | "general";
  title: string;
  message: string;
  image?: string | null;
};

const banners: Banner[] = [
  {
    id: 1,
    enabled: true,
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    occasion: "birthday",
    title: "",
    message:
      "",
    image: "/images/banner/image-1.jpeg",
  },
  {
    id: 2,
    enabled: true,
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    occasion: "birthday",
    title: "",
    message:
      "",
    image: "/images/banner/image-2.jpeg",
  },
  {
    id: 3,
    enabled: false,
    startDate: "2026-09-11",
    endDate: "2026-09-11",
    occasion: "birthday",
    title: "",
    message:
      "",
    image: "/images/banner/image-3.jpeg",
  },

  {
    id: 4,
    enabled: false,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message:
      "",
    image: "/images/banner/image-4.jpeg",
  },
  {
    id: 5,
    enabled: true,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message:
      "",
    image: "/images/banner/image-5.jpeg",
  },
  {
    id: 6,
    enabled: false,
    startDate: "2026-09-04",
    endDate: "2026-09-04",
    occasion: "memorial",
    title: "",
    message:
      "",
    image: "/images/banner/image-6.jpeg",
  },
];

type BannerItem = {
  id: number;
  enabled: boolean;
  startDate: string;
  endDate: string;
  occasion: string;
  title: string;
  message: string;
  image: string;
};

const defaultBanners: BannerItem[] = [];

export async function GET() {
  try {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const todayBanners = banners.filter((banner) => {
      return (
        banner.enabled &&
        today >= banner.startDate &&
        today <= banner.endDate
      );
    });

    if (todayBanners.length > 0) {
const scheduledBanners = todayBanners.map((banner, index) => ({
  ...banner,

  image:
    banner.image ||
    (defaultBanners.length > 0
      ? defaultBanners[index % defaultBanners.length].image
      : ""),

  isDefault: false,
}));

  const serviceBanners = defaultBanners.map((banner) => ({
    ...banner,
    isDefault: true,
  }));

  return NextResponse.json({
    type: "scheduled",
    date: today,
    banners: [
      ...scheduledBanners,
      ...serviceBanners,
    ],
  });
}

    // No banner scheduled for today.
    // Show general service / donation banners.
    return NextResponse.json({
      type: "default",
      date: today,
      banners: defaultBanners.map((banner) => ({
        ...banner,
        isDefault: true,
      })),
    });
  } catch (error) {
    console.error("Banner API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load banners",
      },
      {
        status: 500,
      }
    );
  }
}