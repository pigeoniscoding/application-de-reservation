let timeData = {}; //un tableau 
let dataDate = ''; //objet : date selectionné et l'heure selectionée
let Id_salle = '';
let firstDayofMonth; 
let lastDayofMonth; 
let lastDateofMonth
let lastDateofLastMonth
let Id = "";
const calendar = document.querySelector('.calendar-wrapper');
let equipement = "";
let details = "";



//date
//curryear
//currmonth
//liTag
//idTime : le id du bloc séléctionné 

//les methodes: 
//fetchdata : gérer les blocks disponibles (dataDate , Id_salle)
//fetchreservation : effectuer les reservation (dataDate)
//selectRoom : afficher le calendrier une fois la salle est sélectionné (Id_salle, Id_salle, IdTime)
//render calendar : rendre le calendrier dynamique
//handleDates : determine dataDate
//selectBlocks + handleClic(e) : modifie la disponibilité une fois le bloc est selectionné (agit avec l'utilisateur)
//openBookingTimeModal : ouvre la selection des blocs
//closeBookingTimeModal : ferme la selection des blocs
// openBookingModal : ouvre le formulaire
//closeBookingModal : ferme le formualire
//handelAvailablity : génère la disponibilité des salles selon la base de donnée (arrive avant selectBlocks)


//methodes pour envoyer les données a l'API 
function fetchdata(date, Id_salle) {
    const object = { //création d'un objet contenant les paramètres  
        date: date,
        id: Id_salle,
    };
    console.log(object);
    fetch("http://localhost:3000/disponibilite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object) //transforme l'objet en string 
    })
    .then(res => res.json()) //transforme la reponse de http en javascript
    .then(data => {
        timeData = data.data; //data.data est utilisé pour accéder aux données réelles de la réponse de la requête HTTP
        handelAvailablity(timeData);
    })
    .catch(error => console.log(error));
}

function fetchreservation(details,dateDate, Id_salle, idTime,equipement) {
    const object = {
        id_user: localStorage.getItem('info'),
        details: details,
        date: dateDate,
        id: Id_salle,
        idTime: idTime,
        equipement:equipement,
    };

    fetch("http://localhost:3000/reservation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Si la réservation a réussi, procédez à la suite
            handleDates();
            handelAvailablity(timeData);
            selectBlock(dataDate);
            closeBookingModal();//ne marche pas?
        } else {
            // Sinon, affichez un message d'erreur ou effectuez une action appropriée
            console.error("Erreur lors de la réservation.");
        }
    })
    .catch(error => console.log(error));
}


//les methodes pratiques 
function selectRoom(Id) { 
    //permet d'afficher le calendrier quand la salle est selectionnée et stocke la salle
    //prend en parametre un Id (int) rentré par le developeur 
    Id_salle = Id;
    calendar.style.visibility = "visible";
}


// Fonction pour gérer le clic sur un bouton de salle
function handleClick(event) {
  // Extraire le numéro de la salle du textContent du bouton cliqué
  const salleText = event.target.textContent;
  const idRegex = /\d+/; // Expression régulière pour extraire le numéro de salle
  const match = salleText.match(idRegex);

  if (match) {
      // Stocker le numéro de salle extrait dans la variable id_Salle
      Id = match[0];
      console.log(Id);
      selectRoom(Id);

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

// const salle1 = document.querySelector('.salle1');
// const salle2 = document.querySelector('.salle2');
// const salle3 = document.querySelector('.salle3');
// const calendar = document.querySelector('.calendar-wrapper');

// salle1.addEventListener('click', () => {
//     selectRoom(1);
// });

// salle2.addEventListener('click', () => {
//     selectRoom(2);
// });

// salle3.addEventListener('click', () => {
//     selectRoom(3);
// });
//quand on clique sur une salle on execute la fonction selectroom() le id n'est pas automatique
//! determine le Id_salle

//code pour le calendrier 
const daysTag = document.querySelector(".days"); //selectionner les jours
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(); //recupère la date et l'heure actuelle (selon l'horloge du systeme de l'utilisateur)
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    //génere le calendrier dynamique
    
    firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";  // Initialize liTag here

    for (let i = firstDayofMonth; i > 0; i--)
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                        && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++)
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    $('.days').click(function() {
        var dayClicked = this.className;

        if (dayClicked !== "inactive")
            openBookingTimeModal();
    });
}
//active est pour le calendrier et available est pour les reservations
renderCalendar();

