const express = require('express');
const app = express();
const productRoutes = require('./routes/routes.js');
const cors = require('cors');
const corsOptions ={
    origin:'https://frontend-one.onrender.com', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.listen(5001, () => {
    console.log('Server is listening on port 5001')
})

app.use(express.json())
app.use('/api', productRoutes)
