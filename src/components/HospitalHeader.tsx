import React, { useState } from 'react';
import { Calendar, FilePlus2, Table2, Home, LogOut } from 'lucide-react';
import { HospitalLogo } from './HospitalLogo';
import { PksItem } from '../types';

interface HeaderProps {
  activeTab: 'form' | 'table';
  setActiveTab: (tab: 'form' | 'table') => void;
  pksList: PksItem[];
  onOpenWelcome?: () => void;
}

export const HospitalHeader: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pksList,
  onOpenWelcome,
}) => {
  const [profileImgError, setProfileImgError] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Left: Official Hospital Logo & Compact Title */}
        <div className="flex items-center gap-2.5">
          <HospitalLogo size="sm" />
          
          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-800 tracking-tight leading-tight">
              SISTEM DATABASE PKS
            </span>
            <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
              RSIA BUNDA ASY-SYIFA
            </span>
          </div>
        </div>

        {/* Center: Slim Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'form'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FilePlus2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Input PKS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Database PKS</span>
            <span className="ml-0.5 text-[10px] bg-teal-100 text-teal-900 font-bold px-1.5 py-0.2 rounded-full">
              {pksList.length}
            </span>
          </button>
        </nav>

        {/* Right: Date Badge & User Profile + Portal Depan button */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md shrink-0">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[11px] font-medium">{todayFormatted}</span>
          </div>

          {onOpenWelcome && (
            <button
              type="button"
              onClick={onOpenWelcome}
              title="Kembali ke Halaman Selamat Datang / Ringkasan Portal"
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors text-xs font-semibold"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-300 ring-1 ring-teal-500 shrink-0 aspect-square">
                {!profileImgError ? (
                  <img
                    src="/profil.png"
                    alt="Rizki Naufal, S.T."
                    onError={() => setProfileImgError(true)}
                    className="w-full h-full object-cover aspect-square"
                  />
                ) : (
                  <div className="w-full h-full bg-teal-700 text-white text-[9px] font-bold flex items-center justify-center">
                    RN
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-[11px] text-slate-800">Rizki Naufal, S.T.</span>
              <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                <Home className="w-2.5 h-2.5" />
                <span className="hidden lg:inline">Beranda</span>
              </span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
