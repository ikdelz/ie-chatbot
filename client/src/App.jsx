import { useActionState, useEffect, useState } from "react";
import "./App.css";

function App() {
  const getResponse = async (_, formData) => {
    const prompt = formData.get("prompt");
    let data;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("Error while processing the response!");
      }

      data = await res.json();
    } catch (error) {
      console.error(error);
      alert("Request Failed, Try again!");
    }

    return data;
  };

  const [response, formAction, isPending] = useActionState(getResponse, null);
  // console.log(response)

  return (
    <div className="main-container">
      <h3>IE AI CHATBOT</h3>
      <form action={formAction}>
        <textarea placeholder="Enter the prompt here..." name="prompt" />
        <button>Chat</button>
      </form>
      {isPending && <p>Generating....</p>}
      {response && response.choices.length > 0 && (
        <div className="response">
          {response.choices[0].message.reasoning.split("\n").map((p) => (
            <p className="res-paragraph">{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
