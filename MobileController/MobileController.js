var MobileController = function() {

	var context = null;
	var log = null;
	var renderTargetId = null;
	var broker = null;
	var serviceAccess = null;
	var xmlUtils = null;

	var panel = null;

	var printStatus = function(statusMsg) {
		var statusfield = Ext.getCmp('cs1');
		statusfield.setValue(statusMsg);
	};

	var handleRightTap = function(button, ev, options) {
		console.log("Right button tapped!");
		printStatus("Right button tapped!");

		// create event accordingly to the component decsriptor
		var rightBtnPressedEvent = new Ext.cruise.client.Message();
		rightBtnPressedEvent.setName('rightButtonChanged');
		rightBtnPressedEvent.appendToBody('active', true);

		// publish event
		broker.publish(rightBtnPressedEvent);
	};

	var handleLeftTap = function(button, ev, options) {
		console.log("Left button tapped!");
		printStatus("Left button tapped!");

		// create event accordingly to the component decsriptor
		var leftBtnPressedEvent = new Ext.cruise.client.Message();
		leftBtnPressedEvent.setName('leftButtonChanged');
		leftBtnPressedEvent.appendToBody('active', true);

		// publish event
		broker.publish(leftBtnPressedEvent);
	};

	var handleTopTap = function(button, ev, options) {
		console.log("Top button tapped!");
		printStatus("Top button tapped!");

		var topBtnPressedEvent = new Ext.cruise.client.Message();
		topBtnPressedEvent.setName('topButtonChanged');
		topBtnPressedEvent.appendToBody('active', true);

		// publish event
		broker.publish(topBtnPressedEvent);
	};

	var handleBtmTap = function(button, ev, options) {
		console.log("Bottom button tapped!");
		printStatus("Bottom button tapped!");

		var btmBtnPressedEvent = new Ext.cruise.client.Message();
		btmBtnPressedEvent.setName('btmButtonChanged');
		btmBtnPressedEvent.appendToBody('active', true);

		// publish event
		broker.publish(btmBtnPressedEvent);
	};

	/**
	 * Helper method to create the direction cross.
	 */
	var createDirectionCross = function() {
		return new Ext.Panel({
			layout : {
				type : 'hbox',
				pack : 'center',
				align : 'center'
			},
			docked : 'left',
			margin : '0 0 0 10',
			items : [{
				xtype : 'button',
				iconMask : true,
				iconCls : 'arrow_left',
				height : 50,
				width : 50,
				listeners : {
					tap : handleLeftTap
				}
			}, {
				xtype : 'panel',
				layout : {
					type : 'vbox',
					align : 'center'
				},
				items : [{
					xtype : 'button',
					iconMask : true,
					iconCls : 'arrow_up',
					height : 50,
					width : 50,
					margin : '0 0 25 0',
					listeners : {
						tap : handleTopTap
					}
				}, {
					xtype : 'button',
					iconMask : true,
					iconCls : 'arrow_down',
					height : 50,
					width : 50,
					margin : '25 0 0 0',
					listeners : {
						tap : handleBtmTap
					}
				}]
			}, {
				xtype : 'button',
				iconMask : true,
				iconCls : 'arrow_right',
				height : 50,
				width : 50,
				listeners : {
					tap : handleRightTap
				}
			}]
		});
	};

	var handleStartTap = function(button, ev, options) {
		console.log("Start button tapped!");
		printStatus("Start button tapped!");

		// event creation
		var startBtnPressedEvent = new Ext.cruise.client.Message();
		startBtnPressedEvent.setName('startButtonChanged');
		startBtnPressedEvent.appendToBody('active', true);

		// publishing event
		broker.publish(startBtnPressedEvent);
	};

	var handleSelectTap = function(button, ev, options) {
		console.log("Select button tapped!");
		printStatus("Select button tapped!");
	};

	var handleBtnATap = function(button, ev, options) {
		console.log("Button A button tapped!");
		printStatus("Button A button tapped!");

		// event creation
		var firstActionButtonPressed = new Ext.cruise.client.Message();
		firstActionButtonPressed.setName('firstActionButtonChanged');
		firstActionButtonPressed.appendToBody('active', true);

		// publishing event
		broker.publish(firstActionButtonPressed);
	};

	var handleBtnBTap = function(button, ev, options) {
		console.log("Button B button tapped!");
		printStatus("Button B button tapped!");

		// event creation
		var secActionButtonPressed = new Ext.cruise.client.Message();
		secActionButtonPressed.setName('secondActionButtonChanged');
		secActionButtonPressed.appendToBody('active', true);

		// publishing event
		broker.publish(secActionButtonPressed);
	};

	var handleLocationChange = function(txtfield, newval, oldval, opts) {
		console.log("Old value: " + oldval + " new value: " + newval);
		printStatus("Old value: " + oldval + " new value: " + newval);

		panel.setMasked(false);
		// simple value validation
		if (newval.indexOf("://") == -1) {
			panel.setMasked({
				xtype : 'loadmask',
				message : 'Invalid data location! It should contain a URL with protocol, host and path specification.',
				indicator : false
			});

			return;
		}

		// event creation
		var locSelectedEvent = new Ext.cruise.client.Message();
		locSelectedEvent.setName('dataSelected');
		locSelectedEvent.appendToBody('dataLocation', newval);

		// event publishment
		broker.publish(locSelectedEvent);
	};

	/**
	 * Helper method to create the main view panel.
	 */
	var createPanel = function(rtid) {

		// 1st create direction elements
		var cross = createDirectionCross();

		var actionBtnPanel = new Ext.Panel({
			//style : 'background: blue;',
			docked : 'right',
			layout : {
				type : 'vbox',
				pack : 'center',
				align : 'center'
			},

			items : [{
				xtype : 'panel',
				margin : '0 0 10 0',
				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
				},
				//style : 'background: green;',
				items : [{
					xtype : 'button',
					html : 'A',
					height : 70,
					width : 70,
					margin : '0 10 0 10',
					ui : 'round',
					listeners : {
						tap : handleBtnATap
					}
				}, {
					xtype : 'button',
					html : 'B',
					height : 70,
					width : 70,
					margin : '0 10 0 10',
					ui : 'round',
					listeners : {
						tap : handleBtnBTap
					}
				}]
			}, {
				xtype : 'panel',
				margin : '10 0 0 0',
				//style : 'background: green;',
				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
				},
				items : [{
					xtype : 'button',
					html : 'Start',
					height : 5,
					width : 80,
					margin : '0 10 0 0',
					listeners : {
						tap : handleStartTap
					}
				}, {
					xtype : 'button',
					html : 'Select',
					height : 5,
					width : 80,
					margin : '0 0 0 10',
					listeners : {
						tap : handleSelectTap
					}
				}]
			}]
		});

		var buttonPanel = new Ext.Panel({
			//style : 'background: grey;',
			layout : {
				type : 'fit',
				align : 'stretch'
			},

			items : [cross, actionBtnPanel]
		});

		return new Ext.Panel({
			style : 'background: grey;',
			layout : {
				type : 'vbox',
				pack : 'center',
				align : 'stretch'
			},

			items : [{
				docked : 'top',
				xtype : 'textfield',
				label : 'Slides Location',
				value : 'Input the slides location here!',
				listeners : {
					change : handleLocationChange
				}
			}, buttonPanel, {
				docked : 'bottom',
				xtype : 'textfield',
				label : 'Status',
				id : 'cs1',
				disabled : true,
				disabledCls : null
			}]
		});
	};

	return {
		init : function(ctx) {
			context = ctx;
			log = context.getAttribute("Logger");
			renderTargetId = context.getAttribute("renderTargetId");
			broker = context.getAttribute("EventHandler");
			serviceAccess = context.getAttribute("ServiceAccess");

			// provides common functionality for working with XML documents and hides browser specific solutions
			// see http://cruisedemos.dyndns.org/tsr-api class Ext.cruise.client.Utility for the API
			xmlUtils = context.getAttribute("XMLUtilities");

			Ext.setup({
				viewport : {
					renderTo : renderTargetId
				},
				
				onReady : function(){
					// create view panel of this component
					panel = createPanel(renderTargetId);
					Ext.Viewport.add(panel);
				}
			});
		},

		dispose : function() {
			context = null;
			log = null;
			renderTargetId = null;
			proxy = null;
			xmlUtils = null;
			serviceAccess = null;
		},

		enable : function() {
			panel.enable();
		},

		disable : function() {
			panel.disable();
		},

		show : function() {
			panel.show();
		},

		hide : function() {
			panel.hide();
		},

		invokeOperation : function(operationName, message) {
			var params = message.getBody();

			if(operationName === 'showLoadingState' && 
				message.getBody()['loadingState'] != undefined && 
				message.getBody()['loadingState'] != null) {
				// calling operation
				this.showLoadingState(params['loadingState']);
			} 
			else if(operationName === showLoadResult && 
				params['loadResult'] != undefined &&
				params['loadResult'] != null){
				// calling operation
				this.showLoadResult(params['loadResult']);
			} else {
				throw "Call to unknown operation or invalid arguments";
			}
		},

		setProperty : function(name, value) {

		},

		getProperty : function(name) {

		},
		
		/**
		* Method shows loading progress in the context of the receiver component.
		*/
		showLoadingState : function(loadingState){

		},
		
		showLoadResult : function(loadResult){

		}
	}
};
