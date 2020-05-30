<template>
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">My Posts Table</h3>
                    <div class="card-tools">
                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="addNewModal">Add New Post <i class="fas fa-plus fa-fw"></i></button>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-nowrap">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="post in posts.data" :key="post.id">
                                <td>{{post.id}}</td>
                                <td>{{post.title}}</td>
                                <td>{{post.content}}</td>
                                <td>
                                    <a href="#" @click="editModal(post)" class="btn btn-info"><i class="fas fa-layer-group"></i></a>
                                    <a href="#" @click="deletePost(post.id)" class="btn btn-danger"><i class="fas fa-minus"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                    <pagination :data="posts" @pagination-change-page="getResults"></pagination>
                </div>
            </div>
            <!-- /.card -->
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addNew" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add new Post</h5>
            <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update Post</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form @submit.prevent="editMode ? updatePost() : createPost()" @keydown="form.onKeydown($event)">
            <div class="modal-body">
                <div class="form-group">
                    <input v-model="form.title" type="text" name="title" placeholder="Title"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('title') }">
                    <has-error :form="form" field="title"></has-error>
                </div>

                <div class="form-group">
                    <textarea v-model="form.content" name="content" placeholder="Content"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('content') }"></textarea>
                    <has-error :form="form" field="content"></has-error>
                </div>

            </div>   
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="!editMode" type="submit" class="btn btn-success">Create</button>
              <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</div>
</template>

<script>
    export default {
        data () {
            return {
                editMode : false,
                posts: {},
                // Create a new form instance
                form: new Form({
                    id      : '',
                    title   : '',
                    content : '',
                })
            }
        },
        methods: {
            addNewModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editModal(post) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(post);
            },

            getResults(page = 1) {
                axios.get('api/post?page=' + page)
                    .then(response => {
                        this.posts = response.data;
                    });
            },

            loadPosts() {
                axios.get('api/post').then(({data}) => (this.posts = data));
            },

            createPost() {
                this.$Progress.start();

                this.form.post('api/post') //Post the form
                .then(()=>{
                    Fire.$emit('loadInfo');
                    $('#addNew').modal('hide');
                    toast.fire({
                        icon: 'success',
                        title: 'Post created successfully'
                    });
                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                })
                
            },

            updatePost() {
                this.$Progress.start();

                this.form.put('api/post/'+this.form.id)
                .then(()=>{
                    Fire.$emit('loadInfo');
                    $('#addNew').modal('hide');
                    toast.fire({
                        icon: 'success',
                        title: 'Post updated successfully'
                    });
                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                });
            },

            deletePost(id){
                swal.fire({
                    title              : 'Are you sure?',
                    text               : "You won't be able to revert this!",
                    icon               : 'warning',
                    showCancelButton   : true,
                    confirmButtonColor : '#3085d6',
                    cancelButtonColor  : '#d33',
                    confirmButtonText  : 'Yes, delete it!'
                })
                .then((result) => {
                    if (result.value) { //If clicking on Yes
                        this.$Progress.start();
                        this.form.delete('api/post/'+id) //Send request to the server
                        .then(()=>{
                            Fire.$emit('loadInfo');
                            swal.fire(
                                'Yeah...', 
                                'Post deleted successfully', 
                                'success'
                            )
                            this.$Progress.finish();
                        })
                        .catch(()=>{
                            swal.fire(
                                'Oops...', 
                                'You can\'t delete this post', 
                                'error'
                            )
                            this.$Progress.fail();
                        });
                    }
                })
            },
        },

        created() {
            this.loadPosts();
            Fire.$on('loadInfo', () => {
                this.loadPosts()
            });
        }
    }
</script>
