const todos = [];
let command = prompt('Input A Command').toLowerCase();
while (command !== 'quit' && command !== 'q') {
  if (command === 'new') {
    let todo = prompt('Input New TODO Item:');
    todos.push(todo);
    console.log(`${todo} added to the list`);
    command = prompt('Input A Command').toLowerCase();
  } else if (command === 'list') {
    const length = todos.length;
    console.log('******');
    for (let i = 0; i < length; i++) {
      console.log(`${i + 1}:  ${todos[i]}`);
    }
    console.log('******');
    command = prompt('Input A Command').toLowerCase();
  } else if (command === 'delete') {
    let length = todos.length;
    let index = parseInt(prompt('Which number to delete?')) - 1;
    while (index > length || index < 0 || !index) {
      index = parseInt(prompt('ENTER A VALID NUMBER ON YOUR LIST!!')) - 1;
    }
    const deleted = todos.splice(index, 1);
    console.log(`OK, removed ${deleted[0]} from your list`)
    length = todos.length;
    console.log('******');
    for (let i = 0; i < length; i++) {
      console.log(`${i + 1}:  ${todos[i]}`);
    }
    console.log('******');
    command = prompt('Input A Command').toLowerCase();
  } else {
    command = prompt('Unknown Command, Input A VALID Command!!').toLowerCase();
  }
}
console.log('YOU HAVE QUIT THE APP');
