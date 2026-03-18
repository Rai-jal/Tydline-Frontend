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

function CTA() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-[#052698] text-center text-3xl font-bold">
        TASA - your AI agent for zero - delay imports.
      </h1>
      <p className="text-center text-[#545454] w-[60%] mt-5 text-lg leading-relaxed">
        Finally eliminate demurrage fees and protect your margins. Get
        continuous, real-time updates across WhatsApp, email, and your ERP so
        your cargo never sits waiting.
      </p>
      <div className="flex items-center justify-center gap-2 mt-8 w-[60%]">
        <InputField className="flex-1 h-12" />
        <Button className="w-36 h-12" />
      </div>
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
  );
}

export default CTA;
