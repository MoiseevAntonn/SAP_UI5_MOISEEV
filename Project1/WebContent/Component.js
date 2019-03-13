sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"./controller/HelloDialog",
	"sap/ui/model/odata/v2/ODataModel"
],function (UIComponent,JSONModel,HelloDialog,ODataModel){
	"use strict";
	return UIComponent.extend("sap.ui.demo.walkthrough.Component",{
		metadata : {
			manifest:"json"
		},
		init : function(){
			UIComponent.prototype.init.apply(this, arguments);
			var oData = {
					recipient: {
						name:"World"
					}
			};
			var oModel = new JSONModel(oData);
			//var oModel = new JSONModel(oData);
			this.setModel(oModel,"model1");
			this._helloDialog = new HelloDialog(this.getRootControl());
			
			
			var oRouter = this.getRouter();
			oRouter.initialize();
			
//			var oRouter = UIComponent.getRouterFor(this);
//			oRouter.initialize();
			
		},
		
		exit: function(){
			this._helloDialog.destroy();
			delete this._helloDialog;
		},
		openHelloDialog: function(){
			this._helloDialog.open();
		}
		
	});
});

/*models 
"invoice": {
	"dataSource": "invoiceRemote",
	"type": "sap.ui.model.odata.v2.ODataModel",
    "settings": {
      "defaultBindingMode": "TwoWay",
      "defaultCountMode": "Inline"
    }
  }
*/


/*,
"invoice": {
	"dataSource": "invoiceRemote",
	"type": "sap.ui.model.odata.v2.ODataModel",
  "settings": {
    "defaultBindingMode": "TwoWay",
    "defaultCountMode": "Inline"
  }
}*/