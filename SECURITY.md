# Security Policy (Strictly Private)

This is a private repository containing proprietary intellectual property, algorithmic trade analysis tools, and institutional integrations. Securing our tools, servers, databases, and trade credentials is of paramount importance.

---

## 1. Vulnerability Reporting

If you discover a security vulnerability in any component of this platform, **do not open a public issue.** As a private project, all vulnerability reports must be handled with utmost discretion.

Please report the issue directly to the repository owner, **Yash Rana** (via private team channels or yash.rana0101 on GitHub).

In your report, please include:

- A detailed description of the vulnerability and its potential impact.
- Detailed steps or a proof-of-concept script to reproduce the issue.
- Any potential mitigation steps or proposed patches.

We will review your submission promptly and coordinate the fix privately.

---

## 2. Core Security Guarantees & Constraints

### 2.1 API Credentials Security (Tauri Stronghold Vault)

Zerodha Kite API keys, access tokens, and credentials must **never** be transmitted to our backend databases or stored in plaintext in the filesystem.

- **Storage:** All credentials are stored inside a Tauri Stronghold vault using standard Argon2id key derivation and AES-256 encryption.
- **Access Control:** De-encryption occurs client-side in memory on the desktop shell immediately prior to request dispatch, then cleared. Plaintext secrets are never logged or cached in local storage files.
- **References:** For client key storage details, inspect the `SecurityVault.tsx` component and Tauri native encryption services.

### 2.2 Docker & DB Infrastructure

Our infrastructure relies on local instances of Redis, PostgreSQL, QuestDB, and Redpanda orchestrated through `docker-compose.yml`.

- **Port Protection:** Keep Postgres (`5890`), Redpanda (`19092`), and QuestDB (`9000` / `9009` / `8812`) bound only to localhost (`127.0.0.1`) in your local setup. Never expose these ports to the open internet.
- **Network Isolation:** Do not hardcode service passwords or auth strings in files. Use environment variables defined in secure local configurations.

### 2.3 IPC Serializations (Bincode vs JSON)

To prevent cross-site scripting and memory leaks through Javascript IPC:

- Historical data transferred over the Tauri IPC channel uses binary-encoded serializations (**Bincode**) rather than parsing complex JSONs, securing data injection vectors.
- Keep input sanitation strict when custom commands pass arguments from the frontend React components to Tauri commands.

---

## 3. Threat Model

Our software operations operate under the following threat model constraints:

1. **Targeting Client Devices:** We assume the developer's / trader's local environment is trusted but prone to session hijacking. The Tauri shell prevents typical browser extensions from inspecting memory.
2. **Mitigating MITM (Man-in-the-Middle):** All communication with Zerodha API servers or standard auth endpoints is TLS 1.3 enforced.
3. **Database Security:** QuestDB logs timeseries ticks. Historical data does not contain sensitive trader identification credentials, protecting customer identities in the event of database access leakage.

---

## 4. Best Practices for Developers

- Run regular dependencies audits using `cargo audit` in the Rust projects and `npm audit` in the Node.js/Next.js repositories.
- Keep your local Docker environment updated.
- Enable Multi-Factor Authentication (MFA/TOTP) on your Zerodha Kite trading accounts and GitHub accounts.
