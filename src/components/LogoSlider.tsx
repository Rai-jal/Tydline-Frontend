import maersk from "../assets/shippinglineicons/maersk.webp";
import cma from "../assets/shippinglineicons/cma.webp";
import hapag from "../assets/shippinglineicons/happag.webp";
import oocl from "../assets/shippinglineicons/oocl.webp";
import cosco from "../assets/shippinglineicons/cosco.webp";
import grimaldi from "../assets/shippinglineicons/grimaldi.webp";
import msc from "../assets/shippinglineicons/msc.webp";
import arkas from "../assets/shippinglineicons/arkas.webp";
import pil from "../assets/shippinglineicons/pil.webp";
import safmarine from "../assets/shippinglineicons/safmarine.webp";
import bbc from "../assets/shippinglineicons/BBC.webp";
import ael from "../assets/shippinglineicons/AEL.webp";
import goldStar from "../assets/shippinglineicons/gold star.webp";
import one from "../assets/shippinglineicons/flag.webp";
import zim from "../assets/shippinglineicons/zim.webp";
import mol from "../assets/shippinglineicons/mol.webp";
import nildutch from "../assets/shippinglineicons/nildutch.webp";

const topRow = [
  { src: maersk,   alt: "Maersk" },
  { src: cma,      alt: "CMA CGM" },
  { src: hapag,    alt: "Hapag-Lloyd" },
  { src: oocl,     alt: "OOCL" },
  { src: cosco,    alt: "COSCO" },
  { src: grimaldi, alt: "Grimaldi Group" },
  { src: msc,      alt: "MSC" },
  { src: arkas,    alt: "Arkas" },
  { src: pil,      alt: "PIL" },
];

const bottomRow = [
  { src: safmarine, alt: "Safmarine" },
  { src: bbc,       alt: "BBC Chartering" },
  { src: ael,       alt: "Africa Express Line" },
  { src: goldStar,  alt: "Gold Star Line" },
  { src: one,       alt: "ONE" },
  { src: zim,       alt: "ZIM" },
  { src: mol,       alt: "MOL" },
  { src: nildutch,  alt: "NileDutch" },
];

function LogoSlider() {
  return (
    <section className="py-10 bg-white">
      <p className="text-center text-xs tracking-widest text-gray-500 uppercase mb-8 font-body">
        Connected across various shipping lines
      </p>

      {/* Single 9-column grid — both rows share identical column widths */}
      <div className="grid grid-cols-9 px-4 max-w-screen-xl mx-auto">
        {[...topRow, ...bottomRow].map((logo) => (
          <div
            key={logo.alt}
            className="h-[70px] border border-gray-100 flex items-center justify-center p-3"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
        {/* Empty cell to complete the second row */}
        <div className="h-[70px] border border-gray-100" />
      </div>
    </section>
  );
}

export default LogoSlider;
