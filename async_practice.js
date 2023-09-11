//code goes here
"use strict";

const BASE_URL = 'http://numbersapi.com';

const CARD_URL = 'https://deckofcardsapi.com/api/deck/';

/**
 * Takes in a number, calls the Numbers API, and displays trivia about that
 * number.
 */
async function showNumberTrivia(num) {
  // let resp = await fetch(`${BASE_URL}/${num}`, {
  //   headers: {"Content-Type" : "application/json"}
  // });
  const resp = await fetch(`${BASE_URL}/${num}?json`);
  const data = await resp.json();
  console.log('favorite number fact: ', data);
  return data;
}

// showNumberTrivia(85);

/**
 * Takes in an array of nmbers, makes multiple calls to the Numbers API,
 * and prints trivia about the number whose API call was answered first.
 */
async function showNumberRace(numArr) {

  let promises = [];
  for (let num of numArr) {
    const resp = fetch(`${BASE_URL}/${num}?json`);
    promises.push(resp);
  }

  const winner = await Promise.race(promises);
  const winner_data = await winner.json();
  console.log("winner is: ", winner_data);

}

/**
 * Takes an array of numbers and makes a request to the Numbers API for each of
 * them, plus one bad call. Prints the results of the successful calls in one
 * array and the failures in another array.
 */
async function showNumberAll(nums) {

  let promises = [];
  for (let num of nums) {
    let resp = fetch(`${BASE_URL}/${num}?json`);
    promises.push(resp);
  }
  let badResp = fetch(`${BASE_URL}/STRING?json`);
  promises.push(badResp);

  let results = await Promise.allSettled(promises);
  // console.log(results);

  let trivia = [];
  let errors = [];
  for (let result of results) {
    if (result.value.ok) {
      // console.log('result.value.ok is: ', result.value.ok);
      // console.log('result is: ', result);

      let data = await result.value.json();
      trivia.push(data.text);
    } else {
      let errorResp = `${result.value.status} ${result.value.statusText}`;
      errors.push(errorResp);
    }
  }

  console.log("SUCCESSES:", trivia);
  console.log("ERRORS:", errors);
}


/**
 * Calls each of the above functions and prints their results in the order
 * called.
 */
async function main() {
  let favNum = 85;
  await showNumberTrivia(favNum);
  await showNumberRace([5, 6, 7, 8]);
  await showNumberAll([1, 2, 3, 4, 5, "hello"]);

}

////////////////////////////////
//CARDS SECTION
////////////////////////////////


const drawButton = document.querySelector("#draw-button");

let deckId;
/**
 * Called on load. Fetches a deck id from the deckofcards API and sets
 * the global variable deckId equal to the returned deck_id property.
 */
async function getDeck() {
  const response = await fetch(`${CARD_URL}new/shuffle/`);
  const newDeck = await response.json();
  deckId = newDeck.deck_id;
  console.log("DECK LOADED");
}

//
/**
 * Called on click. Queries deckofcardsAPI using the deckId global variable
 * to draw a random card. Uses the cards[0].image of the returned response
 * to create a new img element and append it to the dom. Once there are no more
 * cards in the deck, the button to draw a new card disappears (and should reappear)
 * on next load.
 */
async function drawCard() {

  const response = await fetch(`${CARD_URL}${deckId}/draw/`);
  const data = await response.json();

  const cardImage = document.createElement("img");
  cardImage.setAttribute("src", data.cards[0].image);
  cardImage.style.width = "100px";
  document.getElementById("card-container").appendChild(cardImage);

  if (data.remaining < 44) { //technically, this should === 0, but using for testing.
    drawButton.style.display = "none";
    // drawButton.setAttribute("style", "display: none;");
  }
}

window.addEventListener("load", getDeck);
drawButton.addEventListener("click", drawCard);

