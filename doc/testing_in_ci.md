# Testing in CI

Tests are run in [Github Actions](https://github.com/ministryofjustice/approved-premises/actions)
and setup is in [.github/workflows/ci.yml](https://github.com/ministryofjustice/approved-premises/blob/main/.github/workflows/ci.yml).

The tests use the same script as running tests locally (`script/test`). The only difference is that the seed data for the placement search is loaded from
environment variables which are base64 encoded and gzipped versions of the files
referenced in `DATABASE_SEED_FILE` and `GEOLOCATION_SEED_FILE` locally.

If you need to change this data for any reason, you can run the following locally:

```bash
cat path/to/file.csv | gzip -c | base64 | pbcopy
```

You will then have the Gzipped, base64 encoded version of the file copied to your
clipboard. You can then update the appropriate environment variable in the
[secrets section of the repo](https://github.com/ministryofjustice/approved-premises/settings/secrets/actions).

This is similar to an approach suggested in the [Github Actions docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets#storing-base64-binary-blobs-as-secrets)
with gzipping added to make the Base64 encoded string fit into the 64kb limit
allowed for environment variables in Github Actions.
