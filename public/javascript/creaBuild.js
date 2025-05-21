'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const selectPersonaggio = document.getElementById('pesonaggi');
    const selectSpada = document.getElementById('spada');
    const selectSpadone = document.getElementById('spadone');
    const selectCatalizzatore = document.getElementById('catalizzatore');
    const selectLancia = document.getElementById('lancia');
    const selectArco = document.getElementById('arco');

    function hideAllWeaponSelects() {
        selectSpada.closest('.form-group').style.display = 'none';
        selectSpadone.closest('.form-group').style.display = 'none';
        selectCatalizzatore.closest('.form-group').style.display = 'none';
        selectLancia.closest('.form-group').style.display = 'none';
        selectArco.closest('.form-group').style.display = 'none';
    }

    function showAllowedWeapon(weaponType) {
        hideAllWeaponSelects();

        switch (weaponType) {
            case 'spada':
                selectSpada.closest('.form-group').style.display = 'block';
                break;
            case 'spadone':
                selectSpadone.closest('.form-group').style.display = 'block';
                break;
            case 'catalizzatore':
                selectCatalizzatore.closest('.form-group').style.display = 'block';
                break;
            case 'lancia':
                selectLancia.closest('.form-group').style.display = 'block';
                break;
            case 'arco':
                selectArco.closest('.form-group').style.display = 'block';
                break;
        }
    }


    selectPersonaggio.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];

        if (!this.value) {
            hideAllWeaponSelects();
            return;
        }


        const weaponType = selectedOption.getAttribute('data-tipo');

        if (weaponType) {
            showAllowedWeapon(weaponType);
        } else {
            hideAllWeaponSelects();
            console.warn('Tipo di arma non definito per il personaggio selezionato');
        }
    });
    hideAllWeaponSelects();
});