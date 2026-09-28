export type RenewalStatus =
  | 'Diperpanjang Otomatis'
  | 'Pemberitahuan Tertulis'
  | 'Jangka Waktu Tidak Ditentukan'
  | 'Diperpanjang Jangka Waktu Yang Sama'
  | 'Peringatan H-Bulan';

export type ContactType = 'whatsapp' | 'telepon_kantor';

export type DocumentType = 'soft_file' | 'hard_file' | 'tidak_ada';

export type ActionType = 'addendum' | 'amandemen' | 'perpanjang';

export interface PksHistoryItem {
  id: string;
  type: ActionType;
  nomorDokumen: string;
  tanggalEfektif: string;
  tanggalBerakhirBaru?: string; // Khusus perpanjangan / amandemen masa berlaku
  perihal: string;
  deskripsi: string;
  softFileName?: string;
  softFileDataUrl?: string;
  picNama?: string;
  tipeKontak?: ContactType;
  picKontak?: string;
  picWa?: string; // legacy support
  picJabatan?: string;
  createdAt: string;
}

export interface PksItem {
  id: string;
  nomorPks: string;
  namaPerusahaan: string;
  logoUrl: string; // Base64 or URL (PNG)
  bidang: string; // Default "Asuransi"
  judulPks: string;
  tanggalBerlaku: string; // YYYY-MM-DD
  tanggalBerakhir: string; // YYYY-MM-DD (empty if Jangka Waktu Tidak Ditentukan)
  statusPerpanjangan: RenewalStatus;
  peringatanBulan?: number; // 1 s.d. 6 bulan untuk status 'Peringatan H-Bulan'
  tipeDokumen: DocumentType;
  softFileName?: string;
  softFileDataUrl?: string; // Data URL or mock blob for download
  softFileSize?: string;
  lokasiArsipFisik?: string; // For hard file
  catatanFollowUp?: string; // For tidak_ada
  picNama: string;
  tipeKontak: ContactType; // 'whatsapp' atau 'telepon_kantor'
  picKontak: string; // Nomor telepon kontak (WA atau nomor kantor)
  picWa?: string; // backward compat
  picJabatan: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
  history: PksHistoryItem[];
}

// Helper to format WhatsApp URL (only used if tipeKontak === 'whatsapp')
export function formatWhatsAppUrl(phone: string, companyName: string, pksTitle: string): string {
  if (!phone) return '#';
  // Strip non-digits
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62') && cleaned.length > 5) {
    cleaned = '62' + cleaned;
  }
  const defaultMessage = `Halo Bapak/Ibu PIC ${companyName},\n\nKami dari Bagian Legal RSIA BUNDA ASY-SYIFA ingin berkoordinasi mengenai Perjanjian Kerja Sama (PKS):\n"${pksTitle}".\n\nMohon konfirmasi kesediaan waktunya. Terima kasih.`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(defaultMessage)}`;
}

// Format Indonesian Date: "25 Sep 2026"
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

// Calculate validity status & days remaining
export interface ExpiryCalculation {
  status: 'aktif' | 'segera_habis' | 'kadaluarsa' | 'tidak_ditentukan';
  label: string;
  daysRemaining: number | null;
  canRenew: boolean;
  reason: string;
}

export function checkExpiryStatus(pks: PksItem, referenceDate: Date = new Date()): ExpiryCalculation {
  if (pks.statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' || !pks.tanggalBerakhir) {
    return {
      status: 'tidak_ditentukan',
      label: 'Jangka Waktu Tetap (Tidak Dibatasi)',
      daysRemaining: null,
      canRenew: false,
      reason: 'PKS berstatus jangka waktu tidak ditentukan (tidak memerlukan perpanjangan)',
    };
  }

  const end = new Date(pks.tanggalBerakhir + 'T23:59:59');
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - ref.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine threshold: if 'Peringatan H-Bulan', threshold is (peringatanBulan || 1) * 30 days
  let renewalThresholdDays = 60; // default 60 hari
  if (pks.statusPerpanjangan === 'Peringatan H-Bulan' && pks.peringatanBulan) {
    renewalThresholdDays = pks.peringatanBulan * 30;
  }

  if (diffDays < 0) {
    return {
      status: 'kadaluarsa',
      label: `Kadaluarsa (${Math.abs(diffDays)} hari lalu)`,
      daysRemaining: diffDays,
      canRenew: true,
      reason: 'Masa berlaku telah habis. Tombol perpanjang aktif untuk pembaharuan PKS.',
    };
  } else if (diffDays <= renewalThresholdDays) {
    const bulanLabel = pks.statusPerpanjangan === 'Peringatan H-Bulan' 
      ? `peringatan H-${pks.peringatanBulan} Bulan` 
      : 'masa tenggang';
    return {
      status: 'segera_habis',
      label: `Segera Habis (${diffDays} hari lagi)`,
      daysRemaining: diffDays,
      canRenew: true,
      reason: `Masa berlaku tersisa ${diffDays} hari (memasuki ${bulanLabel}). Tombol perpanjang aktif.`,
    };
  } else {
    return {
      status: 'aktif',
      label: `Aktif (${diffDays} hari lagi)`,
      daysRemaining: diffDays,
      canRenew: false,
      reason: `Masih berlaku aktif s.d. ${formatIndonesianDate(pks.tanggalBerakhir)} (Sisa ${diffDays} hari). Tombol otomatis aktif saat memasuki periode perpanjangan.`,
    };
  }
}
