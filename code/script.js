const mesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
const CONS = "BCDFGHJKLMNPQRSTVWXYZ";
const VOC = "AEIOU";

function estraiCaratteri(str, tipo) {
    let s = str.toUpperCase().trim();
    let c = ''; 
    let v = ''; 

    for (let i = 0; i < s.length; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            if (CONS.includes(s[i])) {
                c += s[i];
            } else if (VOC.includes(s[i])) {
                v += s[i];
            }
        }
    }
    
    let cod = '';
    if (tipo == 'N' && c.length >= 4) {
        cod = c[0] + c[2] + c[3];
    } else if (c.length >= 3) {
        cod = c.substring(0, 3);
    } else {
        cod = c + v;
        cod = cod.padEnd(3, 'X');
    }
    return cod.substring(0, 3);
}

// Funzione principale
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

    // Estrazione dati anagrafici
    const codCog = estraiCaratteri(cogn, 'C');
    const codNom = estraiCaratteri(nome, 'N');
    const datNasc = new Date(data);
    const codAnn = String(datNasc.getFullYear()).slice(-2);
    const codMes = mesi[datNasc.getMonth()];
    let gio = datNasc.getDate();
    if (!sessoMaschio) gio += 40;
    const codGio = String(gio).padStart(2, '0');

    // Lettura del file e ricerca codice comune
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

        // Cerca il comune nel file
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
            divRisultato.innerHTML = "Errore: Comune non trovato nel file.";
        } else {
            const CF_parziale = codCog + codNom + codAnn + codMes + codGio + codiceBelfiore;
            divRisultato.innerHTML = `Il codice fiscale è: ${CF_parziale}`;
        }
    };

    reader.readAsText(file);
}