$(document).ready(function() {
  // List out all quizzes when the page loads. display a menu in which a user can select one of many quizzes
  var template = $(".my-template").html();
  var uncompiledTemplate = _.template(template);

  var template2 = $(".my-template2").html();
  var uncompiledTemplate2 = _.template(template2);

  $.get('/quizzes', function(data) {
    // data = [ {id: 1, title: "..."}, {id:2, title: "..."} ]
    _.each(data, function(element) {
      // element = {id: 1, title: "..."}
      var quizData = {
        title: element.title,
        id: element.id
      };
      var quizHTML = uncompiledTemplate({content: quizData});
      $('.list-group').append(quizHTML);
    });
  });

  // You can select a quiz in order to take it
  // When you select a quiz, it jumps to the first question
    // on click of list element trigger: GET /quizzes/:id/questions/:id to get a single question
    $("#quizz-list").on("click", ".quizz-title", function() {
      // var $title = $(this).text();
      var quizQuestions = [];
      var $id = $(this).attr("id");
      $.get("/quizzes/" + $id + "/questions/", function(data) {
       
        quizQuestions = data;
      
        // console.log(quizQuestions);
        //remove previous template
        $("#quizz-list").remove();
        //add new template
        var quizQuestion = quizQuestions.pop();
        console.log(quizQuestion);
        var choices = quizQuestion.choices.split(";");
        quizQuestion.choices = choices;
        var quizQuestionsObject = uncompiledTemplate2({content: quizQuestion});
        $("#question-main").removeClass("hidden").append(quizQuestionsObject);
        // console.log(quizQuestionObject);
      
      });
    });
});