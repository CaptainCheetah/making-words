var MAKINGWORDS = {};

MAKINGWORDS.initialized = false
MAKINGWORDS.lvl = 'lesson_m';

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

// voice variables
MAKINGWORDS.SPEECH = {};
MAKINGWORDS.SPEECH.msg = new SpeechSynthesisUtterance();
50
MAKINGWORDS.lessonNumber = 0;
MAKINGWORDS.currentStep = 0;

MAKINGWORDS.SPEECH.msg.volume = 1; // 0 to 1
MAKINGWORDS.SPEECH.msg.rate = .74;
MAKINGWORDS.SPEECH.talk = function(s, f, n){
	var forget = ((typeof f == 'undefined') ? false : f );
	var newMsg = ((typeof n == 'undefined') ? false : n);
	var holdMsg = ((forget) ? ((newMsg) ? newMsg :MAKINGWORDS.SPEECH.msg.text) : false);
	if (typeof s != 'undefined'){
		MAKINGWORDS.SPEECH.msg.text = s
	}
	window.speechSynthesis.speak(MAKINGWORDS.SPEECH.msg);
	if (holdMsg) MAKINGWORDS.SPEECH.msg.text = holdMsg;
}

MAKINGWORDS.dragSrc = null;
	
MAKINGWORDS.init = function(){
	if (MAKINGWORDS.initialized){
		return;
	} else {
		MAKINGWORDS.initialized = true
	}
	
	MAKINGWORDS.lvl = ((['lesson_h', 'lesson_m', 'lesson_l'].indexOf(MAKINGWORDS.getParam('lvl')) != -1) ? MAKINGWORDS.getParam('lvl') : 'lesson_m' );
	
	console.log(MAKINGWORDS.lvl);

	
	MAKINGWORDS.loadLesson(MAKINGWORDS.lessonNumber);
	
	$('#check').on('click', function(e){
		var word = '';
		$('#word .letter').each(function(idx, obj){
			word += $(obj).html();
		});

		var phrase = 'You spelled ' + word;		
		// window.speechSynthesis.cancel();
		var newMsg = false
		if (word.toUpperCase() == MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words[MAKINGWORDS.currentStep].word.toUpperCase()){
			MAKINGWORDS.currentStep++;
			
			phrase += '. That\'s correct! ' + ((MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words.length > MAKINGWORDS.currentStep)? 'Now ' : '');
			newMsg = ((MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words.length > MAKINGWORDS.currentStep) ? MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words[MAKINGWORDS.currentStep].script : 'Try the next lesson!');

			if (!(MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words.length > MAKINGWORDS.currentStep)) $('#check').prop('disabled', true);
			$('#wordlist').append('<li>' + word.toUpperCase() + '</li>');
		} else {		
			phrase += '. That\'s incorrect!';
		}

		phrase += ((MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words.length > MAKINGWORDS.currentStep)? MAKINGWORDS[MAKINGWORDS.lvl][MAKINGWORDS.lessonNumber].words[MAKINGWORDS.currentStep].script : ' Congratulations! You found the secret word! This is the end of the lesson.');
		MAKINGWORDS.SPEECH.talk(phrase, true, newMsg);
	}).on('mouseup', function(){
		$(this).blur();
	});
	
	$('#repeat').on('click', function(e){
		// window.speechSynthesis.cancel();
		MAKINGWORDS.SPEECH.talk();
	}).on('mouseup', function(){
		$(this).blur();
	});

	$('#next').on('click', function(e){

		MAKINGWORDS.lessonNumber++;
		MAKINGWORDS.loadLesson(MAKINGWORDS.lessonNumber);
		return false;
	}).on('mouseup', function(){
		$(this).blur();
	});


	$('#previous').on('click', function(e){

		MAKINGWORDS.lessonNumber--;
		MAKINGWORDS.loadLesson(MAKINGWORDS.lessonNumber);
		return false;
	}).on('mouseup', function(){
		$(this).blur();
	});
}

