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
    var c=json["categories"][cat];
    var cl=c.length //category length
    r="<div class='row bg-gowest categoryTitle'>"+
        (link?"<a href='category.html?c="+cat+"'>":"")+
        cat+
        (link?" <span class='productCount'>Ver "+cl+" productos</span></a>":"")+"</div>";
    var template=
        "<div class='galleryItem'>"+
		"<a class='galleryItemLink' href='product.html?id={ID}'>"+
        "<img class='galleryItemImage mx-auto d-block' src='img/products/{ID}.png'>"+
        "<div class='galleryItemLabel'>{CONTENT}</div>"+
        "<div class='galleryItemPrice'>{PRICE}</div></a>"+
		"<button class='btn btn-success galleryCartBtn'>Añadir al carrito</button></div>";
    for(var i=0;i<(link?1:Math.ceil(cl/4));i++){
        r+="<div class='row galleryRow'>";
        for(var j=0;j<4;j++){
            index=i*4+j;
            content="";
            if(index<cl){
                item=c[index]
                content=template;
                content=content.replaceAll("{ID}",item["name"])
                content=content.replaceAll("{CONTENT}",item["name"])
                content=content.replaceAll("{PRICE}","$"+item["price"])
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