sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel){
	"use strict";
	
	const CATEGORIES_PATH = "/data/categories",
		  EMPLOYEES_PATH = "/data/employees";
	
	return JSONModel.extend("sap.ui.task.controller.FactFuncTable.JSONCustomModel",{
		constructor : function(){
			JSONModel.prototype.constructor.apply(this,arguments);
			this.loadData("./model/metadataTables.json");
		},
		setCategories : function(oData){
			return this.setProperty(CATEGORIES_PATH, oData);
		},
		setEmployees : function(oData){
			return this.setProperty(EMPLOYEES_PATH, oData);
		},
		getCategories : function(){
			return this.getProperty(EMPLOYEES_PATH);
		},
		getEmployees : function(){
			return this.getProperty(EMPLOYEES_PATH);
		},
		handleCategoriesAndProducts : function(categories,products){
			var productMap = {};
			products.forEach(product=>{
				var supplier = product.Supplier || "";
				supplier.level = "s";
				supplier.name = supplier.CompanyName;

				product.name = product.ProductName;
				product.results = supplier;
				product.level = "p";
				product.__parent = categories.filter(category=>{
					return getCKey(product) == getCKey(category);
				})[0];
				
				if(!productMap[getCKey(product)]) {
					productMap[getCKey(product)] = [];
				}
				productMap[getCKey(product)].push(product);
	
			});
			
			categories.forEach(category=>{
				category.level = "c";
				category.name = category.CategoryName;
				category.results = productMap[getCKey(category)];
			});
			return categories;
			
			function getCKey(item){
				return item.CategoryID;
			};
			function getPKey(item){
				return item.ProductID;
			};
		}
	});
});