const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

// Startseite
app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Roblox AI</title>
                <style>
                    body{
                        background:#111827;
                        color:white;
                        font-family:Arial;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        height:100vh;
                    }

                    .box{
                        background:#1f2937;
                        padding:40px;
                        border-radius:15px;
                        text-align:center;
                    }

                    h1{
                        color:#00ff99;
                    }
                </style>
            </head>

            <body>

                <div class="box">

                    <h1>🤖 Roblox AI Server</h1>

                    <p>Server läuft erfolgreich.</p>

                    <p>API: /api/chat</p>

                </div>

            </body>

        </html>
    `);
});

// Test
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Server läuft!"
    });
});

// Chat
app.post("/api/chat", async (req, res) => {

    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({
            error: "Keine Nachrichten erhalten."
        });
    }

    try {

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {

            method: "POST",

            headers: {

                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                model: "llama-3.3-70b-versatile",

                messages: [

                    {
                        role: "system",
                        content: `
Du bist ein Roblox NPC.

Regeln:

- Antworte auf Deutsch.
- Antworte kurz.
- Maximal 10 Wörter.
- Nur 1 Satz.
- Sei freundlich.
- Keine langen Erklärungen.
`
                    },

                    ...messages

                ],

                temperature: 0.8,

                max_tokens: 40

            })

        });

        const data = await response.json();

        if (!response.ok) {

            console.log(data);

            return res.status(response.status).json(data);

        }

        res.json(data);

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            error:"Serverfehler"
        });

    }

});

app.listen(PORT, ()=>{

    console.log("====================================");
    console.log("Roblox AI gestartet");
    console.log("Port:",PORT);
    console.log("====================================");

});
