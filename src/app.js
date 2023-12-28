const API_KEY = "Place Your API Key here";

const questionHeading = document.querySelector(".form h3");
const optionsDiv = document.querySelector(".options-div");
const nextBtn = document.querySelector(".form button");
const quizContainer = document.querySelector(".container");
const scoreContainer = document.querySelector(".score h1");

let quizQuestions = {};
let questionIndex = 0;
let finalScore = 0;

const getQuizData = async ()=>{
    const response = await fetch(
        "https://quizapi.io/api/v1/questions?limit=5",
        {
            method: "GET",
            headers: {
                "X-Api-Key": API_KEY,
            }
        }
    )

    const data = await response.json();
    return data;
}

let lastQuestionSeenIndex = 0;
const populateOptions = (answerOption, optionNumber, originalAnswers)=>{
    const option = document.createElement("div");
    option.className = "options";
    option.id = `option-${optionNumber}`;
    option.style.fontSize = "15px";
    option.textContent = answerOption;
    optionsDiv.append(option);

    option.addEventListener("click", ()=>{
        let optionClicked = false;
        if(!optionClicked && lastQuestionSeenIndex!=questionIndex) {
            optionClicked = true;
            lastQuestionSeenIndex = questionIndex;
            
            option.style.backgroundColor = "#bbe396";
            const selectedUserOption = `answer_${String.fromCharCode(97 + optionNumber - 1)}_correct`;
            if(originalAnswers[selectedUserOption] === "true") {
                finalScore++;
            }
        }
    })
}

const layOptions = (result)=>{
    questionHeading.innerText = `${questionIndex+1}. ${result[questionIndex].question}`;

    const answers = result[questionIndex].answers;
    const answerOptions = [
        answers["answer_a"],
        answers["answer_b"],
        answers["answer_c"],
        answers["answer_d"],
        answers["answer_e"],
        answers["answer_f"],
    ];

    // populate question and options
    for(let i=1; i<=6; i++) {
        if(answerOptions[i-1] == null) continue;
        populateOptions(answerOptions[i-1], i, result[questionIndex].correct_answers);
    }

    quizQuestions = result;
    questionIndex++;
}

getQuizData().then((result)=>{
    layOptions(result);
})

nextBtn.addEventListener("click", ()=>{
    if(questionIndex < 4) {
        optionsDiv.innerHTML = "";
        layOptions(quizQuestions);
    } else if(questionIndex === 4) {
        optionsDiv.innerHTML = "";
        layOptions(quizQuestions);
        nextBtn.innerText = "Submit";
    } else {
        quizContainer.innerHTML = "";

        const scoreDiv = document.createElement("div");
        scoreDiv.className = "score";

        const h1tag = document.createElement("h2");
        h1tag.textContent = `Your Score\n${finalScore}/5`;
        scoreDiv.appendChild(h1tag);

        quizContainer.appendChild(scoreDiv);
    }
});