export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(response.status).json({
  error: data?.error?.message || "Gemini API error",
  details: data
});
        
      
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "I couldn't generate an answer.";

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong while contacting the AI."
    });
  }
                  }
