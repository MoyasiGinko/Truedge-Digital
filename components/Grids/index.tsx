import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./BentoGrid";
import ErrorBoundary from "../ErrorBoundary";

const Grid = () => {
  return (
    <section id="about">
      <ErrorBoundary
        fallback={<div className="w-full py-20">Loading content...</div>}
      >
        <BentoGrid className="w-full py-20">
          {gridItems.map((item, i) => (
            <BentoGridItem
              id={item.id}
              key={i}
              title={item.title}
              description={item.description}
              className={item.className}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
            />
          ))}
        </BentoGrid>
      </ErrorBoundary>
    </section>
  );
};

export default Grid;
