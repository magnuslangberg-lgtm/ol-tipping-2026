'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, Calendar, ChevronDown, ChevronUp, Send, Eye, EyeOff, Mountain, Flag, CheckCircle, AlertCircle, Lock, LogOut, User, FileText, AlertTriangle, List, X, Download, Upload, Trash2 } from 'lucide-react';
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
    [3, 'Freeski, slopestyle - menn', 'IND'],
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
  data.push(['Poeng: Nærmest 30p | 2. 20p | 3. 15p | 4. 10p | 5. 5p']);
  
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
  { dag: 1, dato: "Lør 7. feb", øvelse: "Langrenn, 20 km skiathlon - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 1, dato: "Lør 7. feb", øvelse: "Hopp, normal bakke - kvinner", type: "individuell", sport: "hopp" },
  { dag: 1, dato: "Lør 7. feb", øvelse: "Alpint, utfor - menn", type: "individuell", sport: "alpint" },
  { dag: 1, dato: "Lør 7. feb", øvelse: "Skøyter, 3000m - kvinner", type: "individuell", sport: "skøyter" },
  { dag: 1, dato: "Lør 7. feb", øvelse: "Snowboard, big air - menn", type: "individuell", sport: "snowboard" },
  
  // DAG 2 - Søndag 8. februar
  { dag: 2, dato: "Søn 8. feb", øvelse: "Langrenn, 20 km skiathlon - menn", type: "individuell", sport: "langrenn" },
  { dag: 2, dato: "Søn 8. feb", øvelse: "Skiskyting, mixed stafett", type: "lag", sport: "skiskyting" },
  { dag: 2, dato: "Søn 8. feb", øvelse: "Alpint, utfor - kvinner", type: "individuell", sport: "alpint" },
  { dag: 2, dato: "Søn 8. feb", øvelse: "Skøyter, 5000m - menn", type: "individuell", sport: "skøyter" },
  
  // DAG 3 - Mandag 9. februar
  { dag: 3, dato: "Man 9. feb", øvelse: "Alpint, lagkombinasjon - menn", type: "lag", sport: "alpint" },
  { dag: 3, dato: "Man 9. feb", øvelse: "Hopp, normal bakke - menn", type: "individuell", sport: "hopp" },
  { dag: 3, dato: "Man 9. feb", øvelse: "Freeski, slopestyle - menn", type: "individuell", sport: "freeski" },
  
  // DAG 4 - Tirsdag 10. februar
  { dag: 4, dato: "Tir 10. feb", øvelse: "Alpint, lagkombinasjon - kvinner", type: "lag", sport: "alpint" },
  { dag: 4, dato: "Tir 10. feb", øvelse: "Langrenn, sprint - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 4, dato: "Tir 10. feb", øvelse: "Langrenn, sprint - menn", type: "individuell", sport: "langrenn" },
  { dag: 4, dato: "Tir 10. feb", øvelse: "Skiskyting, 20 km - menn", type: "individuell", sport: "skiskyting" },
  { dag: 4, dato: "Tir 10. feb", øvelse: "Hopp, lagkonkurranse mixed", type: "lag", sport: "hopp" },
  
  // DAG 5 - Onsdag 11. februar
  { dag: 5, dato: "Ons 11. feb", øvelse: "Alpint, super-G - menn", type: "individuell", sport: "alpint" },
  { dag: 5, dato: "Ons 11. feb", øvelse: "Skiskyting, 15 km - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 5, dato: "Ons 11. feb", øvelse: "Kombinert, normal bakke/10 km - menn", type: "individuell", sport: "kombinert" },
  
  // DAG 6 - Torsdag 12. februar
  { dag: 6, dato: "Tor 12. feb", øvelse: "Alpint, super-G - kvinner", type: "individuell", sport: "alpint" },
  { dag: 6, dato: "Tor 12. feb", øvelse: "Langrenn, 10 km fri - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 6, dato: "Tor 12. feb", øvelse: "Snowboard, slopestyle - menn", type: "individuell", sport: "snowboard" },
  
  // DAG 7 - Fredag 13. februar
  { dag: 7, dato: "Fre 13. feb", øvelse: "Skiskyting, 10 km sprint - menn", type: "individuell", sport: "skiskyting" },
  { dag: 7, dato: "Fre 13. feb", øvelse: "Langrenn, 10 km fri - menn", type: "individuell", sport: "langrenn" },
  { dag: 7, dato: "Fre 13. feb", øvelse: "Skøyter, 10000m - menn", type: "individuell", sport: "skøyter" },
  
  // DAG 8 - Lørdag 14. februar
  { dag: 8, dato: "Lør 14. feb", øvelse: "Alpint, storslalåm - menn", type: "individuell", sport: "alpint" },
  { dag: 8, dato: "Lør 14. feb", øvelse: "Skiskyting, 7,5 km sprint - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 8, dato: "Lør 14. feb", øvelse: "Langrenn, stafett - kvinner", type: "lag", sport: "langrenn" },
  { dag: 8, dato: "Lør 14. feb", øvelse: "Hopp, stor bakke - menn", type: "individuell", sport: "hopp" },
  
  // DAG 9 - Søndag 15. februar
  { dag: 9, dato: "Søn 15. feb", øvelse: "Alpint, storslalåm - kvinner", type: "individuell", sport: "alpint" },
  { dag: 9, dato: "Søn 15. feb", øvelse: "Skiskyting, 12,5 km jaktstart - menn", type: "individuell", sport: "skiskyting" },
  { dag: 9, dato: "Søn 15. feb", øvelse: "Skiskyting, 10 km jaktstart - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 9, dato: "Søn 15. feb", øvelse: "Langrenn, stafett - menn", type: "lag", sport: "langrenn" },
  { dag: 9, dato: "Søn 15. feb", øvelse: "Hopp, stor bakke - kvinner", type: "individuell", sport: "hopp" },
  
  // DAG 10 - Mandag 16. februar
  { dag: 10, dato: "Man 16. feb", øvelse: "Alpint, slalåm - menn", type: "individuell", sport: "alpint" },
  { dag: 10, dato: "Man 16. feb", øvelse: "Hopp, lagkonkurranse stor bakke - menn", type: "lag", sport: "hopp" },
  { dag: 10, dato: "Man 16. feb", øvelse: "Freeski, big air - menn", type: "individuell", sport: "freeski" },
  
  // DAG 11 - Tirsdag 17. februar
  { dag: 11, dato: "Tir 17. feb", øvelse: "Skiskyting, stafett - menn", type: "lag", sport: "skiskyting" },
  
  // DAG 12 - Onsdag 18. februar
  { dag: 12, dato: "Ons 18. feb", øvelse: "Alpint, slalåm - kvinner", type: "individuell", sport: "alpint" },
  { dag: 12, dato: "Ons 18. feb", øvelse: "Skiskyting, stafett - kvinner", type: "lag", sport: "skiskyting" },
  { dag: 12, dato: "Ons 18. feb", øvelse: "Langrenn, lagsprint - kvinner", type: "lag", sport: "langrenn" },
  { dag: 12, dato: "Ons 18. feb", øvelse: "Langrenn, lagsprint - menn", type: "lag", sport: "langrenn" },
  
  // DAG 13 - Torsdag 19. februar
  { dag: 13, dato: "Tor 19. feb", øvelse: "Kombinert, stor bakke/10 km - menn", type: "individuell", sport: "kombinert" },
  { dag: 13, dato: "Tor 19. feb", øvelse: "Skiskyting, 15 km fellesstart - menn", type: "individuell", sport: "skiskyting" },
  { dag: 13, dato: "Tor 19. feb", øvelse: "Skøyter, 1500m - menn", type: "individuell", sport: "skøyter" },
  { dag: 13, dato: "Tor 19. feb", øvelse: "Skøyter, 1500m - kvinner", type: "individuell", sport: "skøyter" },
  
  // DAG 14 - Fredag 20. februar
  { dag: 14, dato: "Fre 20. feb", øvelse: "Kombinert, lagkonkurranse - menn", type: "lag", sport: "kombinert" },
  { dag: 14, dato: "Fre 20. feb", øvelse: "Skiskyting, 12,5 km fellesstart - kvinner", type: "individuell", sport: "skiskyting" },
  { dag: 14, dato: "Fre 20. feb", øvelse: "Skøyter, lagtempo - menn", type: "lag", sport: "skøyter" },
  
  // DAG 15 - Lørdag 21. februar
  { dag: 15, dato: "Lør 21. feb", øvelse: "Langrenn, 50 km fellesstart - menn", type: "individuell", sport: "langrenn" },
  { dag: 15, dato: "Lør 21. feb", øvelse: "Curling, finale - menn", type: "lag", sport: "curling" },
  
  // DAG 16 - Søndag 22. februar
  { dag: 16, dato: "Søn 22. feb", øvelse: "Langrenn, 50 km fellesstart - kvinner", type: "individuell", sport: "langrenn" },
  { dag: 16, dato: "Søn 22. feb", øvelse: "Curling, finale - kvinner", type: "lag", sport: "curling" },
  { dag: 16, dato: "Søn 22. feb", øvelse: "Ishockey, finale - menn", type: "lag", sport: "ishockey" },
];

// ============================================
// UTØVERLISTE (kan utvides)
// ============================================
const UTØVERE = {
  langrenn: [
    // Norge - menn
    "Johannes Høsflot Klæbo", "Pål Golberg", "Hans Christer Holund", "Simen Hegstad Krüger",
    "Martin Løwstrøm Nyenget", "Harald Østberg Amundsen", "Even Northug", "Didrik Tønseth",
    "Erik Valnes", "Johan-Olav Botn", "Ansgar Evensen", "Martin Kirkeberg Mørk", "Einar Hedegart",
    "Jan Thomas Jenssen", "Mattis Stenshagen", "Iver Tildheim Andersen",
    // Norge - kvinner
    "Therese Johaug", "Heidi Weng", "Ingvild Flugstad Østberg", "Tiril Udnes Weng",
    "Anne Kjersti Kalvå", "Astrid Øyre Slind", "Helene Marie Fossesholm", "Mathilde Myhrvold",
    "Kristine Stavås Skistad", "Lotta Udnes Weng", "Silje Theodorsen",
    // Sverige
    "Frida Karlsson", "Ebba Andersson", "Jonna Sundling", "Maja Dahlqvist", "Linn Svahn",
    "Calle Halfvarsson", "William Poromaa", "Edvin Anger", "Moa Ilar", "Emma Ribom",
    "Jens Burman", "Gustaf Berglund",
    // Finland
    "Iivo Niskanen", "Kerttu Niskanen", "Krista Pärmäkoski", "Jasmi Joensuu", "Arsi Ruuskanen",
    // USA
    "Jessie Diggins", "Gus Schumacher", "Rosie Brennan", "Julia Kern",
    // Italia
    "Federico Pellegrino", "Francesco De Fabiani", "Simone Mocellini",
    // Andre
    "Alexander Bolshunov", "Natalia Nepryaeva", "Veronika Stepanova",
    "Nadine Fähndrich", "Victoria Carl", "Katharina Hennig", "Coletta Rydzek",
    "Yuto Miyamura", "Ge Chunyu", "Ryoma Kimata", "Kira Kimura", "Theo Schely", "Florian Notz",
    "Renaud Jay", "Hugo Lapalus", "Lucas Chanavat", "Delphine Claudel",
  ],
  skiskyting: [
    // Norge - menn
    "Johannes Thingnes Bø", "Tarjei Bø", "Sturla Holm Lægreid", "Vetle Sjåstad Christiansen",
    "Filip Fjeld Andersen", "Endre Strømsheim", "Sivert Guttorm Bakken",
    // Norge - kvinner
    "Ingrid Landmark Tandrevold", "Tiril Eckhoff", "Marte Olsbu Røiseland", "Karoline Knotten",
    "Juni Arnekleiv", "Ida Lien", "Maren Kirkeeide", "Karoline Simpson-Larsen", "Ragnhild Femsteinevik",
    // Frankrike
    "Quentin Fillon Maillet", "Emilien Jacquelin", "Fabien Claude", "Éric Perrot",
    "Julia Simon", "Lou Jeanmonnot", "Justine Braisaz-Bouchet", "Sophie Chauveau",
    // Sverige
    "Sebastian Samuelsson", "Martin Ponsiluoma", "Martin Nordqvist", "Viktor Brandt",
    "Hanna Öberg", "Elvira Öberg", "Anna Magnusson", "Ella Halvarsson",
    // Tyskland
    "Benedikt Doll", "Philipp Nawrath", "Philipp Horn", "Justus Strelow", "Johannes Kühn",
    "Franziska Preuss", "Vanessa Voigt", "Selina Grotian", "Sophia Schneider", "Janina Hettich-Walz",
    // Italia
    "Tommaso Giacomel", "Lukas Hofer", "Didier Bionaz",
    "Dorothea Wierer", "Lisa Vittozzi", "Hannah Auchentaller", "Samuela Comola",
    // Andre
    "Jakov Fak", "Miha Dovžan", "Endre Ståhl",
    "Suvi Minkkinen", "Marketa Davidova", "Paulina Fialkova", "Daria Domracheva",
    "Dmytro Pidruchnyi", "Artem Pryma",
  ],
  hopp: [
    // Norge
    "Halvor Egner Granerud", "Johann André Forfang", "Marius Lindvik", "Daniel-André Tande",
    "Robert Johansson", "Kristoffer Eriksen Sundal", "Benjamin Østvold", "Anders Fannemel",
    "Silje Opseth", "Eirin Maria Kvandal", "Anna Odine Strøm", "Thea Minyan Bjørseth",
    // Østerrike
    "Stefan Kraft", "Jan Hörl", "Daniel Tschofenig", "Michael Hayböck", "Manuel Fettner",
    "Eva Pinkelnig", "Lisa Eder", "Jacqueline Seifriedsberger",
    // Tyskland
    "Andreas Wellinger", "Pius Paschke", "Karl Geiger", "Stephan Leyhe", "Markus Eisenbichler",
    "Katharina Althaus", "Selina Freitag", "Juliane Seyfarth", "Agnes Reisch",
    // Slovenia
    "Anže Lanišek", "Timi Zajc", "Domen Prevc", "Peter Prevc", "Žiga Jelar",
    "Nika Prevc", "Ema Klinec", "Urša Bogataj",
    // Japan
    "Ryoyu Kobayashi", "Naoki Nakamura", "Junshiro Kobayashi",
    "Nozomi Maruyama", "Sara Takanashi", "Yuki Ito",
    // Andre
    "Kamil Stoch", "Dawid Kubacki", "Piotr Żyła", "Gregor Deschwanden", "Killian Peier",
  ],
  alpint: [
    // Norge
    "Henrik Kristoffersen", "Atle Lie McGrath", "Lucas Pinheiro Braathen", "Aleksander Aamodt Kilde",
    "Timon Haugan", "Rasmus Windingstad", "Alexander Steen Olsen", "Adrian Smiseth Sejersted",
    "Ragnhild Mowinckel", "Kajsa Vickhoff Lie", "Mina Fürst Holtmann", "Thea Louise Stjernesund",
    // Sveits
    "Marco Odermatt", "Loïc Meillard", "Daniel Yule", "Franjo von Allmen", "Thomas Tumler",
    "Lara Gut-Behrami", "Michelle Gisin", "Wendy Holdener", "Corinne Suter", "Camille Rast",
    "Joana Hählen", "Priska Ming-Nufer",
    // Østerrike
    "Manuel Feller", "Marco Schwarz", "Vincent Kriechmayr", "Raphael Haaser", "Stefan Babinsky",
    "Cornelia Hütter", "Katharina Liensberger", "Julia Scheib", "Nina Ortlieb", "Christina Ager",
    "Katharina Truppe", "Ricarda Haaser",
    // Frankrike
    "Clément Noël", "Alexis Pinturault", "Cyprien Sarrazin", "Nils Allegre",
    "Tessa Worley", "Romane Miradoli", "Clara Direz",
    // Italia
    "Sofia Goggia", "Federica Brignone", "Marta Bassino", "Dominik Paris", "Giovanni Franzoni",
    "Nicol Delago", "Roberta Melesi", "Elena Curtoni", "Laura Pirovano",
    // Tyskland
    "Linus Strasser", "Alexander Schmid", "Jonas Stockinger",
    "Kira Weidle-Winkelmann", "Emma Aicher", "Lena Dürr",
    // USA
    "Mikaela Shiffrin", "Lindsey Vonn", "Breezy Johnson", "Lauren Macuga",
    "Ryan Cochran-Siegle", "River Radamus", "Tommy Ford",
    // Kroatia
    "Zrinka Ljutic", "Leona Popovic", "Filip Zubcic", "Samuel Kolega",
    // Andre
    "Sara Hector", "Petra Vlhová", "Lara Colturi", "Maryna Gasienica-Daniel",
    "Marcel Hirscher", "Ramon Zenhäusern", "Justin Murisier",
    "Albert Popov", "Tormis Laine",
  ],
  kombinert: [
    // Norge
    "Jarl Magnus Riiber", "Jens Lurås Oftebro", "Espen Bjørnstad", "Jørgen Graabak",
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
    // Nederland
    "Patrick Roest", "Jorrit Bergsma", "Kjeld Nuis", "Thomas Krol", "Tim Prins",
    "Irene Schouten", "Antoinette de Jong", "Antoinette Rijpma-de Jong", "Jutta Leerdam", "Joy Beune",
    "Femke Kok", "Jenning de Boo",
    // USA
    "Jordan Stolz", "Erin Jackson", "Brittany Bowe",
    // Japan/Asia
    "Nao Kodaira", "Miho Takagi", "Ning Zhongyan", "Gao Tingyu",
    // Italia
    "Davide Ghiotto", "Andrea Giovannini", "Michele Malfatti",
    // Andre
    "Laurent Dubreuil", "Bart Swings", "Martina Sáblíková",
  ],
  freeski: [
    // Norge
    "Birk Ruud", "Ferdinand Dahl", "Tormod Frostad",
    // USA
    "Alex Hall", "Nick Goepper", "Mac Forehand", "Colby Stevenson",
    // Andre
    "Nico Porteous", "Aaron Blunck", "David Wise",
    "Andri Ragettli", "Fabian Bösch", "Henry Sildaru", "Matěj Švancer",
    "Eileen Gu", "Kelly Sildaru", "Mathilde Gremaud",
  ],
  snowboard: [
    // Norge
    "Marcus Kleveland", "Mons Røisland", "Fridtjof Sæther Tischendorf",
    // Canada
    "Max Parrot", "Mark McMorris", "Darcy Sharpe", "Laurie Blouin",
    // Asia
    "Su Yiming", "Takeru Otsuka", "Ge Chunyu", "Yuto Miyamura", "Kira Kimura", "Ryoma Kimata",
    "Yuto Totsuka", "Ayumu Hirano", "Ruka Hirano",
    // Andre
    "Rene Rinnekangas", "Red Gerard", "Dusty Henricksen",
    "Anna Gasser", "Zoi Sadowski-Synnott", "Kokomo Murase", "Tess Coady",
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
  
  // En inneholder den andre
  if (s1.includes(s2) || s2.includes(s1)) return { match: true, score: 0.9 };
  if (n1.includes(n2) || n2.includes(n1)) return { match: true, score: 0.88 };
  
  // Etternavn-match (Klæbo matcher Johannes Høsflot Klæbo)
  const parts1 = s1.split(' ');
  const parts2 = s2.split(' ');
  const lastName1 = parts1[parts1.length - 1];
  const lastName2 = parts2[parts2.length - 1];
  
  // Hvis ett av navnene er bare etternavn, og det matcher
  if (parts1.length === 1 && lastName1.length > 2) {
    if (lastName1 === lastName2) return { match: true, score: 0.92 };
    if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2)) return { match: true, score: 0.90 };
  }
  if (parts2.length === 1 && lastName2.length > 2) {
    if (lastName1 === lastName2) return { match: true, score: 0.92 };
    if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2)) return { match: true, score: 0.90 };
  }
  
  // Generell etternavn-match
  if (lastName1 === lastName2 && lastName1.length > 3) return { match: true, score: 0.85 };
  if (normalizeForMatch(lastName1) === normalizeForMatch(lastName2) && lastName1.length > 3) return { match: true, score: 0.83 };
  
  // Levenshtein distance for skrivefeil
  const distance = levenshteinDistance(n1, n2);
  const similarity = 1 - (distance / Math.max(n1.length, n2.length));
  
  // Litt lavere terskel (65%) for å fange flere skrivefeil
  return { match: similarity >= 0.65, score: similarity };
}

function findBestMatch(searchName, resultsList) {
  let best = { match: null, score: 0, index: -1 };
  resultsList.forEach((name, idx) => {
    if (!name) return;
    const { match, score } = fuzzyMatch(searchName, name);
    if (match && score > best.score) best = { match: name, score, index: idx };
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
  const [view, setView] = useState('info');
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
  const [adminResultatDag, setAdminResultatDag] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // ID for deltaker som skal slettes
  const [editingDeltaker, setEditingDeltaker] = useState(null); // Deltaker som redigeres
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'loading' | 'success' | 'error', message: string }
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

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
      }
    }, (error) => {
      console.error('Feil ved lasting av resultater:', error);
    });
    
    // Cleanup listeners når komponenten unmountes
    return () => {
      unsubscribeTips();
      unsubscribeResultater();
    };
  }, []);

  // Lagre resultater til Firebase (kalles manuelt fra admin)
  const saveResultaterToFirebase = async () => {
    try {
      await setDoc(doc(db, 'config', 'resultater'), { data: resultater });
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

  const handleSubmit = async () => {
    if (!deltakerNavn.trim()) return alert('Fyll inn navnet ditt!');
    if (!gullTips || isNaN(gullTips)) return alert('Tipp antall norske gull!');
    if (alleTips.some(t => t.navn.toLowerCase() === deltakerNavn.toLowerCase())) {
      return alert('Dette navnet er allerede registrert!');
    }
    const nyDeltaker = {
      id: Date.now().toString(),
      navn: deltakerNavn,
      tips: { ...tips },
      gullTips: parseInt(gullTips),
      innsendt: new Date().toLocaleString('no-NO'),
    };
    const success = await addDeltakerToFirebase(nyDeltaker);
    if (success) {
      setSubmitted(true);
    } else {
      alert('Kunne ikke lagre tips. Prøv igjen.');
    }
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

  // Beregn poeng
  // Beregn poeng for en deltaker, eventuelt filtrert på dag
  const beregnPoeng = (deltaker, filterDag = null) => {
    let total = 0;
    OL_PROGRAM.forEach((ø, idx) => {
      if (filterDag !== null && ø.dag !== filterDag) return;
      const res = resultater[idx];
      if (!res || !deltaker.tips[idx]) return;
      deltaker.tips[idx].forEach((tip, tippPos) => {
        if (!tip?.trim()) return;
        const { index: faktiskPos } = findBestMatch(tip, res);
        if (faktiskPos === -1) return;
        if (ø.type === 'individuell') {
          if (faktiskPos < 5) total += [5,4,3,2,1][faktiskPos];
          if (faktiskPos < 3 && tippPos === faktiskPos) total += [5,3,1][faktiskPos];
        } else {
          if (faktiskPos < 3 && tippPos === faktiskPos) total += [8,5,3][faktiskPos];
        }
      });
    });
    return total;
  };

  // Beregn detaljert poenginfo for en øvelse og deltaker
  const beregnØvelsePoeng = (deltaker, øvelseIdx) => {
    const ø = OL_PROGRAM[øvelseIdx];
    const res = resultater[øvelseIdx];
    if (!res || !deltaker.tips[øvelseIdx]) return { poeng: 0, detaljer: [] };
    
    let poeng = 0;
    const detaljer = [];
    
    deltaker.tips[øvelseIdx].forEach((tip, tippPos) => {
      if (!tip?.trim()) {
        detaljer.push({ tip: '-', tippPos: tippPos + 1, faktiskPos: null, poeng: 0 });
        return;
      }
      const { index: faktiskPos, name: matchedName } = findBestMatch(tip, res);
      let øvelsePoeng = 0;
      let bonus = 0;
      
      if (faktiskPos !== -1) {
        if (ø.type === 'individuell') {
          if (faktiskPos < 5) øvelsePoeng = [5,4,3,2,1][faktiskPos];
          if (faktiskPos < 3 && tippPos === faktiskPos) bonus = [5,3,1][faktiskPos];
        } else {
          if (faktiskPos < 3 && tippPos === faktiskPos) øvelsePoeng = [8,5,3][faktiskPos];
        }
      }
      
      poeng += øvelsePoeng + bonus;
      detaljer.push({ 
        tip, 
        tippPos: tippPos + 1, 
        faktiskPos: faktiskPos !== -1 ? faktiskPos + 1 : null,
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

  const leaderboard = [...alleTips].map(d => ({ ...d, poeng: beregnPoeng(d) })).sort((a, b) => b.poeng - a.poeng);
  
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
            { id: 'tipping', label: 'Tipping', icon: Send },
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
                  <p className="text-blue-100 text-xs mb-2">Du tipper 5 utøvere (1.-5. plass)</p>
                  <p className="text-slate-300 text-xs mb-1"><span className="text-white font-semibold">Plasseringspoeng:</span></p>
                  <p className="text-blue-100 text-xs">Topp 5 gir: 5-4-3-2-1 poeng</p>
                  <p className="text-slate-300 text-xs mt-2 mb-1"><span className="text-yellow-300 font-semibold">🏅 Pallbonus (riktig medalje):</span></p>
                  <p className="text-yellow-100 text-xs">Riktig gullvinner: +5 poeng</p>
                  <p className="text-slate-300 text-xs">Riktig sølvvinner: +3 poeng</p>
                  <p className="text-orange-200 text-xs">Riktig bronjevinner: +1 poeng</p>
                  <p className="text-slate-400 text-xs mt-2 italic">Pallen er viktigst! Riktig medalje gir bonus.</p>
                </div>
                <div className="bg-green-900/30 rounded-lg p-3">
                  <p className="font-bold text-green-300 mb-2">🏁 LAGØVELSER</p>
                  <p className="text-green-100 text-xs mb-2">Du tipper 3 nasjoner (gull, sølv, bronsje)</p>
                  <p className="text-slate-300 text-xs mb-1"><span className="text-white font-semibold">Kun poeng for riktig plassering:</span></p>
                  <p className="text-yellow-100 text-xs">Riktig gullnasjon: 8 poeng</p>
                  <p className="text-slate-300 text-xs">Riktig sølvnasjon: 5 poeng</p>
                  <p className="text-orange-200 text-xs">Riktig bronsenasjon: 3 poeng</p>
                  <p className="text-slate-400 text-xs mt-2 italic">Her må nasjonen stå på riktig plass!</p>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-3 mt-3">
                <p className="font-bold text-red-300 mb-1">🇳🇴 NORSKE GULL TOTALT</p>
                <p className="text-red-100 text-xs">Tipp hvor mange gull Norge tar. Nærmest: 30p | 2.: 20p | 3.: 15p | 4.: 10p | 5.: 5p</p>
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

        {/* TIPPING */}
        {view === 'tipping' && (
          <div className="space-y-4">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-green-400">Tips innsendt!</h2>
                <p className="text-blue-200 mb-4">Takk {deltakerNavn}!</p>
                <button onClick={() => setView('leaderboard')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                  Se leaderboard
                </button>
              </div>
            ) : (
              <>
                {/* Navn */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Ditt navn:</label>
                  <input type="text" value={deltakerNavn} onChange={(e) => setDeltakerNavn(e.target.value)}
                    placeholder="Skriv navnet ditt..." className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white" />
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

                {/* Norske gull - NEDERST */}
                <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-xl p-4 border border-red-600/30">
                  <label className="block text-sm font-bold text-red-300 mb-2">🇳🇴 Hvor mange gull tar Norge totalt?</label>
                  <p className="text-xs text-red-200 mb-2">Nærmest: 30p | 2.: 20p | 3.: 15p | 4.: 10p | 5.: 5p</p>
                  <input type="number" min="0" max="50" value={gullTips} onChange={(e) => setGullTips(e.target.value)}
                    placeholder="Antall gull..." className="w-24 px-3 py-2 bg-slate-900 border border-red-600/50 rounded-lg text-white text-center font-bold text-lg" />
                </div>

                {/* Send inn */}
                <div className="sticky bottom-4">
                  <button onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Send inn tips
                  </button>
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
                {(leaderboardView === 'total' ? leaderboard : getLeaderboardForDay(leaderboardView)).map((d, idx) => {
                  const isExpanded = expandedLeaderboardDeltaker === d.id;
                  const poengPerDag = beregnPoengPerDag(d);
                  
                  return (
                    <div key={d.id} className={`rounded-xl border overflow-hidden ${
                      idx === 0 ? 'bg-yellow-900/30 border-yellow-500/50' :
                      idx === 1 ? 'bg-slate-700/30 border-slate-400/50' :
                      idx === 2 ? 'bg-orange-900/30 border-orange-600/50' :
                      'bg-slate-800/50 border-slate-700'
                    }`}>
                      <button
                        onClick={() => setExpandedLeaderboardDeltaker(isExpanded ? null : d.id)}
                        className="w-full flex items-center gap-3 p-3"
                      >
                        <div className={`w-9 h-9 flex items-center justify-center rounded-full font-black ${
                          idx === 0 ? 'bg-yellow-500 text-yellow-900' :
                          idx === 1 ? 'bg-slate-300 text-slate-700' :
                          idx === 2 ? 'bg-orange-500 text-orange-900' : 'bg-slate-600 text-white'
                        }`}>{idx + 1}</div>
                        <div className="flex-1 text-left">
                          <h3 className="font-bold text-white">{d.navn}</h3>
                          <p className="text-xs text-slate-400">Gull-tips: {d.gullTips} 🇳🇴</p>
                        </div>
                        <div className="text-2xl font-black text-cyan-400">{d.poeng}p</div>
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
                                            Resultat: {resultater[ø.idx].slice(0, ø.type === 'individuell' ? 5 : 3).map((r, i) => `${i+1}. ${r || '-'}`).join(' | ')}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
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
                          await parseExcelFile(file, (result) => {
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
                            
                            const nyDeltaker = {
                              id: Date.now().toString(),
                              navn: result.navn,
                              tips: fullTips,
                              gullTips: result.gullTips || 0,
                              innsendt: new Date().toLocaleString('no-NO') + ' (Excel)',
                            };
                            
                            const success = await addDeltakerToFirebase(nyDeltaker);
                            if (success) {
                              setUploadStatus({ 
                                type: 'success', 
                                message: `${result.navn} lagt til! Gull-tips: ${result.gullTips}, Utfylte tips: ${utfylteTips}` 
                              });
                            } else {
                              setUploadStatus({ type: 'error', message: 'Kunne ikke lagre til database' });
                            }
                            
                            // Fjern suksess-melding etter 5 sekunder
                            setTimeout(() => setUploadStatus(null), 5000);
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
                    <div className="text-2xl font-black text-yellow-400">{Object.keys(resultater).length}</div>
                    <div className="text-xs text-slate-400">Resultater</div>
                  </div>
                </div>

                {/* Deltakerliste */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="font-bold text-cyan-400 mb-3">📋 Innsendte tips ({alleTips.length})</h3>
                  {alleTips.length === 0 ? (
                    <p className="text-slate-400 text-sm">Ingen deltakere enda</p>
                  ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {alleTips.map((d) => {
                        const unknowns = getUnknownNames(d);
                        const isConfirmingDelete = deleteConfirmId === d.id;
                        
                        return (
                          <div key={d.id} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                            selectedDeltaker?.id === d.id ? 'bg-cyan-600/30 border border-cyan-500' : 'bg-slate-700/50'
                          }`}>
                            {isConfirmingDelete ? (
                              // Bekreftelsesvisning
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-red-300 text-xs">Slette {d.navn}?</span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={async () => {
                                      const success = await deleteDeltakerFromFirebase(d.id);
                                      if (success) {
                                        if (selectedDeltaker?.id === d.id) setSelectedDeltaker(null);
                                      }
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
                            ) : (
                              // Normal visning
                              <>
                                <button 
                                  onClick={() => setSelectedDeltaker(selectedDeltaker?.id === d.id ? null : d)}
                                  className="flex-1 flex items-center justify-between hover:opacity-80"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{d.navn}</span>
                                    {unknowns.length > 0 && (
                                      <span className="bg-yellow-500 text-yellow-900 text-xs px-1.5 rounded-full font-bold">{unknowns.length}</span>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400">Gull: {d.gullTips}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmId(d.id);
                                  }}
                                  className="p-1.5 text-red-400 hover:bg-red-600/30 rounded"
                                  title="Slett deltaker"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
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
                              onClick={() => {
                                // Lagre endringer
                                setAlleTips(p => p.map(d => 
                                  d.id === editingDeltaker.id ? editingDeltaker : d
                                ));
                                setSelectedDeltaker(editingDeltaker);
                                setEditingDeltaker(null);
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
                          <button
                            onClick={() => setEditingDeltaker({ ...selectedDeltaker, tips: { ...selectedDeltaker.tips } })}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            ✏️ Rediger tips
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Gull-tips: {selectedDeltaker.gullTips} 🇳🇴 | Innsendt: {selectedDeltaker.innsendt}</p>
                    
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
                                    <AutocompleteInput
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
                          {(ø.type === 'individuell' ? [1,2,3,4,5] : [1,2,3]).map((pos) => (
                            <div key={pos} className="flex items-center gap-2">
                              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                                pos === 1 ? 'bg-yellow-500 text-yellow-900' :
                                pos === 2 ? 'bg-slate-300 text-slate-700' :
                                pos === 3 ? 'bg-orange-500 text-orange-900' :
                                'bg-slate-600 text-white'
                              }`}>{pos}</span>
                              <AutocompleteInput
                                value={resultater[ø.idx]?.[pos-1] || ''}
                                onChange={(val) => {
                                  const newRes = [...(resultater[ø.idx] || [])];
                                  newRes[pos-1] = val;
                                  setResultater(p => ({ ...p, [ø.idx]: newRes }));
                                }}
                                suggestions={getSuggestions(ø.sport, ø.type)}
                                placeholder={pos === 1 ? 'Gull...' : pos === 2 ? 'Sølv...' : pos === 3 ? 'Bronsje...' : `${pos}. plass...`}
                                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white"
                              />
                            </div>
                          ))}
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

      <footer className="text-center py-4 text-slate-500 text-xs">
        OL-Konkurranse 2026 • Milano-Cortina 🇮🇹
      </footer>
    </div>
  );
}
