import Navbar from "../../src/components/ui/Navbar";
import Footer from "../../src/components/ui/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}