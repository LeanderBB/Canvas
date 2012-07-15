/* ---------- */
/* Backbone Controllers/Routes ----- */
AppNS.Controllers.Page = Backbone.Router.extend({
	routes: {
		'feed/:number': 'feed'
	},

	feed: function(){
		console.log("go to feed");
	}
});
