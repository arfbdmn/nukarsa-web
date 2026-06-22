/**
 * Centralized client dataset for Nukarsa.
 * Used by the OurClients landing section and the dedicated /clients page.
 */

export interface Client {
  id: number;
  name: string;
  industry: string;
  logo: string;
  description: string;
}

export const clients: Client[] = [
  {
    id: 1,
    name: "Air Asia",
    industry: "Air Land",
    logo: "/clients/airasia.png",
    description: "",
  },
  {
    id: 2,
    name: "WRP",
    industry: "Healthy Food",
    logo: "/clients/wrp.jpeg",
    description: "",
  },
  {
    id: 3,
    name: "Daikin",
    industry: "Manufacturing",
    logo: "/clients/daikin.png",
    description: "",
  },
  {
    id: 4,
    name: "Fong's",
    industry: "Manufacturing",
    logo: "/clients/fongs.png",
    description: "",
  },
  {
    id: 5,
    name: "GDM",
    industry: "Real Estate",
    logo: "/clients/gdm.webp",
    description: "",
  },
  {
    id: 6,
    name: "KB Data System Indonesia",
    industry: "Data Analytic & Software",
    logo: "/clients/kb.jpeg",
    description: "",
  },
  {
    id: 7,
    name: "Legenda Wisata",
    industry: "Real Estate",
    logo: "/clients/legenda.jpeg",
    description: "",
  },
  {
    id: 8,
    name: "Obihiro",
    industry: "Food & Beverages",
    logo: "/clients/obihiro.jpeg",
    description: "",
  },
  {
    id: 9,
    name: "PT Smart Tbk",
    industry: "Consumer Goods",
    logo: "/clients/smart.jpeg",
    description: "",
  },
  {
    id: 10,
    name: "Tumpeng Mini 56",
    industry: "Food & Beverages",
    logo: "/clients/tumpeng.jpeg",
    description: "",
  },
  {
    id: 11,
    name: "Universitas Pamulang",
    industry: "Education",
    logo: "/clients/unpam.png",
    description: "",
  },
  {
    id: 12,
    name: "Virtus",
    industry: "Food & Beverages",
    logo: "/clients/virtus.jpeg",
    description: "",
  }
];
