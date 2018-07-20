
//code to import the key.js file
require("dotenv").config();
const fs = require("fs");
const request = require("request");
const keys = require("./keys.js");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");


//access key information
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//take in arguments on the command line
let action = process.argv[2];
let parameter = process.argv.slice(3).join(" ");
const twitterParams = { screen_name: "Kevin43531293", count: 20 };
console.log(`Parameter: ${parameter}`)
switch (action) {
    case 'my-tweets':
        getTweets();
        break;
    case 'spotify-this-song':
        getSong(parameter);
        break;
    case 'movie-this':
        getMovie(parameter);
        break;
    case 'do-what-it-says':
        doWhatItsSays();
        break;
};

//Twitter
function getTweets() {
    client.get("statuses/user_timeline", twitterParams, function (err, tweets, response) {
        // console.log(tweets);
        if (!err) {
            //for loop
            for (i = 0; i < tweets.length; i++) {
                console.log("tweet: " + tweets[i].text);
                console.log("created at: " + tweets[i].created_at);

            }
        } else {
            console.log(err)
        }
    });
    // break;
};

//Spotify


function getSong(parameter) {
    console.log("test");
    var searchSong;
    if (!parameter) {
        searchSong = "The Sign";
    } else {
        searchSong = parameter;
    }
    console.log(`searchSong: ${searchSong}`)
    spotify.search(
        {
            type: "track",
            query: searchSong
        },
        function (err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            var track = data.tracks.items[0];

            // console.log(JSON.stringify(track, null, 2))

            //format and print the relevant info to the screen
            console.log("~~~~~~~~~~LIRI Results~~~~~~~~~~");
            console.log("Artist(s): " + track.artists[0].name);
            console.log("Song Name: " + track.name);
            console.log("Song Preview: " + track.preview_url);
            console.log("Album Name: " + track.album.name);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
    );
};

//OMDB
function getMovie(parameter) {
    console.log("I love the holiday!");

    var searchMovie;
    console.log("Search Movie before:", parameter)
    if (!parameter) {
        searchMovie = "Mr. Nobody";
    } else {
        searchMovie = parameter;
    };
    console.log("Search Movie: ", searchMovie)
    // var queryurl = "http://www.omdbapi.com/?t" + searchMovie + "&y=&plot=short&apikey=a2fea8ff";
    // var queryurl =
    //     "http://www.omdbapi.com/?apikey=trilogy&?t=" + searchMovie + "&y=&plot=short";
    // console.log(queryurl);
    // // http://www.omdbapi.com/?apikey=trilogy&?t=" + searchMovie +"&y=&plot=short
    // request(queryurl, function (err, response, body) {
    //     if (err && response.statusCode === 200)

    //     console.log("Title: " + JSON.parse(body).Title);
    //     console.log("Release Year: " + JSON.parse(body).Year);
    //     console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    //     console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Rating);
    //     console.log("Country: " + JSON.parse(body).Country);
    //     console.log("Language: " + JSON.parse(body).Language);
    //     console.log("Plot: " + JSON.parse(body).Plot);
    //     console.log("Actors: " + JSON.parse(body).Actors);
    // });

    ///new code
    var urlHit = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(urlHit, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);

            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        } else {
            console.log("Oh no!  Something went wrong!!")
        }
    })

};


//Do what it says
function doWhatItsSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            return console.log("Error: " + err);
        }
        var output = data.split(",");
        console.log(output[0]);
        action = output[0]
        console.log(output[1]);
        parameter = output[1]

          if (action === "my-tweets"){
            getTweets()

        } else if (action === "spotify-this-song") {
            getSong(parameter)
            console.log("test1");
        }  
        else if (action === "movie-this") {
            getMovie(parameter)
        };

        for (i = 0; i < output.length; i++) {
            console.log(output[i]);
        };
    });
}

