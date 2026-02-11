'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, Calendar, ChevronDown, ChevronUp, Send, Eye, EyeOff, Mountain, Flag, CheckCircle, AlertCircle, Lock, LogOut, User, FileText, AlertTriangle, List, X, Download, Upload, Trash2, MessageCircle, Radio, Edit3, Pin } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Firebase konfigurasjon
const firebaseConfig = {
  apiKey: "AIzaSyDicPL3QYx7I9vQgTpOe0e9gqCxlv-aVbc",
  authDomain: "ol-tipping-2026.firebaseapp.com",
  projectId: "ol-tipping-2026",
  storageBucket: "ol-tipping-2026.firebasestorage.app",
  messagingSenderId: "647811500744",
  appId: "1:647811500744:web:9f160b6fa2ce0cde8df3fd",
  measurementId: "G-4H4236TCPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dynamisk lasting av SheetJS
let XLSX = null;
const loadXLSX = async () => {
  if (XLSX) return XLSX;
  return new Promise((resolve, reject) => {
    if (window.XLSX) {
      XLSX = window.XLSX;
      resolve(XLSX);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
      XLSX = window.XLSX;
      resolve(XLSX);
    };
    script.onerror = () => reject(new Error('Kunne ikke laste XLSX'));
    document.head.appendChild(script);
  });
};

// Funksjon for å generere og laste ned Excel-tippeskjema
async function downloadExcelTemplate() {
  const xlsx = await loadXLSX();
  const wb = xlsx.utils.book_new();
  
  // Data for tippeskjemaet
  const data = [
    ['🏔️ OL-TIPPESKJEMA 2026 - Milano-Cortina'],
    [],
    ['👤 DITT NAVN:', '', '', '⬅️ Fyll inn her (celle B3)'],
    [],
    ['INSTRUKSJONER:'],
    ['• Individuelle øvelser (IND): Fyll inn 5 utøvere i kolonne D-H'],
    ['• Lagøvelser (LAG): Fyll inn 3 nasjoner i kolonne D-F'],
    ['• Send ferdig utfylt skjema til admin før fristen'],
    [],
    ['DAG', 'ØVELSE', 'TYPE', '🥇 1. GULL', '🥈 2. SØLV', '🥉 3. BRONSE', '4.', '5.'],
  ];
  
  // Øvelser
  const program = [
    [1, 'Langrenn, 20 km skiathlon - kvinner', 'IND'],
    [1, 'Hopp, normal bakke - kvinner', 'IND'],
    [1, 'Alpint, utfor - menn', 'IND'],
    [1, 'Skøyter, 3000m - kvinner', 'IND'],
    [1, 'Snowboard, big air - menn', 'IND'],
    [2, 'Langrenn, 20 km skiathlon - menn', 'IND'],
    [2, 'Skiskyting, mixed stafett', 'LAG'],
    [2, 'Alpint, utfor - kvinner', 'IND'],
    [2, 'Skøyter, 5000m - menn', 'IND'],
    [3, 'Alpint, lagkombinasjon - menn', 'LAG'],
    [3, 'Hopp, normal bakke - menn', 'IND'],
    [4, 'Freeski, slopestyle - menn', 'IND'],
    [4, 'Alpint, lagkombinasjon - kvinner', 'LAG'],
    [4, 'Langrenn, sprint - kvinner', 'IND'],
    [4, 'Langrenn, sprint - menn', 'IND'],
    [4, 'Skiskyting, 20 km - menn', 'IND'],
    [4, 'Hopp, lagkonkurranse mixed', 'LAG'],
    [5, 'Alpint, super-G - menn', 'IND'],
    [5, 'Skiskyting, 15 km - kvinner', 'IND'],
    [5, 'Kombinert, normal bakke/10 km - menn', 'IND'],
    [6, 'Alpint, super-G - kvinner', 'IND'],
    [6, 'Langrenn, 10 km fri - kvinner', 'IND'],
    [6, 'Snowboard, slopestyle - menn', 'IND'],
    [7, 'Skiskyting, 10 km sprint - menn', 'IND'],
    [7, 'Langrenn, 10 km fri - menn', 'IND'],
    [7, 'Skøyter, 10000m - menn', 'IND'],
    [8, 'Alpint, storslalåm - menn', 'IND'],
    [8, 'Skiskyting, 7,5 km sprint - kvinner', 'IND'],
    [8, 'Langrenn, stafett - kvinner', 'LAG'],
    [8, 'Hopp, stor bakke - menn', 'IND'],
    [9, 'Alpint, storslalåm - kvinner', 'IND'],
    [9, 'Skiskyting, 12,5 km jaktstart - menn', 'IND'],
    [9, 'Skiskyting, 10 km jaktstart - kvinner', 'IND'],
    [9, 'Langrenn, stafett - menn', 'LAG'],
    [9, 'Hopp, stor bakke - kvinner', 'IND'],
    [10, 'Alpint, slalåm - menn', 'IND'],
    [10, 'Hopp, lagkonkurranse stor bakke - menn', 'LAG'],
    [10, 'Freeski, big air - menn', 'IND'],
    [11, 'Skiskyting, stafett - menn', 'LAG'],
    [12, 'Alpint, slalåm - kvinner', 'IND'],
    [12, 'Skiskyting, stafett - kvinner', 'LAG'],
    [12, 'Langrenn, lagsprint - kvinner', 'LAG'],
    [12, 'Langrenn, lagsprint - menn', 'LAG'],
    [13, 'Kombinert, stor bakke/10 km - menn', 'IND'],
    [13, 'Skiskyting, 15 km fellesstart - menn', 'IND'],
    [13, 'Skøyter, 1500m - menn', 'IND'],
    [13, 'Skøyter, 1500m - kvinner', 'IND'],
    [14, 'Kombinert, lagkonkurranse - menn', 'LAG'],
    [14, 'Skiskyting, 12,5 km fellesstart - kvinner', 'IND'],
    [14, 'Skøyter, lagtempo - menn', 'LAG'],
    [15, 'Langrenn, 50 km fellesstart - menn', 'IND'],
    [15, 'Curling, finale - menn', 'LAG'],
    [16, 'Langrenn, 50 km fellesstart - kvinner', 'IND'],
    [16, 'Curling, finale - kvinner', 'LAG'],
    [16, 'Ishockey, finale - menn', 'LAG'],
  ];
  
  program.forEach(([dag, øvelse, type]) => {
    data.push([`Dag ${dag}`, øvelse, type, '', '', '', '', '']);
  });
  
  // Norske gull nederst
  data.push([]);
  data.push(['🇳🇴 NORSKE GULL TOTALT:', '', '', '⬅️ Fyll inn tall her (celle B67)']);
  data.push(['Poeng: Eksakt 30p | Bommer med 1: 20p | Bommer med 2: 10p']);
  
  const ws = xlsx.utils.aoa_to_sheet(data);
  
  // Sett kolonnebredder
  ws['!cols'] = [
    { wch: 12 },  // DAG
    { wch: 42 },  // ØVELSE
    { wch: 8 },   // TYPE
    { wch: 20 },  // 1.
    { wch: 20 },  // 2.
    { wch: 20 },  // 3.
    { wch: 18 },  // 4.
    { wch: 18 },  // 5.
  ];
  
  xlsx.utils.book_append_sheet(wb, ws, 'Tippeskjema');
  xlsx.writeFile(wb, 'OL_Tippeskjema_2026.xlsx');
}

// Funksjon for å eksportere utfylte tips til Excel
async function downloadFilledExcel(navn, tips, gullTips) {
  const xlsx = await loadXLSX();
  const wb = xlsx.utils.book_new();
  
  // Data for tippeskjemaet
  const data = [
    ['🏔️ OL-TIPPESKJEMA 2026 - Milano-Cortina'],
    [],
    ['👤 DITT NAVN:', navn || '', '', '⬅️ Fyll inn her (celle B3)'],
    [],
    ['INSTRUKSJONER:'],
    ['• Individuelle øvelser (IND): Fyll inn 5 utøvere i kolonne D-H'],
    ['• Lagøvelser (LAG): Fyll inn 3 nasjoner i kolonne D-F'],
    ['• Send ferdig utfylt skjema til admin før fristen'],
    [],
    ['DAG', 'ØVELSE', 'TYPE', '🥇 1. GULL', '🥈 2. SØLV', '🥉 3. BRONSE', '4.', '5.'],
  ];
  
  // Øvelser med tips
  OL_PROGRAM.forEach((ø, idx) => {
    const øvelseTips = tips[idx] || [];
    data.push([
      `Dag ${ø.dag}`, 
      ø.øvelse, 
      ø.type === 'individuell' ? 'IND' : 'LAG',
      øvelseTips[0] || '',
      øvelseTips[1] || '',
      øvelseTips[2] || '',
      øvelseTips[3] || '',
      øvelseTips[4] || ''
    ]);
  });
  
  // Norske gull nederst
  data.push([]);
  data.push(['🇳🇴 NORSKE GULL TOTALT:', gullTips || '', '', '⬅️ Fyll inn tall her (celle B67)']);
  data.push(['Poeng: Eksakt 30p | Bommer med 1: 20p | Bommer med 2: 10p']);
  
  const ws = xlsx.utils.aoa_to_sheet(data);
  
  // Sett kolonnebredder
  ws['!cols'] = [
    { wch: 12 },  // DAG
    { wch: 42 },  // ØVELSE
    { wch: 8 },   // TYPE
    { wch: 20 },  // 1.
    { wch: 20 },  // 2.
    { wch: 20 },  // 3.
    { wch: 18 },  // 4.
    { wch: 18 },  // 5.
  ];
  
  xlsx.utils.book_append_sheet(wb, ws, 'Tippeskjema');
  const filnavn = navn ? `OL_Tips_${navn.replace(/\s+/g, '_')}.xlsx` : 'OL_Tippeskjema_2026_utfylt.xlsx';
  xlsx.writeFile(wb, filnavn);
}

// Funksjon for å parse opplastet Excel-fil
async function parseExcelFile(file, callback) {
  try {
    const xlsx = await loadXLSX();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      
        let navn = '';
        let gullTips = 0;
        const tips = {};
        let øvelseCounter = 0;
        
        // Parse data
        jsonData.forEach((row, rowIdx) => {
          if (!row || row.length === 0) return;
          
          const cell0 = String(row[0] || '').trim();
          const cell1 = String(row[1] || '').trim();
          
          // Finn navn i B3 eller C3 (rad 3, index 2)
          // Noen fyller inn i B3, andre i C3 - vi aksepterer begge
          if (rowIdx === 2) {
            const cell1 = String(row[1] || '').trim();
            const cell2 = String(row[2] || '').trim();
            
            const isPlaceholder = (val) => {
              if (!val) return true;
              return val.includes('▶') || val.includes('⬅') || 
                     val.includes('SKRIV') || val.includes('←') ||
                     val.includes('Fyll') || val.toUpperCase().includes('NAVN') ||
                     val.length === 0;
            };
            
            // Prøv B3 først, deretter C3
            if (cell1 && !isPlaceholder(cell1)) {
              navn = cell1;
            } else if (cell2 && !isPlaceholder(cell2)) {
              navn = cell2;
            }
          }
          
          // Øvelser starter fra rad 11/12 (etter header) - "Dag X" i kolonne A
          if (cell0.toLowerCase().startsWith('dag') && row[1] && !String(row[1]).toUpperCase().includes('ØVELSE')) {
            const øvelseNavn = String(row[1] || '').trim();
            const typeStr = String(row[2] || '').toUpperCase();
            
            if (øvelseNavn && øvelseCounter < 56) {
              const isLag = typeStr.includes('LAG');
              const numTips = isLag ? 3 : 5;
              tips[øvelseCounter] = [];
              
              // Tips er i kolonne D-H (index 3-7)
              for (let i = 0; i < numTips; i++) {
                const tipValue = row[3 + i] ? String(row[3 + i]).trim() : '';
                tips[øvelseCounter].push(tipValue);
              }
              // Fyll ut resten med tomme strenger
              while (tips[øvelseCounter].length < 5) {
                tips[øvelseCounter].push('');
              }
              
              øvelseCounter++;
            }
          }
          
          // Norske gull - i kolonne B eller C, samme rad som "NORSKE GULL"
          if (cell0.toUpperCase().includes('NORSKE GULL')) {
            const isPlaceholder = (val) => {
              if (val === undefined || val === null || val === '') return true;
              const strVal = String(val);
              return strVal.includes('▶') || strVal.includes('⬅') ||
                     strVal.includes('TALL') || strVal.includes('Fyll') ||
                     strVal.includes('←');
            };
            
            // Prøv B først, deretter C
            if (!isPlaceholder(row[1])) {
              gullTips = parseInt(row[1]) || 0;
            } else if (!isPlaceholder(row[2])) {
              gullTips = parseInt(row[2]) || 0;
            }
          }
        });
        
        callback({ success: true, navn, gullTips, tips, debug: { øvelseCounter } });
      } catch (err) {
        callback({ success: false, error: err.message });
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    callback({ success: false, error: 'Kunne ikke laste Excel-bibliotek: ' + err.message });
  }
}

// ============================================
// KONFIGURASJON
// ============================================
const ADMIN_PASSWORD = "OL2026Admin";

// ============================================
// KOMPLETT OL-PROGRAM 2026 (KORRIGERT og forenklet)
// Dag 1 = Lør 7. feb (første medaljer)
// ============================================
const OL_PROGRAM = [
  // DAG 1 - Lørdag 7. februar
  { dag: 1, dato: "Lør 7. feb", tid: "12:30", øvelse: "Langrenn, 20 km skiathlon - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 1, dato: "Lør 7. feb", tid: "12:00", øvelse: "Hopp, normal bakke - kvinner", type: "individuell", sport: "hopp" },
  { dag: 1, dato: "Lør 7. feb", tid: "11:00", øvelse: "Alpint, utfor - menn", type: "individuell", sport: "alpint" },
  { dag: 1, dato: "Lør 7. feb", tid: "15:00", øvelse: "Skøyter, 3000m - kvinner", type: "individuell", sport: "skøyter" },
  { dag: 1, dato: "Lør 7. feb", tid: "13:30", øvelse: "Snowboard, big air - menn", type: "individuell", sport: "snowboard" },
  
  // DAG 2 - Søndag 8. februar
  { dag: 2, dato: "Søn 8. feb", tid: "12:30", øvelse: "Langrenn, 20 km skiathlon - menn", type: "individuell", sport: "langrenn" },
  { dag: 2, dato: "Søn 8. feb", tid: "14:45", øvelse: "Skiskyting, mixed stafett", type: "lag", sport: "skiskyting" },
  { dag: 2, dato: "Søn 8. feb", tid: "11:00", øvelse: "Alpint, utfor - kvinner", type: "individuell", sport: "alpint" },
  { dag: 2, dato: "Søn 8. feb", tid: "16:00", øvelse: "Skøyter, 5000m - menn", type: "individuell", sport: "skøyter" },
  
  // DAG 3 - Mandag 9. februar
  { dag: 3, dato: "Man 9. feb", tid: "10:00", øvelse: "Alpint, lagkombinasjon - menn", type: "lag", sport: "alpint" },
  { dag: 3, dato: "Man 9. feb", tid: "18:30", øvelse: "Hopp, normal bakke - menn", type: "individuell", sport: "hopp" },
  { dag: 4, dato: "Tir 10. feb", tid: "12:00", øvelse: "Freeski, slopestyle - menn", type: "individuell", sport: "freeski" },
  
  // DAG 4 - Tirsdag 10. februar
  { dag: 4, dato: "Tir 10. feb", tid: "10:00", øvelse: "Alpint, lagkombinasjon - kvinner", type: "lag", sport: "alpint" },
  { dag: 4, dato: "Tir 10. feb", tid: "11:45", øvelse: "Langrenn, sprint - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 4, dato: "Tir 10. feb", tid: "11:45", øvelse: "Langrenn, sprint - menn", type: "individuell", sport: "langrenn" },
  { dag: 4, dato: "Tir 10. feb", tid: "14:30", øvelse: "Skiskyting, 20 km - menn", type: "individuell", sport: "skiskyting" },
  { dag: 4, dato: "Tir 10. feb", tid: "18:00", øvelse: "Hopp, lagkonkurranse mixed", type: "lag", sport: "hopp" },
  
  // DAG 5 - Onsdag 11. februar
  { dag: 5, dato: "Ons 11. feb", tid: "11:00", øvelse: "Alpint, super-G - menn", type: "individuell", sport: "alpint" },
  { dag: 5, dato: "Ons 11. feb", tid: "14:30", øvelse: "Skiskyting, 15 km - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 5, dato: "Ons 11. feb", tid: "10:00", øvelse: "Kombinert, normal bakke/10 km - menn", type: "individuell", sport: "kombinert" },
  
  // DAG 6 - Torsdag 12. februar
  { dag: 6, dato: "Tor 12. feb", tid: "11:00", øvelse: "Alpint, super-G - kvinner", type: "individuell", sport: "alpint" },
  { dag: 6, dato: "Tor 12. feb", tid: "13:00", øvelse: "Langrenn, 10 km fri - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 6, dato: "Tor 12. feb", tid: "13:00", øvelse: "Snowboard, slopestyle - menn", type: "individuell", sport: "snowboard" },
  
  // DAG 7 - Fredag 13. februar
  { dag: 7, dato: "Fre 13. feb", tid: "14:30", øvelse: "Skiskyting, 10 km sprint - menn", type: "individuell", sport: "skiskyting" },
  { dag: 7, dato: "Fre 13. feb", tid: "11:45", øvelse: "Langrenn, 10 km fri - menn", type: "individuell", sport: "langrenn" },
  { dag: 7, dato: "Fre 13. feb", tid: "16:00", øvelse: "Skøyter, 10000m - menn", type: "individuell", sport: "skøyter" },
  
  // DAG 8 - Lørdag 14. februar
  { dag: 8, dato: "Lør 14. feb", tid: "09:30", øvelse: "Alpint, storslalåm - menn", type: "individuell", sport: "alpint" },
  { dag: 8, dato: "Lør 14. feb", tid: "14:30", øvelse: "Skiskyting, 7,5 km sprint - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 8, dato: "Lør 14. feb", tid: "12:00", øvelse: "Langrenn, stafett - kvinner", type: "lag", sport: "langrenn" },
  { dag: 8, dato: "Lør 14. feb", tid: "18:00", øvelse: "Hopp, stor bakke - menn", type: "individuell", sport: "hopp" },
  
  // DAG 9 - Søndag 15. februar
  { dag: 9, dato: "Søn 15. feb", tid: "09:30", øvelse: "Alpint, storslalåm - kvinner", type: "individuell", sport: "alpint" },
  { dag: 9, dato: "Søn 15. feb", tid: "14:30", øvelse: "Skiskyting, 12,5 km jaktstart - menn", type: "individuell", sport: "skiskyting" },
  { dag: 9, dato: "Søn 15. feb", tid: "17:00", øvelse: "Skiskyting, 10 km jaktstart - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 9, dato: "Søn 15. feb", tid: "12:00", øvelse: "Langrenn, stafett - menn", type: "lag", sport: "langrenn" },
  { dag: 9, dato: "Søn 15. feb", tid: "18:30", øvelse: "Hopp, stor bakke - kvinner", type: "individuell", sport: "hopp" },
  
  // DAG 10 - Mandag 16. februar
  { dag: 10, dato: "Man 16. feb", tid: "10:00", øvelse: "Alpint, slalåm - menn", type: "individuell", sport: "alpint" },
  { dag: 10, dato: "Man 16. feb", tid: "18:00", øvelse: "Hopp, lagkonkurranse stor bakke - menn", type: "lag", sport: "hopp" },
  { dag: 10, dato: "Man 16. feb", tid: "12:00", øvelse: "Freeski, big air - menn", type: "individuell", sport: "freeski" },
  
  // DAG 11 - Tirsdag 17. februar
  { dag: 11, dato: "Tir 17. feb", tid: "14:30", øvelse: "Skiskyting, stafett - menn", type: "lag", sport: "skiskyting" },
  
  // DAG 12 - Onsdag 18. februar
  { dag: 12, dato: "Ons 18. feb", tid: "10:00", øvelse: "Alpint, slalåm - kvinner", type: "individuell", sport: "alpint" },
  { dag: 12, dato: "Ons 18. feb", tid: "14:30", øvelse: "Skiskyting, stafett - kvinner", type: "lag", sport: "skiskyting" },
  { dag: 12, dato: "Ons 18. feb", tid: "11:45", øvelse: "Langrenn, lagsprint - kvinner", type: "lag", sport: "langrenn" },
  { dag: 12, dato: "Ons 18. feb", tid: "11:45", øvelse: "Langrenn, lagsprint - menn", type: "lag", sport: "langrenn" },
  
  // DAG 13 - Torsdag 19. februar
  { dag: 13, dato: "Tor 19. feb", tid: "10:00", øvelse: "Kombinert, stor bakke/10 km - menn", type: "individuell", sport: "kombinert" },
  { dag: 13, dato: "Tor 19. feb", tid: "14:30", øvelse: "Skiskyting, 15 km fellesstart - menn", type: "individuell", sport: "skiskyting" },
  { dag: 13, dato: "Tor 19. feb", tid: "15:00", øvelse: "Skøyter, 1500m - menn", type: "individuell", sport: "skøyter" },
  { dag: 13, dato: "Tor 19. feb", tid: "17:30", øvelse: "Skøyter, 1500m - kvinner", type: "individuell", sport: "skøyter" },
  
  // DAG 14 - Fredag 20. februar
  { dag: 14, dato: "Fre 20. feb", tid: "10:00", øvelse: "Kombinert, lagkonkurranse - menn", type: "lag", sport: "kombinert" },
  { dag: 14, dato: "Fre 20. feb", tid: "14:30", øvelse: "Skiskyting, 12,5 km fellesstart - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 14, dato: "Fre 20. feb", tid: "16:00", øvelse: "Skøyter, lagtempo - menn", type: "lag", sport: "skøyter" },
  
  // DAG 15 - Lørdag 21. februar
  { dag: 15, dato: "Lør 21. feb", tid: "11:00", øvelse: "Langrenn, 50 km fellesstart - menn", type: "individuell", sport: "langrenn" },
  { dag: 15, dato: "Lør 21. feb", tid: "14:00", øvelse: "Curling, finale - menn", type: "lag", sport: "curling" },
  
  // DAG 16 - Søndag 22. februar
  { dag: 16, dato: "Søn 22. feb", tid: "10:00", øvelse: "Langrenn, 50 km fellesstart - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 16, dato: "Søn 22. feb", tid: "09:00", øvelse: "Curling, finale - kvinner", type: "lag", sport: "curling" },
  { dag: 16, dato: "Søn 22. feb", tid: "13:00", øvelse: "Ishockey, finale - menn", type: "lag", sport: "ishockey" },
];

// ============================================
// UTØVERLISTE (kan utvides)
// ============================================
const UTØVERE = {
  langrenn: [
    // Norge - menn
    "Johannes Høsflot Klæbo", "Pål Golberg", "Hans Christer Holund", "Simen Hegstad Krüger",
    "Martin Løwstrøm Nyenget", "Harald Østberg Amundsen", "Even Northug", "Didrik Tønseth",
    "Erik Valnes", "Ansgar Evensen", "Martin Kirkeberg Mørk", "Einar Hedegart",
    "Jan Thomas Jenssen", "Mattis Stenshagen", "Iver Tildheim Andersen", "Lars Heggen",
    "Oskar Opstad Vike", "Andreas Fjorden Ree", "Thomas Helland Larsen", "Vemund Ravnsborg Gurigard",
    // Norge - kvinner
    "Therese Johaug", "Heidi Weng", "Ingvild Flugstad Østberg", "Tiril Udnes Weng",
    "Anne Kjersti Kalvå", "Astrid Øyre Slind", "Helene Marie Fossesholm", "Mathilde Myhrvold",
    "Kristine Stavås Skistad", "Lotta Udnes Weng", "Silje Theodorsen", "Karoline Simpson-Larsen",
    "Milla Grosberghaugen Andreassen", "Nora Sanness",
    // Sverige
    "Frida Karlsson", "Ebba Andersson", "Jonna Sundling", "Maja Dahlqvist", "Linn Svahn",
    "Calle Halfvarsson", "William Poromaa", "Edvin Anger", "Moa Ilar", "Emma Ribom",
    "Jens Burman", "Gustaf Berglund", "Johanna Hagström", "Johan Häggström", "Emil Danielsson",
    // Finland
    "Iivo Niskanen", "Kerttu Niskanen", "Krista Pärmäkoski", "Jasmi Joensuu", "Arsi Ruuskanen",
    "Johanna Matintalo", "Ristomatti Hakola", "Lauri Vuorinen",
    // USA
    "Jessie Diggins", "Gus Schumacher", "Rosie Brennan", "Julia Kern", "Ben Ogden",
    // Italia
    "Federico Pellegrino", "Francesco De Fabiani", "Simone Mocellini", "Elia Barp", "Paolo Ventura",
    // Frankrike
    "Renaud Jay", "Hugo Lapalus", "Lucas Chanavat", "Delphine Claudel", "Richard Jouve",
    // Sveits
    "Nadine Fähndrich", "Alina Meier", "Anja Weber", "Théo Schely", "Valerio Grond",
    // Tyskland
    "Victoria Carl", "Katharina Hennig", "Coletta Rydzek", "Friedrich Moch", "Albert Kuchler",
    // Østerrike
    "Teresa Stadlober", "Mika Vermeulen", "Michael Föttinger",
    // Andre
    "Alexander Bolshunov", "Natalia Nepryaeva", "Veronika Stepanova",
    "Yuto Miyazawa", "Ge Chunyu", "Ryoma Kimata", "Kira Kimura",
    "Alison Mackie", "Iris De Martin Pinter", "Leonie Perry",
    "Savelii Korostelev", "Martino Carollo", "Jiri Tuz",
  ],
  skiskyting: [
    // Norge - menn
    "Johannes Thingnes Bø", "Tarjei Bø", "Sturla Holm Lægreid", "Vetle Sjåstad Christiansen",
    "Filip Fjeld Andersen", "Endre Strømsheim", "Sivert Guttorm Bakken", "Johan-Olav Botn",
    "Martin Uldal", "Isak Frey", "Sverre Dahlen Aspenes", "Martin Nevland", "Vetle Paulsen",
    // Norge - kvinner
    "Ingrid Landmark Tandrevold", "Tiril Eckhoff", "Marte Olsbu Røiseland", "Karoline Knotten",
    "Juni Arnekleiv", "Ida Lien", "Maren Kirkeeide", "Ragnhild Femsteinevik",
    // Frankrike
    "Quentin Fillon Maillet", "Emilien Jacquelin", "Fabien Claude", "Éric Perrot",
    "Oscar Lombardot", "Emilien Claude", "Antonin Guigonnat",
    "Julia Simon", "Lou Jeanmonnot", "Justine Braisaz-Bouchet", "Sophie Chauveau",
    // Sverige
    "Sebastian Samuelsson", "Martin Ponsiluoma", "Viktor Brandt", "Jesper Nelin", "Malte Stefansson",
    "Hanna Öberg", "Elvira Öberg", "Anna Magnusson", "Ella Halvarsson",
    // Tyskland
    "Benedikt Doll", "Philipp Nawrath", "Philipp Horn", "Justus Strelow", "Johannes Kühn",
    "Roman Rees", "David Zobel", "Lucas Fratzscher", "Danilo Riethmueller", "Simon Kaiser",
    "Franziska Preuss", "Vanessa Voigt", "Selina Grotian", "Sophia Schneider", "Janina Hettich-Walz",
    // Italia
    "Tommaso Giacomel", "Lukas Hofer", "Didier Bionaz", "Patrick Braunhofer", "Nicola Romanin", "Elia Zeni",
    "Dorothea Wierer", "Lisa Vittozzi", "Hannah Auchentaller", "Samuela Comola",
    // USA
    "Campbell Wright", "Maxime Germain", "Sean Doherty", "Paul Schommer",
    // Sveits
    "Joscha Burkhalter", "Sebastian Stalder", "Niklas Hartweg",
    // Finland
    "Tero Seppälä", "Olli Hiidensalo", "Tuomas Harjula", "Otto Invenius", "Arttu Heikkinen",
    // Østerrike
    "Simon Eder", "Patrick Jakob", "Dominic Unterweger", "Lisa Theresa Hauser", "Anna Gandler",
    // Tsjekkia
    "Vitezslav Hornig", "Michal Krčmář", "Marketa Davidova", "Jessica Jislová",
    // Andre
    "Jakov Fak", "Miha Dovžan", "Anton Vidmar", "Lovro Planko",
    "Vytautas Strolia", "Dmytro Pidruchnyi", "Vitalii Mandzyn",
    "Jan Gunka", "Konrad Badacz", "Renars Birkentals", "Andrejs Rastorgujevs",
    "Paulina Fialkova", "Suvi Minkkinen", "Karoline Simpson-Larsen",
  ],
  hopp: [
    // Norge - menn
    "Halvor Egner Granerud", "Johann André Forfang", "Marius Lindvik", "Daniel-André Tande",
    "Robert Johansson", "Kristoffer Eriksen Sundal", "Benjamin Østvold", "Anders Fannemel",
    // Norge - kvinner
    "Silje Opseth", "Eirin Maria Kvandal", "Anna Odine Strøm", "Thea Minyan Bjørseth",
    // Østerrike
    "Stefan Kraft", "Jan Hörl", "Daniel Tschofenig", "Michael Hayböck", "Manuel Fettner",
    "Stefan Babinsky", "Maximilian Ortner", "Felix Trunz",
    "Eva Pinkelnig", "Lisa Eder", "Jacqueline Seifriedsberger",
    // Tyskland
    "Andreas Wellinger", "Pius Paschke", "Karl Geiger", "Stephan Leyhe", "Markus Eisenbichler",
    "Philipp Raimund", "Felix Hoffmann",
    "Katharina Althaus", "Selina Freitag", "Juliane Seyfarth", "Agnes Reisch",
    // Slovenia
    "Anže Lanišek", "Timi Zajc", "Domen Prevc", "Peter Prevc", "Žiga Jelar", "Lovro Kos",
    "Nika Prevc", "Ema Klinec", "Urša Bogataj",
    // Japan
    "Ryoyu Kobayashi", "Naoki Nakamura", "Junshiro Kobayashi", "Ren Nikaido", "Keiichi Sato",
    "Nozomi Maruyama", "Sara Takanashi", "Yuki Ito",
    // Sveits
    "Gregor Deschwanden", "Killian Peier", "Simon Ammann",
    // Polen
    "Kamil Stoch", "Dawid Kubacki", "Piotr Żyła", "Aleksander Zniszczoł", "Paweł Wąsek",
    // Kina
    "Zeng Ping",
    // Andre
    "Johann Pedersen", "Tate Frantz", "Artti Aigro",
  ],
  alpint: [
    // Norge
    "Henrik Kristoffersen", "Atle Lie McGrath", "Lucas Pinheiro Braathen", "Aleksander Aamodt Kilde",
    "Timon Haugan", "Rasmus Windingstad", "Alexander Steen Olsen", "Adrian Smiseth Sejersted",
    "Ragnhild Mowinckel", "Kajsa Vickhoff Lie", "Mina Fürst Holtmann", "Thea Louise Stjernesund",
    // Sveits
    "Marco Odermatt", "Loïc Meillard", "Daniel Yule", "Franjo von Allmen", "Thomas Tumler",
    "Justin Murisier", "Stefan Rogentin", "Alexis Monney", "Gino Caviezel",
    "Lara Gut-Behrami", "Michelle Gisin", "Wendy Holdener", "Corinne Suter", "Camille Rast",
    "Joana Hählen", "Priska Ming-Nufer", "Simone Wild",
    // Østerrike
    "Manuel Feller", "Marco Schwarz", "Vincent Kriechmayr", "Raphael Haaser", "Stefan Babinsky",
    "Lukas Feurstein", "Johannes Strolz", "Patrick Feurstein",
    "Cornelia Hütter", "Katharina Liensberger", "Julia Scheib", "Nina Ortlieb", "Christina Ager",
    "Katharina Truppe", "Ricarda Haaser", "Mirjam Puchner", "Stephanie Venier",
    // Frankrike
    "Clément Noël", "Alexis Pinturault", "Cyprien Sarrazin", "Nils Allegre", "Paco Rassat",
    "Tessa Worley", "Romane Miradoli", "Clara Direz",
    // Italia
    "Sofia Goggia", "Federica Brignone", "Marta Bassino", "Dominik Paris", "Giovanni Franzoni",
    "Nicol Delago", "Roberta Melesi", "Elena Curtoni", "Laura Pirovano", "Alex Vinatzer",
    // Tyskland
    "Linus Strasser", "Alexander Schmid", "Jonas Stockinger",
    "Kira Weidle-Winkelmann", "Emma Aicher", "Lena Dürr",
    // USA
    "Mikaela Shiffrin", "Lindsey Vonn", "Breezy Johnson", "Lauren Macuga", "Paula Moltzan",
    "Ryan Cochran-Siegle", "River Radamus", "Tommy Ford", "Luke Winters",
    // Kroatia
    "Zrinka Ljutic", "Leona Popovic", "Filip Zubcic", "Samuel Kolega",
    // Sverige
    "Sara Hector", "Anna Swenn-Larsson", "Hanna Aronsson Elfman",
    // Andre
    "Petra Vlhová", "Lara Colturi", "Maryna Gasienica-Daniel", "Alice Robinson",
    "Marcel Hirscher", "Ramon Zenhäusern", "Eduard Hallberg",
    "Albert Popov", "Tormis Laine", "Ester Ledecká",
  ],
  kombinert: [
    // Norge
    "Jarl Magnus Riiber", "Jens Lurås Oftebro", "Einar Lurås Oftebro", "Espen Bjørnstad", "Jørgen Graabak",
    "Ida Marie Hagen", "Gyda Westvold Hansen", "Mari Leinan Lund",
    // Tyskland
    "Vinzenz Geiger", "Johannes Rydzek", "Julian Schmid", "Terence Weber", "Eric Frenzel",
    // Østerrike
    "Johannes Lamparter", "Franz-Josef Rehrl", "Thomas Rettenegger", "Stefan Rettenegger", "Mario Seidl",
    // Andre
    "Akito Watabe", "Ryota Yamamoto", "Mattéo Baud", "Ilkka Herola", "Eero Hirvonen",
    "Campbell Wright", "Matěj Švancer", "Laurent Muhlethaler",
  ],
  skøyter: [
    // Norge
    "Hallgeir Engebråten", "Sverre Lunde Pedersen", "Peder Kongshaug", "Allan Dahl Johansson",
    "Ragne Wiklund", "Sofie Karoline Haugen", "Ida Njåtun", "Julie Nistad Samsonsen",
    "Sander Eitrem", "Bjørn Magnussen", "Henrik Fagerli Rukke",
    // Nederland
    "Patrick Roest", "Jorrit Bergsma", "Kjeld Nuis", "Thomas Krol", "Tim Prins",
    "Irene Schouten", "Antoinette de Jong", "Antoinette Rijpma-de Jong", "Jutta Leerdam", "Joy Beune",
    "Femke Kok", "Jenning de Boo", "Marijke Groenewoud", "Merijn Scheperkamp",
    // USA
    "Jordan Stolz", "Erin Jackson", "Brittany Bowe", "Kimi Goetz",
    // Japan/Asia
    "Nao Kodaira", "Miho Takagi", "Nana Takagi", "Ning Zhongyan", "Gao Tingyu",
    // Italia
    "Davide Ghiotto", "Andrea Giovannini", "Michele Malfatti", "Francesca Lollobrigida",
    // Tsjekkia
    "Martina Sáblíková", "Metoděj Jílek",
    // Canada
    "Laurent Dubreuil", "Connor Howe", "Graeme Fish",
    // Belgia
    "Bart Swings",
    // Andre
    "Timothy Loubineaud", "Zhongyan Ning", "Min Sun Kim",
  ],
  freeski: [
    // Norge
    "Birk Ruud", "Ferdinand Dahl", "Tormod Frostad", "Sebastian Schjerve",
    // USA
    "Alex Hall", "Nick Goepper", "Mac Forehand", "Colby Stevenson", "Konnor Ralph",
    // Andre
    "Nico Porteous", "Aaron Blunck", "David Wise",
    "Andri Ragettli", "Fabian Bösch", "Henry Sildaru", "Matěj Švancer", "Martin Nordqvist",
    "Eileen Gu", "Kelly Sildaru", "Mathilde Gremaud",
  ],
  snowboard: [
    // Norge
    "Marcus Kleveland", "Mons Røisland", "Fridtjof Sæther Tischendorf", "Markus Olimstad",
    // Canada
    "Max Parrot", "Mark McMorris", "Darcy Sharpe", "Laurie Blouin",
    // Japan
    "Su Yiming", "Takeru Otsuka", "Yuto Totsuka", "Ayumu Hirano", "Ruka Hirano",
    "Yuto Miyamura", "Ryoma Kimata", "Kokomo Murase", "Mitsuki Ono",
    // Kina
    "Ge Chunyu", "Kira Kimura",
    // USA
    "Red Gerard", "Dusty Henricksen", "Sean FitzSimons", "Chris Corning", "Julia Marino",
    // Finland
    "Rene Rinnekangas", "Enni Rukajärvi",
    // Østerrike
    "Anna Gasser",
    // New Zealand
    "Zoi Sadowski-Synnott", "Tiarn Collins",
    // Australia
    "Tess Coady", "Valentino Guseli",
    // Andre
    "Sven Thorgren", "Nicola Liviero", "Jonas Boesiger",
  ],
  curling: [
    "Norge", "Sverige", "Sveits", "Canada", "Storbritannia", "USA", "Italia",
    "Skottland", "Japan", "Kina", "Danmark", "Sør-Korea", "Tyskland", "Finland",
    "Nederland", "Tsjekkia",
  ],
  ishockey: [
    "Canada", "USA", "Sverige", "Finland", "Tsjekkia", "Sveits", "Tyskland",
    "Slovakia", "Latvia", "Norge", "Danmark", "Frankrike", "Østerrike",
  ],
};

// Alle nasjoner for lagkonkurranser
const NASJONER = [
  "Norge", "Sverige", "Finland", "Russland", "Tyskland", "Østerrike", "Sveits",
  "Frankrike", "Italia", "USA", "Canada", "Japan", "Kina", "Slovenia", "Polen",
  "Tsjekkia", "Slovakia", "Storbritannia", "Nederland", "Sør-Korea", "Danmark",
  "Estland", "Latvia", "Litauen", "Ukraina", "Hviterussland", "Australia",
];

// Mapping fra engelske/alternative nasjonsnavn til norske
const NASJONS_ALIAS = {
  "norway": "Norge", "nor": "Norge",
  "sweden": "Sverige", "swe": "Sverige",
  "finland": "Finland", "fin": "Finland",
  "russia": "Russland", "rus": "Russland",
  "germany": "Tyskland", "ger": "Tyskland",
  "austria": "Østerrike", "aut": "Østerrike",
  "switzerland": "Sveits", "sui": "Sveits", "swiss": "Sveits",
  "france": "Frankrike", "fra": "Frankrike",
  "italy": "Italia", "ita": "Italia",
  "united states": "USA", "america": "USA",
  "canada": "Canada", "can": "Canada",
  "japan": "Japan", "jpn": "Japan",
  "china": "Kina", "chn": "Kina",
  "slovenia": "Slovenia", "slo": "Slovenia",
  "poland": "Polen", "pol": "Polen",
  "czech republic": "Tsjekkia", "czechia": "Tsjekkia", "cze": "Tsjekkia",
  "slovakia": "Slovakia", "svk": "Slovakia",
  "great britain": "Storbritannia", "uk": "Storbritannia", "gbr": "Storbritannia", "united kingdom": "Storbritannia",
  "netherlands": "Nederland", "ned": "Nederland", "holland": "Nederland",
  "south korea": "Sør-Korea", "korea": "Sør-Korea", "kor": "Sør-Korea",
  "denmark": "Danmark", "den": "Danmark",
  "estonia": "Estland", "est": "Estland",
  "latvia": "Latvia", "lat": "Latvia",
  "lithuania": "Litauen", "ltu": "Litauen",
  "ukraine": "Ukraina", "ukr": "Ukraina",
  "belarus": "Hviterussland", "blr": "Hviterussland",
  "australia": "Australia", "aus": "Australia",
};

const SPORT_COLORS = {
  langrenn: { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-300' },
  skiskyting: { bg: 'bg-red-600', light: 'bg-red-50', border: 'border-red-300' },
  hopp: { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-300' },
  alpint: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-300' },
  kombinert: { bg: 'bg-orange-600', light: 'bg-orange-50', border: 'border-orange-300' },
  skøyter: { bg: 'bg-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-300' },
  freeski: { bg: 'bg-pink-600', light: 'bg-pink-50', border: 'border-pink-300' },
  snowboard: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-300' },
  curling: { bg: 'bg-yellow-600', light: 'bg-yellow-50', border: 'border-yellow-300' },
  ishockey: { bg: 'bg-slate-600', light: 'bg-slate-100', border: 'border-slate-300' },
};

// Fuzzy matching
function levenshteinDistance(str1, str2) {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;
  const matrix = [];
  for (let i = 0; i <= s2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      matrix[i][j] = s2[i-1] === s1[j-1] 
        ? matrix[i-1][j-1] 
        : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[s2.length][s1.length];
}

// Normaliser navn for bedre matching (ø→o, æ→ae, é→e, osv)
function normalizeForMatch(str) {
  return str.toLowerCase().trim()
    .replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/å/g, 'a')
    .replace(/ö/g, 'o').replace(/ä/g, 'a').replace(/ü/g, 'u')
    .replace(/é|è|ê|ë/g, 'e').replace(/á|à|â/g, 'a').replace(/í|ì|î/g, 'i')
    .replace(/ó|ò|ô/g, 'o').replace(/ú|ù|û/g, 'u').replace(/ß/g, 'ss')
    .replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
}

function fuzzyMatch(name1, name2) {
  const s1 = name1.toLowerCase().trim();
  const s2 = name2.toLowerCase().trim();
  
  // Eksakt match
  if (s1 === s2) return { match: true, score: 1 };
  
  // Match med normaliserte tegn (Klæbo = Klaebo = Klabo)
  const n1 = normalizeForMatch(name1);
  const n2 = normalizeForMatch(name2);
  if (n1 === n2) return { match: true, score: 0.98 };
  
  // En inneholder den andre - men vær strengere på korte strenger
  if (s1.length > 10 && s2.length > 10) {
    if (s1.includes(s2) || s2.includes(s1)) return { match: true, score: 0.9 };
  }
  if (n1.length > 10 && n2.length > 10) {
    if (n1.includes(n2) || n2.includes(n1)) return { match: true, score: 0.88 };
  }
  
  // Etternavn-match (Klæbo matcher Johannes Høsflot Klæbo)
  const parts1 = s1.split(' ');
  const parts2 = s2.split(' ');
  const lastName1 = parts1[parts1.length - 1];
  const lastName2 = parts2[parts2.length - 1];
  const firstName1 = parts1[0] || '';
  const firstName2 = parts2[0] || '';
  
  // Sjekk for reverserte navn (Su Yiming vs Yiming Su)
  const sorted1 = [...parts1].sort().join(' ');
  const sorted2 = [...parts2].sort().join(' ');
  if (sorted1 === sorted2) return { match: true, score: 0.95 };
  
  // Normalisert versjon av reversert
  const normParts1 = n1.split(' ').sort().join(' ');
  const normParts2 = n2.split(' ').sort().join(' ');
  if (normParts1 === normParts2) return { match: true, score: 0.93 };
  
  // NYTT: Levenshtein på sorterte navn (fanger "Yilming Su" vs "Su Yiming")
  const sortedDistance = levenshteinDistance(normParts1, normParts2);
  const sortedSimilarity = 1 - (sortedDistance / Math.max(normParts1.length, normParts2.length));
  if (sortedSimilarity >= 0.85) return { match: true, score: sortedSimilarity * 0.95 };
  
  // Hvis ett av navnene er bare etternavn OG det er et unikt etternavn
  // (ikke søsken-etternavn som Oftebro, Bø, Tandrevold, etc.)
  const søskenEtternavn = ['oftebro', 'luras oftebro', 'lurås oftebro', 'bø', 'thingnes bø', 'tandrevold', 'landmark tandrevold', 'rettenegger', 'takagi', 'prevc', 'kramer', 'weng', 'udnes weng'];
  const normLastName1 = normalizeForMatch(lastName1);
  const normLastName2 = normalizeForMatch(lastName2);
  // Sjekk om etternavnet (eller hele navnet minus fornavn) er et søsken-etternavn
  const fullLastName1 = parts1.slice(1).join(' ').toLowerCase();
  const fullLastName2 = parts2.slice(1).join(' ').toLowerCase();
  const erSøskenEtternavn = søskenEtternavn.some(s => 
    normLastName1.includes(s) || normLastName2.includes(s) ||
    normalizeForMatch(fullLastName1).includes(s) || normalizeForMatch(fullLastName2).includes(s)
  );
  
  // VIKTIG: Hvis begge har fulle navn (fornavn + etternavn) og er søsken, IKKE match med mindre fornavn er likt
  if (erSøskenEtternavn && parts1.length > 1 && parts2.length > 1) {
    // Begge har fulle navn - sjekk om fornavn er likt
    if (firstName1.toLowerCase() !== firstName2.toLowerCase() && 
        normalizeForMatch(firstName1) !== normalizeForMatch(firstName2)) {
      // Forskjellige fornavn på søsken = IKKE samme person
      return { match: false, score: 0 };
    }
  }
  
  if (parts1.length === 1 && lastName1.length > 2 && !erSøskenEtternavn) {
    if (lastName1 === lastName2) return { match: true, score: 0.92 };
    if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2)) return { match: true, score: 0.90 };
  }
  if (parts2.length === 1 && lastName2.length > 2 && !erSøskenEtternavn) {
    if (lastName1 === lastName2) return { match: true, score: 0.92 };
    if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2)) return { match: true, score: 0.90 };
  }
  
  // Generell etternavn-match - MÅ ha matchende fornavn-initial for søsken
  if (lastName1 === lastName2 && lastName1.length > 3) {
    if (erSøskenEtternavn) {
      // For søsken: krev at fornavn starter likt
      if (firstName1[0]?.toLowerCase() === firstName2[0]?.toLowerCase()) {
        return { match: true, score: 0.85 };
      }
      // Ellers ingen match bare på etternavn
    } else {
      return { match: true, score: 0.85 };
    }
  }
  if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2) && lastName1.length > 3 && !erSøskenEtternavn) {
    return { match: true, score: 0.83 };
  }
  
  // Levenshtein distance for skrivefeil
  const distance = levenshteinDistance(n1, n2);
  const similarity = 1 - (distance / Math.max(n1.length, n2.length));
  
  // Litt lavere terskel (65%) for å fange flere skrivefeil
  return { match: similarity >= 0.65, score: similarity };
}

// Normaliser lag-navn: "Sveits" og "Sveits 1" behandles likt
function normalizeTeamName(name) {
  if (!name) return { base: '', num: null };
  const trimmed = name.trim();
  // Match "Sveits 1", "Sveits 2", "Norge I", "Norge II" etc.
  const match = trimmed.match(/^(.+?)\s*([1-3IViv]+)?$/);
  if (match) {
    const base = match[1].trim();
    let num = match[2];
    // Konverter romertall
    if (num) {
      num = num.toUpperCase();
      if (num === 'I' || num === '1') num = '1';
      else if (num === 'II' || num === '2') num = '2';
      else if (num === 'III' || num === '3') num = '3';
      else num = null;
    }
    return { base, num };
  }
  return { base: trimmed, num: null };
}

function findBestMatch(searchName, resultsList) {
  if (!searchName) return { match: null, score: 0, index: -1 };
  
  // Normaliser søkenavnet (håndter lag-numre)
  const { base: searchBase, num: searchNum } = normalizeTeamName(searchName);
  
  // Først sjekk om søkenavnet er et kjent nasjons-alias
  const normalizedSearch = searchBase.toLowerCase();
  const mappedNation = NASJONS_ALIAS[normalizedSearch];
  
  // Hvis vi fant en mapping, bruk det norske navnet
  const searchFor = mappedNation || searchBase;
  
  let best = { match: null, score: 0, index: -1 };
  resultsList.forEach((name, idx) => {
    if (!name) return;
    
    // Normaliser resultatet (håndter lag-numre)
    const { base: resultBase, num: resultNum } = normalizeTeamName(name);
    
    // Sjekk også om resultatet er et alias
    const normalizedResult = resultBase.toLowerCase();
    const mappedResult = NASJONS_ALIAS[normalizedResult] || resultBase;
    
    // Sjekk lag-nummer match
    // - Hvis søk har nummer: må matche eksakt
    // - Hvis søk IKKE har nummer: matcher "1" eller ingen nummer
    // - Hvis resultat IKKE har nummer: matcher søk uten nummer eller med "1"
    let numMatch = true;
    if (searchNum && resultNum && searchNum !== resultNum) {
      numMatch = false; // Begge har nummer, men forskjellige
    } else if (searchNum && searchNum !== '1' && !resultNum) {
      numMatch = false; // Søker etter lag 2/3, men resultat har ikke nummer
    } else if (!searchNum && resultNum && resultNum !== '1') {
      numMatch = false; // Søker uten nummer, men resultat er lag 2/3
    }
    
    if (!numMatch) return;
    
    // Sammenlign base-navn
    const { match, score } = fuzzyMatch(searchFor, mappedResult);
    if (match && score > best.score) best = { match: name, score, index: idx };
    
    // Prøv også direkte match med original base
    const { match: match2, score: score2 } = fuzzyMatch(searchFor, resultBase);
    if (match2 && score2 > best.score) best = { match: name, score: score2, index: idx };
  });
  return best;
}

// Sjekk om et navn er i den kjente listen
function isKnownName(name, sport, type) {
  if (!name || !name.trim()) return true;
  const allKnown = type === 'lag' 
    ? [...NASJONER, ...(UTØVERE.curling || []), ...(UTØVERE.ishockey || [])]
    : [...(UTØVERE[sport] || []), ...NASJONER];
  return allKnown.some(known => fuzzyMatch(name, known).match);
}

// Optimalisert resultat-input for admin (debounced for ytelse)
const ResultatInput = React.memo(function ResultatInput({ value, onChange, suggestions, placeholder, className }) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef(null);
  const debounceRef = useRef(null);

  // Sync fra parent når value endres eksternt
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue && localValue.length >= 2) {
      const matches = suggestions.filter(s => s.toLowerCase().includes(localValue.toLowerCase())).slice(0, 6);
      setFiltered(matches);
      setIsOpen(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setFiltered([]);
      setIsOpen(false);
    }
  }, [localValue, suggestions]);

  useEffect(() => {
    const handleClick = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (newValue) => {
    setLocalValue(newValue);
    // Debounce oppdatering til parent
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const selectItem = (item) => {
    setLocalValue(item);
    onChange(item); // Umiddelbar oppdatering ved valg
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectItem(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex-1" ref={ref}>
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => filtered.length > 0 && setIsOpen(true)}
        onBlur={() => {
          // Sikre at parent får siste verdi ved blur
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            onChange(localValue);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((item, i) => (
            <button key={item} type="button" onMouseDown={() => selectItem(item)} className={`w-full text-left px-3 py-2 text-sm ${i === selectedIndex ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-700'}`}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// Optimalisert chat-input som ikke trigger re-render av hele appen
const ChatInput = React.memo(function ChatInput({ onSend, placeholder }) {
  const [localValue, setLocalValue] = useState('');
  
  const handleSend = () => {
    if (localValue.trim()) {
      onSend(localValue.trim());
      setLocalValue('');
    }
  };
  
  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={placeholder || "Skriv melding... (Shift+Enter for linjeskift)"}
        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white resize-none min-h-[60px] max-h-[120px]"
        rows={2}
      />
      <button 
        onClick={handleSend} 
        disabled={!localValue.trim()} 
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white rounded-lg h-[60px]"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
});

// Autocomplete
function AutocompleteInput({ value, onChange, suggestions, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value && value.length >= 2) {
      const matches = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 6);
      setFiltered(matches);
      setIsOpen(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setFiltered([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClick = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      onChange(filtered[selectedIndex]);
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const selectItem = (item) => {
    onChange(item);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative flex-1" ref={ref}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => filtered.length > 0 && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((s, i) => (
            <div 
              key={i}
              onMouseDown={(e) => {
                e.preventDefault(); // Forhindrer blur på input
                selectItem(s);
              }}
              className={`w-full px-3 py-1.5 text-left text-sm text-slate-700 border-b border-slate-100 last:border-0 cursor-pointer ${
                i === selectedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
              }`}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OLTippingApp() {
  const [view, setView] = useState('studio');
  const [deltakerNavn, setDeltakerNavn] = useState('');
  const [tips, setTips] = useState({});
  const [gullTips, setGullTips] = useState('');
  const [expandedDays, setExpandedDays] = useState({});
  const [alleTips, setAlleTips] = useState([]);
  const [resultater, setResultater] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [selectedDeltaker, setSelectedDeltaker] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showØvelser, setShowØvelser] = useState(false);
  
  // Admin modaler
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeltakerNavn, setNewDeltakerNavn] = useState('');
  const [newDeltakerGull, setNewDeltakerGull] = useState('');
  
  // Leaderboard og resultat-visning
  const [leaderboardView, setLeaderboardView] = useState('total'); // 'total' eller dag-nummer
  const [expandedLeaderboardDeltaker, setExpandedLeaderboardDeltaker] = useState(null);
  const [expandedLiveFeedPost, setExpandedLiveFeedPost] = useState(null); // For "les mer" på lange innlegg
  const [adminResultatDag, setAdminResultatDag] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // ID for deltaker som skal slettes
  const [editingDeltaker, setEditingDeltaker] = useState(null); // Deltaker som redigeres
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'loading' | 'success' | 'error', message: string }
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [norskeGullResultat, setNorskeGullResultat] = useState(''); // Faktisk antall norske gull
  
  // Synlighetskontroll for tips
  const [synligeDager, setSynligeDager] = useState({}); // { 1: true, 2: false, ... }
  const [gullTipsSynlig, setGullTipsSynlig] = useState(false);
  const [tipsDag, setTipsDag] = useState(1); // Valgt dag på Tips-siden
  const [påmeldingLåst, setPåmeldingLåst] = useState(false); // Lås påmelding etter frist
  
  // Deltaker-innlogging for redigering
  const [isEditMode, setIsEditMode] = useState(false); // Redigeringsmodus
  const [loggedInDeltaker, setLoggedInDeltaker] = useState(null); // Innlogget deltaker
  const [deltakerLoginNavn, setDeltakerLoginNavn] = useState('');
  const [deltakerLoginPin, setDeltakerLoginPin] = useState('');
  const [deltakerLoginError, setDeltakerLoginError] = useState('');
  const [nyPin, setNyPin] = useState(''); // For å sette PIN ved første innsending
  const [editSaveStatus, setEditSaveStatus] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // Vis innloggingsmodal
  const [editingNavnId, setEditingNavnId] = useState(null); // ID for deltaker som får navn redigert
  const [editLagnavn, setEditLagnavn] = useState('');
  const [editFaktiskNavn, setEditFaktiskNavn] = useState('');
  
  // OL-Studio (Live feed + Chat)
  const [liveFeed, setLiveFeed] = useState([]); // Admin-poster
  const [chatMessages, setChatMessages] = useState([]); // Chat-meldinger
  const [newChatMessage, setNewChatMessage] = useState('');
  const [newLiveFeedPost, setNewLiveFeedPost] = useState('');
  const [studioLoggedIn, setStudioLoggedIn] = useState(null); // Innlogget deltaker i studio
  const [studioLoginNavn, setStudioLoginNavn] = useState('');
  const [studioLoginPin, setStudioLoginPin] = useState('');
  const [studioLoginError, setStudioLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // Alltid husk innlogging
  const [showMobileChat, setShowMobileChat] = useState(false); // Mobil chat modal
  const [editingLiveFeedId, setEditingLiveFeedId] = useState(null); // Redigerer live-innlegg
  const [editingLiveFeedContent, setEditingLiveFeedContent] = useState('');
  const [deltePlasser, setDeltePlasser] = useState({}); // { øvelseIdx: [4] } = plass 4 er delt
  const chatEndRef = useRef(null);

  useEffect(() => {
    const init = {};
    OL_PROGRAM.forEach((ø, idx) => { init[idx] = ø.type === 'individuell' ? ['','','','',''] : ['','','']; });
    setTips(init);
    setExpandedDays({ 1: true });
    
    // Lytt til deltakere fra Firebase (realtime)
    const unsubscribeTips = onSnapshot(collection(db, 'deltakere'), (snapshot) => {
      const deltakere = [];
      snapshot.forEach((doc) => {
        deltakere.push({ id: doc.id, ...doc.data() });
      });
      setAlleTips(deltakere);
    }, (error) => {
      console.error('Feil ved lasting av deltakere:', error);
    });
    
    // Lytt til resultater fra Firebase (realtime)
    const unsubscribeResultater = onSnapshot(doc(db, 'config', 'resultater'), (docSnap) => {
      if (docSnap.exists()) {
        setResultater(docSnap.data().data || {});
        setDeltePlasser(docSnap.data().deltePlasser || {});
        if (docSnap.data().norskeGull !== undefined) {
          setNorskeGullResultat(docSnap.data().norskeGull.toString());
        }
      }
    }, (error) => {
      console.error('Feil ved lasting av resultater:', error);
    });
    
    // Lytt til synlighetsinnstillinger fra Firebase
    const unsubscribeSynlighet = onSnapshot(doc(db, 'config', 'synlighet'), (docSnap) => {
      if (docSnap.exists()) {
        const dager = docSnap.data().dager || {};
        setSynligeDager(dager);
        setGullTipsSynlig(docSnap.data().gullTips || false);
        setPåmeldingLåst(docSnap.data().påmeldingLåst || false);
        
        // Sett tipsDag til høyeste synlige dag
        const synlige = Object.entries(dager).filter(([_, synlig]) => synlig).map(([dag, _]) => parseInt(dag));
        if (synlige.length > 0) {
          setTipsDag(Math.max(...synlige));
        }
      }
    }, (error) => {
      console.error('Feil ved lasting av synlighet:', error);
    });
    
    // Lytt til live feed fra Firebase
    const unsubscribeLiveFeed = onSnapshot(collection(db, 'livefeed'), (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      // Sorter etter tidspunkt, nyeste først
      posts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setLiveFeed(posts);
    }, (error) => {
      console.error('Feil ved lasting av live feed:', error);
    });
    
    // Lytt til chat fra Firebase
    const unsubscribeChat = onSnapshot(collection(db, 'chat'), (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      // Sorter etter tidspunkt, eldste først
      messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setChatMessages(messages);
    }, (error) => {
      console.error('Feil ved lasting av chat:', error);
    });
    
    // Cleanup listeners når komponenten unmountes
    return () => {
      unsubscribeTips();
      unsubscribeResultater();
      unsubscribeSynlighet();
      unsubscribeLiveFeed();
      unsubscribeChat();
    };
  }, []);

  // Re-sync når appen kommer tilbake i fokus (viktig for PWA)
  // Firebase onSnapshot holder data synkronisert, så vi trenger ikke reload
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('App tilbake i fokus - Firebase holder data synkronisert');
        // Ingen reload nødvendig - onSnapshot lytterne er fortsatt aktive
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // For iOS PWA - pageshow med persisted betyr at siden ble gjenopprettet fra bfcache
    // I dette tilfellet kan Firebase-tilkoblingen være død, så vi reloader
    const handlePageShow = (event) => {
      if (event.persisted) {
        console.log('Side gjenopprettet fra bfcache - reloader...');
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Last husket bruker fra localStorage
  useEffect(() => {
    if (alleTips.length > 0) {
      const remembered = localStorage.getItem('olTipping_rememberedUser');
      if (remembered && !studioLoggedIn) {
        try {
          const { navn, pin } = JSON.parse(remembered);
          const deltaker = alleTips.find(d => 
            d.navn.toLowerCase() === navn.toLowerCase() && 
            (d.pin === pin || genererPin(d.navn) === pin)
          );
          if (deltaker) {
            setStudioLoggedIn(deltaker);
            console.log('Auto-innlogget som:', deltaker.navn);
          } else {
            // Ugyldig lagret data, fjern den
            localStorage.removeItem('olTipping_rememberedUser');
          }
        } catch (e) {
          localStorage.removeItem('olTipping_rememberedUser');
        }
      }
    }
  }, [alleTips]);

  // Lagre synlighetsinnstillinger til Firebase
  const saveSynlighetToFirebase = async (dager, gullTips, låst = påmeldingLåst) => {
    try {
      await setDoc(doc(db, 'config', 'synlighet'), { 
        dager: dager,
        gullTips: gullTips,
        påmeldingLåst: låst
      });
    } catch (e) {
      console.error('Feil ved lagring av synlighet:', e);
    }
  };

  // Lagre resultater til Firebase (kalles manuelt fra admin)
  const saveResultaterToFirebase = async () => {
    try {
      await setDoc(doc(db, 'config', 'resultater'), { 
        data: resultater,
        deltePlasser: deltePlasser,
        norskeGull: norskeGullResultat ? parseInt(norskeGullResultat) : null
      });
      setSaveStatus({ type: 'success', message: 'Resultater lagret!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.error('Feil ved lagring:', e);
      setSaveStatus({ type: 'error', message: 'Kunne ikke lagre: ' + e.message });
    }
  };

  // Legg til deltaker i Firebase
  const addDeltakerToFirebase = async (deltaker) => {
    try {
      const id = deltaker.id || Date.now().toString();
      await setDoc(doc(db, 'deltakere', id), { ...deltaker, id });
      return true;
    } catch (e) {
      console.error('Feil ved lagring av deltaker:', e);
      return false;
    }
  };

  // Slett deltaker fra Firebase
  const deleteDeltakerFromFirebase = async (id) => {
    try {
      await deleteDoc(doc(db, 'deltakere', id.toString()));
      return true;
    } catch (e) {
      console.error('Feil ved sletting:', e);
      return false;
    }
  };

  const updateDeltakerNavnInFirebase = async (id, lagnavn, faktiskNavn) => {
    try {
      await setDoc(doc(db, 'deltakere', id.toString()), { 
        navn: lagnavn,
        faktiskNavn: faktiskNavn || ''
      }, { merge: true });
      return true;
    } catch (e) {
      console.error('Feil ved oppdatering av navn:', e);
      return false;
    }
  };

  // OL-Studio funksjoner
  const sendChatMessage = async () => {
    const chatNavn = isAdminLoggedIn ? 'Admin' : (studioLoggedIn?.navn || loggedInDeltaker?.navn);
    if (!newChatMessage.trim() || !chatNavn) return;
    try {
      const msgId = Date.now().toString();
      await setDoc(doc(db, 'chat', msgId), {
        id: msgId,
        navn: chatNavn,
        message: newChatMessage.trim(),
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
      });
      setNewChatMessage('');
      // Scroll til bunnen
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      console.error('Feil ved sending av melding:', e);
    }
  };

  const sendLiveFeedPost = async (message) => {
    const authorName = isAdminLoggedIn ? 'Admin' : (studioLoggedIn?.navn || loggedInDeltaker?.navn);
    const content = message || newLiveFeedPost;
    if (!content.trim() || !authorName) return;
    try {
      const postId = Date.now().toString();
      await setDoc(doc(db, 'livefeed', postId), {
        id: postId,
        content: content.trim(),
        author: authorName,
        authorId: isAdminLoggedIn ? 'admin' : (studioLoggedIn?.id || loggedInDeltaker?.id),
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
      });
      setNewLiveFeedPost('');
    } catch (e) {
      console.error('Feil ved posting:', e);
    }
  };

  const updateLiveFeedPost = async (postId, newContent) => {
    try {
      await setDoc(doc(db, 'livefeed', postId), {
        content: newContent.trim(),
        editedAt: Date.now()
      }, { merge: true });
      setEditingLiveFeedId(null);
      setEditingLiveFeedContent('');
    } catch (e) {
      console.error('Feil ved oppdatering:', e);
    }
  };

  const deleteLiveFeedPost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'livefeed', postId));
    } catch (e) {
      console.error('Feil ved sletting:', e);
    }
  };

  const togglePinPost = async (postId, currentlyPinned) => {
    try {
      await setDoc(doc(db, 'livefeed', postId), {
        pinned: !currentlyPinned
      }, { merge: true });
    } catch (e) {
      console.error('Feil ved pinning:', e);
    }
  };

  const deleteChatMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, 'chat', msgId));
    } catch (e) {
      console.error('Feil ved sletting:', e);
    }
  };

  const handleStudioLogin = () => {
    const deltaker = alleTips.find(d => 
      d.navn.toLowerCase() === studioLoginNavn.toLowerCase() && 
      (d.pin === studioLoginPin || genererPin(d.navn) === studioLoginPin)
    );
    if (deltaker) {
      setStudioLoggedIn(deltaker);
      setStudioLoginError('');
      // Alltid lagre til localStorage for auto-innlogging
      localStorage.setItem('olTipping_rememberedUser', JSON.stringify({
        navn: deltaker.navn,
        pin: studioLoginPin
      }));
      setStudioLoginNavn('');
      setStudioLoginPin('');
    } else {
      setStudioLoginError('Feil lagnavn eller PIN');
    }
  };

  // Logg ut og fjern husk meg
  const handleLogout = () => {
    setStudioLoggedIn(null);
    setLoggedInDeltaker(null);
    setIsEditMode(false);
    localStorage.removeItem('olTipping_rememberedUser');
  };

  const øvelserPerDag = OL_PROGRAM.reduce((acc, ø, idx) => {
    if (!acc[ø.dag]) acc[ø.dag] = [];
    acc[ø.dag].push({ ...ø, idx });
    return acc;
  }, {});

  const øvelserPerSport = OL_PROGRAM.reduce((acc, ø, idx) => {
    if (!acc[ø.sport]) acc[ø.sport] = [];
    acc[ø.sport].push({ ...ø, idx });
    return acc;
  }, {});

  const toggleDay = (dag) => setExpandedDays(p => ({ ...p, [dag]: !p[dag] }));

  const handleTipsChange = (idx, pos, val) => {
    setTips(p => ({ ...p, [idx]: p[idx].map((v, i) => i === pos ? val : v) }));
  };

  const getSuggestions = (sport, type) => {
    if (type === 'lag') return NASJONER;
    return UTØVERE[sport] || [];
  };

  // Generer PIN basert på navn (for Excel-opplasting)
  const genererPin = (navn) => {
    // Enkel hash basert på navn + hemmelig tall
    const base = navn.toLowerCase().replace(/\s/g, '');
    let sum = 2026; // Base-tall
    for (let i = 0; i < base.length; i++) {
      sum += base.charCodeAt(i) * (i + 1);
    }
    return (sum % 9000 + 1000).toString(); // 4-sifret PIN mellom 1000-9999
  };

  const handleSubmit = async () => {
    if (!deltakerNavn.trim()) return alert('Fyll inn navnet ditt!');
    if (!gullTips || isNaN(gullTips)) return alert('Tipp antall norske gull!');
    if (!nyPin || nyPin.length !== 4 || isNaN(nyPin)) return alert('Velg en 4-sifret PIN-kode for å kunne redigere tipsene dine senere!');
    if (alleTips.some(t => t.navn.toLowerCase() === deltakerNavn.toLowerCase())) {
      return alert('Dette navnet er allerede registrert!');
    }
    const nyDeltaker = {
      id: Date.now().toString(),
      navn: deltakerNavn,
      tips: { ...tips },
      gullTips: parseInt(gullTips),
      pin: nyPin,
      innsendt: new Date().toLocaleString('no-NO'),
    };
    const success = await addDeltakerToFirebase(nyDeltaker);
    if (success) {
      setSubmitted(true);
    } else {
      alert('Kunne ikke lagre tips. Prøv igjen.');
    }
  };

  // Logg inn deltaker for redigering
  const handleDeltakerLogin = () => {
    const deltaker = alleTips.find(d => d.navn.toLowerCase() === deltakerLoginNavn.toLowerCase());
    if (!deltaker) {
      setDeltakerLoginError('Finner ikke deltaker med dette navnet');
      return;
    }
    // Sjekk PIN (enten brukervalgt eller generert)
    const riktigPin = deltaker.pin || genererPin(deltaker.navn);
    if (deltakerLoginPin !== riktigPin) {
      setDeltakerLoginError('Feil PIN-kode');
      return;
    }
    // Innlogging vellykket
    setLoggedInDeltaker(deltaker);
    setDeltakerLoginError('');
    setIsEditMode(true);
    setShowLoginModal(false);
    // Last inn eksisterende tips
    setTips(deltaker.tips || {});
    setGullTips(deltaker.gullTips?.toString() || '');
    setDeltakerNavn(deltaker.navn);
  };

  // Lagre redigerte tips
  const handleSaveEdit = async () => {
    if (!loggedInDeltaker) return;
    
    const oppdatertDeltaker = {
      ...loggedInDeltaker,
      tips: { ...tips },
      gullTips: parseInt(gullTips) || loggedInDeltaker.gullTips,
      sistEndret: new Date().toLocaleString('no-NO'),
    };
    
    const success = await addDeltakerToFirebase(oppdatertDeltaker);
    if (success) {
      setEditSaveStatus({ type: 'success', message: 'Endringer lagret!' });
      setTimeout(() => setEditSaveStatus(null), 3000);
    } else {
      setEditSaveStatus({ type: 'error', message: 'Kunne ikke lagre endringer' });
    }
  };

  // Logg ut deltaker
  const handleDeltakerLogout = () => {
    setLoggedInDeltaker(null);
    setIsEditMode(false);
    setDeltakerLoginNavn('');
    setDeltakerLoginPin('');
    // Reset tips
    const init = {};
    OL_PROGRAM.forEach((ø, idx) => { init[idx] = ø.type === 'individuell' ? ['','','','',''] : ['','','']; });
    setTips(init);
    setGullTips('');
    setDeltakerNavn('');
  };

  // Sjekk om en dag kan redigeres (ikke åpnet/har resultater)
  const kanRedigereDag = (dag) => {
    const dagHarResultat = øvelserPerDag[dag]?.some(ø => resultater[ø.idx]?.some(r => r?.trim()));
    const dagErSynlig = synligeDager[dag];
    return !dagHarResultat && !dagErSynlig;
  };

  // Finn ukjente navn for en deltaker
  const getUnknownNames = (deltaker) => {
    const unknown = [];
    OL_PROGRAM.forEach((ø, idx) => {
      deltaker.tips[idx]?.forEach((name, pos) => {
        if (name && name.trim() && !isKnownName(name, ø.sport, ø.type)) {
          unknown.push({ øvelse: ø.øvelse, navn: name, pos: pos + 1 });
        }
      });
    });
    return unknown;
  };

  // Beregn faktisk plassering med hensyn til delte plasser
  // Hvis plass 4 er delt: posisjon 1,2,3,4,5 i lista → plassering 1,2,3,4,4
  const getPlasseringerMedDelt = (øvelseIdx) => {
    const delt = deltePlasser[øvelseIdx] || [];
    const plasseringer = [];
    let currentPlass = 1;
    
    for (let i = 0; i < 5; i++) {
      // Sjekk om FORRIGE plass var delt - da får denne samme plassering
      if (i > 0 && delt.includes(plasseringer[i - 1])) {
        // Forrige plass var delt, så denne får samme plassering
        plasseringer.push(plasseringer[i - 1]);
      } else {
        plasseringer.push(currentPlass);
      }
      currentPlass = plasseringer[i] + 1;
    }
    return plasseringer;
  };

  // Formater resultat-streng med delte plasser
  const formaterResultatMedDelt = (øvelseIdx, type) => {
    const res = resultater[øvelseIdx];
    if (!res) return '';
    const plasseringer = getPlasseringerMedDelt(øvelseIdx);
    const antall = type === 'individuell' ? 5 : 3;
    return res.slice(0, antall).map((r, i) => `${plasseringer[i]}. ${r || '-'}`).join(' | ');
  };

  // Beregn poeng
  // Beregn poeng for en deltaker, eventuelt filtrert på dag
  const beregnPoeng = (deltaker, filterDag = null) => {
    let total = 0;
    OL_PROGRAM.forEach((ø, idx) => {
      if (filterDag !== null && ø.dag !== filterDag) return;
      const res = resultater[idx];
      if (!res || !deltaker.tips[idx]) return;
      const plasseringer = getPlasseringerMedDelt(idx);
      deltaker.tips[idx].forEach((tip, tippPos) => {
        if (!tip?.trim()) return;
        const { index: faktiskPosIndex } = findBestMatch(tip, res);
        if (faktiskPosIndex === -1) return;
        const faktiskPlass = plasseringer[faktiskPosIndex]; // 1-indeksert plassering
        if (ø.type === 'individuell') {
          if (faktiskPlass <= 5) total += [0,5,4,3,2,1][faktiskPlass]; // plass 1=5p, 2=4p, etc
          if (faktiskPlass <= 3 && tippPos + 1 === faktiskPlass) total += [0,5,3,1][faktiskPlass];
        } else {
          if (faktiskPlass <= 3 && tippPos + 1 === faktiskPlass) total += [0,8,5,3][faktiskPlass];
        }
      });
    });
    return total;
  };

  // Beregn detaljert poenginfo for en øvelse og deltaker
  const beregnØvelsePoeng = (deltaker, øvelseIdx) => {
    const ø = OL_PROGRAM[øvelseIdx];
    const res = resultater[øvelseIdx];
    const tips = deltaker.tips?.[øvelseIdx];
    const plasseringer = getPlasseringerMedDelt(øvelseIdx);
    
    // Hvis ingen tips, returner tom
    if (!tips || tips.length === 0) return { poeng: 0, detaljer: [] };
    
    let poeng = 0;
    const detaljer = [];
    
    tips.forEach((tip, tippPos) => {
      if (!tip?.trim()) {
        detaljer.push({ tip: '-', tippPos: tippPos + 1, faktiskPos: null, poeng: 0, bonus: 0, totalPoeng: 0 });
        return;
      }
      
      // Hvis ingen resultater ennå, vis bare tipsene
      if (!res || !res.some(r => r?.trim())) {
        detaljer.push({ 
          tip, 
          tippPos: tippPos + 1, 
          faktiskPos: null,
          matchedName: null,
          poeng: 0,
          bonus: 0,
          totalPoeng: 0
        });
        return;
      }
      
      const { index: faktiskPosIndex, name: matchedName } = findBestMatch(tip, res);
      let øvelsePoeng = 0;
      let bonus = 0;
      
      if (faktiskPosIndex !== -1) {
        const faktiskPlass = plasseringer[faktiskPosIndex]; // 1-indeksert plassering
        if (ø.type === 'individuell') {
          if (faktiskPlass <= 5) øvelsePoeng = [0,5,4,3,2,1][faktiskPlass];
          if (faktiskPlass <= 3 && tippPos + 1 === faktiskPlass) bonus = [0,5,3,1][faktiskPlass];
        } else {
          if (faktiskPlass <= 3 && tippPos + 1 === faktiskPlass) øvelsePoeng = [0,8,5,3][faktiskPlass];
        }
      }
      
      poeng += øvelsePoeng + bonus;
      detaljer.push({ 
        tip, 
        tippPos: tippPos + 1, 
        faktiskPos: faktiskPosIndex !== -1 ? plasseringer[faktiskPosIndex] : null,
        matchedName,
        poeng: øvelsePoeng,
        bonus,
        totalPoeng: øvelsePoeng + bonus
      });
    });
    
    return { poeng, detaljer };
  };

  // Beregn poeng per dag for en deltaker
  const beregnPoengPerDag = (deltaker) => {
    const perDag = {};
    for (let dag = 1; dag <= 16; dag++) {
      perDag[dag] = beregnPoeng(deltaker, dag);
    }
    return perDag;
  };

  // Beregn bonus for gull-tips (kun når resultat er registrert)
  const beregnGullBonus = (deltaker) => {
    if (!norskeGullResultat || norskeGullResultat === '') return 0;
    const faktisk = parseInt(norskeGullResultat);
    const gjetning = deltaker.gullTips || 0;
    const diff = Math.abs(faktisk - gjetning);
    
    // Eksakt: 30 poeng, 1 av: 20 poeng, 2 av: 10 poeng
    if (diff === 0) return 30;
    if (diff === 1) return 20;
    if (diff === 2) return 10;
    return 0;
  };

  const leaderboard = [...alleTips].map(d => ({ 
    ...d, 
    øvelsePoeng: beregnPoeng(d),
    gullBonus: beregnGullBonus(d),
    poeng: beregnPoeng(d) + beregnGullBonus(d)
  })).sort((a, b) => b.poeng - a.poeng);
  
  // Beregn plassering med delte plasser for leaderboard
  const getLeaderboardPlassering = (sortedList, idx) => {
    if (idx === 0) return { plass: 1, delt: false };
    const currentPoeng = sortedList[idx].poeng;
    // Finn første person med samme poeng
    let førsteMedSammePoeng = idx;
    while (førsteMedSammePoeng > 0 && sortedList[førsteMedSammePoeng - 1].poeng === currentPoeng) {
      førsteMedSammePoeng--;
    }
    const plass = førsteMedSammePoeng + 1;
    const delt = idx !== førsteMedSammePoeng;
    return { plass, delt };
  };
  
  // Leaderboard for en spesifikk dag
  const getLeaderboardForDay = (dag) => {
    return [...alleTips].map(d => ({ ...d, poeng: beregnPoeng(d, dag) })).sort((a, b) => b.poeng - a.poeng);
  };

  // Finn siste dag med resultater
  const getSisteOppdaterteDag = () => {
    let sisteDag = 0;
    for (let dag = 1; dag <= 16; dag++) {
      const harResultat = øvelserPerDag[dag]?.some(ø => resultater[ø.idx]?.some(r => r?.trim()));
      if (harResultat) sisteDag = dag;
    }
    return sisteDag;
  };
  
  const sisteOppdaterteDag = getSisteOppdaterteDag();

  // Tell varsler (ukjente navn)
  const getTotalWarnings = () => {
    return alleTips.reduce((sum, d) => sum + getUnknownNames(d).length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="px-4 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Mountain className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            OL-KONKURRANSE 2026
          </h1>
          <Mountain className="w-6 h-6 text-cyan-400 transform scale-x-[-1]" />
        </div>
        <p className="text-sm text-blue-200">🇮🇹 Milano-Cortina • {OL_PROGRAM.length} øvelser</p>
      </header>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto">
          {[
            { id: 'info', label: 'Info', icon: AlertCircle },
            { id: 'tipping', label: 'Tipping / Endre', icon: Send },
            { id: 'studio', label: 'OL Live', icon: Radio },
            { id: 'leaderboard', label: 'Resultater', icon: Trophy },
            { id: 'admin', label: 'Admin', icon: Lock },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                view === id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'text-blue-300 hover:bg-blue-900/50'
              }`}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === 'admin' && isAdminLoggedIn && (
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* INFO */}
        {view === 'info' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-5 border border-blue-500/30">
              <p className="text-blue-100 italic text-sm">
                "Fire lange års ventetid er snart omme! Perioden kalles OL. Og hva er vel mer artig enn å tippe litt?"
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-black text-cyan-400">{OL_PROGRAM.length}</div>
                <div className="text-xs text-slate-400">Øvelser</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-black text-green-400">{alleTips.length}</div>
                <div className="text-xs text-slate-400">Påmeldte</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-black text-yellow-400">{alleTips.length * 200},-</div>
                <div className="text-xs text-slate-400">Pott</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-black text-purple-400">16</div>
                <div className="text-xs text-slate-400">Dager</div>
              </div>
            </div>

            {/* Se alle øvelser knapp */}
            <button
              onClick={() => setShowØvelser(true)}
              className="w-full py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl flex items-center justify-center gap-2 text-blue-300"
            >
              <List className="w-5 h-5" />
              Se alle {OL_PROGRAM.length} øvelser
            </button>

            {/* Poenggivning */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="font-bold text-white mb-3">📊 Poenggivning</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-900/30 rounded-lg p-3">
                  <p className="font-bold text-blue-300 mb-2">👤 INDIVIDUELLE ØVELSER</p>
                  <p className="text-blue-100 text-xs mb-3">Du tipper 5 utøvere (1.-5. plass)</p>
                  
                  <div className="bg-blue-950/50 rounded p-2 mb-2">
                    <p className="text-white font-semibold text-xs mb-1">📍 Steg 1: Plasseringspoeng</p>
                    <p className="text-blue-200 text-xs">Havner utøveren din i topp 5? Da får du poeng!</p>
                    <p className="text-blue-100 text-xs mt-1">🥇5p | 🥈4p | 🥉3p | 4.plass 2p | 5.plass 1p</p>
                    <p className="text-slate-400 text-xs italic mt-1">Uansett hvilken plass du tippet utøveren på.</p>
                  </div>
                  
                  <div className="bg-yellow-900/30 rounded p-2">
                    <p className="text-yellow-300 font-semibold text-xs mb-1">🎯 Steg 2: Pallbonus (ekstra!)</p>
                    <p className="text-yellow-100 text-xs">Tippet du medaljevinner på riktig plass?</p>
                    <p className="text-yellow-100 text-xs mt-1">Gull riktig: +5p | Sølv riktig: +3p | Bronse riktig: +1p</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded p-2 mt-2">
                    <p className="text-slate-300 text-xs">💡 <span className="font-semibold">Eksempel:</span> Du tipper Klæbo på 1. plass. Han vinner gull → Du får 5p (plasseringspoeng) + 5p (pallbonus) = <span className="text-green-400 font-bold">10 poeng!</span></p>
                  </div>
                </div>
                <div className="bg-green-900/30 rounded-lg p-3">
                  <p className="font-bold text-green-300 mb-2">🏁 LAGØVELSER</p>
                  <p className="text-green-100 text-xs mb-3">Du tipper 3 nasjoner (gull, sølv, bronse)</p>
                  <p className="text-slate-300 text-xs mb-1"><span className="text-white font-semibold">Kun poeng for riktig plassering:</span></p>
                  <p className="text-yellow-100 text-xs">🥇 Riktig gullnasjon: 8 poeng</p>
                  <p className="text-slate-300 text-xs">🥈 Riktig sølvnasjon: 5 poeng</p>
                  <p className="text-orange-200 text-xs">🥉 Riktig bronsenasjon: 3 poeng</p>
                  <p className="text-slate-400 text-xs mt-3 italic">⚠️ Her må nasjonen stå på riktig plass for å få poeng!</p>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3 mt-3">
                <p className="font-bold text-red-300 mb-1">🇳🇴 NORSKE GULL TOTALT</p>
                <p className="text-red-100 text-xs">Tipp hvor mange gull Norge tar totalt. Treffer du eksakt: 30p | Bommer med 1: 20p | Bommer med 2: 10p</p>
                {norskeGullResultat && norskeGullResultat !== '' && (
                  <div className="mt-2 pt-2 border-t border-red-700/50">
                    <p className="text-yellow-400 font-bold text-lg">
                      🏆 Faktisk resultat: {norskeGullResultat} gull 🥇
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Påmelding og premier */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="font-bold text-white mb-3">💰 Påmelding & Premier</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-purple-900/30 rounded-lg p-3">
                  <p className="font-bold text-purple-300 mb-2">📱 Påmelding</p>
                  <p className="text-purple-100 text-sm">Vipps <span className="font-bold text-white">200 kr</span> til:</p>
                  <p className="text-white font-bold text-lg mt-1">Magnus Kløvstad Langberg</p>
                  <p className="text-purple-200 text-sm">Tlf: <a href="tel:91587905" className="text-cyan-400 hover:underline">915 87 905</a></p>
                </div>
                <div className="bg-yellow-900/30 rounded-lg p-3">
                  <p className="font-bold text-yellow-300 mb-2">🏆 Premier</p>
                  <div className="space-y-1">
                    <p className="text-yellow-100 text-sm flex justify-between">
                      <span>🥇 1. plass:</span>
                      <span className="font-bold text-white">70% av potten</span>
                    </p>
                    <p className="text-slate-300 text-sm flex justify-between">
                      <span>🥈 2. plass:</span>
                      <span className="font-bold text-white">20% av potten</span>
                    </p>
                    <p className="text-orange-200 text-sm flex justify-between">
                      <span>🥉 3. plass:</span>
                      <span className="font-bold text-white">10% av potten</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info om endring av tips */}
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/50">
              <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2 text-lg">
                ✏️ Nytt i år: Du kan endre tips underveis!
              </h3>
              <div className="space-y-2 text-sm text-blue-100">
                <p>
                  Du kan endre tipsene dine helt fram til <span className="font-bold text-white">23:59 dagen før øvelsen starter</span>.
                </p>
                <p className="bg-blue-950/50 rounded p-2 text-blue-200">
                  💡 <span className="font-semibold">Eksempel:</span> Starter øvelsen torsdag, kan du endre tips til onsdag kl. 23:59.
                </p>
                <p>
                  Gå til <span className="font-semibold text-white">"Tipping / Endre"</span> og logg inn med lagnavn og PIN-kode.
                </p>
              </div>
            </div>

            <button onClick={() => setView('tipping')}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl">
              Start tipping! 🎿
            </button>

            {/* Excel-alternativ */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                <Download className="w-5 h-5" /> Foretrekker du Excel?
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Last ned tippeskjemaet som Excel-fil, fyll ut i ro og mak, og send til admin.
              </p>
              <button 
                onClick={downloadExcelTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
              >
                <Download className="w-4 h-4" /> Last ned Excel-skjema
              </button>
              <p className="text-xs text-slate-400 mt-3">
                Send utfylt skjema til: <a href="mailto:magnuslangberg@gmail.com?subject=OL-tips%202026" className="text-cyan-400 hover:underline font-medium">magnuslangberg@gmail.com</a>
              </p>
            </div>
          </div>
        )}

        {/* ØVELSER MODAL */}
        {showØvelser && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowØvelser(false);
            }}
          >
            <div className="h-full w-full md:p-4 md:flex md:items-center md:justify-center">
              <div className="bg-slate-800 h-full md:h-auto md:max-h-[90vh] md:rounded-xl md:max-w-2xl w-full flex flex-col">
                {/* Header - alltid synlig */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800 sticky top-0 z-10">
                  <h2 className="text-lg font-bold text-white">📋 Alle {OL_PROGRAM.length} øvelser</h2>
                  <button 
                    onClick={() => setShowØvelser(false)} 
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Scrollbart innhold - tar all tilgjengelig plass */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {Object.entries(øvelserPerSport).map(([sport, øvelser]) => (
                    <div key={sport}>
                      <h3 className={`font-bold text-sm mb-2 px-2 py-1 rounded ${SPORT_COLORS[sport]?.bg} text-white uppercase sticky top-0`}>
                        {sport} ({øvelser.length})
                      </h3>
                      <div className="space-y-1">
                        {øvelser.sort((a, b) => a.dag - b.dag).map((ø) => (
                          <div key={ø.idx} className="flex items-center gap-2 text-sm py-2 px-2 bg-slate-700/50 rounded">
                            <span className="text-cyan-400 font-mono w-14 shrink-0">Dag {ø.dag}</span>
                            <span className="text-slate-300 flex-1 text-xs md:text-sm">{ø.øvelse}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${ø.type === 'lag' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                              {ø.type === 'lag' ? '3' : '5'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Ekstra padding på bunnen for å sikre at alt er synlig */}
                  <div className="h-4"></div>
                </div>
                
                {/* Footer - alltid synlig */}
                <div className="p-4 border-t border-slate-700 bg-slate-800">
                  <button 
                    onClick={() => setShowØvelser(false)}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-lg"
                  >
                    ✓ Lukk
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OL LIVE */}
        {view === 'studio' && (
          <div className="space-y-4">
            {/* Header med NRK-link */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                OL LIVE
              </h2>
              <a 
                href="https://tv.nrk.no/programmer/ol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center gap-1"
              >
                📺 NRK Direkte
              </a>
            </div>

            {/* Live Feed banner øverst - viser festede innlegg */}
            {(liveFeed.filter(p => p.pinned).length > 0 || liveFeed.length > 0) && (
              <div className="bg-gradient-to-r from-cyan-900/40 to-slate-800/40 rounded-lg border border-cyan-500/30">
                {/* Festede innlegg - alltid synlige, hele innholdet */}
                {liveFeed.filter(p => p.pinned).length > 0 && (
                  <div className="p-3 space-y-2">
                    {liveFeed.filter(p => p.pinned).map(post => (
                      <div key={post.id} className="flex items-start gap-2">
                        <Pin className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm whitespace-pre-wrap">{post.content}</p>
                          <p className="text-xs text-cyan-400/70 mt-1">{post.author || 'Admin'} • {post.date} {post.time}</p>
                        </div>
                        {isAdminLoggedIn && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => { setEditingLiveFeedId(post.id); setEditingLiveFeedContent(post.content); }} className="text-slate-400 hover:text-white p-0.5"><Edit3 className="w-3 h-3" /></button>
                            <button onClick={() => togglePinPost(post.id, true)} className="text-yellow-400 hover:text-yellow-300 p-0.5"><Pin className="w-3 h-3" /></button>
                            <button onClick={() => deleteLiveFeedPost(post.id)} className="text-red-400 hover:text-red-300 p-0.5"><X className="w-3 h-3" /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Nyeste innlegg preview + collapsed resten */}
                {liveFeed.filter(p => !p.pinned).length > 0 && (() => {
                  const newestPost = liveFeed.filter(p => !p.pinned)[0];
                  const isLong = newestPost?.content?.length > 200;
                  const isExpanded = expandedLiveFeedPost === newestPost?.id;
                  const otherPosts = liveFeed.filter(p => !p.pinned).slice(1, 15);
                  
                  return (
                    <div className={`${liveFeed.filter(p => p.pinned).length > 0 ? 'border-t border-cyan-500/20' : ''}`}>
                      {/* Nyeste innlegg */}
                      <div className="p-3">
                        <p className={`text-white text-sm whitespace-pre-wrap ${!isExpanded && isLong ? 'line-clamp-4' : ''}`}>
                          {newestPost?.content}
                        </p>
                        {isLong && (
                          <button 
                            onClick={() => setExpandedLiveFeedPost(isExpanded ? null : newestPost?.id)}
                            className="text-cyan-400 hover:text-cyan-300 text-xs mt-1 font-semibold"
                          >
                            {isExpanded ? '▲ Vis mindre' : '▼ Les mer...'}
                          </button>
                        )}
                        <p className="text-xs text-cyan-400/70 mt-1">
                          {newestPost?.author || 'Anonym'} • {newestPost?.time}
                        </p>
                      </div>
                      
                      {/* Flere meldinger - collapsed */}
                      {otherPosts.length > 0 && (
                        <details className="group">
                          <summary className="px-3 pb-2 cursor-pointer text-cyan-300 text-xs font-semibold flex items-center gap-1">
                            + {otherPosts.length} flere meldinger
                            <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="px-3 pb-3 space-y-2 max-h-48 overflow-y-auto border-t border-cyan-500/20 pt-2">
                            {otherPosts.map(post => {
                              const currentUserId = isAdminLoggedIn ? 'admin' : (studioLoggedIn?.id || loggedInDeltaker?.id);
                              const canEdit = isAdminLoggedIn || post.authorId === currentUserId;
                              
                              return (
                                <div key={post.id} className="text-sm p-2 rounded-lg bg-slate-900/40">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-xs whitespace-pre-wrap">{post.content}</p>
                                      <p className="text-xs text-slate-500 mt-1">
                                        <span className="text-cyan-400">{post.author || 'Anonym'}</span> • {post.time}
                                      </p>
                                    </div>
                                    {canEdit && (
                                      <div className="flex gap-1 flex-shrink-0">
                                        {isAdminLoggedIn && <button onClick={() => togglePinPost(post.id, false)} className="text-slate-400 hover:text-yellow-400 p-0.5"><Pin className="w-3 h-3" /></button>}
                                        <button onClick={() => deleteLiveFeedPost(post.id)} className="text-red-400 hover:text-red-300 p-0.5"><X className="w-3 h-3" /></button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* To-kolonne layout på desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* VENSTRE: Dagens øvelser + Tips (2/3 bredde) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Dagens øvelser */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Dagens øvelser
                  </h3>
                  {(() => {
                    const idag = new Date();
                    const olStart = new Date('2026-02-07');
                    olStart.setHours(0, 0, 0, 0);
                    idag.setHours(0, 0, 0, 0);
                    const dagNr = Math.floor((idag - olStart) / (1000 * 60 * 60 * 24)) + 1;
                    const dagensØvelser = øvelserPerDag[dagNr] || [];
                    
                    if (dagNr < 1 || dagNr > 16) {
                      return <p className="text-slate-500 text-sm">{dagNr < 1 ? 'OL har ikke startet ennå' : 'OL er ferdig'}</p>;
                    }
                    
                    if (dagensØvelser.length === 0) {
                      return <p className="text-slate-500 text-sm">Ingen øvelser i dag</p>;
                    }
                    
                    return (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300 mb-2">📅 Dag {dagNr} - {dagensØvelser[0]?.dato}</p>
                        {dagensØvelser.sort((a, b) => (a.tid || '').localeCompare(b.tid || '')).map(ø => {
                          const harResultat = resultater[ø.idx]?.some(r => r?.trim());
                          return (
                            <div key={ø.idx} className={`flex items-center justify-between p-2 rounded-lg ${harResultat ? 'bg-green-900/30' : 'bg-slate-700/50'}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-300 text-xs font-mono w-12">{ø.tid}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${SPORT_COLORS[ø.sport]?.bg} text-white`}>{ø.sport.toUpperCase()}</span>
                                <span className="text-white text-sm">{ø.øvelse}</span>
                              </div>
                              {harResultat ? <span className="text-green-400 text-xs">✓</span> : <span className="text-yellow-400 text-xs">⏳</span>}
                            </div>
                          );
                        })}
                        <a 
                          href="https://resultater.nrk.no/vinter-ol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 text-xs px-3 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 rounded-lg flex items-center justify-center gap-1"
                        >
                          📊 Se alle resultater på NRK →
                        </a>
                      </div>
                    );
                  })()}
                </div>

                {/* Deltakernes tips */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">📊 Deltakernes tips</h3>

                  {/* Admin synlighetskontroll */}
                  {isAdminLoggedIn && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-red-300 font-semibold">Admin: Synlighet</span>
                        <button
                          onClick={() => { const nyVerdi = !gullTipsSynlig; setGullTipsSynlig(nyVerdi); saveSynlighetToFirebase(synligeDager, nyVerdi); }}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${gullTipsSynlig ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                        >
                          {gullTipsSynlig ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          🇳🇴 Gull
                        </button>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {Array.from({ length: 16 }, (_, i) => i + 1).map(dag => (
                          <button key={dag}
                            onClick={() => { const nyeDager = { ...synligeDager, [dag]: !synligeDager[dag] }; setSynligeDager(nyeDager); saveSynlighetToFirebase(nyeDager, gullTipsSynlig); }}
                            className={`w-7 h-7 rounded text-xs font-semibold ${synligeDager[dag] ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                          >{dag}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dag-velger */}
                  <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(dag => (
                      <button key={dag} onClick={() => setTipsDag(dag)}
                        className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap flex items-center gap-1 text-sm ${tipsDag === dag ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        D{dag}
                        {synligeDager[dag] ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                      </button>
                    ))}
                  </div>

                  {/* Øvelser for valgt dag */}
                  {synligeDager[tipsDag] ? (
                    <div className="space-y-3">
                      {øvelserPerDag[tipsDag]?.map(ø => {
                        const teller = {};
                        alleTips.forEach(d => {
                          d.tips[ø.idx]?.forEach((navn, pos) => {
                            if (navn && navn.trim()) {
                              let kanoniskNavn = navn;
                              for (const eksisterendeNavn of Object.keys(teller)) {
                                const { match } = fuzzyMatch(navn, eksisterendeNavn);
                                if (match) { kanoniskNavn = eksisterendeNavn; break; }
                              }
                              if (!teller[kanoniskNavn]) teller[kanoniskNavn] = { total: 0, posisjoner: {} };
                              teller[kanoniskNavn].total++;
                              teller[kanoniskNavn].posisjoner[pos + 1] = (teller[kanoniskNavn].posisjoner[pos + 1] || 0) + 1;
                            }
                          });
                        });
                        const stats = Object.entries(teller).map(([navn, data]) => ({ navn, ...data })).sort((a, b) => b.total - a.total);
                        const maxTips = stats[0]?.total || 1;
                        
                        return (
                          <details key={ø.idx} className="bg-slate-900/50 rounded-lg border border-slate-600 group" open>
                            <summary className="p-3 cursor-pointer flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${SPORT_COLORS[ø.sport]?.bg} text-white`}>{ø.sport.toUpperCase()}</span>
                                <span className="font-semibold text-white text-sm">{ø.øvelse}</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-3 pb-3">
                              {stats.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {stats.slice(0, 5).map(({ navn, total, posisjoner }, idx) => {
                                    const prosent = Math.round((total / alleTips.length) * 100);
                                    const medaljer = ['🥇', '🥈', '🥉'];
                                    return (
                                      <div key={navn} className="relative">
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-600/30 to-transparent" style={{ width: `${(total / maxTips) * 100}%` }} />
                                        <div className="relative p-2 rounded-lg border border-cyan-600/20">
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-base">{idx < 3 ? medaljer[idx] : <span className="text-slate-400 text-sm">#{idx + 1}</span>}</span>
                                              <span className="font-bold text-white">{navn}</span>
                                            </div>
                                            <span className="text-cyan-300 font-bold">{total}x <span className="text-slate-400 font-normal text-sm">({prosent}%)</span></span>
                                          </div>
                                          <div className="flex gap-1 flex-wrap">
                                            {[1, 2, 3, 4, 5].map(pos => {
                                              const antall = posisjoner[pos] || 0;
                                              if (antall === 0) return null;
                                              const posColors = {
                                                1: 'bg-yellow-500/80 text-yellow-100',
                                                2: 'bg-slate-400/80 text-slate-100', 
                                                3: 'bg-orange-600/80 text-orange-100',
                                                4: 'bg-slate-600/80 text-slate-200',
                                                5: 'bg-slate-700/80 text-slate-300'
                                              };
                                              return (
                                                <span key={pos} className={`px-1.5 py-0.5 rounded text-xs font-semibold ${posColors[pos]}`}>
                                                  {antall}x på {pos}.
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <details className="group/inner">
                                <summary className="cursor-pointer text-xs text-slate-400 hover:text-white flex items-center gap-1">
                                  <ChevronDown className="w-3 h-3 group-open/inner:rotate-180 transition-transform" /> Alle tips ({alleTips.length})
                                </summary>
                                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                  {alleTips.map(d => (
                                    <div key={d.id} className="flex items-center gap-2 p-1.5 bg-slate-800/50 rounded text-xs">
                                      <span className="text-white font-semibold w-24 truncate" title={d.faktiskNavn && d.faktiskNavn !== d.navn ? d.faktiskNavn : d.navn}>{d.navn}</span>
                                      <div className="flex gap-1 flex-wrap flex-1">
                                        {d.tips[ø.idx]?.map((tip, i) => (
                                          <span key={i} className={`px-1.5 py-0.5 rounded ${i === 0 ? 'bg-yellow-600/30 text-yellow-300' : i === 1 ? 'bg-slate-500/30 text-slate-300' : i === 2 ? 'bg-orange-600/30 text-orange-300' : 'bg-slate-700/50 text-slate-400'}`}>
                                            {i + 1}. {tip || '-'}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 rounded-lg p-6 text-center">
                      <EyeOff className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="text-white font-semibold">Dag {tipsDag} er ikke åpnet</p>
                      <p className="text-slate-400 text-sm">Tips vises når admin åpner dagen</p>
                    </div>
                  )}

                  {/* Gull-tips kompakt */}
                  {gullTipsSynlig && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <details className="group">
                        <summary className="cursor-pointer flex items-center justify-between">
                          <span className="font-bold text-yellow-400 flex items-center gap-2">🇳🇴 Norske gull-tips</span>
                          <ChevronDown className="w-4 h-4 text-yellow-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
                          {[...alleTips].sort((a, b) => (b.gullTips || 0) - (a.gullTips || 0)).map(d => (
                            <div key={d.id} className="flex justify-between items-center p-1.5 bg-slate-800/30 rounded text-sm">
                              <span className="text-white">{d.navn}{d.faktiskNavn && d.faktiskNavn !== d.navn && <span className="text-slate-400 text-xs ml-1">({d.faktiskNavn})</span>}</span>
                              <span className="text-yellow-400 font-bold">{d.gullTips || 0} 🥇</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>

              {/* HØYRE: OL Live Feed - kombinert chat og oppdateringer (1/3 bredde, sticky på desktop) */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30 lg:sticky lg:top-4">
                  <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> OL Live
                    {liveFeed.length > 0 && <span className="bg-cyan-600 text-white text-xs px-1.5 py-0.5 rounded-full">{liveFeed.length}</span>}
                  </h3>
                  
                  {/* Festede innlegg øverst */}
                  {liveFeed.filter(p => p.pinned).length > 0 && (
                    <div className="mb-3 space-y-2">
                      {liveFeed.filter(p => p.pinned).map(post => (
                        <div key={post.id} className="p-2 rounded-lg bg-yellow-900/30 border border-yellow-500/30">
                          <div className="flex items-start gap-2">
                            <Pin className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm whitespace-pre-wrap">{post.content}</p>
                              <p className="text-xs text-yellow-400/70 mt-1">{post.author || 'Admin'} • {post.date}</p>
                            </div>
                            {isAdminLoggedIn && (
                              <button onClick={() => togglePinPost(post.id, true)} className="text-yellow-400 hover:text-yellow-300 p-0.5 flex-shrink-0">
                                <Pin className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Meldinger */}
                  <div className="space-y-2 h-64 lg:h-80 overflow-y-auto mb-3 p-2 bg-slate-900/50 rounded-lg">
                    {liveFeed.filter(p => !p.pinned).length === 0 ? (
                      <p className="text-slate-500 text-center py-8 text-sm">Ingen meldinger ennå</p>
                    ) : (
                      liveFeed.filter(p => !p.pinned).map(post => {
                        const currentUserId = isAdminLoggedIn ? 'admin' : (studioLoggedIn?.id || loggedInDeltaker?.id);
                        const isOwn = post.authorId === currentUserId;
                        const canEdit = isAdminLoggedIn || isOwn;
                        const isEditing = editingLiveFeedId === post.id;
                        
                        return (
                          <div key={post.id} className={`p-2 rounded-lg ${isOwn ? 'bg-cyan-900/30 ml-4' : 'bg-slate-800/50 mr-4'}`}>
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingLiveFeedContent}
                                  onChange={(e) => setEditingLiveFeedContent(e.target.value)}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm resize-y min-h-[120px]"
                                  rows={6}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => { setEditingLiveFeedId(null); setEditingLiveFeedContent(''); }} className="px-2 py-1 text-xs text-slate-400 hover:text-white">Avbryt</button>
                                  <button onClick={() => updateLiveFeedPost(post.id, editingLiveFeedContent)} className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded">Lagre</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-semibold text-cyan-300 text-xs">{post.author || 'Anonym'}</span>
                                    <span className="text-slate-500 text-xs ml-1">{post.time}</span>
                                    {post.editedAt && <span className="text-slate-600 text-xs ml-1">(red.)</span>}
                                  </div>
                                  {canEdit && (
                                    <div className="flex gap-1">
                                      {isAdminLoggedIn && (
                                        <button onClick={() => togglePinPost(post.id, false)} className="text-slate-400 hover:text-yellow-400 p-0.5" title="Fest innlegg">
                                          <Pin className="w-3 h-3" />
                                        </button>
                                      )}
                                      <button onClick={() => { setEditingLiveFeedId(post.id); setEditingLiveFeedContent(post.content); }} className="text-slate-400 hover:text-white p-0.5">
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => deleteLiveFeedPost(post.id)} className="text-red-400 hover:text-red-300 p-0.5">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-white text-sm mt-0.5 whitespace-pre-wrap">{post.content}</p>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  {/* Innlogging/Skriv */}
                  {!studioLoggedIn && !isAdminLoggedIn && !loggedInDeltaker ? (
                    <div className="space-y-2">
                      <p className="text-slate-400 text-xs">Logg inn for å skrive:</p>
                      <input type="text" value={studioLoginNavn} onChange={(e) => setStudioLoginNavn(e.target.value)} placeholder="Lagnavn..." className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
                      <div className="flex gap-2">
                        <input type="password" value={studioLoginPin} onChange={(e) => setStudioLoginPin(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleStudioLogin()} placeholder="PIN..." className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm" />
                        <button onClick={() => handleStudioLogin()} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-sm">→</button>
                      </div>
                      {studioLoginError && <p className="text-red-400 text-xs">{studioLoginError}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-green-400">💬 {isAdminLoggedIn ? 'Admin' : (studioLoggedIn?.navn || loggedInDeltaker?.navn)}</span>
                        {!isAdminLoggedIn && <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logg ut</button>}
                      </div>
                      <ChatInput onSend={sendLiveFeedPost} placeholder="Skriv melding... (Shift+Enter for linjeskift)" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIPPING */}
        {view === 'tipping' && (
          <div className="space-y-4">
            {isEditMode && loggedInDeltaker ? (
              // Redigeringsmodus - innlogget deltaker
              <>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-green-400 flex items-center gap-2">
                        ✏️ Redigerer: {loggedInDeltaker.navn}
                      </h3>
                      <p className="text-xs text-green-200">Du kan endre tips for dager som ikke er åpnet ennå</p>
                    </div>
                    <button 
                      onClick={handleDeltakerLogout}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                    >
                      Logg ut
                    </button>
                  </div>
                </div>

                {/* Link til startlister og odds */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <a 
                    href="https://www.olympics.com/en/milano-cortina-2026/schedule"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-600/30 rounded-lg text-cyan-300 text-sm"
                  >
                    🔍 Startlister (olympics.com)
                  </a>
                  <a 
                    href="https://www.norsk-tipping.no/sport/oddsen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-600/30 rounded-lg text-yellow-300 text-sm"
                  >
                    📊 OL-odds (Norsk Tipping)
                  </a>
                </div>

                {/* Øvelser for redigering */}
                <div className="space-y-2">
                  {Object.entries(øvelserPerDag).map(([dag, øvelser]) => {
                    const kanRedigere = kanRedigereDag(parseInt(dag));
                    return (
                      <div key={dag} className={`rounded-xl border overflow-hidden ${kanRedigere ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}>
                        <button onClick={() => kanRedigere && toggleDay(parseInt(dag))}
                          className={`w-full px-4 py-3 flex items-center justify-between ${kanRedigere ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-800/50 cursor-not-allowed'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-black ${kanRedigere ? 'text-cyan-400' : 'text-slate-500'}`}>Dag {dag}</span>
                            <span className={`text-sm ${kanRedigere ? 'text-blue-300' : 'text-slate-500'}`}>{øvelser[0].dato}</span>
                            {!kanRedigere && (
                              <span className="text-xs bg-red-600/50 text-red-200 px-2 py-0.5 rounded">🔒 Låst</span>
                            )}
                          </div>
                          {kanRedigere && (expandedDays[dag] ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />)}
                        </button>
                        
                        {kanRedigere && expandedDays[dag] && (
                          <div className="p-3 space-y-3">
                            {øvelser.map((ø) => (
                              <div key={ø.idx} className={`rounded-lg p-3 ${SPORT_COLORS[ø.sport]?.light} border ${SPORT_COLORS[ø.sport]?.border}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${SPORT_COLORS[ø.sport]?.bg}`}>
                                    {ø.sport.toUpperCase()}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ø.type === 'lag' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                                    {ø.type === 'lag' ? 'LAG' : 'IND'}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm mb-2">{ø.øvelse}</h4>
                                <div className="grid gap-1.5">
                                  {(ø.type === 'individuell' ? [0,1,2,3,4] : [0,1,2]).map((pos) => (
                                    <AutocompleteInput
                                      key={pos}
                                      value={tips[ø.idx]?.[pos] || ''}
                                      onChange={(val) => {
                                        const newTips = { ...tips };
                                        if (!newTips[ø.idx]) newTips[ø.idx] = ø.type === 'individuell' ? ['','','','',''] : ['','',''];
                                        newTips[ø.idx][pos] = val;
                                        setTips(newTips);
                                      }}
                                      suggestions={getSuggestions(ø.sport, ø.type)}
                                      placeholder={`${pos + 1}. ${pos === 0 ? 'Gull' : pos === 1 ? 'Sølv' : pos === 2 ? 'Bronse' : `plass`}...`}
                                      className={`w-full px-3 py-1.5 text-sm border rounded-lg ${
                                        pos === 0 ? 'bg-yellow-50 border-yellow-300' :
                                        pos === 1 ? 'bg-slate-100 border-slate-300' :
                                        pos === 2 ? 'bg-orange-50 border-orange-300' :
                                        'bg-white border-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Gull-tips (kan redigeres hvis ikke synlig) */}
                {!gullTipsSynlig && (
                  <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-xl p-4 border border-red-600/30">
                    <label className="block text-sm font-bold text-red-300 mb-2">🇳🇴 Hvor mange gull tar Norge totalt?</label>
                    <input type="number" min="0" max="50" value={gullTips} onChange={(e) => setGullTips(e.target.value)}
                      placeholder="Antall gull..." className="w-24 px-3 py-2 bg-slate-900 border border-red-600/50 rounded-lg text-white text-center font-bold text-lg" />
                  </div>
                )}
                {gullTipsSynlig && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4" /> 🇳🇴 Norske gull-tips er låst
                    </p>
                  </div>
                )}

                {/* Lagre endringer */}
                <div className="sticky bottom-4 space-y-2">
                  {editSaveStatus && (
                    <div className={`p-3 rounded-lg text-center ${
                      editSaveStatus.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
                    }`}>
                      {editSaveStatus.message}
                    </div>
                  )}
                  <button onClick={handleSaveEdit}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Lagre endringer
                  </button>
                </div>
              </>
            ) : påmeldingLåst ? (
              // Påmelding er stengt - men kan endre eksisterende tips
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-red-400">Påmeldingen er stengt</h2>
                  <p className="text-slate-300 mb-4 text-sm">
                    Fristen for nye tips har gått ut.
                  </p>
                </div>
                
                {/* Endre mine tips - innlogging */}
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/50">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    ✏️ Allerede sendt inn? Endre dine tips
                  </h3>
                  <p className="text-xs text-blue-200 mb-3">
                    Du kan endre tips for øvelser som ikke har startet ennå.
                  </p>
                  
                  {deltakerLoginError && (
                    <div className="mb-3 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                      {deltakerLoginError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={deltakerLoginNavn}
                      onChange={(e) => setDeltakerLoginNavn(e.target.value)}
                      placeholder="Ditt navn..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                    />
                    <input 
                      type="password" 
                      value={deltakerLoginPin}
                      onChange={(e) => setDeltakerLoginPin(e.target.value)}
                      placeholder="Din 4-sifrede PIN..."
                      maxLength={4}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                    />
                    <button 
                      onClick={handleDeltakerLogin}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    >
                      Logg inn og endre tips
                    </button>
                  </div>
                </div>
              </div>
            ) : submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-green-400">Tips innsendt!</h2>
                <p className="text-blue-200 mb-2">Takk {deltakerNavn}!</p>
                <p className="text-sm text-slate-400 mb-4">Husk PIN-koden din: <span className="font-bold text-yellow-400">{nyPin}</span></p>
                <div className="space-y-3">
                  <button onClick={() => setView('leaderboard')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                    Se leaderboard
                  </button>
                  <div>
                    <button 
                      onClick={() => {
                        setSubmitted(false);
                        setDeltakerLoginNavn(deltakerNavn);
                        setDeltakerLoginPin(nyPin);
                        setShowLoginModal(true);
                      }} 
                      className="text-blue-300 text-sm hover:text-blue-200 underline"
                    >
                      ✏️ Endre mine tips
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Endre tips-knapp for eksisterende deltakere */}
                <div className="bg-blue-900/30 rounded-xl p-3 border border-blue-500/30">
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setDeltakerLoginError('');
                    }}
                    className="w-full text-blue-300 text-sm flex items-center justify-center gap-2 hover:text-blue-200"
                  >
                    ✏️ Allerede sendt inn? Klikk her for å endre dine tips
                  </button>
                </div>

                {/* Innloggingsmodal */}
                {showLoginModal && (
                  <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-blue-400 flex items-center gap-2">
                        🔑 Logg inn for å endre tips
                      </h3>
                      <button 
                        onClick={() => {
                          setShowLoginModal(false);
                          setDeltakerLoginError('');
                          setDeltakerLoginNavn('');
                          setDeltakerLoginPin('');
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {deltakerLoginError && (
                      <div className="mb-3 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                        {deltakerLoginError}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={deltakerLoginNavn}
                        onChange={(e) => setDeltakerLoginNavn(e.target.value)}
                        placeholder="Ditt navn..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                      />
                      <input 
                        type="password" 
                        value={deltakerLoginPin}
                        onChange={(e) => setDeltakerLoginPin(e.target.value)}
                        placeholder="Din 4-sifrede PIN..."
                        maxLength={4}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                      />
                      <button 
                        onClick={handleDeltakerLogin}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                      >
                        Logg inn
                      </button>
                    </div>
                  </div>
                )}

                {/* Navn og PIN */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Lagnavn:</label>
                  <input type="text" value={deltakerNavn} onChange={(e) => setDeltakerNavn(e.target.value)}
                    placeholder="Skriv lagnavn..." className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white mb-3" />
                  
                  <label className="block text-sm font-bold text-yellow-400 mb-2">Velg en 4-sifret PIN-kode:</label>
                  <p className="text-xs text-slate-400 mb-2">Du trenger denne for å kunne endre tipsene dine senere</p>
                  <input 
                    type="password" 
                    value={nyPin} 
                    onChange={(e) => setNyPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="F.eks. 1234" 
                    maxLength={4}
                    className="w-32 px-3 py-2 bg-slate-900 border border-yellow-600/50 rounded-lg text-white text-center font-bold text-lg" 
                  />
                </div>

                {/* Link til startlister og odds */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <a 
                    href="https://www.olympics.com/en/milano-cortina-2026/schedule"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-600/30 rounded-lg text-cyan-300 text-sm"
                  >
                    🔍 Startlister (olympics.com)
                  </a>
                  <a 
                    href="https://www.norsk-tipping.no/sport/oddsen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-600/30 rounded-lg text-yellow-300 text-sm"
                  >
                    📊 OL-odds (Norsk Tipping)
                  </a>
                </div>

                {/* Øvelser */}
                <div className="space-y-2">
                  {Object.entries(øvelserPerDag).map(([dag, øvelser]) => (
                    <div key={dag} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                      <button onClick={() => toggleDay(parseInt(dag))}
                        className="w-full px-4 py-3 flex items-center justify-between bg-slate-700/50 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-cyan-400">Dag {dag}</span>
                          <span className="text-blue-300 text-sm">{øvelser[0].dato}</span>
                          <span className="text-xs text-slate-400 bg-slate-600 px-2 py-0.5 rounded">{øvelser.length}</span>
                        </div>
                        {expandedDays[dag] ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>
                      
                      {expandedDays[dag] && (
                        <div className="p-3 space-y-3">
                          {øvelser.map((ø) => (
                            <div key={ø.idx} className={`rounded-lg p-3 ${SPORT_COLORS[ø.sport]?.light} border ${SPORT_COLORS[ø.sport]?.border}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${SPORT_COLORS[ø.sport]?.bg}`}>
                                  {ø.sport.toUpperCase()}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ø.type === 'lag' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                                  {ø.type === 'lag' ? 'LAG (3)' : 'INDIVIDUELL (5)'}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 mb-2 text-sm">{ø.øvelse}</h4>
                              
                              <div className="space-y-1.5">
                                {tips[ø.idx]?.map((_, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white ${
                                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-600' : 'bg-slate-500'
                                    }`}>{i + 1}</span>
                                    <AutocompleteInput
                                      value={tips[ø.idx]?.[i] || ''}
                                      onChange={(val) => handleTipsChange(ø.idx, i, val)}
                                      suggestions={getSuggestions(ø.sport, ø.type)}
                                      placeholder={ø.type === 'lag' ? 'Nasjon' : 'Utøver (fritekst OK)'}
                                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Norske gull - NEDERST (skjules hvis allerede synlig/låst) */}
                {!gullTipsSynlig && (
                  <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-xl p-4 border border-red-600/30">
                    <label className="block text-sm font-bold text-red-300 mb-2">🇳🇴 Hvor mange gull tar Norge totalt?</label>
                    <p className="text-xs text-red-200 mb-2">Eksakt: 30p | Bommer med 1: 20p | Bommer med 2: 10p</p>
                    <input type="number" min="0" max="50" value={gullTips} onChange={(e) => setGullTips(e.target.value)}
                      placeholder="Antall gull..." className="w-24 px-3 py-2 bg-slate-900 border border-red-600/50 rounded-lg text-white text-center font-bold text-lg" />
                  </div>
                )}
                {gullTipsSynlig && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4" /> 🇳🇴 Norske gull-tips er låst
                    </p>
                  </div>
                )}

                {/* Send inn eller eksporter */}
                <div className="sticky bottom-4 space-y-2">
                  <button onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Send inn tips
                  </button>
                  <button 
                    onClick={() => downloadFilledExcel(deltakerNavn, tips, gullTips)}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" /> Eksporter til Excel (fortsett senere)
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Eksporter det du har fylt ut og send på mail til admin
                  </p>
                </div>
              </>
            )}
          </div>
        )}


        {/* LEADERBOARD */}
        {view === 'leaderboard' && (
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-xl font-black text-yellow-400">🏆 LEADERBOARD</h2>
              {sisteOppdaterteDag > 0 ? (
                <p className="text-sm text-slate-400 mt-1">
                  {leaderboardView === 'total' 
                    ? `Sammenlagt etter Dag ${sisteOppdaterteDag}` 
                    : `Dag ${leaderboardView} av 16`}
                </p>
              ) : (
                <p className="text-sm text-slate-400 mt-1">Ingen resultater registrert ennå</p>
              )}
            </div>
            
            {/* Dag-velger */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              <button
                onClick={() => { setLeaderboardView('total'); setExpandedLeaderboardDeltaker(null); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap ${
                  leaderboardView === 'total' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Sammenlagt
              </button>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(dag => {
                const harResultat = øvelserPerDag[dag]?.some(ø => resultater[ø.idx]?.some(r => r?.trim()));
                return (
                  <button
                    key={dag}
                    onClick={() => { setLeaderboardView(dag); setExpandedLeaderboardDeltaker(null); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-1 ${
                      leaderboardView === dag ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Dag {dag}
                    {harResultat && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                  </button>
                );
              })}
            </div>
            
            {leaderboard.length === 0 ? (
              <p className="text-center text-slate-400 py-8">Ingen tips ennå</p>
            ) : (
              <div className="space-y-2">
                {(leaderboardView === 'total' ? leaderboard : getLeaderboardForDay(leaderboardView)).map((d, idx, arr) => {
                  const isExpanded = expandedLeaderboardDeltaker === d.id;
                  const poengPerDag = beregnPoengPerDag(d);
                  const { plass, delt } = getLeaderboardPlassering(arr, idx);
                  
                  return (
                    <div key={d.id} className={`rounded-xl border overflow-hidden ${
                      plass === 1 ? 'bg-yellow-900/30 border-yellow-500/50' :
                      plass === 2 ? 'bg-slate-700/30 border-slate-400/50' :
                      plass === 3 ? 'bg-orange-900/30 border-orange-600/50' :
                      'bg-slate-800/50 border-slate-700'
                    }`}>
                      <button
                        onClick={() => setExpandedLeaderboardDeltaker(isExpanded ? null : d.id)}
                        className="w-full flex items-center gap-3 p-3"
                      >
                        <div className={`w-9 h-9 flex items-center justify-center rounded-full font-black text-sm ${
                          plass === 1 ? 'bg-yellow-500 text-yellow-900' :
                          plass === 2 ? 'bg-slate-300 text-slate-700' :
                          plass === 3 ? 'bg-orange-500 text-orange-900' : 'bg-slate-600 text-white'
                        }`}>{delt ? '=' : ''}{plass}</div>
                        <div className="flex-1 text-left">
                          <h3 className="font-bold text-white">
                            {d.navn}
                            {d.faktiskNavn && d.faktiskNavn !== d.navn && (
                              <span className="font-normal text-slate-400 text-sm ml-2">({d.faktiskNavn})</span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {gullTipsSynlig ? (
                              <>
                                Gull-tips: {d.gullTips} 🇳🇴
                                {leaderboardView === 'total' && d.gullBonus > 0 && (
                                  <span className="text-yellow-400 ml-2">(+{d.gullBonus}p bonus!)</span>
                                )}
                              </>
                            ) : (
                              <span className="text-slate-500">Gull-tips: Skjult</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-cyan-400">{d.poeng}p</div>
                          {leaderboardView === 'total' && d.gullBonus > 0 && gullTipsSynlig && (
                            <div className="text-xs text-slate-400">{d.øvelsePoeng} + {d.gullBonus}🥇</div>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-slate-600 p-3 bg-slate-900/50">
                          {leaderboardView === 'total' ? (
                            // Sammenlagt: Vis poeng per dag
                            <div>
                              <p className="text-xs text-slate-400 mb-2 font-semibold">Poeng per dag:</p>
                              <div className="grid grid-cols-4 gap-1">
                                {Array.from({ length: 16 }, (_, i) => i + 1).map(dag => (
                                  <div key={dag} className={`text-center p-1 rounded ${poengPerDag[dag] > 0 ? 'bg-cyan-900/30' : 'bg-slate-800/50'}`}>
                                    <div className="text-xs text-slate-400">D{dag}</div>
                                    <div className={`text-sm font-bold ${poengPerDag[dag] > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                                      {poengPerDag[dag]}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            // Dag-visning: Vis tips og poeng per øvelse
                            <div>
                              <p className="text-xs text-slate-400 mb-2 font-semibold">Øvelser dag {leaderboardView}:</p>
                              {(() => {
                                const dagHarResultat = øvelserPerDag[leaderboardView]?.some(ø => resultater[ø.idx]?.some(r => r?.trim()));
                                const dagErSynlig = synligeDager[leaderboardView] || dagHarResultat;
                                
                                if (!dagErSynlig) {
                                  return (
                                    <div className="text-center py-4 text-slate-500">
                                      <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">Tips for denne dagen er skjult</p>
                                      <p className="text-xs">Vises når resultater er registrert</p>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div className="space-y-2">
                                    {øvelserPerDag[leaderboardView]?.map(ø => {
                                      const øvelseInfo = beregnØvelsePoeng(d, ø.idx);
                                      const hasResult = resultater[ø.idx] && resultater[ø.idx].some(r => r?.trim());
                                      
                                      return (
                                        <div key={ø.idx} className="bg-slate-800/50 rounded p-2">
                                          <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs text-white font-semibold flex-1">{ø.øvelse}</p>
                                            <span className={`text-sm font-bold ${øvelseInfo.poeng > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                                              {hasResult ? `${øvelseInfo.poeng}p` : '-'}
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {øvelseInfo.detaljer.map((det, i) => (
                                              <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                                                det.totalPoeng > 0 ? 'bg-green-600/30 text-green-200' :
                                                det.faktiskPos ? 'bg-blue-600/30 text-blue-200' :
                                                'bg-slate-700/50 text-slate-400'
                                              }`}>
                                                {det.tippPos}. {det.tip}
                                                {det.totalPoeng > 0 && ` (+${det.totalPoeng})`}
                                              </span>
                                            ))}
                                          </div>
                                          {hasResult && (
                                            <div className="mt-1 pt-1 border-t border-slate-700">
                                              <p className="text-xs text-slate-500">
                                                Resultat: {formaterResultatMedDelt(ø.idx, ø.type)}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ADMIN */}
        {view === 'admin' && (
          <div className="space-y-4">
            {!isAdminLoggedIn ? (
              <div className="max-w-sm mx-auto bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <Lock className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-white text-center mb-4">Admin</h2>
                <div className="relative mb-3">
                  <input type={showPassword ? 'text' : 'password'} value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (adminPassword === ADMIN_PASSWORD ? (setIsAdminLoggedIn(true), setAdminError('')) : setAdminError('Feil!'))}
                    placeholder="Passord..." className="w-full px-4 py-2 pr-10 bg-slate-900 border border-slate-600 rounded-lg text-white" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {adminError && <p className="text-red-400 text-sm mb-2">{adminError}</p>}
                <button onClick={() => adminPassword === ADMIN_PASSWORD ? (setIsAdminLoggedIn(true), setAdminError('')) : setAdminError('Feil passord!')}
                  className="w-full py-2 bg-cyan-600 text-white rounded-lg font-semibold">Logg inn</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-400" /> Admin
                  </h2>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="text-red-400 text-sm flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Logg ut
                  </button>
                </div>

                {/* Lås påmelding */}
                <div className={`rounded-xl p-4 border ${påmeldingLåst ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        🔒 Lås påmelding
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {påmeldingLåst 
                          ? 'Påmelding er stengt - ingen kan sende inn tips via nettsiden' 
                          : 'Påmelding er åpen - deltakere kan sende inn tips'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const nyVerdi = !påmeldingLåst;
                        setPåmeldingLåst(nyVerdi);
                        saveSynlighetToFirebase(synligeDager, gullTipsSynlig, nyVerdi);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                        påmeldingLåst ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                      }`}
                    >
                      {påmeldingLåst ? (
                        <><Lock className="w-4 h-4" /> Låst</>
                      ) : (
                        <><Eye className="w-4 h-4" /> Åpen</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Excel opplasting */}
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-600/30">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Last opp deltaker (Excel)
                  </h3>
                  <p className="text-xs text-green-200 mb-3">
                    Last opp utfylte Excel-skjemaer fra deltakere. Systemet leser navn, tips og gull-tips automatisk fra filen.
                  </p>
                  
                  {/* Status-melding */}
                  {uploadStatus && (
                    <div className={`mb-3 p-3 rounded-lg text-sm ${
                      uploadStatus.type === 'loading' ? 'bg-blue-900/50 text-blue-200' :
                      uploadStatus.type === 'success' ? 'bg-green-900/50 text-green-200' :
                      'bg-red-900/50 text-red-200'
                    }`}>
                      {uploadStatus.type === 'loading' && '⏳ '}
                      {uploadStatus.type === 'success' && '✅ '}
                      {uploadStatus.type === 'error' && '❌ '}
                      {uploadStatus.message}
                    </div>
                  )}
                  
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span className="font-semibold">Velg Excel-fil (.xlsx)</span>
                    <input 
                      type="file" 
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setUploadStatus({ type: 'loading', message: `Leser ${file.name}...` });
                        
                        try {
                          await parseExcelFile(file, async (result) => {
                            console.log('Parse result:', result);
                            
                            if (!result.success) {
                              setUploadStatus({ type: 'error', message: 'Kunne ikke lese filen: ' + result.error });
                              return;
                            }
                            
                            if (!result.navn) {
                              setUploadStatus({ type: 'error', message: `Fant ikke navn i filen! Sjekk at navnet er fylt inn i celle B3. (Fant ${result.debug?.øvelseCounter || 0} øvelser)` });
                              return;
                            }
                            
                            if (alleTips.some(t => t.navn.toLowerCase() === result.navn.toLowerCase())) {
                              setUploadStatus({ type: 'error', message: `Deltaker "${result.navn}" er allerede registrert!` });
                              return;
                            }
                            
                            // Tell antall utfylte tips
                            let utfylteTips = 0;
                            Object.values(result.tips).forEach(tipsArray => {
                              tipsArray.forEach(t => { if (t && t.trim()) utfylteTips++; });
                            });
                            
                            // Fyll ut manglende tips med tomme arrays
                            const fullTips = {};
                            OL_PROGRAM.forEach((ø, idx) => {
                              fullTips[idx] = result.tips[idx] || (ø.type === 'individuell' ? ['','','','',''] : ['','','']);
                            });
                            
                            // Generer PIN for deltakeren
                            const deltakerPin = genererPin(result.navn);
                            
                            const nyDeltaker = {
                              id: Date.now().toString(),
                              navn: result.navn,
                              tips: fullTips,
                              gullTips: result.gullTips || 0,
                              pin: deltakerPin,
                              innsendt: new Date().toLocaleString('no-NO') + ' (Excel)',
                            };
                            
                            const success = await addDeltakerToFirebase(nyDeltaker);
                            if (success) {
                              setUploadStatus({ 
                                type: 'success', 
                                message: `${result.navn} lagt til! PIN: ${deltakerPin} | Gull-tips: ${result.gullTips}, Utfylte tips: ${utfylteTips}` 
                              });
                            } else {
                              setUploadStatus({ type: 'error', message: 'Kunne ikke lagre til database' });
                            }
                            
                            // Fjern suksess-melding etter 8 sekunder (litt lenger for å notere PIN)
                            setTimeout(() => setUploadStatus(null), 8000);
                          });
                        } catch (err) {
                          setUploadStatus({ type: 'error', message: 'Feil ved lesing av fil: ' + err.message });
                        }
                        
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">
                    Støtter .xlsx-filer fra det offisielle tippeskjemaet.
                  </p>
                </div>

                {/* Info om ukjente navn - ikke et varsel, bare info */}
                {getTotalWarnings() > 0 && (
                  <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4">
                    <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-2">
                      <List className="w-5 h-5" /> {getTotalWarnings()} navn utenfor autocomplete-listen
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      Dette er bare en oversikt over navn som ikke finnes i autocomplete-listen. 
                      Det betyr <strong>ikke</strong> at tipsene er feil - bare at navnene ikke vil få autocomplete-støtte.
                    </p>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-slate-400 hover:text-slate-300">Vis detaljer</summary>
                      <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                        {alleTips.map(d => {
                          const unknowns = getUnknownNames(d);
                          if (unknowns.length === 0) return null;
                          return (
                            <div key={d.id} className="text-xs">
                              <span className="font-semibold text-slate-300">{d.navn}:</span>
                              {unknowns.slice(0, 5).map((u, i) => (
                                <span key={i} className="ml-2 text-slate-400">"{u.navn}"</span>
                              ))}
                              {unknowns.length > 5 && <span className="ml-2 text-slate-500">+{unknowns.length - 5} til</span>}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-cyan-400">{alleTips.length}</div>
                    <div className="text-xs text-slate-400">Deltakere</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-green-400">{alleTips.length * 200},-</div>
                    <div className="text-xs text-slate-400">Pott</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-black text-yellow-400">
                      {Object.values(resultater).filter(r => r && r.some(v => v?.trim())).length}
                    </div>
                    <div className="text-xs text-slate-400">Resultater</div>
                  </div>
                </div>

                {/* Deltakerliste med navn-redigering */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-cyan-400 mb-3">📋 Deltakere - Lagnavn & Navn ({alleTips.length})</h3>
                  <p className="text-xs text-slate-400 mb-3">Klikk på en deltaker for å redigere lagnavn og faktisk navn</p>
                  {alleTips.length === 0 ? (
                    <p className="text-slate-400 text-sm">Ingen deltakere enda</p>
                  ) : (
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {alleTips.map((d, idx) => {
                        const isEditing = editingNavnId === d.id;
                        const isConfirmingDelete = deleteConfirmId === d.id;
                        
                        return (
                          <div key={d.id} className={`p-2 rounded-lg text-sm ${
                            isEditing ? 'bg-cyan-600/30 border border-cyan-500' : 'bg-slate-700/50'
                          }`}>
                            {isConfirmingDelete ? (
                              // Bekreftelsesvisning for sletting
                              <div className="flex items-center justify-between">
                                <span className="text-red-300 text-xs">Slette {d.navn}?</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={async () => {
                                      await deleteDeltakerFromFirebase(d.id);
                                      setDeleteConfirmId(null);
                                    }}
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded font-semibold"
                                  >
                                    Ja, slett
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 bg-slate-600 text-white text-xs rounded"
                                  >
                                    Avbryt
                                  </button>
                                </div>
                              </div>
                            ) : isEditing ? (
                              // Redigeringsmodus
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <label className="text-xs text-cyan-300 block mb-1">Lagnavn:</label>
                                    <input
                                      type="text"
                                      value={editLagnavn}
                                      onChange={(e) => setEditLagnavn(e.target.value)}
                                      className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-xs text-cyan-300 block mb-1">Faktisk navn:</label>
                                    <input
                                      type="text"
                                      value={editFaktiskNavn}
                                      onChange={(e) => setEditFaktiskNavn(e.target.value)}
                                      className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                                      placeholder="F.eks. Ola Nordmann"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={async () => {
                                      const success = await updateDeltakerNavnInFirebase(d.id, editLagnavn, editFaktiskNavn);
                                      if (success) {
                                        setEditingNavnId(null);
                                      }
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded font-semibold"
                                  >
                                    Lagre
                                  </button>
                                  <button
                                    onClick={() => setEditingNavnId(null)}
                                    className="px-3 py-1 bg-slate-600 text-white text-xs rounded"
                                  >
                                    Avbryt
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Normal visning
                              <div className="flex items-center justify-between">
                                <button 
                                  onClick={() => {
                                    setEditingNavnId(d.id);
                                    setEditLagnavn(d.navn);
                                    setEditFaktiskNavn(d.faktiskNavn || '');
                                  }}
                                  className="flex-1 text-left hover:opacity-80"
                                >
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <span className="font-semibold text-white">{d.navn}</span>
                                      {d.faktiskNavn && (
                                        <span className="text-slate-400 ml-2">({d.faktiskNavn})</span>
                                      )}
                                      {!d.faktiskNavn && (
                                        <span className="text-yellow-500 text-xs ml-2">⚠️ Mangler navn</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDeltaker(selectedDeltaker?.id === d.id ? null : d);
                                      setEditingDeltaker(null);
                                    }}
                                    className={`px-2 py-1 text-xs rounded font-semibold ${
                                      selectedDeltaker?.id === d.id 
                                        ? 'bg-cyan-600 text-white' 
                                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                                    }`}
                                    title="Rediger tips"
                                  >
                                    ✏️ Tips
                                  </button>
                                  <span className="text-xs text-yellow-400" title="PIN-kode">🔑 {d.pin || genererPin(d.navn)}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmId(d.id);
                                    }}
                                    className="p-1 text-red-400 hover:bg-red-600/30 rounded"
                                    title="Slett deltaker"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Valgt deltaker */}
                {selectedDeltaker && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white">📋 {selectedDeltaker.navn}</h3>
                      <div className="flex gap-2">
                        {editingDeltaker?.id === selectedDeltaker.id ? (
                          <>
                            <button
                              onClick={async () => {
                                // Lagre endringer til Firebase
                                try {
                                  await setDoc(doc(db, 'deltakere', editingDeltaker.id), editingDeltaker);
                                  setSelectedDeltaker(editingDeltaker);
                                  setEditingDeltaker(null);
                                  setSaveStatus({ type: 'success', message: 'Tips oppdatert!' });
                                  setTimeout(() => setSaveStatus(null), 3000);
                                } catch (e) {
                                  console.error('Feil ved lagring:', e);
                                  setSaveStatus({ type: 'error', message: 'Kunne ikke lagre: ' + e.message });
                                }
                              }}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded font-semibold"
                            >
                              💾 Lagre
                            </button>
                            <button
                              onClick={() => setEditingDeltaker(null)}
                              className="text-xs px-2 py-1 bg-slate-600 text-white rounded"
                            >
                              Avbryt
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingDeltaker({ ...selectedDeltaker, tips: { ...selectedDeltaker.tips } })}
                              className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                            >
                              ✏️ Rediger tips
                            </button>
                            <button
                              onClick={() => setSelectedDeltaker(null)}
                              className="text-xs px-2 py-1 bg-slate-600 text-white rounded"
                            >
                              Lukk
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingDeltaker?.id === selectedDeltaker.id ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span>Gull-tips 🇳🇴:</span>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={editingDeltaker.gullTips || ''}
                          onChange={(e) => setEditingDeltaker({ ...editingDeltaker, gullTips: e.target.value })}
                          className="w-16 px-2 py-1 bg-slate-900 border border-blue-500 rounded text-white text-center"
                        />
                        <span className="text-slate-500">| Innsendt: {selectedDeltaker.innsendt}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mb-3">Gull-tips: {selectedDeltaker.gullTips} 🇳🇴 | Innsendt: {selectedDeltaker.innsendt}</p>
                    )}
                    
                    {getUnknownNames(selectedDeltaker).length > 0 && !editingDeltaker && (
                      <div className="bg-yellow-900/30 rounded-lg p-2 mb-3">
                        <p className="text-xs text-yellow-300 font-semibold mb-1">⚠️ Ukjente navn:</p>
                        {getUnknownNames(selectedDeltaker).map((u, i) => (
                          <p key={i} className="text-xs text-yellow-100">• {u.pos}. "{u.navn}" - {u.øvelse}</p>
                        ))}
                      </div>
                    )}
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {Object.entries(øvelserPerDag).map(([dag, øvelser]) => (
                        <div key={dag} className="bg-slate-700/50 rounded p-2">
                          <p className="text-xs font-bold text-cyan-400 mb-1">Dag {dag}</p>
                          {øvelser.map((ø) => (
                            <div key={ø.idx} className="mb-1">
                              <p className="text-xs text-slate-400">{ø.øvelse}</p>
                              <div className="flex flex-wrap gap-1">
                                {editingDeltaker?.id === selectedDeltaker.id ? (
                                  // Redigeringsmodus
                                  (ø.type === 'individuell' ? [0,1,2,3,4] : [0,1,2]).map((i) => (
                                    <ResultatInput
                                      key={i}
                                      value={editingDeltaker.tips[ø.idx]?.[i] || ''}
                                      onChange={(val) => {
                                        const newTips = { ...editingDeltaker.tips };
                                        if (!newTips[ø.idx]) newTips[ø.idx] = ø.type === 'individuell' ? ['','','','',''] : ['','',''];
                                        newTips[ø.idx] = [...newTips[ø.idx]];
                                        newTips[ø.idx][i] = val;
                                        setEditingDeltaker({ ...editingDeltaker, tips: newTips });
                                      }}
                                      suggestions={getSuggestions(ø.sport, ø.type)}
                                      placeholder={`${i+1}.`}
                                      className="w-24 px-2 py-1 bg-slate-800 border border-blue-500 rounded text-xs text-white"
                                    />
                                  ))
                                ) : (
                                  // Visningsmodus
                                  selectedDeltaker.tips[ø.idx]?.map((t, i) => {
                                    const isUnknown = t && t.trim() && !isKnownName(t, ø.sport, ø.type);
                                    return (
                                      <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                                        !t ? 'bg-slate-600/30 text-slate-500' :
                                        isUnknown ? 'bg-yellow-600/30 text-yellow-200 border border-yellow-500/50' :
                                        'bg-blue-600/30 text-blue-200'
                                      }`}>
                                        {i + 1}. {t || '-'}
                                      </span>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resultat-registrering */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-yellow-400 mb-3">🏅 Registrer resultater</h3>
                  
                  {/* Norske gull totalt */}
                  <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-600/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-yellow-400 flex items-center gap-2">
                          🇳🇴 Norske gull totalt
                        </h4>
                        <p className="text-xs text-yellow-200/70 mt-1">
                          Faktisk antall norske gullmedaljer (oppdater etter hvert)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={norskeGullResultat}
                          onChange={(e) => setNorskeGullResultat(e.target.value)}
                          placeholder="?"
                          className="w-20 px-3 py-2 bg-slate-800 border border-yellow-600 rounded-lg text-center text-2xl font-bold text-yellow-400"
                        />
                        <span className="text-yellow-400 text-2xl">🥇</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dag-velger */}
                  <div className="flex gap-1 overflow-x-auto pb-3 mb-3 border-b border-slate-600">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(dag => {
                      const harResultater = øvelserPerDag[dag]?.some(ø => resultater[ø.idx]?.some(r => r?.trim()));
                      return (
                        <button
                          key={dag}
                          onClick={() => setAdminResultatDag(dag)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-1 ${
                            adminResultatDag === dag ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          Dag {dag}
                          {harResultater && <span className="w-2 h-2 bg-green-400 rounded-full"></span>}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Øvelser for valgt dag */}
                  <div className="space-y-3">
                    {øvelserPerDag[adminResultatDag]?.map((ø) => (
                      <div key={ø.idx} className="bg-slate-700/50 rounded p-3">
                        <p className="text-sm text-white font-semibold mb-2">{ø.øvelse}</p>
                        <p className="text-xs text-slate-400 mb-2">
                          {ø.type === 'individuell' ? '5 plasser (utøvere)' : '3 plasser (nasjoner)'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {(ø.type === 'individuell' ? [1,2,3,4,5] : [1,2,3]).map((pos) => {
                            const erDelt = deltePlasser[ø.idx]?.includes(pos);
                            const forrigeDelt = deltePlasser[ø.idx]?.includes(pos - 1);
                            return (
                              <div key={pos} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                                    pos === 1 ? 'bg-yellow-500 text-yellow-900' :
                                    pos === 2 ? 'bg-slate-300 text-slate-700' :
                                    pos === 3 ? 'bg-orange-500 text-orange-900' :
                                    'bg-slate-600 text-white'
                                  }`}>{pos}</span>
                                  <ResultatInput
                                    value={resultater[ø.idx]?.[pos-1] || ''}
                                    onChange={(val) => {
                                      const newRes = [...(resultater[ø.idx] || [])];
                                      newRes[pos-1] = val;
                                      setResultater(p => ({ ...p, [ø.idx]: newRes }));
                                    }}
                                    suggestions={getSuggestions(ø.sport, ø.type)}
                                    placeholder={forrigeDelt ? '(tom - delt over)' : pos === 1 ? 'Gull...' : pos === 2 ? 'Sølv...' : pos === 3 ? 'Bronse...' : `${pos}. plass...`}
                                    className={`flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white ${forrigeDelt ? 'opacity-50' : ''}`}
                                  />
                                </div>
                                {/* Delt plass checkbox - ikke på siste plass */}
                                {pos < (ø.type === 'individuell' ? 5 : 3) && (
                                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer ml-8">
                                    <input
                                      type="checkbox"
                                      checked={erDelt}
                                      onChange={(e) => {
                                        const current = deltePlasser[ø.idx] || [];
                                        if (e.target.checked) {
                                          setDeltePlasser(p => ({ ...p, [ø.idx]: [...current, pos] }));
                                        } else {
                                          setDeltePlasser(p => ({ ...p, [ø.idx]: current.filter(p => p !== pos) }));
                                        }
                                      }}
                                      className="w-3 h-3 rounded border-slate-500 bg-slate-800 text-cyan-500"
                                    />
                                    Delt {pos}. plass
                                  </label>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Lagre-knapp med status */}
                  <div className="mt-4 pt-3 border-t border-slate-600">
                    {saveStatus && (
                      <div className={`mb-3 p-2 rounded-lg text-sm text-center ${
                        saveStatus.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'
                      }`}>
                        {saveStatus.type === 'success' ? '✅ ' : '❌ '}
                        {saveStatus.message}
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400">
                        Klikk for å lagre til databasen
                      </p>
                      <button
                        onClick={saveResultaterToFirebase}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm"
                      >
                        💾 Lagre resultater
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-slate-500 text-xs pb-20 lg:pb-4">
        OL-Konkurranse 2026 • Milano-Cortina 🇮🇹
      </footer>

      {/* Flytende chat-knapp på mobil */}
      <button
        onClick={() => setShowMobileChat(true)}
        className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
        {liveFeed.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {liveFeed.length > 9 ? '9+' : liveFeed.length}
          </span>
        )}
      </button>

      {/* Mobil chat modal */}
      {showMobileChat && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="bg-slate-900 flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              OL Live ({liveFeed.length})
            </h3>
            <button onClick={() => setShowMobileChat(false)} className="text-slate-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Festede innlegg */}
          {liveFeed.filter(p => p.pinned).length > 0 && (
            <div className="p-3 border-b border-slate-700 bg-yellow-900/20">
              {liveFeed.filter(p => p.pinned).map(post => (
                <div key={post.id} className="flex items-start gap-2">
                  <Pin className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">{post.content}</p>
                    <p className="text-xs text-yellow-400/70 mt-1">{post.author} • {post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {liveFeed.filter(p => !p.pinned).length === 0 ? (
              <p className="text-slate-500 text-center py-8">Ingen meldinger ennå</p>
            ) : (
              liveFeed.filter(p => !p.pinned).map(post => {
                const currentUserId = isAdminLoggedIn ? 'admin' : (studioLoggedIn?.id || loggedInDeltaker?.id);
                const isOwn = post.authorId === currentUserId;
                
                return (
                  <div key={post.id} className={`p-2 rounded-lg ${isOwn ? 'bg-cyan-900/30 ml-8' : 'bg-slate-800/50 mr-8'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-xs font-semibold">{post.author || 'Anonym'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">{post.time}</span>
                        {(isAdminLoggedIn || isOwn) && (
                          <button onClick={() => deleteLiveFeedPost(post.id)} className="text-red-400 hover:text-red-300">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-white text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input boks */}
          <div className="p-4 border-t border-slate-700 bg-slate-900">
            {!studioLoggedIn && !isAdminLoggedIn && !loggedInDeltaker ? (
              <div className="space-y-2">
                <p className="text-slate-400 text-xs">Logg inn for å skrive:</p>
                <div className="flex gap-2">
                  <input type="text" value={studioLoginNavn} onChange={(e) => setStudioLoginNavn(e.target.value)} placeholder="Lagnavn..." className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm" />
                  <input type="password" value={studioLoginPin} onChange={(e) => setStudioLoginPin(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleStudioLogin()} placeholder="PIN..." className="w-20 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm" />
                  <button onClick={() => handleStudioLogin()} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">→</button>
                </div>
                {studioLoginError && <p className="text-red-400 text-xs">{studioLoginError}</p>}
              </div>
            ) : (
              <ChatInput onSend={sendLiveFeedPost} placeholder="Skriv melding... (Shift+Enter for linjeskift)" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
