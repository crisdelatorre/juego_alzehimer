let intervalid = 0;

let data = {
  solution: {},
  dropZones: [],
  boxes: []
}

window.onload = function () {
  countdownOperator();
  objectsRender(false);
  intervalid = setInterval(countdownOperator, 1000);
}


let shuffleClothes = false;
let currentTime = 5;

/**
 * C O U N T D O W N   &   C H A N G E S ****************************************
 */



const countdownOperator = () => {

  // variables
  const totalTime = 5;
  let currentPercentage = 0;

  const instructionsText = document.querySelector(".instructions");
  const countdown = document.querySelector(".countdown");
  const secondsLeft = document.querySelector(".time_left");
  const timeBar = document.querySelector(".time_passed");
  const dropzoneBox = document.querySelector(".boxes");


  if (currentTime > 00) {

    instructionsText.innerHTML = `Memoriza el orden de los siguientes objetos:`;
    currentTime--;
    console.log(currentTime);

    // añadir un 0 a la izda. a números menores de 10
    if (currentTime < 10) {
      currentTime = "0" + currentTime;

    }

    // longitud de la barra de tiempo, cálculo y aplicación del estilo
    currentPercentage = (currentTime * 100) / totalTime;
    timeBar.style.width = `${currentPercentage}% `;

  } else {

    instructionsText.innerHTML = `Coloca los objetos en orden:`;
    countdown.style = `display: none;`;
    dropzoneBox.style = `display: flex;`;

    countdown.classList.add(".finished");

    // desorden aleatoria del array

    clearInterval(intervalid);
    objectsRender(true);

  }

  secondsLeft.innerHTML = `Quedan ${currentTime} segundos`;
  //console.log(currentTime);

}


/**
  *   D A T A   R E N D E R *****************************************************
 */


let objectsArray = [];
let boxArray = [];

let objectsRender = (shuffle) => {

  // const countdown = document.querySelector(".countdown");
  let toPaint;
  if (shuffle) {
    toPaint = Array.from(gameData.clothingObjects)
    toPaint.sort(() => Math.random() - 0.5)
  } else {
    toPaint = gameData.clothingObjects
  }

  document.querySelector('.objects').innerHTML = "";
  toPaint.forEach(clothingObject => {
    objectsArray.push(clothingObject);

    let objectItem = `
            <div  class="object_item box" id="draggable${clothingObject.id}">
                <img src="${clothingObject.src}" alt="Calcetines">
                <div class="clth_id">${clothingObject.id}</div>
            </div>
         `;

    document.querySelector('.objects').innerHTML += objectItem;

  });

  if(shuffle){
    boxesRender();
    workingInteract();

  } 
};


let boxesRender = () => {

  gameData.dropzoneBoxes.forEach(boxItem => {
    boxArray.push(boxItem);

    let boxDrop = `
             <div class="box_item dropzone drop-area" id="dropzone${boxItem.id}">
                ${boxItem.position}
                <div class="box_id">${boxItem.id}
                </div>
            </div>
         `;

    document.querySelector('.boxes').innerHTML += boxDrop;


  });
};


/**
 * G A M E   D Y N A M I C
 */


// D A T A   M A N A G E M E N T 

