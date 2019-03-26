sap.ui.define([
	"sap/ui/task/controller/BaseController"
], function(BaseController){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.App",{
		onInit : function (){
			/*jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
			
			var oRouter = this.getRouter();
			oRouter.attachBypassed(function(oEvent){
				var sHash = oEvent.getParameter("hash");
				jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
			});
			oRouter.attachRouteMatched(function (oEvent){
				var sRouteName = oEvent.getParameter("name");
				jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
			});*/
			this.getView().byId("selectLanguage").attachChange(this.selectEventHandler,this);
			
		},
		selectEventHandler: function(oContext){
			   //this.getView().byId("selectLanguage").getSelectedItem()
			   var sKey = oContext.getSource().getSelectedKey();
			   switch (sKey){
			   case "RUS":
				   sap.ui.getCore().getConfiguration().setLanguage( "ru-RU" );
				   break;
			   case "ENG":
				   sap.ui.getCore().getConfiguration().setLanguage( "en-US" );
				   break;
			   }
		   }
	});
});