/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HospitalHeader } from './components/HospitalHeader';
import { HospitalLogo } from './components/HospitalLogo';
import { PksForm } from './components/PksForm';
import { PksTable } from './components/PksTable';
import { WelcomePage } from './components/WelcomePage';
import { PksItem, PksHistoryItem } from './types';
import { INITIAL_PKS_LIST } from './initialData';

const STORAGE_KEY = 'rsia_bunda_asy_syifa_pks_db_v1';

export default function App() {
  // Navigation: start at Welcome Page ('welcome') before entering the system ('system')
  const [currentView, setCurrentView] = useState<'welcome' | 'system'>('welcome');
  const [activeTab, setActiveTab] = useState<'form' | 'table'>('table');

  const [pksList, setPksList] = useState<PksItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored PKS data:', e);
    }
    return INITIAL_PKS_LIST;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pksList));
    } catch (e) {
      console.error('Error saving PKS data:', e);
    }
  }, [pksList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Add New PKS
  const handleAddPks = (newPks: PksItem) => {
    setPksList((prev) => [newPks, ...prev]);
    showToast(`PKS ${newPks.namaPerusahaan} berhasil didaftarkan ke sistem.`);
  };

  // 2. Update Existing PKS
  const handleUpdatePks = (updatedPks: PksItem) => {
    setPksList((prev) =>
      prev.map((item) => (item.id === updatedPks.id ? updatedPks : item))
    );
    showToast(`Data PKS ${updatedPks.namaPerusahaan} berhasil diperbarui.`);
  };

  // 3. Delete PKS
  const handleDeletePks = (pksId: string) => {
    const target = pksList.find((p) => p.id === pksId);
    setPksList((prev) => prev.filter((item) => item.id !== pksId));
    showToast(`PKS ${target?.namaPerusahaan || ''} berhasil dihapus.`);
  };

  // 4. Add History (Addendum / Amandemen / Perpanjang) to Parent
  const handleAddHistory = (
    pksId: string,
    historyItem: PksHistoryItem,
    newTanggalBerakhir?: string,
    newTanggalBerlaku?: string
  ) => {
    setPksList((prev) =>
      prev.map((item) => {
        if (item.id === pksId) {
          const updatedHistory = [historyItem, ...(item.history || [])];
          return {
            ...item,
            history: updatedHistory,
            // If perpanjangan, update the parent's expiration date!
            tanggalBerakhir: newTanggalBerakhir ? newTanggalBerakhir : item.tanggalBerakhir,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    const actionLabel =
      historyItem.type === 'addendum'
        ? 'Addendum'
        : historyItem.type === 'amandemen'
        ? 'Amandemen'
        : 'Perpanjangan';

    showToast(
      `Riwayat ${actionLabel} (${historyItem.nomorDokumen}) berhasil ditambahkan dan baris ditampilkan di bawah PKS.`
    );
  };

  // 5. Delete History
  const handleDeleteHistory = (pksId: string, historyId: string) => {
    setPksList((prev) =>
      prev.map((item) => {
        if (item.id === pksId) {
          return {
            ...item,
            history: item.history.filter((h) => h.id !== historyId),
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast('Catatan riwayat berhasil dihapus.');
  };

  // If in Welcome View, show Welcome Landing Page
  if (currentView === 'welcome') {
    return (
      <WelcomePage
        pksList={pksList}
        onEnterSystem={() => setCurrentView('system')}
      />
    );
  }

  // Main System View (Dashboard / Table / Form)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hospital Header with RSIA Bunda Asy-Syifa branding and navigation */}
      <HospitalHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pksList={pksList}
        onOpenWelcome={() => setCurrentView('welcome')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'form' ? (
          <PksForm
            onAddPks={handleAddPks}
            onNavigateToTable={() => setActiveTab('table')}
          />
        ) : (
          <PksTable
            pksList={pksList}
            onUpdatePks={handleUpdatePks}
            onDeletePks={handleDeletePks}
            onAddHistory={handleAddHistory}
            onDeleteHistory={handleDeleteHistory}
          />
        )}
      </main>

      {/* Hospital Footer - Compact & Professional */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <HospitalLogo size="sm" showText={false} />
            <span className="font-semibold text-slate-300">
              Humas & Marketing - Rizki Naufal, S.T.
            </span>
          </div>

          <div className="text-slate-400">
            RSIA Bunda Asy-Syifa Bandar Lampung
          </div>
        </div>
      </footer>

    </div>
  );
}
