

//recuperation des données

const valider = document.getElementById('btn');

valider.addEventListener('click',()=>{
const email = document.getElementById('login-email').value;
const nouveauMdp = document.getElementById('nouveau-mdp').value;
const confirmMdp  = document.getElementById('confirm-mdp').value;
console.log('email :'+email+ ', newMDP: '+ nouveauMdp+', confirmMdp:'+confirmMdp);    
const object = {
    email: email,
    nouveauMdp: nouveauMdp,
    confirmMdp: confirmMdp
};

fetch("http://localhost:3000/lostPassword", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(object)
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

    
