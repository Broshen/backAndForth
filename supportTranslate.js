
var btnToEng = $("#transToEng");
var btnToLang = $("#transToLang");
var customerMsg = $("#customerMsg");
var customerTrans = $("#customerTrans");
var myMsg = $("#myMsg");
var myTrans = $("#myTrans");
var lang="en";
var responseBefore = "Hello,\nFor your convenience, this message was translated by Google Translate:";
var responseMid = "Original Message:";
var transBefore = responseBefore;
var transMid = responseMid;
var bestRegards = "Best regards,";

function translateURL(sourceLang, transLang, message){
	return "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + transLang + "&dt=t&q="+encodeURI(message);
}

function parseResponse(response){
	var responseText = "";
	var responseLang = "";
	response = response.replace(new RegExp(",{2,}", "g"), ",");

	//to prevent the json parser from parsing incorrect json
	if(response.indexOf(",")==1){
		response = response.replace(',',"");
	}

	response = JSON.parse(response);

	if(response[1] != 0){
		responseLang = response[1];

		for(var i=0; i<response[0].length; i++){
			responseText+=response[0][i][0];
		}

	}
	else{
		responseText=" ";
		responseLang="en";
	}

	var responseArr = [responseText, responseLang];
	return responseArr;
}

function translateRequest(url, callbackfn){

	$.get(url, function(data){},"text")
		.then(function(data){

	    	response = parseResponse(data);
			
			callbackfn(response);
		});	
}


function translateToEng(){

	var msgText = customerMsg.val();

	var urlToEng = translateURL('auto', 'en', msgText);

	translateRequest(urlToEng, function(response){
    	customerTrans[0].innerText = response[0];
    	lang = response[1];
    	if($('#langInput').val() != lang){
			$('#langInput').val(lang);

			updateFillerText();
    	}
	});
}

function translateToLang(){
	var msgText = myMsg.val() ;

	var urlToLang = translateURL('en', lang, msgText);

	translateRequest(urlToLang, function(response){

		myTrans[0].innerText = transBefore +"\n\n"+ response[0] +"\n\n"+ transMid + "\n\n"+msgText + "\n\n" + bestRegards;


		var urlBack = translateURL(lang, 'en', response[0]);
		console.log(response[0]);

		translateRequest(urlBack, function(response){
			if(response[1]){				
				$('#backInEng')[0].innerText = response[0];
			}
		})
	});
}


function updateFillerText(){
	lang = $('#langInput').val();
	var urlRegards = translateURL('en', lang, 'Best regards');
	var urlBefore = translateURL('en', lang, responseBefore);
	var urlMid = translateURL('en', lang, responseMid);

	translateRequest(urlRegards, function(response){
		bestRegards = response[0];
	});
	translateRequest(urlBefore, function(response){
		transBefore = response[0];
	});
	translateRequest(urlMid, function(response){
		transMid = response[0];
	});

}

btnToEng.click(translateToEng);

customerMsg.on('paste keyup', function(e){
	translateToEng();});

var test;
btnToLang.click(translateToLang);

myMsg.on('paste keyup', function(e){
	translateToLang();
});

$('#langInput').on('paste keyup', function(e){
	updateFillerText();
	setTimeout("translateToLang()", 100);
});

