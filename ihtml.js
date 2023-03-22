/*
    Finds all <iHTML> elements in the main HTML document. For reach, fetches an HTML file,
    as specified by its src attribute, and loads its content into that iHTML element.
    After all IHTML contents have been loaded, it executes the contents of all imported
    <script> tags, using eval(). It does not properly import external scripts declared with
    <script> tags
*/
async function loadAll(){
    for(var toI of document.getElementsByTagName("IHTML")){
        await fetch(toI.getAttribute("src"))
            .then(response => response.text())
            .then(data => toI.innerHTML=data);
    }
    return;
}
window.addEventListener("load",()=>{
    loadAll().then(done =>{
        for(s of document.querySelectorAll("ihtml script")){
            eval(s.innerHTML)
        }
    })
})