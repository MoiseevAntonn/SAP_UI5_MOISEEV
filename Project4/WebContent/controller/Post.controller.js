sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'../model/formatter'
], function (BaseController, JSONModel, formatter) {
	"use strict";
	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Post", {
		formatter: formatter,
		onInit: function () {
			var oViewModel = new JSONModel({
					busy: false
				});
			this.getRouter().getRoute("post").attachPatternMatched(this._onPostMatched, this);
			this.setModel(oViewModel, "postView");
		},

		onNavBack: function () {
			this.myNavBack("worklist");
		},

		_onPostMatched: function (oEvent) {
			var oViewModel = this.getModel("postView"),
				oDataModel = this.getModel();
			this.getView().bindElement({
				path: "/Posts('" + oEvent.getParameter("arguments").postId + "')",
				events: {
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
					
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		}
	});
});