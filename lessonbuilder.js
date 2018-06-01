LESSONBUILDER = {};
MAKINGWORDS = {};

LESSONBUILDER.saveLessons = function(){
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent('MAKINGWORDS.lesson = ' + JSON.stringify(MAKINGWORDS.lesson)));
  a.setAttribute('download', 'lessons.js');
  a.click();
}

$(document).ready(function(){
	$('#downloadLessons').on('click', LESSONBUILDER.saveLessons);
});