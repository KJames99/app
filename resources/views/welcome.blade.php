@extends('layouts.app')

@section('content')
    <div class="container">
        <h3 class="text-center my-5">All Posts</h3>
        <div class="row">
            @if ($posts)
                @foreach ($posts as $post)
                    <div class="col-md-3 col-lg-4">
                        <div class="card">
                          <div class="card-header">
                            <div class="text-center">
                                <b>{{$post['title']}}</b>
                            </div>
                          </div>
                          <div class="card-body">
                            <p class="card-text">{{$post['content']}}</p>
                          </div>
                          <div class="card-footer">
                              <div class="float-left">
                                  <u><b>Author</b></u>: {{$post->users->name}}
                              </div>
                              <div class="float-right">
                                  <u><b>Post date</b></u>: {{format_date($post->created_at)}}
                              </div>
                          </div>
                        </div>
                    </div>
                @endforeach
            @else
                <h4 class="text-center">There is no posts right now. Please log on and make post.</h4>
            @endif
        </div> 
    </div>  
@endsection