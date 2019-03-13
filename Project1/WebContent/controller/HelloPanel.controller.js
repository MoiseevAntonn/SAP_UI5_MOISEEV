sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(Controller,MessageToast,Fragment) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.HelloPanel",{

		onShowHello : function(){
			//MessageToast.show("pidoras");
			//read message from i18n model
			var oBundle =this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel("model1").getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg",[sRecipient]);
			//show msg
			MessageToast.show(sMsg);
		},
	
		onOpenDialog : function(){
			this.getOwnerComponent().openHelloDialog();
		},
		onPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail");
		}
		
		
	});
});