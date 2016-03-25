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
			res = status;
		}
	})
	return res;
}

// 포스트

// 포스트 목록
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
	var contentList = Ext.getCmp("contentList");

	var list = "";
	list += "<h3>Post List</h3><p>"
	list += "<table> <tr>";

	if (result == null || result == "") {
		list += "<tr><td>아직 글이 없습니다.</td></tr>"

	} else {
		list += "<td id='postTitleTd' width='700px'><b>글제목</b></td> <td><b>작성시간 </b></td></tr>";
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
	contentList.update(list);
	pagingNumber(category);
}

// 글목록에서 글 클릭 시 해당 포스트 보여줌
function postLinkUrl(category, id, pageNum) {
	var url = "/blog/board/selectPost";
	var data = {
		id : id,
		category : category
	}
	var result = callAjax("GET", url, data);
	
	var panel = Ext.getCmp("blogPanel");
	var hiddenId = Ext.getCmp("board_id");
	
	panel.update("<div id='viewPost'></div>");

	if (result.id != null) {
		new Ext.Panel({
			applyTo : 'viewPost',
			layout : 'form',
			
			items : [{
				xtype : 'panel',
				flex : 1,
				//hideBorders : true,
				items : [{
					xtype : 'panel',
					hideBorders : true,
					id : 'postTitle'
						},{
					xtype : 'panel',
					hideBorders : true,
					id : 'postDate',
					},{
					xtype : 'panel',
					hideBorders : true,
					id : 'postContent'
					},{
					xtype : 'panel',
					hideBorders : true,
					id : 'postControlArea',
					items : [ {
					xtype : 'panel',
					layout : 'hbox',
					layoutConfig : {
						pack : 'center',
						align : 'middle'
						},
					items : [{
						xtype : 'button',
						text : '수정',
						id : 'postUpdateBtn',
						listeners : {
							click : function() {
								updatePost(id,result.post_title,result.post_content,category);
								}
							}
						}, {
							xtype : 'button',
							text : '삭제',
							id : 'postDeleteBtn',
							listeners : {
								click : function() {
									deletePost(id, category)
									}
						}
						} ]
						} ]
					}, {
						xtype : 'panel',
						height : 400,
						id : 'commentList',
						padding : 10
						}, {
							xtype : 'panel',
							height : 65,
							id : 'postComment'
								}, {
									xtype : 'panel',
									height : 200,
									id : 'contentList'
								} ]
					} ]
				})
		
		Ext.getCmp("postTitle").update(result.post_title);
		Ext.getCmp("postDate").update("posted at " + result.post_create_date);

		Ext.getCmp("postContent").update(result.post_content);

		postCommentArea(id);
		viewCommentList(id, 1);
		viewList(category, pageNum)

	} else {
		Ext.getCmp("blogPanel").update("현재 카테고리에 작성된 글이 없습니다.");

	}
}

function postCommentArea(id) {
	var area = Ext.getCmp("postComment");
	area.update("<div id='postCommnetArea'></div>")
	new Ext.Panel({
		hideBorders : true,
		renderTo : "postCommnetArea",
		layour : 'form',
		items : [ {
			xtype : 'panel',
			layout : 'column',
			padding : 10,
			hideBorders : true,
			items : [ {
				fieldLabel : 'comment',
				xtype : 'textarea',
				id : 'commentInTextarea',
				width: 500,
				height: 40
			}, {
				xtype : 'button',
				text : '작성',
				margin : 10,
				listeners : {
					click : function() {
						writeComment(id);
					}
				}
			} ]
		} ]
	})

}

