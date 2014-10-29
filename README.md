proj3
=====

Project 3: Mini team project

url: http://medimage-calvinli.rhcloud.com/

testing url: http://medimage-calvinli.rhcloud.com/demo


Test Suite using demo page 
---------------------------

proj3
=====

Project 3: Mini team project

url: http://medimage-calvinli.rhcloud.com/demo


Test Suite using demo page 
---------------------------

*Assume every sequence of sub-steps for every step ends with clicking the associated submit button*

**1. Create a new user**

Users -> Create a new user
- Type in a first name, last name, username, and password
- Expected result: Empty JSON


**2. Log in as this user**

Session -> Login
- Type in the username and password used to create your user
- Expected result: Empty JSON

**3. Attempt to create a user with an empty or whitespace input**

Users -> Create a new user (or any demo that has input fields)
- Type in a first name, last name, username, and password, but with one or more of these fields only made with space characters
- Expected result: Error

**4. Edit your user**

Users -> Edit an existing user
- Type in the username you typed when you created your user
- Edit any of the three remaining input fields, what you type in will be the new value for that field
- Expected result: Empty JSON

**5. Check the users**

Users -> Get all users
- Expected result: JSON with all the users who currently exist.  Find your user, and check that the user parameters are the parameters that you typed when you edited your user

**6. Get existing images**

MedImages -> Get all images
- Choose whether to show tags or not with each image
- Expected result: JSON {"images": <array of MedImage models>}

**7. Create your first medical image**

MedImages -> Create a medical image
- Type your username, and the title of the image that you will create
- Choose a .jpg or .png file to upload
- Expected result: Empty JSON

**8. Show your medical images **

MedImages -> Get medical images for a user
- Type in your username
- Expected result: JSON {"images: <array of MedImage models>}

**9. Edit your medical image **

MedImages -> Edit a medical image
- Copy the _id of your medical image (can be found in the response in step 8)
- Paste the _id in the first input box for edit a medical image
- Type a new title for your image
- Expected result: Empty JSON

**10. Create an annotation for your medical image**

Annotations -> Create a new annotation
- Create a point annotation
- Type in text for your annotation, paste the image _id from earlier, and type in any two numbers for the start x and y coordinates
- Expected result: PointAnnotation model

- Create a range annotation
- Repeat above steps, but also type any two numbers for end x and y coordinates
- Expected result: RangeAnnotation model

**11. Edit one of your annotations**

Annotations -> Edit an existing annotation
- Copy the _id from your point annotation from step 10, paste into first field
- Edit any of the next 5 fields, the last 2 will be disregarded automatically since this is a point annotation
- Select "point" radio button
- Expected response: Empty JSON

**12. Delete one of your annotations **

Annotations -> Delete an annotation
- Paste the same _id used in step 11
- Select "point" radio button
- Expected response: Empty JSON

**13. Make sure you have access to your own image**

Contributions -> Check if user has access to an image
- Type your username
- paste the _id used in step 9
- Expected result: JSON {has_access: <boolean determining if user has aceess>, contribution_id: id of associated contribution}

**14. Create another user**

Repeat step 1 with a new username

**15. Add this user as a contributor for your image**

Annotations -> Add a new contributor from an image
- Type user name of user created in step 14
- paste the _id used in step 9
- Expected result: Empty JSON

**16. Get all the contributors for your image **

Annotations -> Get all users contributing to an image
- paste the _id used in step 9
- Expected result: JSON {"contributions": Array<Contribution Models>, "userIDToUser": JSON{user_id: UserModel}}

**17. Get all images a user is contributing to**

Annotations -> Get all images a user is contribution to
- Type user from step 14 username
- Expected result: JSON {"contributions": Array<Contribution Models>, "imageIDToImage": JSON{image_id: MedImageModel}}

**18. Delete user as contributor**

Annotations -> Delete a contributor from an image
- Paste a contribution _id from step 16
- Expected result: Empty JSON

**19. Add a tag to your medical image **

Tags -> Add a new tag to an image
- Type name of tag to create
- Paste image_id used in step 9
- Expected result: Empty JSON

**20. Get your tags for your medImage**

Tags -> Get all tags for a medical image
- Paste image_id used in step 19
- Expected result: Array<Tag models>

**21. Get images with given tags**

Tags -> Get images with the following tags:
- Type in the tag name used to create the tag in step 19
- Type # of results greater than or equal to 1
- Expected Result: JSON{"images": Array<_id: id of medImage, count: number of tags for the medimage, tags: Array<tagName>, "imageIdtoImage": JSON{image_id: MedImage Model}

**22: Remove your tag from your medimage **

Tags -> Remove an existing tag from an image

- Input the name of your tag from step 19
- Paste image_id used in step 19
- Expected Result: Empty JSON

**23. Delete your image **

MedImages -> Delete an image
- Paste image_id used in step 19
- Expected Result: Empty JSON

**24. Log out**

Session -> Logout
- Expected result: Empty JSON