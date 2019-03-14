sap.ui.define([
	"sap/ui/task/controller/BaseController",
	"sap/m/library",
	"sap/ui/core/Locale",
	"sap/ui/core/LocaleData",
	"sap/ui/model/type/Currency",
	"sap/m/ObjectAttribute"

], function(BaseController,Library,Locale,LocaleData,Currency,ObjectAttribute){
	"use strict";
	return BaseController.extend("sap.ui.task.controller.App",{
		onInit : function (){
			
		},
		formatMail : function(sFirstName,sLastName){
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			return Library.URLHelper.normalizeEmail(
					sFirstName + "." + sLastName + "google.com",
					oBundle.getText("mailSubject",[sFirstName]),
					oBundle.getText("mailBody")
			);
		},
		formatStockValue: function(fUnitPrice, iStockLevel, sCurrCode) {
			var sBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage();
			var oLocale = new Locale(sBrowserLocale);
			var oLocaleData = new LocaleData(oLocale);
			var oCurrency = new Currency(oLocaleData.mData.currencyFormat);
			return oCurrency.formatValue([fUnitPrice * iStockLevel, sCurrCode], "string");
		},
		onItemSelected: function(oEvent) {
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext("products");
			var sPath = oContext.getPath();
			var oProductDetailPanel = this.byId("productDetailsPanel");
			oProductDetailPanel.bindElement({ path: sPath, model: "products" });
		},
		productListFactory : function(sId,oContext){
			var oUIControl;
			
			if (oContext.getProperty("UnitsInStock")=== 0 && oContext.getProperty("Discontinued")){
				oUIControl = this.byId("productSimple").clone(sId);
				return oUIControl;
			} else {
				oUIControl = this.byId("productExtended").clone(sId);
				
				if (oContext.getProperty("UnitsInStock") < 1){
					oUIControl.addAttribute(new ObjectAttribute({
						text : {
							path : "i18n>outOfStock"
						}
					}));
				}
			}
			return oUIControl;
		}
	});
});