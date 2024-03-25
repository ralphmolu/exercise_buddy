# Exercise Buddy (https://ralphmolu.github.io/exercise_buddy/)

## Description 📖
Exercise Buddy is a user-friendly web applciation designed to help individuals find exercises tailored to their specific needs. It has functionalities that cater to a variety of users: whether they are targetting a particular muscle group or exploring different workout types within their selected difficluty levels.
Based on user-selected criteria with the help of the intuitive UI, Exercise Buddy fetches and displays a list of exercises, specific instructions and a YouTube video demonstrating how to perform the exercise. Join the community of users that have decided to take steps towards an active lifestyle!

## App Preview 👀
![Screenshot of Home Pape](<images/Exercise Buddy Home Page.png>)
![Screenshot of Exercise List Page](<images/Exercise List.png>)
![Screenshot of exercise instructions page](<images/Exercise Instructions page.png>)
![Screenshot of recent exercises page](<images/recent exercises.png>)

## Features ✨
1. Exercise Selection - Users can select exercises based on type, muscle group, and difficulty level
2. Dynamic Exercise Fetching - Exercise API is leveraged t dynamically fetch and display exercises matching the user's criteria.
3. Detailed Instructions - Provides detailed instructions for each exercise, helping users have the right form.
4. Video Demonstrations - Leveraging YouTube API to display video demonstration


## Code-Snippet 💻

fetch function to fetch from Exercise API

```JavaScript
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
                //modal warns user when no exercises match their criteria
                if(data.length === 0){
                    $('#no-exercises-modal').addClass('is-active');
                }else {
                // Stores data pulled via user query and stores it locally. 
                storeFetchEx(data)
                // Redirects to 'exercises' page
                window.location.href = "pages/Exercises.html"
                }
            })
    }
```

The fetch URL for Exercise API varies bases on selsction. This function takes in the user input and update the URL used to fetch from the Exercise API

```JavaScript
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
```

YouTube API has quotas per API key, hence a function was implemented to cycle through all the authors' keys in case the quota was reached for a specific API key

```JavaScript
     function fetchYT(validAPIKey) {
        // going to do something to the exercise string...
        var exercise = addExTitle()
        if (exercise) {
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
    }
```


## Skills Improved 🛠️
* Web Development Fundamentals
* APIs (YouTube and Exercise API) Integration
* JavaScript Framework and Libraries
* Responsive Design
* Local Storage Management
* Event Handling
* UI Design
* Git and version control
* Error handling and Debugging


## Future Improvements 🔜
* UI Design
* Integrating database for progress tracking
* Custom Workout plan (user sets goals and get tailored plans)
* Virtual personal trainer using AI
* Community/Social features (share workouts with friends)
*

## Technologies 🔧
* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [jQuery](https://jquery.com/)
* [Font Awesome](https://fontawesome.com/)
* [Bulma](https://bulma.io/)
* [YouTube API](https://developers.google.com/youtube/v3)
* [Exercises API by API Ninja](https://api-ninjas.com/api/exercises)

## License 📄
This project is licensed under the MIT License - see the LICENSE for details.

## Authors 👤

* **Anna Blount** 

- [Portfolio](https://silvernotshell.github.io/professionalportfolio-ablount/)
- [Github](https://github.com/silvernotshell)
- [LinkedIn](https://www.linkedin.com/in/elisabeth-blount-308142297/)

* **Daniel Cross** 

- [Portfolio](https://danrcross.github.io/Daniel-Portfolio/)
- [Github](https://github.com/danrcross/)
- [LinkedIn](https://www.linkedin.com/in/daniel-cross-6312891b0/)

* **Ralph Molu** 

- [Portfolio](#)
- [Github](https://github.com/ralphmolu)
- [LinkedIn](https://www.linkedin.com/in/ralph-molu/)

* **Sandy Vazquez** 

- [Portfolio](https://github.com/sandyvzqz/ProjectPortfolio.git)
- [Github](https://github.com/sandyvzqz)
- [LinkedIn](#)
