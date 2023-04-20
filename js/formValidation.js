
/*
	Form validation
*/
function validateForm(e,ev){
	ev.preventDefault();
	switch (e.id){
		case "signupForm":
			var pass=get("f_pass").value;
			var passConfirm=get("f_passConfirm").value;
			if(pass!=passConfirm){
				console.log("pass bad")
				return false;
			}
			break;
		default:break;
	}
	e.submit();
}

function spawnAlert(msg){
	console.log(msg)
}

function validateCheckout(ev){
	let qttyInputs=document.getElementsByClassName("cartItemQtty");
	let qttyTotal = 0;
	let valid = true;
	for(qttyInput of qttyInputs){
		qttyTotal+=qttyInput.value;
		if(qttyInput.value<1){
			spawnAlert("La cantidad de items no puede ser menor a 1");
			valid=false;
		}
	}
	if(qttyTotal<1){
		spawnAlert("El total de items no puede ser menor a 1");
		valid=false;
	}
	if(!valid) ev.preventDefault();
}