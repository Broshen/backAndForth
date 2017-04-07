//HTML Elements
var btnToEng = $("#transToEng");
var btnToLang = $("#transToLang");
var customerMsg = $("#customerMsg");
var customerTrans = $("#customerTrans");
var myMsg = $("#myMsg");
var myTrans = $("#myTrans");
var clipboardBtn = $('#clipboardBtn');

//Set default language to english, and autodetect customer's language true
var lang="en";
var isAuto=true;

//Variable to store message text
var msgText;

//Initialize select2 search bar
var languageBar = $('#langInput').select2({ width: '150px' });

//Function to create the google translate URL endpoint 
function translateURL(sourceLang, transLang, message){
	return "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + sourceLang + "&tl=" + transLang + "&dt=t&q="+encodeURIComponent(message);
}

//function to parse the JSON response and grab the text & language
function parseResponse(response){
	var responseText = "";
	var responseLang = "";

	response = JSON.parse(response);

	for(var i=0; i<response[0].length; i++){
		responseText += response[0][i][0].replace(/&\s*nbsp\s*;/gi, '&nbsp;');
	}
	responseLang = response[2]

	var responseArr = [responseText, responseLang];
	return responseArr;
}

//function to send an async GET to the google translate URL
function translateRequest(url, callbackfn){
	$.get(url, function(data){},"text")
		.then(function(data){
	    	response = parseResponse(data);
			callbackfn(response);
		});	
}

function translateToEng(){
	var LangFrom;

	if(isAuto){
		LangFrom='auto';
	}
	else{
		LangFrom=$('#langInput').val();
	}

	var msgText = customerMsg.val();


	var urlToEng = translateURL(LangFrom, 'en', msgText);

	translateRequest(urlToEng, function(response){
    	customerTrans[0].innerHTML = response[0].replace(/\n/g, "<br>");
    	lang = response[1];
    	if(isAuto && $('#langInput').val() != lang){
			languageBar.val(lang).trigger('change');
			translateToLang();
    	}
	});
}

function translateToLang(){

	lang = $('#langInput').val();

	var msgText = myMsg.val();

	var urlToLang = translateURL('en', lang, msgText);

	translateRequest(urlToLang, function(response){
		myTrans[0].innerHTML = response[0] +"<br><br>"+ "------" + "<br><br>"+ msgText;

		var urlBack = translateURL(lang, 'en', response[0]);

		translateRequest(urlBack, function(response){
			if(response[1]){				
				$('#backInEng')[0].innerHTML= response[0];
			}
		})
	});
}

btnToEng.click(translateToEng);

btnToLang.click(translateToLang);

customerMsg.on('paste keyup', function(e){
	translateToEng();});


myMsg.on('paste keyup', function(e){
	translateToLang();
});

$('#langInput').on('paste keyup', function(e){
	//updateFillerText();
	setTimeout("translateToLang()", 100);
});

$('#autoTranslate').on('change', function(e){
	isAuto = $('#autoTranslate')[0].checked
	$('#langInput')[0].disabled=isAuto;
	translateToEng();
})

var clipboard = new Clipboard('#clipboardBtn');

clipboard.on('success', function(e) {

    e.clearSelection();
});

clipboard.on('error', function(e) {
});

translateToLang();