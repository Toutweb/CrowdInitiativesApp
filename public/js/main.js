var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "initiatives"	: "list",
        "initiatives/page/:page"	: "list",
        "initiatives/add"         : "addInitiatve",
        "initiatives/:id"         : "initiativeDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var initiativeList = new InitiativeCollection();
        initiativeList.fetch({success: function(){
            $("#content").html(new InitiativeListView({model: initiativeList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    initiativeDetails: function (id) {
        var initiative = new Initiative({_id: id});
        initiative.fetch({success: function(){
            $("#content").html(new InitiativeView({model: initiative}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addInitiative: function() {
        var initiative = new Initiative();
        $('#content').html(new InitiativeView({model: initiative}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'InitiativeView', 'InitiativeListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});