function handleDates() {
    //! determine dataDate
    // envoi a fetch data la date selectionné et la date actuelle (?)
    const days = daysTag.querySelectorAll("li");
    days.forEach(element => {
        element.addEventListener("click", (e) => {
            dataDate = e.target.textContent + currentDate.innerText;
            fetchdata(dataDate, Id_salle);
        });
    });
}
handleDates();

let idTime;

function selectBlock() {
    //definie les dates disponibles et envoie les données pour la reservation
    //determine idTime
    const blocks = document.querySelectorAll(".time-block.available");

    function handleClick(e) {
        idTime = e.target.id; //stocke le id du block cliqué

        // Vérifier si le bloc a déjà été réservé
        if (e.target.classList.contains("unavailable")) {
            console.log("Ce bloc de temps est déjà réservé.");
            return;
        }

        // Effectuer la réservation
        // fetchreservation(details,dataDate, Id_salle, idTime, equipement);

        // Mettre à jour l'apparence du bloc réservé
        e.target.classList.remove("available");
        e.target.classList.add("unavailable");

        // Détacher les gestionnaires d'événements après la réservation
        blocks.forEach(block => {
            block.removeEventListener("click", handleClick);
        });
    }

    blocks.forEach(block => {
        block.addEventListener("click", handleClick);
    });
}

//génere le nouveau calendrier quand on change du mois 
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }

        renderCalendar();
        handleDates();
    });
});

let bookingTime_modal = document.getElementById("booking-time-modal");

function openBookingTimeModal(){
    //ouvre la liste des heures de reservation (les blocks)
    bookingTime_modal.classList.add("open-booking-time-modal");
}

function closeBookingTimeModal(){
    //ferme la liste des heures de reservation (les blocks)
    document.getElementById('booking-modal').classList.remove('open-booking-modal')
}

let booking_modal = document.getElementById("booking-modal");

function openBookingModal(){
    //ouvre le formulair
    booking_modal.classList.add("open-booking-modal");
    document.getElementById('booking-time-modal').classList.remove('open-booking-time-modal') //ferme la page pour choisir les dates
}

function closeBookingModal(){
    //ferme le formulaire
    booking_modal.classList.remove("open-booking-modal");
}


function handelAvailablity(timeData){
    //charger la disponibilité des blocks a partir de la base de donnée (pas avec le clic != selectBlock)
    const allTimeBlocks = document.querySelectorAll('.time-block.available');

    const obj = timeData;
    const arr = Object.values(obj);
    console.log(arr);
    allTimeBlocks.forEach(block => {
        let id = block.id;
        console.log(id);
        arr.forEach(data=>{
            console.log(id==data);
            if(id == data.Time){
                block.classList.remove("available");
                block.classList.add("unavailable");
            }
        })
    });

    const timeBlocks = document.querySelectorAll('.time-block.available');

    timeBlocks.forEach(block => {
        block.addEventListener('click', openBookingModal);
        block.addEventListener('click',selectBlock(dataDate)); //essayer d'enelever datadate car pas besoin
    });
}

//recuperer les informations du formulaire
document.querySelector(".submit-btn").addEventListener("click", function recupereInfo () {
    // Récupérer les valeurs des champs du formulaire
    // nom = document.getElementById("client-name").value;
    // prenom = document.getElementById("client-first-name").value;
    // email = document.getElementById("client-email").value;
    // telephone = document.getElementById("client-phone").value;
    equipement = document.getElementById("client-equipement").value;
    details = document.getElementById("client-details").value;

    // Vérifier si les champs obligatoires ne sont pas vides
    if (equipement.trim() === '') {
        alert("Veuillez choisir une option d'equipement");
        return;
    }
    else {
        console.log (equipement);
        fetchreservation(details,dataDate, Id_salle, idTime, equipement);
        closeBookingModal(); //ne marche pas
    }
})

