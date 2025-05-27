'use strict';

function confirmDelete(buildId) {
    if(confirm("Sei sicuro di voler eliminare la build?")) {
        fetch(`/delete-build/${buildId}`, {
            method: 'GET'
        })
        .then(response => {
            if(response.ok) {
                window.location.reload(); //ricarico la pagina se l'eliminazione é andata bene
            } else {
                alert("Errore durante l'eliminazione");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Si è verificato un errore");
        });
    }
}