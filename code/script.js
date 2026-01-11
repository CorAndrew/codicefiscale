const mesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
const CONS = "BCDFGHJKLMNPQRSTVWXYZ";
const VOC = "AEIOU";

// Mappe per il carattere di controllo
const disp = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
};
const pari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // I valori pari corrispondono alla posizione (A=0, B=1...)

function estraiCaratteri(str, tipo) {
    let s = str.toUpperCase().trim();
    let c = ''; 
    let v = ''; 
    for (let i = 0; i < s.length; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            if (CONS.includes(s[i])) c += s[i];
            else if (VOC.includes(s[i])) v += s[i];
        }
    }
    let cod = '';
    if (tipo == 'N' && c.length >= 4) cod = c[0] + c[2] + c[3];
    else if (c.length >= 3) cod = c.substring(0, 3);
    else {
        cod = c + v;
        cod = cod.padEnd(3, 'X');
    }
    return cod.substring(0, 3);
}

// funzione per il carattere di controllo
function calcCtrl(cf15) {
    let tot = 0;
    for (let i = 0; i < 15; i++) {
        let char = cf15[i];
        if ((i + 1) % 2 !== 0) {
            tot += disp[char];
        } else {
            let val = isNaN(char) ? char.charCodeAt(0) - 65 : parseInt(char);
            tot += val;
        }
    }
    return pari[tot % 26];
}

async function genera() {
    const nome = document.getElementById('nome').value;
    const cogn = document.getElementById('cognome').value;
    const data = document.getElementById('data').value;
    const sessoMaschio = document.getElementById('maschio').checked;
    const comuneInput = document.getElementById('comune').value.toUpperCase().trim();
    const fileInput = document.getElementById('fileComuni');
    const divRisultato = document.getElementById('risultato');

    if (!nome || !cogn || !data || !comuneInput) {
        alert("Per favore, compila tutti i campi!");
        return;
    }

    const codCog = estraiCaratteri(cogn, 'C');
    const codNom = estraiCaratteri(nome, 'N');
    const datNasc = new Date(data);
    const codAnn = String(datNasc.getFullYear()).slice(-2);
    const codMes = mesi[datNasc.getMonth()];
    let gio = datNasc.getDate();
    if (!sessoMaschio) gio += 40;
    const codGio = String(gio).padStart(2, '0');

    if (fileInput.files.length === 0) {
        alert("Carica il file dei comuni prima di procedere!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const contenuto = e.target.result;
        const righe = contenuto.split('\n');
        let codiceBelfiore = "";

        for (let riga of righe) {
            if (riga.toUpperCase().includes(comuneInput)) {
                const match = riga.match(/[A-Z]\d{3}/);
                if (match) {
                    codiceBelfiore = match[0];
                    break;
                }
            }
        }

        if (codiceBelfiore === "") {
            divRisultato.innerHTML = "Errore: Comune non trovato.";
        } else {
            const CF15 = codCog + codNom + codAnn + codMes + codGio + codiceBelfiore;
            const ctrl = calcCtrl(CF15); // Calcolo ultima lettera
            divRisultato.innerHTML = `Il codice fiscale è: ${CF15 + ctrl}`;
        }
    };
    reader.readAsText(file);
}