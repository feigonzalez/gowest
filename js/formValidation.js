
/*
	Form validation
	<input>s in forms can be validated, depending on their input.
	After processing an <input>, call makeValid(e) or makeInvalid(e)
	on it to display it as valid or invalid, respectively.
*/

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

function validateRut(rut){
	return true;
}

function validateSignup(ev){
	let valid=true;
	
	let name=get("f_name"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido."); valid=false;}
	if(name.value.trim().match(/\w/)==null){makeInvalid(name,"Nombre inválido (Use caracteres latinos).");valid=false;}
	
	let surname=get("f_surname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido."); valid=false;}
	if(surname.value.trim().match(/\w/)==null){makeInvalid(surname,"Apellido inválido (Use caracteres latinos).");valid=false;}
	
	let rut=get("f_rut"); makeValid(rut)
	if(rut.value.trim()==""){makeInvalid(rut,"RUT requerido."); valid=false;}
	else if(rut.value.trim().match(/^\d{1,3}(\.\d\d\d)*\-[0-9K]$/)==null){makeInvalid(rut,"Formato incorrecto (Ingrese con puntos y guión)."); valid=false;}
	else if(!validateRut(rut.value.trim())){makeInvalid("RUT inválido.");valid=false;}

	let user=get("f_user"); makeValid(user)
	if(user.value.trim()==""){makeInvalid(user,"Correo requerido."); valid=false;}
	else if(user.value.trim().match(/.*@.*/)==null){makeInvalid(user,"Correo inválido."); valid=false;}

	let phone=get("f_phone"); makeValid(phone)
	if(phone.value.trim()!="" && phone.value.trim().match(/\+?\d+/)==null){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	let pass=get("f_pass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	else {
		if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
		if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
		if(pass.value.trim().match(/\d/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
		if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
		if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}
	}

	let passConfirm=get("f_passConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no coincidcen.");valid=false;}
	
	let addressStreet=get("f_addressStreet"); makeValid(addressStreet)
	if(addressStreet.value.trim()==""){makeInvalid(addressStreet,"Calle requerida.");valid=false;}
	if(addressStreet.value.trim().match(/\w/)==null){makeInvalid(addressStreet,"Calle inválida (Use caracteres latinos).");valid=false;}
	
	let addressNumber=get("f_addressNumber"); makeValid(addressNumber)
	if(addressNumber.value.trim()==""){makeInvalid(addressNumber,"Número requerido.");valid=false;}
	
	let answer=get("f_answer"); makeValid(answer)
	if(answer.value.trim()==""){makeInvalid(answer,"Responda la pregunta de seguridad.");valid=false;}

	if(!valid) ev.preventDefault();
}

function validateCheckoutItemCount(e){
	if(e.value<1) makeInvalid(e,"La cantidad de items no puede ser menor a 1");
	else makeValid(e);
}

function validateAddToCart(e){
	if(e.value<1) makeInvalid(e,"La cantidad de items no puede ser menor a 1");
	else makeValid(e);
}

function validateCheckout(ev){
	let qttyInputs=document.getElementsByClassName("cartItemQtty");
	let valid = true;
	for(qttyInput of qttyInputs){
		if(qttyInput.value<1){
			spawnAlert("La cantidad de items no puede ser menor a 1");
			valid=false;
		}
	}
	if(!valid) ev.preventDefault();
}

function validateAddressModalForm(ev){
	let valid=true;

	let street=get("addressFormStreet"); makeValid(street);
	if(street.value.trim()==""){makeInvalid(street,"Calle requerida.");valid=false;}
	else if(street.value.trim().match(/\w/)==null){makeInvalid(street,"Calle inválida (Use caracteres latinos).");valid=false;}

	let number=get("addressFormNumber"); makeValid(number);
	if(number.value.trim()==""){makeInvalid(number,"Número requerido.");valid=false;}
	else if(number.value.trim().match(/[\w\d]/)==null){makeInvalid(number,"Número inválido (Use sólo números y/o letras).");valid=false;}

	let postalCode=get("addressFormPostalCode"); makeValid(postalCode);
	if(postalCode.value.trim()==""){makeInvalid(postalCode,"Código postal requerido.");valid=false;}
	else if(postalCode.value.trim().match(/[\w\d]/)==null){makeInvalid(postalCode,"Código postal inválido (Use sólo números y/o letras).");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminAccountForm(ev){
	let valid=true;

	let name = get("adminName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(name.value.trim().match(/\w/)==null){makeInvalid(name,"Nombre inválido (Use caracteres latinos).");valid=false;}

	let surname = get("adminSurname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido.");valid=false;}
	else if(surname.value.trim().match(/\w/)==null){makeInvalid(surname,"Apellido inválido (Use caracteres latinos).");valid=false;}

	let phone = get("adminPhone"); makeValid(phone);
	if(phone.value.trim()==""){makeInvalid(phone,"Teléfono requerido.");valid=false;}
	else if(phone.value.trim().match(/\+?\d+/)==null){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminSecurityForm(ev){
	let valid=true;
	
	let pass=get("adminPass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	else {
		if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
		if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
		if(pass.value.trim().match(/\d/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
		if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
		if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}
	}

	let passConfirm=get("adminPassConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no coinciden.");valid=false;}
	
	let answer=get("adminSecAnswer"); makeValid(answer)
	if(answer.value.trim()==""){makeInvalid(answer,"Responda la pregunta de seguridad.");valid=false;}

	if(!valid) ev.preventDefault()
}

function validateAdminDataForm(ev){
	let valid = true;

	let name = get("adminFormNewName"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido.");valid=false;}
	else if(name.value.trim().match(/\w/)==null){makeInvalid(name,"Nombre inválido (Use caracteres latinos).");valid=false;}

	let surname = get("adminFormNewSurname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido.");valid=false;}
	else if(surname.value.trim().match(/\w/)==null){makeInvalid(surname,"Apellido inválido (Use caracteres latinos).");valid=false;}

	let rut = get("adminFormNewRUT"); makeValid(rut);
	if(rut.value.trim()==""){makeInvalid(rut,"RUT requerido."); valid=false;}
	else if(rut.value.trim().match(/^\d{1,3}(\.\d\d\d)*\-[0-9K]$/)==null){makeInvalid(rut,"Formato incorrecto (Ingrese con puntos y guión)."); valid=false;}
	else if(!validateRut(rut.value.trim())){makeInvalid("RUT inválido.");valid=false;}

	let mail = get("adminFormNewMail"); makeValid(mail);
	let phone = get("adminFormNewPhone"); makeValid(phone);

	if(!valid) ev.preventDefault();
}