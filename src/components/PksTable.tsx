import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  Lock, 
  FileSpreadsheet, 
  Phone,
  PhoneCall,
  Eye,
  Plus,
  Minus,
  ArrowUpDown,
  BellRing
} from 'lucide-react';
import { 
  PksItem, 
  PksHistoryItem, 
  ActionType, 
  checkExpiryStatus, 
  formatIndonesianDate, 
  formatWhatsAppUrl 
} from '../types';
import { ActionModal } from './ActionModal';
import { EditPksModal } from './EditPksModal';
import { DetailPksModal } from './DetailPksModal';

interface PksTableProps {
  pksList: PksItem[];
  onUpdatePks: (updatedPks: PksItem) => void;
  onDeletePks: (pksId: string) => void;
  onAddHistory: (
    pksId: string, 
    historyItem: PksHistoryItem, 
    newTanggalBerakhir?: string,
    newTanggalBerlaku?: string
  ) => void;
  onDeleteHistory: (pksId: string, historyId: string) => void;
}

export const PksTable: React.FC<PksTableProps> = ({
  pksList,
  onUpdatePks,
  onDeletePks,
  onAddHistory,
  onDeleteHistory,
}) => {
  // Search, Filter, & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'segera_habis' | 'kadaluarsa' | 'tidak_ditentukan'>('all');
  const [sortBy, setSortBy] = useState<'terdekat' | 'terjauh' | 'nama' | 'terbaru'>('terdekat');

  // Expanded rows: strictly collapsed by default so child rows only appear on explicit click!
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  // Detail Modal State
  const [detailPks, setDetailPks] = useState<PksItem | null>(null);

  // Action Modals State (Addendum, Amandemen, Perpanjang)
  const [activeActionModal, setActiveActionModal] = useState<{
    pks: PksItem;
    type: ActionType;
  } | null>(null);

  // Edit Modal State
  const [editingPks, setEditingPks] = useState<PksItem | null>(null);

  // Delete Confirmation State
  const [deletingPksId, setDeletingPksId] = useState<string | null>(null);

  // Toggle Parent-Child Row Expansion
  const toggleRowExpansion = (pksId: string) => {
    setExpandedRowIds(prev => ({
      ...prev,
      [pksId]: !prev[pksId],
    }));
  };

  // Safe file downloader for Soft File
  const triggerDownload = (fileName: string, dataUrl?: string) => {
    try {
      let finalHref = dataUrl;
      if (!finalHref || !finalHref.startsWith('data:')) {
        const sampleContent = `RSIA BUNDA ASY-SYIFA - SALINAN ARSIP ELEKTRONIK PKS\n\nNama Dokumen: ${fileName}\nDiunduh Pada: ${new Date().toLocaleString('id-ID')}\nUnit: Bagian Legal RSIA Bunda Asy-Syifa`;
        const blob = new Blob([sampleContent], { type: 'application/octet-stream' });
        finalHref = URL.createObjectURL(blob);
      }

      const link = document.createElement('a');
      link.href = finalHref;
      link.download = fileName || 'Dokumen_PKS_RSIA_Bunda_AsySyifa.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  // Export to CSV
  const exportToCsv = () => {
    const headers = [
      'No',
      'Mitra Perusahaan',
      'Bidang',
      'No PKS',
      'Judul PKS',
      'Tanggal Berlaku',
      'Tanggal Berakhir',
      'Status Perpanjangan',
      'Dokumen',
      'Tipe Kontak',
      'Nomor PIC',
      'Jumlah Riwayat',
    ];

    const rows = processedPksList.map((p, idx) => [
      idx + 1,
      `"${p.namaPerusahaan}"`,
      `"${p.bidang}"`,
      `"${p.nomorPks}"`,
      `"${p.judulPks.replace(/"/g, '""')}"`,
      p.tanggalBerlaku,
      p.tanggalBerakhir || 'Tidak Terbatas',
      `"${p.statusPerpanjangan === 'Peringatan H-Bulan' ? `Peringatan H-${p.peringatanBulan} Bulan` : p.statusPerpanjangan}"`,
      p.tipeDokumen,
      p.tipeKontak || 'whatsapp',
      `"${p.picKontak || p.picWa || ''}"`,
      p.history.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_PKS_RSIA_Bunda_AsySyifa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted PKS List
  const processedPksList = [...pksList]
    .filter((pks) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        pks.namaPerusahaan.toLowerCase().includes(term) ||
        pks.nomorPks.toLowerCase().includes(term) ||
        pks.judulPks.toLowerCase().includes(term) ||
        pks.bidang.toLowerCase().includes(term) ||
        pks.picNama.toLowerCase().includes(term) ||
        (pks.picKontak && pks.picKontak.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (statusFilter !== 'all') {
        const exp = checkExpiryStatus(pks);
        if (exp.status !== statusFilter) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'terdekat') {
        const expA = checkExpiryStatus(a);
        const expB = checkExpiryStatus(b);
        // Put non-expiring ('tidak_ditentukan') at the end
        if (expA.daysRemaining === null && expB.daysRemaining === null) return 0;
        if (expA.daysRemaining === null) return 1;
        if (expB.daysRemaining === null) return -1;
        // Ascending: negative/lowest days first (expired & soonest to expire first)
        return expA.daysRemaining - expB.daysRemaining;
      }
      if (sortBy === 'terjauh') {
        const expA = checkExpiryStatus(a);
        const expB = checkExpiryStatus(b);
        if (expA.daysRemaining === null && expB.daysRemaining === null) return 0;
        if (expA.daysRemaining === null) return 1;
        if (expB.daysRemaining === null) return -1;
        // Descending: highest days remaining first
        return expB.daysRemaining - expA.daysRemaining;
      }
      if (sortBy === 'nama') {
        return a.namaPerusahaan.localeCompare(b.namaPerusahaan);
      }
      if (sortBy === 'terbaru') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Action submit handler: expands row after saving so the user sees the new entry
  const handleActionSubmit = (
    pksId: string, 
    historyItem: PksHistoryItem, 
    newTanggalBerakhir?: string,
    newTanggalBerlaku?: string
  ) => {
    onAddHistory(pksId, historyItem, newTanggalBerakhir, newTanggalBerlaku);
    setExpandedRowIds(prev => ({
      ...prev,
      [pksId]: true,
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4 space-y-3">
      
      {/* Compact Spreadsheet Toolbar with Search, Filter & Sort */}
      <div className="bg-white rounded-lg border border-slate-300 p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left: Search, Filter, & Sort */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[170px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mitra / no PKS / judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-slate-800"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-700"
            >
              <option value="all">Semua Masa Berlaku</option>
              <option value="aktif">Aktif</option>
              <option value="segera_habis">Segera Habis</option>
              <option value="kadaluarsa">Kadaluarsa</option>
              <option value="tidak_ditentukan">Jangka Tetap</option>
            </select>
          </div>

          {/* Sortir (Terdekat / Terjauh ke Jatuh Tempo) */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-teal-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs bg-teal-50/60 border border-teal-300 rounded font-semibold text-teal-900 focus:outline-none"
              title="Pilih urutan data PKS"
            >
              <option value="terdekat">⏳ Jatuh Tempo Terdekat (Prioritas Perpanjangan)</option>
              <option value="terjauh">📅 Jatuh Tempo Terjauh</option>
              <option value="nama">🔤 Nama Mitra (A - Z)</option>
              <option value="terbaru">🆕 Input Terbaru</option>
            </select>
          </div>
        </div>

        {/* Right: Export CSV & Count */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            Total: <strong>{processedPksList.length}</strong> PKS
          </span>
          <button
            type="button"
            onClick={exportToCsv}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
        </div>

      </div>

      {/* SPREADSHEET TABLE GRID */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            
            {/* Spreadsheet Column Headers */}
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-700 select-none">
                <th className="py-2 px-2 text-center border-r border-slate-200 w-10">No</th>
                <th className="py-2 px-2 border-r border-slate-200 w-8 text-center" title="Riwayat Child (Klik untuk membuka)">
                  Riwayat
                </th>
                <th className="py-2 px-3 border-r border-slate-200 min-w-[190px]">
                  Mitra Rekanan & Logo
                </th>
                <th className="py-2 px-3 border-r border-slate-200 min-w-[160px]">
                  No. PKS
                </th>
                <th className="py-2 px-3 border-r border-slate-200 min-w-[210px]">
                  Judul PKS
                </th>
                <th className="py-2 px-3 border-r border-slate-200 min-w-[150px]">
                  Masa Berlaku
                </th>
                <th className="py-2 px-2.5 border-r border-slate-200 min-w-[130px]">
                  Perpanjangan
                </th>
                <th className="py-2 px-2 border-r border-slate-200 min-w-[100px] text-center">
                  Berkas
                </th>
                <th className="py-2 px-3 border-r border-slate-200 min-w-[145px]">
                  PIC (Kontak)
                </th>
                <th className="py-2 px-2 text-center border-r border-slate-200 w-16">
                  Detail
                </th>
                <th className="py-2 px-2.5 text-center min-w-[240px]">
                  Aksi (Addendum / Amandemen / Perpanjang)
                </th>
              </tr>
            </thead>

            {/* Spreadsheet Rows */}
            <tbody className="divide-y divide-slate-200">
              {processedPksList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada data PKS yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                processedPksList.map((pks, index) => {
                  const expiry = checkExpiryStatus(pks);
                  const isExpanded = !!expandedRowIds[pks.id];
                  const historyCount = pks.history ? pks.history.length : 0;
                  const isWa = (pks.tipeKontak || 'whatsapp') === 'whatsapp';
                  const displayPhone = pks.picKontak || pks.picWa || '';

                  return (
                    <React.Fragment key={pks.id}>
                      {/* PARENT ROW - Spreadsheet Style */}
                      <tr 
                        className={`hover:bg-teal-50/40 transition-colors ${
                          isExpanded ? 'bg-teal-50/30' : index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                        }`}
                      >
                        {/* 1. Row Index */}
                        <td className="py-2 px-2 text-center text-slate-500 font-mono text-[11px] border-r border-slate-200">
                          {index + 1}
                        </td>

                        {/* 2. Child Toggle [+/-] strictly collapsed by default */}
                        <td className="py-2 px-1 text-center border-r border-slate-200">
                          {historyCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleRowExpansion(pks.id)}
                              className={`inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                isExpanded
                                  ? 'bg-teal-700 text-white border-teal-700'
                                  : 'bg-white text-teal-800 border-teal-300 hover:bg-teal-50'
                              }`}
                              title={isExpanded ? 'Tutup baris riwayat' : `Buka ${historyCount} riwayat`}
                            >
                              {isExpanded ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                              <span>{historyCount}</span>
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[10px]">-</span>
                          )}
                        </td>

                        {/* 3. Mitra Rekanan & Logo */}
                        <td className="py-2 px-3 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded border border-slate-200 bg-white p-0.5 flex items-center justify-center shrink-0">
                              <img
                                src={pks.logoUrl}
                                alt={pks.namaPerusahaan}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="truncate">
                              <span className="font-bold text-slate-900 block truncate" title={pks.namaPerusahaan}>
                                {pks.namaPerusahaan}
                              </span>
                              <span className="text-[10px] text-teal-700 font-medium">
                                {pks.bidang}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. No. PKS */}
                        <td className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] font-semibold text-slate-800 truncate" title={pks.nomorPks}>
                          {pks.nomorPks}
                        </td>

                        {/* 5. Judul PKS (Single-line with tooltip) */}
                        <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                          <span className="line-clamp-1 text-[11px]" title={pks.judulPks}>
                            {pks.judulPks}
                          </span>
                        </td>

                        {/* 6. Masa Berlaku & Status Tag */}
                        <td className="py-2 px-3 border-r border-slate-200">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[11px] text-slate-800 block whitespace-nowrap">
                              {pks.tanggalBerakhir ? formatIndonesianDate(pks.tanggalBerakhir) : 'Permanen'}
                            </span>
                            <div>
                              {expiry.status === 'aktif' && (
                                <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  Aktif ({expiry.daysRemaining}h)
                                </span>
                              )}
                              {expiry.status === 'segera_habis' && (
                                <span className="inline-block text-[9px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded animate-pulse">
                                  H-{expiry.daysRemaining} hari
                                </span>
                              )}
                              {expiry.status === 'kadaluarsa' && (
                                <span className="inline-block text-[9px] font-black text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded">
                                  Habis
                                </span>
                              )}
                              {expiry.status === 'tidak_ditentukan' && (
                                <span className="inline-block text-[9px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                                  Tetap
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 7. Perpanjangan (Mendukung Peringatan H-Bulan) */}
                        <td className="py-2 px-2.5 border-r border-slate-200 text-[11px] text-slate-700 truncate" title={pks.statusPerpanjangan}>
                          {pks.statusPerpanjangan === 'Peringatan H-Bulan' ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <BellRing className="w-2.5 h-2.5 text-amber-700" />
                              <span>H-{pks.peringatanBulan || 1} Bulan</span>
                            </span>
                          ) : (
                            pks.statusPerpanjangan
                          )}
                        </td>

                        {/* 8. Berkas */}
                        <td className="py-2 px-2 border-r border-slate-200 text-center">
                          {pks.tipeDokumen === 'soft_file' ? (
                            <button
                              type="button"
                              onClick={() => triggerDownload(pks.softFileName || 'PKS.pdf', pks.softFileDataUrl)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-300 text-teal-800 text-[10px] font-bold hover:bg-teal-100"
                              title={`Unduh: ${pks.softFileName || 'Dokumen'}`}
                            >
                              <Download className="w-2.5 h-2.5" />
                              <span>Unduh</span>
                            </button>
                          ) : pks.tipeDokumen === 'hard_file' ? (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded inline-block" title={pks.lokasiArsipFisik}>
                              Fisik
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded inline-block" title={pks.catatanFollowUp}>
                              Follow-up
                            </span>
                          )}
                        </td>

                        {/* 9. PIC Kontak (WhatsApp = klik link WA, Nomor Kantor = hanya teks tampilan biasa) */}
                        <td className="py-2 px-3 border-r border-slate-200">
                          {displayPhone ? (
                            isWa ? (
                              <a
                                href={formatWhatsAppUrl(displayPhone, pks.namaPerusahaan, pks.judulPks)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                                title={`Chat WhatsApp dengan ${pks.picNama}`}
                              >
                                <Phone className="w-3 h-3 text-emerald-600 fill-current" />
                                <span>{displayPhone}</span>
                              </a>
                            ) : (
                              <span 
                                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200"
                                title={`Nomor Telepon Kantor (Telepon Tetap): ${pks.picNama}`}
                              >
                                <PhoneCall className="w-3 h-3 text-slate-500" />
                                <span>{displayPhone}</span>
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* 10. DETAIL BUTTON */}
                        <td className="py-2 px-2 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => setDetailPks(pks)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold rounded text-[11px] transition-colors"
                            title="Lihat Rincian Lengkap PKS"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Detail</span>
                          </button>
                        </td>

                        {/* 11. AKSI: Addendum, Amandemen, Perpanjang, Edit, Hapus */}
                        <td className="py-2 px-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Addendum */}
                            <button
                              type="button"
                              onClick={() => setActiveActionModal({ pks, type: 'addendum' })}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100"
                              title="Tambah Addendum (nambah baris child di bawah)"
                            >
                              +Addendum
                            </button>

                            {/* Amandemen */}
                            <button
                              type="button"
                              onClick={() => setActiveActionModal({ pks, type: 'amandemen' })}
                              className="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold hover:bg-purple-100"
                              title="Tambah Amandemen (nambah baris child di bawah)"
                            >
                              +Amandemen
                            </button>

                            {/* Perpanjang (Kondisional Tanggal Otomatis) */}
                            {expiry.canRenew ? (
                              <button
                                type="button"
                                onClick={() => setActiveActionModal({ pks, type: 'perpanjang' })}
                                className="px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold shadow-2xs"
                                title={`PKS siap diperpanjang: ${expiry.reason}`}
                              >
                                Perpanjang
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-400 text-[10px] cursor-not-allowed inline-flex items-center gap-0.5"
                                title={`Terkunci: ${expiry.reason}`}
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>Perpanjang</span>
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => setEditingPks(pks)}
                              className="p-1 text-slate-400 hover:text-teal-700 rounded"
                              title="Edit Data PKS"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {/* Hapus */}
                            <button
                              type="button"
                              onClick={() => setDeletingPksId(pks.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Hapus PKS"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* CHILD ROWS (Hanya muncul jika tombol [+] di-klik agar hemat tempat) */}
                      {isExpanded && (
                        <tr className="bg-slate-100/90 border-b border-teal-200">
                          <td colSpan={11} className="py-2.5 px-4">
                            <div className="pl-6 border-l-2 border-teal-600 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span>
                                  Riwayat Perubahan: {pks.namaPerusahaan} ({historyCount} data)
                                </span>
                                <span className="text-[10px] text-slate-500 font-normal">
                                  Klik [-] untuk menutup riwayat ini
                                </span>
                              </div>

                              <div className="space-y-1">
                                {pks.history.map((hist) => (
                                  <div
                                    key={hist.id}
                                    className="p-2 bg-white rounded border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                        hist.type === 'addendum'
                                          ? 'bg-indigo-100 text-indigo-800'
                                          : hist.type === 'amandemen'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {hist.type}
                                      </span>
                                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                                        {hist.nomorDokumen}
                                      </span>
                                      <span className="text-slate-400">•</span>
                                      <span className="text-[11px] text-slate-600">
                                        Efektif: <strong>{formatIndonesianDate(hist.tanggalEfektif)}</strong>
                                        {hist.tanggalBerakhirBaru && ` s.d. ${formatIndonesianDate(hist.tanggalBerakhirBaru)}`}
                                      </span>
                                      <span className="text-slate-400">•</span>
                                      <span className="font-medium text-slate-700 text-[11px] line-clamp-1 max-w-md">
                                        {hist.perihal}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      {hist.softFileName && (
                                        <button
                                          type="button"
                                          onClick={() => triggerDownload(hist.softFileName || 'Dokumen.pdf', hist.softFileDataUrl)}
                                          className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 hover:bg-teal-100 flex items-center gap-1"
                                        >
                                          <Download className="w-2.5 h-2.5" /> Unduh
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Hapus riwayat ${hist.nomorDokumen}?`)) {
                                            onDeleteHistory(pks.id, hist.id);
                                          }
                                        }}
                                        className="text-slate-400 hover:text-rose-600 p-0.5"
                                        title="Hapus riwayat"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Detail PKS Modal (Muncul saat klik tombol "Detail") */}
      {detailPks && (
        <DetailPksModal
          isOpen={true}
          onClose={() => setDetailPks(null)}
          pks={detailPks}
          onOpenAction={(p, type) => {
            setDetailPks(null);
            setActiveActionModal({ pks: p, type });
          }}
          onEdit={(p) => {
            setDetailPks(null);
            setEditingPks(p);
          }}
          onDownload={triggerDownload}
        />
      )}

      {/* Action Modal (Addendum / Amandemen / Perpanjang) */}
      {activeActionModal && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveActionModal(null)}
          pks={activeActionModal.pks}
          actionType={activeActionModal.type}
          onSubmit={handleActionSubmit}
        />
      )}

      {/* Edit PKS Modal */}
      {editingPks && (
        <EditPksModal
          isOpen={true}
          onClose={() => setEditingPks(null)}
          pks={editingPks}
          onUpdate={onUpdatePks}
        />
      )}

      {/* Delete PKS Confirmation Dialog */}
      {deletingPksId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <span>Konfirmasi Hapus PKS</span>
            </div>
            <p className="text-slate-600">
              Hapus perjanjian kerja sama ini beserta seluruh riwayat addendum dan amandemen di bawahnya?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPksId(null)}
                className="px-3 py-1 font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePks(deletingPksId);
                  setDeletingPksId(null);
                }}
                className="px-3 py-1 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
