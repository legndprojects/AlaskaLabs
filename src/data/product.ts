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
    "HIGHEST GRADE PEPTIDE.",
    "FROM THE HEART OF ALASKA.",
    "NO MIDDLEMAN, STRAIGHT FROM THE SOURCE, BEST PRICE FOR THE HIGHEST QUALITY.",
  ],
  postSections: [
    {
      title: "MAXIMUM PURITY",
      description:
        "Engineered with a precise blend of bioactive compounds — each batch undergoes rigorous HPLC analysis to ensure molecular integrity. Our peptides are synthesized using solid-phase methodology, delivering consistent chain lengths and purity levels that exceed pharmaceutical standards.",
    },
    {
      title: "LAB TESTED",
      description:
        "Every batch is third-party verified for identity, potency, and purity. We test for heavy metals, microbial contamination, and endotoxin levels — publishing full Certificates of Analysis so you never have to guess what you're putting in your body. Clean peptides, zero compromise.",
    },
  ],
};