function workingInteract() {

// let DOMDropZones = document.getElementsByClassName('drop-area');
let DOMDropZones = Array.from(document.querySelectorAll('.drop-area'));

if(DOMDropZones.length>0){
  // console.log(DOMDropZones);
  data.dropZones = DOMDropZones.map(
    function(de){
      return {DOMElement:de,content:[]}
    }
   )
} else{
  console.log('nope');
}



// I N T E R A C T ************************************************************

// EVENT LISTENERS

const scoreItem = document.querySelector(".score");
const levelItem = document.querySelector(".level");
let pointsGained = 0;

  data.dropZones.forEach(dropZone => {
    

    interact(dropZone.DOMElement).dropzone({

      ondropactivate: function (event) {
        event.target.classList.add('drop_activate')

      },

      ondropdeactivate: function (event) {
        event.target.classList.remove('drop_activate')
        event.target.classList.remove('drop-target')
      },

      ondrop: function (event) {

        let boxId = event.relatedTarget.id

        if (dropZone.content.indexOf(boxId) < 0) { 
          dropZone.content.push(boxId)            
        } 
      
        console.log(dropZone.content[0]);


        if(check(dropZone)){
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_error')

          dropZone.DOMElement.classList.add('drop_ok');
          console.log('todo ok');

        } else if (dropZone.content.length==0){
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_ok')
          dropZone.DOMElement.classList.remove('drop_error');

          console.log('vacio');


        } else{
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_ok')

          dropZone.DOMElement.classList.add('drop_error');

          console.log('error');

        }


        event.relatedTarget.style.width = '120px';
        event.relatedTarget.style.height = '120px';
        dropZone.DOMElement.classList.remove('drag_enter');

      },

      ondragenter: function (event) { 

        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        dropzoneElement.classList.add('drag_enter')
        draggableElement.classList.add('can_drop')
      },

      ondragleave: function (event) {
        event.relatedTarget.style.width = '150px';
        event.relatedTarget.style.height = '150px';

        let targetIndex = dropZone.content.indexOf(event.relatedTarget.id)
        if (targetIndex > -1) {
          dropZone.content.splice(targetIndex, 1)
        }


        if(check(dropZone)){
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_error')

          dropZone.DOMElement.classList.add('drop_ok');

          console.log('todo ok');

        } else if (dropZone.content.length==0){
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_ok')
          dropZone.DOMElement.classList.remove('drop_error');

          console.log('vacio');


        } else{
          dropZone.DOMElement.classList.remove('drag_enter')
          dropZone.DOMElement.classList.remove('drop_ok')

          dropZone.DOMElement.classList.add('drop_error');

          console.log('error');

        }

      }
    })    
  })



  let realScore = `${pointsGained} puntos`;
  scoreItem.innerHTML += realScore;




// DROP IN THE CENTER

let getCenter = function (DOMElement) {
  let rect = DOMElement.getBoundingClientRect()
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
}

let dropZonesCenters = data.dropZones.map(dropZone => getCenter(dropZone.DOMElement))

let DOMBoxes = document.querySelectorAll(".box")
for (let i = 0; i < DOMBoxes.length; i++) {

  let box = DOMBoxes[i]
  data.boxes.push({
    DOMElement: box,
    position: { x: 0, y: 0 } 
  
  })                                                                     
}

// Para cada draggable:
data.boxes.forEach(box => {

  box.DOMElement.style.transform = `translate(${box.position.x}px, ${box.position.y}px)`

  interact(box.DOMElement).draggable({
    modifiers: [                                     
      interact.modifiers.restrictRect({      
        restriction: '.app',                       
        endOnly: true                                
      }),                                           
    ],
    inertia: true,
    listeners: {
      move(event) { 
        box.position.x += event.dx
        box.position.y += event.dy

        event.target.style.transform =
          `translate(${box.position.x}px, ${box.position.y}px)`
      }
    }
  })
})

}


// function solve() {
//   for (let dropZone of data.dropZones) {

//     for (let boxId of data.solution[dropZone.DOMElement.id]) {
//       let index = dropZone.content.indexOf(boxId)
//       if (index < 0) {
//         return false
//       }
//     }
//   }
//   return true
// }


function check(dz) {
  if(dz.content.length==1){
    
    let boxId = parseInt(dz.content[0].charAt(dz.content[0].length - 1));
    let dzId = parseInt(dz.DOMElement.id.charAt(dz.DOMElement.id.length - 1));

    console.log(boxId, gameData.clothingObjects[dzId].id );
    console.log(gameData.clothingObjects);


    if(gameData.clothingObjects[dzId].id==boxId){
      return true;
    }

  }

  return false;
}

  // Funcion que  se llama cuando se aprieta el boton de solucion. Usa la funcion solve() para cambiar el innerHTML
  // del h1 donde aparece el mensaje
  function showSolution(){
    let solutionMessage = document.querySelector(".messages");

    if (check()){
      solutionMessage.innerHTML = "Correct!";
      solutionMessage.style.color = "green";
    }else{
      solutionMessage.innerHTML = "Incorrect!";
      solutionMessage.style.color = "red";
    }
    solutionMessage.style.display = "block";
  }

  document.querySelector("#submit").onclick = showSolution
