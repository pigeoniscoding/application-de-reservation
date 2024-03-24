// document.addEventListener("DOMContentLoaded", function() {
//   // Votre code JavaScript ici
//   fetch("http://localhost:3000/salles")
//     .then(response => response.json())
//     .then(data => {
//       // Manipulez les données ici
//       console.log(data); // Affiche les données dans la console
  
//       // Vérifiez si les données sont au format attendu
//       if (data.message === "Success" && Array.isArray(data.data)) {
//         // Parcourez les données et affichez-les sous forme de boutons HTML
//         const salleButtonsContainer = document.querySelector("#salle-buttons-container");
//         data.data.forEach(salle => {
//           const button = document.createElement("button");
//           button.textContent = "Salle " + salle.Numero_de_la_salle;
//           button.classList.add("salle-button"); // Ajoutez une classe pour le style CSS si nécessaire
//           salleButtonsContainer.appendChild(button);
//         });
//       } else {
//         console.error("Le format des données retournées n'est pas conforme à ce qui est attendu.");
//       }
//     })
//     .catch(error => {
//       console.error("Erreur lors de la récupération des données :", error);
//     });
// });


// document.addEventListener("DOMContentLoaded", function() {
//   // Déclaration de la variable pour stocker l'id de la salle
//   let id_Salle = "";

//   // Fonction pour gérer le clic sur un bouton de salle
//   function handleClick(event) {
//       // Stocker le textContent du bouton cliqué dans la variable id_Salle
//       id_Salle = event.target.textContent;
//       console.log("id_Salle sélectionné :", id_Salle);

//       // Vous pouvez effectuer d'autres opérations en fonction de id_Salle ici
//   }

let id_Salle ="";
// Fonction pour gérer le clic sur un bouton de salle
function handleClick(event) {
  // Extraire le numéro de la salle du textContent du bouton cliqué
  const salleText = event.target.textContent;
  const idRegex = /\d+/; // Expression régulière pour extraire le numéro de salle
  const match = salleText.match(idRegex);

  if (match) {
      // Stocker le numéro de salle extrait dans la variable id_Salle
      id_Salle = match[0];
      console.log(id_Salle);

      // Vous pouvez effectuer d'autres opérations en fonction de id_Salle ici
  } else {
      console.error("Impossible de trouver le numéro de salle dans le textContent du bouton.");
  }
}


  // Appel de l'API pour récupérer les données sur les salles
  fetch("http://localhost:3000/salles")
      .then(response => response.json())
      .then(data => {
          // Vérifiez si les données sont au format attendu
          if (data.message === "Success" && Array.isArray(data.data)) {
              // Parcourir les données et créer des boutons HTML pour chaque salle
              const salleButtonsContainer = document.querySelector("#salle-buttons-container");
              data.data.forEach(salle => {
                  const button = document.createElement("button");
                  button.textContent = "Salle " + salle.Numero_de_la_salle;
                  button.classList.add("salle-button"); // Ajouter une classe pour le style CSS si nécessaire
                  
                  // Ajouter un event listener pour gérer le clic sur le bouton
                  button.addEventListener("click", handleClick);

                  salleButtonsContainer.appendChild(button);
              });
          }
          else {
              console.error("Le format des données retournées n'est pas conforme à ce qui est attendu.");
          }
      })
      .catch(error => {
          console.error("Erreur lors de la récupération des données :", error);
      });

