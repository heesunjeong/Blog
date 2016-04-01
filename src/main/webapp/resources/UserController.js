var joinIsNull = true;
var userSession = null;

function callAjax(_url, _data) {
	var res = null;
	jQuery.ajax({
		type : "GET",
		url : _url,
		data : _data,
		async : false,
		cache : false,
		dataType : 'json',
		success : function(data) {
			res = data;
		},
		error : function(request, status, error) {
			res = {
				result : 'error'
			}
		}
	})
	return res;
}


function addEventHandler() {
	checkId();
	checkName();
	checkPwdLength();
	checkPwdReinsert();
	checkEmail();
}

$(document).ready(function() {
	addEventHandler()
})

/*
 * $(document).ready(function() { $("#user_id").focusout(function() {
 * jQuery.ajax({ type : "GET", url : "/blog/user/idCheck", data : { "user_id" :
 * $("#user_id").val() }, success : function(data) { var getId =
 * $("#user_id").val(); var getIdLength = getId.length; var Regexp =
 * /^[a-z][a-z0-9]*$/g;
 * 
 * console.log(data);
 * 
 * if (Regexp.test(getId)) { if (data) { $("#idCheckAlert").html("사용할 수 없는
 * ID입니다."); $("#user_id").val(""); } else { if ((getIdLength < 5) ||
 * (getIdLength > 20)) { $("#idCheckAlert").html("사용할 수 없는 ID입니다.");
 * $("#user_id").val(""); } else { $("#idCheckAlert").html("사용가능한 ID입니다.");
 * joinIsNull = false; } } } else { $("#idCheckAlert").html("사용할 수 없는 ID입니다.");
 * $("#user_id").val(""); } }, error : function(request, status, error) {
 * alert("code:" + request.status + "\n" + "error:" + error); } }) }); });
 */

function checkId() {
	$("#joinForm #user_id").focusout(function() {
		var id = $("#user_id");
		var idVal = id.val();
		var url = "/blog/user/idCheck";
		var data = {
			user_id : idVal
		};
		var result = callAjax(url, data);
		if (result.result == 'error') {
			alert("에러났어 관리자한테 문의");
		}
		console.log(result.result);
		var checkAlert = $("#idCheckAlert");

		var Regexp = /^[a-z][a-z0-9]*$/g;

		if (Regexp.test(idVal)) {
			if (result.result) {
				checkAlert.html("사용할 수 없는 ID입니다.");
				id.val("");
			} else {
				if ((idVal.length < 5) || (idVal.length > 20)) {
					checkAlert.html("사용할 수 없는 ID입니다.");
					id.val("");
				} else {
					checkAlert.html("사용가능한 ID입니다.");
					joinIsNull = false;
				}
			}
		} else {
			checkAlert.html("사용할 수 없는 ID입니다.");
			id.val("");
		}
	});
}

function checkName() {
	$("#joinForm #name").focusout(function() {
		var getName = $("#name").val();
		var Regexp = /^[\uac00-\ud7a3]*$/g;
		var nameResult = Regexp.test(getName);

		if (!nameResult) {
			$("#nameCheckAlert").html("이름을 다시 입력해주세요.");
			$("#name").val("");
		} else {
			$("#nameCheckAlert").html("");
			joinIsNull = false;
		}
	})
}

function checkPwdLength() {
	$("#joinForm #password").focusout(function() {
		var pwdLength = $("#password").val().length;
	})
}

function checkEmail() {
	$("#email").click(function() {
		$("#email").val("");
	})

	$("#email")
			.focusout(
					function() {
						var getEmail = $("#email").val();
						var Regexp = /^[0-9A-Z]([-_\.]?[0-9A-Z])*@[0-9A-Z]([-_\.]?[0-9A-Z])*\.[A-Z]{2,6}$/i;
						if (!Regexp.test(getEmail)) {
							$("#email").val("");
						}
					})
}

function checkPwdReinsert() {
	$("#joinForm #repassword").focusout(function() {
		var pwdval = $("#password").val();
		var repwdval = $("#repassword").val();
		if (!(pwdval == repwdval)) {
			$("#pwdCheckAlert").html("비밀번호를 다시 입력해주세요.");
			$("#password").val("");
			$("#repassword").val("");
		} else {
			joinIsNull = false;
		}
	})
}

function joinUser() {
	if (!joinIsNull) {
		jQuery.ajax({
			type : "POST",
			url : "/blog/user/joinUser",
			data : {
				"user_id" : $("#user_id").val(),
				"name" : $("#name").val(),
				"password" : $("#password").val(),
				"email" : $("#email").val(),
				"birth" : $("#birth").val()
			},
			success : function(data) {
					alert("회원가입되셨습니다.");
					self.location = '/';
			},
			error : function(request, status, error) {
				alert("code:" + request.status + "\n" + "error:" + error);
			}
		})
	}

	else {
		alert("빈칸이 없이 채워주세요.");
	}
}

function joinCancel() {
	window.history.back();
}
