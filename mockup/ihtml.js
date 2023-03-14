//Finds all <iHTML> elements in the main HTML document. For reach, fetches an HTML file,
//as specified by its src attribute, and loads its content into that iHTML element.

window.onload=()=>{
    for(var toI of document.getElementsByTagName("IHTML")){
        fetch(toI.getAttribute("src"))
            .then(response => response.text())
            .then(data => toI.innerHTML=data);
    }
}