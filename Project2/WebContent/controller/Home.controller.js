sap.ui.define([
	"sap/ui/task/controller/BaseController"
], function (BaseController) {
   "use strict";

   return BaseController.extend("sap.ui.demo.nav.controller.Home", {
	   onInit : function(){
		   
		   
	   },
	   onDisplayNotFound : function(){
		   // display without changing hash
		   this.getRouter().getTargets().display("notFound",{
			   fromTarget : "home"
		   });
	   },
	   onNavToRegForm : function(){
		   this.getRouter().navTo("appRegistrationForm");
	   },
	   onNavToInvList : function(){
		   this.getRouter().navTo("appEmployees");
	   },
	   onNavToEmployeeOverview : function(){
		   this.getRouter().navTo("appEmployeeOverview")
	   }
   });

});