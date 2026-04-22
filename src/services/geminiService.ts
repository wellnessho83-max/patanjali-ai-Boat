export async function chatWithWellnessAI(
  userMessage: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  liveDoctorContext?: string
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage, history, liveDoctorContext }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get AI response");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("I'm having trouble connecting to my wellness knowledge base. Please try again later.");
  }
}
