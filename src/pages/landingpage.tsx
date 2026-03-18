import Header from "../layouts/Header";
import CTA from "../layouts/CTA";

function LandingPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F9E4D2] relative px-5">
      {/* Inner content area with lighter background */}
      <div className="w-full h-full bg-[#FFF9F5] flex flex-col items-center overflow-hidden border-x-[0.5px] border-[#052698]/30">
        <Header />
        <CTA />
      </div>
    </div>
  );
}

export default LandingPage;