MAKINGWORDS.dragInit = function(){
	$('.letter').off();
	$('#wordcontainer').off();
	$('#lettercontainer').off();

	var initObj = function(s){
	return $(s).on('dragstart', function(e){		
		// this.style.opacity = '0.4';
		$(this).css('opacity', '0.4');
		e.originalEvent.dataTransfer.effectAllowed = 'move';
		e.originalEvent.dataTransfer.setData('text/html', $("<div />").append($(this).clone()).html());
		
	}).on('dragover', function(e){		
		e.preventDefault();
		e.originalEvent.dataTransfer.dropEffect = 'move';
		return false;
	}).on('dragenter', function(e){		
		$(this).addClass('over');
	}).on('dragleave', function(e){		
		$(this).removeClass('over');
	}).on('drop', function(e){
		e.preventDefault();
		e.stopPropagation();

		MAKINGWORDS.dragSrc = $("<div />").append($(e.target).clone()).html();
		var data = e.originalEvent.dataTransfer.getData('text/html');
		
		$(e.target).html($(data).html());
	}).on('dragend', function(e){
		

		$('.letter').removeClass('over');		
		$(this).css('opacity', '1');
		if (MAKINGWORDS.dragSrc != null) {
			$(this).html($(MAKINGWORDS.dragSrc).html());
			MAKINGWORDS.dragSrc = null;
		} else {
			if ( ( $('#wordcontainer').offset().left < e.pageX && e.pageX < ( $('#wordcontainer').offset().left + $('#wordcontainer').outerWidth() ) && $('#wordcontainer').offset().top < e.pageY && e.pageY < ( $('#wordcontainer').offset().top + $('#wordcontainer').outerHeight() ) ) || ( $('#lettercontainer').offset().left < e.pageX && e.pageX < ( $('#lettercontainer').offset().left + $('#lettercontainer').outerWidth() ) && $('#lettercontainer').offset().top < e.pageY && e.pageY < ( $('#lettercontainer').offset().top + $('#lettercontainer').outerHeight() ) ) ) {
				var classesArr = $(this).attr("class").toString().split(' ');
				var c = '.' + classesArr[classesArr.length -1];
				if ($(c).length == 2) {
					$(this).remove();
				}
				
			}
		}
	});
	}

	$('#wordcontainer').on('dragover', function(e){
		e.preventDefault();
		e.originalEvent.dataTransfer.dropEffect = 'move';
		return false;
	}).on('drop', function(e){
		e.preventDefault();
	
		var data = e.originalEvent.dataTransfer.getData('text/html');
		if (e.pageX < $('#word').offset().left) {
			$('#word').prepend(initObj($(data).css('opacity','1')));
		} else {
			$('#word').append(initObj($(data).css('opacity','1')));
		}

		MAKINGWORDS.dragSrc = null;
	});

	$('#lettercontainer').on('dragover', function(e){
		e.preventDefault();
		e.originalEvent.dataTransfer.dropEffect = 'move';
		return false;
	}).on('drop', function(e){
		e.preventDefault();
	
		var data = e.originalEvent.dataTransfer.getData('text/html');

		if (e.pageX < $('#letters').offset().left) {
			$('#letters').prepend(initObj($(data).css('opacity','1')));
		} else {
			$('#letters').append(initObj($(data).css('opacity','1')));
		}

		MAKINGWORDS.dragSrc = null;
	});
	
	initObj('.letter');
	
}

MAKINGWORDS.loadLesson = function(n){
	window.speechSynthesis.cancel();

	MAKINGWORDS.currentStep = 0;


	$('#lessonnumber').html(n + 1);

	if (n <= 0) {
		$('#previous').prop('disabled', true);
	} else {
		$('#previous').prop('disabled', false);
	}

	if (n >= (MAKINGWORDS[MAKINGWORDS.lvl].length -1)){
		$('#next').prop('disabled', true);
	} else {
		$('#next').prop('disabled', false);
	}

	$('#check').prop('disabled', false);

	$('#letters').empty();
	$('#word').empty();
	$('#wordlist').empty();
	
	var lastWord = MAKINGWORDS[MAKINGWORDS.lvl][n].words[MAKINGWORDS[MAKINGWORDS.lvl][n].words.length - 1].word;
		lastWord = lastWord.split("");
		lastWord = lastWord.sort();
		lastWord= lastWord.join("");

	for (var i = 0, len = lastWord.length; i < len; i++) {
		$('#letters').append('<div class="letter pull-left id' + i + '" draggable="true">' + lastWord[i] + '</div>');
	}	
	
	MAKINGWORDS.dragInit();
	MAKINGWORDS.SPEECH.talk('Lesson ' + (n+1));
	MAKINGWORDS.SPEECH.talk(MAKINGWORDS[MAKINGWORDS.lvl][n].words[MAKINGWORDS.currentStep].script);

}

MAKINGWORDS.getParam = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){
	window.speechSynthesis.onvoiceschanged = function() {
		var voices = window.speechSynthesis.getVoices();
		$.each(window.speechSynthesis.getVoices(), function(idx, voice){
			if (voice.name == 'Google US English'){ // 'Google UK English Male'){
				window.speechSynthesis.onvoiceschanged = false;
				MAKINGWORDS.SPEECH.msg.voice = voice;
				MAKINGWORDS.init();
			}
		});



		
	};
	
});
