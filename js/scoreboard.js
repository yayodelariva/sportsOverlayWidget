window.onload = init;

function init() {
  var xhr = new XMLHttpRequest(); //AJAX data request sent to server(in this case server being local json file)
  var streamJSON = "../StreamControl/streamcontrol.json"; //specifies path for streamcontrol output json
  var scObj; //variable to hold data extracted from parsed json
  var startup = true; //flag for if looping functions are on their first pass or not
  var animated = false; //flag for if scoreboard animation has run or not
  var cBust = 0; //variable to hold cache busting value
  var game; //variable to hold game value from streamcontrol dropdown
  var p1Wrap = $("#p1Wrapper"); //variables to shortcut copypasting text resize functions
  var p2Wrap = $("#p2Wrapper");
  var rdResize = $("#round");

  xhr.overrideMimeType("application/json"); //explicitly declares that json should always be processed as a json filetype

  function pollJSON() {
    xhr.open("GET", streamJSON + "?v=" + cBust, true); //string query-style cache busting, forces non-cached new version of json to be opened each time
    xhr.send();
    cBust++;
  }

  pollJSON();
  setInterval(function () {
    pollJSON();
  }, 500); //runs polling function twice per second

  xhr.onreadystatechange = parseJSON; //runs parseJSON function every time XMLHttpRequest ready state changes

  function parseJSON() {
    if (xhr.readyState === 4) {
      //loads data from json into scObj variable each time that XMLHttpRequest ready state reports back as '4'(successful)
      scObj = JSON.parse(xhr.responseText);
      if (animated == true) {
        scoreboard(); //runs scoreboard function each time readyState reports back as 4 as long as it has already run once and changed animated value to false
      }
    }
  }

  function scoreboard() {
    if (startup == true) {
      $("#scoreboardVid").attr("src", "../webm/scoreboard_1.webm");

      document.getElementById("scoreboardVid").play(); //plays scoreboard video

      getData(); //runs function that sets data polled from json into html objects
      startup = false; //flags that the scoreboard/getData functions have run their first pass
      animated = true; //flags that the scoreboard video animation has run
    } else {
      getData(); //if startup is not set to true, only the getData function is run each time scoreboard function runs
    }
  }

  setTimeout(scoreboard, 300);

  function getData() {
    var teamLeftName = scObj["teamLeft"]; //creates local variables to store data parsed from json
    var teamRightName = scObj["teamRight"];
    var p1Team = scObj["p1Team"];
    var p2Team = scObj["p2Team"];
    var teamLeftScore = scObj["teamLeftScore"];
    var teamRightScore = scObj["teamRightScore"];
    var round = scObj["round"];

    if (startup == true) {
      TweenMax.set("#p1Wrapper", { css: { x: p1Move } }); //sets name/round wrappers to starting positions for them to animate from
      TweenMax.set("#p2Wrapper", { css: { x: p2Move } });
      TweenMax.set("#round", { css: { y: rdMove } });

      $("#teamLeft").html(teamLeftName); //changes html object values to values stored in local variables
      $("#teamRight").html(teamRightName);
      $("#p1Team").html(p1Team);
      $("#p2Team").html(p2Team);
      $("#teamLeftScore").html(teamLeftScore);
      $("#teamRightScore").html(teamRightScore);
      $("#round").html(round);

      p1Wrap.each(function (i, p1Wrap) {
        //function to resize font if text string is too long and causes div to overflow its width/height boundaries
        while (
          p1Wrap.scrollWidth > p1Wrap.offsetWidth ||
          p1Wrap.scrollHeight > p1Wrap.offsetHeight
        ) {
          var newFontSize =
            parseFloat($(p1Wrap).css("font-size").slice(0, -2)) * 0.95 + "px";
          $(p1Wrap).css("font-size", newFontSize);
        }
      });

      p2Wrap.each(function (i, p2Wrap) {
        while (
          p2Wrap.scrollWidth > p2Wrap.offsetWidth ||
          p2Wrap.scrollHeight > p2Wrap.offsetHeight
        ) {
          var newFontSize =
            parseFloat($(p2Wrap).css("font-size").slice(0, -2)) * 0.95 + "px";
          $(p2Wrap).css("font-size", newFontSize);
        }
      });

      rdResize.each(function (i, rdResize) {
        while (
          rdResize.scrollWidth > rdResize.offsetWidth ||
          rdResize.scrollHeight > rdResize.offsetHeight
        ) {
          var newFontSize =
            parseFloat($(rdResize).css("font-size").slice(0, -2)) * 0.95 + "px";
          $(rdResize).css("font-size", newFontSize);
        }
      });

      TweenMax.to("#p1Wrapper", nameTime, {
        css: { x: "+0px", opacity: 1 },
        ease: Quad.easeOut,
        delay: nameDelay,
      }); //animates wrappers traveling back to default css positions while
      TweenMax.to("#p2Wrapper", nameTime, {
        css: { x: "+0px", opacity: 1 },
        ease: Quad.easeOut,
        delay: nameDelay,
      }); //fading them in, timing/delay based on variables set in scoreboard.html
      TweenMax.to("#round", rdTime, {
        css: { y: "+0px", opacity: 1 },
        ease: Quad.easeOut,
        delay: rdDelay,
      });
      TweenMax.to(".scores", scTime, {
        css: { opacity: 1 },
        ease: Quad.easeOut,
        delay: scDelay,
      });
    } else {
      game = scObj["game"]; //if this is after the first time that getData function has run, changes the value of the local game variable to current json output

      if (
        $("#teamLeft").text() != teamLeftName ||
        $("#p1Team").text() != p1Team
      ) {
        //if either name or team do not match, fades out wrapper and updates them both
        TweenMax.to("#p1Wrapper", 0.3, {
          css: { x: p1Move, opacity: 0 },
          ease: Quad.easeOut,
          delay: 0,
          onComplete: function () {
            //uses onComplete parameter to execute function after TweenMax
            $("#p1Wrapper").css("font-size", nameSize); //restores default font size based on variable set in scoreboard.html
            $("#teamLeft").html(teamLeftName); //updates name and team html objects with current json values
            $("#p1Team").html(p1Team);

            p1Wrap.each(function (i, p1Wrap) {
              //same resize functions from above
              while (
                p1Wrap.scrollWidth > p1Wrap.offsetWidth ||
                p1Wrap.scrollHeight > p1Wrap.offsetHeight
              ) {
                var newFontSize =
                  parseFloat($(p1Wrap).css("font-size").slice(0, -2)) * 0.95 +
                  "px";
                $(p1Wrap).css("font-size", newFontSize);
              }
            });

            TweenMax.to("#p1Wrapper", 0.3, {
              css: { x: "+0px", opacity: 1 },
              ease: Quad.easeOut,
              delay: 0.2,
            }); //fades name wrapper back in while moving to original position
          },
        });
      }

      if (
        $("#teamRight").text() != teamRightName ||
        $("#p2Team").text() != p2Team
      ) {
        TweenMax.to("#p2Wrapper", 0.3, {
          css: { x: p2Move, opacity: 0 },
          ease: Quad.easeOut,
          delay: 0,
          onComplete: function () {
            $("#p2Wrapper").css("font-size", nameSize);
            $("#teamRight").html(teamRightName);
            $("#p2Team").html(p2Team);

            p2Wrap.each(function (i, p2Wrap) {
              while (
                p2Wrap.scrollWidth > p2Wrap.offsetWidth ||
                p2Wrap.scrollHeight > p2Wrap.offsetHeight
              ) {
                var newFontSize =
                  parseFloat($(p2Wrap).css("font-size").slice(0, -2)) * 0.95 +
                  "px";
                $(p2Wrap).css("font-size", newFontSize);
              }
            });

            TweenMax.to("#p2Wrapper", 0.3, {
              css: { x: "+0px", opacity: 1 },
              ease: Quad.easeOut,
              delay: 0.2,
            });
          },
        });
      }

      if ($("#round").text() != round) {
        TweenMax.to("#round", 0.3, {
          css: { opacity: 0 },
          ease: Quad.easeOut,
          delay: 0,
          onComplete: function () {
            //same format as changing names just no change in positioning, only fade in/out
            $("#round").css("font-size", rdSize);
            $("#round").html(round);

            rdResize.each(function (i, rdResize) {
              while (
                rdResize.scrollWidth > rdResize.offsetWidth ||
                rdResize.scrollHeight > rdResize.offsetHeight
              ) {
                var newFontSize =
                  parseFloat($(rdResize).css("font-size").slice(0, -2)) * 0.95 +
                  "px";
                $(rdResize).css("font-size", newFontSize);
              }
            });

            TweenMax.to("#round", 0.3, {
              css: { opacity: 1 },
              ease: Quad.easeOut,
              delay: 0.2,
            });
          },
        });
      }

      if ($("#teamLeftScore").text() != teamLeftScore) {
        //same as round, no postioning changes just fade out, update text, fade back in
        TweenMax.to("#teamLeftScore", 0.3, {
          css: { opacity: 0 },
          ease: Quad.easeOut,
          delay: 0,
          onComplete: function () {
            $("#teamLeftScore").html(teamLeftScore);

            TweenMax.to("#teamLeftScore", 0.3, {
              css: { opacity: 1 },
              ease: Quad.easeOut,
              delay: 0.2,
            });
          },
        });
      }

      if ($("#teamRightScore").text() != teamRightScore) {
        TweenMax.to("#teamRightScore", 0.3, {
          css: { opacity: 0 },
          ease: Quad.easeOut,
          delay: 0,
          onComplete: function () {
            $("#teamRightScore").html(teamRightScore);

            TweenMax.to("#teamRightScore", 0.3, {
              css: { opacity: 1 },
              ease: Quad.easeOut,
              delay: 0.2,
            });
          },
        });
      }
    }
  }
}
