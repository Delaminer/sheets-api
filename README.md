# Sheets API

Make your own APIs using a simple Sheets or Excel-esque editor!

The website allows to enter your own data or CSV file, which it then uses as a database for API calls it receives.

This allows you to use your data as you would any other API without having to make and host your own server!

You can use it at [https://sheets-api-server.herokuapp.com/](https://sheets-api-server.herokuapp.com/)

## Use
Once you are done entering your data for an API, you will see the edit page is of the form [https://sheets-api-server.herokuapp.com/edit/projects/XXXX](), where the XXXX is the project's ID. Simply change the `edit` in the URL to `api`, and now you will get an API request to the data in this project, which it will return to you by default as a 2D array of strings.

Certain items in a project can be accessed by specifying a key-value pair they contain, such as using [/api/projects/XXXX?name=Alex]() to get all items whose name is Alex.
The data returned is a list of JSON objects, whose key's correspond to the first row of the table (how you normally title data in a Sheets or Excel format).

## Saving
Saving your database using the API is a WIP.
