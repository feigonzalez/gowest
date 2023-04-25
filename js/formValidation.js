
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

function validateSignup(ev){
	let valid=true;
	
	let name=get("f_name"); makeValid(name);
	if(name.value.trim()==""){makeInvalid(name,"Nombre requerido."); valid=false;}
	
	let surname=get("f_surname"); makeValid(surname);
	if(surname.value.trim()==""){makeInvalid(surname,"Apellido requerido."); valid=false;}
	
	let rut=get("f_rut"); makeValid(rut)
	if(rut.value.trim()==""){makeInvalid(rut,"RUT requerido."); valid=false;}
	else if(rut.value.trim().match(/^\d{1,3}(\.\d\d\d)*\-[0-9K]$/)==null){makeInvalid(rut,"Formato incorrecto (Ingrese con puntos y guión)."); valid=false;}

	let user=get("f_user"); makeValid(user)
	if(user.value.trim()==""){makeInvalid(user,"Correo requerido."); valid=false;}
	else if(user.value.trim().match(/.*@.*/)==null){makeInvalid(user,"Correo inválido."); valid=false;}

	let phone=get("f_phone"); makeValid(phone)
	if(phone.value.trim()!="" && phone.value.trim().match(/\+?\d+/)==null){makeInvalid(phone,"Formato incorrecto (Use sólo dígitos numéricos. Se permite \"+\" al inicio).");valid=false;}

	let pass=get("f_pass"); makeValid(pass)
	if(pass.value.trim()==""){makeInvalid(pass,"Contraseña requerida"); valid=false;}
	if(pass.value.trim().length<8){makeInvalid(pass,"Contraseña demasiado pequeña.");valid=false}
	if(pass.value.trim().length>40){makeInvalid(pass,"Contraseña demasiado larga.");valid=false}
	if(pass.value.trim().match(/\d/)==null){makeInvalid(pass,"Incluya un dígito numérico.");valid=false}
	if(pass.value.trim().match(/[!#@$%&]/)==null){makeInvalid(pass,"Incluya un caracter especial.");valid=false}
	if(pass.value.trim().match(/[A-Z]/)==null){makeInvalid(pass,"Incluya una letra mayúscula.");valid=false}

	let passConfirm=get("f_passConfirm"); makeValid(passConfirm)
	if(passConfirm.value.trim()==""){makeInvalid(passConfirm,"Debe volver a escribir su contraseña.");valid=false;}
	else if(passConfirm.value!=pass.value){makeInvalid(passConfirm,"La contraseñas no concuerdan.");valid=false;}
	
	let addressStreet=get("f_addressStreet"); makeValid(addressStreet)
	if(addressStreet.value.trim()==""){makeInvalid(addressStreet,"Calle requerida.");valid=false;}
	
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