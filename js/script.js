var exNinApiKey = '38bf2ea7dbmsh996e21bb45906dbp14c699jsn856b582ec0ba'
var muscle = 'neck'
var exNinApi = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises'
var exNinApiHost = 'exercises-by-api-ninjas.p.rapidapi.com'
var userChoice = [];

var exNameHeader = $('#exercise-name-header')

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

// [feature/find-btn-gen] Added the 'data-index' attribute
function genExList(data) {
    if (data) {
        data.forEach(function (result) {
            var index = data.indexOf(result)
            // Text of each list item/button will be the title of the exercise. 
            var resultButtonEl = $('<button>').text(result.name).attr('data-exercise', result.name).attr('data-index', index).addClass('button is-link m-2 exercise-list-item')
            resultsListEl.append(resultButtonEl)
        })
    } else {
    }
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
    if ((clickedEl.attr('class').includes('button'))) {
        var i = clickedEl.attr('data-index')
        var exData = {
            name: userExList[i].name,
            instructions: userExList[i].instructions
        }
        console.log(exData)
        addToRecents(exData)
        var instructHTML = './Instruct.html'
        localStorage.setItem('exercise-picked', JSON.stringify(exData))
        window.location.replace(instructHTML)
    } else {
        console.log('not button')
        return
    }
})

// works doubly as a function that will create title for page, and also return the name of the exercise to be stored in object for YT search
function addExTitle() {
    var exNameHeader = $('#exercise-name-header')
    var pickedExercise = localStorage.getItem('exercise-picked')
    exNameHeader.text(pickedExercise)
    return pickedExercise
}

function addToRecents(exercise) {
    var recentsArray = (JSON.parse(localStorage.getItem('recents'))) || []
    recentsArray.unshift(exercise)
    localStorage.setItem('recents', JSON.stringify(recentsArray))

}

// code to generate a list of recent exercises
var recentExList = $('.recent-exercise-list');
function displayRecentExercises() {
    var recentsArray = JSON.parse(localStorage.getItem('recents')) || [];
    for (var i = 0; i < recentsArray.length; i++) {
        var recentExercise = recentsArray[i];
        var recentExEl = $('<li>').text(recentExercise)
        recentExList.append(recentExEl);
    }
}
displayRecentExercises();

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
            // Stores data pulled via user query and stores it locally. 
            storeFetchEx(data)
            // Redirects to 'exercises' page
            window.location.href = "pages/Exercises.html"
        })
}

// Stores the data that fetchEx() will pull
function storeFetchEx(data) {
    localStorage.setItem('thisFetchEx', JSON.stringify(data))
}
// Retrieves the fetch data previously pulled
function retrieveFetchEx() {
    return JSON.parse(localStorage.getItem('thisFetchEx'))
}

// Since 'find ex' button will take us to a new page, I will need to run some functions specific to the exercise page on load:
var userExList
// Sets value of 'userExList' to whatever is pulled from local storage with retrieveFetchEx()
userExList = retrieveFetchEx()
// Generates list of exercises based on this set of data
genExList(userExList)
// [feature/find-btn-gen end]

// [feature/rec-ex-btn] start

var recExBtnEl = $('.rec-ex-btn')

recExBtnEl.click(function () {
    console.log('btn clicked!')
    var recExPage
    if (window.location.pathname.includes('pages')) {
        recExPage = './recent-exercises.html'
    } else {
        recExPage = 'pages/recent-exercises.html'
    }
    window.location.replace(recExPage)
})

//event listener on the logo image such that the user is redirected to Home when the logo is clicked

$('.logo-img').click(function () {
    window.location.href = '../index.html';
})

// [feature/embed-yt] start

// Global vars
var ytAPIKeyDan = 'AIzaSyB9d1Cst7FLimdflVD7dDzQFe6k09qyzsE';
var ytAPIKeyRalph = 'AIzaSyDN2x7IWfitTATr3ByxdWJnBLycKq_T19k';
var ytAPIKeySandy = 'AIzaSyCoF7E6WQc0fEFE2hTPPf_nEn55mragl2Q';
var ytAPIKeyAnna = 'empty'
// Next 3 lines: create array of possible API keys, set index of default key, set working key to the key in the array that matches the key index
var ytAPIKeyArray = [ytAPIKeyDan, ytAPIKeyRalph, ytAPIKeySandy, ytAPIKeyAnna]
var keyIndex = 0
var validAPIKey = ytAPIKeyArray[keyIndex]

