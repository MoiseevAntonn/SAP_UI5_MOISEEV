sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist",
	"./pages/Browser",
	"./pages/Post"
],function(opaTest){
	"use strict";
	
	QUnit.module("Post");
	
	opaTest("should see the post page when a user clicks on an entry",function(Given,When,Then){
		Given.iStartMyApp();
		
		When.onTheWorklistPage.iPressOnTheItemWithTheID("PostID_15");
		
		Then.onThePostPage.theTitleShouldDisplayTheName("Jeans");
		
	});
	
	opaTest("should go back to the TablePage",function(Given,When,Then){
		When.onThePostPage.iPressTheBackButton();
		
		Then.onTheWorklistPage.iShouldSeeTheTable();
		
	});
	
	opaTest("Should be on the post page again when the browser's forward button is pressed",function(Given,When,Then){
		When.onTheBrowser.iPressOnTheForwardButton();
		
		Then.onThePostPage.theTitleShouldDisplayTheName("Jeans");
		
		//Then.iTeardownMyApp();
		
	});
	
	opaTest("Should select the statistics tab", function (Given, When, Then) {
		// Actions
		When.onThePostPage.iPressOnTheTabWithTheKey("statistics");
		// Assertions
		Then.onThePostPage.iShouldSeeTheViewCounter()
			.and.iTeardownMyApp();
	});
	
})