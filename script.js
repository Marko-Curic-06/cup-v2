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

// =====================================
// MARKANE CUP V2
// TOURNAMENT ENGINE
// PART 5A
// =====================================


// SCREENS

const homeScreen = document.getElementById("homeScreen");
const teamSelection = document.getElementById("teamSelection");
const tournamentScreen = document.getElementById("tournamentScreen");
const matchScreen = document.getElementById("matchScreen");
const championScreen = document.getElementById("championScreen");


// BUTTONS

const playButton = document.getElementById("playButton");
const confirmTeam = document.getElementById("confirmTeam");
const simulateButton = document.getElementById("simulateButton");


// AREAS

const teamContainer = document.getElementById("teamContainer");
const bracket = document.getElementById("bracket");


// GAME VARIABLES

let teams = [];

let selectedTeam = null;

let tournamentTeams = [];

let currentMatch = null;

let score = {

home:0,
away:0

};





// =====================================
// START GAME
// =====================================


playButton.onclick = function(){


homeScreen.classList.add("hidden");

teamSelection.classList.remove("hidden");

loadTeams();


};





// =====================================
// LOAD TEAMS
// =====================================


async function loadTeams(){


let response = await fetch("teams.json");

teams = await response.json();


displayTeams();


}







// =====================================
// DISPLAY TEAMS
// =====================================


function displayTeams(){


teamContainer.innerHTML="";


teams.forEach(team=>{


let overall = calculateOverall(team);



let card=document.createElement("div");


card.className="teamCard";



card.innerHTML=`

<img src="${team.flag}">

<h2>${team.name}</h2>

<p>
Overall: ${overall}
</p>

<p>
${team.formation}
</p>

`;



card.onclick=function(){


document.querySelectorAll(".teamCard")
.forEach(c=>c.classList.remove("selectedTeam"));


card.classList.add("selectedTeam");


selectedTeam=team;


};


teamContainer.appendChild(card);



});


}






// =====================================
// OVERALL CALCULATOR
// =====================================


function calculateOverall(team){


let players =
team.players.filter(
p=>p.type==="starter"
);



let total=0;



players.forEach(player=>{


total+=player.rating;


});



return Math.round(
total / players.length
);


}







// =====================================
// CONFIRM TEAM
// =====================================


confirmTeam.onclick=function(){


if(!selectedTeam){

alert("Select a team!");

return;

}



tournamentTeams =
shuffle([...teams]);



teamSelection.classList.add("hidden");

tournamentScreen.classList.remove("hidden");



createBracket();



};







// =====================================
// RANDOMIZER
// =====================================


function shuffle(array){


return array.sort(
()=>Math.random()-0.5
);


}







// =====================================
// CREATE WORLD CUP DRAW
// =====================================


function createBracket(){


bracket.innerHTML="";


for(let i=0;i<tournamentTeams.length;i+=2){


let match=document.createElement("div");


match.className="matchBox";


match.innerHTML=`

${tournamentTeams[i].name}

<img width="40" src="${tournamentTeams[i].flag}">


<br>

VS

<br>


<img width="40" src="${tournamentTeams[i+1].flag}">


${tournamentTeams[i+1].name}

`;



bracket.appendChild(match);



}



}

// =====================================
// PART 5C
// MATCH TIMER + EXTRA TIME + PENALTIES
// =====================================


let matchMinute = 0;

let timer;



// =====================================
// START MATCH CLOCK
// =====================================


function startMatchTimer(){


matchMinute = 0;


document.getElementById("gameClock").innerHTML =
"0'";


// 90 minutes = 15 seconds
// 1 game minute = 0.166 seconds


timer = setInterval(()=>{


matchMinute += 1;



document.getElementById("gameClock").innerHTML =
matchMinute + "'";



// Regular time finished

if(matchMinute >= 90){


clearInterval(timer);



checkExtraTime();



}



},166);



}







// =====================================
// CHECK EXTRA TIME
// =====================================


