var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function()
  {
      if (this.readyState == 4 && this.status == 200)
      {
        var data = JSON.parse(xhr.responseText);

        var title = data.feed.entry[0]["gsx$title"]["$t"];
        var day = data.feed.entry[0]["gsx$date"]["$t"];

        var rules = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
        {
          if(!(data.feed.entry[i]["gsx$rules"]["$t"]) == "")
            rules.push(data.feed.entry[i]["gsx$rules"]["$t"]);
        }


        var questions = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
          questions.push(data.feed.entry[i]["gsx$questions"]["$t"]);

        var questions_media = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
          questions_media.push(data.feed.entry[i]["gsx$questionsmedia"]["$t"]);

        var answers = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
          answers.push(data.feed.entry[i]["gsx$answers"]["$t"]);

        var answers_media = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
          answers_media.push(data.feed.entry[i]["gsx$answersmedia"]["$t"]);

        var answers_descr = new Array();
        for(var i = 0; i < data.feed.entry.length; i++)
          answers_descr.push(data.feed.entry[i]["gsx$answersdescription"]["$t"]);

        showMeta(title, day, rules);
        populateTable(questions, questions_media, answers, answers_media, answers_descr);
      }

  }


xhr.open("GET", "https://spreadsheets.google.com/feeds/list/1oI83izpSqQIJP8_A65smGIuSr1AT66v8F-vFkvR5O2k/od6/public/values?alt=json", true);
  //xhr.open("GET", "data.json", true);
xhr.send();


function showMeta(title, day, rules)
  {
    document.getElementById("title").innerHTML = title;
    document.getElementById("day").innerHTML = day;

    var rulesList = document.getElementById("rules");

    for(var i = 0, len = rules.length; i < len; i++)
      {
        var li = document.createElement("LI");

        li.innerHTML = rules[i];

        rulesList.appendChild(li);
      }
  } //Write rules from data into HTML


function populateTable(questions, questions_media, answers, answers_media, answers_descr)
  {

    var grid = document.getElementById("grid");

    var cols = 4; //Number of columns in the grid

    for(var i = 0, len = questions.length; i < len; i++)
      {
        if(i % cols == 0) //Insert new row after every fourth cell
          {
            var row = document.createElement("TR");
            grid.appendChild(row);
          }
        var index = Math.floor(i/cols); //Get current row index

        var curr_row = grid.childNodes[index]; //Get current row element

        var cell = curr_row.insertCell(-1); //Insert new cell at the end of current row

        cell.innerHTML = (i + 1);

        cell.onclick = function()
        {
          var q = (event.target.innerHTML - 1);
          var question_object = {
            question: questions[q],
            questionMedia: questions_media[q],
            answer: answers[q],
            answerMedia: answers_media[q],
            answerDescr: answers_descr[q]
          };
          loadQuestion(question_object);
        };

      }

  }//Create grid of questions


function scrollToGrid()
  {
    var height = document.getElementsByClassName("container")[0].clientHeight;

    window.scrollBy(0, 1.1 * ( (window.scrollY / 5) + 1) ); //Totally random forumla for Ease-in that looked good

    if(window.scrollY < (height - 1) ) //Safeguard for mobile devices where the scrollY property always was finally set to 1px less than the container height
      requestAnimationFrame(scrollToGrid);

  }//Scroll to grid on start button-click


function loadQuestion(object)
  {
    var grid = document.getElementById("gridfield");
    grid.style.display = "none"; //Hide question grid

    var cell = event.target; //Get cell containing question number

    var container = document.createElement("DIV");
    container.id = "questionfield";

    var act_container = document.getElementsByClassName("container")[1];
    act_container.appendChild(container); //Append questionfield to container

    var quesNum = document.createElement("DIV");
    quesNum.innerHTML = event.target.innerHTML;
    quesNum.id = "quesNum"; //Div for question number

    var question = document.createElement("DIV");
    question.innerHTML = object.question;
    question.id = "question"; //Div for question content

    if(!(object.questionMedia === ""))
    {
      var questionMedia = document.createElement("IMG");
      questionMedia.id = "questionMedia";
      questionMedia.src = object.questionMedia;
    }

    var controls = document.createElement("DIV");
    controls.id = "controls"; //Div for buttons to handle further options

    var returnGrid = document.createElement("BUTTON"); //Button to return to grid
    returnGrid.id = "returnGrid";
    returnGrid.innerHTML = "Return to grid";

    returnGrid.onclick = function()
    {
      grid.style.display = "block"; //Show question grid
      act_container.removeChild(container); //Remove questionfield from container

    }

    var viewAns = document.createElement("BUTTON"); //Button to view answer
    viewAns.id = "viewAns";
    viewAns.innerHTML = "View answer";

    viewAns.onclick = function()
    {
      var answer = document.createElement("DIV");
      answer.id = "answer";
      answer.innerHTML = object.answer; //Div for answer content

      cell.style.opacity = 0.3; //Semi-hide question to show it has been used

      if(!(object.answerMedia === ""))
      {
        var answerMedia = document.createElement("IMG");
        answerMedia.id = "answerMedia";
        answerMedia.src = object.answerMedia; //Div for answer resource image
      }

      container.removeChild(question); //Remove question from questionfield
      if(questionMedia)
        container.removeChild(questionMedia); //Remove question resource from questionfield
      controls.removeChild(viewAns); //Remove view answer button from controls div but keep return to grid button

      container.appendChild(answer);
      if(answerMedia)
        container.appendChild(answerMedia);
      container.appendChild(controls); ///Append answerimage, answer and control buttons divisions to questionfield

    }


    controls.appendChild(viewAns);
    controls.appendChild(returnGrid); //Append control buttons to controls division

    container.appendChild(quesNum);
    container.appendChild(question);
    if(questionMedia)
      container.appendChild(questionMedia);
    container.appendChild(controls); //Append question number, question content and control buttons to questionfield

  }


function invert()
{
  document.getElementsByClassName("container")[0].classList.toggle("invert");
  document.getElementsByClassName("container")[1].classList.toggle("invert");
}
