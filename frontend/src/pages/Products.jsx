import { ProductShowcase } from "../components/site/ProductShowcase";
import { EditorialMarquee } from "../components/site/Marquee";

export default function Products() {
  return (
    <div className="pt-20">
      <ProductShowcase />
      <EditorialMarquee />
    </div>
  );
}
