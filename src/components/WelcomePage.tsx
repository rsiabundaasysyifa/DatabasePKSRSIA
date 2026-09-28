import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Calendar
} from 'lucide-react';
import { PksItem, checkExpiryStatus } from '../types';

interface WelcomePageProps {
  pksList: PksItem[];
  onEnterSystem: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ pksList, onEnterSystem }) => {
  const [logoImgError, setLogoImgError] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);

  // Compute live statistics for 4 core metrics
  const stats = useMemo(() => {
    let aktifCount = 0;
    let segeraHabisCount = 0;
    let kadaluarsaCount = 0;
    let tidakDitentukanCount = 0;

    pksList.forEach((pks) => {
      const calc = checkExpiryStatus(pks);
      if (calc.status === 'aktif') {
        aktifCount++;
      } else if (calc.status === 'segera_habis') {
        segeraHabisCount++;
      } else if (calc.status === 'kadaluarsa') {
        kadaluarsaCount++;
      } else {
        tidakDitentukanCount++;
      }
    });

    // Menghitung jumlah PKS terdaftar murni / perusahaan rekanan (tidak termasuk addendum atau amandemen)
    const masterPksList = pksList.filter((pks) => {
      const judul = (pks.judulPks || '').toLowerCase();
      const nomor = (pks.nomorPks || '').toLowerCase();
      const isAddendumOrAmandemen =
        judul.includes('addendum') ||
        judul.includes('amandemen') ||
        nomor.includes('addendum') ||
        nomor.includes('amandemen') ||
        nomor.includes('add.') ||
        nomor.includes('amd.');
      return !isAddendumOrAmandemen;
    });

    const uniqueCompanies = new Set(
      masterPksList.map((p) => p.namaPerusahaan?.trim().toLowerCase()).filter(Boolean)
    );
    const totalPerusahaan = uniqueCompanies.size > 0 ? uniqueCompanies.size : masterPksList.length;

    return {
      total: pksList.length,
      totalPerusahaan,
      aktif: aktifCount + tidakDitentukanCount,
      segeraHabis: segeraHabisCount,
      berakhir: kadaluarsaCount,
    };
  }, [pksList]);

  // Format today's date in Indonesian format
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="h-screen max-h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#071318] text-white flex flex-col justify-between selection:bg-[#0C717A] selection:text-white relative">
      
      {/* Background SVG layer from public/bg.svg */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-85"
        style={{ backgroundImage: `url('/bg.svg')` }}
      />

      {/* Smooth Vertical Gradient Overlay: Bagian atas transparan agar bg.svg terlihat jelas, makin ke bawah semakin gelap pekat */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(7, 19, 24, 0.20) 0%, rgba(7, 19, 24, 0.45) 25%, rgba(7, 19, 24, 0.80) 55%, #071318 85%, #071318 100%)',
        }}
      />

      {/* Background ambient lighting - Deep Teal / Dark Navy glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #0C717A 0%, rgba(12,113,122,0.15) 55%, transparent 75%)' }}
      />
      <div 
        className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none opacity-10 blur-[100px]"
        style={{ background: '#C4A6FF' }}
      />

      {/* ============================================================== */}
      {/* 1. MINIMAL TOP HEADER                                          */}
      {/* ============================================================== */}
      <header className="relative z-20 w-full px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b border-white/5 shrink-0">
        {/* Left: Logo + PKS Management */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white p-0.5 flex items-center justify-center shadow-xs">
            {!logoImgError ? (
              <img
                src="/logo.png"
                alt="Logo RSIA"
                onError={() => setLogoImgError(true)}
                className="w-full h-full object-contain aspect-square"
              />
            ) : (
              <span className="text-[9px] font-black text-[#0C717A]">RS</span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
            PKS Management
          </span>
        </div>

        {/* Right: Tanggal Hari Ini Sesuai Permintaan */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-2xs backdrop-blur-xs">
          <Calendar className="w-3.5 h-3.5 text-[#0C717A]" />
          <span>{todayFormatted}</span>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. CENTER STAGE / EXECUTIVE COVER (FITS 100% IN VIEWPORT)       */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 py-2 sm:py-3 flex-1 flex flex-col items-center justify-center">

        {/* Focal Point: Circular Portrait with #0C717A Glow Ring (Logo di atas dihilangkan sesuai permintaan) */}
        <div className="relative mb-3 sm:mb-4">
          {/* Subtle primary glow halo */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#0C717A] to-[#0C717A]/40 opacity-70 blur-xs"></div>
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-900 border-2 border-[#0C717A] shadow-2xl flex items-center justify-center">
            {!profileImgError ? (
              <img
                src="/profil.png"
                alt="Rizki Naufal, S.T."
                onError={() => setProfileImgError(true)}
                className="w-full h-full object-cover aspect-square"
              />
            ) : (
              <div className="w-full h-full bg-[#0C717A]/30 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-bold tracking-tight">RN</span>
              </div>
            )}
          </div>
        </div>

        {/* User Identity / Welcome Greeting */}
        <div className="text-center mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm font-normal text-slate-300 tracking-wide">
            Selamat datang,
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Rizki Naufal, S.T.
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#78d0d6] tracking-wider uppercase">
            Public Relations
          </p>
        </div>

        {/* Statistic Cards: TOTAL KERJA SAMA PERUSAHAAN Memanjang di Atas 3 Kotak Lainnya */}
        <div className="w-full max-w-lg flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-5">
          
          {/* 1. TOTAL KERJA SAMA PERUSAHAAN (Memanjang Penuh: Kiri Judul, Kanan Angka & Perusahaan) */}
          <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 sm:py-3 transition-all duration-200 backdrop-blur-md flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-left">
              <FileText className="w-3.5 h-3.5 text-[#78d0d6] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-200">
                TOTAL KERJA SAMA PERUSAHAAN
              </span>
            </div>
            
            <div className="flex flex-col items-end text-right pl-3 shrink-0">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                {stats.totalPerusahaan}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Perusahaan
              </span>
            </div>
          </div>

          {/* 3 Kotak Status Di Bawahnya (AKTIF, SEGERA BERAKHIR, BERAKHIR) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            
            {/* AKTIF */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#0C717A]/40 rounded-xl p-2.5 sm:p-3 transition-all duration-200 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78d0d6]">
                  AKTIF
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0C717A]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#78d0d6] tracking-tight">
                  {stats.aktif}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  PKS
                </div>
              </div>
            </div>

            {/* SEGERA BERAKHIR */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#FFBD59]/40 rounded-xl p-2.5 sm:p-3 transition-all duration-200 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFBD59]">
                  SEGERA BERAKHIR
                </span>
                <Clock className="w-3.5 h-3.5 text-[#FFBD59]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#FFBD59] tracking-tight">
                  {stats.segeraHabis}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  PKS
                </div>
              </div>
            </div>

            {/* BERAKHIR */}
            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#C4A6FF]/40 rounded-xl p-2.5 sm:p-3 transition-all duration-200 backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4A6FF]">
                  BERAKHIR
                </span>
                <XCircle className="w-3.5 h-3.5 text-[#C4A6FF]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#C4A6FF] tracking-tight">
                  {stats.berakhir}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  PKS
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Primary CTA Button: MASUK (Tampil jelas dan utuh di layar) */}
        <div className="w-full max-w-xs flex flex-col items-center">
          <button
            type="button"
            onClick={onEnterSystem}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#0C717A] hover:bg-[#0e838e] active:scale-98 text-white font-bold text-sm sm:text-base py-3 px-8 rounded-xl shadow-lg shadow-[#0C717A]/25 transition-all duration-200 cursor-pointer group"
          >
            <span className="tracking-wider">MASUK</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </main>

      {/* ============================================================== */}
      {/* 3. MINIMAL FOOTER                                              */}
      {/* ============================================================== */}
      <footer className="relative z-20 w-full py-2.5 px-4 text-center border-t border-white/5 shrink-0">
        <p className="text-[11px] font-medium text-slate-400">
          RSIA Bunda Asy-Syifa
        </p>
      </footer>

    </div>
  );
};
