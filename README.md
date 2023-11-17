#The Trip Planner
###Developed by Inbal Gamliel
This is a web app that enables it's users to plan out trips- whther they are a vaction or for work. 
The user who creates the trip can also share it with other users who are registered to the app. 
Those users can add events to the trip scheduler.
[Live preview of the web app](http://bit.ly/48fo60Z).
[The Trip Planner web app](https://trip-planner-n1g3.onrender.com/login).

![Login page](./images/img1.png)

###Main features - Backend
**Users can choose how to sign up for the app.**

- Regular registration where they use a valid email and create their own password and username.
- Google sign up where they use their google account to register.

If a user chooses to sign up using his Google account the following will occur-

His email will be set as the email and his google display name will be set as the nickname.
His password will not be saved in the DB.
His profile id will be saved under a specific table (Federated Credentials) in the DB that represents a Google sign up.
If the user signed up using Google, the next time he will log in, the existing user record will be found via its relation to the Google account (using his Google profile id).