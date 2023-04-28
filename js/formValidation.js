
/*
	Form validation
	<input>s in forms can be validated, depending on their input.
	After processing an <input>, call makeValid(e) or makeInvalid(e)
	on it to display it as valid or invalid, respectively.
*/

//Valid image file extensions, used for validation on image uploading.
var imageExt=["png","jpg","jpeg","bmp"];

//Field validation functions.

//Returns true if the given RUT follows the correcto format (a number with "."
//as thousand-separators, followed by "-", then a single digit or "K", )
function isValidRutFormat(str){
	return str.trim().match(/^[0-9]{1,3}(\.[0-9]{3})*\-[0-9K]$/)!=null;
}

//Returns true if the given RUT has the correct validator digit.
//This assumes the RUT is well-formed, and passes the isValidRutFormat check.
function isValidRutDigit(str){
	str=str.trim();
	let sum=0
	let digits=str.split("-")[0].match(/[0-9]/g);
	let vDigit=str.split("-")[1];
	for(var i=0;digits.length>0;i=(i+1)%6){
		currDigit=digits.pop();
		sum+=currDigit*(i+2);
	}
	let aux = 11*Math.floor(sum/11);
	let calcDigit = 11-(sum-aux);
	if(calcDigit==10)calcDigit="K";
	if(calcDigit==11)calcDigit=0;
	return calcDigit.toString()==vDigit;
}

//Returns true if the given string is a well-formed e-mail address
//That is, it is a string, followed by "@", followed by another string.
function isValidEmail(str){
	return str.trim().match(/.+@.+/)!=null;
}

//Returns true is the given string has at least one letter.
//Normallt used on fields that correspond to a name.
function isValidName(str){
	return str.trim().match(/[a-zA-Z]/)!=null;
}

//Returns true if the given string is a valid phone number.
//That is, it is a series of digits that might be preceded by a single "+"
function isValidPhone(str){
	return str.trim().match(/^\+?[0-9]+$/)!=null;
}

//	If the <div> element that contains the feedback for the invalid input doesn't exist, create it
//	To be detected, the <div>'s id must be the id of the input + "_validationFeedback";
function prepareValidation(e){
	fElem=document.createElement("div")
	fElem.id=e.id+"_validationFeedback";
	fElem.classList.add("invalid-feedback");
	e.parentElement.appendChild(fElem)
	return fElem;
}

//	For form validation, sets the given input element as "valid"
function makeValid(e){
	var fElem=get(e.id+"_validationFeedback");
	if(fElem==null) fElem=prepareValidation(e);
	e.classList.remove("is-invalid");
	fElem.style.display="none";
	fElem.innerHTML="";
}

//	For form validation, sets the given input element as "invalid"
function makeInvalid(e,msg){
	var fElem=get(e.id+"_validationFeedback");
	if(fElem==null) fElem=prepareValidation(e);
	e.classList.add("is-invalid");
	fElem.style.display="block";
	fElem.innerHTML+="<div class='validationFeedback'>"+msg+"</div>";
}

function spawnAlert(msg){
	console.log(msg)
}

