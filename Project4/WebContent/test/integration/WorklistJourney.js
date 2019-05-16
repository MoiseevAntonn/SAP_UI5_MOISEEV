/*global QUnit*/
sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist"
],  function (opaTest) {
	"use strict";

	QUnit.module("Posts");

	opaTest("Should see the table with all posts", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheWorklistPage.theTableShouldHaveAllEntries().
			and.theTitleShouldDisplayTheTotalAmountOfItems();

		// Cleanup
		//Then.iTeardownMyApp();
	});
	
	opaTest("Should be able to load more items", function (Given, When, Then) {
		//Actions
		//Given.iStartMyApp();
		
		When.onTheWorklistPage.iPressOnMoreData();

		// Assertions
		Then.onTheWorklistPage.theTableShouldHaveAllEntries();

		// Cleanup
		//Then.iTeardownMyApp();
	});
	
	opaTest("Should be able to search the items",function(Given,When,Then){
		When.onTheWorklistPage.iSearchFor("Bear");
		 
		Then.onTheWorklistPage.theTableHasOneItem();
		
		Then.iTeardownMyApp();
	})

});
