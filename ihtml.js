//Finds all <iHTML> elements in the main HTML document. For reach, fetches an HTML file,
//as specified by its src attribute, and loads its content into that iHTML element.
async function loadAll(){
    for(var toI of document.getElementsByTagName("IHTML")){
        await fetch(toI.getAttribute("src"))
            .then(response => response.text())
            .then(data => toI.innerHTML=data);
    }
}
window.addEventListener("load",()=>{
    loadAll()
})