var ytLink = 'https://www.youtube.com/watch?v='
var vidSrcEl = $('#vid-el')
var vidSelect = $('#vid-select')
var vidId

// Will fetch list of YT vids; getVidIds() will sort data, store locally; getFirstVid() will return the first vid for the exercise at top of page; embedNewVid() will embed that video based on its id.
function fetchYT(validAPIKey) {
    // going to do something to the exercise string...
    var exercise = addExTitle()
    console.log(exercise)
    // checks if exercise's video ids are already in local storage. if yes, page can be populated successfully w/o using API!
    if (localStorage.getItem(exercise)) {
        console.log('included')
        var firstVid = getFirstVid(exercise)
        embedNewVid(firstVid.id)
        popVidSelect(exercise)
    } else {
        var exQuery = exercise
            .toLowerCase()
            .replaceAll(' ', '+')
        console.log(exQuery)
        var ytAPI = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${exQuery}&type=video&key=${validAPIKey}`
        console.log(ytAPI)
        var endFetch
        fetch(ytAPI)
            .then(function (response) {
                // conditional checks to see if there is an error with the fetch; if there is, it should be because the API key's quota has been reached
                // Will end the fetch if this is the case; if no error, continue with fetch
                if (!response.ok) {
                    console.log('API key quota reached')
                    endFetch = true
                    return
                } else {
                    return response.json();
                }
            })
            .then(function (data) {
                // Again, if fetch results in error, keyIndex is incremented, so as to move to next key, and is set as the new valid key.
                // fetchYT function is run again with the new valid key, which should result in a successful fetch. If not, the cycle repeats.
                if (endFetch) {
                    console.log('ready to end')
                    keyIndex++
                    console.log(keyIndex)
                    validAPIKey = ytAPIKeyArray[keyIndex]
                    console.log(validAPIKey)
                    fetchYT(validAPIKey)
                } else {
                    console.log(data)
                    getVidIds(data, exercise)
                    // will later grab exercise from page and embed vid based on that; will replace 'exNamePH' with 'exercise'
                    var firstVid = getFirstVid(exercise)
                    embedNewVid(firstVid.id)
                    popVidSelect(exercise)
                }
            })
    }
}

// Gets video names/ids for the exercise; to be part of the fetch function, taking fetched data and storing locally
function getVidIds(data, exercise) {
    var exVidsArray = []
    data.items.forEach(function (video) {
        vidData = {
            name: video.snippet.title,
            id: video.id.videoId
        }
        exVidsArray.push(vidData)
    })
    localStorage.setItem(exercise, JSON.stringify(exVidsArray))
}

// After being fetched for the exercise, everything else will be done from local storage:
function getFirstVid(exercise) {
    var exVidsArray = JSON.parse(localStorage.getItem(exercise))
    return exVidsArray[0]
}

function embedNewVid(vidId) {
    var ytVid = 'https://www.youtube.com/embed/' + vidId
    vidSrcEl.attr('src', ytVid)
}

function popVidSelect(exercise) {
    var exVidsArray = JSON.parse(localStorage.getItem(exercise))
    exVidsArray.forEach(function (video) {
        var vidOpt = $('<a>').text(video.name).attr('data-id', video.id).addClass('dropdown-item vid-opt')
        vidSelect.append(vidOpt)
    })
}

vidSelect.click(function (event) {
    var clicked = $(event.target)
    if (clicked.hasClass('vid-opt')) {
        var vidId = clicked.attr('data-id')
        embedNewVid(vidId)
    }
})

// Check if I am on correct page before doing YT pull: 
if (document.location.pathname === '/pages/Instruct.html') {
    fetchYT(validAPIKey)
}
// [feature/embed-yt] end