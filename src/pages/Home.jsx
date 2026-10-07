import Hero from "../sections/Hero";
import AboutPreview from "../sections/AboutPreview";
import FeaturedProjects from "../sections/FeaturedProjects";
import ContactCTA from "../sections/ContactCTA";

function Home() {
  return (
    <main className="w-full bg-black">
      <Hero />
      <AboutPreview />
      <FeaturedProjects />
      <ContactCTA />
    </main>
  );
}

export default Home;