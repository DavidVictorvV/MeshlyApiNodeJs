require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/create-task', async (req, res) => {
    console.log(req.body.prompt);

    try {
        const response = await axios.post('https://api.meshy.ai/v2/text-to-3d', JSON.stringify({ 
            mode: "preview",
            prompt: req.body.prompt,
        }), {
          headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        res.json(response.data);
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Failed to create task, reason: '+ error });
      }
});


app.post('/create-texture-task', async (req, res) => {
    console.log(req.body.prompt);

    try {
        const response = await axios.post('https://api.meshy.ai/v1/text-to-texture', JSON.stringify({
            model_url: req.body.model_url, 
            object_prompt: req.body.object_prompt, 
            style_prompt: req.body.style_prompt || "realistic", 
            resolution: req.body.resolution || "2048", 
            enable_pbr: req.body.enable_pbr || true, 
            art_style: req.body.art_style || "realistic" 
        }), {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating Text-to-3D task:', error);
        res.status(500).json({ message: 'Failed to create texture task, reason: '+ error });
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
        res.status(500).json({ message: 'Failed to retrieve task, reason: ' + error });
    }
});

app.get('/get-texture-task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.meshy.ai/v1/text-to-texture/${id}`, {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving texture task:', error);
        res.status(500).json({ message: 'Failed to retrieve texture task, reason: ' + error });
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