function checkExtraTime(){


if(score.home === score.away){



addEvent(
"90 minutes finished. Extra time begins!"
);



startExtraTime();



}

else{


finishMatch();


}


}







// =====================================
// EXTRA TIME
// =====================================


function startExtraTime(){


matchMinute = 90;



timer = setInterval(()=>{


matchMinute++;



document.getElementById("gameClock").innerHTML =
matchMinute + "'";





if(matchMinute >=120){



clearInterval(timer);



if(score.home === score.away){


startPenalties();


}

else{


finishMatch();


}



}



},200);





}







// =====================================
// PENALTY SHOOTOUT
// =====================================


function startPenalties(){



addEvent(
"Match goes to penalties!"
);



let homePens = 0;

let awayPens = 0;



for(let i=0;i<5;i++){



if(Math.random()>0.35){

homePens++;

}



if(Math.random()>0.35){

awayPens++;

}


}



if(homePens===awayPens){



// sudden death


if(Math.random()>0.5){

homePens++;

}

else{

awayPens++;

}



}



addEvent(
"Penalty Result: "
+
homePens
+
" - "
+
awayPens
);



if(homePens>awayPens){


winner=currentMatch.home;


}

else{


winner=currentMatch.away;


}



finishMatch();


}







// =====================================
// FINISH MATCH
// =====================================


function finishMatch(){



clearInterval(timer);



addEvent(
"FULL TIME"
);



}

// =====================================
// PART 5D
// TOURNAMENT PROGRESSION SYSTEM
// =====================================



let winners = [];

let currentRound = 0;

let champion = null;





// =====================================
// START TOURNAMENT
// =====================================


function startTournament(){


currentRound = 1;

winners = [];


playRound(tournamentTeams);


}






// =====================================
// PLAY A ROUND
// =====================================


function playRound(teamsInRound){



winners = [];



for(let i = 0; i < teamsInRound.length; i += 2){



let team1 = teamsInRound[i];

let team2 = teamsInRound[i+1];



let result = simulateAI(team1,team2);



winners.push(result);



}



if(winners.length === 1){


showChampion(winners[0]);


}

else{


setTimeout(()=>{


showNextRound();


},2000);


}



}







// =====================================
// AI MATCH SIMULATION
// =====================================


function simulateAI(team1,team2){



let rating1 = calculateOverall(team1);

let rating2 = calculateOverall(team2);



let chance1 = rating1 / (rating1 + rating2);



let score1 = 0;

let score2 = 0;



for(let i=0;i<5;i++){



if(Math.random() < chance1/2){

score1++;

}



if(Math.random() < (1-chance1)/2){

score2++;

}


}






// Tie breaker

if(score1===score2){


if(Math.random()>0.5){

score1++;

}

else{

score2++;

}


}




return score1 > score2 ? team1 : team2;



}







// =====================================
// NEXT ROUND DISPLAY
// =====================================


function showNextRound(){



tournamentScreen.classList.remove("hidden");


bracket.innerHTML="";



let title=document.createElement("h2");



if(winners.length===4){

title.innerHTML="SEMIFINALS";


}

else if(winners.length===2){

title.innerHTML="FINAL";


}



bracket.appendChild(title);





for(let i=0;i<winners.length;i+=2){



let box=document.createElement("div");


box.className="matchBox";



box.innerHTML=`

${winners[i].name}

<img width="50" src="${winners[i].flag}">


<br>

VS

<br>


<img width="50" src="${winners[i+1].flag}">


${winners[i+1].name}

`;



bracket.appendChild(box);



}





setTimeout(()=>{


playRound(winners);


},4000);



}








// =====================================
// CHAMPION SCREEN
// =====================================


function showChampion(team){



champion = team;



tournamentScreen.classList.add("hidden");


championScreen.classList.remove("hidden");



document.getElementById("winnerName")
.innerHTML = `

<img width="120" src="${team.flag}">

<br>

${team.name}

`;



}
// =====================================
// PART 6
// REALISTIC SOCCER MATCH SIMULATION
// =====================================



