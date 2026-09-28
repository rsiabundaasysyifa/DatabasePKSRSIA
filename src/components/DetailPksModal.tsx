import React from 'react';
import { 
  X, 
  Calendar, 
  Phone, 
  Download, 
  FileText, 
  ExternalLink, 
  Archive, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Edit3,
  PhoneCall,
  BellRing
} from 'lucide-react';
import { 
  PksItem, 
  checkExpiryStatus, 
  formatIndonesianDate, 
  formatWhatsAppUrl,
  ActionType 
} from '../types';

interface DetailPksModalProps {
  isOpen: boolean;
  onClose: () => void;
  pks: PksItem;
  onOpenAction: (pks: PksItem, type: ActionType) => void;
  onEdit: (pks: PksItem) => void;
  onDownload: (fileName: string, dataUrl?: string) => void;
}

export const DetailPksModal: React.FC<DetailPksModalProps> = ({
  isOpen,
  onClose,
  pks,
  onOpenAction,
  onEdit,
  onDownload,
}) => {
  if (!isOpen) return null;

  const expiry = checkExpiryStatus(pks);
  const isWa = pks.tipeKontak === 'whatsapp';
  const displayPhone = pks.picKontak || pks.picWa || '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src={pks.logoUrl}
                alt={pks.namaPerusahaan}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{pks.namaPerusahaan}</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-medium">
                  {pks.bidang}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{pks.nomorPks}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Judul PKS & Status Banner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Judul Perjanjian Kerja Sama
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {pks.judulPks}
            </p>
            {pks.catatan && (
              <p className="text-xs text-slate-600 italic pt-1 border-t border-slate-200">
                Catatan: {pks.catatan}
              </p>
            )}
          </div>

          {/* Grid Informasi Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Masa Berlaku */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Masa Berlaku
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {formatIndonesianDate(pks.tanggalBerlaku)} s.d.
              </p>
              <p className="text-xs font-bold text-slate-900 font-mono">
                {pks.tanggalBerakhir ? formatIndonesianDate(pks.tanggalBerakhir) : 'Permanen / Bebas'}
              </p>
              <div className="pt-1">
                {expiry.status === 'aktif' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Aktif ({expiry.daysRemaining} hari lagi)
                  </span>
                )}
                {expiry.status === 'segera_habis' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-700" />
                    Segera Habis ({expiry.daysRemaining} hari)
                  </span>
                )}
                {expiry.status === 'kadaluarsa' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    Habis ({Math.abs(expiry.daysRemaining || 0)} hari lalu)
                  </span>
                )}
                {expiry.status === 'tidak_ditentukan' && (
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    Jangka Waktu Tidak Ditentukan
                  </span>
                )}
              </div>
            </div>

            {/* Status Perpanjangan */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Ketentuan Perpanjangan
              </span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                {pks.statusPerpanjangan === 'Peringatan H-Bulan' ? (
                  <>
                    <BellRing className="w-3.5 h-3.5 text-amber-600 inline" />
                    <span>Peringatan H-{pks.peringatanBulan || 1} Bulan</span>
                  </>
                ) : (
                  pks.statusPerpanjangan
                )}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {expiry.reason}
              </p>
            </div>

            {/* Berkas / Dokumen */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Kelengkapan Berkas
              </span>
              {pks.tipeDokumen === 'soft_file' ? (
                <div>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded inline-block">
                    Soft File Tersedia
                  </span>
                  <p className="text-[11px] text-slate-700 font-medium truncate mt-1" title={pks.softFileName}>
                    {pks.softFileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDownload(pks.softFileName || 'PKS_Dokumen.pdf', pks.softFileDataUrl)}
                    className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold rounded-lg shadow-2xs"
                  >
                    <Download className="w-3 h-3" />
                    Unduh Berkas
                  </button>
                </div>
              ) : pks.tipeDokumen === 'hard_file' ? (
                <div>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    <Archive className="w-3 h-3" /> Arsip Fisik
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Lokasi: {pks.lokasiArsipFisik || 'Lemari Arsip Legal'}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Perlu Follow Up
                  </span>
                  <p className="text-[11px] text-rose-700 mt-1">
                    {pks.catatanFollowUp || 'Berkas belum diserahkan ke rumah sakit'}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Kontak PIC: WhatsApp atau Telepon Kantor */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                  Person In Charge (PIC) Rekanan
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isWa ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                }`}>
                  {isWa ? 'WhatsApp' : 'Nomor Telepon Kantor'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {pks.picNama} <span className="font-normal text-slate-500">({pks.picJabatan})</span>
              </p>
            </div>
            
            {displayPhone && (
              isWa ? (
                <a
                  href={formatWhatsAppUrl(displayPhone, pks.namaPerusahaan, pks.judulPks)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat WA: {displayPhone}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 font-mono text-xs font-bold border border-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  <span>Kantor: {displayPhone}</span>
                  <span className="text-[10px] font-normal text-slate-500">(Telepon Tetap)</span>
                </div>
              )
            )}
          </div>

          {/* Riwayat Perubahan (Addendum / Amandemen / Perpanjangan) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                Riwayat Perubahan PKS ({pks.history.length})
              </h4>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAction(pks, 'addendum');
                  }}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md hover:bg-indigo-100 text-[10px]"
                >
                  + Addendum
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAction(pks, 'amandemen');
                  }}
                  className="px-2 py-1 bg-purple-50 text-purple-700 font-bold rounded-md hover:bg-purple-100 text-[10px]"
                >
                  + Amandemen
                </button>
                {expiry.canRenew && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAction(pks, 'perpanjang');
                    }}
                    className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 text-[10px]"
                  >
                    + Perpanjang
                  </button>
                )}
              </div>
            </div>

            {pks.history.length === 0 ? (
              <p className="text-slate-400 italic text-[11px] p-3 bg-slate-50 rounded-lg text-center">
                Belum ada catatan addendum, amandemen, atau perpanjangan pada PKS ini.
              </p>
            ) : (
              <div className="space-y-2">
                {pks.history.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
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
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Efektif: {formatIndonesianDate(hist.tanggalEfektif)}
                        {hist.tanggalBerakhirBaru && ` s.d. ${formatIndonesianDate(hist.tanggalBerakhirBaru)}`}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800 text-[11px]">{hist.perihal}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{hist.deskripsi}</p>

                    {hist.softFileName && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onDownload(hist.softFileName || 'Dokumen.pdf', hist.softFileDataUrl)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 hover:underline"
                        >
                          <Download className="w-3 h-3" /> Unduh: {hist.softFileName}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(pks);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Data PKS
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