function validateSignup(ev){
	let valid=true;
	
	let name=get("f_name"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido."); valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}
	
	let surname=get("f_surname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido."); valid=false;}
	else if(!isValidName(surname.value)){makeInvalid(surname,"Apellido inválido (Use letras y caracteres latinos).");valid=false;}
	
	let rut=get("f_rut"); makeValid(rut)
	if(rut.value.trim()==""){makeInvalid(rut,"RUT requerido."); valid=false;}
	else if(!isValidRutFormat(rut.value)){makeInvalid(rut,"Formato incorrecto (Ingrese con puntos y guión)."); valid=false;}
	else if(!isValidRutDigit(rut.value)){makeInvalid(rut,"RUT inválido.");valid=false;}

	let user=get("f_user"); makeValid(user)
	if(user.value.trim()==""){makeInvalid(user,"Correo requerido."); valid=false;}
	else if(!isValidEmail(user.value)){makeInvalid(user,"Correo inválido."); valid=false;}

	let phone=get("f_phone"); makeValid(phone)
	if(phone.value.trim()!="" && !isValidPhone(phone.value)){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	let pass=get("f_pass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	else {
		if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
		if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
		if(pass.value.trim().match(/[0-9]/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
		if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
		if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}
	}

	let passConfirm=get("f_passConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no coincidcen.");valid=false;}
	
	let addressStreet=get("f_addressStreet"); makeValid(addressStreet)
	if(addressStreet.value.trim()==""){makeInvalid(addressStreet,"Calle requerida.");valid=false;}
	else if(!isValidName(addressStreet.value)){makeInvalid(addressStreet,"Calle inválida (Use letras y caracteres latinos).");valid=false;}
	
	let addressNumber=get("f_addressNumber"); makeValid(addressNumber)
	if(addressNumber.value.trim()==""){makeInvalid(addressNumber,"Número requerido.");valid=false;}
	
	let answer=get("f_answer"); makeValid(answer)
	if(answer.value.trim()==""){makeInvalid(answer,"Responda la pregunta de seguridad.");valid=false;}

	if(!valid) ev.preventDefault();
}

function validateCheckoutItemCount(e){
	makeValid(e);
	if(e.value<1) makeInvalid(e,"La cantidad de items no puede ser menor a 1");
}

function validateAddToCart(e){
	makeValid(e);
	if(e.value<1) makeInvalid(e,"La cantidad de items no puede ser menor a 1");
}

function validateCheckout(ev){
	makeValid(get("cartSubmitButton"));
	let qttyInputs=document.getElementsByClassName("cartItemQtty");
	let valid = true;
	for(qttyInput of qttyInputs){
		if(qttyInput.value<1){
			valid=false;
		}
	}
	if(!valid){
		makeInvalid(get("cartSubmitButton"),"Su carrito incluye una cantidad inválida de productos.");
		ev.preventDefault();
	}
}

function validateAddressModalForm(ev){
	let valid=true;

	let street=get("addressFormStreet"); makeValid(street);
	if(street.value.trim()==""){makeInvalid(street,"Calle requerida.");valid=false;}
	else if(!isValidName(street.value)){makeInvalid(street,"Calle inválida (Use letras y caracteres latinos).");valid=false;}

	let number=get("addressFormNumber"); makeValid(number);
	if(number.value.trim()==""){makeInvalid(number,"Número requerido.");valid=false;}
	else if(number.value.trim().match(/^[a-zA-Z0-9]+$/)==null){makeInvalid(number,"Número inválido (Use sólo números y/o letras).");valid=false;}

	let postalCode=get("addressFormPostalCode"); makeValid(postalCode);
	if(postalCode.value.trim()==""){makeInvalid(postalCode,"Código postal requerido.");valid=false;}
	else if(postalCode.value.trim().match(/^[a-zA-Z0-9]+$/)==null){makeInvalid(postalCode,"Código postal inválido (Use sólo números y/o letras).");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminAccountForm(ev){
	let valid=true;

	let name = get("adminName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}

	let surname = get("adminSurname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido.");valid=false;}
	else if(!isValidName(surname.value)){makeInvalid(surname,"Apellido inválido (Use letras y caracteres latinos).");valid=false;}

	let phone = get("adminPhone"); makeValid(phone);
	if(phone.value.trim()==""){makeInvalid(phone,"Teléfono requerido.");valid=false;}
	else if(!isValidPhone(phone.value)){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminPasswordForm(ev){
	let valid=true;
	
	let pass=get("adminPass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	else {
		if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
		if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
		if(pass.value.trim().match(/[0-9]/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
		if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
		if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}
	}

	let passConfirm=get("adminPassConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no coinciden.");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminSecQuestionForm(ev){
	let valid=true;
	
	let answer=get("adminSecAnswer"); makeValid(answer)
	if(answer.value.trim()==""){makeInvalid(answer,"Responda la pregunta de seguridad.");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminDataForm(ev){
	let valid = true;

	let name = get("adminFormNewName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}

	let surname = get("adminFormNewSurname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido.");valid=false;}
	else if(!isValidName(surname.value)){makeInvalid(surname,"Apellido inválido (Use letras y caracteres latinos).");valid=false;}

	let rut = get("adminFormNewRUT"); makeValid(rut);
	if(rut.value.trim()==""){makeInvalid(rut,"RUT requerido."); valid=false;}
	else if(!isValidRutFormat(rut.value)){makeInvalid(rut,"Formato incorrecto (Ingrese con puntos y guión)."); valid=false;}
	else if(!isValidRutDigit(rut.value)){makeInvalid(rut,"RUT inválido.");valid=false;}

	let mail = get("adminFormNewMail"); makeValid(mail);
	if(mail.value.trim()==""){makeInvalid(mail,"Correo requerido."); valid=false;}
	else if(!isValidEmail(mail.value)){makeInvalid(mail,"Correo inválido."); valid=false;}
	
	let phone = get("adminFormNewPhone"); makeValid(phone);
	if(phone.value.trim()==""){makeInvalid(phone,"Teléfono requerido.");valid=false;}
	else if(!isValidPhone(phone.value)){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	if(!valid) ev.preventDefault();
}

function validateProductModal(ev){
	let valid = true;
	
	let image = get("productFormImage"); makeValid(image);
	let imagePreview = get("productFormImagePreview");
	if(imagePreview.getAttribute("src")==""){
		if(image.value.trim()==""){makeInvalid(image,"Imagen requerida."); valid=false;}
		else if(imageExt.indexOf(image.value.trim().split(".").slice(-1)[0])==-1){makeInvalid(image,"Formato de imagen no reconocido.");valid=false;}
	}
	
	let name = get("productFormName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}
	
	let price = get("productFormPrice"); makeValid(price);
	if(price.value.trim()==""){makeInvalid(price,"Precio requerido.");valid=false}
	else if(price.value.trim().match(/[0-9]+/)==null){makeInvalid("Introduzca un número entero (sin decimales).");valid=false;}
	else if(parseInt(price.value)<1){makeInvalid(price,"Precio debe ser mayor a 0.");valid=false;}
		
	let stock = get("productFormStock"); makeValid(stock);
	if(stock.value.trim()==""){makeInvalid(stock,"Stock requerido.");valid=false}
	else if(stock.value.trim().match(/[0-9]+/)==null){makeInvalid("Introduzca un número entero (sin decimales).");valid=false;}
	else if(parseInt(stock.value)<0){makeInvalid(stock,"Stock debe ser mayor o igual a 0.");valid=false;}
	
	let category = get("productFormCategory"); makeValid(category);
	if(category.value.trim()==""){makeInvalid(category,"Seleccione una categoría.");valid=false;}
	
	let desc = get("productFormDescription"); makeValid(desc);
	if(desc.value.trim()==""){makeInvalid(desc,"Descripción requerida.");valid=false;}
	
	if(!valid) ev.preventDefault();
}

function validateClientAccountForm(ev){
	let valid=true;

	let name = get("clientName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}

	let surname = get("clientSurname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido.");valid=false;}
	else if(!isValidName(surname.value)){makeInvalid(surname,"Apellido inválido (Use letras y caracteres latinos).");valid=false;}

	let mail = get("clientMail"); makeValid(mail);
	if(mail.value.trim()==""){makeInvalid(mail,"Correo requerido."); valid=false;}
	else if(!isValidEmail(mail.value)){makeInvalid(mail,"Correo inválido."); valid=false;}
	
	let phone = get("clientPhone"); makeValid(phone);
	if(phone.value.trim()==""){makeInvalid(phone,"Teléfono requerido.");valid=false;}
	else if(!isValidPhone(phone.value)){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateClientPasswordForm(ev){
	let valid=true;
	
	let pass=get("clientPass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	else {
		if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
		if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
		if(pass.value.trim().match(/[0-9]/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
		if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
		if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}
	}

	let passConfirm=get("clientPassConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no coinciden.");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateClientSecQuestionForm(ev){
	let valid=true;
	
	let answer=get("clientSecAnswer"); makeValid(answer)
	if(answer.value.trim()==""){makeInvalid(answer,"Responda la pregunta de seguridad.");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateCategoryForm(ev){
	let valid = true;
	
	let name = get("categoryFormName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(!isValidName(name.value)){makeInvalid(name,"Nombre inválido (Use letras y caracteres latinos).");valid=false;}
	
	if(!valid) ev.preventDefault();
}