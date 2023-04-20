
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