let matchEvents = [];

let playerStats = {};





// =====================================
// CREATE PLAYER STAT DATABASE
// =====================================


function createPlayerStats(){


teams.forEach(team=>{


team.players.forEach(player=>{


playerStats[player.name]={

goals:0,
assists:0,
yellow:0,
red:0,
games:0

};


});


});


}







// =====================================
// START A MATCH
// =====================================


function simulateMatch(homeTeam, awayTeam){



matchEvents=[];



let homeGoals = 0;

let awayGoals = 0;



let homeRating = calculateOverall(homeTeam);

let awayRating = calculateOverall(awayTeam);




let goalChance =
(homeRating + awayRating) / 200;





// MATCH MINUTES


for(let minute = 1; minute <= 90; minute++){



// Goal chance


if(Math.random() < goalChance/90){


let scorer =
chooseGoalScorer(homeTeam);



homeGoals++;


addGoal(
homeTeam,
scorer,
minute
);



}



if(Math.random() < goalChance/110){


let scorer =
chooseGoalScorer(awayTeam);



awayGoals++;


addGoal(
awayTeam,
scorer,
minute
);



}





// Cards


if(Math.random()<0.03){


giveYellow(
randomPlayer(homeTeam),
minute
);


}



if(Math.random()<0.025){


giveYellow(
randomPlayer(awayTeam),
minute
);


}





// Red card chance


if(Math.random()<0.005){


giveRed(
randomPlayer(homeTeam),
minute
);


}




// Injury


if(Math.random()<0.01){


injuryEvent(
homeTeam,
minute
);


}



}




return {

home:homeTeam,

away:awayTeam,

homeScore:homeGoals,

awayScore:awayGoals,

events:matchEvents


};



}







// =====================================
// PICK SCORER
// =====================================


function chooseGoalScorer(team){



let attackers =
team.players.filter(player=>

player.position==="ST" ||
player.position==="LW" ||
player.position==="RW" ||
player.position==="CAM"

);



if(attackers.length===0){

return randomPlayer(team);

}



return attackers[
Math.floor(Math.random()*attackers.length)
];


}







// =====================================
// ADD GOAL
// =====================================


function addGoal(team,player,minute){



let assist =
randomPlayer(team);



playerStats[player.name].goals++;


playerStats[assist.name].assists++;



matchEvents.push(

minute+
"' ⚽ GOAL! "+
player.name+
" ("+
team.name+
") Assist: "+
assist.name

);


}







// =====================================
// YELLOW CARD
// =====================================


function giveYellow(player,minute){



playerStats[player.name].yellow++;



matchEvents.push(

minute+
"' 🟨 Yellow card: "+
player.name

);


}







// =====================================
// RED CARD
// =====================================


function giveRed(player,minute){



playerStats[player.name].red++;



matchEvents.push(

minute+
"' 🟥 RED CARD: "+
player.name

);


}







// =====================================
// INJURY
// =====================================


function injuryEvent(team,minute){



let player =
randomPlayer(team);



matchEvents.push(

minute+
"' 🤕 Injury: "+
player.name+
" leaves the match"

);



let substitute =
chooseSubstitute(team);



if(substitute){


matchEvents.push(

"🔄 "+
substitute.name+
" enters as replacement"

);


}



}







// =====================================
// RANDOM PLAYER
// =====================================


function randomPlayer(team){


return team.players[

Math.floor(
Math.random()*team.players.length

)

];


}







// =====================================
// CHOOSE SUBSTITUTE
// =====================================


function chooseSubstitute(team){



if(team.bench){


return team.bench[

Math.floor(
Math.random()*team.bench.length
)

];


}



return null;


}







// =====================================
// SHOW MATCH EVENTS
// =====================================


