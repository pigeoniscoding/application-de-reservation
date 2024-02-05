let timeData = {};
let dataDate = '';
let Id_salle = '';
let firstDayofMonth; 
let lastDayofMonth; // Déclaration en dehors de la fonction
let lastDateofMonth
let lastDateofLastMonth
function fetchdata(date, Id_salle) {
    const object = {
        date: date,
        id: Id_salle,
    };
    console.log(object);
    fetch("http://localhost:3000/disponibilite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    .then(res => res.json())
    .then(data => {
        timeData = data.data;
        handelAvailablity(timeData);
    })
    .catch(error => console.log(error));
}

function fetchreservation(dateDate, Id_salle, idTime) {
    const object = {
        date: dateDate,
        id: Id_salle,
        idTime: idTime,
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
            closeBookingModal();
        } else {
            // Sinon, affichez un message d'erreur ou effectuez une action appropriée
            console.error("Erreur lors de la réservation.");
        }
    })
    .catch(error => console.log(error));
}


function selectRoom(Id) {
    Id_salle = Id;
    calendar.style.visibility = "visible";
}

const salle1 = document.querySelector('.salle1');
const salle2 = document.querySelector('.salle2');
const salle3 = document.querySelector('.salle3');
const calendar = document.querySelector('.calendar-wrapper');

salle1.addEventListener('click', () => {
    selectRoom(1);
});

salle2.addEventListener('click', () => {
    selectRoom(2);
});

salle3.addEventListener('click', () => {
    selectRoom(3);
});

const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    // ...
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

renderCalendar();

function handleDates() {
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
    const blocks = document.querySelectorAll(".time-block.available");

    function handleClick(e) {
        const idTime = e.target.id;

        // Vérifier si le bloc a déjà été réservé
        if (e.target.classList.contains("unavailable")) {
            console.log("Ce bloc de temps est déjà réservé.");
            return;
        }

        // Effectuer la réservation
        fetchreservation(dataDate, Id_salle, idTime);

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
    bookingTime_modal.classList.add("open-booking-time-modal");
}

function closeBookingTimeModal(){
    bookingTime_modal.classList.remove("open-booking-time-modal");
}

let booking_modal = document.getElementById("booking-modal");

function openBookingModal(){
    booking_modal.classList.add("open-booking-modal");
}

function closeBookingModal(){
    booking_modal.classList.remove("open-booking-modal");
}

function handelAvailablity(timeData){
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
        block.addEventListener('click',selectBlock(dataDate));
    });
}
