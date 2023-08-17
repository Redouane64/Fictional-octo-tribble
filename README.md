# Simple Services Communication over HTTP

This repository demonstrate two services communication technique over HTTP by implementing a fake currency exchange API and converter services.

- `converter-service` is consumer service that calculate USD value of a given currency provided via `base=[your-currency]` and amount provided with `amount=<some-amount>`.

- `exchange-rate-service` is exchange rate service used by `converter-service` to fetch exchange rate against USD for a currency set via query parameter `to=<your-currency>`, service can be called at url: `GET http://127.0.0.1:16453?to=RUB`

- rate limiter is added to `exchange-rate-service` to simulate real-world scenarios such as services that is protected against abuse and spam calls.

- `converter-service` uses Javascript Map for simple cache as fallback in case of 429 Too Many Requests status code.

## Installation & Testing

1. run `npm install` under `exchange-rate-service` and `converter-service` directories.

2. run `exchange-rate-service` and `converter-service` via command: `npm run start`.

3. call `converter-service` using the following curl command:

```bash
curl -v "http://127.0.0.1:3000?currency=RUB&amount=10"
```
