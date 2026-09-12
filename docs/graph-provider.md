# The Graph provider and calculation semantics

QWitness uses the official Aave Protocol Subgraphs **ETH Mainnet V3** listing and schema. It does not use the Messari lending schema. Configuration is fixed server-side to Ethereum chain ID `1`, subgraph ID `Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`, and Aave V3 pool `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2`.

## Primary-source verification

Inspected on 2026-09-13:

- [Aave official repository and production deployments](https://github.com/aave/protocol-subgraphs): live README identifies the ETH Mainnet V3 subgraph above. This subgraph ID is a routing identifier; the actual IPFS deployment ID is read from `_meta.deployment` on every execution and retained separately.
- [Aave V3 schema](https://github.com/aave/protocol-subgraphs/blob/85dae6bde68229efe9c9555046fd5bbd336782c9/schemas/v3.schema.graphql): `Reserve` token amounts are `BigInt`; `decimals` is `Int`; `utilizationRate` is `BigDecimal`.
- [Aave utilization mapping](https://github.com/aave/protocol-subgraphs/blob/85dae6bde68229efe9c9555046fd5bbd336782c9/src/helpers/reserve-logic.ts): `calculateUtilizationRate` computes `1 - availableLiquidity / totalLiquidity`, truncates to eight decimal places, and returns zero when total liquidity is zero.
- [Aave V3 tokenization mapping](https://github.com/aave/protocol-subgraphs/blob/85dae6bde68229efe9c9555046fd5bbd336782c9/src/mapping/tokenization/tokenization-v3.ts): token events update liquidity and debt fields; stored utilization is recalculated when reserves are saved.
- [Official Aave Ethereum address book](https://github.com/aave-dao/aave-address-book/blob/main/src/AaveV3Ethereum.sol): USDC underlying `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`, 6 decimals; DAI underlying `0x6B175474E89094C44Da98b954EedeAC495271d0F`, 18 decimals. The pool address above is also verified there.

The adapter checks each returned underlying address, symbol, expected decimals, and pool address. A symbol alone cannot select a market. Both supported reserves must be present exactly once.

## Snapshot and receipt evidence

`getGraphEvidence(apiKey?, fetcher?)` first queries `_meta` for indexed block, hash, timestamp, deployment, and indexing-error status. It then pins the reserves query and its own `_meta` to that block number. If the deployment, block number, hash, or timestamp changes between queries, the adapter fails closed. Graph responses with indexing errors fail.

Successful query texts, variables, and raw JSON responses are saved in `GraphEvidence.queries`; the normalized reserves are saved in `reserves`. `observedAt` is the server's observation time, not trusted timestamping. `_meta.block.timestamp` is retained when available and is `unknown` when missing. Older providers that explicitly reject the optional timestamp field receive one metadata retry without that field. Rejected GraphQL errors are not copied to receipts because provider messages are untrusted and could contain secrets.

The current official repository schema and mapping are verified source references. Reading `_meta.deployment` does not independently prove that the deployed mapping is identical to repository source, that the provider is honest, or that the chain data is correct.

## Deterministic calculations

`calculateMarkets(evidenceOrReserves)` uses `bigint` throughout. Reserve amounts remain base-unit integer strings. Output token amounts are exact decimal strings using the verified token decimals. USDC and DAI amounts are never added or directly compared: only their dimensionless utilization ratios are compared.

The numerator is `totalLiquidity - availableLiquidity`. This is named **utilized liquidity**, not a claim of an independently measured current debt total. `totalCurrentVariableDebt` and `totalPrincipalStableDebt` are preserved as evidence but do not silently replace the mapping's formula. No USD price or TVL is substituted for token liquidity.

Utilization ratio is truncated toward zero to eight decimal places, matching the repository mapping. Utilization percent is this truncated ratio multiplied by 100. The provider's stored utilization is separately retained as `providerUtilizationRatio`. The local calculation does not claim that stored fields include all continuously accrued interest at query time. The official README explicitly distinguishes an indexed snapshot from live accrued balances.

A zero total liquidity produces zero utilization by the Aave mapping convention; this is not evidence of a usable lending market. Negative or malformed amounts, unsupported units, inconsistent token metadata, and available liquidity exceeding total liquidity are rejected. Source semantics alone cannot detect every provider-side unit error that happens to yield a plausible magnitude.

## Operational bounds and credentials

Set `GRAPH_API_KEY` in the gitignored `.env.local` for local use, or in server deployment secrets. Do not prefix it with `NEXT_PUBLIC_`. The adapter uses a fixed key-free gateway URL and `Authorization: Bearer ...`, never an API key in a URL. Clients cannot supply a URL or query. Redirects are rejected.

The complete acquisition has a 12-second deadline, normally two requests, at most three requests for timestamp compatibility, at most two reserves, and at most 128 KiB per response checked while streaming. Errors returned to callers are fixed safe messages; provider response error bodies and fetch exception details are not exposed. There is no fixture fallback, implicit recorded-data mode, retry loop, or hidden live-success substitution.

## Execution status

Unit tests exercise deterministic fixture responses, not a live Graph provider. Source verification and a passing mock test are not proof of a successful production query. Consult the actual timestamped live smoke evidence in `submission/evidence` for execution status; until such evidence is present, live Graph integration remains unverified.
