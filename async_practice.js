//code goes here


//TODO: why does cors block headers, but not query strings?
//TODO: why are promises fulfilled for an obviously bad URL in chrome but not firefox?

const BASE_URL = 'http://numbersapi.com';

async function showNumberTrivia(num){
  // let resp = await fetch(`${BASE_URL}/${num}`, {
  //   headers: {"Content-Type" : "application/json"}
  // });
  let resp = await fetch(`${BASE_URL}/${num}?json`);
  let data = await resp.json();
  console.log('favorite number fact: ', data);
  return data;
}

// showNumberTrivia(85);


async function showNumberRace(start_num){

  let resp1 = fetch(`${BASE_URL}/${start_num}?json`);
  let resp2 = fetch(`${BASE_URL}/${start_num + 1}?json`);
  let resp3 = fetch(`${BASE_URL}/${start_num + 2}?json`);
  let resp4 = fetch(`${BASE_URL}/${start_num + 3}?json`);

  let winner = await Promise.race([resp1, resp2, resp3, resp4]);
  let winner_data = await winner.json();
  console.log("winner is: ", winner_data);

}
// showNumberRace(85);

let test;
async function showNumberAll(nums){

  let promises = [];
  for (let num of nums){
    let resp = fetch(`${BASE_URL}/${num}?json`);
    promises.push(resp);
  }
  //${BASE_URL}/STRING?json
  let badResp = fetch(`/ASD`);
  promises.push(badResp);

  let results = await Promise.allSettled(promises);
  test = results;
  // console.log(results);

  let trivia_or_errors = [];
  for (let result of results){
    if (result.value.ok){
      // console.log('result.value.ok is: ', result.value.ok);
      // console.log('result is: ', result);

      let data = await result.value.json();
      trivia_or_errors.push(data.text);
    } else {
      let errorResp = `${result.value.status} ${result.value.statusText}`;
      trivia_or_errors.push(errorResp);
    }
  }

  console.log(trivia_or_errors);
}

let somenums = [1,2,3,4];
showNumberAll(somenums);



function main(){
  let favNum = 85;
  showNumberTrivia(favNum);
  showNumberRace();
  showNumberAll();
}