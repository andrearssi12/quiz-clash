import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Question } from '@/types';

export const DEFAULT_TEAMS = [
  { id: 'team-1', name: 'Kelompok 1', score: 0, color: 'bg-emerald-500 border-emerald-600 text-white' },
  { id: 'team-2', name: 'Kelompok 2', score: 0, color: 'bg-sky-500 border-sky-600 text-white' },
  { id: 'team-3', name: 'Kelompok 3', score: 0, color: 'bg-amber-500 border-amber-600 text-white' },
  { id: 'team-4', name: 'Kelompok 4', score: 0, color: 'bg-rose-500 border-rose-600 text-white' },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Ibukota negara Indonesia yang baru di Kalimantan Timur adalah?',
    option_a: 'Nusantara',
    option_b: 'Balikpapan',
    option_c: 'Samarinda',
    option_d: 'Banjarmasin',
    answer: 'A',
    points: 100,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '2',
    question: 'Siapakah presiden pertama Republik Indonesia?',
    option_a: 'Moh. Hatta',
    option_b: 'Ir. Soekarno',
    option_c: 'Soeharto',
    option_d: 'B.J. Habibie',
    answer: 'B',
    points: 100,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '3',
    question: 'Planet terdekat dari matahari dalam tata surya kita adalah?',
    option_a: 'Venus',
    option_b: 'Mars',
    option_c: 'Merkurius',
    option_d: 'Bumi',
    answer: 'C',
    points: 200,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '4',
    question: 'Berapakah hasil dari 15 x 12?',
    option_a: '160',
    option_b: '170',
    option_c: '180',
    option_d: '190',
    answer: 'C',
    points: 200,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '5',
    question: 'Senyawa kimia dengan rumus H2O lebih dikenal sebagai?',
    option_a: 'Udara',
    option_b: 'Air',
    option_c: 'Garam',
    option_d: 'Minyak',
    answer: 'B',
    points: 300,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '6',
    question: 'Bahasa pemrograman yang digunakan secara luas untuk membuat Next.js adalah?',
    option_a: 'Python',
    option_b: 'Java',
    option_c: 'TypeScript / JavaScript',
    option_d: 'Ruby',
    answer: 'C',
    points: 300,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '7',
    question: 'Monumen Nasional (Monas) terletak di kota mana?',
    option_a: 'Surabaya',
    option_b: 'Bandung',
    option_c: 'Yogyakarta',
    option_d: 'Jakarta',
    answer: 'D',
    points: 400,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '8',
    question: 'Danau vulkanik terbesar di dunia yang berada di Indonesia adalah?',
    option_a: 'Danau Toba',
    option_b: 'Danau Singkarak',
    option_c: 'Danau Poso',
    option_d: 'Danau Maninjau',
    answer: 'A',
    points: 400,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '9',
    question: 'Unsur kimia dengan lambang Au adalah?',
    option_a: 'Perak',
    option_b: 'Tembaga',
    option_c: 'Emas',
    option_d: 'Besi',
    answer: 'C',
    points: 500,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '10',
    question: 'Lagu kebangsaan Indonesia Raya diciptakan oleh?',
    option_a: 'W.R. Soepratman',
    option_b: 'Ismail Marzuki',
    option_c: 'Kusbini',
    option_d: 'C. Simanjuntak',
    answer: 'A',
    points: 500,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '11',
    question: 'Alat musik tradisional Angklung berasal dari daerah?',
    option_a: 'Jawa Barat',
    option_b: 'Jawa Tengah',
    option_c: 'Sumatera Barat',
    option_d: 'Bali',
    answer: 'A',
    points: 500,
    status: 'unanswered',
    wrongAttempts: [],
  },
  {
    id: '12',
    question: 'Mamalia terbesar yang hidup di bumi saat ini adalah?',
    option_a: 'Gajah Afrika',
    option_b: 'Paus Biru',
    option_c: 'Hiu Paus',
    option_d: 'Jerapah',
    answer: 'B',
    points: 500,
    status: 'unanswered',
    wrongAttempts: [],
  },
];

// Helper to normalize keys from CSV / Excel header
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const cleanKey = key.trim().toLowerCase().replace(/[\s_-]+/g, '_');
    normalized[cleanKey] = row[key];
  }
  return normalized;
}

export function parseRawRecords(records: Record<string, unknown>[]): Question[] {
  return records
    .filter((row) => {
      const norm = normalizeRow(row);
      return norm.question && norm.answer;
    })
    .map((row, index) => {
      const norm = normalizeRow(row);
      const answerVal = String(norm.answer || 'A').trim().toUpperCase();
      const validAnswer = (['A', 'B', 'C', 'D'].includes(answerVal) ? answerVal : 'A') as 'A' | 'B' | 'C' | 'D';
      
      const pts = parseInt(String(norm.points || norm.point || norm.poin || '100'), 10);
      
      return {
        id: String(norm.id || index + 1),
        question: String(norm.question || '').trim(),
        option_a: String(norm.option_a || norm.a || '').trim(),
        option_b: String(norm.option_b || norm.b || '').trim(),
        option_c: String(norm.option_c || norm.c || '').trim(),
        option_d: String(norm.option_d || norm.d || '').trim(),
        answer: validAnswer,
        points: isNaN(pts) || pts <= 0 ? 100 : pts,
        status: 'unanswered' as const,
        wrongAttempts: [],
      };
    });
}

export function parseCsvText(csvText: string): Question[] {
  const result = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error('Gagal memproses data CSV.');
  }

  const parsed = parseRawRecords(result.data);
  if (parsed.length === 0) {
    throw new Error('Tidak ada data soal valid yang ditemukan dalam CSV.');
  }
  return parsed;
}

export async function parseExcelBuffer(buffer: ArrayBuffer): Promise<Question[]> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('File excel tidak memiliki sheet aktif.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  const parsed = parseRawRecords(jsonData);
  if (parsed.length === 0) {
    throw new Error('Tidak ada data soal valid yang ditemukan dalam file Excel.');
  }
  return parsed;
}
