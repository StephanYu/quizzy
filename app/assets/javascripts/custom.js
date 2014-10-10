$(document).ready(function() {
  // List out all quizzes when the page loads. display a menu in which a user can select one of many quizzes
  var template = $(".my-template").html();
  var uncompiledTemplate = _.template(template);

  // var $el = $(compiledTemplate);
  // $('body').append($el);
  $.get('/quizzes', function(data) {
    // data = [ {id: 1, title: "..."}, {id:2, title: "..."} ]
    _.each(data, function(element) {
      // element = {id: 1, title: "..."}
      var quizData = {
        title: element.title
      };
      var quizHTML = uncompiledTemplate({content: quizData});
      $('.list-group').append(quizHTML);
    });
  });
});