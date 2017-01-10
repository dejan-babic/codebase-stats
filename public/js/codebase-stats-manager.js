// Sanity check before show starts
if(!redeye) var redeye = {};

/**
 * Manager is a system wrapper for all widgets, and it is responsible for initialising and rendering them, and registering
 * time loops (intervals) in which does widgets are refreshed. The widgets themselves are responsible for 
 * getting and parsing the data. An widget object should be added to the manager by the addWidget 
 * command and after that the manager takes care of the rest.
 * @type {{init, addWidget, popWidget}}
 */
redeye.codebaseStatsManager = (function(){

	// Helpers
	var context;
	var widgets;
	var monitor;
	var refresh;
	var containerElement;

	// Flags
	var debug = true;
	var initialized = false;

	// Parameters
	var monitorInterval = 10000; // milliseconds
	var refreshRate = 1000; // milliseconds

	// Exposed methods
	return {

		/**
		 * Prepare the manager
		 */
		init: function ()
		{
			logDebug('Initializing Codebase Stats Manager');

			try {
				// Set reference to manager
				context = this;
				// Run set of commands to prepare the app
				isInitialized();
				createWidgetContainer();
				wireDOM();
				prepareWidgets(); // startWidgetMonitor calls this continuously
				renderWidgets(); // startRendering()calls this continuously
				startWidgetMonitor();
				startRendering();
				// Everything finished successfully, flag as initialized
				initialized = true;
			}
			catch (e) {
				StopManager(e);
			}
		},

		/**
		 * Stack widgets for rendering
		 * @param id
		 * @param widget
		 */
		addWidget: function(id, widget)
		{
			widgets[id] = widget;
		},

		/**
		 * Remove a widget
		 * @param id
		 */
		popWidget: function(id)
		{
			if(widgets[id]) widgets[id] = null;
		},

		changeProject: function(id, project)
		{
			var widget_change = widgets[id];
			widget_change.changeProject(project);
		}
	};

	// Private methods section

	/**
	 * Sets interval which will render widgets.
	 */
	function startRendering()
	{
		logDebug('Rendering Screen');

		refresh = setInterval(function(){
			try {
				renderWidgets();
			} catch (e) {
				StopManager(e);
			}
		}, refreshRate);
	}

	/**
	 * Allows widgets to be added after app is initially set up
	 */
	function startWidgetMonitor()
	{
		logDebug('Starting Widget Monitor');

		monitor = setInterval(function(){
			try {
				prepareWidgets();
			} catch (e) {
				StopManager(e);
			}
		}, monitorInterval);
	}

	/**
	 * Loop through all widgets and run init on them
	 */
	function prepareWidgets()
	{
		console.log(widgets);
		$.each(widgets, function(){
			if (this.notInitialized()) this.init();
		});
	}

	/**
	 * Loop through all widgets and get/display the html of the widget
	 */
	function renderWidgets()
	{
		$.each(widgets, function(key, item){
			if (!item.reference) {
				item.reference = createBox(this.getID(), this.render());
			} else {
				updateBox(item.reference, this.render());
			}
		});
	}

	/**
	 * Create DOM instance of the widget
	 * @param id
	 * @param html
	 * @returns {*|jQuery|HTMLElement}
	 */
	function createBox(id, html)
	{
		logDebug('Creating box ' + id);
		containerElement.append('<div id = "' + id + '" class="col-lg-4">' + html + '</div>');
		return $('#' + id);
	}

	/**
	 * Update DOM instance of the widget
	 * @param element
	 * @param html
	 */
	function updateBox(element, html)
	{
		logDebug('Updating box ' + element.id);
		$(element).html(html);
	}

	/**
	 * Create app container for widgets
	 */
	function createWidgetContainer()
	{
		logDebug('Creating Widget Container');
		widgets = {};
	}

	/**
	 * Connect to widget container
	 */
	function wireDOM()
	{
		containerElement = $('#widget-container');
		if (!containerElement.length) throw "Can't find DOM element for rendering";
	}

	/**
	 * If flag is set to true, throws exception to avoid re-init
	 */
	function isInitialized()
	{
		if (initialized) throw "Already initialized.";
	}

	/**
	 * Stop & clean up
	 * @param e
	 */
	function StopManager(e)
	{
		logDebug('[ERROR] ' + e);
		clearInterval(monitor);
		clearInterval(refresh);
		context = null;
		alert('Codebase Stats Manager needs a restart :(');
	}

	/**
	 * Based on the set debug flag outputs the message to the console
	 * @param message
	 */
	function logDebug(message)
	{
		if (debug) console.dir('CSM:' + message)
	}

})();

// Ready-set-go
$(document).ready(function() {
	redeye.codebaseStatsManager.init();
});