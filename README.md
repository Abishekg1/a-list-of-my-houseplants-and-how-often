What it does

Plant Water Planner helps me keep track of my plants and their watering schedules. 
I can add a plant by entering its name and how many days apart it needs water. 
The app shows which plants need watering today, and 
I can click Mark watered to update the next watering date.

What I built
Created the page with the Plant Water Planner heading.
Built a form with a plant name field, a watering interval field, and an Add plant button.
Added green styling and organized the app using React components.
Made the form respond to typing and validate the entered information.
Added empty-state messages for the plant lists.
Created date functions to format dates, get today's date, and calculate future dates.
Added functionality to create plants and display them in a list.
Added the Plant type and the next watering date for each plant.
Built the Water today list and the Mark watered button.
Used localStorage to keep plants saved after reloading the page.
What I would add next
Add plant categories, such as flowers, herbs, and indoor plants.
Allow users to upload photos of their plants.
Add reminders to help users remember when to water their plants.
Say it out loud

My Plant Water Planner helps me remember when my plants need water.
Each plant holds information like its name, how often it needs watering, and its next watering date. 
The App component uses that information to show all my plants and which ones need water today. 
One surprise I fixed was a code error caused by missing backticks in a date function. 
I also made sure my plants stay saved when I reload the page.
Next, I would like to add plant photos and watering reminders.
Why a server

The Plant Water Planner stores plants in the browser's localStorage under the key plant-water-planner. LocalStorage belongs to a specific browser and website origin, so another browser or private window has its own separate storage. 
That is why a Fern saved in one browser does not automatically appear in another.

A server can store plant data centrally and provide it to different browsers through an API. If the app uses that shared server and identifies each user appropriately, their plants can be available across browsers and devices instead of being saved only in one browser's localStorage.