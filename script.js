// ===============================
// MARKANE CUP GAME ENGINE
// VERSION 1
// ===============================


// Screens

const homeScreen = document.getElementById("homeScreen");
const teamSelection = document.getElementById("teamSelection");

const playButton = document.getElementById("playButton");

const teamContainer = document.getElementById("teamContainer");

const confirmTeam = document.getElementById("confirmTeam");


// Variables

let teams = [];

let selectedTeam = null;



// ===============================
// PLAY BUTTON
// ===============================


playButton.onclick = function(){

    homeScreen.classList.add("hidden");

    teamSelection.classList.remove("hidden");

    loadTeams();

};




// ===============================
// LOAD TEAMS FROM JSON
// ===============================


async function loadTeams(){

    const response = await fetch("teams.json");

    teams = await response.json();


    displayTeams();

}





// ===============================
// DISPLAY TEAM CARDS
// ===============================


function displayTeams(){


    teamContainer.innerHTML = "";


    teams.forEach(team => {


        let overall = calculateOverall(team);


        let card = document.createElement("div");

        card.className = "teamCard";



        card.innerHTML = `

        <img src="${team.flag}">

        <h2>${team.name}</h2>

        <div class="rating">
        Overall: ${overall}
        </div>

        <p>
        Formation:
        ${team.formation}
        </p>

        `;



        card.onclick = function(){


            document.querySelectorAll(".teamCard")
            .forEach(card=>{

                card.classList.remove("selectedTeam");

            });


            card.classList.add("selectedTeam");


            selectedTeam = team;



        };


        teamContainer.appendChild(card);


    });


}





// ===============================
// CALCULATE TEAM OVERALL
// ===============================


function calculateOverall(team){


    let starters = team.players.filter(player => 
        player.type === "starter"
    );


    let total = 0;


    starters.forEach(player=>{

        total += player.rating;

    });



    let average = total / starters.length;


    return Math.round(average);


}





// ===============================
// CONFIRM TEAM
// ===============================


confirmTeam.onclick = function(){


    if(selectedTeam == null){

        alert("Please select a nation first!");

        return;

    }



    alert(
        "You selected " 
        + selectedTeam.name
    );



};
