(function(){
	// Sanity check before show starts
	if(!redeye.codebaseStatsManager) return;

	/**
	 * Widget that wraps a call to '/api/activity/all' endpoint.
	 * The render method returns html for the manager to
	 * display.
	 * @type {{rawData, init, getID, notInitialized, render}}
	 */
	// function CodebaseWidget(project, apiEndpoint, refreshRate){
	redeye.codebaseStatsManager.CodebaseWidget = function(options){
		// Helpers
		var context;
		var interval;

		// Flags
		var debug = false;
		var initialized = false;

		// Params
		var widgetName = options.name;
		var refreshAfter = 1000 * 60 * options.refreshRate; //milliseconds
		var id = 'widget' + options.endpoint.replace(/\//g, '-') + '-' + Date.now().toString();
		var codebaseEndpoint = '/api' + options.endpoint;
		var forProject = options.project ? options.project : '';

		// Exposed methods
		return {

			rawData: null,
			html: null,

			/**
			 * Prepare the manager
			 */
			init: function()
			{
				logDebug('Initializing');

				try {
					// Set reference to manager
					context = this;
					// Run set of commands to prepare the app
					isInitialized();
					fetchData(); // Wil set the initialized flag
					setRefreshData();
				}
				catch (e) {
					logDebug('[ERROR] ' + e);
				}
			},

			/**
			 * Return widgets id
			 */
			getID: function()
			{
				return id;
			},

			/**
			 * Get the flag marking init has finished
			 */
			notInitialized: function()
			{
				return !initialized;
			},

			/**
			 * Render DOM with latest html from endpoint
			 */
			render: function()
			{
				if(this.domBox){
					var html = this.html ? this.html : getContainerHtml();
					this.domBox.html(html);
				}
			},

			/**
			 * Returns html to populate the widget box
			 * @returns {string}
			 */
			getHtml: function()
			{
				return  this.html ? this.html : getContainerHtml();
			}
		};

		// Private methods section

		/**
		 * Call to the '/api/activity/all' endpoint
		 */
		function fetchData()
		{
			logDebug('Getting latest data for /api/activity/all');

			$.ajax(codebaseEndpoint, {
				'method': 'GET',
				'data': {
					'project': forProject
				}
			}).done(function(data){
				context.rawData = data.raw_data;
				context.html = data.html;
				context.render();
				logDebug('Data was successfully retrieved for /api/activity/all');
			}).fail(function(data){
				logDebug('Cant get back data for /api/activity/all');
			}).always(function(){
				// Everything finished, flag as initialized
				initialized = true;
			})
		}

		/**
		 * Widgets autorefresh interval
		 */
		function setRefreshData()
		{
			interval = setInterval(function(){
				fetchData();
			}, refreshAfter);
		}

		/**
		 * If flag is set to true, throws exception to avoid re-init
		 */
		function isInitialized()
		{
			if (initialized) throw "Already initialized.";
		}

		/**
		 * Prepare loading container html
		 * @returns {string}
		 */
		function getContainerHtml()
		{
			return '<div class="panel panel-primary">' +
				'<div class="panel-heading">' +
				'<h3 class="panel-title">' + widgetName + '</h3>' +
				'</div>' +
				'<div class="panel-body">' +
					'<br><div class="progress progress-striped active">' +
						'<div class="progress-bar" style="width: 100%"></div>' +
					'</div>' +
				'</div>' +
				'</div>'
		}

		/**
		 * Based on the set debug flag outputs the message to the console
		 * @param message
		 */
		function logDebug(message)
		{
			if (debug) console.dir('ActivityWidget:' + message)
		}

	}

	// Ready-set-go
	$(document).ready(function() {
		// Add widget to manager
		// redeye.codebaseStatsManager.addWidget(new CodebaseWidget('API', '/activity/all', 10));
		// redeye.codebaseStatsManager.addWidget(new CodebaseWidget('Contour', '/activity/all', 10));
		// redeye.codebaseStatsManager.addWidget(new CodebaseWidget('Contour', '/activity/all', 10));
	});
})();