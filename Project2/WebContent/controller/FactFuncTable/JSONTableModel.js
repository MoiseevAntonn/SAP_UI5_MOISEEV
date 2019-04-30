sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel){
	"use strict";
	
	const CATEGORIES_PATH = "/data/categories",
		  EMPLOYEES_PATH = "/data/employees",
		  PRODUCTS_PATH = "/data/products";
	
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
		setProducts : function(oData){
			return this.setProperty(PRODUCTS_PATH, oData);
		},
		getCategories : function(){
			return this.getProperty(CATEGORIES_PATH);
		},
		getEmployees : function(){
			return this.getProperty(EMPLOYEES_PATH);
		},
		getProducts : function(){
			return this.getProperty(PRODUCTS_PATH);
		},
		handleCategoriesAndProducts : function(categories,products){
			var productMap = {};
			products.forEach(product=>{
				var supplier = product.Supplier || "";
				supplier.level = "s";
				supplier.name = supplier.CompanyName;
				supplier.status = "";

				product.name = product.ProductName;
				product.results = supplier;
				product.level = "p";
				product.selected = false;
				product.status = "";
				//product.ProductID = product.ProductID.toString();
				product.UnitPrice = parseFloat(product.UnitPrice);
				product.__parent = categories.filter(category=>{
					return getCKey(product) == getCKey(category);
				})[0];
				
				if(!productMap[getCKey(product)]) {
					productMap[getCKey(product)] = [];
				}
				productMap[getCKey(product)].push(product);
	
			});
			
			categories.forEach(category=>{
				category.selected = false;
				category.level = "c";
				category.name = category.CategoryName;
				category.results = productMap[getCKey(category)];
				category.status = "";
				//category.CategoryID = category.CategoryID.toString();
			});
			return {results: categories};
			
			function getCKey(item){
				return item.CategoryID;
			};
			function getPKey(item){
				return item.ProductID;
			};
		}
	});
});