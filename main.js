import { questions } from "./questions.js";
function processQuestions(arr) {
    const output = arr.map((object) => {
        object.incorrect_answers.push(object.correct_answer);
        object.incorrect_answers = randomize(object.incorrect_answers);
        return object;
    });
    return output;//return object; likhne ka matlab hai "Maine jo changes kiye hain, us modified object ko naya array mein daal do." Yeh zaroori hai taki .map() function har element ke liye modified object ko return kare aur final result mein aapko expected updated questions array mile.
}

function randomize(arr) {
    const temp = [];
    const final = [];
    for (let i = 0; i < arr.length; i++) {
        final.push(arr[randomValue(arr.length, temp)]);
    }
    return final;
}
function randomValue(len, temp) {
    const value = Math.floor(Math.random() * len);
    if (temp.includes(value)) {
        return randomValue(len, temp);
    }
    else {
        temp.push(value);
        return value;
    }
}

const questionPara = document.querySelector(".question");
const timerPara = document.querySelector(".timer");
const optionPara = document.querySelectorAll(".option");
const startBtn = document.querySelector("#start");
const option = document.querySelector(".options");
const quiz = document.querySelector(".quiz");
const name = document.querySelector("input");
let userAnswers = [];
let questionNumber = 0;
let countdown = 5;
const players = localStorage.getItem("players") !== null ? JSON.parse(localStorage.getItem("players")) : [];
const randomizedQuestions = randomize(processQuestions(questions));
console.log(randomizedQuestions);

startBtn.addEventListener("click", startTheQuiz);

function startTheQuiz() {
    storeDataInLS();

    startBtn.style.display = "none";//hiding btn after click
    name.style.display = "none";
    nextQuestion(questionNumber);//showing 1st que
    timerPara.innerText = countdown;

    const interval = setInterval(() => {
        if (countdown === 1) {
            if (questionNumber < randomizedQuestions.length - 1) {
                countdown = 5;
                timerPara.innerText = countdown;
                nextQuestion(++questionNumber);
            }
            else {
                clearInterval(interval);
                displayScore();
            }
        }
        else {
            timerPara.innerText = --countdown;
        }
    }, 1000);
}
let score = 0;
function storeDataInLS() {


    const player = {
        name: name.value,
        date: new Date().toLocaleString(),
        score: 0
    };
    players.push(player);
    localStorage.setItem("players", JSON.stringify(players));

}

function nextQuestion(questionNumber) {
    questionPara.innerText = randomizedQuestions[questionNumber].question
    for (let i = 0; i < optionPara.length; i++) {
        optionPara[i].innerText = randomizedQuestions[questionNumber].incorrect_answers[i];
        resetOption(optionPara[i]);//remove green or blue color

        optionPara[i].addEventListener("click", storeUserAnswer);
    }

}
function resetOption(option) {
    if (option.classList.contains("correct_answer")) {
        option.classList.remove("correct_answer");
    }
    else if (option.classList.contains("incorrect_answer")) {
        option.classList.remove("incorrect_answer");
    }
}
function storeUserAnswer(e) {
    // console.log(e.target.innerText);
    userAnswers.push({
        questionNumber: questionNumber, userAnswer: e.target.innerText
    });
    if (e.target.innerText === randomizedQuestions[questionNumber].correct_answer) {
        e.target.classList.add("correct_answer");
        score++;
    }
    else {
        e.target.classList.add("incorrect_answer");
    }

}

function displayScore() {
    quiz.style.display = "none";
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("scoreDiv");

    const h2 = document.createElement("h2");
    h2.innerText = "Your score is " + score;

    scoreDiv.append(h2);
    document.querySelector("#quizSection").append(scoreDiv);

    writeScoreInLs(score);
}
function writeScoreInLs(score) {
    const playerArray = JSON.parse(localStorage.getItem("players"));
    console.log(playerArray);
    playerArray[playerArray.length - 1].score = score;
    localStorage.setItem("players", JSON.stringify(playerArray));
}




