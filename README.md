# Vietnamese profile generator

Create thousands of Vietnamese profiles in a few seconds.

## Requirement

- NodeJs ^12
- yarn ^1.22

## Run

```bash
$ yarn build
$ yarn dev
```

## Example

```json
{
  "n": 143,
  "id": 7079601374,
  "name": "Phạm Ngọc Phú",
  "gender": "male",
  "phoneNumber": "0781977436",
  "phoneTelecom": "mobifone"
}
```

## Config

> You can find in ./lib/assets/*

> Ratio must be less than 1.

> other ratio is based on weight.

```json
{
  "totalRecord": 1000,
  "maleRatio": 0.5,
  "middleNameWithTwoLettersRatio": 0.1,
  "exportType": ["xlsx", "csv", "json"]
}
```

- firstnames.json
- middlenames.json
- lastnames.json
- telecoms.json

## Limitation

- Seems like some of the names don't make sense.
- Missing dual surname cases.
- Names with 5 or more characters are not supported.
- other info such as address, birthday, identity card,... is not supported yet.

## Final

> USED FOR TESTING AND FUN.
