// Saves options to chrome.storage
function save_options() {
  document.getElementById("save").classList.add("onclic");
  var token = document.getElementById('token').value;
  setTimeout(function() {
    chrome.storage.sync.set({
      pivotalToken: token
    }, function() {
      document.getElementById("save").classList.remove("onclic");
      document.getElementById("save").classList.add("validate");
      setTimeout(function() {
        document.getElementById("save").classList.remove("validate");
      }, 550);
    });
  }, 550);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    pivotalToken: ''
  }, function(items) {
    document.getElementById('token').value = items.pivotalToken;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);
