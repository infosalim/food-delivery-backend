import express from 'express';

const app = express();

app.use('/', (req, res) => {
    return res.json('Hello');
});

app.listen(8000, ()=>{
    console.log('Ap is running on Port: 8000');
});

