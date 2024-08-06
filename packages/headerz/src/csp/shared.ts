type CSPSourceValue =
  | "'self'"
  | "'unsafe-eval'"
  | "'wasm-unsafe-eval'"
  | "'unsafe-hashes'"
  | "'unsafe-inline'"
  | "'none'"
  | "'strict-dynamic'"
  | "'report-sample'"
  | "'nonce=<base64-value>'"
  | (string & {})
