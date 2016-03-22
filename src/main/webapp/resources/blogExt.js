function loginWindow() {
	var win = new Ext.Window({
		title : 'LOGIN',
		closable : true,
		layout : 'fit',
		modal : true,
		width : 300,
		height : 150,
		items : [ {
			layout : 'form',
			padding : 12,
			items : [ {
				xtype : 'textfield',
				fieldLabel : '아이디',
				name : 'j_username ',
				id : 'user_id',
				allowBlank : false
			}, {
				xtype : 'textfield',
				fieldLabel : '비빌번호',
				name : 'j_password ',
				id : 'user_password'
			} ]
		} ],
		buttons : [ {
			text : 'Login',
			id : 'checkLoginButton',
			handler : loginUser
		}, {
			text : 'Cancel',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

function joinWindow() {
	var win = new Ext.Window({
		title : 'JOIN',
		closable : true,
		layout : 'fit',
		width : 400,
		modal : true,
		height : 220,
		items : [ {
			padding : 15,
			layout : 'form',
			items : [ {
				xtype : 'textfield',
				fieldLabel : '아이디',
				id : 'user_id',
				allowBlank : false,
				listeners : {
					blur : {
						fn : function() {
							checkId();
						}
					}
				}
			}, {
				xtype : 'textfield',
				fieldLabel : '비빌번호',
				id : 'password'
			}, {
				xtype : 'textfield',
				fieldLabel : '비밀번호재입력',
				id : 'repassword',
				allowBlank : false,
				listeners : {
					blur : {
						fn : function() {
							checkRePassword();
						}
					}
				}
			}, {
				xtype : 'textfield',
				fieldLabel : '이름',
				id : 'name',
				allowBlank : false,
				listeners : {
					blur : {
						fn : function() {
							checkName();
						}
					}
				}
			},{
				xtype : 'textfield',
				fieldLabel : 'email',
				id : 'email',
				allowBlank : false
			}],
		} ], buttons : [ {
			text : 'join',
			handler : function() {
				joinUser();
			}
		}, {
			text : 'Cancel',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

Ext.onReady(function() {
	new Ext.Viewport({
		layout : 'ux.center',
	//	hideBorders : true,
		items : [ {
			xtype : 'panel',
			width : '60%', 
			layout : 'border',
			title : 'Heesun Blog',
			hideBorders : false, // true
			items : [{
						xtype : 'panel',
						region : 'center',
						hideBorders : true,
						layout : 'vbox',
						id : 'blogPanel',
						layoutConfig : {
							align : 'stretch',
							pack : 'start'
						},},{
						xtype : 'panel',
						region : 'north',
						height : 35,
						padding : 5,
						hideBorders : true,
						layout : 'hbox',
						layoutConfig : {
							pack : 'start',
							align : 'stretch'
						},
						items : [{
									xtype : 'panel',
									flex : 1,
									layout : 'form',
									items : [{
										xtype : 'combo',
										id : 'menuCombo',
										width: 80, 
										fieldLabel : 'Menu',
										name : 'menu-combo',
										triggerAction : 'all',
										valueField: 'key',
										displayField: 'value', 
										mode : 'local',
										editable : false,
										selectOnFocus : true,
										store : [ 
										         [ '1', '일기'], 
										         [ '2', '맛집' ],
										         [ '3', '프로그램' ] 
										],
										value : '1',
										listeners: {
											select : function(field, rec , selIndex) {
												postLinkViewList(selIndex+1, 0);
								            },
								        }
									}],
								}, {
									xtype : 'panel',
									flex : 1,
									layout : 'hbox',
									layoutConfig : {
										pack : 'end', 
										align : 'middle'
									},
									items : [ {
										xtype : 'button',
										text : 'LOGIN',
										listeners : {
											click : loginWindow
										}
									}, {
										xtype : 'button',
										text : 'JOIN',
										listeners : {
											click : joinWindow
										}
									} ]
								} ]
					}, {
						xtype : 'panel',
						region : 'south',
						height : 24
					}, {
						xtype : 'panel',
						hideBorders : true,
						region : 'east',
						layout : 'anchor',
						width : 200,
						layoutConfig : {
							align : 'middle'
						},
						items : [ {
							xtype : 'label',
							text : '소개글',
							anchor : '100%'
						},
						{
							xtype : 'button',
							text : '글쓰기',
							listeners : {
								click : function(){
									writePage();
								}
							}
						}]
					} ]
		} ],
		listener : {
			afterrenderer : function(){
				console.log(this);
			}
		}
	});	
	
	postLinkViewList(1, 0);
});