import AboutSection from "../sections/About";
import Experience from "../sections/Experience";
import Education from "../sections/Education";

function About() {
  return (
    <main className="w-full bg-black">
      <AboutSection />
      <Experience />
      <Education />
    </main>
  );
}

export default About;