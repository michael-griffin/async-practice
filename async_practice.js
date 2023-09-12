//code goes here
"use strict";

//TODO: why does cors block headers, but not query strings?
//TODO: why are promises fulfilled for an obviously bad URL in chrome but not firefox?

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
  let resp = await fetch(`${BASE_URL}/${num}?json`);
  let data = await resp.json();
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
    let resp = fetch(`${BASE_URL}/${num}?json`);
    promises.push(resp);
  }

  let winner = await Promise.race(promises);
  let winner_data = await winner.json();
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

///CARDs SECTION
let deck_id;

async function get_deck() {
  const new_deck = await fetch(`${CARD_URL}new/shuffle/`);
  const new_deck_json = await new_deck.json();
  deck_id = new_deck_json.deck_id;
  console.log("DECK LOADED");
}

async function draw_card() {
  const card_resp = await fetch(`${CARD_URL}${deck_id}/draw`);
  const card = await card_resp.json();
  let cardImage = document.createElement("img");
  cardImage.setAttribute("src", card.image);
  document.getElementById("card-container").appendChild(cardImage);
  let drawButton = document.getElementById("draw-button");

  if (card.remaining === 0) {
    drawButton.setAttribute("display", "hidden");
  }

}

window.addEventListener("load", get_deck);

document.getElementById("draw-button").addEventListener("click", draw_card);

