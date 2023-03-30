/*
    Código para ser usado en el proyecto GOWEST, del curso de Programación Web 2023-1
*/
function get(id){return document.getElementById(id)}

//categoryContents={}
//var g=get("gallery")
function loadCategoryGalleryInto(cat,e,link){
    fetch("categoryContents.json").
        then(response=>response.json()).
        then(text=>e.innerHTML=parseCategoryContentsJson(text,cat,link))
}

function parseCategoryContentsJson(json,cat="",link=false){
    r="<div class='row bg-gowest categoryTitle'>"+
        (link?"<a href='category.html?c="+cat+"'>":"")+
        cat+
        (link?"</a>":"")+"</div>";
    var template=
        "<a class='galleryItem' href='item.html?id={ID}'>"+
        "<img class='galleryItemImage mx-auto d-block' src='img/placeholder.png'>"+
        "<div class='galleryItemLabel'>{CONTENT}"+
            "</div></a>";
    var c=json["categories"][cat];
    var cl=c.length //category length
    for(var i=0;i<Math.ceil(cl/4);i++){
        r+="<div class='row galleryRow'>";
        for(var j=0;j<4;j++){
            index=i*4+j;
            content="";
            if(index<cl){
                item=c[index]
                content=template;
                content=content.replaceAll("{ID}",item["name"])
                content=content.replaceAll("{CONTENT}",item["name"])
            }
            r+="<div class='col-sm-3'>"+content+"</div>";
        }
        r+="</div>";
    }
    return r;
}

async function getCategories(){
    var c;
    await fetch("categoryContents.json").
        then(response=>response.json()).
        then(json=>c=Object.keys(json["categories"]))
    return c;
}

window.addEventListener("load",()=>{
    
})