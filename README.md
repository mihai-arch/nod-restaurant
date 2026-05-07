# NOD Restaurant — Site oficial

Site-ul oficial al restaurantului NOD, Port Tomis, Constanța.

## Structura proiectului

```
nod-restaurant/
├── index.html          ← Site-ul principal
├── menu.html           ← Meniu complet (accesibil și prin QR)
├── reviews.html        ← Pagina de recenzii (doar prin QR)
├── assets/
│   ├── style.css       ← Stiluri principale
│   └── main.js         ← JavaScript principal
└── README.md
```

## Pagini

- **index.html** — Homepage cu intro cinematic, poveste, navigare prin restaurant, galerie, rezervări
- **menu.html** — Meniu complet cu toate categoriile, cu tab-uri
- **reviews.html** — Sistem inteligent de recenzii: ≥4 stele → Google, <4 stele → feedback intern

## Setup rezervări (Google Sheets)

1. Creează un Google Sheet nou
2. Mergi pe **Extensions → Apps Script**
3. Lipește codul de mai jos:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.nume,
    data.telefon,
    data.data,
    data.ora,
    data.persoane,
    data.ocazie,
    data.mentiuni || ''
  ]);

  // Trimite email de notificare
  MailApp.sendEmail({
    to: 'EMAIL_RESTAURANT@gmail.com',
    subject: '🍽️ Rezervare nouă NOD — ' + data.nume,
    body: `Rezervare nouă!\n\nNume: ${data.nume}\nTelefon: ${data.telefon}\nData: ${data.data}\nOra: ${data.ora}\nPersoane: ${data.persoane}\nOcazie: ${data.ocazie}\nMențiuni: ${data.mentiuni || 'Niciuna'}`
  });

  return ContentService.createTextOutput('OK');
}
```

4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
5. Copiază URL-ul și înlocuiește `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` în `assets/main.js` și `reviews.html`

## Deploy pe Vercel

```bash
npm install -g vercel
vercel --prod
```

## Personalizări necesare

- `index.html` → înlocuiește numărul de telefon (`+40 XXX XXX XXX`)
- `menu.html` → actualizează prețurile și preparatele la nevoie
- `reviews.html` → înlocuiește link-ul Google Review (`https://g.page/r/YOUR-GOOGLE-REVIEW-LINK/review`)
- `assets/main.js` → adaugă URL-ul Google Apps Script

## Tehnologii folosite

- HTML5 / CSS3 / JavaScript vanilla
- GSAP 3 (animații)
- Google Fonts (Cormorant Garamond + Jost)
- Google Drive (hosting imagini)
- Google Sheets + Apps Script (rezervări)
