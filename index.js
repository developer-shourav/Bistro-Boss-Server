const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 7000 ;




// Middleware

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Bistro Boss')
})





app.listen(port, () => {
    console.log(`Our Bistro Boss is Running on the PORT ${port}`);
})