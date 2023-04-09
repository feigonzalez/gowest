/*
    Código para ser usado en el proyecto GOWEST, del curso de Programación Web 2023-1
*/
var url = new URL(window.location.href);
var params={};
for([key,val] of url.searchParams){
	params[key]=val;
}

function clearParams(){
	params={};
}
function clearParamsKeep(keys){
	for(param in params){
		if(keys.indexOf(param)==-1){
			delete params[param]
		}
	}
}

function moveTo(newPage,newParams){
	if(newParams){
		for(pair of newParams){
			params[pair[0]]=pair[1];
		}
	}
	var appendParams="?";
	for(key in params){
		appendParams+=`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
	}
	appendParams=appendParams.substring(0,appendParams.length-1);
	window.location.href=newPage+appendParams;
}

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
        (link?"<a href='#' onclick='moveTo(\"category.html\",[[\"c\",\""+cat+"\"]])'>":"")+
        cn+
        (link?" <span class='productCount'>Ver "+cl+" productos</span></a>":"")+"</div>";
    var template=
        "<div class='galleryItem'>"+
		"<a class='galleryItemLink' href='#' onclick='moveTo(\"product.html\",[[\"p\",\"{ID}\"]])'>"+
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

async function prepareProductModal(e){
	await selectAllFrom("categories").then(data=>{
		for(row of data){
			get("productFormCategory").innerHTML+=`<option value="${row["code"]}">${row["name"]}</option>`;
		}
	});
	if(e){
		var parent=e.parentElement.parentElement;
		get("productFormImagePreview").setAttribute("src",parent.children[0].children[0].getAttribute("src"));
		get("productFormName").value=parent.children[1].innerText;
		get("productFormPrice").value=parent.children[2].innerText;
		get("productFormStock").value=parent.children[3].innerText;
		get("productFormCategory").value=parent.children[4].innerText;
		get("productFormDescription").innerText=parent.children[5].innerHTML;
		get("productFormUpdate").value=true;
	} else {
		get("productFormImagePreview").setAttribute("src","");
		get("productFormName").value="";
		get("productFormPrice").value="";
		get("productFormStock").value="";
		get("productFormCategory").value="";
		get("productFormDescription").innerText="";
		get("productFormUpdate").value=false;
	}
}

async function prepareCategoryModal(e){
	if(e){
		var parent=e.parentElement.parentElement;
		get("categoryFormName").value=parent.children[0].innerText;
	} else {
		get("categoryFormName").value="";
	}
}

async function prepareClientModal(e){
	var user = (await selectAllWhere("users",(i)=>{return i["rut"]==e.dataset["id"]}))[0]
	var addresses = (await selectAllWhere("addresses",(i)=>{return i["userID"]==user["id"]}))
	get("clientFormName").innerText=user["name"];
	get("clientFormSurname").innerText=user["surname"];
	get("clientFormRUT").innerText=user["rut"];
	get("clientFormMail").innerText=user["mail"];
	get("clientFormPhone").innerText=user["phone"];
	get("clientFormAddressesHolder").innerHTML="";
	for(a of addresses){
		var district = (await selectAllWhere("districts",(i)=>{return i["id"]==a["districtID"]}))[0]
		get("clientFormAddressesHolder").innerHTML+=`<div>${a["street"]} ${a["number"]}, ${district["name"]}</div>`;
	}
}

async function prepareSaleModal(e){
	var sale = (await selectAllWhere("sales",(i)=>{return i["id"]==e.dataset["id"]}))[0];
	var details = (await selectAllWhere("saleDetails",(i)=>{return i["saleID"]==sale["id"]}))
	var user = (await selectAllWhere("users",(i)=>{return i["id"]==sale["userID"]}))[0]
	var address = (await selectAllWhere("addresses",(i)=>{return i["id"]==sale["addressID"]}))[0]
	var district = (await selectAllWhere("districts",(i)=>{return i["id"]==address["districtID"]}))[0]
	get("saleFormUser").innerText=`${user["name"]} ${user["surname"]} (${sale["userID"]})`;
	get("saleFormAddress").innerText=`${address["street"]} ${address["number"]}, ${district["name"]}`;
	get("saleFormSaleDate").innerText=sale["saleDate"];
	get("saleFormDeliveryDate").innerText=sale["deliveryDate"];
	get("saleFormStatus").innerHTML=formatSaleStatus(sale["status"]);
	get("saleFormTotal").innerText=sale["total"];
	var newInnerHTML="<table class='table text-center'>\n<tr><th>Producto</th><th>Precio</th><th>Unidades</th><th>Subtotal</th></tr>\n";
	for(d of details){
		var product = (await selectAllWhere("products",(i)=>{return i["id"]==d["productID"]}))[0]
		console.log(product)
		newInnerHTML+=`<tr><td>${product["name"]}</td><td>${product["price"]}</td><td>${d["units"]}</td><td>${d["subtotal"]}</td></tr>\n`;
	}
	newInnerHTML+="</table>";
	get("saleFormDetailsHolder").innerHTML=newInnerHTML;
}

async function prepareAdministratorModal(e){
	if(e){
		get("adminFormShow").classList.remove("hidden");
		get("adminFormNew").classList.add("hidden");
		var user = (await selectAllWhere("users",(i)=>{return i["rut"]==e.dataset["id"]}))[0];
		get("adminFormShowName").innerText=user["name"];
		get("adminFormShowSurname").innerText=user["surname"];
		get("adminFormShowRUT").innerText=user["rut"];
		get("adminFormShowMail").innerText=user["mail"];
		get("adminFormShowPhone").innerText=user["phone"];
	} else {
		get("adminFormShow").classList.add("hidden");
		get("adminFormNew").classList.remove("hidden");
	}
}

function confirmDeleteAdministrator(e){
	var name=e.parentElement.parentElement.children[0].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar administrador ${name}?`;
	get("deleteAlertConfirm").setAttribute("href","adminIndex.html?t=admins");
}

function confirmDeleteProduct(e){
	var name=e.parentElement.parentElement.children[1].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar producto ${name}?`;
	get("deleteAlertConfirm").setAttribute("href","adminIndex.html?t=products");
}

function confirmDeleteCategory(e){
	var name=e.parentElement.parentElement.children[0].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar categoría ${name} y todos los productos relacionados?`;
	get("deleteAlertConfirm").setAttribute("href","adminIndex.html?t=categories");
}

function formatSaleStatus(status){
	switch(status){
		case "Carrito": return `<span class='badge badge-pill badge-secondary badge-saleStatus'>${status}</span>`;
		case "Despachado": return `<span class='badge badge-pill badge-primary badge-saleStatus'>${status}</span>`;
		case "Completado": return `<span class='badge badge-pill badge-success badge-saleStatus'>${status}</span>`;
		default: return status;
	}
}

async function loadSecQuestion(e){
	var user;
	var secQ;
	await selectAllWhere("users",(i)=>{return i["rut"]==e.value}).then(data=>{
		user=data[0];
	})
	if(user){
		get("f_invalidRutFeedback").style.display="none";
		await selectAllWhere("secQuestions",(i)=>{return i["rut"]==user["secQuestionId"]}).then(data=>{
			secQ=data[0];
			get("secQuestionHolder").innerText=secQ["value"];
			get("f_rut").value=user["rut"];
			get("f_inputRut").classList.remove("is-invalid");
		})
	} else {
		get("secQuestionHolder").innerText="–";
		get("f_rut").value="";
		get("f_invalidRutFeedback").style.display="block";
		get("f_inputRut").classList.add("is-invalid");
	}
}

window.addEventListener("load",()=>{
})