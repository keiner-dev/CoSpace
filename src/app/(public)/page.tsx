import HomeContent from "@/components/HomeContent";

// Renderizado estático obligatorio (SSG) según rúbrica
export const dynamic = "error";

export default function HomePage() {
  return <HomeContent />;
}