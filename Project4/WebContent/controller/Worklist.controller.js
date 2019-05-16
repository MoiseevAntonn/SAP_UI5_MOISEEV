sap.ui.define([
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    "../model/FlaggedType",
    'sap/m/library',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function(BaseController, JSONModel, formatter, FlaggedType, mobileLibrary, Filter, FilterOperator) {
    "use strict";

	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Worklist", {
		
		types : {
			flagged: new FlaggedType()
		},
		
		formatter: formatter,

		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

	
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [window.location.href]),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

	
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},


		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				this.oViewModel.setProperty("/worklistTableTitle", sTitle);
			}
		},


		onShareEmailPress: function () {
			var oViewModel = this.getModel("worklistView");
			mobileLibrary.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		onPress: function (oEvent) {
			this.getRouter().navTo("post", {
				// The source is the list item that got pressed
				postId: oEvent.getSource().getBindingContext().getProperty("PostID")
			});

		},
		onFilterPosts: function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Title", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
		},
	});
});