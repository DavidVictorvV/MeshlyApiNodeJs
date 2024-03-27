require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/create-task', async (req, res) => {
    console.log(req.body.prompt)

    try {
            const response = await axios.post('https://api.meshy.ai/v2/text-to-3d', JSON.stringify({ 
                mode: "preview",
                prompt: req.body.prompt,
            }), {
              headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
            });
            console.log(response.data)
            res.json(response.data);
          } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Failed to create task' });
          }
});


app.get('/get-task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.meshy.ai/v2/text-to-3d/${id}`, {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving task:', error);
        res.status(500).json({ message: 'Failed to retrieve task' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));