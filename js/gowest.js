/*
    Código para ser usado en el proyecto GOWEST, del curso de Programación Web 2023-1
*/

/*
	Debugging Management
	This provides a print-to-console function that only works when a global variable, debugging,
	is set to true.
*/
var debugging=true;
function debugLog(s){if(debugging)console.log(s)}

/*
	Utilities
*/

//	get(id) returns the HTML element with the given id, or null if no such element exists.
function get(id){return document.getElementById(id)}

/*
	Site-specific methods
*/

/*
	Builds a <div> element containing the category title, and a number of products from that category.
	The built <div> element is then appended to the element passed as e.
	If link is set to true, the category title will be a link that redirects to the corresponding
	category page, and will also show the total number of products from that category.
*/
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
		"<button class='btn btn-success galleryCartBtn' onclick='addToCart(1)'>Añadir al carrito</button></div>";
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

/*
	Modal Preparation methods
	Each prepareXModal can take a parameter, e. If e is not set, the form will be empty.
	Otherwise, e is expected to be the button that showed the modal (by using the this keyword as parameter).
	If e is set correctly, the form will be filled with the corresponding data.
	Certain functions use e's data-id attribute and make a query to the database. Others use the data from
	the table directly. Which functions do what is not consistent.
*/

//	Prepares the Product Modal in the adminProducts page.
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

//	Prepares the Category Modal in the adminCategories page.
async function prepareCategoryModal(e){
	if(e){
		var parent=e.parentElement.parentElement;
		get("categoryFormName").value=parent.children[0].innerText;
	} else {
		get("categoryFormName").value="";
	}
}

//	Prepares the Client Modal in the adminClients page.
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

/*
	Prepares the Sales Modal in both the adminSales page and the clientSales page.
	If userID is set, the modal is assumed to belong to the client view, and the client
	information is hidden from the form.
*/

async function prepareSaleModal(e,userID){
	var sale = (await selectAllWhere("sales",(i)=>{return i["id"]==e.dataset["id"] && (userID?i["userID"]==userID:true)}))[0];
	var details = (await selectAllWhere("saleDetails",(i)=>{return i["saleID"]==sale["id"]}))
	var user = (await selectAllWhere("users",(i)=>{return i["id"]==sale["userID"]}))[0]
	var address = (await selectAllWhere("addresses",(i)=>{return i["id"]==sale["addressID"]}))[0]
	var district = (await selectAllWhere("districts",(i)=>{return i["id"]==address["districtID"]}))[0]
	if(userID==null){
		get("saleFormUser").innerText=`${user["name"]} ${user["surname"]} (${sale["userID"]})`;
	} else {
		get("saleFormUserRow").classList.add("hidden");
	}
	get("saleFormAddress").innerText=`${address["street"]} ${address["number"]}, ${district["name"]}`;
	get("saleFormSaleDate").innerText=sale["saleDate"];
	get("saleFormDeliveryDate").innerText=sale["deliveryDate"];
	get("saleFormStatus").innerHTML=formatSaleStatus(sale["status"]);
	get("saleFormTotal").innerText=sale["total"];
	var newInnerHTML="<table class='table text-center'>\n<tr><th>Producto</th><th>Precio</th><th>Unidades</th><th>Subtotal</th></tr>\n";
	for(d of details){
		var product = (await selectAllWhere("products",(i)=>{return i["id"]==d["productID"]}))[0]
		newInnerHTML+=`<tr><td>${product["name"]}</td><td>${product["price"]}</td><td>${d["units"]}</td><td>${d["subtotal"]}</td></tr>\n`;
	}
	newInnerHTML+="</table>";
	get("saleFormDetailsHolder").innerHTML=newInnerHTML;
}

//	Prepares the Administrator Modal in the adminAdministrators page.
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
//	Prepares the Address Modal in the clientAccounr page.
async function prepareAddressModal(e){
	var districts=await selectAllFrom("districts");
	for(d of districts){
		get("addressFormDistrict").innerHTML+=`<option value=${d["id"]}>${d["name"]}</option>`;
	}
	if(e==null){
		get("addressFormStreet").value="";
		get("addressFormNumber").value="";
		get("addressFormPostalCode").value="";
		get("addressFormDistrict").value=0;
	} else {
		var address=(await selectAllWhere("addresses",(i)=>{return i["id"]==e.dataset["id"]}))[0]
		get("addressFormStreet").value=address["street"];
		get("addressFormNumber").value=address["number"];
		get("addressFormPostalCode").value=address["postalCode"];
		get("addressFormDistrict").value=address["districtID"];
	}
}

