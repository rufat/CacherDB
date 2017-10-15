let CacherDB = require('./index.js');

let cache = new CacherDB({
    letDuplicate: false,
    autoSave: true,
    file: 'data.json'
});

cache.put("dbFirst", "Insert 1");
cache.put("dbFirst", "Insert 2");
cache.put("dbSecond", "Insert 3");

console.log(cache.getAll());