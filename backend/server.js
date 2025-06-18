import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.2,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const result = response.data.choices[0].message.content.trim();
        res.json({ result });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to connect to OpenAI' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
