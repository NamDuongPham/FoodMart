import { useTitle } from "../../hooks/useTitle";
import About from "../../modules/About/About";

function AboutPage() {
  useTitle("About");
  return (
    <div>
      <About />
    </div>
  );
}

export default AboutPage;
