'use strict';
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buildId = btn.getAttribute('value');

            fetch('/preferiti/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ buildId })
            })
            .then(res => res.json())
            .then(data => {
                const icon = btn.querySelector('.material-icons');
                if (data.liked) {
                    icon.textContent = 'favorite';
                } else {
                    icon.textContent = 'favorite_border';
                }
            })
            .catch(err => console.error('Errore AJAX:', err));
        });
    });
});

