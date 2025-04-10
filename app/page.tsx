import Hero from "@/components/Hero";
import Grid from "@/components/Grids";
import RecentProjects from "@/components/Projects";
import Clients from "@/components/Clients";
// import Experience from "@/components/Experience";
// import Approach from "@/components/Approach";
import CombinedSections from "@/components/CombinedSections";
import ContactSection from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
        <div className="max-w-7xl w-full">
          <Grid />
          <RecentProjects />
          <Clients />
        </div>
      </main>
      <CombinedSections />
      <ContactSection />
    </>
  );
}
