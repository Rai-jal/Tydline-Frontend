import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import HeroCard from "../components/HeroCard";
import herocardimg from "../assets/herocardimg.webp";
import gmail from "../assets/iconpack/gmail.svg";
import outlook from "../assets/iconpack/outlook.svg";
import whatsapp from "../assets/iconpack/whatsapp.svg";
import whatsappBusiness from "../assets/iconpack/whatsappbusines.svg";
import plug from "../assets/iconpack/plug.svg";
import settings from "../assets/iconpack/settings.svg";
import LogoSlider from "../components/LogoSlider";

function CTA() {
  return (
    <div className="w-full flex-1 flex flex-col items-center px-4">
      {/* Heading + subtext group */}
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-[#052698] text-center text-3xl font-[900]">
          TASA - your AI agent for zero - delay imports.
        </h1>
        <p className="text-center text-[#545454] w-[85%] mt-3 text-base leading-relaxed">
          Finally eliminate demurrage fees and protect your margins. Get
          continuous, real-time updates across <br /> WhatsApp, email, and your ERP so
          your cargo never sits waiting.
        </p>
      </div>

      {/* Hero card — centered in remaining space */}
      <div className="flex-1 flex items-center justify-center w-full">
        <HeroCard
          image={herocardimg}
          articles={[
            {
              iconLeft: whatsapp,
              iconRight: whatsappBusiness,
              description: "Your shipment has arrived ETA didnt change",
            },
            {
              iconLeft: gmail,
              iconRight: outlook,
              description: "Update: The ETA changed to this new date",
            },
            {
              iconLeft: plug,
              iconRight: settings,
              description: "Tracker Connected Successfully",
            },
          ]}
        />
      </div>

      {/* Input + Get Started group */}
      <div className="flex items-center justify-center gap-2 mb-6 w-[55%]">
        <InputField className="flex-1 h-13" />
        <Button className="w-36 h-12" />
      </div>

      <LogoSlider />
    </div>
  );
}

export default CTA;
