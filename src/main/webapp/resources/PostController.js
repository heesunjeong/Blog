function callAjax(_type, _url, _data) {
	var res = null;
	jQuery.ajax({
		type : _type,
		url : _url,
		data : _data,
		async : false,
		cache : false,
		dataType : 'json',
		contentType : "application/json; charset=utf-8",
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

function postLinkViewList(category, pageNum) {
	postLink(category, pageNum);
	viewList(category, pageNum);
}

function postMaxId(category) {
	var maxPostId = callAjax("get", "./board/selectByPostMaxId", {
		category : category
	});
	return maxPostId;
}

function postLink(category, pageNum) {
	var maxPostId = postMaxId(category);
	postLinkUrl(category, maxPostId, pageNum);
}

// 글목록에서 글 클릭 시 해당 포스트 보여줌
function postLinkUrl(category, id, pageNum) {
	$("#write-post-view").hide()
	$('#postBlog').show();
	
	if(typeof id != 'number') {
		id = id.substring(1);
	}
	
	var url = "/blog/board/selectPost";
	var data = {
		id : id,
		category : category
	}
	
	var result = callAjax("GET", url, data);
	var panel = $("#current-post")

	if (result.id != null) {
		var contentTable = "<table><tr id='postTitle'></tr><tr id='postDate'></tr><tr id='postContent'></tr></table>";

		panel.html(contentTable);

		$("#postTitle").html(result.post_title);
		$("#postDate").html("posted at " + result.post_create_date);
		$("#postContent").html(result.post_content);

		/*
		 * postCommentArea(id); viewCommentList(id, 1);
		 */
		viewList(category, pageNum)

	} else {
		panel.html("현재 카테고리에 작성된 글이 없습니다.");
	}
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
	list += "Post List<br>"
	list += "<table> <tr>";

	if (result == null || result == "") {
		list += "<tr><td>아직 글이 없습니다.</td></tr>"

	} else {
		list += "<td id='postTitleTd'><b>글제목</b></td> <td><b>작성시간 </b></td></tr>";
		for (var i = 0; i < result.length; i++) {
			list += "<tr><td align='left'>";
			// id 문자열일때 에러
			list += "<a href='#' id='"+ result[i].id +"' onclick='return postLinkUrl(" + category + ", this.id);'>";
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

function writePost() {
	var categoryId = $("#category").val();
	var post_title = $("#post_title").val();
	var post_content = $("#post_content").val();
	var url = "/blog/board/insertPost";

	var data = {
		category : categoryId,
		post_title : post_title,
		post_content : post_content
	};

	if (post_title == "" || post_content == "") {
		alert("빈칸없이 입력해주세요.")
	} else {
		var result = callAjax("GET", url, data);
		postLinkViewList(categoryId, 0);
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

// 포스트 페이징 처리
function pagingNumber(category) {
	var url = "/blog/board/pagingNumber";
	var data = {
		category : category
	};

	var pageNumStr = "";

	var result = callAjax("GET", url, data);
	pageNumStr += "<table><tr>";
	for (i = 1; i < result + 1; i++) {
		pageNumStr += "<td class='pageNumbers' name='" + i + "'>" + i + "</td>";
	}
	pageNumStr += "</table>";

	$("#PostListPaging").html(pageNumStr);

	$(".pageNumbers").click(function() {
		var pageId = $(this).attr("name");
		postLinkViewList(category, pageId - 1);
	})
}

// 버튼에 대한 Evnethandler
function addEventHandelr() {
	$("#writeButton").click(function() {
		$('#postBlog').hide();
		$('#write-post-view').show();
		
		// hidden영역으로 현재 카테고리저장 후 글쓰기 버튼 클릭시 현재 카테고리 select의 value로 넘기기
		// 글쓰기 눌렀을 때 아무것도 없는 페이지만들기
	});

	$("#writePostBtn").click(function() {
		writePost();
	});
}

$(document).ready(function() {
	postLinkViewList(1, 0);
	addEventHandelr();
})