// 블로그 글 삭제버튼 눌렀을 때 confirm 확인 후 삭제
function deletePost(id, category) {
	var url = "./board/deletePost";
	var data = {
		id : id
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

// 글작성
function writePost() {
	var categoryId = Ext.getCmp("getCategoty").value;
	var post_title = Ext.getCmp("postTitleArea").getValue();
	var post_content = Ext.getCmp("postContentArea").getValue();
	var url = "./board/insertPost";

	var data = {
		category : categoryId,
		post_title : post_title,
		post_content : post_content
	};

	if (post_title == "" || post_content == "") {
		alert("빈칸없이 입력해주세요.")
	} else {
		var result = callAjax("GET", url, data);
		self.location = '/blog/test';
	}

}

// 글수정
function updatePost(id, title, content, category) {
	var blogPanel = Ext.getCmp("blogPanel");
	var getCategory = category;

	blogPanel.update("<div id='updatePostArea'></div>")
	
	new Ext.Panel({
		renderTo : 'updatePostArea',
		layout : 'form',
		padding: 20,
		width : 950,
		items : [ {
			xtype : 'combo',
			fieldLabel : 'Menu',
			name : 'menu-combo',
			triggerAction : 'all',
			mode : 'local',
			id : 'getCategoty',
			editable : false,
			selectOnFocus : true,
			store : [ [ '1', '일기' ], [ '2', '맛집' ], [ '3', '프로그램' ] ],
			value : '1',
			listeners : {
				select : function(field, rec, selIndex) {
					getCategory = selIndex + 1;
				},
			}
		}, {
			xtype : 'textfield',
			fieldLabel : 'Title',
			value : title,
			id : 'updateTitle',
			width : 800,
		}, {
			xtype : 'textarea',
			fieldLabel : 'Content',
			value : content,
			id : 'updateContent',
			width : 800,
			height : 600
		}, {
			xtype : 'panel',
			layout : 'hbox',
			hideBorders : true,
			layoutConfig : {
				pack : 'center',
				align : 'middle'
			},
			items : [ {
				xtype : 'button',
				text : '저장',
				listeners : {
					click : function() {
						var data = {
								id : id,
								category : getCategory,
								post_title : Ext.getCmp("updateTitle").getValue(),
								post_content : Ext.getCmp("updateContent").getValue()
							};
						
						var url = "./board/updatePost";
						callAjax("GET", url, data);
						
						postLinkViewList(getCategory, 0);
						return;
					}
				}
			}, {
				xtype : 'button',
				text : '취소'
			} ]
		} ]
	})
}

// 가장 최근에 쓴 포스트 아이디 리턴
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

function postLinkViewList(category, pageNum) {
	postLink(category, pageNum);
	viewList(category, pageNum);
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

// /////////////////코멘트

// 코멘트 목록
function viewCommentList(id, pageNum) {
	
	var url = "./board/selectCommentList";
	var data = {
		board : id,
		pageNum : pageNum
	}

	var result = callAjax("GET", url, data);

	var commentList = Ext.getCmp("commentList");
	
	commentList.update("<div id='cmtList'></div>");
	
	var list = "<h3>Comments</h3><p>"
	
	if (result == null || result == "") {
		var list = "아직 코멘트가 없습니다.";
		$("#cmtList").append(list);
		commentList.update("");
		
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

function writePage() {
	var getCategory = 1;
	
	var content = "<div id='writePost'></div>";

	var area = Ext.getCmp("blogPanel");
	area.update(content);
	
	new Ext.Panel({
		renderTo: 'writePost',
		layout: 'form',
		padding: 20,
		width : 950,
		items:[{
			xtype : 'combo',
			fieldLabel : 'Menu',
			name : 'menu-combo',
			triggerAction : 'all',
			mode : 'local',
			id : 'getCategoty',
			editable : false,
			selectOnFocus : true,
			store : [ [ '1', '일기'], [ '2', '맛집' ],
					[ '3', '프로그램' ] ],
			value : '1',
			listeners: {
				select : function(field, rec , selIndex) {
					getCategory = selIndex+1;
	            },
	        }
		},{
			xtype:'textfield',
			fieldLabel : 'Title',
			id : 'postTitleArea',
			value : '',
			width : 800,
		},{
			xtype: 'textarea',
			fieldLabel : 'Content',
			id : 'postContentArea',
			value: '',
			width : 800,
			height : 600
		},{
			xtype: 'panel',
			layout: 'hbox',
			hideBorders : true,
			layoutConfig : {
				pack : 'center',
				align : 'middle'
			},
			items : [{
				xtype: 'button',
				text: '저장',
				listeners : {
					click : function(){
						writePost();
					}
				}
			},{
				xtype: 'button',
				text: '취소'
			}]
		}]
	});
}