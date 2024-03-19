var ytAPIKeyDan = 'AIzaSyB9d1Cst7FLimdflVD7dDzQFe6k09qyzsE';
var ytAPIKeyRalph = 'AIzaSyDN2x7IWfitTATr3ByxdWJnBLycKq_T19k';
var searchQuery = 'drake'
var ytAPI = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchQuery}&key=${ytAPIKeyRalph}`
var ytLink = 'https://www.youtube.com/watch?v='

var exNinApiKey = '38bf2ea7dbmsh996e21bb45906dbp14c699jsn856b582ec0ba'
// var muscle = 'neck'
var exNinApi = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises'
var exNinApiHost = 'exercises-by-api-ninjas.p.rapidapi.com'
var userChoice = [];

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
function fetchYT() {
    fetch(ytAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            parseVidIds(data)
        })
}

//event Listeners for the drop down menus in the HomePage
$(document).ready(function () {

    $(".dropdown-trigger button").click(function () {
        $(this).closest(".dropdown").toggleClass("is-active");

        // close other dropdowns by removing the is-active class on the other dropdowns
        $('.dropdown').not($(this).closest('.dropdown')).removeClass('is-active');
    })

    //event listener on drop-down item to populate main drop down with clicked item
    $(".dropdown-item").click(function () {
        var dropdownItemText = $(this).text();
        $(this).closest(".dropdown").removeClass("is-active").find("button span").eq(0).text(dropdownItemText);
    })

    //collapse dropdown(s) when clicking away from them
    $(document).click(function (event) {
        if (!$(event.target).closest(".dropdown").length) {
            $(".dropdown").removeClass("is-active");
        }
    })

    //eventlistener for find exercises button
    $("#find-ex-btn").click(function () {
        // [feature/find-btn-gen] I changed/ added these 3 lines
        exNinApi = updateExNinAPIUrl();
        fetchEx(exNinApi)

    })

})

// [feature/gen-ex-list] start
// Creating code to generate a list of 10 exercises based on user selection

var resultsListEl = $('#results-list')

// This var will hold the 10 matches based on user criteria. At the moment, the matching functionality has not been created.
var exList


function genExList(data) {
    data.forEach(function (result) {
        // Text of each list item/button will be the title of the exercise. 
        var resultButtonEl = $('<button>').text(result.name).attr('data-exercise', result.name).addClass('button is-link m-2 exercise-list-item')
        resultsListEl.append(resultButtonEl)
    })
}

// [feature/gen-ex-list] end


// [feature/find-btn-gen] I added .trim(). Don't forget to remove, as this is Ralph's code
//update API based on user choices
function updateExNinAPIUrl() {
    var baseURL = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises`;
    userChoice = []; // empty array that will store user choices

    var exType = "";
    var muscle = "";
    var difficulty = "";

    //check the text in the main/default dropdown box and store it in variables
    if ($("#ex-main").text() !== 'Choose exercise type here') {
        exType = $("#ex-main").text().toLowerCase();
        userChoice.push('type=' + exType.trim());
    }
    if ($("#muscle-main").text() !== 'Choose muscle group here') {
        muscle = $("#muscle-main").text().toLowerCase();
        userChoice.push('muscle=' + muscle.trim());
    }
    if ($("#difficulty-main").text() !== 'Choose difficulty here') {
        difficulty = $("#difficulty-main").text().toLowerCase();
        userChoice.push('difficulty=' + difficulty.trim());
    }

    var exNinApi;
    if (userChoice.length > 0) {
        exNinApi = baseURL + "?" + userChoice.join('&');
    } else {
        exNinApi = baseURL;
    }
    console.log(exNinApi)
    // [feature/find-btn-gen] I added this return line
    return exNinApi

}
// [feature/nav-to-instruction] start
resultsListEl.click(function (event) {
    var clickedEl = $(event.target)
    if ((clickedEl.attr('class').includes('button')) === true) {
        var clickedName = clickedEl.attr('data-exercise')
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
// [feature/nav-to-instruction] end

// // Fetch the Exercise API data
// [feature/find-btn-gen start] turning this into a function that can be called when needed
function fetchEx(newUrl) {
    fetch(newUrl, {
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
            storeFetchEx(data)
            window.location.href = "pages/Exercises.html"
        })
}

function storeFetchEx(data) {
    localStorage.setItem('thisFetchEx', JSON.stringify(data))
}
function retrieveFetchEx() {
    return JSON.parse(localStorage.getItem('thisFetchEx'))
}

// Since 'find ex' button will take us to a new page, I will need to run some functions specific to the exercise page on load:
var userExList
userExList=retrieveFetchEx()
genExList(userExList)
// [feature/find-btn-gen end]
