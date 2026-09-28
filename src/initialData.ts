import { PksItem } from './types';

// Pre-defined sample PNG logos encoded as SVG/PNG base64 or crisp SVG data URLs
export const SAMPLE_COMPANY_LOGOS = [
  {
    name: 'BPJS Kesehatan',
    bidang: 'Asuransi Sosial Nasional',
    color: '#008444',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80',
    dataUrl: createLogoDataUri('BPJS', '#008542', '#ffffff'),
  },
  {
    name: 'PT Asuransi Allianz Life Indonesia',
    bidang: 'Asuransi Jiwa & Kesehatan',
    color: '#003781',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=128&auto=format&fit=crop&q=80',
    dataUrl: createLogoDataUri('ALLIANZ', '#003781', '#ffffff'),
  },
  {
    name: 'PT Mandiri Inhealth Indonesia',
    bidang: 'Asuransi Kesehatan Karyawan & Korporat',
    color: '#00205B',
    logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=128&auto=format&fit=crop&q=80',
    dataUrl: createLogoDataUri('INHEALTH', '#00205b', '#eab308'),
  },
  {
    name: 'PT Prudential Life Assurance',
    bidang: 'Asuransi Jiwa & Syariah',
    color: '#ED1B2D',
    logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
    dataUrl: createLogoDataUri('PRUDENTIAL', '#ed1b2d', '#ffffff'),
  },
  {
    name: 'PT Asuransi Sinarmas MSIG',
    bidang: 'Asuransi Jiwa & Investasi',
    color: '#C8102E',
    logoUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=128&auto=format&fit=crop&q=80',
    dataUrl: createLogoDataUri('SINARMAS', '#c8102e', '#ffffff'),
  },
];

