import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

const CURRENT_YEAR = new Date().getFullYear();

const LINKS_EN = ["Features", "Templates", "Pricing", "Privacy Policy", "Terms of Service"];
const LINKS_FR = ["Fonctionnalités", "Modèles", "Tarifs", "Politique de Confidentialité", "Conditions de Service"];

const getLinkHref = (name: string) => {
  if (name === "Features" || name === "Fonctionnalités") return "/#features";
  if (name === "Templates" || name === "Modèles") return "/templates";
  if (name === "Pricing" || name === "Tarifs") return "/pricing";
  if (name === "Privacy Policy" || name === "Politique de Confidentialité") return "/privacy-policy";
  if (name === "Terms of Service" || name === "Conditions de Service") return "/terms-of-service";
  return "/";
};

export function Footer() {
  const router = useRouter();
  const { language } = useLanguage();

  const handleStartDesigning = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/templates"); // Redirect to templates first
  };

  const links = language === "fr" ? LINKS_FR : LINKS_EN;

  return (
    <footer className="pb-12 px-8 pt-20 bg-[#FBF9F6] border-t border-[#D4C4B7]">
      <div className="container flex flex-col mx-auto">
        <div className="flex !w-full py-16 mb-12 flex-col justify-center !items-center bg-[#F0EBE1] border border-[#D4C4B7] max-w-6xl mx-auto rounded-[2px] p-6 text-center">
          <h3
            className="text-3xl md:text-4xl text-[#2A2726] font-serif font-bold tracking-normal mb-4"
          >
            {language === "fr" ? "Concevez votre faire-part de mariage sur-mesure dès aujourd'hui" : "Design Your Bespoke Wedding Invitation Today"}
          </h3>
          <p
            className="text-[#7A7571] md:w-7/12 text-center mb-8 font-sans text-base max-w-xl"
          >
            {language === "fr" 
              ? "Créez une expérience numérique 3D immersive et inoubliable pour vos invités avec de magnifiques animations et des mises à jour RSVP en direct." 
              : "Craft an unforgettable, immersive 3D digital experience for your guests with beautiful animations and live RSVP updates."}
          </p>
          <div className="flex w-full md:w-fit justify-center">
            <button 
              onClick={handleStartDesigning}
              className="bg-[#D4A574] text-[#FBF9F6] px-8 py-3 rounded-full font-sans font-medium hover:bg-[#C29260] transition-all normal-case cursor-pointer border-0"
            >
              {language === "fr" ? "Commencer la création" : "Start Designing"}
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center !justify-between gap-6">
          <Link
            href="/"
            className="text-xl font-serif font-bold tracking-widest text-[#2A2726] uppercase"
          >
            LUXURY INVITATION
          </Link>
          <ul className="flex flex-wrap justify-center my-4 md:my-0 items-center gap-6">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={getLinkHref(link)}
                  className="font-sans font-medium text-[#7A7571] hover:text-[#2A2726] transition-colors text-sm"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex w-fit justify-center gap-2">
            <button className="text-[#2A2726] hover:text-[#7A7571] p-1.5 focus:outline-none">
              <i className="fa-brands fa-twitter text-lg" />
            </button>
            <button className="text-[#2A2726] hover:text-[#7A7571] p-1.5 focus:outline-none">
              <i className="fa-brands fa-instagram text-lg" />
            </button>
            <button className="text-[#2A2726] hover:text-[#7A7571] p-1.5 focus:outline-none">
              <i className="fa-brands fa-pinterest text-lg" />
            </button>
          </div>
        </div>
        <p
          className="text-center mt-12 font-sans text-xs text-[#7A7571]"
        >
          &copy; {CURRENT_YEAR} LUXURY Invitation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
