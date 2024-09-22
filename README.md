# IBP_Blog_Webpage

Make a copy of the Code-Base on your local machine. Navigate via the terminal to the designated folder you have stored this in.

Initialize the node package manager by using the following in the terminal:
```
npm init -y
```

Once that is done, install the necessary dependencies and packages by typing the following in the terminal:
```
npm install express 
npm install sqlite3
npm install body-parser
```

Once that is done, navigate to the "js" folder. Then type the following in the terminal:
```
node server.js
```

This initializes a local server running on port 3000 which initializes a database for your website, if not already done, (in this case, I have already added my database with the code-base so you will be able to see my blogs and can edit, delete and add blogs yourself on your local copy) and handles the database connection and the requests it gets.
If you wish to create your own database for the blogs, just delete the "database.db" file in the "js" folder and when you start the server again it will create a new database for your blogs. 
