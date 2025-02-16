const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "pat-na1-6cae2239-b1e8-44a7-8484-14ef62c39dfe";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=email,favorite_color,nick_name,firstname,lastname,hair_length';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
       
        res.render('homepage', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=email,favorite_color,nick_name,firstname,lastname,hair_length';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
     
        res.render('contacts', { title: 'Test', data });      
    } catch (error) {
        console.error(error);
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update', async (req, res) => {

    const encodedEmail = req.query.email;
    const email = decodeURIComponent(encodedEmail);

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_color,nick_name,hair_length`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

      
        res.render('update', {userEmail: data.properties.email, favoriteColor: data.properties.favorite_color, nickName: data.properties.nick_name, hairLength: data.properties.hair_length});
        
    } catch(err) {
        console.error(err);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "nick_name": req.body.newVal2,
            "favorite_color": req.body.newVal,
            "hair_length": req.body.newVal3
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
      
    } catch(err) {
        console.error(err);
    }

});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));