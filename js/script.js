var ytAPIKeyDan = 'AIzaSyB9d1Cst7FLimdflVD7dDzQFe6k09qyzsE';
var ytAPIKeyRalph = 'AIzaSyDN2x7IWfitTATr3ByxdWJnBLycKq_T19k';
var searchQuery = 'drake'
var ytAPI = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchQuery}&key=${ytAPIKeyRalph}`
var ytLink = 'https://www.youtube.com/watch?v='

var exNinApiKey = '38bf2ea7dbmsh996e21bb45906dbp14c699jsn856b582ec0ba'
var muscle = 'neck'
var exNinApi = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=' + muscle
var exNinApiHost = 'exercises-by-api-ninjas.p.rapidapi.com'

var exNameHeader = $('#exercise-name-header')

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
    },
})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        // TEMPORARY: Using the following two lines to test functionality of exercise list generator
        exList = data
        genExList()
    })


//event Listeners for the drop down menus in the HomePage
$(document).ready(function () {

    $(".dropdown-trigger button").click(function () {
        $(this).closest(".dropdown").toggleClass("is-active");

        // close other dropdowns by removing the is-active class on the other dropdowns
        $('.dropdown').not($(this).closest('.dropdown')).removeClass('is-active');
    })

})

// [feature/gen-ex-list] start
// Creating code to generate a list of 10 exercises based on user selection

var resultsListEl = $('#results-list')

// This var will hold the 10 matches based on user criteria. At the moment, the matching functionality has not been created.
var exList


function genExList() {
    exList.forEach(function (result) {
        // Text of each list item/button will be the title of the exercise. 
        var resultButtonEl = $('<button>').text(result.name).attr('data-exercise', result.name).addClass('button is-link m-2 exercise-list-item')
        resultsListEl.append(resultButtonEl)
    })
}

// [feature/gen-ex-list] end

// [feature/nav-to-instruction] start
resultsListEl.click(function (event) {
    var clickedEl = $(event.target)
    if ((clickedEl.attr('class').includes('button'))) {
        var clickedName = clickedEl.attr('data-exercise')
        addToRecents(clickedName)
        var instructHTML = '/pages/Instruct.html'
        localStorage.setItem('exercise-picked', clickedName)
        window.location.replace(instructHTML)
    } else {
        console.log('not button')
        return
    }
})

addExTitle()
function addExTitle() {
    var exNameHeader = $('#exercise-name-header')
    var pickedExercise = localStorage.getItem('exercise-picked')
    exNameHeader.text(pickedExercise)
}

function addToRecents(exercise) {
    var recentsArray=(JSON.parse(localStorage.getItem('recents')))||[]
    recentsArray.push(exercise)
    localStorage.setItem('recents',JSON.stringify(recentsArray))

}
// [feature/nav-to-instruction] end
