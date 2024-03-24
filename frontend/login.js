// Ajout d'un gestionnaire d'événement pour l'événement de soumission du formulaire
const signupForm = document.querySelector('.formInsc');
signupForm.addEventListener('submit', (event) => {
    // Empêcher le comportement par défaut du formulaire qui recharge la page
    event.preventDefault();

    // Récupération des valeurs des champs de formulaire
    const nom = document.getElementById('signup-nom').value;
    const prenom = document.getElementById('signup-prenom').value;
    const email = document.getElementById('signup-email').value;
    const mdp = document.getElementById('signup-mdp').value;
    const object = { //création d'un objet contenant les paramètres  
        nom: nom,
        prenom: prenom,
        email:email,
        mdp:mdp
    };
    fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object) //transforme l'objet en string 
    })
    .then(res => res.json()) //transforme la reponse de http en javascript
    .then(data => {
        // vérifier si le message "ajout reussi" s'affiche
        window.location.assign('http://127.0.0.1:5500/frontend/index.html');
    })
    .catch(error => console.log(error));
}

);

const loginForm = document.querySelector('.formLogin');
loginForm.addEventListener('submit', (event) => {
    // Empêcher le comportement par défaut du formulaire qui recharge la page
    event.preventDefault();

    // Récupération des valeurs des champs de formulaire
  
    const emailLogin = document.getElementById('login-email').value;
    const mdpLogin = document.getElementById('login-mdp').value;
    const object = { //création d'un objet contenant les paramètres  
      
        email:emailLogin,
        mdp:mdpLogin
    };
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object) //transforme l'objet en string 
    })
    .then(res => res.json()) //transforme la reponse de http en javascript
    .then(data => {
        // vérifier si le message "ajout reussi" s'affiche
        localStorage.setItem('info',data.id)
        if (data.pass === true){
            window.location.assign('http://127.0.0.1:5500/frontend/index.html');
        }
        else{
            alert("mot de pass incorrect");
        }
        
    })
    .catch(error => console.log(error));
}

);


