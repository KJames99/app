<template>
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-12" v-if="$gate.isAdminOrAuthor()">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Users Table</h3>
                    <div class="card-tools">
                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="addNewModal">Add New <i class="fas fa-user-plus fa-fw"></i></button>
                        </div>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-nowrap">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate}}</td>
                                <td>
                                    <a href="#" @click="editModal(user)" class="btn btn-info"><i class="fas fa-user-edit"></i></a>
                                    <a href="#" @click="deleteUser(user.id)" class="btn btn-danger"><i class="fas fa-user-minus"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                    <pagination :data="users" @pagination-change-page="getResults"></pagination>
                </div>
            </div>
            <!-- /.card -->
        </div>
    </div>

    <div v-if="!$gate.isAdminOrAuthor()">
        <not-found></not-found>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addNew" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Add new</h5>
            <h5 v-show="editMode" class="modal-title" id="addNewLabel">Update User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form @submit.prevent="editMode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
            <div class="modal-body">
                <div class="form-group">
                    <input v-model="form.name" type="text" name="name" placeholder="Name"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                </div>

                <div class="form-group">
                    <input v-model="form.email" type="email" name="email" placeholder="Email"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                    <has-error :form="form" field="email"></has-error>
                </div>

                <div class="form-group">
                    <input v-model="form.password" type="password" name="password" placeholder="Password"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                    <has-error :form="form" field="password"></has-error>
                </div>

                <div class="form-group">
                    <textarea v-model="form.bio" name="bio" placeholder="Short Bio for user (Optional)"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                    <has-error :form="form" field="bio"></has-error>
                </div>

                <div class="form-group">
                    <select v-model="form.type" name="type"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                        <option value="">Select user role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Standard User</option>
                        <option value="author">Author</option>
                    </select>
                    <has-error :form="form" field="type"></has-error>
                </div>

                <div class="form-group">
                    <input type="file" name="photo" placeholder="Photo"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('photo') }" @change="addPhoto">
                    <has-error :form="form" field="photo"></has-error>
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
                users: {},
                // Create a new form instance
                form: new Form({
                    id       : '',
                    name     : '',
                    email    : '',
                    password : '',
                    type     : '',
                    bio      : '',
                    photo    : ''
                })
            }
        },
        methods: {
            addNewModal() {
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },

            editModal(user) {
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },

            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },

            loadUsers() {
                if (this.$gate.isAdminOrAuthor()){
                    axios.get('api/user').then(({data}) => (this.users = data));
                }
            },

            //Using Base64 for images
            addPhoto(e) {// e == event
                let file = e.target.files[0];// check the first file
                //console.log(file);
                let reader = new FileReader();// New instance

                if(file['size'] < 2111775){ //size < 2mb
                    //Change in base64
                    reader.onloadend = (file) => {
                        console.log('RESULT', 'reader.result');
                        this.form.photo = reader.result; 
                    }
                    reader.readAsDataURL(file);
                }else{
                    swal.fire(
                        'Oups!',
                        'You are uploading a large file.',
                        'error'
                    )
                }
            },

            createUser() {
                this.$Progress.start();

                this.form.post('api/user') //Post the form
                .then(()=>{
                    Fire.$emit('loadInfo');
                    $('#addNew').modal('hide');
                    toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    });
                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                })
                
            },

            updateUser() {
                this.$Progress.start();

                this.form.put('api/user/'+this.form.id)
                .then(()=>{
                    Fire.$emit('loadInfo');
                    $('#addNew').modal('hide');
                    toast.fire({
                        icon: 'success',
                        title: 'User updated successfully'
                    });
                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                });
            },

            deleteUser(id){
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
                        this.form.delete('api/user/'+id) //Send request to the server
                        .then(()=>{
                            Fire.$emit('loadInfo');
                            swal.fire(
                                'Cool!', 
                                'User deleted successfully!', 
                                'success'
                            )
                            // Swal.fire({
                            //   icon: 'success',
                            //   title: 'Cool!',
                            //   text: 'User deleted successfully!'
                            // })
                            this.$Progress.finish();
                        })
                        .catch(()=>{
                            swal.fire(
                                'Oops...', 
                                'You can\'t delete this user', 
                                'error'
                            )
                            this.$Progress.fail();
                        });
                    }
                })
            },
        },

        created() {
            this.loadUsers();
            Fire.$on('loadInfo', () => {
                this.loadUsers()
            });
            // setInterval(() => this.loadUsers(), 3000);
        }
    }
</script>
