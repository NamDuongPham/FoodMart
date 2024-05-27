import { useTitle } from "../../hooks/useTitle";
import Contact from "../../modules/Contact/Contact";

function ContactPage() {
  useTitle("Contact");
  return <div>
    <Contact/>
  </div>;
}

export default ContactPage;