/*
	Confirm Action Modals
	Certain actions should require user confirmation before being taken.
	A few modals are used for asking cofirmation, and a function is called in each
	instance to prepare the modal with the correct text and functionality.
*/

//	Prepares the deleteAdministrator delete modal from the adminAdministrators page.
function confirmDeleteAdministrator(e){
	var name=e.parentElement.parentElement.children[0].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar administrador ${name}?`;
	get("deleteAlertConfirm").setAttribute("onclick","moveTo('adminIndex.html',[['t','admins']])");
}

//	Prepares the deletePrpduct delete modal from the adminProducts page.
function confirmDeleteProduct(e){
	var name=e.parentElement.parentElement.children[1].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar producto ${name}?`;
	get("deleteAlertConfirm").setAttribute("onclick","moveTo('adminIndex.html',[['t','products']])");
}

//	Prepares the deleteCategory delete modal from the adminCategories page.
function confirmDeleteCategory(e){
	var name=e.parentElement.parentElement.children[0].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar categoría ${name} y todos los productos relacionados?`;
	get("deleteAlertConfirm").setAttribute("onclick","moveTo('adminIndex.html',[['t','categories']])");
}

//	Prepares the deleteAddress delete modal from the clientAccount page.
function confirmDeleteAddress(e){
	var name=e.parentElement.parentElement.children[0].innerText;
	get("deleteAlertMessage").innerText=`¿Eliminar dirección ${name}?`;
	get("deleteAlertConfirm").setAttribute("onclick","moveTo('account.html',[['t','account']])");
}

//	Prepares the confirmSale confirm modal from the clientSales page.
function confirmSaleReception(e){
	var id=e.dataset["id"];
	get("saleAlertMessage").innerText=`¿Confirmar que la compra de código ${id} fue entregada?`;
	get("saleAlertConfirm").setAttribute("onclick","moveTo('account.html',[['t','sales']])");
}

//	Prepares the confirmShipment confirm modal from the adminSales page.
function confirmSaleShipment(e){
	var id=e.dataset["id"];
	get("saleAlertMessage").innerText=`¿Confirmar que la compra de código ${id} fue enviada?`;
	get("saleAlertConfirm").setAttribute("onclick","moveTo('adminIndex.html',[['t','sales']])");
}

//	Returns a <span> badge element that corresponds to the passed status, if valid.
function formatSaleStatus(status){
	switch(status){
		case "Carrito": return `<span class='badge badge-pill badge-secondary badge-saleStatus'>${status}</span>`;
		case "Pagada": return `<span class='badge badge-pill badge-danger badge-saleStatus'>${status}</span>`;
		case "Despachada": return `<span class='badge badge-pill badge-primary badge-saleStatus'>${status}</span>`;
		case "Completada": return `<span class='badge badge-pill badge-success badge-saleStatus'>${status}</span>`;
		default: return status;
	}
}

/*
	Queries the database to obtain a user's security question, and fills the
	form in recoverPass.html. The user is determined from the passed element's value.
*/
async function loadSecQuestion(e){
	var user = (await selectAllWhere("users",(i)=>{return i["rut"]==e.value}))[0]
	if(user!=null){
		get("f_invalidRutFeedback").style.display="none";
		var secQ = (await selectAllWhere("secQuestions",(i)=>{return i["id"]==user["secQuestionID"]}))[0]
		get("secQuestionHolder").innerText=secQ["value"];
		get("f_rut").value=user["rut"];
		get("f_inputRut").classList.remove("is-invalid");
	} else {
		get("secQuestionHolder").innerText="–";
		get("f_rut").value="";
		get("f_invalidRutFeedback").style.display="block";
		get("f_inputRut").classList.add("is-invalid");
	}
}

/*
	Adds a badge to the navbar cart button, or replaces its value, according to the number
	of units specified.
*/
function addToCart(units){
	var cartBtn = get("navbarCartBtn");
	if(cartBtn==null) return;
	if(units==null) units = parseInt(get("addToCartUnits").value);
	var newUnits=parseInt(cartBtn.dataset["units"])+units;
	var cartBadge=get("navbarCartUnits");
	cartBadge.classList.remove("hidden");
	cartBadge.innerText=newUnits;
	cartBtn.dataset["units"]=newUnits;
	params["cart"]=newUnits;
}


window.addEventListener("load",()=>{
})