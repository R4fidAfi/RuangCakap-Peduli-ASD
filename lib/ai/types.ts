/** Satu giliran percakapan antara AI dan pengguna. */
export type ChatTurn = {
  role: "ai" | "user";
  text: string;
};

/** Pesan untuk API chat completions (format OpenAI). */
export type ApiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
