$(document).ready(function() {
  // List out all quizzes when the page loads. display a menu in which a user can select one of many quizzes
  var template = $(".my-template").html();
  var uncompiledTemplate = _.template(template);

  var template2 = $(".my-template2").html();
  var uncompiledTemplate2 = _.template(template2);

  var template3 = $(".my-template3").html();
  var uncompiledTemplate3 = _.template(template3);

  var template4 = $(".my-template4").html();
  var uncompiledTemplate4 = _.template(template4);

  $.get('/quizzes', function(data) {
    // data = [ {id: 1, title: "..."}, {id:2, title: "..."} ]
    _.each(data, function(element) {
      // element = {id: 1, title: "..."}
      var quizData = {
        title: element.title,
        id: element.id
      };
      var quizHTML = uncompiledTemplate({content: quizData});
      $('#quizz-list').append(quizHTML);
    });
  });

  // You can create a quizz 
    $("#create-quizz-btn").on('click', function() {
      $("#quizz-form").empty().slideDown().removeClass("hidden");

      var quizFormAdd = {
        type: "Add"
      };
      var quizHTML = uncompiledTemplate4({content: quizFormAdd});
      $('#quizz-form').append(quizHTML);


      $("#quizz-form-btn").on('click', function(e) {
      e.preventDefault();
        //post form title to database POST /quizzes
        var $quizzTitle = $("#quizz-title").val();
        quizzTitle = {
                        quiz: { title: $quizzTitle }
                     };
        $.post( "/quizzes", quizzTitle, function(data) {
          console.log(data.entity.id);
        });

        //remove html() of #add-quizz-form and replace with #add-questions-form
      });
    });
    //creating questions
    // POST /quizzes/:id/questions
    // {
    // "question[question]": "What is the capitol of Texas?",
    // "question[answer]": "Austin",
    // "question[choices": "Austin;Banana;Germany",
    // "question[type]": "multiple"
    // }

  // You can delete a quizz 
    $("#remove-quizz-btn").on('click', function() {
      $("#quizz-form").empty().slideDown().removeClass("hidden");
      
      var quizFormRemove = {
        type: "Remove"
      };
      var quizHTML = uncompiledTemplate4({content: quizFormRemove});
      $('#quizz-form').append(quizHTML);

      $("#quizz-form-btn").on('click', function(e) {
        e.preventDefault();
        var $quizzId;
        var $quizzTitle;
          //get quizzes and then search for title 
          $quizzTitle = $.trim($("#quizz-title").val());

          $.get('/quizzes', function(data) {
            _.each(data, function(element) {
              //if titles match, then strip id from it
              if(element.title === $quizzTitle) {
                $quizzId = element.id;
                console.log($quizzId);
                // DELETE /quizzes/:id
                $.ajax({
                    type: "DELETE",
                    url: "/quizzes/" + $quizzId,
                    dataType: "json",
                    success: function (msg) {
                      console.log('Success');
                      // re-render main view of quizzes
                      $("#quizz-list").find("#" + $quizzId).remove();
                    },
                    error: function (err){
                      console.log('Error');
                    }
                });
              }
            });
          });
      });
    });

  // You can select a quiz in order to take it
    $("#quizz-list").on("click", ".quizz-title", function() {
      var quizQuestions = [];
      var quizQuestion;
      var $id = $(this).attr("id");
      $.get("/quizzes/" + $id + "/questions/", function(data) {
        quizQuestions = data;
        $("#quizz-list").addClass("hidden");
      
        quizQuestion = quizQuestions.pop();
        var choices = quizQuestion.choices.split(";");
        quizQuestion.choices = choices;
        var quizQuestionsObject = uncompiledTemplate2({content: quizQuestion});
        $("#question-main").removeClass("hidden").append(quizQuestionsObject);
      });

      $("#question-main").on("click", ".answer-choice", function() {
          var answer = $(this).text();
          var quizzResponse;
          
          if (answer === quizQuestion.answer) {
            var correctAnswer = {
                response: "You are correct",
                score: 5
            };
            
            quizzResponse = uncompiledTemplate3({content: correctAnswer});
            $('.modal-content').empty().append(quizzResponse);
            
            $("#btn-next").on("click", function() {
              //move to next question
              if (quizQuestions.length > 0) {
                quizQuestion = quizQuestions.pop();
                var choices = quizQuestion.choices.split(";");
                quizQuestion.choices = choices;
                var quizQuestionsObject = uncompiledTemplate2({content: quizQuestion});
                $("#question-main").html(quizQuestionsObject);

                // update scores table PATCH/PUT /scores/1
                DataToSend = {
                                score: correctAnswer.score
                             };
                $.post( "/scores", function( DataToSend ) {
                  console.log(DataToSend);
                });
                // $.ajax({
                //     type: "PATCH",
                //     url: "/scores/" + $id,
                //     data: DataToSend,
                //     dataType: "json",
                //     success: function (msg) {
                //         console.log('Success');
                //     },
                //     error: function (err){
                //         console.log('Error');
                //     }
                // });
                

              } else {
                //pop up giving final score and saying quizz complete
                  //# GET /scores/1
                // then redirect to main quizzes page
                var btnQuizz = "<button type='button' class='btn btn-warning' data-dismiss='modal' id='btn-quizz'>Back to Main</button>";
                var data = {
                  response: "Congratulations",
                  score: 100
                };
                var finalResponse = uncompiledTemplate3({content: data});
                $('.modal-content').empty().append(finalResponse);
                $('.modal-content').find('.modal-footer').html(btnQuizz);
                $("#btn-quizz").on('click', function() {
                    $('#question-main').empty().addClass("hidden");
                    $("#quizz-list").removeClass("hidden");
                });
              }
            });

          } else {
            var incorrectAnswer = {
                response: "You are wrong",
                score: -5
            };
            quizzResponse = uncompiledTemplate3({content: incorrectAnswer});
            $('.modal-content').empty().append(quizzResponse);

            // move to next question in the quizz
            $("#btn-next").on("click", function() {
              //move to next question
              if (quizQuestions.length > 0) {
                quizQuestion = quizQuestions.pop();
                var choices = quizQuestion.choices.split(";");
                quizQuestion.choices = choices;
                var quizQuestionsObject = uncompiledTemplate2({content: quizQuestion});
                $("#question-main").html(quizQuestionsObject);

                // update scores table PATCH/PUT /scores/1
                DataToSend = {
                                score: correctAnswer.score
                             };
                $.post( "/scores", function( DataToSend ) {
                  console.log(DataToSend);
                });
                // $.ajax({
                //     type: "POST",
                //     url: "/scores/" + $id,
                //     data: DataToSend,
                //     dataType: "json",
                //     success: function (msg) {
                //         console.log('Success');
                //     },
                //     error: function (err){
                //         console.log('Error');
                //     }
                // });
                

              } else {
                //pop up giving final score and saying quizz complete
                  //# GET /scores/1
                // then redirect to main quizzes page
                var btnQuizz = "<button type='button' class='btn btn-warning' data-dismiss='modal' id='btn-quizz'>Back to Main</button>";
                var data = {
                  response: "Congratulations",
                  score: 100
                };
                var finalResponse = uncompiledTemplate3({content: data});
                $('.modal-content').empty().append(finalResponse);
                $('.modal-content').find('.modal-footer').html(btnQuizz);
                $("#btn-quizz").on('click', function() {
                  $('#question-main').empty().addClass("hidden");
                  $("#quizz-list").removeClass("hidden");
                });
              }
            });
          }
          
      });

    });

  






});