/**
 * 
 */

function viewCommentList(id, pageNum) {
	var url = "./board/selectCommentList";
	var data = {
		board : id,
		pageNum : pageNum
	}
	var result = callAjax("GET", url, data);

	var commentList = $("#comment-view");
	var commentWrite = $("#comment-write");
	
	var list = "<h3>Comments</h3><p>"
	
	if (result == null || result == "") {
		list += "아직 코멘트가 없습니다.";
	} else {
		list += 	"<table>";
		for (var i = 0; i < result.length; i++) {
			list += "<tr>" + "<td id='commentWriterArea_"
					+ result[i].id
					+ "' align='left' width='500px'>"
					+ viewCmtDepth(result[i].depth)
					+ result[i].name
					+ "</td>"
					+ "<td id='commentDateArea_"
					+ result[i].id
					+ "' align='left'>"
					+ result[i].comment_create_date
					+ "</td>"
					+ "<td id='commentControlArea_"
					+ result[i].id
					+ "'>"
					+ "<div class='cmtCtrlDiv' id='cmtCtrlArea_"
					+ result[i].id
					+ "'>" + makeControlArea(result) +"</div></td>"
					+ "</tr>"
					+ "<tr>"
					+ "<td id='commentContentArea_"
					+ result[i].id
					+ "' colspan='2' rowspan='1' align='left'><font color='white'>"
					+ viewCmtDepth(result[i].depth) + "</font>";
			if (result[i].delete_flag == 0) {
				list += result[i].comment_content;
			} else {
				list += "삭제된 댓글입니다.";
			}
			list += "</td>" + "</tr>"
		}
		list += "<tr>" +
					"<td colspan='3' rowspan='1'><div id='commentListPaging' align='center'></div></td>"+
				"</tr>"+
			"</table>";
	}
	
	var comment = '<textarea cols="50" rows="2" id="commentTextArea" maxlength="6000">'
			+ '</textarea><input type="button" id="insertCmtBtn" value="댓글작성" data-board="'+ id +'" />';
	commentWrite.html(comment);
	commentList.html(list);
	cmtPagingNumber(id);
}

function makeControlArea(result) {
	if(result[0].delete_flag === "0") {
		for(var i=0; i < result.length; i++){
			return html = "<table>" +
					"<tr> " +
					"<td><span class='ui-icon ui-icon-wrench cmt-edit-post-btn' data-id='" 
					+ result[i].id + "' /></td>" +
					"<td><span class='ui-icon ui-icon-trash cmt-delete-post-btn' data-id='" 
					+ result[i].id + "' /></td>" +
					"<td><span class='ui-icon ui-icon-comment cmt-reply-post-btn' data-id='" 
					+ result[i].id + "' /></td>" +
					"</tr></table>"
		}
	}
	return "";
}

function viewCmtDepth(data) {
	var depthViewer = "";
	if (data == 0) {
	} else {
		for (var i = 1 ; i <= data ; i++) {
			depthViewer += "└>";
		}
		
	}
	return depthViewer;
}

function btnCheck(name, result){
	for(i = 0 ; i < result.length ; i++){
		if( name == result[i].id ){
			var data = result[i];
			return data;
		}
	}
}

// 코멘트 작성
function writeComment(postId) {
	var commentContent = $("#commentTextArea");

	var url = "/blog/board/insertComment";

	var data = {
		comment_content : commentContent.val(),
		comment_parent : 0,
		user : 1,
		board : postId
	};
	if (commentContent.val() == null || commentContent.val() == "") {
		alert("내용을 입력해주세요!");
	} else {
		callAjax("GET", url, data);
		commentContent.val("");
		viewCommentList(postId);
	}
}

// 댓글의 댓글 작성
function updateCoComent(result) {
	new Ext.Panel({
		renderTo : 'commentContentArea_' + result.id,
		xtype : 'panel',
		hideBorders : true,
		items : [{
			xtype : 'textarea',
			id : 'coCmtArea'+result.id,
			hideBorders : true,
			value : result.commnet_content,
		},{
			xtype : 'panel',
			layout : 'vbox',
			hideBorders : true,
			buttons : [ {
				text : '작성',
				id : 'checkLoginButton',
				handler : function (){
					var url = "/blog/board/insertComment";
					var data = {
							comment_content : Ext.getCmp("coCmtArea"+result.id).getValue(),
							comment_parent : result.id,
							board : result.board,
							user : 1,
						}
					callAjax("GET", url, data);
					viewCommentList(result.board);
					}
				}, {
				text : '취소',
				handler : function() {
					
				}
			} ],
		}]
	})
	
}

// 코멘드 삭제
function deleteComment(cmtId) {
	var url = "./board/deleteCmt";
	var postId = $("#postInfo").attr("data-id");
	
	var data = {
		id : cmtId
	};
	if (confirm("Are you sure you want to do this?")) {
		callAjax("GET", url, data);
		viewCommentList(postId.substring(1));
		return;
	} else {
		return;
	}
}

// 코멘트 수정 버튼 클릭
function onUpdateCmt(cmtId) {
	var renderArea = $("#commentContentArea_"+cmtId);
	
	var editComment = '<textarea cols="50" rows="2" id="editCmtTextArea_' + cmtId + '" maxlength="6000">'
		+ '</textarea><input type="button" class="editCmtBtn" value="댓글수정" data-id="'+ cmtId +'" />';
	
	renderArea.html(editComment);
	
	$(".editCmtBtn"). click(function() {
		updateComment(this.getAttribute('data-id'));
	});
}

function updateComment(cmtId) {
	var url = "/blog/board/updateCmt";
	var data = {
		id : cmtId,
		comment_content : $("#editCmtTextArea_" + cmtId).val()
	}
	callAjax("GET", url, data);
	viewCommentList(dataBoard);
}

//코멘트 페이징처리
function cmtPagingNumber(id) {
	var url = "/blog/board/cmtPagingNumber";
	var data = {
		board : id
	};

	var pageNumStr = "";

	var result = callAjax("GET", url, data);
	
	if(result) {
		pageNumStr += "<table><tr>";
		for (i = 1; i < result + 1; i++) {
			pageNumStr += "<td class='cmtPageNumbers' name='" + i + "'>" + i + "</td>";
		}
		pageNumStr += "</table>";

		$("#commentListPaging").html(pageNumStr);

		$(".cmtPageNumbers").click(function() {
			var pageId = $(this).attr("name");
			viewCommentList(id, pageId - 1);
		})
	}
}

function addCmtEventHandler() {
	$("#insertCmtBtn").click(function() {
		writeComment(this.getAttribute('data-board'));
	});
	
	$(".cmt-edit-post-btn").click(function() {
		onUpdateCmt(this.getAttribute('data-id'));
	});
	
	$(".cmt-delete-post-btn").click(function() {
		deleteComment(this.getAttribute('data-id'));
	});
	
	$(".cmt-reply-post-btn").click(function() {
		updateCoComent(this.getAttribute('data-id'));
	});
}

$(document).ready(function() {
	addCmtEventHandler();
})