import SectionBlock from "./block";

export default function AboutSections() {
  return (
    <>
      <SectionBlock
        title="What we can do"
        items={[
          "Creative Front-end Development",
          "UI/UX & Product Interface Design",
          "Brand Identity & Visual Direction",
          "Motion Design & Micro-interactions",
          "Design Systems & Architecture",
          "High-performance Next.js Experiences",
          "Landing Pages & Digital Products",
        ]}
      />

      <SectionBlock
        title="Skills"
        items={[
          "React.js / Next.js",
          "Tailwind CSS / SASS",
          "Sanity.io / Firebase",
          "Figma / Prototyping / Wireframes",
          "Performance Optimization",
          "Component-driven Development",
        ]}
      />

      <SectionBlock
        title="Approach"
        items={[
          "Clarity — clean, functional, accessible interfaces",
          "Consistency — scalable systems and UI patterns",
          "Emotion — microinteractions with purpose",
          "Identity — design that reflects personality",
        ]}
      />
    </>
  );
}
