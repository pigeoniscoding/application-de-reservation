


function fetchdata(date,Id_salle){
    console.log(JSON.stringify(date));
    const object = {
        date: date,
        id : Id_salle,
    }
    //demander au backend d'envoyer les infos
    fetch("http://localhost:3000/disponibilite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    .then(res => res.json())
    .then(data => console.log(data)) //data = res.json
    .catch(error => console.log(error))

}

// window.addEventListener("DOMContentLoaded",()=>{
//     fetchdata();
// })

//selectionner la salle
const salle1 = document.querySelector('.salle1')
const salle2 = document.querySelector('.salle2')
const salle3 = document.querySelector('.salle3')
let Id_salle =''

function selectRoom1 (){
    Id_salle = 1;
    
    return(Id_salle);
}
function selectRoom2 (){
    Id_salle = 2;
    return(Id_salle);
}
function selectRoom3 (){
    Id_salle = 3;
    return(Id_salle);
}

salle1.addEventListener('click', ()=>{
    selectRoom1();
    console.log(Id_salle);
});
salle2.addEventListener('click',()=>{
    selectRoom2();
    console.log(Id_salle);
});
salle3.addEventListener('click', ()=>{
    selectRoom3();
    console.log(Id_salle);}
    );

console.log(Id_salle);

//selectionner les jours



// let diponibilite = 0 ;

// selectionner les jours du calendrier
const daysTag = document.querySelector(".days"),
// selectionner le current date
currentDate = document.querySelector(".current-date"),
// slectionner la partie span de la div "icons"
prevNextIcon = document.querySelectorAll(".icons span");

// Creating a new date and getting the current year and month
let date = new Date(), //the Date object is without arguments so it gets the current date
//for now currentDate != date
// date is: mounth day year
currYear = date.getFullYear(),
//gets the year of the current date
currMonth = date.getMonth()
//gets the mounth of the current date

// Store months in an array
const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"]

const renderCalendar = () => {

    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // Get first day of month
    //the result would be a number: 0 for sunday, 1 for monday etc...
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // Get last date of month: savoir si le dernier
    //jour est le 30 ou 31  
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // Get last day of month
    //voir le jour correspondant a cette date
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate() // Getting last date of previous month

    let liTag = "" 

    //ceci est la partie importante pour le code

    // Create li of previous month last days
    // rendre tous les jours avant le premier du mois inactive
    for (let i = firstDayofMonth; i > 0; i--)
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`

    // Create li of all days of current month
    for (let i = 1; i <= lastDateofMonth; i++) { //selection tous les jours jusqu'a la fin du mois
        // Add active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                        && currYear === new Date().getFullYear() ? "active" : ""
        liTag += `<li class="${isToday}">${i}</li>` //selectionner le jour actuel pour le highlight
    }

    //3 types d'etats pour les jours : 
    // inactive : pour les journnées qui ne font pas partie du mois actuel
    //active : pour la journée actuelle
    // no class : pour les journées du mois qui ne sont pas la journée actuelle 

    // Create li of next month first days
    for (let i = lastDayofMonth; i < 6; i++)
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    // question: comment le calendrier sache ils quand s'arrter?

    // Pass current month and year as currentDate text
    currentDate.innerText = `${months[currMonth]} ${currYear}` //afiché sur le calendrier
    daysTag.innerHTML = liTag //remplir les jours du mois

    // Open booking time form when a day is clicked
    // function is using JQUERY!
    $('.days').click(function() { //selects all days and adds an eventlistener
        var dayClicked = this.className //prend la class et la stocke dans la var (?)
        console.log("--" + dayClicked) //renvoie la class
    
        if (dayClicked !== "inactive")
            openBookingTimeModal() //si le jour est active (jour du mois: le formulaire s'ouvre)
    }) 
        // !!!!!a changer pour ouvrir la selection des salles!!!!
    

}
//ceci est la partie importante pour le code


renderCalendar() //executer la fonction

function handleDates (){
    const days = daysTag.querySelectorAll("li")
    days.forEach(element => {
    element.addEventListener("click",(e)=>{
        console.log(e.target.textContent + currentDate.innerText);
        const dataDate = e.target.textContent + currentDate.innerText;
        fetchdata(dataDate,Id_salle);


    })
});
}
handleDates();



// Get prev and next icons
prevNextIcon.forEach(icon => {
    // Add click event on both icons
    icon.addEventListener("click", () => { 
        // Increment or decrement the current month if the prev or next icon is clicked
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1
        // fonction if/else pour passer au mois suivant/d'avant
        
        if(currMonth < 0 || currMonth > 11) {
            // Update current month and year with newly created date month and year
            //selectionner une nouvelle/ancienne année
            date = new Date(currYear, currMonth)
            currYear = date.getFullYear()
            currMonth = date.getMonth() 
        } else {
            date = new Date() // pass the current date as date value
        }
  
    renderCalendar()

    handleDates();
    })

})

// Open and close the booking time modal
let bookingTime_modal = document.getElementById("booking-time-modal")
function openBookingTimeModal(){
    bookingTime_modal.classList.add("open-booking-time-modal")
} //fonction pour ouvrir le modal
function closeBookingTimeModal(){
    bookingTime_modal.classList.remove("open-booking-time-modal")
} //fonction pour le fermer



function timeAvailable(){
    if (diponibilite !== 1){
        let timeAvailabilty = document.getElementById("1") ;//selectionner les time blocks

        console.log(timeAvailabilty)

        timeAvailabilty.classList.remove("available") //enlever la class
        timeAvailabilty.classList.add("unavailable") //ajouter une nouvelle classe

        console.log(document.querySelector(".time-block unavailable"))
        
    }
}

timeAvailable();

// Open and close the booking form modal
let booking_modal = document.getElementById("booking-modal")
function openBookingModal(){
    booking_modal.classList.add("open-booking-modal")
} //fonction pour ouvrir le formulaire
function closeBookingModal(){
    booking_modal.classList.remove("open-booking-modal")
} //fonction pour fermer le formulaire


// Open booking form when a time is clicked
//ceci est tres important pour l'application!

const timeBlocks = document.querySelectorAll('.time-block.available');

timeBlocks.forEach(block => {
  block.addEventListener('click', openBookingModal);
});

