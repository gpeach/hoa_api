# hoa_api
generic node api with mocha tests

start mongodb in services

local db is hoa_api
mongodb://localhost/hoa_api
yarn start to start server on port 3001

http://10.0.0.200:3001/tickets
yarn test to run mocha tests

get / open (health check)
post /login open
post /register open
post /upload open

get /tickets verify
post /tickets verify
get /tickets/:id verify 
delete /tickets/:id verify 
put /tickets/:id verify

app.get /users verify
app.post /users verify
app.get /users/:id verify
app.delete /users/:id verify
app.put /users/:id verify

modified from https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

uploads

When sending a POST request to an API that uses Multer, you need to submit the request as a multipart/form-data content type, which is designed for sending binary data (like files) as part of the request. Here's an example of how you can make a POST request with a file to an API that uses Multer using two different methods: using an HTML form and using a tool like Postman.

Using an HTML form

To send a POST request with a file using an HTML form, create a form with the enctype attribute set to multipart/form-data and include an input field with the type attribute set to file. The name attribute of the input field should match the one you used in upload.single() in your Node.js API:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload</title>
</head>
<body>
    <form action="http://localhost:3000/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="myFile" required>
        <button type="submit">Upload</button>
    </form>
</body>
</html>
```
Replace http://localhost:3000/upload with your own API's URL if it's different.

Using Postman

Postman is a popular tool for testing API endpoints. To send a POST request with a file using Postman:

Open Postman and create a new request.
Set the request method to POST and enter the URL for your file upload endpoint (e.g., http://localhost:3000/upload).
Click the Body tab, and select form-data.
In the "KEY" field, enter the name you used in upload.single() in your Node.js API (e.g., myFile). Set the "VALUE" field to "File" (using the dropdown) and choose the file you want to upload.
Click "Send" to send the POST request.
With either method, your API should receive the POST request containing the file, and the Multer middleware will process the file according to your configuration.
