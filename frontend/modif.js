const valider = document.getElementById('btn');

valider.addEventListener('click',()=>{
const newPassword = document.getElementById('nouveau-mdp').value;
const confirmPassword = document.getElementById('confirm-mdp').value;
const oldPassword  = document.getElementById('old-mdp').value;
const nom  = document.getElementById('nom').value;
const prenom  = document.getElementById('prenom').value;
const tel  = document.getElementById('tel').value;
const date_naissance  = document.getElementById('date_naissance').value;
const id = localStorage.getItem('info');
console.log('newpass :'+newPassword+ ', confirm: '+ confirmPassword+', old:'+oldPassword+', nom'+nom+', prenom'+prenom+",tel"+" birthday :"+date_naissance + "id:" +id);
const object = {
    newPassword: newPassword,
    oldPassword: oldPassword,
    nom:nom,
    prenom: prenom,
    tel: tel,
    date_naissance:date_naissance,
    id:id 
} 
if (confirmPassword == newPassword){
    fetch("http://localhost:3000/modifierclient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object) //transforme l'objet en string 
    })
    .then(res => {
        if (res.status === 401) {
            alert('mot de passe ancien faux');
        }
        else{
            alert("vos données on bien étés modifiés");
            return res.json();
         // transforme la réponse HTTP en JavaScript
         
        }
    })
    .then(data => {
        // vérifier si le message "ajout reussi" s'affiche
        window.location.assign('http://127.0.0.1:5500/frontend/index.html');
    })
    .catch(error => console.log(error));
}
else {
    alert("verifiez votre mot de passe")
}

});