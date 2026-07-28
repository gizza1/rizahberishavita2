import { Hero } from "../components/site/Hero";
import { EditorialMarquee } from "../components/site/Marquee";
import { FeaturedSlider } from "../components/site/FeaturedSlider";

export default function Home() {
  return (
    <>
      <Hero />
      <EditorialMarquee />
      <FeaturedSlider />
    </>
  );
}
