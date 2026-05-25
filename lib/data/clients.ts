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
    name: "Pertamina",
    industry: "Energy & Oil",
    logo: "/clients/airasia.png",
    description: "Mendukung kepatuhan regulasi keimigrasian untuk tenaga kerja asing di sektor energi nasional.",
  },
  {
    id: 2,
    name: "Bank Mandiri",
    industry: "Financial Services",
    logo: "/clients/aki.jpeg",
    description: "Menyediakan layanan pengurusan visa dan izin tinggal bagi profesional perbankan internasional.",
  },
  {
    id: 3,
    name: "Telkom Indonesia",
    industry: "Telecommunications",
    logo: "/clients/daikin.png",
    description: "Memfasilitasi proses imigrasi bagi pakar teknologi dan telekomunikasi dari mancanegara.",
  },
  {
    id: 4,
    name: "Astra International",
    industry: "Automotive & Manufacturing",
    logo: "/clients/fongs.png",
    description: "Menangani izin kerja dan pendirian entitas hukum bagi mitra manufaktur global.",
  },
  {
    id: 5,
    name: "Garuda Indonesia",
    industry: "Aviation & Logistics",
    logo: "/clients/gdm.webp",
    description: "Mengelola dokumen perjalanan dan legalitas bagi kru serta staf penerbangan internasional.",
  },
  {
    id: 6,
    name: "BRI Insurance",
    industry: "Insurance & Finance",
    logo: "/clients/kb.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 7,
    name: "Wei",
    industry: "Insurance & Finance",
    logo: "/clients/legenda.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 8,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/obihiro.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 9,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/smart.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 10,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/tumpeng.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 11,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/unpam.png",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 12,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/virtus.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 13,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/vortexa.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
  {
    id: 14,
    name: "gdm",
    industry: "Insurance & Finance",
    logo: "/clients/wrp.jpeg",
    description: "Mendampingi proses perizinan dan kepatuhan hukum untuk sektor asuransi dan keuangan.",
  },
];
