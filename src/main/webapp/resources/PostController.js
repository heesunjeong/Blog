function callAjax(_type, _url, _data) {
	var res = null;
	jQuery.ajax({
		type : _type,
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

function viewList(category, pageNum) {
	if (pageNum == null || pageNum == "undefined") {
		var pageNum = 0;
	}

	var url = "./board/viewList";
	var data = {
		category : category,
		pageNum : pageNum
	}

	var result = callAjax("GET", url, data);
	var postList = $("#post-list");

	var list = "";
	list += "<h3>Post List</h3><p>"
	list += "<table> <tr>";

	if (result == null || result == "") {
		list += "<tr><td>아직 글이 없습니다.</td></tr>"

	} else {
		list += "<td id='postTitleTd'><b>글제목</b></td> <td><b>작성시간 </b></td></tr>";
		for (var i = 0; i < result.length; i++) {
			list += "<tr><td align='left'>";
			list += "<a href='javascript:postLinkUrl(" + category + ", "
					+ result[i].id + ")'>";
			list += "- " + result[i].post_title
					+ "</a></td> <td id='viewListDate'>";
			list += result[i].post_create_date + "</td></tr>";
		}
		list += "<tr><td colspan='2' rowspan='1'><div id='PostListPaging' align='center'></div></td></tr>";

	}
	list += "</table>";
	postList.html(list);
	pagingNumber(category);
}

function postLinkUrl(category, id, pageNum) {
	var url = "/blog/board/selectPost";
	var data = {
		id : id,
		category : category
	}
	var result = callAjax("GET", url, data);
}

function writePost() {
	var categoryId = $("#category").val();
	var post_title = $("#post_title").val();
	var post_content = $("#post_content").val();
	var url = "/blog/board/writePost";

	var data = {
		category : categoryId,
		post_title : post_title,
		post_content : post_content
	};

	if (post_title == "" || post_content == "") {
		alert("빈칸없이 입력해주세요.")
	} else {
		var result = callAjax("POST", url, data);
		self.location = '/blog';
	}
}

function loadFirstPost() {
	var url = "./board/firstPost";
	var categoryId = 1;
	var data = {
		category : categoryId
	}
	var result = callAjax("get", url, data);

	$('#current-post').load("./board/post"); // 비동기적으로 페이지 로드
}

// 버튼에 대한 Evnethandler
function addEventHandelr() {
	$("#writePostBtn").click(function() {
		alert("Aa");
	});
	
	$("#writeButton").click(function() {
		$('#mainContent').load("./board/writing");
	});
}

$(document).ready(function() {
	//$('#mainContent').load("./board/post"); // 비동기적으로 페이지 로드
	viewList(1);
	addEventHandelr();
})