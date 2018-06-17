const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');


function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];


    //for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {

        //we'll want to store the list of answer choices
        const answers = [];

        //and for each available answer...
        for (letter in currentQuestion.answers){

            // ...add an HTML radio button
            answers.push(
                `<label class="radiobtn">
					<input type="radio" name="question${questionNumber}" value="${letter}">
					${letter} :
					${currentQuestion.answers[letter]}
					<span class="checkmark"></span>
				 </label>`
            );
        }

        // add this question and its answers to the output
        output.push(
            `<div class="question"> ${currentQuestion.question} </div>
			<div class="answers"> ${answers.join('')} </div>`
        );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
}

function showResults() {

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {

        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        // if answer is correctAnswer
        if(userAnswer===currentQuestion.correctAnswer){
            // add to the number of correct answers
            numCorrect++;

            // color the answers green
            answerContainers[questionNumber].style.color = "#0CA678";

        } else {
            // if answer is wrong or blank
            // color the answers red
            answerContainers[questionNumber].style.color = "#F03E3E";
            $(".radiobtn").append("<i class=\"fas fa-check\"></i>");
        }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} von ${myQuestions.length}`;

}

const myQuestions = [
    {
        question: "Wann wurde Blizzard Entertainment® gegründet?",
        answers: {
            a: "1994",
            b: "1999",
            c: "1990"
        },
        correctAnswer: "a"
    },
    {
        question: "Was ist Overwatch?",
        answers: {
            a: "ein MMO",
            b: "ein Brettspiel",
            c: "ein teambasierter Shooter"
        },
        correctAnswer: "c"
    },
    {
        question: "Welches Spiel wird von Blizzard angeboten, aber nicht von Blizzard erstellt?",
        answers: {
            a: "Heroes of the Storm",
            b: "Destiny 2",
            c: "Overwatch"
        },
        correctAnswer: "b"
    },
    {
        question: "Welcher Overwatch-Charakter war von Anfang an im Spiel?",
        answers: {
            a: "Brigitte",
            b: "Genji",
            c: "Ana"
        },
        correctAnswer: "b"
    },
    {
        question: "Wie viele Spieler müssen in Heroes of the Storm in einem Team sein?",
        answers: {
            a: "5",
            b: "3",
            c: "4"
        },
        correctAnswer: "a"
    },
    {
        question: "Welche Klassen gibt es in Destiny 2?",
        answers: {
            a: "Jäger, Titan, Warlock",
            b: "Warlock, Paladin, Hexenmeister",
            c: "Titan, Magier, Paladin"
        },
        correctAnswer: "a"
    },
    {
        question: "Welcher Publisher hat sich mit Blizzard fusioniert?",
        answers: {
            a: "Bandai Namco",
            b: "Electronic Arts",
            c: "Activision"
        },
        correctAnswer: "c"
    },
    {
        question: "Welches Spiel wird kostenlos angeboten?",
        answers: {
            a: "WoW",
            b: "Diablo III",
            c: "Heroes of the Storm"
        },
        correctAnswer: "c"
    }
];

//display quiz right away
buildQuiz();

//on submit, show results
submitButton.addEventListener('click', showResults);