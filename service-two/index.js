import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import cache from "@fastify/caching";

const server = Fastify({
  logger: process.env.NODE_ENV === "development",
});

await server.register(import("@fastify/cors"), {
  methods: ["GET"],
});

await server.register(import("@fastify/rate-limit"), {
  max: 10,
  timeWindow: "10 seconds",
});

await server.register(cache, {
  privacy: cache.privacy.NOCACHE,
});

server.get("/healthz", (request, reply) => {
  return { ok: true };
});

// fake API to convert from ticker to usd
server.get(
  "/",
  {
    schema: { 
      querystring: { 
        type: 'object', 
        properties: { to: { type: "string" } },
        required: ['to'],
      } 
    },
  },
  (request, reply) => {
    return {
      base: "USD",
      to: request.query["to"],
      rate: Number((Math.random() * 100).toFixed(3)),
    };
  }
);

server.listen(
  {
    port: process.env.PORT,
  },
  (error) => {
    if (error) throw error;
  }
);
