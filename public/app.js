// Practice rewrite without Jquery 
window.onload = function() {  

  // calls function to get all todos from database then adds them to html via DOM
  var whenTodosReturned = get("/api/todos");
  whenTodosReturned.then(function(todos) {
    todos.forEach(function(todo) {
      addTodo(todo);
    });
  }).catch(function(err) {
    console.log(err);
  });

  // input listener 
  document.getElementById("todoInput").addEventListener("keypress", function(event) {  

    if(event.which === 13) {
      console.log("Enter pressed");
      
      var whenTodoCreated = createTodo("/api/todos");
      whenTodoCreated.then(function(createdTodo) {
        // clearing input form after new todo created
        document.getElementById("todoInput").value = "";        
        addTodo(createdTodo);        
      }).catch(function(err) {
        console.log(err);
      });

      
    }
  });

  

 
    






}; 
// end window onload function

// return promise to complete http request to database api for all current todos 
function get(url) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.onload = function() {
      if (xhttp.status == 200) {
        resolve(JSON.parse(xhttp.response));
      } else {
        reject(xhttp.statusText);
      }
    };
    xhttp.onerror = function() {
      reject(xhttp.statusText);
    };
    xhttp.send();
  });

}

// add todo element to html via the DOM
function addTodo(todo) {
  var newTodo = document.createElement("LI");

  // var textNewTodo = document.createTextNode(todo.name);
  // newTodo.innerHTML = todo.name + "<span id=" + todo._id + " onClick='deleteTodo(this)'>X</span>";
  newTodo.innerHTML = todo.name + "<span onClick='deleteTodo(this)'>X</span>";

  // newTodo.appendChild(textNewTodo);
  newTodo.setAttribute("class", "task"); 
  console.log(todo._id);
  // newTodo.setAttribute("id", todo._id);
  newTodo.setAttribute("onClick", "updateTodo(this)")   
  newTodo.completed = todo.completed;
  newTodo.id = todo._id;

  if(todo.completed) {
    newTodo.setAttribute("class", "done");    
  }
  
  console.log(newTodo);
  console.log(newTodo.completed);
  
  document.getElementsByClassName("list")[0].appendChild(newTodo);
  
}

// click event listener to update todo completion status
function updateTodo(clickedTodo) {

  event.stopPropagation();
  
  // then send request to update completion status of todo in database
  var xhttp = new XMLHttpRequest();
  console.log(clickedTodo.completed + "completion status");
  var payload = {completed: !clickedTodo.completed};  

  console.log(payload);
  var url = "/api/todos/" + clickedTodo.id;
  console.log(url);
  xhttp.open("PUT", url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json'); 
  xhttp.onload = function() {
    if (xhttp.status == 200) {
      response = JSON.parse(xhttp.response);
      clickedTodo.completed = !clickedTodo.completed;
      clickedTodo.classList.toggle("done");      

      console.log(response);
    } else {
      console.log(xhttp.statusText);
    }
  };    
  console.log(payload);
  xhttp.send(JSON.stringify(payload)); 


 
    

}

// click event listener for X, deletes todo from page as well as database
function deleteTodo(clickedOn) {

  event.stopPropagation();
  clickedOn.parentNode.parentNode.removeChild(clickedOn.parentNode);

  var xhttp = new XMLHttpRequest();
  var url = "/api/todos/" + clickedOn.parentNode.id;
  console.log(url);
  xhttp.open("DELETE", url, true);
  xhttp.onload = function() {
    if (xhttp.status == 200) {
      response = JSON.parse(xhttp.response);
      console.log(response.message);
    } else {
      console.log(xhttp.statusText);
    }
  };    
  xhttp.send();  
}

// return promise to create new todo in database via a POST req
function createTodo(url) {
  
  return new Promise(function(resolve, reject) {
  
    var xhttp = new XMLHttpRequest();
    var usrInput = document.getElementById("todoInput").value;
    var payload = {name: null};
    payload.name = usrInput;
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');  
    xhttp.onload = function() {
      if (xhttp.status == 201) {      
        resolve(JSON.parse(xhttp.response));
        
      } else {
        console.log(xhttp.statusText);
      }      
    };
    xhttp.onerror = function() {
        reject(xhttp.statusText);
      };
    xhttp.send(JSON.stringify(payload));    
  });
}





//Using Jquery
// $(document).ready(function(){
//   $.getJSON("/api/todos")
//   .then(addTodos)
  
//   $('#todoInput').keypress(function(event){
//     if(event.which == 13) {
//       createTodo();
//     }
//   });
  
//   $('.list').on('click', 'li', function(){
//     updateTodo($(this));
//   })
  
//   $('.list').on('click', 'span', function(e){
//     e.stopPropagation();
//     removeTodo($(this).parent());
//   })
// });

// function addTodos(todos) {
//   //add todos to page here
//   todos.forEach(function(todo){
//     addTodo(todo);
//   });
// }

// function addTodo(todo){
//   var newTodo = $('<li class="task">'+todo.name +' <span>X</span></li>');
//   newTodo.data('id', todo._id);
//   newTodo.data('completed', todo.completed);
//   if(todo.completed){
//     newTodo.addClass("done");
//   }
//   $('.list').append(newTodo);
// }

// function createTodo(){
//   //send request to create new todo
//   var usrInput = $('#todoInput').val();
//   $.post('/api/todos',{name: usrInput})
//   .then(function(newTodo){
//     $('#todoInput').val('');
//     addTodo(newTodo);
//   })
//   .catch(function(err){
//     console.log(err);
//   })
// }

// function removeTodo(todo){
//   var clickedId = todo.data('id');
//   var deleteUrl = '/api/todos/' + clickedId; 
//   $.ajax({
//     method: 'DELETE',
//     url: deleteUrl
//   })
//   .then(function(data){
//     todo.remove();
//   })
//   .catch(function(err){
//     console.log(err);
//   })
// }

// function updateTodo(todo){
//   var updateUrl = '/api/todos/' + todo.data('id');
//   var isDone = !todo.data('completed');
//   var updateData = {completed: isDone}
//   $.ajax({
//     method: 'PUT',
//     url: updateUrl,
//     data: updateData
//   })
//   .then(function(updatedTodo){
//     todo.toggleClass("done");
//     todo.data('completed', isDone);
//   })
// }