import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chats-controllers.js";
const chatRoutes = Router();
// Generate a new chat
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generateChatCompletion);
// Get all chats
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
// Delete all chats
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map