import React, { useState } from 'react';
import { X, Save, AlertCircle, Phone, PhoneCall } from 'lucide-react';
import { PksItem, RenewalStatus, DocumentType, ContactType } from '../types';

interface EditPksModalProps {
  isOpen: boolean;
  onClose: () => void;
  pks: PksItem;
  onUpdate: (updatedPks: PksItem) => void;
}

export const EditPksModal: React.FC<EditPksModalProps> = ({
  isOpen,
  onClose,
  pks,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const [namaPerusahaan, setNamaPerusahaan] = useState(pks.namaPerusahaan);
  const [bidang, setBidang] = useState(pks.bidang);
  const [nomorPks, setNomorPks] = useState(pks.nomorPks);
  const [judulPks, setJudulPks] = useState(pks.judulPks);
  const [tanggalBerlaku, setTanggalBerlaku] = useState(pks.tanggalBerlaku);
  const [tanggalBerakhir, setTanggalBerakhir] = useState(pks.tanggalBerakhir);
  const [statusPerpanjangan, setStatusPerpanjangan] = useState<RenewalStatus>(pks.statusPerpanjangan);
  const [peringatanBulan, setPeringatanBulan] = useState<number>(pks.peringatanBulan || 3);
  const [tipeDokumen, setTipeDokumen] = useState<DocumentType>(pks.tipeDokumen);
  const [lokasiArsipFisik, setLokasiArsipFisik] = useState(pks.lokasiArsipFisik || '');
  const [catatanFollowUp, setCatatanFollowUp] = useState(pks.catatanFollowUp || '');
  
  const [tipeKontak, setTipeKontak] = useState<ContactType>(pks.tipeKontak || 'whatsapp');
  const [picNama, setPicNama] = useState(pks.picNama);
  const [picKontak, setPicKontak] = useState(pks.picKontak || pks.picWa || '');
  const [picJabatan, setPicJabatan] = useState(pks.picJabatan);
  const [catatan, setCatatan] = useState(pks.catatan || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPerusahaan.trim() || !judulPks.trim()) {
      setErrorMessage('Nama perusahaan dan judul PKS wajib diisi.');
      return;
    }

    const updated: PksItem = {
      ...pks,
      namaPerusahaan: namaPerusahaan.trim(),
      bidang: bidang.trim() || 'Asuransi',
      nomorPks: nomorPks.trim(),
      judulPks: judulPks.trim(),
      tanggalBerlaku,
      tanggalBerakhir: statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' ? '' : tanggalBerakhir,
      statusPerpanjangan,
      peringatanBulan: statusPerpanjangan === 'Peringatan H-Bulan' ? Number(peringatanBulan) : undefined,
      tipeDokumen,
      lokasiArsipFisik: tipeDokumen === 'hard_file' ? lokasiArsipFisik : pks.lokasiArsipFisik,
      catatanFollowUp: tipeDokumen === 'tidak_ada' ? catatanFollowUp : pks.catatanFollowUp,
      tipeKontak,
      picNama: picNama.trim(),
      picKontak: picKontak.trim(),
      picWa: tipeKontak === 'whatsapp' ? picKontak.trim() : undefined,
      picJabatan: picJabatan.trim(),
      catatan: catatan.trim(),
      updatedAt: new Date().toISOString(),
    };

    onUpdate(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
              <img src={pks.logoUrl} alt={pks.namaPerusahaan} className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Edit Data PKS</h3>
              <p className="text-[11px] text-slate-300">{pks.namaPerusahaan}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[78vh] overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Nama Perusahaan</label>
              <input
                type="text"
                required
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Bidang Usaha</label>
              <input
                type="text"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Nomor PKS</label>
              <input
                type="text"
                value={nomorPks}
                onChange={(e) => setNomorPks(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Judul PKS</label>
              <input
                type="text"
                required
                value={judulPks}
                onChange={(e) => setJudulPks(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Tanggal Berlaku</label>
              <input
                type="date"
                required
                value={tanggalBerlaku}
                onChange={(e) => setTanggalBerlaku(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Tanggal Berakhir</label>
              <input
                type="date"
                disabled={statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan'}
                value={statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' ? '' : tanggalBerakhir}
                onChange={(e) => setTanggalBerakhir(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Status Perpanjangan */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">Status Perpanjangan</label>
            <select
              value={statusPerpanjangan}
              onChange={(e) => setStatusPerpanjangan(e.target.value as RenewalStatus)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium bg-white"
            >
              <option value="Diperpanjang Otomatis">Diperpanjang Otomatis</option>
              <option value="Pemberitahuan Tertulis">Pemberitahuan Tertulis</option>
              <option value="Jangka Waktu Tidak Ditentukan">Jangka Waktu Tidak Ditentukan</option>
              <option value="Diperpanjang Jangka Waktu Yang Sama">Diperpanjang Jangka Waktu Yang Sama</option>
              <option value="Peringatan H-Bulan">Peringatan H-Bulan</option>
            </select>
          </div>

          {/* Dynamic Bulan Selector jika Peringatan H-Bulan */}
          {statusPerpanjangan === 'Peringatan H-Bulan' && (
            <div className="p-2.5 bg-amber-50 rounded-md border border-amber-300 space-y-1">
              <label className="block text-[11px] font-bold text-amber-900 uppercase">
                Peringatan Berapa Bulan Sebelum Jatuh Tempo (Maksimal 6 Bulan)
              </label>
              <select
                value={peringatanBulan}
                onChange={(e) => setPeringatanBulan(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-amber-400 rounded bg-white font-bold text-amber-950"
              >
                <option value={1}>1 Bulan Sebelumnya</option>
                <option value={2}>2 Bulan Sebelumnya</option>
                <option value={3}>3 Bulan Sebelumnya</option>
                <option value={4}>4 Bulan Sebelumnya</option>
                <option value={5}>5 Bulan Sebelumnya</option>
                <option value={6}>6 Bulan Sebelumnya (Maksimal)</option>
              </select>
            </div>
          )}

          {/* Status Dokumen */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">Status Dokumen</label>
            <select
              value={tipeDokumen}
              onChange={(e) => setTipeDokumen(e.target.value as DocumentType)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 font-medium bg-white"
            >
              <option value="soft_file">Soft File (Word / PDF)</option>
              <option value="hard_file">Hard File (Arsip Fisik)</option>
              <option value="tidak_ada">Tidak Ada (Perlu Follow Up)</option>
            </select>
          </div>

          {tipeDokumen === 'hard_file' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-indigo-700 uppercase">Lokasi Arsip Fisik</label>
              <input
                type="text"
                value={lokasiArsipFisik}
                onChange={(e) => setLokasiArsipFisik(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-indigo-300 rounded-md"
              />
            </div>
          )}

          {tipeDokumen === 'tidak_ada' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-rose-700 uppercase">Catatan Follow-up</label>
              <input
                type="text"
                value={catatanFollowUp}
                onChange={(e) => setCatatanFollowUp(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-rose-300 rounded-md"
              />
            </div>
          )}

          {/* Kontak PIC: WhatsApp atau Nomor Kantor */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Saluran Kontak PIC
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                <input
                  type="radio"
                  name="editTipeKontak"
                  value="whatsapp"
                  checked={tipeKontak === 'whatsapp'}
                  onChange={() => setTipeKontak('whatsapp')}
                  className="w-3.5 h-3.5 text-emerald-600"
                />
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                <input
                  type="radio"
                  name="editTipeKontak"
                  value="telepon_kantor"
                  checked={tipeKontak === 'telepon_kantor'}
                  onChange={() => setTipeKontak('telepon_kantor')}
                  className="w-3.5 h-3.5 text-slate-600"
                />
                <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                <span>Nomor Kantor</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Nama PIC</label>
                <input
                  type="text"
                  value={picNama}
                  onChange={(e) => setPicNama(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  {tipeKontak === 'whatsapp' ? 'Nomor WA' : 'Nomor Kantor'}
                </label>
                <input
                  type="text"
                  value={picKontak}
                  onChange={(e) => setPicKontak(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Jabatan PIC</label>
                <input
                  type="text"
                  value={picJabatan}
                  onChange={(e) => setPicJabatan(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-2xs flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
