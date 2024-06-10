const valider = document.getElementById('btn');
valider.addEventListener('click', ()=>{

    const id = localStorage.getItem('info');
    console.log(id);
    const object = {
        id : id
    }
    fetch("http://localhost:3000/supprimerClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object) //transforme l'objet en string 
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.error);
        console.log(data);
        if (data.error) {
            alert("Erreur : " + data.error);
        } else {
            alert("Votre mot de passe a été réinitialisé avec succès !");
        }
    })
    .catch(error => console.log(error));
    });







