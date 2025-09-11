'use strict';
// Funzione per confermare l'eliminazione di una build
function confirmDelete(buildId) {
    // Chiedo conferma all'utente
    if(confirm("Sei sicuro di voler eliminare la build?")) {

        //mando una richiesta al server per eliminare la build
        fetch(`/delete-build/${buildId}`, {
            method: 'GET'
        })
        .then(response => {
            if(response.ok) {  // se la richiesta va a buon fine ricarico la pagina
                window.location.reload();
            } else { // altrimenti mostro un messaggio di errore
                alert("Errore durante l'eliminazione");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Si è verificato un errore");
        });
    }
}

// Funzione per aprire il modal di modifica
function openEditModal(){
    const modal = document.getElementById('editModal');
    modal.style.display = 'block'; // modifico lo stile per mostrare il modal
}