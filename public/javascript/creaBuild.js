'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const personaggioSelezionato = document.getElementById('pesonaggi');

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
            corretta.setAttribute('name', 'tipo_arma');
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
            console.warn('Tipo di arma non definito per il personaggio selezionato');
        }
    });

    nascondiArmi();
});
