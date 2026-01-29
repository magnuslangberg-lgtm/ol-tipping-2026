# 🏔️ OL-Tipping 2026 - Milano-Cortina

En tippkonkurranse-app for Vinter-OL 2026.

---

## 🚀 Slik deler du appen (steg for steg)

### Steg 1: Opprett GitHub-konto (hvis du ikke har)
1. Gå til **github.com**
2. Klikk **Sign up**
3. Følg instruksjonene

### Steg 2: Last opp prosjektet til GitHub
1. Logg inn på **github.com**
2. Klikk på **+** øverst til høyre → **New repository**
3. Gi den et navn, f.eks. `ol-tipping-2026`
4. La den være **Public**
5. Klikk **Create repository**

**Nå må du laste opp filene:**

**Alternativ A - Via nettleseren (enklest):**
1. På den nye repository-siden, klikk **uploading an existing file**
2. Dra HELE mappen `ol-tipping-2026` inn i nettleseren (eller velg filene)
3. Klikk **Commit changes**

**Alternativ B - Via kommandolinje:**
```bash
cd ol-tipping-2026
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-BRUKERNAVN/ol-tipping-2026.git
git push -u origin main
```

### Steg 3: Deploy til Vercel (gratis)
1. Gå til **vercel.com**
2. Klikk **Sign Up** → **Continue with GitHub**
3. Godkjenn tilgang
4. Klikk **Add New...** → **Project**
5. Finn `ol-tipping-2026` i listen og klikk **Import**
6. La alle innstillinger være som de er
7. Klikk **Deploy**

⏳ Vent ca. 1-2 minutter...

✅ **Ferdig!** Du får en URL som `https://ol-tipping-2026.vercel.app` som du kan dele med alle!

---

## 🔧 Endre admin-passord

Åpne filen `app/page.jsx` og finn denne linjen (ca. linje 290):
```javascript
const ADMIN_PASSWORD = "OL2026Admin";
```
Endre `OL2026Admin` til ditt eget passord.

---

## 📱 Funksjoner

- ✅ Alle kan se info, program og leaderboard
- ✅ Admin kan logge inn og laste opp Excel-tips
- ✅ Admin kan registrere resultater dag for dag
- ✅ Automatisk poengberegning
- ✅ Leaderboard med detaljer per dag

---

## 💾 Om datalagring

**Viktig:** Denne versjonen bruker `localStorage` i nettleseren. Det betyr:
- Data lagres lokalt i hver brukers nettleser
- Admin må registrere resultater på samme enhet/nettleser
- For en produksjonsversjon med delt database, kontakt utvikler

---

## 📞 Support

Laget med ❤️ for OL 2026 i Milano-Cortina 🇮🇹
