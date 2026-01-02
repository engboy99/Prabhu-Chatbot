import axios from "axios";
import User from "../models/User.js";
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3"; // or "mistral"
export const generateChatCompletion = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== "string") {
            return res.status(422).json({ message: "Message is required" });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Save user message
        user.chats.push({ role: "user", content: message });
        // Build conversation prompt
        const prompt = user.chats
            .map((c) => `${c.role.toUpperCase()}: ${c.content}`)
            .join("\n");
        const ollamaResponse = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            prompt,
            stream: false,
        }, { timeout: 60000 });
        const reply = ollamaResponse.data?.response || "No response generated.";
        user.chats.push({ role: "assistant", content: reply });
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error("🔥 OLLAMA ERROR:", error.message);
        return res.status(500).json({
            message: "AI generation failed",
            error: error.message,
        });
    }
};
export const sendChatsToUser = async (req, res) => {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
        return res.status(401).send("Unauthorized");
    return res.status(200).json({ chats: user.chats });
};
export const deleteChats = async (req, res) => {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
        return res.status(401).send("Unauthorized");
    user.chats.splice(0, user.chats.length);
    await user.save();
    return res.status(200).json({ message: "Chats deleted" });
};
//# sourceMappingURL=chats-controllers.js.map