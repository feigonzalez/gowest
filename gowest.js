/*
    Código para ser usado en el proyecto GOWEST, del curso de Programación Web 2023-1
*/
var debugging=true;
function debugLog(s){if(debugging)console.log(s)}
function get(id){return document.getElementById(id)}

async function selectAll(){
	debugLog("Retrieving DB data...");
	var res;
	await fetch("db.json").then(r=>r.json()).then(j=>res=j);
	debugLog("DB data retrieved.")
	return res;
}

async function selectAllFrom(table){
	debugLog(`Retrieving data from DB at table [${table}]`);
	var db = await selectAll();
	if(table in db){
		debugLog(`Data from table [${table}] retrieved.`);
		return db[table];
	} else {
		debugLog(`Table [${table}] not found`);
		return null;
	}
}

//compFunc should be given as (i)=>{return X},
//where i a row of the selected table and
//X is the comparison function. It should use fields of i
async function selectAllWhere(table,compFunc){
	debugLog(`Retrieving data from DB at table [${table}] where [${compFunc}]`)
	var res=[];
	var db = await selectAll();
	if(!(table in db)){
		debugLog(`Table [${table}] not found.`)
		return [];
	} else {
		for(var i of db[table]){
			if(compFunc(i))res.push(i)
		}
		debugLog(`Retrieved ${res.length} rows from table [${table}]`);
	}
	return res;
}

async function loadCategoryGalleryInto(cat="",e,link=false){
	var cn = (await selectAllWhere("categories",(i)=>{return i["code"]==cat}))[0]["name"]
	var c = await selectAllWhere("products",(i)=>{return i["category"]==cat});
    //var c=json["categories"][cat];
    var cl=c.length //category length
    r="<div class='row bg-gowest categoryTitle'>"+
        (link?"<a href='category.html?c="+cat+"'>":"")+
        cn+
        (link?" <span class='productCount'>Ver "+cl+" productos</span></a>":"")+"</div>";
    var template=
        "<div class='galleryItem'>"+
		"<a class='galleryItemLink' href='product.html?p={ID}'>"+
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
                content=content.replaceAll("{ID}",item["code"])
                content=content.replaceAll("{CONTENT}",item["name"])
                content=content.replaceAll("{PRICE}","$"+item["price"])
            }
            r+="<div class='col-sm-3'>"+content+"</div>";
        }
        r+="</div>";
    }
    e.innerHTML=r;
}

async function fillProductModal(e){
	await selectAllFrom("categories").then(data=>{
		for(row of data){
			get("productFormCategory").innerHTML+=`<option value="${row["code"]}">${row["name"]}</option>`;
		}
	});
	if(e){
		var parent=e.parentElement.parentElement;
		//get("productFormImage").setAttribute("src",parent.children[0].children.getAttribute("src"));
		get("productFormImagePreview").setAttribute("src",parent.children[0].children[0].getAttribute("src"))
		get("productFormCode").value=parent.children[1].innerText;
		get("productFormName").value=parent.children[2].innerText;
		get("productFormPrice").value=parent.children[3].innerText;
		get("productFormCategory").value=parent.children[4].innerText;
		get("productFormUpdate").value=true;
	}
}

function confirmDeleteProduct(e){
	var name=e.parentElement.parentElement.children[2].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar producto ${name}?"`;
}

window.addEventListener("load",()=>{
    
})