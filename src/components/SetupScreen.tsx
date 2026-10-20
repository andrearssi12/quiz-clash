'use client';

import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { parseCsvText, parseExcelBuffer } from '@/lib/parseData';
import { UploadCloud, Link as LinkIcon, Play, Plus, Trash2, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

export function SetupScreen() {
  const {
    questions,
    setQuestions,
    teams,
    addTeam,
    removeTeam,
    completeSetup,
    startWithSampleData,
  } = useQuiz();

  const [sheetUrl, setSheetUrl] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Google Sheet CSV URL load
  const handleFetchUrl = async () => {
    if (!sheetUrl.trim()) {
      setErrorMsg('Masukkan tautan Google Sheets terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/fetch-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sheetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengambil data dari URL.');
      }

      const parsedQuestions = parseCsvText(data.csvText);
      setQuestions(parsedQuestions);
      setSuccessMsg(`Berhasil mengimpor ${parsedQuestions.length} soal dari Google Sheets!`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Local File Upload (CSV or Excel)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        const text = await file.text();
        const parsedQuestions = parseCsvText(text);
        setQuestions(parsedQuestions);
        setSuccessMsg(`Berhasil mengimpor ${parsedQuestions.length} soal dari ${file.name}!`);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const parsedQuestions = await parseExcelBuffer(buffer);
        setQuestions(parsedQuestions);
        setSuccessMsg(`Berhasil mengimpor ${parsedQuestions.length} soal dari ${file.name}!`);
      } else {
        throw new Error('Format file tidak didukung. Harap gunakan file .csv atau .xlsx');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membaca file.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      addTeam(newTeamName);
      setNewTeamName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Setup Bank Soal & Kelompok
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Selamat Datang di <span className="bg-gradient-to-r from-amber-400 via-rose-300 to-indigo-400 bg-clip-text text-transparent">QuizClash</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Hubungkan kuis dengan Google Spreadsheet / File CSV, atau langsung mainkan menggunakan Bank Soal default.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Import Bank Soal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Impor Bank Soal (Spreadsheet)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Format kolom: <code className="text-indigo-300">id, question, option_a, option_b, option_c, option_d, answer, points</code>
            </p>

            {/* Option A: Link Google Sheets */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tautan Google Sheets Publik / Link CSV:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFetchUrl}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition disabled:opacity-50 shrink-0"
                >
                  {isLoading ? 'Mengambil...' : 'Muat URL'}
                </button>
              </div>
            </div>

            {/* Option B: Local File Upload */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Atau Unggah File Langsung (.csv / .xlsx):
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950 p-4 rounded-xl cursor-pointer transition">
                <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 font-medium">Klik untuk memilih file kuis</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Mendukung format CSV & Excel (.xlsx)</span>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Notification messages */}
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Soal Terpasang:</span>
            <span className="font-bold text-slate-200 font-mono">{questions.length} Soal</span>
          </div>
        </div>

        {/* Step 2: Konfigurasi Tim Kelompok */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              Konfigurasi Kelompok
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Daftarkan kelompok yang akan bertanding di kuis rebutan ini.
            </p>

            <form onSubmit={handleAddTeamSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nama Kelompok Baru (contoh: Tim Alpha)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {teams.map((team, idx) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 w-4">
                      {idx + 1}.
                    </span>
                    <span className={`w-3 h-3 rounded-full ${team.color.split(' ')[0]}`} />
                    <span className="text-sm font-semibold text-slate-200">{team.name}</span>
                  </div>

                  {teams.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeTeam(team.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Hapus Kelompok"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Total Kelompok:</span>
            <span className="font-bold text-slate-200 font-mono">{teams.length} Kelompok</span>
          </div>
        </div>
      </div>

      {/* Action CTA buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={completeSetup}
          disabled={questions.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-90 text-white font-extrabold text-base shadow-xl shadow-indigo-950/50 transition transform active:scale-95 disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-current" />
          Masuk ke Arena Kuis ({questions.length} Soal)
        </button>

        <button
          type="button"
          onClick={startWithSampleData}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm border border-slate-700 transition"
        >
          Gunakan Data Contoh (12 Soal)
        </button>
      </div>
    </div>
  );
}
