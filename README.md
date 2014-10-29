proj3
=====

Project 3: Mini team project

url: http://medimage-calvinli.rhcloud.com/demo


Test Suite using demo page 
---------------------------

  Before executing the following tests, make sure you are logged in, then go to the /demo page

  ** 1. Make sure there are no users existing in the database **
    Users -> Get all users
      - Click the submit button
      - Expected result: Empty array


  ** 2. Create a new user **
    Users -> Create a new user
      - Type in a first name, last name, username, and password
      - Expected result: Empty JSON

  ** 3. Attempt to create a user with an empty or whitespace input **
    Users -> Create a new user (or any demo that has input fields)
      - Type in a first name, last name, username, and password, but with one or more of these fields only made with space characters
      - Expected result: Error

  ** 4. Edit your user **
    Users -> Edit an existing user
      - Type in the username you typed when you created your user
      - Edit any of the three remaining input fields, what you type in will be the new value for that field
      - Expected result: Empty JSON
      - Validation: Users -> Get all users -> Submit  to view the new information of your users

  ** 
  