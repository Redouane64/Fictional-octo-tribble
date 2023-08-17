import dotenv from 'dotenv';
dotenv.config()

import Fastify from 'fastify';
import cache from '@fastify/caching';

const server = Fastify({
  logger: process.env.NODE_ENV === 'development', 
})

await server.register(import('@fastify/cors'), { 
  methods: ['GET']
})

await server.register(import('@fastify/rate-limit'), {
  max: 1,
  timeWindow: '1 second'
})

await server.register(cache, {
  privacy: cache.privacy.NOCACHE,
})

server.get('/healthz', (request, reply) => {
  return { ok: true }
})

server.get('/', (request, reply) => {
  return { ticker: 'USD', rate: (Math.random() * 100).toFixed(3) }
})

server.listen({
  port: process.env.PORT,
}, (error) => {
  if (error)
    throw error
})