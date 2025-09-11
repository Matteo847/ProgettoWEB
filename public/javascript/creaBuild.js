'use strict';
// Funzione per confermare l'eliminazione di una build
document.addEventListener('DOMContentLoaded', function () {
    const personaggioSelezionato = document.getElementById('personaggio');
    // Oggetti per popolare i vari select a tendina per ogni tipo di arma
    const weaponSelects = {
        spada: document.getElementById('spada'),
        spadone: document.getElementById('spadone'),
        catalizzatore: document.getElementById('catalizzatore'),
        lancia: document.getElementById('lancia'),
        arco: document.getElementById('arco')
    };
    // Funzione per nascondere tutte le select delle armi
    function nascondiArmi() {
        for (const w in weaponSelects) {
            const select = weaponSelects[w];
            select.closest('.form-group').style.display = 'none';
            select.removeAttribute('name');
        }
    }
    // Funzione per mostrare la select dell'arma corretta
    function mostraArmaGiusta(weaponType) {
        nascondiArmi();
        // Mostra la select dell'arma corretta
        const corretta = weaponSelects[weaponType];
        if (corretta) {
            corretta.closest('.form-group').style.display = 'block'; //closest per selezionare il div contenitore
            corretta.setAttribute('name', 'arma'); // Imposto il nome del campo
        }
    }
    // Evento change al cambio del personaggio (quando cambio selezione dalla tendina)
    personaggioSelezionato.addEventListener('change', function () {
        const personaggioSel = this.options[this.selectedIndex]; //recupero il personaggio selezionato

        if (!this.value) { //se non c'è nessun personaggio selezionato
            nascondiArmi();
            return;
        }
        // Ottengo il tipo di arma dal data attribute
        const tipoArma = personaggioSel.getAttribute('data-tipo');
        if (tipoArma) {
            mostraArmaGiusta(tipoArma);
        } else {
            nascondiArmi();
            console.log(tipoArma)
            console.warn('Tipo di arma non definito per il personaggio selezionato');
        }
    });

    nascondiArmi();
});
// Funzione per mostrare l'anteprima dell'immagine selezionata
function setupImagePreview(selectId, imgId) {
    const select = document.getElementById(selectId);
    const img = document.getElementById(imgId);

    // Evento al cambio della select dell'arma/personaggio
    select.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const imgUrl = selectedOption.getAttribute('data-img'); // Ottengo l'URL dell'immagine dal data-img
        // Mostro l'immagine se esiste
        if (selectedOption.value && imgUrl) {
            img.src = imgUrl; // Imposto l'src dell'immagine
            img.style.display = 'block'; // Rendo visibile l'immagine
            img.alt = selectedOption.text + ' preview';
        } else {
            img.style.display = 'none';
        }
    });
}
setupImagePreview('personaggio', 'personaggio-img');
setupImagePreview('spada', 'spada-img');
setupImagePreview('spadone', 'spadone-img');
setupImagePreview('catalizzatore', 'catalizzatore-img');
setupImagePreview('lancia', 'lancia-img');
setupImagePreview('arco', 'arco-img');
setupImagePreview('fiore', 'fiore-img');
setupImagePreview('piuma', 'piuma-img');
setupImagePreview('clessidra', 'clessidra-img');
setupImagePreview('coppa', 'coppa-img');
setupImagePreview('corona', 'corona-img');
setupImagePreview('arma', 'modifica-img');