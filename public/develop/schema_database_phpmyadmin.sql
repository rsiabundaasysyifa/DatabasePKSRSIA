-- ============================================================================
-- SKEMA BASIS DATA PHPMYADMIN (MySQL / MariaDB)
-- SISTEM INFORMASI MANAJEMEN PKS (PERJANJIAN KERJA SAMA)
-- RSIA BUNDA ASY-SYIFA
-- ============================================================================

-- 1. PEMBUATAN DATABASE
CREATE DATABASE IF NOT EXISTS `db_rsia_pks` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `db_rsia_pks`;

-- ============================================================================
-- 2. TABEL INDUK: tb_pks (PKS Perusahaan Rekanan)
-- ============================================================================
DROP TABLE IF EXISTS `tb_pks_riwayat`;
DROP TABLE IF EXISTS `tb_pks`;

CREATE TABLE `tb_pks` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomor_pks` VARCHAR(100) NOT NULL COMMENT 'Nomor resmi dokumen PKS',
  `nama_perusahaan` VARCHAR(255) NOT NULL COMMENT 'Nama instansi/mitra/asuransi rekanan',
  `logo_url` TEXT DEFAULT NULL COMMENT 'Path atau URL logo perusahaan',
  `bidang` VARCHAR(100) NOT NULL DEFAULT 'Asuransi' COMMENT 'Kategori mitra (Asuransi, Vendor, Faskes, dll)',
  `judul_pks` TEXT NOT NULL COMMENT 'Perihal ruang lingkup kerja sama',
  `tanggal_berlaku` DATE NOT NULL COMMENT 'Tanggal mulai berlaku (YYYY-MM-DD)',
  `tanggal_berakhir` DATE DEFAULT NULL COMMENT 'Tanggal berakhir (NULL jika jangka waktu tidak ditentukan)',
  `status_perpanjangan` ENUM(
    'Diperpanjang Otomatis',
    'Pemberitahuan Tertulis',
    'Jangka Waktu Tidak Ditentukan',
    'Diperpanjang Jangka Waktu Yang Sama',
    'Peringatan H-Bulan'
  ) NOT NULL DEFAULT 'Diperpanjang Otomatis' COMMENT 'Aturan perpanjangan tenor PKS',
  `peringatan_bulan` TINYINT(1) UNSIGNED DEFAULT NULL COMMENT 'Diisi 1-6 jika status = Peringatan H-Bulan',
  `tipe_dokumen` ENUM('soft_file', 'hard_file', 'tidak_ada') NOT NULL DEFAULT 'soft_file' COMMENT 'Ketersediaan berkas PKS',
  `soft_file_name` VARCHAR(255) DEFAULT NULL COMMENT 'Nama file Word (.doc/docx) atau PDF (.pdf)',
  `soft_file_path` VARCHAR(500) DEFAULT NULL COMMENT 'Lokasi direktori penyimpanan file di server backend',
  `soft_file_size` VARCHAR(50) DEFAULT NULL COMMENT 'Ukuran file (mis: 2.4 MB)',
  `lokasi_arsip_fisik` VARCHAR(255) DEFAULT NULL COMMENT 'Lokasi rak/lemari jika tipe_dokumen = hard_file',
  `catatan_follow_up` TEXT DEFAULT NULL COMMENT 'Tindak lanjut jika tipe_dokumen = tidak_ada',
  `pic_nama` VARCHAR(150) NOT NULL COMMENT 'Nama Contact Person (PIC)',
  `tipe_kontak` ENUM('whatsapp', 'telepon_kantor') NOT NULL DEFAULT 'whatsapp' COMMENT 'Pilihan saluran komunikasi PIC',
  `pic_kontak` VARCHAR(50) NOT NULL COMMENT 'Nomor WhatsApp atau nomor kantor',
  `pic_jabatan` VARCHAR(150) NOT NULL COMMENT 'Jabatan PIC rekanan',
  `catatan` TEXT DEFAULT NULL COMMENT 'Catatan tambahan Humas & Marketing',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nomor_pks` (`nomor_pks`),
  INDEX `idx_nama_perusahaan` (`nama_perusahaan`),
  INDEX `idx_tanggal_berakhir` (`tanggal_berakhir`),
  INDEX `idx_status_perpanjangan` (`status_perpanjangan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel Induk Perjanjian Kerja Sama Perusahaan';

-- ============================================================================
-- 3. TABEL RIWAYAT: tb_pks_riwayat (Addendum / Amandemen / Perpanjangan)
-- ============================================================================
CREATE TABLE `tb_pks_riwayat` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pks_id` INT(11) UNSIGNED NOT NULL COMMENT 'Relasi Foreign Key ke tb_pks.id',
  `tipe_aksi` ENUM('addendum', 'amandemen', 'perpanjang') NOT NULL COMMENT 'Jenis perubahan PKS',
  `nomor_dokumen` VARCHAR(100) NOT NULL COMMENT 'Nomor surat addendum/amandemen/perpanjangan',
  `tanggal_efektif` DATE NOT NULL COMMENT 'Tanggal mulai berlaku perubahan',
  `tanggal_berakhir_baru` DATE DEFAULT NULL COMMENT 'Tanggal jatuh tempo baru jika ada perpanjangan masa berlaku',
  `perihal` VARCHAR(255) NOT NULL COMMENT 'Perihal singkat perubahan',
  `deskripsi` TEXT NOT NULL COMMENT 'Rincian klausul atau pasal yang diperbarui',
  `soft_file_name` VARCHAR(255) DEFAULT NULL COMMENT 'Nama berkas lampiran',
  `soft_file_path` VARCHAR(500) DEFAULT NULL COMMENT 'Lokasi file lampiran di server',
  `pic_nama` VARCHAR(150) DEFAULT NULL COMMENT 'Nama PIC saat aksi berlangsung',
  `tipe_kontak` ENUM('whatsapp', 'telepon_kantor') DEFAULT 'whatsapp',
  `pic_kontak` VARCHAR(50) DEFAULT NULL COMMENT 'Nomor kontak PIC',
  `pic_jabatan` VARCHAR(150) DEFAULT NULL COMMENT 'Jabatan PIC',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pks_id` (`pks_id`),
  CONSTRAINT `fk_pks_riwayat_induk` 
    FOREIGN KEY (`pks_id`) 
    REFERENCES `tb_pks` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel Riwayat Addendum, Amandemen, dan Perpanjangan PKS';

-- ============================================================================
-- 4. CONTOH DATA SAMPEL (DML)
-- ============================================================================

INSERT INTO `tb_pks` (
  `id`, `nomor_pks`, `nama_perusahaan`, `bidang`, `judul_pks`, 
  `tanggal_berlaku`, `tanggal_berakhir`, `status_perpanjangan`, `peringatan_bulan`, 
  `tipe_dokumen`, `soft_file_name`, `soft_file_path`, `soft_file_size`, 
  `lokasi_arsip_fisik`, `catatan_follow_up`, 
  `pic_nama`, `tipe_kontak`, `pic_kontak`, `pic_jabatan`, `catatan`
) VALUES 
(
  1, 
  '018/PKS-RSIA-BAS/DIR/I/2026', 
  'PT Asuransi Allianz Life Indonesia', 
  'Asuransi', 
  'Pelayanan Rawat Inap, Rawat Jalan & Persalinan Pasien Asuransi Allianz Mediextra & SmartHealth', 
  '2026-01-01', 
  '2026-12-31', 
  'Peringatan H-Bulan', 
  3, 
  'soft_file', 
  'PKS-Allianz-RSIA-BAS-2026.pdf', 
  '/uploads/pks/PKS-Allianz-RSIA-BAS-2026.pdf', 
  '2.4 MB', 
  NULL, 
  NULL, 
  'Andi Setiawan, S.E.', 
  'whatsapp', 
  '081272009898', 
  'Provider Relations Officer', 
  'PKS Prioritas Utama Provider Asuransi'
),
(
  2, 
  '045/PKS-RSIA-BAS/DIR/III/2025', 
  'PT Prudential Life Assurance', 
  'Asuransi', 
  'Kerja Sama Layanan Rawat Inap Cashless Ibu & Anak Pasien PRUHospital & Surgical', 
  '2025-04-01', 
  '2026-03-31', 
  'Pemberitahuan Tertulis', 
  NULL, 
  'soft_file', 
  'PKS-Prudential-2025-2026.pdf', 
  '/uploads/pks/PKS-Prudential-2025-2026.pdf', 
  '1.8 MB', 
  NULL, 
  NULL, 
  'Dewi Sartika', 
  'whatsapp', 
  '081369554433', 
  'Account Manager Healthcare', 
  'Wajib kirim surat konfirmasi perpanjangan H-30'
),
(
  3, 
  '001/PKS-BPJS-KCU-BDL/RSIA/2024', 
  'BPJS Kesehatan', 
  'Asuransi Sosial', 
  'Pelayanan Kesehatan Rujukan Tingkat Lanjutan (FKRTL) Bagi Peserta Program JKN-KIS', 
  '2024-01-01', 
  NULL, 
  'Jangka Waktu Tidak Ditentukan', 
  NULL, 
  'hard_file', 
  NULL, 
  NULL, 
  NULL, 
  'Lemari Arsip Direksi Lantai 2, Rak A-01 Map Hijau', 
  NULL, 
  'Sekretariat BPJS KC BDL', 
  'telepon_kantor', 
  '0721-255678 ext 102', 
  'Staf Bagian Penjaminan Manfaat Rujukan', 
  'Kerja sama permanen regulasi Kemenkes'
);

-- Contoh Riwayat Addendum Pada PKS Allianz (pks_id = 1)
INSERT INTO `tb_pks_riwayat` (
  `id`, `pks_id`, `tipe_aksi`, `nomor_dokumen`, `tanggal_efektif`, `tanggal_berakhir_baru`, 
  `perihal`, `deskripsi`, `soft_file_name`, `soft_file_path`, 
  `pic_nama`, `tipe_kontak`, `pic_kontak`, `pic_jabatan`
) VALUES 
(
  1, 
  1, 
  'addendum', 
  '018.A1/ADD-RSIA-BAS/VI/2026', 
  '2026-06-01', 
  '2026-12-31', 
  'Penambahan Tindakan Bedah Caesar Metode ERACS & NICU Khusus Bayi Prematur', 
  'Penyesuaian tarif klaim dan paket persalinan sectio caesarea ERACS kamar VIP & VVIP serta layanan perinatologi intensif.', 
  'Addendum-1-Allianz-ERACS.pdf', 
  '/uploads/pks/Addendum-1-Allianz-ERACS.pdf', 
  'Andi Setiawan, S.E.', 
  'whatsapp', 
  '081272009898', 
  'Provider Relations Officer'
);
