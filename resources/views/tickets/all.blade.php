<div class="panel panel-primary">
    <div class="panel-heading">
        <h3 class="panel-title">Tickets</h3>
    </div>
    <div class="panel-body">
        <div class="list-group">
            @for($i=0; $i<5; $i++)
                @if(isset($tickets[$i]))
                <a href="#" class="list-group-item">
                    <span>{{ $tickets[$i]->summary }}</span><br/>
                    <span class="label label-info">{{ $tickets[$i]->type->name }}</span>
                    <span class="label label-primary">{{ $tickets[$i]->status->name }}</span>
                </a>
                @endif
            @endfor
        </div>
    </div>
</div>