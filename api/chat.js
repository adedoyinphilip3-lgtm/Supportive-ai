export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Please provide a question." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        input: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json({
        error: "The AI service returned an error."
      });
    }

    return res.status(200).json({
      answer: data.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong while contacting the AI."
    });
  }
        }
