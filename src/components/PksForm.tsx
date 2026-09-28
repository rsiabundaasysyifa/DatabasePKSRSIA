import React, { useState, useRef } from 'react';
import { 
  Building, 
  Upload, 
  Calendar, 
  Phone, 
  User, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  RotateCcw,
  PhoneCall,
  BellRing
} from 'lucide-react';
import { PksItem, RenewalStatus, DocumentType, ContactType } from '../types';

interface PksFormProps {
  onAddPks: (pks: PksItem) => void;
  onNavigateToTable: () => void;
}

export const PksForm: React.FC<PksFormProps> = ({ onAddPks, onNavigateToTable }) => {
  // 1. Identitas Perusahaan
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [logoError, setLogoError] = useState('');
  const [bidang, setBidang] = useState('Asuransi');

  // 2. Ketentuan PKS
  const [judulPks, setJudulPks] = useState('');
  const [tanggalBerlaku, setTanggalBerlaku] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [statusPerpanjangan, setStatusPerpanjangan] = useState<RenewalStatus>('Diperpanjang Otomatis');
  const [peringatanBulan, setPeringatanBulan] = useState<number>(3); // 1 - 6 bulan

  // 3. Berkas PKS (Soft File, Hard File, atau Tidak Ada Sama Sekali)
  const [tipeDokumen, setTipeDokumen] = useState<DocumentType>('soft_file');
  const [softFileName, setSoftFileName] = useState('');
  const [softFileSize, setSoftFileSize] = useState('');
  const [softFileDataUrl, setSoftFileDataUrl] = useState('');
  const [softFileError, setSoftFileError] = useState('');
  const [lokasiArsipFisik, setLokasiArsipFisik] = useState('');
  const [catatanFollowUp, setCatatanFollowUp] = useState('');

  // 4. Kontak Person PIC
  const [tipeKontak, setTipeKontak] = useState<ContactType>('whatsapp');
  const [picNama, setPicNama] = useState('');
  const [picKontak, setPicKontak] = useState('');
  const [picJabatan, setPicJabatan] = useState('');

  // Notifikasi Form
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const softFileInputRef = useRef<HTMLInputElement>(null);

  // Upload Logo WAJIB Format .PNG
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setLogoError('Gagal! Format logo perusahaan WAJIB berekstensi .PNG');
      if (logoInputRef.current) logoInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
      setLogoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Upload Soft File (Word atau PDF)
  const handleSoftFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoftFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext)) ||
      file.type === 'application/pdf' ||
      file.type.includes('word') ||
      file.type.includes('officedocument');

    if (!isValid) {
      setSoftFileError('Format file wajib berekstensi PDF (.pdf) atau Word (.doc, .docx)!');
      if (softFileInputRef.current) softFileInputRef.current.value = '';
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = `${sizeInMb} MB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSoftFileDataUrl(event.target?.result as string);
      setSoftFileName(file.name);
      setSoftFileSize(sizeStr);
    };
    reader.readAsDataURL(file);
  };

  // Reset form ke kondisi awal
  const handleReset = () => {
    setNamaPerusahaan('');
    setLogoUrl('');
    setLogoFileName('');
    setLogoError('');
    setBidang('Asuransi');
    setJudulPks('');
    setTanggalBerlaku('');
    setTanggalBerakhir('');
    setStatusPerpanjangan('Diperpanjang Otomatis');
    setPeringatanBulan(3);
    setTipeDokumen('soft_file');
    setSoftFileName('');
    setSoftFileSize('');
    setSoftFileDataUrl('');
    setSoftFileError('');
    setLokasiArsipFisik('');
    setCatatanFollowUp('');
    setTipeKontak('whatsapp');
    setPicNama('');
    setPicKontak('');
    setPicJabatan('');
    setFormError('');
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!namaPerusahaan.trim()) {
      setFormError('Nama perusahaan rekanan wajib diisi.');
      return;
    }

    if (!logoUrl) {
      setFormError('Logo perusahaan (format PNG) wajib dilampirkan.');
      return;
    }

    if (!judulPks.trim()) {
      setFormError('Judul PKS wajib diisi.');
      return;
    }

    if (!tanggalBerlaku) {
      setFormError('Tanggal berlaku PKS wajib diisi.');
      return;
    }

    if (statusPerpanjangan !== 'Jangka Waktu Tidak Ditentukan' && !tanggalBerakhir) {
      setFormError('Tanggal berakhir PKS wajib diisi jika status perpanjangan bukan "Jangka Waktu Tidak Ditentukan".');
      return;
    }

    if (tipeDokumen === 'soft_file' && !softFileName) {
      setFormError('Anda memilih "Ada Soft File", mohon unggah dokumen PKS (format Word atau PDF).');
      return;
    }

    if (!picKontak.trim()) {
      setFormError(`Nomor ${tipeKontak === 'whatsapp' ? 'WhatsApp' : 'Telepon Kantor'} PIC wajib diisi.`);
      return;
    }

    if (!picNama.trim()) {
      setFormError('Nama PIC wajib diisi.');
      return;
    }

    // Auto-generate nomor PKS rapi untuk arsip database
    const year = new Date().getFullYear();
    const autoNumber = `PKS/${namaPerusahaan.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()}/${year}/${Math.floor(100 + Math.random() * 900)}`;

    const newPks: PksItem = {
      id: `pks-${Date.now()}`,
      nomorPks: autoNumber,
      namaPerusahaan: namaPerusahaan.trim(),
      logoUrl,
      bidang: bidang.trim() || 'Asuransi',
      judulPks: judulPks.trim(),
      tanggalBerlaku,
      tanggalBerakhir: statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' ? '' : tanggalBerakhir,
      statusPerpanjangan,
      peringatanBulan: statusPerpanjangan === 'Peringatan H-Bulan' ? Number(peringatanBulan) : undefined,
      tipeDokumen,
      softFileName: tipeDokumen === 'soft_file' ? softFileName : undefined,
      softFileDataUrl: tipeDokumen === 'soft_file' ? softFileDataUrl : undefined,
      softFileSize: tipeDokumen === 'soft_file' ? softFileSize : undefined,
      lokasiArsipFisik: tipeDokumen === 'hard_file' ? lokasiArsipFisik.trim() : undefined,
      catatanFollowUp: tipeDokumen === 'tidak_ada' ? catatanFollowUp.trim() : undefined,
      picNama: picNama.trim(),
      tipeKontak,
      picKontak: picKontak.trim(),
      picWa: tipeKontak === 'whatsapp' ? picKontak.trim() : undefined,
      picJabatan: picJabatan.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
    };

    onAddPks(newPks);
    setSuccessMessage(`PKS untuk ${namaPerusahaan} berhasil disimpan ke database!`);

    setTimeout(() => {
      setSuccessMessage('');
      handleReset();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
      {/* Success Notification */}
      {successMessage && (
        <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToTable}
            className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            Lihat di Tabel &rarr;
          </button>
        </div>
      )}

      {/* Error Alert */}
      {formError && (
        <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2 text-xs shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{formError}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-300 shadow-xs divide-y divide-slate-200">
        
        {/* Identitas Mitra & Logo */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Nama Perusahaan */}
            <div className="md:col-span-8 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Nama Perusahaan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama perusahaan mitra / asuransi..."
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Bidang (Default: Asuransi) */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Bidang <span className="text-slate-400 font-normal">(Default: Asuransi)</span>
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={bidang}
                  onChange={(e) => setBidang(e.target.value)}
                  placeholder="Asuransi"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Logo Perusahaan (WAJIB PNG) */}
            <div className="md:col-span-12">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Logo Perusahaan <span className="text-rose-600 font-bold">(Wajib Format .PNG) *</span>
              </label>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {logoUrl ? (
                      <div className="w-12 h-12 rounded border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                        <img 
                          src={logoUrl} 
                          alt="Logo Preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold">
                        PNG
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      id="logo-upload-input"
                      accept=".png,image/png"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Pilih Logo (.PNG)
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {logoFileName ? (
                        <span className="text-emerald-700 font-medium">
                          File: {logoFileName} (Format PNG Valid)
                        </span>
                      ) : (
                        'Wajib file .png'
                      )}
                    </p>
                  </div>
                </div>

                {logoError && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {logoError}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Ketentuan PKS: Judul, Tanggal Berlaku, Tanggal Berakhir, Status Perpanjangan */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Judul PKS (Full Width) */}
            <div className="md:col-span-12 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Judul PKS <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Perjanjian Kerja Sama Pelayanan Kesehatan Rawat Jalan dan Rawat Inap..."
                value={judulPks}
                onChange={(e) => setJudulPks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900"
              />
            </div>

            {/* Tanggal Berlaku */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Tanggal Berlaku <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={tanggalBerlaku}
                  onChange={(e) => setTanggalBerlaku(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Tanggal Berakhir */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Tanggal Berakhir{' '}
                {statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' ? (
                  <span className="text-amber-600 font-normal">(Tidak Ditentukan)</span>
                ) : (
                  <span className="text-rose-500">*</span>
                )}
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  disabled={statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan'}
                  value={statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan' ? '' : tanggalBerakhir}
                  onChange={(e) => setTanggalBerakhir(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs border rounded-md focus:outline-none font-medium ${
                    statusPerpanjangan === 'Jangka Waktu Tidak Ditentukan'
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-slate-300 focus:ring-1 focus:ring-teal-600 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Status Perpanjangan: Langsung dropdown tanpa penjelasan */}
            <div className="md:col-span-12 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Status Perpanjangan <span className="text-rose-500">*</span>
              </label>
              <select
                value={statusPerpanjangan}
                onChange={(e) => setStatusPerpanjangan(e.target.value as RenewalStatus)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-semibold text-slate-900 cursor-pointer"
              >
                <option value="Diperpanjang Otomatis">Diperpanjang Otomatis</option>
                <option value="Pemberitahuan Tertulis">Pemberitahuan Tertulis</option>
                <option value="Jangka Waktu Tidak Ditentukan">Jangka Waktu Tidak Ditentukan</option>
                <option value="Diperpanjang Jangka Waktu Yang Sama">Diperpanjang Jangka Waktu Yang Sama</option>
                <option value="Peringatan H-Bulan">Peringatan H-Bulan</option>
              </select>

              {/* Dynamic Field setelah dropdown jika memilih Peringatan H-Bulan */}
              {statusPerpanjangan === 'Peringatan H-Bulan' && (
                <div className="p-3 bg-amber-50 rounded-md border border-amber-300 space-y-1.5 text-xs text-amber-950 mt-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px] uppercase">
                    <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Peringatan Berapa Bulan Sebelum Jatuh Tempo (Maksimal 6 Bulan) <span className="text-rose-500">*</span></span>
                  </div>
                  <select
                    value={peringatanBulan}
                    onChange={(e) => setPeringatanBulan(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-400 rounded-md font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={1}>1 Bulan Sebelumnya (H-1 Bulan)</option>
                    <option value={2}>2 Bulan Sebelumnya (H-2 Bulan)</option>
                    <option value={3}>3 Bulan Sebelumnya (H-3 Bulan)</option>
                    <option value={4}>4 Bulan Sebelumnya (H-4 Bulan)</option>
                    <option value={5}>5 Bulan Sebelumnya (H-5 Bulan)</option>
                    <option value={6}>6 Bulan Sebelumnya (H-6 Bulan - Maksimal)</option>
                  </select>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Ketersediaan Berkas PKS: Langsung Dropdown tanpa penjelasan, field tambahan muncul setelahnya */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Ketersediaan Berkas PKS <span className="text-rose-500">*</span>
            </label>
            <select
              value={tipeDokumen}
              onChange={(e) => setTipeDokumen(e.target.value as DocumentType)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-semibold text-slate-900 cursor-pointer"
            >
              <option value="soft_file">Ada Soft File</option>
              <option value="hard_file">Hard File (Arsip Fisik)</option>
              <option value="tidak_ada">Tidak Ada Sama Sekali</option>
            </select>
          </div>

          {/* Jika Ada Soft File: Langsung Munculkan Field Upload Berkas */}
          {tipeDokumen === 'soft_file' && (
            <div className="p-3 bg-slate-50 rounded-md border border-slate-300 flex flex-col sm:flex-row items-center gap-3">
              <input
                ref={softFileInputRef}
                type="file"
                id="soft-file-upload-input"
                accept=".pdf,.doc,.docx"
                onChange={handleSoftFileUpload}
                className="hidden"
              />
              <label
                htmlFor="soft-file-upload-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Berkas Word / PDF
              </label>

              <div className="flex-1 truncate">
                {softFileName ? (
                  <span className="text-xs font-semibold text-teal-900 bg-white px-2.5 py-1 rounded border border-teal-200 inline-block truncate">
                    {softFileName} ({softFileSize})
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Belum ada dokumen yang dipilih (wajib format .doc, .docx, atau .pdf)
                  </span>
                )}
              </div>

              {softFileError && (
                <p className="text-xs text-rose-600 font-semibold">{softFileError}</p>
              )}
            </div>
          )}

          {/* Jika Hard File (Arsip Fisik): Field Lokasi Penyimpanan Fisik */}
          {tipeDokumen === 'hard_file' && (
            <div className="p-3 bg-indigo-50/60 rounded-md border border-indigo-200 space-y-1">
              <label className="block text-[11px] font-bold text-indigo-900 uppercase">
                Lokasi Penyimpanan Arsip Fisik
              </label>
              <input
                type="text"
                placeholder="Contoh: Lemari Arsip Lantai 2, Rak B-04 / Map Merah..."
                value={lokasiArsipFisik}
                onChange={(e) => setLokasiArsipFisik(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Jika Tidak Ada Sama Sekali: Field Catatan Follow Up */}
          {tipeDokumen === 'tidak_ada' && (
            <div className="p-3 bg-rose-50/60 rounded-md border border-rose-200 space-y-1">
              <label className="block text-[11px] font-bold text-rose-900 uppercase">
                Catatan Tindak Lanjut / Follow Up Berkas
              </label>
              <input
                type="text"
                placeholder="Contoh: Menunggu kiriman draf PKS bertandatangan basah dari bagian legal mitra..."
                value={catatanFollowUp}
                onChange={(e) => setCatatanFollowUp(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          )}
        </div>

        {/* Kontak Person: Pilihan WhatsApp atau Nomor Kantor, Nama, dan Jabatan/Posisi */}
        <div className="p-4 sm:p-5">
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
            Kontak Person (PIC) <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Pilihan Saluran Kontak */}
            <div className="md:col-span-12 flex items-center gap-3">
              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded border cursor-pointer text-xs font-semibold transition-all ${
                  tipeKontak === 'whatsapp'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="tipeKontak"
                  value="whatsapp"
                  checked={tipeKontak === 'whatsapp'}
                  onChange={() => setTipeKontak('whatsapp')}
                  className="w-3.5 h-3.5 text-emerald-600"
                />
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </label>

              <label
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded border cursor-pointer text-xs font-semibold transition-all ${
                  tipeKontak === 'telepon_kantor'
                    ? 'bg-slate-100 border-slate-500 text-slate-900 ring-1 ring-slate-500'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="tipeKontak"
                  value="telepon_kantor"
                  checked={tipeKontak === 'telepon_kantor'}
                  onChange={() => setTipeKontak('telepon_kantor')}
                  className="w-3.5 h-3.5 text-slate-600"
                />
                <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                <span>Nomor Kantor</span>
              </label>
            </div>

            {/* Nomor Kontak */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                {tipeKontak === 'whatsapp' ? 'Nomor WhatsApp' : 'Nomor Kantor'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                {tipeKontak === 'whatsapp' ? (
                  <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
                <input
                  type="text"
                  required
                  placeholder={tipeKontak === 'whatsapp' ? '081234567890' : '(021) 567890'}
                  value={picKontak}
                  onChange={(e) => setPicKontak(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-mono text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Nama PIC */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                Nama Lengkap PIC <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Nama PIC rekanan..."
                  value={picNama}
                  onChange={(e) => setPicNama(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Jabatan / Posisi */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">
                Jabatan / Posisi
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Contoh: Provider Relations"
                  value={picJabatan}
                  onChange={(e) => setPicJabatan(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium text-slate-900"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="p-4 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Simpan PKS
          </button>
        </div>

      </form>
    </div>
  );
};
