import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import axios, { AxiosError } from "axios";

const server = Fastify({
  logger: {
    enabled: process.env.NODE_ENV === "development",
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  },
});

// simple cache to be used as fallback on API call failure
const cache = new Map();

server.get(
  "/",
  {
    schema: {
      querystring: {
        type: "object",
        properties: {
          currency: { type: "string" },
          amount: { type: "integer" },
        },
        required: ["currency", "amount"],
      },
    },
  },
  async (request, reply) => {
    
    let response, rate;
    try {
      response = await axios({
        method: "GET",
        url: process.env.CURRENCY_API_URL,
        params: {
          to: request.query.currency,
        },
      });

      rate = response.data.rate;
      cache.set(request.query.currency, rate);
    } catch(error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED') {
          server.log.fatal(`unable to connect to exchange service`)
        } else {
          server.log.warn(`call to exchange service completed with errors`)
        }
      }
      rate = cache.get(request.query.currency);
    }
    
    if (!rate) {
      return reply.status(503).send({
        error: `Service not available`
      })
    }

    const amount = request.query.amount / rate;

    return {
      base: request.query.currency,
      target: "USD",
      rate,
      amount: amount.toFixed(3),
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
