import { useActionState, useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [chats, setChats] = useState([]);

  const getResponse = useCallback(async (_, formData) => {
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
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                // {
                //   type: "image",
                //   url: ""
                // }
              ],
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

    if (data && data.choices.length > 0) {
      setChats((prevcharts) => [
        ...prevcharts,
        {
          title: prompt,
          response: data.choices[0].message.content,
        },
      ]);
    }

    return data;
  }, []);

  const [response, formAction, isPending] = useActionState(getResponse, null);
  console.log(chats);

  return (
    <div className="main-container">
      <h3>AI CHATBOT</h3>
      <form action={formAction}>
        <textarea
          placeholder="Enter the prompt here..."
          name="prompt"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <button>Chat</button>
      </form>
      {isPending && <p>Generating....</p>}
      {chats.length > 0 &&
        chats.map((chat, index) => (
          <div className="response" key={index}>
            <p className="title">{chat.title}</p>
            <div className="response-body">
              {chat.response.split("\n").map((p, i) => (
                <p className="res-paragraph" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
