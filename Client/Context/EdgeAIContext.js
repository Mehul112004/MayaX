import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useLLM, LLAMA3_2_1B, initExecutorch } from "react-native-executorch";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Initialize the executorch core with Expo's resource fetcher
initExecutorch({
  resourceFetcher: ExpoResourceFetcher,
});

const STORAGE_KEY = "edge_ai_enabled";
const SYSTEM_PROMPT = `You are an interior design prompt engineer. Transform the user's rough idea into a single, detailed paragraph optimized for AI image generation.

Cover: room type, materials & textures, lighting, color interactions, and spatial atmosphere. End with a framing/perspective note. Reply with the rewritten prompt only — no explanation.
`;

export const EdgeAIContext = createContext({
  modelStatus: "idle",
  downloadProgress: 0,
  enableEdgeAI: async () => {},
  refinePrompt: async () => {
    throw new Error("EdgeAIProvider not mounted");
  },
});

export const EdgeAIProvider = ({ children }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [modelStatus, setModelStatus] = useState("idle");
  const resolversQueue = useRef([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((res) => {
      if (res === "true") {
        setShouldLoad(true);
      }
    });
  }, []);

  // Note: we pass preventLoad based on shouldLoad.
  // The API uses 'llm' object which contains generate, response, isReady, downloadProgress, etc.
  const llm = useLLM({
    model: LLAMA3_2_1B,
    preventLoad: !shouldLoad,
  });

  const llmRef = useRef(llm);
  useEffect(() => {
    llmRef.current = llm;
  }, [llm]);

  const callModel = useCallback(async (text) => {
    const chat = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text },
    ];
    await llmRef.current.generate(chat);
    // Retrieve the latest response from the newest render cycle
    return llmRef.current.response ?? "";
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      setModelStatus("idle");
      return;
    }

    if (llm.error) {
      setModelStatus("failed");
      resolversQueue.current.forEach(({ reject }) =>
        reject(new Error("Model failed to load")),
      );
      resolversQueue.current = [];
      return;
    }

    if (llm.isReady) {
      setModelStatus("ready");
      AsyncStorage.setItem(STORAGE_KEY, "true");

      const queued = resolversQueue.current;
      resolversQueue.current = [];
      queued.forEach(({ text, resolve, reject }) => {
        callModel(text).then(resolve).catch(reject);
      });
      return;
    }

    // Still downloading setting
    setModelStatus("downloading");
  }, [shouldLoad, llm.isReady, llm.error, callModel]);

  const enableEdgeAI = useCallback(async () => {
    if (modelStatus === "downloading" || modelStatus === "ready") return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      alert("No internet connection. Please try again.");
      return;
    }

    setShouldLoad(true);
    setModelStatus("downloading");
  }, [modelStatus]);

  const refinePrompt = useCallback(
    (text) => {
      if (modelStatus === "ready") {
        return callModel(text);
      }

      if (modelStatus === "downloading") {
        return new Promise((resolve, reject) => {
          resolversQueue.current.push({ text, resolve, reject });
        });
      }

      return Promise.reject(
        new Error(
          modelStatus === "failed"
            ? "Edge AI failed to load. Please retry."
            : "Edge AI is not enabled yet.",
        ),
      );
    },
    [modelStatus, callModel],
  );

  return (
    <EdgeAIContext.Provider
      value={{
        modelStatus,
        downloadProgress: llm.downloadProgress || 0,
        enableEdgeAI,
        refinePrompt,
      }}
    >
      {children}
    </EdgeAIContext.Provider>
  );
};
