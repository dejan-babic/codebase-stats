(function(){
    // Sanity check before show starts
    if(!redeye.codebaseStatsManager) return;

    /**
     * Widget that wraps a call to '/api/tickets/all' endpoint.
     * The render method returns html for the manager to
     * display.
     * @type {{rawData, init, getID, notInitialized, render}}
     */
    var TicketsStatsWidget = (function(){

        // Helpers
        var context;
        var interval;

        // Flags
        var debug = true;
        var initialized = false;

        var project = "contour";
        var base_path = '/api/tickets/stats/';

        // Params
        var refreshAfter = 1000 * 60 * 1500; //milliseconds
        var id = 'tickets-stats-widget';
        var codebaseEndpoint = "";

        // Exposed methods
        return {

            rawData: null,
            html: null,

            /**
             * Prepare the manager
             */
            init: function()
            {
                logDebug('Initializing Tickets');
                try {
                    // Set reference to manager
                    context = this;
                    // Run set of commands to prepare the app
                    this.renderCodebaseEndpoint();
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
                return  this.html ? this.html : 'Tickets Widget';
            },

            changeProject: function(project_id){
                project = project_id;
                initialized = false;
                this.init();
            },

            renderCodebaseEndpoint: function(){
                codebaseEndpoint = base_path + project;
            }
        };

        // Private methods section


        /**
         * Call to the '/api/tickets/all' endpoint
         */
        function fetchData()
        {
            logDebug('Getting latest data for /api/tickets/all');

            $.ajax(codebaseEndpoint, {
                'method': 'GET'
            }).done(function(data){
                context.rawData = data.raw_data;
                context.html = data.html;
                logDebug('Data was successfully retrieved for /api/tickets/all');
            }).fail(function(data){
                logDebug('Cant get back data for /api/tickets/all');
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
            interval = setTimeout(function(){
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
            if (debug) console.dir('TicketsWidget:' + message)
        }

    })();

    // Ready-set-go
    $(document).ready(function() {
        // Add widget to manager
        redeye.codebaseStatsManager.addWidget(TicketsStatsWidget.getID(), TicketsStatsWidget);
    });
})();