export function createLogoDataUri(text: string, bgColor: string, textColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="32" fill="${bgColor}"/>
    <circle cx="80" cy="80" r="60" fill="none" stroke="${textColor}" stroke-width="3" opacity="0.25"/>
    <text x="50%" y="54%" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1.5">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial PKS data demonstrating all rules requested by user
export const INITIAL_PKS_LIST: PksItem[] = [
  {
    id: 'pks-001',
    nomorPks: '018/PKS-RSIA-BAS/DIR/I/2026',
    namaPerusahaan: 'PT Asuransi Allianz Life Indonesia',
    logoUrl: createLogoDataUri('ALLIANZ', '#003781', '#ffffff'),
    bidang: 'Asuransi',
    judulPks: 'Pelayanan Rawat Inap, Rawat Jalan & Persalinan Pasien Asuransi Allianz Mediextra & SmartHealth',
    tanggalBerlaku: '2026-01-01',
    tanggalBerakhir: '2027-01-01',
    statusPerpanjangan: 'Peringatan H-Bulan',
    peringatanBulan: 3, // Peringatan H-3 Bulan
    tipeDokumen: 'soft_file',
    softFileName: 'PKS_RSIA_Bunda_AsySyifa_Allianz_2026.pdf',
    softFileSize: '2.4 MB',
    softFileDataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr...',
    picNama: 'Ahmad Faisal, S.Kom.',
    tipeKontak: 'whatsapp',
    picKontak: '081288991234',
    picWa: '081288991234',
    picJabatan: 'Hospital Relations Executive',
    catatan: 'Termasuk penjaminan cashless untuk persalinan caesar dan NICU/PICU',
    createdAt: '2026-01-02T08:30:00Z',
    updatedAt: '2026-01-02T08:30:00Z',
    history: [
      {
        id: 'hist-001-1',
        type: 'addendum',
        nomorDokumen: '018.A1/ADD-RSIA-BAS/VI/2026',
        tanggalEfektif: '2026-06-01',
        perihal: 'Penambahan Benefit Fasilitas Kamar VIP Suite & Skrining Bayi Baru Lahir',
        deskripsi: 'Menyepakati penyesuaian plafon kamar rawat anak dan bundling uji skrining hipotiroid kongenital.',
        softFileName: 'Addendum_I_Allianz_VIP_Kamar.pdf',
        picNama: 'Ahmad Faisal, S.Kom.',
        tipeKontak: 'whatsapp',
        picKontak: '081288991234',
        picWa: '081288991234',
        picJabatan: 'Hospital Relations Executive',
        createdAt: '2026-06-02T10:00:00Z',
      }
    ],
  },
  {
    id: 'pks-002',
    nomorPks: '089/PKS-RSIA-BAS/DIR/X/2025',
    namaPerusahaan: 'PT Mandiri Inhealth Indonesia',
    logoUrl: createLogoDataUri('INHEALTH', '#00205b', '#eab308'),
    bidang: 'Asuransi',
    judulPks: 'Kerja Sama Penyelenggaraan Pelayanan Kesehatan Rujukan Rawat Lanjutan Peserta Inhealth Managed Care',
    tanggalBerlaku: '2025-10-15',
    tanggalBerakhir: '2026-10-15', // Sisa sekitar 20 hari dari waktu sekarang -> SEGERA HABIS -> TOMBOL PERPANJANG AKTIF!
    statusPerpanjangan: 'Diperpanjang Jangka Waktu Yang Sama',
    tipeDokumen: 'soft_file',
    softFileName: 'PKS_Mandiri_Inhealth_RSIA_Bunda_AsySyifa.docx',
    softFileSize: '1.8 MB',
    softFileDataUrl: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQ...',
    picNama: 'Dewi Anggraini, S.E.',
    tipeKontak: 'whatsapp',
    picKontak: '081377884321',
    picWa: '081377884321',
    picJabatan: 'Provider Relations Senior Officer',
    catatan: 'Perlu konfirmasi tarif paket sectio caesarea 2026 sebelum H-30',
    createdAt: '2025-10-10T11:00:00Z',
    updatedAt: '2025-10-10T11:00:00Z',
    history: [],
  },
  {
    id: 'pks-003',
    nomorPks: '045/PKS-RSIA-BAS/DIR/III/2026',
    namaPerusahaan: 'PT Prudential Life Assurance',
    logoUrl: createLogoDataUri('PRUDENTIAL', '#ed1b2d', '#ffffff'),
    bidang: 'Asuransi Jiwa & Syariah',
    judulPks: 'Penyediaan Jasa Layanan Administrasi Klaim dan Jaminan Pembayaran Pasien PRUHospital & Surgical Cover',
    tanggalBerlaku: '2026-03-01',
    tanggalBerakhir: '2027-03-01',
    statusPerpanjangan: 'Pemberitahuan Tertulis',
    tipeDokumen: 'hard_file',
    lokasiArsipFisik: 'Ruang Legal Lt. 2 / Lemari Arsip PKS No. B-04 / Binder Prudential 2026',
    picNama: 'Rian Kurniawan, S.H.',
    tipeKontak: 'telepon_kantor',
    picKontak: '(021) 2995-8888 ext. 412',
    picJabatan: 'Senior Network Partnership Manager',
    catatan: 'Dokumen fisik rangkap 2 bermaterai 10.000 disimpan di lemari berkas legal.',
    createdAt: '2026-03-05T09:15:00Z',
    updatedAt: '2026-03-05T09:15:00Z',
    history: [
      {
        id: 'hist-003-1',
        type: 'amandemen',
        nomorDokumen: '045.M1/AMD-RSIA-BAS/VIII/2026',
        tanggalEfektif: '2026-08-15',
        perihal: 'Amandemen Klausul Batas Waktu Pengiriman Berkas Klaim Rawat Inap (Dari 14 Hari menjadi 30 Hari Kerja)',
        deskripsi: 'Penyesuaian jangka waktu penyerahan dokumen penagihan rekam medis untuk kelancaran rekonsiliasi.',
        softFileName: 'Amandemen_Prudential_SLA_Klaim.pdf',
        picNama: 'Rian Kurniawan, S.H.',
        tipeKontak: 'telepon_kantor',
        picKontak: '(021) 2995-8888 ext. 412',
        picJabatan: 'Senior Network Partnership Manager',
        createdAt: '2026-08-16T14:20:00Z',
      }
    ],
  },
  {
    id: 'pks-004',
    nomorPks: '002/PKS-RSIA-BAS/BPJS-KCS/2024',
    namaPerusahaan: 'BPJS Kesehatan Cabang Utama',
    logoUrl: createLogoDataUri('BPJS', '#008542', '#ffffff'),
    bidang: 'Asuransi Kesehatan Sosial (JKN-KIS)',
    judulPks: 'Kerja Sama Penyelenggaraan Pelayanan Kesehatan Tingkat Lanjutan bagi Peserta Jaminan Kesehatan Nasional (JKN)',
    tanggalBerlaku: '2024-01-01',
    tanggalBerakhir: '', // Jangka Waktu Tidak Ditentukan
    statusPerpanjangan: 'Jangka Waktu Tidak Ditentukan',
    tipeDokumen: 'hard_file',
    lokasiArsipFisik: 'Ruang Direksi / Brankas Dokumen Kemitraan Strategis / Rak A-01',
    picNama: 'Dr. Tri Wahyuni, M.Kes.',
    tipeKontak: 'telepon_kantor',
    picKontak: '(021) 4212-938 ext. 201',
    picJabatan: 'Kepala Bidang Penjaminan Manfaat Rujukan',
    catatan: 'PKS JKN berlaku berkesinambungan dengan rekredensialing tahunan.',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    history: [],
  },
  {
    id: 'pks-005',
    nomorPks: '031/PKS-RSIA-BAS/DIR/V/2025',
    namaPerusahaan: 'PT Asuransi Sinarmas MSIG',
    logoUrl: createLogoDataUri('SINARMAS', '#c8102e', '#ffffff'),
    bidang: 'Asuransi',
    judulPks: 'Kerja Sama Pelayanan Rawat Jalan & Kamar Bersalin Tanpa Uang Muka (Cashless Guarantee)',
    tanggalBerlaku: '2025-05-01',
    tanggalBerakhir: '2026-05-01', // SUDAH KADALUARSA -> TOMBOL PERPANJANG AKTIF!
    statusPerpanjangan: 'Peringatan H-Bulan',
    peringatanBulan: 2, // Peringatan H-2 Bulan
    tipeDokumen: 'tidak_ada',
    catatanFollowUp: 'PERLU FOLLOW UP SEGERA: Berkas PKS asli belum dikembalikan oleh pihak Sinarmas setelah ditandatangani Direksi.',
    picNama: 'Bambang Sudibyo',
    tipeKontak: 'whatsapp',
    picKontak: '081765432109',
    picWa: '081765432109',
    picJabatan: 'PIC Provider & Partnership',
    catatan: 'Segera mintakan soft copy via WA atau email untuk kelengkapan audit akreditasi RS.',
    createdAt: '2025-05-02T10:00:00Z',
    updatedAt: '2025-05-02T10:00:00Z',
    history: [],
  },
];
