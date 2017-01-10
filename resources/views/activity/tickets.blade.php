<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Tickets Activity</h3>
    </div>
    <div class="panel-body">
        @foreach($projects as $key=>$project)
                <button id="project-name" type="button" onclick="redeye.codebaseStatsManager.changeProject('tickets-widget','{{ $project }}')" class="btn btn-default">{{ $key }}</button>
        @endforeach

        <div class="list-group">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($tickets as $ticket)
                        <tr>
                            <td class="strokeme" style="background-color:{{ $ticket->status->colour }}">{{ $ticket->status->name }}</td>
                            <td>{{ $ticket->type->name }}</td>
                            <td>{{ $ticket->summary }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>