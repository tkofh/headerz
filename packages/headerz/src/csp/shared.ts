type CSPSourceValue =
  | "'none'"
  | "'self'"
  | "'strict-dynamic'"
  | "'report-sample'"
  | "'inline-speculation-rules'"
  | "'unsafe-inline'"
  | "'unsafe-eval'"
  | "'unsafe-hashes'"
  | "'wasm-unsafe-eval'"
  | "'https:'"
  | "'http:'"
  | "'data:'"
  | "'nonce-<base64-value>'"
  | "'sha256-<base64-value>'"
  | "'sha384-<base64-value>'"
  | "'sha512-<base64-value>'"
  | (string & {})
