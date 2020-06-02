"use strict";


window.onload = function() {
	let dndTest1 = {
		"type": "dndTest",
		"trueHalfPosition": 1,
		"firstHalfImg": "apple_first_half.png",
		"trueHalfImg": "apple_second_half.png",
		"wrongHalfImg": ["pear_second_half.png", "kapusta_second_half.png"],
		"fullImg": "apple.png",
		"completed": false
	};

	let mpchTest1 = {
		"type": "mpchTest",
		"numberOfVariants": 4,
		"rightAnswers": [0, 1],
		"rightAnswersImg": ['apple.png', 'pear.png'],
		"falseAnswersImg": ['kapusta.png', 'onion.png'],
		"completed": false
	};

	document.getElementById("startTestImg").onclick = function(){
		let testArray = [dndTest1, mpchTest1];
		let progressBar = document.getElementById("progressBarInner");
		let testCounter = 0;

		showNewTest(testArray[testCounter]);
		document.onmouseup = function(){
			setTimeout(() => {
			if((testArray[testCounter].completed == true) && testCounter !== (testArray.length - 1)){
				progressBar.style.width = ((testCounter + 1)/testArray.length*100) + "vW";
				testCounter++;
				showNewTest(testArray[testCounter]);
			} else if(testCounter === (testArray.length - 1) && (testArray[testCounter].completed == true)) {
				progressBar.style.width = ((testCounter + 1)/testArray.length*100) + "vW";
			}}, 2000);
		}
	};
}

function showNewTest(newTest) {
	switch(newTest.type){
		case "dndTest": {
			showDndTest(newTest);
			break;
		}
		case "mpchTest": {
			showMpchTest(newTest);
			break;
		}
		default: {
			console.log("Wrong test type.");
		}
	}
}

function playSound(){
	let audio = new Audio('kolokol.mp3');
	audio.play();
}

async function showMpchTest(mpchTest){
	let testTask = document.getElementById("testTask");
	let testDescription = document.getElementById("testDescription");
	let dnd = await fetch("https://blagostroy.kharkov.ua/test/multipleChoiseTest/mpch.html");

	  if (dnd.ok) {
	      let txt = await dnd.text();
	      testTask.innerHTML = txt;
	      testDescription.innerHTML = "Выбери все фрукты на картинке";
	    } else {
	      alert("HTTP-Error: " + response.status);
	    }

	let mpchRows = document.querySelectorAll(".mpchRow");
	let chooseArea = document.querySelectorAll(".chooseArea");

	for(let i = 0, j = 0, imgr = 0, imgf = 0; i < chooseArea.length; i++) {
		if (i === mpchTest.rightAnswers[j]) {
			chooseArea[i].id = "trueC";
			j++;
			chooseArea[i].querySelector("img").src = "img/" + mpchTest.rightAnswersImg[imgr];
			imgr++;
		} else {
			chooseArea[i].querySelector("img").src = "img/" + mpchTest.falseAnswersImg[imgf];
			imgf++;
		}
	}
	startMpchTest(mpchTest);
}

function startMpchTest(mpchTest) {
	let chooseAreas = document.querySelectorAll(".chooseArea");
	let trues = 0;

	chooseAreas.forEach((area) => {

		area.onclick = function() {

			chooseAreas.forEach((cArea) => {
				if(cArea.id !== "trueC") {
					cArea.style.background = 'none';
				}
			});

			if (area.id === "trueC"){
				if (area.style.background !== "#9bff85") {
					area.style.background = "#9bff85";
					trues++;
					area.onclick = null;
					if(trues === mpchTest.rightAnswers.length){
						playSound('./mp3/kolokol.mp3');
						chooseAreas.forEach((a) => a.onclick = null);
						mpchTest.completed = true;
					}
				}
			} else {
				area.style.background = "#ff4033";
			}
		}
	});
}

async function showDndTest(dndTest){
		let testTask = document.getElementById("testTask");
		let testDescription = document.getElementById("testDescription");
		let dnd = await fetch("https://blagostroy.kharkov.ua/test/dnd.html");

		  if (dnd.ok) {
		      let txt = await dnd.text();
		      testTask.innerHTML = txt;
		      testDescription.innerHTML = "Собери 1 целый фрукт";
		      startDnd(dndTest);
		    } else {
		      alert("HTTP-Error: " + response.status);
		  }

		document.getElementById("firstHalfImg").src = "img/" + dndTest.firstHalfImg;
		let dropplaces = document.querySelectorAll(".dropplace");
		console.log(dropplaces);
		for (let i = 0, j = 0; i < dropplaces.length; i++) {
			if(i != dndTest.trueHalfPosition) {
				dropplaces[i].innerHTML = "<img src=\"img/" + dndTest.wrongHalfImg[j] + "\" alt=\"\draggable=\"false\">";
				j++;
			} else {
				dropplaces[i].innerHTML = "<img src=\"img/" + dndTest.trueHalfImg + "\" alt=\"\draggable=\"false\" id=\"trueHalfImg\">";
				dropplaces[i].id = "trueH";
			}
		}
		//testTask.innerHTML = dnd.text();
}	

function startDnd(dndTest){
	let firstHalf = document.getElementById('firstHalfImg');
	let firstHalfPlace = document.getElementById('firstHalf');
	let dropPlaceNames = document.querySelectorAll(".dropplace");

	firstHalf.onmousedown = function(e) {
		let checked=false;

		dropPlaceNames.forEach(function(dropplace) {
				dropplace.style.background = "";
			})

		firstHalf.style.position = "absolute";
		moveAt(e);
		// document.body.appendChild(firstHalf);
		//document.getElementById('dndTestContainer').appendChild(firstHalf);
		firstHalfPlace.style.width = "80px";

		function moveAt(e) {
		    firstHalf.style.left = e.pageX - firstHalf.offsetWidth / 2 + 'px';
		    firstHalf.style.top = e.pageY - firstHalf.offsetHeight / 2 + 'px';
		  }

		firstHalf.style.zIndex = 1000;
		document.onmousemove = function(e) {

		   moveAt(e)

		}

		document.ontouchmove = function(e) {

		   moveAt(e)

		}

		 firstHalf.onmouseup = function() {
		 	dropPlaceNames.forEach(function(dropplace) {
				dropplace.onmouseover = function(e){
					if((e.target.id == "trueH" || e.target.id == "trueHalfImg") && !checked){
						checked = true;
						dropplace.style.background = "#9bff85";
						firstHalf.style.display = "none";
						document.getElementById("trueHalfImg").src = "img/" + dndTest.fullImg;
						playSound();
						dndTest.completed = true; 
					} else if(!checked){
						checked = true;
						dropplace.style.background = "#ff4033";
					}
				}
			})
		    document.onmousemove = null;
		    firstHalf.onmouseup = null;
		    firstHalf.style = "";
		    if (document.body.clientWidth >= 770) {
				 setTimeout(function() { 
			    	dropPlaceNames.forEach(function(dropplace) {
						dropplace.onmouseover = null;
			 		});
			    }, 100);
			}
		 }

		 firstHalf.ondragstart = function() {
			  return false;
		}

	}
}
