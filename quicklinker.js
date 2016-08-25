var selectedText, selectedRange;
var bodyElement = document.body;

var modal, qtsSelection, qtsSearch, qtsResults;

var selectedText, xhttp, resultmodel;
var linksArr = [];
var textsArr = [];

var isCtrl = false;

modal = document.getElementById('myModal');
qtsSelection = document.getElementById("extension-selection");
qtsSearch = document.getElementById("extension-search");
qtsResults = document.getElementById("extension-search-results");


// function to toggle the modal
function togglemodal (){
	//if the modal is showing, hide it
	if(modal.style.display == "block"){
		modal.style.display = "none";
	}
	//otherwise, show it
	else{
		modal.style.display = "block";
	}
}

function getSelectionText() {
    selectedRange = window.getSelection().getRangeAt(0);
    return window.getSelection().toString();
}

function insertLink (i){
	var linkToInsert = linksArr[i];

	selectedRange.deleteContents();
	var newNode = document.createElement('b');
	newNode.innerHTML = "<a href=" + linkToInsert + " target>" + selectedText+"</a>";

	selectedRange.insertNode(newNode);

	modal.style.display = "none";
}

function displayHelpResults(){
	var parser = new DOMParser();
	resultmodel = parser.parseFromString(xhttp.responseText,"text/html");
	var articlesArr = resultmodel.getElementsByClassName("article-item");
	var stringtoRender="";
	for(var i = 0; i<articlesArr.length; i++){
		linksArr[i]="http://support.quicktapsurvey.com"+articlesArr[i].getElementsByTagName('a')[0].getAttribute("href"); 
		textsArr[i]=articlesArr[i].getElementsByTagName('a')[0].innerText +"<br>"+ articlesArr[i].getElementsByTagName('div')[0].innerText + "<br>" + articlesArr[i].getElementsByTagName('p')[0].innerText;
		var linktoArticle ='<a href=' + linksArr[i] + " target=_blank >Open this article in new tab</a>";
		stringtoRender += "<div class='qtsSearchResults' onclick='insertLink(" + i + ")'>" + textsArr[i] + "</a></div>" + linktoArticle + "<br><br>";	//insertLink(" + i + ")
	}

	console.log(linksArr);

	qtsResults.innerHTML = stringtoRender;
}

document.onkeyup=function(e) {
    if(e.which == 91 || e.which == 93 ) isCtrl=false;

}

document.onkeydown=function(e){
    if(e.which == 91 || e.which == 93) isCtrl=true;

    if(e.which == 69 && isCtrl == true) {
        togglemodal();

        selectedText = getSelectionText().trim();
		qtsSelection.innerText = selectedText;
		qtsSearch.innerText = selectedText;

		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (xhttp.status == 200) {
		    	displayHelpResults();
		  };
		}

		xhttp.open("GET", "http://support.quicktapsurvey.com/support/search/solutions?term=" + encodeURI(selectedText), true);
		xhttp.send();

        console.log("triggered");
        return false;
    }

    if(e.which == 27){
    	modal.style.display = "none";
    }
}

document.onclick=function(e){
	if(!modal.contains(e.target)){
		modal.style.display = "none";
	}
}

console.log("Background script");

