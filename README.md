# Simple Services Communication over HTTP

This repository demonstrate two services communication technique implemented using HTTP.

- `service-one` is consumer service that calculate USD value of a given currency provided via `base=[your-currency]` and amount provided with `amount=<some-amount>`.

- `service-two` is exchange rate service used by `service-one` to fetch exchange rate value against dollars for a provided currency via query parameter `to=<your-currency>`

**This is not real rate value and the purpose is only to create dummy data**

## Installation & Testing

1. run `npm install` under `service-one` and `service-two` directories.

2. run  `npm run start` under `service-two` directory.

3. run the following curl command:

```bash
curl -v "http://127.0.0.1:3000?currency=RUB&amount=10"
```
