'use strict';
//nel doom content loaded aspetto che tutta la pgina (dom) sia caricata
document.addEventListener('DOMContentLoaded', () => { 
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildId = btn.getAttribute('value');
            //uso la fetch per mandare una richiesta post a prefeiriti toggle e in base alla
            //risposta decido se mettere o meno l'icona piena per il mipiace
            fetch('/preferiti/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ buildId })
            })
            .then(res => res.json())
            .then(data => {
                // Aggiorno l'icona in base allo stato del preferito (piena o non piena)
                const icon = btn.querySelector('.material-icons');
                if (data.liked) { //se é liked mostro quella piena
                    icon.textContent = 'favorite';
                } else { //se non lo é mosto quella vuota
                    icon.textContent = 'favorite_border';
                }
            })
            .catch(err => console.error('Errore nel recupero dello stato mipiace:', err));
        });
    });
});

