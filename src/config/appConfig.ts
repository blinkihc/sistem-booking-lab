const CONFIG = {
  waktuServer: "2025-03-18 17:04:30",
  userLogin: "blinkihc",
  namaAplikasi: "Sistem Booking Lab",
  tema: "light" as const,
  apiUrl: "http://localhost:3000/api"
};

const STATUS_LAB = {
  TERSEDIA: "tersedia",
  DIGUNAKAN: "digunakan",
  MAINTENANCE: "maintenance"
} as const;

const STATUS_BOOKING = {
  MENUNGGU: "menunggu",
  DISETUJUI: "disetujui",
  DITOLAK: "ditolak",
  SELESAI: "selesai"
} as const;

export { CONFIG, STATUS_LAB, STATUS_BOOKING };