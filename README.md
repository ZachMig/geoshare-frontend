# geoshare-frontend
Frontend for geoshare-backend repo.

Live at https://www.geosave.org

Libraries/Tools/Languages Used:
TypeScript
React.js
Axios
Bootstrap

_____

GeoSave is a website I built to serve as a productivity multiplier for the competitive GeoGuessr community. 

If you are not familiar, GeoGuessr is a popular browser-based game that shows you a random Google Maps Street View location, and challenges you to find the location on a map. Players at the highest level can pinpoint locations based on clues such as road bollards, styles of electric pole or traffic signs, and so on.

So we have rules or heuristics such as "a utility pole of style X indicates country or region Y". In order to create these rules, very dedicated people must go out and manually look at thousands of utility poles, organize that data, and demonstrate reliable, provable connections. 

This is typically done in Excel or a Google Spreadsheet full of thousands of URLs. Imagine working with this sort of data. Remember that all of the relevant information is contained in the actual Street View itself, visually. You can get a sense of how much time is wasted going back and forth opening endless tabs of Street View URLs, trying to keep track mentally of which tab in your browser corresponds to which record in your Excel file, etc. Not fun.

GeoSave provides similar functionality to a spreadsheet, but with the visual component included as well. Users can create Lists and load them with their Street View locations relevant to that List (e.g. French Utility Poles). When initially saving the location URL, users can focus the Street View camera on whatever caught their interest. When viewing the saved location on GeoSave, a Google Maps Static Street View API call is made, and a visual preview of whatever their camera was focused on will be shown to the user.

_____

TL;DR

GeoSave lets users create 'Lists' of Google Street View 'Locations'. Lists and Locations have a many-to-many relationship (represented as a third, linking table in the DB). Users can create, update, delete, and search (public) these records, and can link or unlink Locations from a List in bulk. Locations come with a visual preview built from the provided URL and fetched from a Google API.

The front-end is built in TypeScript and React, with 3rd party libraries/assets of Axios and Bootstrap. Hosted on an AWS S3 bucket and delivered by Cloudfront.

The back-end is a Spring app written in Java. Hosted on an AWS EC2.

You can login to an account with some preloaded data with username/password of demo/demo.

More features coming soon.
