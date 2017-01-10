{{--{{ dd($statistics)  }}--}}
<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Tickets Activity</h3>
    </div>
    <div class="panel-body">
        <div id="redeyechart" style="height: 250px;"></div>
        </div>
    </div>
</div>

<script>
     var my_obj_data = <?php echo $statistics; ?>;
     var template = [
         {"time": "2017-01-10 00:00:00", "tickets": 20, "solved": 17},
         {"time": "2017-01-10 01:00:00", "tickets": 17, "solved": 17},
         {"time": "2017-01-10 02:00:00", "tickets": 20, "solved": 18},
         {"time": "2017-01-10 03:00:00", "tickets": 24, "solved": 18},
         {"time": "2017-01-10 04:00:00", "tickets": 19, "solved": 18},
         {"time": "2017-01-10 05:00:00", "tickets": 18, "solved": 14},
         {"time": "2017-01-10 06:00:00", "tickets": 17, "solved": 16},
         {"time": "2017-01-10 07:00:00", "tickets": 17, "solved": 15},
         {"time": "2017-01-10 08:00:00", "tickets": 17, "solved": 15},
         {"time": "2017-01-10 09:00:00", "tickets": 17, "solved": 15},
         {"time": "2017-01-10 10:00:00", "tickets": 15, "solved": 13},
         {"time": "2017-01-10 11:00:00", "tickets": 15, "solved": 13},
         {"time": "2017-01-10 12:00:00", "tickets": 15, "solved": 13},
         {"time": "2017-01-10 13:00:00", "tickets": 16, "solved": 14},
         {"time": "2017-01-10 14:00:00", "tickets": 17, "solved": 18},
         {"time": "2017-01-10 15:00:00", "tickets": 15, "solved": 13},
         {"time": "2017-01-10 16:00:00", "tickets": 15, "solved": 13},
         {"time": "2017-01-10 17:00:00", "tickets": 14, "solved": 12},
         {"time": "2017-01-10 18:00:00", "tickets": 15, "solved": 14},
         {"time": "2017-01-10 19:00:00", "tickets": 10, "solved": 10},
         {"time": "2017-01-10 20:00:00", "tickets": 14, "solved": 12},
         {"time": "2017-01-10 21:00:00", "tickets": 17, "solved": 17},
         {"time": "2017-01-10 22:00:00", "tickets": 20, "solved": 19},
         {"time": "2017-01-10 23:00:00", "tickets": 21, "solved": 19}
     ];

     var options = {
         element: 'redeyechart',
         data: template,
         xkey: 'time',
         ykeys: ['tickets', 'solved'],
         xLabels: 'hour',
         labels: ['Tickets Raised', 'Tickets Solved'],
         lineColors:['lightgreen','gray']
     };
    var stats_obj = new Morris.Line(options);
</script>