function displayMatchEvents(result){



let box =
document.getElementById("matchEvents");



box.innerHTML="";



result.events.forEach(event=>{


let line =
document.createElement("p");


line.innerHTML=event;


box.appendChild(line);



});



}
// =====================================
// PART 7
// TOURNAMENT STATISTICS SYSTEM
// =====================================



let tournamentStats = {

players:{},

teams:{}

};





// =====================================
// INITIALIZE TOURNAMENT STATS
// =====================================


function initializeStats(){


teams.forEach(team=>{


// Team stats


tournamentStats.teams[team.name]={

played:0,
wins:0,
losses:0,
goals:0,
goalsAgainst:0

};





// Player stats


team.players.forEach(player=>{


tournamentStats.players[player.name]={


team:team.name,

goals:0,

assists:0,

appearances:0,

yellowCards:0,

redCards:0


};


});



});



}








// =====================================
// UPDATE STATS AFTER MATCH
// =====================================


function updateMatchStats(result){



let home = result.home;

let away = result.away;



let homeName = home.name;

let awayName = away.name;



let homeStats =
tournamentStats.teams[homeName];


let awayStats =
tournamentStats.teams[awayName];





// Matches played


homeStats.played++;

awayStats.played++;





// Goals


homeStats.goals += result.homeScore;

awayStats.goals += result.awayScore;



homeStats.goalsAgainst += result.awayScore;

awayStats.goalsAgainst += result.homeScore;





// Winner


if(result.homeScore > result.awayScore){


homeStats.wins++;

awayStats.losses++;


}

else{


awayStats.wins++;

homeStats.losses++;


}







// Player appearances


home.players.forEach(player=>{


if(tournamentStats.players[player.name]){


tournamentStats.players[player.name].appearances++;


}



});




away.players.forEach(player=>{


if(tournamentStats.players[player.name]){


tournamentStats.players[player.name].appearances++;


}



});





}







// =====================================
// GOLDEN BOOT
// =====================================


function getGoldenBoot(){



let players =
Object.values(
tournamentStats.players
);



players.sort(
(a,b)=>b.goals-a.goals
);



return players.slice(0,10);



}







// =====================================
// ASSIST LEADERBOARD
// =====================================


function getAssistLeaders(){



let players =
Object.values(
tournamentStats.players
);



players.sort(
(a,b)=>b.assists-a.assists
);



return players.slice(0,10);


}








// =====================================
// PLAYER OF TOURNAMENT
// =====================================


function getPlayerOfTournament(){



let players =
Object.entries(
tournamentStats.players
);



players.sort((a,b)=>{


let scoreA =
(a[1].goals*5)
+
(a[1].assists*3)
+
(a[1].appearances);



let scoreB =
(b[1].goals*5)
+
(b[1].assists*3)
+
(b[1].appearances);



return scoreB-scoreA;



});



return players[0];


}








// =====================================
// DISPLAY GOLDEN BOOT
// =====================================


function displayGoldenBoot(){



let leaderboard =
document.getElementById("goldenBoot");



leaderboard.innerHTML =
"<h2>🏆 Golden Boot</h2>";



let players =
getGoldenBoot();



players.forEach((player,index)=>{


let line =
document.createElement("p");


line.innerHTML =

(index+1)
+
". "
+
player.team
+
" - "
+
player.goals
+
" goals";


leaderboard.appendChild(line);



});



}








// =====================================
// DISPLAY ASSIST LEADERS
// =====================================


function displayAssistLeaders(){



let leaderboard =
document.getElementById("assistLeaders");



leaderboard.innerHTML =
"<h2>🎯 Assist Leaders</h2>";



let players =
getAssistLeaders();



players.forEach((player,index)=>{


let line =
document.createElement("p");


line.innerHTML =

(index+1)
+
". "
+
player.team
+
" - "
+
player.assists
+
" assists";



leaderboard.appendChild(line);



});



}








// =====================================
// FINAL TOURNAMENT AWARDS
// =====================================


