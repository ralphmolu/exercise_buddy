var ytAPIKeyDan = 'AIzaSyB9d1Cst7FLimdflVD7dDzQFe6k09qyzsE';
var ytAPIKeyRalph = 'AIzaSyDN2x7IWfitTATr3ByxdWJnBLycKq_T19k';
var searchQuery = 'drake'
var ytAPI = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchQuery}&key=${ytAPIKeyRalph}`
var ytLink = 'https://www.youtube.com/watch?v='

var exNinApiKey = '38bf2ea7dbmsh996e21bb45906dbp14c699jsn856b582ec0ba'
var muscle = 'neck'
var exNinApi = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=' + muscle
var exNinApiHost = 'exercises-by-api-ninjas.p.rapidapi.com'

// Info on search queries here: https://developers.google.com/youtube/v3/docs/search/list#usage. click on '</>' icon by 'list (by keyword)

function parseVidIds(data) {
    data.items.forEach(function (video) {
        var videoId = video.id.videoId
        var videoTitle = video.snippet.title
        if (video.id.kind === 'youtube#video') {
            console.log(videoTitle + ": " + (ytLink + videoId))
        } else {
            return
        }
    })
}
// Fetch the YT API data
fetch(ytAPI)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        parseVidIds(data)
    })

// Fetch the Exercise API data
fetch(exNinApi, {
    headers: {
        'X-RapidAPI-Key': exNinApiKey,
        'X-RapidAPI-Host': exNinApiHost
    }
})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    })


//event Listeners for the drop down menus in the HomePage
$(document).ready(function () {
    $(".dropdown-trigger").click(function () {
        $(".dropdown").toggleClass("is-active")
    })

})