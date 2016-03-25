var joinIsNull = true;
var userSession = null;

function checkId() {
	//var id = Ext.getCmp("user_id").getValue();
	console.log(id);
	var url = "/blog/user/idCheck";
	var data = {
		user_id : id
	};

	// console.log(data);
	var result = callAjax("GET", url, data);

	if (result.result == 'error') {
		alert("에러");
	}
	console.log(result);

	var Regexp = /^[a-z][a-z0-9]*$/g;

	if (Regexp.test(id)) {
		if (!result) {
			Ext.Msg.alert("사용할 수 없는 ID입니다.");
		} else {
			if ((id.length < 5) || (id.length > 20)) {
				Ext.Msg.alert("사용할 수 없는 ID입니다.");
			} else {
				Ext.Msg.alert("사용가능한 ID입니다.");
				joinIsNull = false;
			}
		}
	} else {
		Ext.Msg.alert("사용할 수 없는 ID입니다.");
	}
}


function addEventHandelr() {
}

$(document).ready(function() {
	addEventHandelr()
})

function checkName() {
	var getName = Ext.getCmp("name").getValue();
	var Regexp = /^[\uac00-\ud7a3]*$/g;
	var nameResult = Regexp.test(getName);

	if (!nameResult) {
		Ext.Msg.alert("이름을 다시 입력해주세요.");
	} else {
		joinIsNull = false;
	}
}

$(document).ready(function() {
	$("#joinForm #password").focusout(function() {
		var pwdLength = $("#password").val().length;

	})
})

$(document)
		.ready(
				function() {
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
				})

function checkRePassword(){
	var pwdval = Ext.getCmp("password").getValue();
	var repwdval = Ext.getCmp("repassword").getValue();
	if (!(pwdval == repwdval)) {
		Ext.Msg.alert("비밀번호를 다시 입력해주세요.");
	} else {
		joinIsNull = false;
	}	
}

function joinUser() {

	if (!joinIsNull) {
		jQuery.ajax({
			type : "POST",
			url : "/blog/user/joinUser",
			data : {
				"user_id" : Ext.getCmp("user_id").getValue(),
				"name" : Ext.getCmp("name").getValue(),
				"password" : Ext.getCmp("password").getValue(),
				"email" : Ext.getCmp("email").getValue()
			},
			success : function(data) {
				{
					alert("회원가입되셨습니다.");
					self.location = '/';
				}
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

function loginUser() {
	jQuery.ajax({
		type : "GET",
		url : "/blog/loginUser",
		beforeSend : function(xmlHttpRequest) {
			xmlHttpRequest.setRequestHeader("AJAX", "true"); // ajax 호출을
																// header에 기록
		},
		data : {
			"user_id" : Ext.getCmp("user_id").getValue(),
			"password" : Ext.getCmp("user_password").getValue()
		},
		success : function(data) {
			{
				// console.log(getUserId);
				if (data == null || data == "") {
					Ext.Msg.alert("회원정보가 일치하지 않습니다. 다시 로그인해세요.");

				} else {
					Ext.Msg.alert("반갑습니다 :)");
					win.close();

				}

			}
		},
		error : function(request, status, error) {
			alert("code:" + request.status + "\n" + "error:" + error);
		}
	})
}

function joinCancel() {
	window.history.back();
}

function getList(joinIsNull) {
	jQuery.ajax({
		type : "GET",
		url : "./list",
		dataType : "json",
		success : function(data) {
			var list = data;
			var content = "";
			for (var i = 0; i < list.length; i++) {
				content += list[i].id + " ";
				content += list[i].user_id + " ";
				content += list[i].name + " ";
				content += list[i].password + " ";
				content += list[i].email + " ";
				content += list[i].birth + "<br>";
			}

			$("#viewList").html(content);
		},
		error : function(request, status, error) {
			alert("code:" + request.status + "\n" + "error:" + error);
		}
	});
}
