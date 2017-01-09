<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Activity</h3>
    </div>
    <div class="panel-body">
        <div class="list-group">
            @for($i=0; $i<5; $i++)
                <a href="#" class="list-group-item">{{ $events[$i]->title }}</a>
            @endfor
        </div>
    </div>
</div>
