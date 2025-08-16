'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const personaggioSelezionato = document.getElementById('personaggio');

    const weaponSelects = {
        spada: document.getElementById('spada'),
        spadone: document.getElementById('spadone'),
        catalizzatore: document.getElementById('catalizzatore'),
        lancia: document.getElementById('lancia'),
        arco: document.getElementById('arco')
    };

    function nascondiArmi() {
        for (const key in weaponSelects) {
            const select = weaponSelects[key];
            select.closest('.form-group').style.display = 'none';
            select.removeAttribute('name');
        }
    }

    function mostraArmaGiusta(weaponType) {
        nascondiArmi();

        const corretta = weaponSelects[weaponType];
        if (corretta) {
            corretta.closest('.form-group').style.display = 'block';
            corretta.setAttribute('name', 'arma');
        }
    }

    personaggioSelezionato.addEventListener('change', function () {
        const personaggioSel = this.options[this.selectedIndex];

        if (!this.value) {
            nascondiArmi();
            return;
        }

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

function setupImagePreview(selectId, imgId) {
    const select = document.getElementById(selectId);
    const img = document.getElementById(imgId);

    select.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const imgUrl = selectedOption.getAttribute('data-img');

        if (selectedOption.value && imgUrl) {
            img.src = imgUrl;
            img.style.display = 'block';
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