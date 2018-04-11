// Practice rewrite without Jquery *in progress*

// window.onload = function() {
//   function get(url) {
//     return new Promise(function(resolve, reject) {
//       var xhttp = new XMLHttpRequest();
//       xhttp.open("GET", url, true);
//       xhttp.onload = function() {
//         if (xhttp.status == 201) {
//           resolve(JSON.parse(xhttp.response));
//         } else {
//           reject(xhttp.statusText);
//         }
//       };
//       xhttp.onerror = function() {
//         reject(xhttp.statusText);
//       };
//       xhttp.send();
//     });

//   }

//   var promise = get("/api/todos");
//   promise.then(function(todos) {
//     todos.forEach(function(todo) {
//       addTodo(todo);
//     });
//   }).catch(function(err) {
//     console.log(err);
//   })

//   function addTodo(todo) {
//     var newTodo = document.createElement("LI");
//     var textNewTodo = document.createTextNode(todo.name);
//     newTodo.appendChild(textNewTodo);
//     document.getElementsByClassName("list")[0].appendChild(newTodo);
//   }
// }; 



//Using Jquery
$(document).ready(function(){
  $.getJSON("/api/todos")
  .then(addTodos)
  
  $('#todoInput').keypress(function(event){
    if(event.which == 13) {
      createTodo();
    }
  });
  
  $('.list').on('click', 'li', function(){
    updateTodo($(this));
  })
  
  $('.list').on('click', 'span', function(e){
    e.stopPropagation();
    removeTodo($(this).parent());
  })
});

function addTodos(todos) {
  //add todos to page here
  todos.forEach(function(todo){
    addTodo(todo);
  });
}

function addTodo(todo){
  var newTodo = $('<li class="task">'+todo.name +' <span>X</span></li>');
  newTodo.data('id', todo._id);
  newTodo.data('completed', todo.completed);
  if(todo.completed){
    newTodo.addClass("done");
  }
  $('.list').append(newTodo);
}

function createTodo(){
  //send request to create new todo
  var usrInput = $('#todoInput').val();
  $.post('/api/todos',{name: usrInput})
  .then(function(newTodo){
    $('#todoInput').val('');
    addTodo(newTodo);
  })
  .catch(function(err){
    console.log(err);
  })
}

function removeTodo(todo){
  var clickedId = todo.data('id');
  var deleteUrl = '/api/todos/' + clickedId; 
  $.ajax({
    method: 'DELETE',
    url: deleteUrl
  })
  .then(function(data){
    todo.remove();
  })
  .catch(function(err){
    console.log(err);
  })
}

function updateTodo(todo){
  var updateUrl = '/api/todos/' + todo.data('id');
  var isDone = !todo.data('completed');
  var updateData = {completed: isDone}
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(function(updatedTodo){
    todo.toggleClass("done");
    todo.data('completed', isDone);
  })
}