<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Codebase Activity</h3>
    </div>
    <div class="panel-body">
        <div class="list-group">
            @foreach($events as $event)
                <a href="#" class="list-group-item">{{ $event->title }}</a>
            @endforeach
        </div>
    </div>
</div>
