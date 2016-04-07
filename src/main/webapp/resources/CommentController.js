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
			list += "<tr>"+
				"<td id='commentWriterArea_" + result[i].id + "' align='left' width='500px'>"+ viewCmtDepth(result[i].depth) + result[i].name + "</td>" +
				"<td id='commentDateArea_"+ result[i].id + "' align='left'>" +result[i].comment_create_date +"</td>"+
				"<td id='commentControlArea_" + result[i].id + "'>" + "<div class='cmtCtrlDiv' id='cmtCtrlArea_"+ result[i].id +"'></div></td>"+
			"</tr>"+
			"<tr>" +
				"<td id='commentContentArea_" + result[i].id + "' colspan='2' rowspan='1' align='left'><font color='white'>" + viewCmtDepth(result[i].depth) + "</font>";
				if(result[i].delete_flag == 0 ){
					list += result[i].comment_content;
					}
				else{
					list += "삭제된 댓글입니다.";
				}
				list += "</td>"+
			"</tr>"
		}
		list += "<tr>" +
					"<td colspan='3' rowspan='1'><div id='commentListPaging' align='center'></div></td>"+
				"</tr>"+
			"</table>";
		
		commentList.update(list);
		cmtPagingNumber(id);
		
		for(var i=0; i < result.length; i++){
			new Ext.Panel({
				renderTo: "cmtCtrlArea_" + result[i].id,
				xtype : 'panel',
				layout : 'column',
				hideBorders : true,
				buttons : [{ 
					text : '댓글',
					name : result[i].id,
					handler : function(){
						updateCoComent(btnCheck(this.name, result))
					}
				},{
					name : result[i].id,
					text : '수정',
					handler : function(){
						updateComment(btnCheck(this.name, result));
					}
				}, {
					name : result[i].id,
					text : '삭제',
					handler : function(){
						deleteComment(btnCheck(this.name, result));
					}
				} ]
			})
		}
	}
	
	var comment = '<textarea cols="50" rows="2" id="commentTextArea" maxlength="6000">'
			+ '</textarea><input type="button" value="댓글작성" />';
	commentWrite.html(comment);
	commentList.html(list);
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
function writeComment(id) {
	var commentContent = Ext.getCmp("commentInTextarea");

	var url = "/blog/board/insertComment";

	var data = {
		comment_content : commentContent.getValue(),
		comment_parent : 0,
		user : 1,
		board : id
	}
	if (commentContent.getValue() == null || commentContent.getValue() == "") {
		alert("내용을 입력해주세요!")
	} else {
		callAjax("POST", url, data);
		alert("댓글작성이 완료되었습니다.")
		commentContent.setValue("");
		viewCommentList(id);
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
function deleteComment(data) {
	var dataId = data.id;
	var dataBoard = data.board;
		var url = "./board/deleteCmt";
		var data = {
			id : dataId
		};
		if (confirm("Are you sure you want to do this?")) {
			callAjax("GET", url, data);
			viewCommentList(dataBoard);
			return;
		} else {
			return;
		}
}

// 코멘트 수정
function updateComment(data) {
	var dataId = data.id;
	var dataBoard = data.board;
	
	
	
	$("#commentContentArea_"+dataId).html("");
	
	new Ext.Panel({
		renderTo : 'commentContentArea_' + dataId,
		xtype : 'panel',
		hideBorders : true,
		items : [{
			xtype : 'textarea',
			id : 'editCmtArea'+dataId,
			hideBorders : true,
			value : data.comment_content,
		},{
			xtype : 'panel',
			layout : 'vbox',
			hideBorders : true,
			buttons : [ {
				text : '수정',
				id : 'checkLoginButton',
				handler : function (){
					var url = "/blog/board/updateCmt";
					var data = {
						id : dataId,
						comment_content : Ext.getCmp("editCmtArea"+dataId).getValue(),
					}
					callAjax("GET", url, data);
					viewCommentList(dataBoard);
					}
				}, {
				text : '취소',
				handler : function() {
					
				}
			} ],
		}]
	})
}

//코멘트 페이징처리
function cmtPagingNumber(id) {
	var url = "/blog/board/cmtPagingNumber";
	var data = {
		board : id
	};

	var pageNumStr = "";

	var result = callAjax("GET", url, data);
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

$(document).ready(function() {
	addEventHandelr();
})