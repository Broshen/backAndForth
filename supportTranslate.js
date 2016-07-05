
var btnToEng = $("#transToEng");
var btnToLang = $("#transToLang");
var customerMsg = $("#customerMsg");
var customerTrans = $("#customerTrans");
var myMsg = $("#myMsg");
var myTrans = $("#myTrans");
var lang="en";
var responseBefore = "Hello,\nFor your convenience, this message was translated by Google Translate:\n\n";
var responseMid = "\n\nOriginal Message:"
var bestRegards = "Best regards,";

btnToEng.click(function(){
	var msgText = customerMsg.val();

	var urlToEng = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + encodeURI(msgText);
  	var xmlhttp = new XMLHttpRequest();	
  	xmlhttp.onreadystatechange = function() {
   		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

	    	var response = xmlhttp.responseText;
	    	response = parseResponse(response);
	    	customerTrans[0].innerText = response[0];
	    	lang = response[1];
	    	$('#lang')[0].innerText = "Language: " + lang;

			translateBestRegards();

	    }
	};
	xmlhttp.open("GET", urlToEng, true);
	xmlhttp.send();
});

btnToLang.click(function(){
	var msgText = myMsg.val();
	

	var urlToLang = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl="+lang+"&dt=t&q="+encodeURI(responseBefore + msgText + responseMid);
	var xmlhttp = new XMLHttpRequest();	
  	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

	    	var response = xmlhttp.responseText;
	    	response = parseResponse(response);
	    	response[0] += "\n\n"+msgText + "\n\n" + bestRegards;
	    	myTrans[0].innerText = response[0];
	    }
	};
	xmlhttp.open("GET", urlToLang, true);
	xmlhttp.send();

})

function parseResponse(response){
	var responseText = "";
	response = response.replace(new RegExp(",{2,}", "g"), ",");
	response = JSON.parse(response);


	for(var i=0; i<response[0].length; i++){
		responseText+=response[0][i][0];
	}


	var responseArr = [responseText, response[1]];
	return responseArr;
}

function translateBestRegards(){
	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl="+lang+"&dt=t&q="+encodeURI("Best regards,");
	var xmlhttp = new XMLHttpRequest();	
  	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

	    	var response = xmlhttp.responseText;
	    	response = parseResponse(response);
	    	bestRegards = response[0];
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}
