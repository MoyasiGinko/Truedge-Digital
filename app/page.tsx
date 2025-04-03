import Header from "@/components/Header";
import Image from "next/image";
import Hero from "@/components/Hero";
import Grid from "@/components/Grids";
import RecentProjects from "@/components/Projects";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Header />
        <Hero />
        <Grid />
        <RecentProjects />
      </div>
    </main>
  );
}