function showTournamentAwards(){



let player =
getPlayerOfTournament();



console.log(
"⭐ Player of Tournament:",
player[0]
);



console.log(
"🏆 Golden Boot:",
getGoldenBoot()
);



console.log(
"🎯 Assist Leader:",
getAssistLeaders()
);



}
// =====================================
// PART 8
// PLAYER CONTROLLED MATCH SYSTEM
// =====================================



let roundMatches = [];

let roundWinners = [];

let playerMatch = false;





// =====================================
// CREATE ROUND MATCHES
// =====================================


function createRoundMatches(teamList){


roundMatches=[];


for(let i=0;i<teamList.length;i+=2){


roundMatches.push({

home:teamList[i],

away:teamList[i+1]

});


}



return roundMatches;


}







// =====================================
// START ROUND
// =====================================


function startPlayerRound(teamList){


roundMatches = createRoundMatches(teamList);


roundWinners=[];



roundMatches.forEach(match=>{


if(
match.home.name === selectedTeam.name ||
match.away.name === selectedTeam.name
){


playerMatch=true;


startPlayerMatch(match);



}

else{


let result =
simulateMatch(
match.home,
match.away
);



let winner =
getMatchWinner(result);



roundWinners.push(winner);



}



});



}







// =====================================
// START PLAYER MATCH
// =====================================


function startPlayerMatch(match){



currentMatch=match;



matchScreen.classList.remove("hidden");



document.getElementById("matchTitle").innerHTML =


match.home.name
+
" 🇺🇳 VS 🇺🇳 "
+
match.away.name;



document.getElementById("scoreBoard").innerHTML =

"0 - 0";



document.getElementById("matchEvents").innerHTML="";



}







// =====================================
// SIMULATE BUTTON
// =====================================


simulateButton.onclick=function(){



if(!currentMatch){

return;

}



let result =
simulateMatch(
currentMatch.home,
currentMatch.away
);



displayMatchEvents(result);



document.getElementById("scoreBoard").innerHTML =


result.home.name
+
" "
+
result.homeScore
+
" - "
+
result.awayScore
+
" "
+
result.away.name;



updateMatchStats(result);



let winner =
getMatchWinner(result);



roundWinners.push(winner);



setTimeout(()=>{


endPlayerMatch();


},5000);



};








// =====================================
// FIND WINNER
// =====================================


function getMatchWinner(result){


if(result.homeScore > result.awayScore){


return result.home;


}


else{


return result.away;


}



}








// =====================================
// END PLAYER MATCH
// =====================================


function endPlayerMatch(){



matchScreen.classList.add("hidden");



continueRound();



}








// =====================================
// CONTINUE TO NEXT ROUND
// =====================================


function continueRound(){



if(roundWinners.length===4){


showNextRound();


startPlayerRound(roundWinners);



}



else if(roundWinners.length===2){


showNextRound();


startPlayerRound(roundWinners);



}



else if(roundWinners.length===1){



showChampion(roundWinners[0]);


}



}
<div id="bracket" class="bracket">

    <div class="round">
        <h2>Quarter Finals</h2>
        <div id="quarterFinals"></div>
    </div>


    <div class="round">
        <h2>Semi Finals</h2>
        <div id="semiFinals"></div>
    </div>


    <div class="round">
        <h2>Final</h2>
        <div id="finalMatch"></div>
    </div>


</div>
// =====================================
// PART 10
// ADVANCED TEAM RATINGS SYSTEM
// =====================================



let teamRatings = {};





// =====================================
// CREATE ADVANCED RATINGS
// =====================================


