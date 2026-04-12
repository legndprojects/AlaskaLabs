export const product = {
  name: "Prime Ice Pop",
  price: "$20.00",
  colors: {
    arcticBlue: "#0072BC",
    racingRed: "#E31C23",
    white: "#FFFFFF",
  },
  assets: {
    staticBottle: "/images/bottle-static.png",
    sequencePath: "/images/sequence/ezgif-frame-",
    sequenceFrames: 192,
    finalTagline: "THE PUREST PEPTIDE, STRAIGHT FROM THE SOURCE.",
  },
  specs: [
    { value: ">99.8%", label: "ULTRA-HIGH PURITY" },
    { value: "HPLC", label: "& MASS SPEC CONFIRMED" },
    { value: "<1 EU/MG", label: "ENDOTOXIN TESTED" },
    { value: "COA", label: "CERTIFICATE OF ANALYSIS INCLUDED" },
  ],
  storySections: [
    {
      eyebrow: "01 — PURITY",
      headline: "PHARMACEUTICAL\nGRADE PURITY",
      description:
        "HPLC-verified to greater than 99.8% purity and mass-spec confirmed. Every batch is synthesized under sterile conditions and meets pharmaceutical-grade specifications before it ever leaves the lab.",
    },
    {
      eyebrow: "02 — STANDARDS",
      headline: "EXCEPTIONAL\nSTANDARDS",
      description:
        "Independent third-party analysis for identity, potency, heavy metals, and endotoxins. A full Certificate of Analysis accompanies every order — no guesswork, no shortcuts.",
    },
    {
      eyebrow: "03 — DELIVERY",
      headline: "FROM OUR LAB,\nTO YOUR DOOR",
      description:
        "Shipped direct from our Alaska facility. No middlemen, no markups. Discreet, temperature-controlled packaging preserves molecular integrity from bench to doorstep.",
    },
  ],
  postSections: [
    {
      eyebrow: "04 — SPECIFICATIONS",
      title: "MAXIMUM PURITY",
      description:
        "Engineered with a precise blend of bioactive compounds — each batch undergoes rigorous HPLC analysis to ensure molecular integrity. Our peptides are synthesized using solid-phase methodology, delivering consistent chain lengths and purity levels that exceed pharmaceutical standards.",
    },
    {
      eyebrow: "05 — VERIFICATION",
      title: "LAB TESTED",
      description:
        "Every batch is third-party verified for identity, potency, and purity. We test for heavy metals, microbial contamination, and endotoxin levels — publishing full Certificates of Analysis so you never have to guess what you're putting in your body. Clean peptides, zero compromise.",
    },
  ],
};
