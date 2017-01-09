// Sanity check before show starts
if(!redeye) var redeye = {};

/**
 * Manager is a system wrapper for all widgets, and it is responsible for initialising and rendering them, and registering
 * time loops (intervals) in which those widgets are refreshed. The widgets themselves are responsible for
 * getting and parsing the data. An widget object should be added to the manager by the addWidget 
 * command and after that the manager takes care of the rest.
 * @type {{init, addWidget, popWidget}}
 */
redeye.codebaseStatsManager = (function(){

	// Helpers
	var context;
	var widgets;
	var containerElement;
	var titleElement;

	// Flags
	var debug = true;
	var initialized = false;

	// Parameters
	var addWidgetEvent = 'csm-widget-added';

	// General config object
	var screens = [
		{
			name: 'API Project',

			widgets:[
				{
					name: 'Activity', // Name to display on widget
					endpoint: '/activity/all', // Endpoint on laravel app (Codebase API Wrapper)
					project: 'API', // Additional data sent to laravel app (Codebase API Wrapper)
					refreshRate: 1 // Minutes for widget auto refresh
				}
			]
		}
	];


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
				registerListeners();
				startScreenSwitcher();
				
				// Everything finished successfully, flag as initialized
				initialized = true;
			}
			catch (e) {
				StopManager(e);
			}
		},

		/**
		 * Stack widgets for rendering
		 * @param widget
		 */
		addWidget: function(widget)
		{
			logDebug('Adding new widget: ' + widget.getID());
			// add widget to container
			widgets[widget.getID()] = widget;
			// fire event that will trigger rendering
			var addEvent = new Event(addWidgetEvent);
			document.dispatchEvent(addEvent);
		},

		/**
		 * Remove a widget
		 * @param id
		 */
		popWidget: function(id)
		{
			if(widgets[id]) widgets[id] = null;
		}
	};

	// Private methods section

	/**
	 * Loop through all widgets and run init on them
	 */
	function prepareWidgets()
	{
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

			item.domBox = item.domBox ? item.domBox : createBox(item);

		});
	}

	/**
	 * Create DOM instance of the widget
	 * @param widget
	 * @returns {*|jQuery|HTMLElement}
	 */
	function createBox(widget)
	{
		logDebug('Creating box ' + widget.getID());

		var html = widget.getHtml();
		containerElement.append('<div id = "' + widget.getID() + '" class="col-lg-4">' + html + '</div>');
		return $('#' + widget.getID());
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
		logDebug('Wiring DOM Elements');

		containerElement = $('#widget-container');
		titleElement = $('#csm-title');

		if (!containerElement.length) throw "Can't find widget container in the DOM";
		if (!titleElement.length) throw "Can't find manager title in the DOM";
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
		context = null;
		alert('Codebase Stats Manager needs a restart :(');
	}

	/**
	 * Register listeners for manager events
	 */
	function registerListeners()
	{
		logDebug('Registering event listeners');

		document.addEventListener(addWidgetEvent, function(){
			prepareWidgets();
			renderWidgets();
		});
	}

	/**
	 * Loop through all configured screens
	 */
	function startScreenSwitcher()
	{
		logDebug('Starting Screen Switcher');

		var numberOfScreens = screens.length;
		var index = 1;
		prepareScreen(screens[index-1]);
		var screenLoop = setInterval(function(){

			prepareScreen(screens[index]);
			index++;

			if (index >= numberOfScreens) index = 0;

		}, 100000);
	}

	function prepareScreen(screen)
	{
		createWidgetContainer();
		containerElement.html('').animate({left:'250px'});
		titleElement.html(screen.name);
		$.each(screen.widgets, function(key, item){
			context.addWidget(context.CodebaseWidget(item));
		})
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