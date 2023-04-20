/*
    Finds all <iHTML> elements in the main HTML document. For reach, fetches an HTML file,
    as specified by its src attribute, and loads its content into that iHTML element.
    After all IHTML contents have been loaded, it executes the contents of all imported
    <script> tags, using eval(). It does not properly import external scripts declared with
    <script> tags
*/
async function loadAll(){
    for(var toI of document.getElementsByTagName("IHTML")){
        if(toI.getAttribute("src")!=null)
        await fetch(toI.getAttribute("src"))
            .then(response => response.text())
            .then(data => toI.innerHTML=data);
    }
    return;
}

async function loadFromElement(e){
    e.dataset["ihtmlLoading"]=true;
    await fetch(e.getAttribute("src"))
        .then(response => response.text())
        .then(data => e.innerHTML=data)
        .then(done => {
            for(s of document.querySelectorAll("ihtml[data-ihtmlLoading=true] script")){
                eval(s.innerHTML)
            }
        })
}
window.addEventListener("load",()=>{
    //console.log("ihtml.js engaged")
    loadAll().then(done =>{
        for(s of document.querySelectorAll("ihtml script")){
            eval(s.innerHTML)
        }
        /*
        for(i of document.querySelectorAll("ihtml")){
            i.outerHTML=i.innerHTML;
        }
        */
    })
})