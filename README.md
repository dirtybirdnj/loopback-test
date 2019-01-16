# Loopback Test Application

This test application is a sample REST API designed to do the following things:

1. Ingest a .xlxs file of machine value readings
2. Upon ingestion of file, update any existing readings with new values from the file provided
3. Provide an endpoint that allows downloading the database as an .xlxs file
4. Provide an endpoint that gives the current values of its attributes

NPM Scripts:

A shortcut is added for migrating DB tables `npm run migrate`

Endpoints: 

* List All Machines **GET** @ `/api/Machines/`

* View Individual Machine **GET** @ `/api/Machines/{id}`

* Import / Update Dataset **POST** @ `/api/Machines/ingest`

* Export CSV **GET** @ `/api/Machines/export`

A [Postman file](https://github.com/dirtybirdnj/loopback-test/blob/master/postman_file_attach.png) is provided for easy testing

**Note:** I had a real pain of a time figuring out how to add files to the form data in Postman. The backup of My Postman files does not retain the link to files, so you will have to do this manually.

![How to configure body payload files](https://github.com/dirtybirdnj/loopback-test/blob/master/postman_file_attach.png)