import { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getAllStories } from "@/lib/stories";
import LibraryClient from "./LibraryClient";

export const metadata: Metadata = {
  title: "Story Library — All Islamic Stories",
  description:
    "Browse 50+ Islamic bedtime stories for Muslim children aged 3-12. Filter by age group: Little Stars (3-5), Rising Moons (6-8), Young Explorers (9-12).",
  alternates: { canonical: "https://noorbedtime.com/library" },
};

export default function LibraryPage() {
  const stories = getAllStories();
  return <LibraryClient stories={stories} />;
}
