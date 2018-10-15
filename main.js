var fetchIterations = 0;
var PIVOTAL_TOKEN = "";

function restore_options() {
  chrome.storage.sync.get({
    pivotalToken: ''
  }, function(items) {
    startScript(items.pivotalToken);
  });
}

function startScript(token) {
  PIVOTAL_TOKEN = token;
  doStuff();
}

function doStuff() {
  var stories = document.querySelectorAll(".story.started, .story.finished");

  if (stories.length == 0) {
    if (fetchIterations < 10) {
      fetchIterations++;
      setTimeout(doStuff, 500);
    }
  } else {
    updateStories(stories);
  }
}

function getHours(timediff) {
  return Math.ceil(timediff / (1000 * 60 * 60));
}

function fromNow(date) {
  return new Date() - date;
}

function updateStory(story, data) {
  var timestamp = data.transitions.find((transition) => transition.state === "started" ).occurred_at;
  var hours = getHours(fromNow(new Date(timestamp)));
  var color;

  if (hours < 24) {
    color = "#21a31f";
  } else if (hours < 48) {
    color = "#d9c21d";
  } else if (hours < 100) {
    color = "#d97c1d";
  } else {
    color = "#a31f1f";
  }

  var timerElement = document.createElement("span");
  timerElement.style = `
    float: right;
    background-color: ${color};
    line-height: 22px;
    font-weight: 600;
    margin: 0 0 0 2px;
    display: inline-block;
    font-size: 11px;
    text-align: center;
    min-width: 28px;
    padding: 0 3px 0 3px;
    border-radius: 3px;
    color: white;
  `;
  var text = document.createTextNode(hours + "h");
  timerElement.appendChild(text);

  var finish = story.querySelector(".button.state");
  finish.parentElement.appendChild(timerElement);
}


function updateStories(stories) {
  stories.forEach((story) => {
    var req = new XMLHttpRequest();
    var storyId = story.attributes["data-id"].value;
    req.open("GET", `https://www.pivotaltracker.com/services/v5/stories/${storyId}?fields=transitions`);
    req.setRequestHeader("X-TrackerToken", PIVOTAL_TOKEN);

    req.onreadystatechange = function() {
      if(req.readyState === 4 && req.status === 200) {
        updateStory(story, JSON.parse(req.response));
      }
    };

    req.send();
  })
}

doStuff();
