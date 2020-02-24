let dealer_pile = []
let dealer_sum = 0
let player_pile = []
let player_sum = 0
let deck_id = ""
let isStand = false
let dealerDrawed = false // preventing keeping drawing in background

const start_button = document.getElementById("start");
const hit_button = document.getElementById("hit-button");
const stand_button = document.getElementById("stand-button");
const promptMes = document.getElementById("prompt");
const dealerSumText = document.getElementById("dealer_prompt");
const playerSumText = document.getElementById("player_prompt");

const debug_button = document.getElementById("debug-button");

const init_url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
let draw_url = ""
const card_cover_src = "https://deckofcardsapi.com/static/img/XX.png"

window.addEventListener('DOMContentLoaded', function(){
    start_button.onclick = init;
    debug_button.onclick = debug;    
    hit_button.onclick = playerDraw;
    stand_button.onclick = stand;
})



async function init(event){
    const response = await fetch(init_url);
    const deckJson = await response.json();
    deck_id = deckJson.deck_id;
    draw_url = "https://deckofcardsapi.com/api/deck/"+deck_id+"/draw/?count=1";
    dealer_pile = []
    dealer_sum = 0
    player_pile = []
    player_sum = 0
    hit_button.disabled = false;
    stand_button.disabled = false;
    isStand = false;
    promptMes.textContent = "GOOD LUCK!";
    dealerSumText.firstElementChild.textContent = "Dealer: "
    while (document.getElementById("player-cards").childElementCount>0){
        document.getElementById("player-cards").firstChild.remove();
    }
    while (document.getElementById("dealer-cards").childElementCount>0){
        document.getElementById("dealer-cards").firstChild.remove();
    }
    dealerDraw();
    playerDraw();
}



async function dealerDraw(event){
    const response = await fetch(draw_url);
    const oneDrawJson = await response.json();

    dealer_pile.push(oneDrawJson.cards[0]);
    dealer_sum = getPileSum(dealer_pile);
    const card_image = document.createElement("img");
    if (dealer_pile.length<=1) {
        card_image.src = card_cover_src;
    }else{
        card_image.src = oneDrawJson.cards[0].image;
    }
    document.getElementById("dealer-cards").appendChild(card_image)

    if (isStand){
        stand();
    }

    if(dealer_pile.length<=1) {dealerDraw()}
}



async function playerDraw(event){
    const response = await fetch(draw_url);
    const oneDrawJson = await response.json();

    player_pile.push(oneDrawJson.cards[0]);
    player_sum = getPileSum(player_pile);
    playerSumText.firstElementChild.textContent = "You: "+player_sum;
    const card_image = document.createElement("img");
    card_image.src = oneDrawJson.cards[0].image;
    document.getElementById("player-cards").appendChild(card_image);
    if(player_sum>21){
        // bust
        promptMes.textContent = "You BUST!";
        hit_button.disabled = true;
        stand_button.disabled = true;
    }else if(player_sum == 21){
        // win
        promptMes.textContent = "You WIN! BlackJack!";
        hit_button.disabled = true;
        stand_button.disabled = true;
    }

    if(player_pile.length<=1) {playerDraw()}
}



function getPileSum(pile){
    let sum = 0;
    let hasAce = 0;
    pile.forEach(function(card){
        if (card.value=="ACE") { hasAce ++; sum+=11 }
        else if (card.value>="2" && card.value <= "9") { sum+= parseInt(card.value)}
        else {sum += 10}
    });

    while(hasAce>0 && sum > 21){
        sum -= 10;
        hasAce --;
    }
    return sum;
}



function stand(){
    isStand = true;
    document.getElementById("dealer-cards").firstChild.src = dealer_pile[0].image;
    dealerSumText.firstElementChild.textContent = "Dealer: "+dealer_sum;
    if(dealer_sum==21){
        promptMes.textContent = "Dealer WIN! BlackJack!";
        hit_button.disabled = true;
        stand_button.disabled = true;
        isStand = false;
    }else if(dealer_sum>21){
        promptMes.textContent = "You WIN! Dealer bust";
        hit_button.disabled = true;
        stand_button.disabled = true;
        isStand = false;
    }else if(dealer_sum>17){
        if(player_sum==dealer_sum){
            promptMes.textContent = "TIE!";
            hit_button.disabled = true;
            stand_button.disabled = true;
            isStand = false;
        }else if(player_sum>dealer_sum){
            promptMes.textContent = "You WIN!";
            hit_button.disabled = true;
            stand_button.disabled = true;
            isStand = false;
        }else if(player_sum<dealer_sum){
            promptMes.textContent = "Dealer WIN!";
            hit_button.disabled = true;
            stand_button.disabled = true;
            isStand = false;
        }
    }else{
        setTimeout(dealerDraw, 1000);
    }
}



function debug(){
    console.log(dealer_sum)
    console.log(player_sum)
}