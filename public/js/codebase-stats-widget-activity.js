(function(){
	// Sanity check before show starts
	if(!redeye.codebaseStatsManager) return;

	/**
	 * Widget that wraps a call to '/api/activity/all' endpoint.
	 * The render method returns html for the manager to
	 * display.
	 * @type {{rawData, init, getID, notInitialized, render}}
	 */
	var ActivityWidget = (function(){

		// Helpers
		var context;
		var interval;

		// Flags
		var debug = true;
		var initialized = false;

		// Params
		var refreshAfter = 1000 * 60 * 15; //milliseconds
		var id = 'activity-widget';
		var codebaseEndpoint = '/api/activity/all';

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
			 * Returns html to populate the widget box
			 * @returns {string}
			 */
			render: function()
			{
				return  this.html ? this.html : 'Activity Widget';
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
				'method': 'GET'
			}).done(function(data){
				context.rawData = data.raw_data;
				context.html = data.html;
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
		 * Based on the set debug flag outputs the message to the console
		 * @param message
		 */
		function logDebug(message)
		{
			if (debug) console.dir('ActivityWidget:' + message)
		}

	})();

	// Ready-set-go
	$(document).ready(function() {
		// Add widget to manager
		redeye.codebaseStatsManager.addWidget(ActivityWidget.getID(), ActivityWidget);
	});
})();