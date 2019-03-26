sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController,JSONModel) {
   "use strict";

   return BaseController.extend("sap.ui.demo.nav.controller.Home", {
	   onInit : function(){
		   var btnLstModel = new JSONModel();
		   btnLstModel.loadData("./model/metadataButtonList.json",null,false);
		   this.getView().setModel(btnLstModel,"metadataButtonList");
		   //this.getView().byId("selectLanguage").attachChange(this.selectEventHandler,this)
		   
	   },
	   onDisplayNotFound : function(){
		   // display without changing hash
		   this.getRouter().getTargets().display("notFound",{
			   fromTarget : "home"
		   });
	   },
	   onListItemPressed : function(oEvent){
		   var oItem, oCtx;
		   oItem = oEvent.getSource();
	       oCtx = oItem.getBindingContext("metadataButtonList");
	       var oData = oCtx.getObject();
	       this.getRouter().navTo(oData.route);
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