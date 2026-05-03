export type CatalogProduct = {
  handle: string;
  name: string;
  strength: string;
  vial: string;
  price: number;
  thumbnail: string;
  category: string;
  tags: string[];
  description: string;
};

export const catalog: CatalogProduct[] = [
  {
    handle: "retatrutide-10mg",
    name: "Retatrutide",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 116.99,
    thumbnail: "/images/products/retatrutide-10mg.png",
    category: "Research Compound",
    tags: ["glp-1", "gip", "glucagon", "triple agonist", "research"],
    description:
      "Retatrutide is a synthetic triple agonist peptide investigated in preclinical and clinical research for its concurrent activity at the GLP-1, GIP, and glucagon receptors. Published literature (Jastreboff et al., NEJM 2023) characterizes its receptor binding profile and dose-dependent pharmacodynamic responses in study cohorts. Supplied as lyophilized powder for reconstitution. For laboratory research use only.",
  },
  {
    handle: "retatrutide-20mg",
    name: "Retatrutide",
    strength: "20 MG",
    vial: "2 ml Vial",
    price: 179.99,
    thumbnail: "/images/products/retatrutide-20mg.png",
    category: "Research Compound",
    tags: ["glp-1", "gip", "glucagon", "triple agonist", "research"],
    description:
      "High-strength Retatrutide presentation for extended research protocols. Functions as a unimolecular agonist at GLP-1, GIP, and glucagon receptors, a profile studied for its receptor selectivity and pharmacokinetic properties in published trial data. Lyophilized powder; reconstitute with bacteriostatic water for in-vitro work. Research use only.",
  },
  {
    handle: "glow-70mg",
    name: "GLOW",
    strength: "70 MG",
    vial: "2 ml Vial",
    price: 62.96,
    thumbnail: "/images/products/glow-70mg.png",
    category: "Blends",
    tags: ["bpc-157", "tb-500", "ghk-cu", "blend", "repair", "matrix"],
    description:
      "GLOW is a tri-peptide research blend containing BPC-157 (50 mg), TB-500 (50 mg), and GHK-Cu (50 mg). Each component has a distinct body of literature: BPC-157 for cytoprotective and angiogenic signaling (Sikiric et al.), TB-500 (Thymosin β4 fragment) for actin-sequestering activity and tissue remodeling studies, and GHK-Cu for matrix remodeling and antioxidant pathways (Pickart & Margolina, 2018). Research use only.",
  },
  {
    handle: "klow-80mg",
    name: "KLOW",
    strength: "80 MG",
    vial: "2 ml Vial",
    price: 71.96,
    thumbnail: "/images/products/klow-80mg.png",
    category: "Blends",
    tags: ["bpc-157", "tb-500", "ghk-cu", "kpv", "blend", "repair"],
    description:
      "KLOW is a four-peptide research blend of BPC-157 (10 mg), TB-500 (10 mg), GHK-Cu (50 mg), and KPV (10 mg). KPV is the C-terminal tripeptide of α-MSH and has been characterized in the literature for its anti-inflammatory signaling in intestinal and dermal models (Dalmasso et al., Gastroenterology 2008). Combined with the regenerative profile of BPC-157 / TB-500 / GHK-Cu, KLOW is used in studies exploring integrated tissue repair pathways. Research use only.",
  },
  {
    handle: "tesamorelin-10mg",
    name: "Tesamorelin",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 89.96,
    thumbnail: "/images/products/tesamorelin-10mg.png",
    category: "Growth Hormone",
    tags: ["ghrh", "tesamorelin", "growth hormone", "ghrh-receptor"],
    description:
      "Tesamorelin is a stabilized GHRH(1–44) analog that binds the pituitary GHRH receptor. Its study corpus includes published characterization of receptor binding affinity and signaling dynamics (Falutz et al., NEJM 2007). Supplied as lyophilized powder. Research use only.",
  },
  {
    handle: "bpc-157-10mg",
    name: "BPC-157",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 62.91,
    thumbnail: "/images/products/bpc-157-10mg.png",
    category: "Repair",
    tags: ["bpc-157", "body protection compound", "repair", "gi"],
    description:
      "BPC-157 is a 15-amino-acid partial sequence derived from human gastric juice body protection compound. A large preclinical literature (reviewed by Sikiric et al., 2018) documents its cytoprotective, angiogenic, and tendon/ligament-associated effects in animal models, along with stability across a range of pH environments. Research use only.",
  },
  {
    handle: "mots-c-10mg",
    name: "MOTS-C",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 53.96,
    thumbnail: "/images/products/mots-c-10mg.png",
    category: "Mitochondrial",
    tags: ["mots-c", "mitochondrial", "research", "aging"],
    description:
      "MOTS-C is a 16-amino-acid peptide encoded within the mitochondrial 12S rRNA. It is studied as a mitochondrial-derived peptide (MDP) with published characterization of its AMPK signaling pathway interactions (Lee et al., Cell Metabolism 2015). Supplied as lyophilized powder. Research use only.",
  },
  {
    handle: "slu-pp-332-5mg",
    name: "SLU-PP-332",
    strength: "5 MG",
    vial: "2 ml Vial",
    price: 89.96,
    thumbnail: "/images/products/slu-pp-332-5mg.png",
    category: "Research Compound",
    tags: ["err", "estrogen related receptor", "err-agonist", "research"],
    description:
      "SLU-PP-332 is a pan-agonist of the estrogen-related receptors (ERRα/β/γ). Published work by Billon, Burris, and colleagues (JPET 2023; Science Advances 2024) characterizes its receptor activation profile and downstream transcriptional effects in murine models. Research use only.",
  },
  {
    handle: "ipamorelin-10mg",
    name: "Ipamorelin",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 80.96,
    thumbnail: "/images/products/ipamorelin-10mg.png",
    category: "Growth Hormone",
    tags: ["ghrp", "ipamorelin", "ghrelin receptor", "growth hormone"],
    description:
      "Ipamorelin is a pentapeptide ghrelin-receptor agonist (GHS-R1a) developed as a selective GH secretagogue. Unlike earlier GHRPs, published characterization (Raun et al., European Journal of Endocrinology 1998) reports limited effect on ACTH, cortisol, and prolactin in study cohorts, making it a frequent reference compound in selectivity research. Research use only.",
  },
  {
    handle: "cjc-1295-10mg",
    name: "CJC-1295",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 89.96,
    thumbnail: "/images/products/cjc-1295-10mg.png",
    category: "Growth Hormone",
    tags: ["ghrh", "cjc-1295", "growth hormone"],
    description:
      "CJC-1295 is a synthetic GHRH analog with amino acid substitutions that enhance metabolic stability versus native GHRH(1–29). Study literature (Teichman et al., JCEM 2006) characterizes its effect on GH and IGF-1 area-under-curve in healthy adult cohorts. Commonly referenced in combination research with ghrelin-receptor agonists. Research use only.",
  },
  {
    handle: "ghk-cu-100mg",
    name: "GHK-Cu",
    strength: "100 MG",
    vial: "2 ml Vial",
    price: 71.98,
    thumbnail: "/images/products/ghk-cu-100mg.png",
    category: "Repair",
    tags: ["ghk-cu", "copper peptide", "matrix", "repair"],
    description:
      "GHK-Cu is the copper-bound tripeptide glycyl-L-histidyl-L-lysine, endogenously present in plasma. A large literature (Pickart & Margolina, International Journal of Molecular Sciences 2018) reviews its effects on matrix metalloproteinase regulation, extracellular matrix protein expression, antioxidant signaling, and wound-model remodeling in preclinical studies. Research use only.",
  },
  {
    handle: "tb-500-10mg",
    name: "TB-500",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 71.91,
    thumbnail: "/images/products/tb-500-10mg.png",
    category: "Repair",
    tags: ["tb-500", "thymosin beta-4", "repair", "tissue"],
    description:
      "TB-500 corresponds to an active fragment of Thymosin β4, a ubiquitous 43-amino-acid peptide. Published work characterizes Tβ4 as the primary actin-sequestering peptide in mammalian cells and documents its role in cell migration, angiogenesis, and cardiac/corneal tissue remodeling in animal studies (Goldstein et al., Annals of the NY Academy of Sciences). Research use only.",
  },
  {
    handle: "semax-10mg",
    name: "Semax",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 71.96,
    thumbnail: "/images/products/semax-10mg.png",
    category: "Neuropeptide",
    tags: ["semax", "neuropeptide", "acth fragment", "bdnf"],
    description:
      "Semax is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) modeled after a fragment of adrenocorticotropic hormone (ACTH 4–10). Published research characterizes its activity on BDNF and NGF expression and neurotrophic signaling in rodent CNS models (Dolotov et al., 2006). Supplied lyophilized for reconstitution. Research use only.",
  },
  {
    handle: "selank-10mg",
    name: "Selank",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 71.96,
    thumbnail: "/images/products/selank-10mg.png",
    category: "Neuropeptide",
    tags: ["selank", "neuropeptide", "tuftsin", "gabaergic"],
    description:
      "Selank is a synthetic heptapeptide analog of the immunomodulatory peptide tuftsin, stabilized with a Pro-Gly-Pro C-terminal extension. Reviewed literature (Medvedev et al., 2015; Kolomin et al.) documents modulation of GABAergic signaling and effects on enkephalin/monoamine pathways in rodent behavioral models. Research use only.",
  },
  {
    handle: "melanotan-ii-10mg",
    name: "Melanotan II",
    strength: "10 MG",
    vial: "2 ml Vial",
    price: 62.96,
    thumbnail: "/images/products/melanotan-ii-10mg.png",
    category: "Melanocortin",
    tags: ["melanotan", "mt-2", "melanocortin", "alpha-msh", "mc1r"],
    description:
      "Melanotan II is a cyclic synthetic analog of α-melanocyte-stimulating hormone (α-MSH) acting as a non-selective agonist at melanocortin receptors (MC1R–MC5R). Characterized in early-phase literature (Hadley et al.; Dorr et al., 1996) for its effects on melanogenesis via MC1R and centrally mediated behavioral endpoints through MC3/4R. Research use only.",
  },
  {
    handle: "bpc-157-tb-500-blend-20mg",
    name: "BPC-157 + TB-500",
    strength: "20 MG",
    vial: "2 ml Vial",
    price: 71.96,
    thumbnail: "/images/products/bpc-157-tb-500-blend-20mg.png",
    category: "Blends",
    tags: ["bpc-157", "tb-500", "blend", "repair"],
    description:
      "A 1:1 research blend of BPC-157 (10 mg) and TB-500 (10 mg). The combination is frequently referenced in preclinical repair literature: BPC-157 for angiogenic and cytoprotective pathways and TB-500 (Thymosin β4 fragment) for actin-dynamics and tissue-remodeling activity. Supplied lyophilized for reconstitution. Research use only.",
  },
];

export function searchCatalog(q: string): CatalogProduct[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return catalog;
  return catalog.filter((p) => {
    const hay = [
      p.name,
      p.handle,
      p.strength,
      p.category,
      p.description,
      ...p.tags,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function findByHandle(handle: string): CatalogProduct | undefined {
  return catalog.find((p) => p.handle === handle);
}
