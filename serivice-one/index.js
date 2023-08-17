import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import axios from "axios";

const server = Fastify({
  logger: {
    enabled: process.env.NODE_ENV === "development",
    level: process.env.NODE_ENV === "development" ? 'debug' : 'warn',
  },
});

server.get(
  "/",
  {
    schema: {
      querystring: {
        type: "object",
        properties: {
          currency: { type: "string" },
          value: { type: "integer" },
        },
        required: ["currency", "value"],
      },
    },
  },
  async (request, reply) => {
    const response = await axios({
      method: "GET",
      url: process.env.CURRENCY_API_URL,
      params: {
        from: request.query.currency,
      },
    });

    if (response.status !== 200) reply.status(500);

    const rate = response.data.rate;
    const value = rate * request.query.value;
    return { rate, value: value.toFixed(3), from: request.query.currency };
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