function calculateAdvancedRatings(team){



let attackPlayers =
team.players.filter(player =>

player.position === "ST" ||
player.position === "LW" ||
player.position === "RW"

);



let midfieldPlayers =
team.players.filter(player =>

player.position === "CM" ||
player.position === "CAM"

);



let defencePlayers =
team.players.filter(player =>

player.position === "CB" ||
player.position === "LB" ||
player.position === "RB"

);



let goalkeeper =
team.players.find(player =>

player.position === "GK"

);





function average(players){


if(players.length===0){

return 0;

}


let total = 0;


players.forEach(player=>{


total += player.rating;


});


return Math.round(total / players.length);


}





return {


overall:
calculateOverall(team),


attack:
average(attackPlayers),


midfield:
average(midfieldPlayers),


defence:
average(defencePlayers),


goalkeeper:
goalkeeper ? goalkeeper.rating : 0



};



}








// =====================================
// LOAD ALL TEAM RATINGS
// =====================================


function createAllTeamRatings(){



teams.forEach(team=>{


teamRatings[team.name] =
calculateAdvancedRatings(team);



});



}








// =====================================
// REALISTIC MATCH CHANCE
// =====================================


function calculateWinChance(team1,team2){



let rating1 =
teamRatings[team1.name];


let rating2 =
teamRatings[team2.name];





let strength1 =

(rating1.attack * 0.35)
+
(rating1.midfield * 0.25)
+
(rating1.defence * 0.25)
+
(rating1.goalkeeper * 0.15);




let strength2 =

(rating2.attack * 0.35)
+
(rating2.midfield * 0.25)
+
(rating2.defence * 0.25)
+
(rating2.goalkeeper * 0.15);





return strength1 / (strength1 + strength2);



}







// =====================================
// IMPROVED GOAL SIMULATION
// =====================================


function calculateGoals(team,opponent){



let chance =
calculateWinChance(team,opponent);





let goals = 0;



for(let i=0;i<90;i++){



let scoringChance =

(chance / 500);



if(Math.random() < scoringChance){


goals++;


}



}



return goals;



}







// =====================================
// DISPLAY RATINGS
// =====================================


function showTeamRatings(team){



let rating =
teamRatings[team.name];



console.log(

team.name

+
`

Overall: ${rating.overall}

Attack: ${rating.attack}

Midfield: ${rating.midfield}

Defence: ${rating.defence}

Goalkeeper: ${rating.goalkeeper}

`

);



}
// =====================================
// PART 11
// SAVE SYSTEM
// =====================================



const SAVE_KEY = "MARKANE_CUP_SAVE";





// =====================================
// SAVE GAME
// =====================================


function saveGame(){



let saveData = {


selectedTeam:

selectedTeam ? selectedTeam.name : null,


tournamentTeams:

tournamentTeams.map(team=>team.name),



roundWinners:

roundWinners.map(team=>team.name),



currentRound:


currentRound,



playerStats:


tournamentStats,



champion:


champion ? champion.name : null



};





localStorage.setItem(

SAVE_KEY,

JSON.stringify(saveData)

);



console.log("Game Saved!");



}







// =====================================
// LOAD GAME
// =====================================


function loadGame(){



let saved =

localStorage.getItem(SAVE_KEY);



if(!saved){


console.log("No save found");


return false;


}



let data =

JSON.parse(saved);






// Restore selected team


if(data.selectedTeam){


selectedTeam =

teams.find(team=>

team.name === data.selectedTeam

);



}





// Restore tournament teams


if(data.tournamentTeams){



tournamentTeams =

data.tournamentTeams.map(name=>

teams.find(team=>

team.name===name

)

);



}







// Restore winners


if(data.roundWinners){



roundWinners =

data.roundWinners.map(name=>

teams.find(team=>

team.name===name

)

);



}





// Restore round


currentRound = data.currentRound;






// Restore champion


if(data.champion){


champion =

teams.find(team=>

team.name===data.champion

);



}




console.log("Game Loaded!");

return true;



}







// =====================================
// DELETE SAVE
// =====================================


function deleteSave(){



localStorage.removeItem(SAVE_KEY);



console.log("Save Deleted");



}







// =====================================
// AUTO SAVE AFTER MATCHES
// =====================================


function autoSave(){


saveGame();


}
