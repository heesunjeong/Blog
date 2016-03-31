/**
 * Author : Heesun Jeong
 * 
 * Description :
 * 1. 함수 정보
 * callAjax(type, url, data): jQuery.ajax호출 함수
 * postLinkViewList(category, pageNum)
 * postMaxId(any) : 
 * postLink(any, any) : 
 * postLinkUrl() : 포스트 목록에서 포스트 클릭 시 해당 포스트 불러오는 함수
 * wiewList() : 포스트 목록 불러오는 함수
 * wirtePost(): 새로운 포스트 작성 함수
 * editPost() : 포스트 수정 함수
 * loadFirstPost() : 선택 카테고리의 가장 최신 포스트를 불러오는 함수
 * pagingNumber(category) : 포스트목록의 페이지 넘버 함수
 * changeEditorMode(category) : 블로그 포스트와 에디터를 교차로 보여주는 함수
 * deletePost(id, category) : 포스트 삭제 함수. category 매개변수 추후에 삭제
 * addEventHandler() : event를 추가해주는 handler
 * idToBid() : post_id를 bid로 변경해주는 함수 (예: P1 -> 1)
 */

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
	$("#postInfo").attr("data-id", result.id);
	$("#postInfo").attr("data-category", category);
	
	var panel = $("#current-post")
	if (result.id != null) {
		var contentTable = "<table><tr id='postTitle'></tr>" 
			+ "<tr><td id='postDate' /> <td id='postToolbar' /> </tr>" 
			+ "<td id='postContent' /></table>";

		panel.html(contentTable);

		$("#postTitle").html(result.post_title);
		$("#postDate").html("posted at " + result.post_create_date);
		$("#postToolbar").html(
				"<span class='ui-icon ui-icon-wrench edit-post-btn' data-id='" + result.id + "' /> " +
						"<span class='ui-icon ui-icon-trash delete-post-btn' data-id='" + result.id + "' /> ")
		$("#postContent").html(result.post_content);

		$(".edit-post-btn").click(function() {
			changeEditorMode(this.getAttribute("data-id"));
		})
		
		$(".delete-post-btn").click(function() {
			deletePost(this.getAttribute('data-id'), 1);
		})
		
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
			// Attribute네임 id -> data-XXX로 수정
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
	
	var id = postMaxId(categoryId);

	var data = {
		id : id+1,
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

function editPost() {
	var data = {
			id : $(".edit-post-btn").attr("data-id"),
			category : $("#category").val(),
			post_title : $("#post_title").val(),
			post_content : $("#post_content").val()
		};
	
	var url = "./board/updatePost";
	callAjax("GET", url, data);
	
	postLinkViewList(data.category, 0);
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
	for (var i = 1; i < result + 1; i++) {
		pageNumStr += "<td class='pageNumbers' name='" + i + "'>" + i + "</td>";
	}
	pageNumStr += "</table>";

	$("#PostListPaging").html(pageNumStr);

	$(".pageNumbers").click(function() {
		var pageId = $(this).attr("name");
		postLinkViewList(category, pageId - 1);
	})
}

function changeEditorMode(id) {
	$('#postBlog').hide();
	$('#write-post-view').show();
	
	if(id === 'new') {
		$("#category").val($("#postInfo").attr("data-category"));
		$("#post_title").val('');
		$("#post_content").val('');
		
		$("#writePostBtn").show();
		$("#editPostBtn").hide();
		
	} else {
		var result = callAjax("GET", "./board/selectPost", {
			id : idToBid(id)
		})
		
		$("#category").val(result.category);
		$("#post_title").val(result.post_title);
		$("#post_content").val(result.post_content);
		
		$("#writePostBtn").hide();
		$("#editPostBtn").show();
	}
}

//블로그 글 삭제버튼 눌렀을 때 confirm 확인 후 삭제
function deletePost(id, category) {
	var url = "./board/deletePost";
	var data = {
		id : idToBid(id)
	};
	if (confirm("정말로 삭제하시겠습니까?")) {
		callAjax("GET", url, data);
		
		url = "./board/selectCategoryById";
		var res = callAjax("GET", url, data);
		postLinkViewList(res, 0);
		return;
	} else {
		return;
	}
}

// 버튼에 대한 Evnethandler
function addEventHandelr() {
	$("#writeButton").click(function() {
		changeEditorMode(this.getAttribute("data-mode"));
	});

	$("#writePostBtn").click(function() {
		writePost();
	});
	
	$("#editPostBtn").click(function() {
		editPost();
	})
}

function idToBid(id) {
	if(typeof id != 'number') {
		id = id.substring(1);
	}
	
	return id;
}

$(document).ready(function() {
	postLinkViewList(1, 0);
	addEventHandelr();
})