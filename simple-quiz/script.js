(function () {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((question, index) => {
      const answers = [];
      for (letter in question.answers) {
        // ... add HTML radio button
        answers.push(
          `<label>
          <input type="radio" name="question${index}" value="${letter}">
          ${letter} :
          ${question.answers[letter]}
        </label>`
        );
      }
      // add this question and its answers to the output
      output.push(
        ` <div class="slide">
        <div class="question"> ${question.question} </div>
      <div class="answers"> ${answers.join('')} </div>
      </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((question, index) => {
      // find selected answer
      const answerContainer = answerContainers[index];
      const selector = 'input[name=question' + index + ']:checked';
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === question.correctAnswer) {
        // add to the number of correct ansers
        numCorrect++;

        // color the answers green
        answerContainers[index].style.color = 'lightgreen';
      } else {
        answerContainers[index].style.color = 'red';
      }
    });

    // show number of correct ansers out of total
    resultContainer.innerHTML = numCorrect + ' out of ' + myQuestions.length;
  }

  const quizContainer = document.getElementById('quiz');
  const resultContainer = document.getElementById('results');
  const submitButton = document.getElementById('submit');
  const myQuestions = [
    {
      question: "Who is the strongest?",
      answers: {
        a: "Superman",
        b: "The Terminator",
        c: "Waluigi, obviously"
      },
      correctAnswer: "c"
    },
    {
      question: "What is the best site ever created?",
      answers: {
        a: "SitePoint",
        b: "Simple Steps Code",
        c: "Trick question; they're both the best"
      },
      correctAnswer: "c"
    },
    {
      question: "Where is Waldo really?",
      answers: {
        a: "Antarctica",
        b: "Exploring the Pacific Ocean",
        c: "Sitting in a tree",
        d: "Minding his own business, so stop asking"
      },
      correctAnswer: "d"
    }
  ];

  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener('click', showResults);

  // pagination
  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if (currentSlide === 0) {
      previousButton.style.display = 'none';
    } else {
      previousButton.style.display = 'inline-block';
    }
    if (currentSlide === slides.length - 1) {
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    } else {
      nextButton.style.display = 'inline-block';
    }
  }
  showSlide(0);

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  previousButton.addEventListener('click', showPreviousSlide);
  nextButton.addEventListener('click', showNextSlide);


})();