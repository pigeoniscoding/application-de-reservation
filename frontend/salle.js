




//selectionner les boutons des salles individuellement
const room1btn = document.getElementById("salle1");
const room2btn = document.getElementById("salle2");
const room3btn = document.getElementById("salle3");

console.log (room1btn);
//variable pour stocker le id de la salle
let Id_salle = 0

//selectionner tous les boutons
const btns = document.querySelectorAll(".button"); //is an array 

//ouvrir la page du calendrier quand on clique sur les boutons
room1btn.addEventListener("click", () => {
    window.location.href = 'index.html';
    Id_salle = 1;
    return(Id_salle);
  }); //probleme il ne trouve pas le btn quand on change la page 

room2btn.addEventListener("click", () => {
    window.location.href = 'index.html';
    Id_salle = 2;
    return(Id_salle);
  });

room3btn.addEventListener("click", () => {
    window.location.href = 'index.html';
    Id_salle = 3;
    return(Id_salle);
  });




