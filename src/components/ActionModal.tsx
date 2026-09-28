import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  Upload, 
  User, 
  Phone, 
  AlertCircle,
  FileCheck,
  CalendarCheck2,
  FilePlus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { PksItem, ActionType, PksHistoryItem, formatIndonesianDate } from '../types';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pks: PksItem;
  actionType: ActionType;
  onSubmit: (
    pksId: string, 
    historyItem: PksHistoryItem, 
    newTanggalBerakhir?: string,
    newTanggalBerlaku?: string
  ) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  pks,
  actionType,
  onSubmit,
}) => {
  if (!isOpen) return null;

  // Defaults
  const today = new Date().toISOString().split('T')[0];

  // Default dates for perpanjangan
  const calculateDefaultNewDates = () => {
    let start = today;
    if (pks.tanggalBerakhir) {
      const prevEnd = new Date(pks.tanggalBerakhir);
      prevEnd.setDate(prevEnd.getDate() + 1);
      start = prevEnd.toISOString().split('T')[0];
    }
    const nextYear = new Date(start);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const end = nextYear.toISOString().split('T')[0];
    return { start, end };
  };

  const defaultNewDates = calculateDefaultNewDates();

  const [nomorDokumen, setNomorDokumen] = useState(
    actionType === 'addendum' 
      ? `${pks.nomorPks}.ADD-${(pks.history.filter(h => h.type === 'addendum').length + 1)}`
      : actionType === 'amandemen'
      ? `${pks.nomorPks}.AMD-${(pks.history.filter(h => h.type === 'amandemen').length + 1)}`
      : `${pks.nomorPks}.EXT-${(pks.history.filter(h => h.type === 'perpanjang').length + 1)}`
  );

  const [tanggalEfektif, setTanggalEfektif] = useState(today);
  const [tanggalBerakhirBaru, setTanggalBerakhirBaru] = useState(defaultNewDates.end);
  const [perihal, setPerihal] = useState(
    actionType === 'addendum'
      ? `Addendum Penambahan Klausul Kerja Sama ${pks.namaPerusahaan}`
      : actionType === 'amandemen'
      ? `Amandemen Perubahan Ketentuan PKS ${pks.namaPerusahaan}`
      : `Perpanjangan Jangka Waktu Perjanjian Kerja Sama ${pks.namaPerusahaan}`
  );
  const [deskripsi, setDeskripsi] = useState('');
  
  // Soft file
  const [softFileName, setSoftFileName] = useState('');
  const [softFileDataUrl, setSoftFileDataUrl] = useState('');
  const [fileError, setFileError] = useState('');

  // PIC
  const [picNama, setPicNama] = useState(pks.picNama || '');
  const [picWa, setPicWa] = useState(pks.picWa || '');
  const [picJabatan, setPicJabatan] = useState(pks.picJabatan || '');

  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext)) ||
      file.type === 'application/pdf' ||
      file.type.includes('word') ||
      file.type.includes('officedocument');

    if (!isValid) {
      setFileError('Format file wajib berekstensi PDF (.pdf) atau Word (.doc, .docx)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSoftFileDataUrl(event.target?.result as string);
      setSoftFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nomorDokumen.trim()) {
      setErrorMessage('Nomor dokumen wajib diisi.');
      return;
    }
    if (!tanggalEfektif) {
      setErrorMessage('Tanggal efektif wajib diisi.');
      return;
    }
    if (actionType === 'perpanjang' && !tanggalBerakhirBaru) {
      setErrorMessage('Tanggal berakhir baru wajib diisi untuk perpanjangan.');
      return;
    }

    const historyItem: PksHistoryItem = {
      id: `hist-${Date.now()}`,
      type: actionType,
      nomorDokumen: nomorDokumen.trim(),
      tanggalEfektif,
      tanggalBerakhirBaru: actionType === 'perpanjang' ? tanggalBerakhirBaru : undefined,
      perihal: perihal.trim(),
      deskripsi: deskripsi.trim() || `Pencatatan ${actionType.toUpperCase()} untuk PKS ${pks.nomorPks}`,
      softFileName: softFileName || undefined,
      softFileDataUrl: softFileDataUrl || undefined,
      picNama: picNama.trim(),
      tipeKontak: pks.tipeKontak || 'whatsapp',
      picKontak: picWa.trim() || pks.picKontak || '',
      picWa: picWa.trim(),
      picJabatan: picJabatan.trim(),
      createdAt: new Date().toISOString(),
    };

    onSubmit(
      pks.id, 
      historyItem, 
      actionType === 'perpanjang' ? tanggalBerakhirBaru : undefined,
      actionType === 'perpanjang' ? tanggalEfektif : undefined
    );
    onClose();
  };

  const getActionConfig = () => {
    switch (actionType) {
      case 'addendum':
        return {
          title: 'Buat Addendum Baru (Penambahan Klausul)',
          subtitle: `Menambahkan klausul atau lampiran baru di bawah PKS: ${pks.namaPerusahaan}`,
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          btnColor: 'bg-indigo-700 hover:bg-indigo-800',
          icon: FilePlus,
        };
      case 'amandemen':
        return {
          title: 'Buat Amandemen Baru (Perubahan Klausul)',
          subtitle: `Mengubah atau merevisi pasal pokok di bawah PKS: ${pks.namaPerusahaan}`,
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          btnColor: 'bg-purple-700 hover:bg-purple-800',
          icon: RefreshCw,
        };
      case 'perpanjang':
        return {
          title: 'Proses Perpanjangan Masa Berlaku PKS',
          subtitle: `Memperbarui tanggal masa berlaku dan mencatat riwayat perpanjangan PKS: ${pks.namaPerusahaan}`,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          btnColor: 'bg-emerald-700 hover:bg-emerald-800',
          icon: CalendarCheck2,
        };
    }
  };

  const config = getActionConfig();
  const HeaderIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300">
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{config.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badgeColor}`}>
                  {actionType}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">{config.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info PKS Induk (Parent) */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
          <div>
            <span className="font-semibold text-slate-700">PKS Induk:</span> {pks.nomorPks}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Perusahaan:</span> {pks.namaPerusahaan}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Berlaku s.d:</span>{' '}
            {pks.tanggalBerakhir ? formatIndonesianDate(pks.tanggalBerakhir) : 'Tidak Terbatas'}
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nomor Dokumen & Tanggal Efektif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nomor Dokumen {actionType.toUpperCase()} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={nomorDokumen}
                  onChange={(e) => setNomorDokumen(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tanggal Efektif {actionType === 'perpanjang' ? 'Mulai Berlaku' : ''} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={tanggalEfektif}
                  onChange={(e) => setTanggalEfektif(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Khusus Perpanjang: Tanggal Berakhir Baru */}
          {actionType === 'perpanjang' && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Pembaruan Masa Berlaku Baru (Otomatis Memperbarui PKS Utama)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Masa Berlaku Sebelumnya:</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono">
                    s.d. {formatIndonesianDate(pks.tanggalBerakhir)}
                  </span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                    Tanggal Berakhir Baru <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalBerakhirBaru}
                    onChange={(e) => setTanggalBerakhirBaru(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-bold border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-700">
                Setelah disimpan, status masa berlaku PKS utama akan otomatis diperpanjang hingga tanggal ini, dan riwayat perpanjangan akan tercatat di bawah baris PKS.
              </p>
            </div>
          )}

          {/* Perihal */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Perihal / Judul Kesepakatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Deskripsi / Poin Perubahan */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Rincian Perubahan Klausul / Pasal Terkait
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan pasal apa saja yang ditambah, diubah, atau klausul perpanjangan yang disepakati kedua belah pihak..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Soft File Upload (Word/PDF) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-600" />
                Soft File Dokumen {actionType.toUpperCase()} (Word / PDF)
              </label>
              <span className="text-[10px] text-slate-400">Opsional</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                id="action-file-input"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="action-file-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Berkas
              </label>
              <span className="text-xs text-slate-600 truncate flex-1">
                {softFileName ? softFileName : 'Belum ada file terlampir'}
              </span>
            </div>
            {fileError && <p className="text-xs text-rose-600">{fileError}</p>}
          </div>

          {/* PIC yang Menangani */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">Nama PIC</label>
              <input
                type="text"
                value={picNama}
                onChange={(e) => setPicNama(e.target.value)}
                placeholder="Nama PIC"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">WhatsApp PIC</label>
              <input
                type="text"
                value={picWa}
                onChange={(e) => setPicWa(e.target.value)}
                placeholder="08..."
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">Jabatan PIC</label>
              <input
                type="text"
                value={picJabatan}
                onChange={(e) => setPicJabatan(e.target.value)}
                placeholder="Jabatan"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all ${config.btnColor}`}
            >
              Simpan & Tambahkan Baris Riwayat
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
