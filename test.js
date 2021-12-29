let database = {
    users: {}
}
database = JSON.parse(`{
    "users": {
      "joe": { "name": "joe", "color": "red", "c": ["1"] },
      "mark": { "name": "mark", "color": "red", "c": [2] },
      "jeff": { "name": "jeff", "color": "red", "c": ["3a"] }
    }
  }`)
const addUser = name => {
    database.users[name] = {
        name: name,
        color: "red",
        c: []
    }
}

// addUser("joe")
// addUser("mark")
// addUser("jeff")
console.log(database)


Object.keys(database.users).forEach(key => {
    database.users[key].c.push(1)
    console.log(database.users[key].c)
})


console.log(database)
