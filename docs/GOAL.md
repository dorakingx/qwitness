Goal: Ship QWitness for ETHOnline 2026 within the remaining 16 hours

あなたはこの新規プロジェクトの実装・テスト・公開・提出準備を担当するCodexです。
計画書やコード断片の提示で終了せず、利用可能なツールを使って実装を進め、実際に動く公開デモ、Public GitHub repository、検証結果、提出用動画、英語の応募文面を揃えてください。
受賞は保証できません。目標は、締切を守り、狙う賞の要件を満たし、技術的に誠実で再現可能な作品を提出できる状態にすることです。

1. Fixed decisions and execution boundaries

Event: ETHOnline 2026. Track: Building from Scratch / Start Fresh.

New project: QWitness.

Tagline: Post-quantum evidence receipts for onchain AI agents.

New repository target: dorakingx/qwitness. GitHubの接続アカウントを実行時に確認する。

Author display name: Doraking.

ユーザー向けUI、README、コードコメント、提出文面、動画字幕、動画タイトル・概要は英語。進捗報告は日本語。

既存プロジェクトのコード・専用デザイン・専用素材を流用しない。公開ライブラリや汎用スターターはライセンスを守り、利用箇所を記録する。

人間の判断・レビュー・録音をAIが実施したことにしない。ユーザーの貢献記録を捏造しない。

新しい暗号方式の発明、資金を預かるウォレット、資産移行、自動取引、独自チェーン、独自ZK回路は今回のスコープ外。

新規スマートコントラクトは必須にしない。Ethereumの実データとThe Graphの統合を主役にする。見栄えのためだけのオンチェーン記録を追加しない。

既存リポジトリ、既存デプロイ、グローバル設定を破壊・上書きしない。有料契約、新たな課金、mainnet送金、秘密鍵の外部送信を勝手に行わない。

YouTubeへのアップロードはユーザーが手動で行う。ハッカソンの最終Submitも確認なしに実行しない。

2. First 30 minutes: deadline, rules, access, and first commit

最初に現在のUTC/JST時刻と参加者ダッシュボードを確認する。
ユーザーの「残り16時間」は予算として使い、公式の絶対締切と区別する。推測した締切時刻を書かない。
登録・参加承認・必要なチェックイン・応募区分・提出フォームへのアクセスも確認し、未完了なら早期に知らせる。

Primary sources:

https://ethglobal.com/events/ethonline2026

https://ethglobal.com/events/ethonline2026/info

https://ethglobal.com/events/ethonline2026/prizes

https://ethglobal.com/events/ethonline2026/prizes/the-graph

https://ethglobal.com/rules

https://ethglobal.com/events/ethonline/info/details

https://thegraph.com/blog/hackathon-resources/

年別ページを最優先し、一般のETHOnlineガイドは補助資料として区別する。
検索キャッシュとページ本文が食い違う場合は、その事実を残し、参加者ダッシュボードの最新表示を確認する。
締切、動画要件、AI利用規定、提出項目、狙う賞の条件をsubmission/requirements.mdに出典と確認日時付きで保存する。
調査は30分で区切り、確認不能項目を明示して実装を並行する。

Main target:
The Graph: Best AI Tooling or AI Use Case with The Graph (From Scratch).
実行時に公式ページの名称・条件・応募可否を再確認する。Continuity専用枠は選ばない。
このGoal作成時に確認された要点は、実際のGraph providerのライブデータ、意味のあるAI利用または再利用可能なAIツール、Public repo、2〜4分のデモ動画。
条件を満たさない賞を、スポンサー名を表示しただけで応募対象にしない。

作業環境、Node、パッケージマネージャ、Git、gh、デプロイ手段、ブラウザ収録、ffmpegを確認する。
現在の作業場所が別リポジトリ内なら、その中に作らず、適切な開発用親ディレクトリに新しいqwitnessディレクトリを作る。
名前が衝突したら既存内容を使わずqwitness-ethonline2026にする。
このGoalをdocs/GOAL.mdに保存し、早期にgit initと最初のコミットを行う。

必要な人手は最初にまとめて短く伝える:

GitHub/Vercel等の認証が未完了なら、その認証。

The GraphのAPIキー。LLMは既存の明示的に利用可能な接続を優先し、足りなければ1つのプロバイダーだけ依頼。

後述の本人による技術レビュー、手動テスト、本人ナレーション録音。

APIキーはチャットへ貼るよう要求せず、ローカル環境変数またはサービスのSecretsへ設定する手順を示す。
既存プロジェクトの.envや個人ファイルを広範に走査して秘密情報を転用しない。
認証待ちでも、独立して進められる実装・テスト・UI・動画構成は止めない。

3. Product: one complete workflow

作るのは、The Graphの実データを根拠にしたAI分析を、ML-DSA-65署名付きの持ち運べる証拠パッケージにするツール。
分析画面だけでなく、再利用できるTypeScriptコア、MCPツール、ネットワークなしで動く検証器を提供する。

Judge journey:

ログインやウォレット接続なしで公開URLを開く。

例題を選び、実際のThe Graph providerへクエリする。

取得元・対象チェーン・ブロック・取得時刻を伴う証拠と、根拠を参照するAI分析を見る。

ML-DSA-65で署名されたreceiptをJSONで取得する。

別画面またはオフライン検証器で署名と署名者の信頼状態を確認する。

数値または分析文を変更すると検証に失敗する。

攻撃者が別鍵で署名し直したreceiptは、数学的に署名が正しくても、事前に指定した署名者とは一致しないことを確認する。

Demo question:
“Compare two lending markets using live onchain data. Which has higher utilization, and what should an analyst monitor next?”

まずは1チェーン・1つの実在するlending subgraph・最大2市場に限定する。
USDC/DAI等の市場が実際に取得できるなら使う。存在しない市場、サブグラフID、ABI、API、デプロイ先を作り話で埋めない。
実在するスキーマを検査し、利用率の定義・単位・小数精度をプロトコルに合わせる。TVLを根拠なく供給総額として扱わない。
分析はread-onlyの調査支援。売買・利回り・資産保護を保証しない。

4. Real Graph integration and AI tooling

公式資料:

https://thegraph.com/docs/en/subgraphs/tooling/subgraph-mcp/introduction/

https://thegraph.com/docs/en/subgraphs/providers/subgraph-studio/managing-api-keys/

https://thegraph.com/docs/en/subgraphs/existing-subgraphs/standard-subgraphs/

最初の60〜90分以内に本物のGraphクエリを1回成功させることを最優先の外部依存チェックとする。
APIキー不足を終盤まで放置しない。利用可能な既存subgraphを使い、新規インデクサーの構築を必須にしない。

実装:

ライブGraphQLクエリ、変数、deployment ID、network/chain ID、取得時刻、利用可能なblock metadata、レスポンスを記録する。

可能なら1つのindexed blockにクエリを固定する。未対応のmetadataはunknownとし、捏造しない。

APIキー入りURL、ヘッダー、LLMキーをreceipt・ログ・動画・クライアントバンドルに含めない。

サーバー側の許可済みproviderとクエリを利用。任意URLへのアクセスや無制限GraphQL proxyにしない。

クエリ回数、結果サイズ、タイムアウト、LLM出力長、利用予算に上限を設ける。

Live / Cached / Recorded sampleを明確に分け、取得時刻と状態を表示する。

API障害を成功画面に見せない。ローカルfixtureはテスト専用。ライブ実行できない場合はGraph賞の要件未達を明示する。

AI:

少なくとも1つの実際のLLMまたはMCPクライアントで動作を実証する。

AI分析を構造化し、claims、evidence references、limitations、suggested monitoringを返す。

数値計算は決定的コードで行い、AIに補完させない。出典のない数値・根拠を検出する。

決定的ルールへのfallbackは明示し、AIが動作したという証拠にしない。

LLMや外部のテキストを信頼せず、秘密の開示や追加ツール実行を誘発できない構成にする。

MCP:

create_market_receipt: 許可された市場と質問から、取得・分析・署名を一貫して実行。

verify_receipt: receiptの完全性と明示的なtrusted keyとの一致を検証。

get_capabilities: 対応スキーマ・市場・署名方式・制限を返す。

WebとMCPは同じcoreを使い、挙動を分岐させない。

stdioのログはstderrへ出し、MCP通信を破壊しない。

実際のMCP tool callと結果を、秘密を除いた実行証拠として保存する。

SKILL.md、設定例、外部開発者が再利用できる最小サンプルを用意する。

5. Cryptography and trust model

公式資料:

https://csrc.nist.gov/pubs/fips/204/final

https://github.com/paulmillr/noble-post-quantum

ML-DSA-65を既存ライブラリで利用し、暗号プリミティブを自作しない。
@noble/post-quantum等の実際のAPI・バージョン・ライセンス・監査状況を確認してpinする。
規格がNIST標準であることと、このアプリやJS実装が認証・監査済みであることを混同しない。

Receipt:

schemaVersion / domain separation / algorithm / signer fingerprint

question / market identifiers / chain / Graph deployment

actual query / variables / block metadata / observation timestamp

evidence data / deterministic calculations / analysis / limitations

analysis mode / model identity when available / policy version

signature / public key

署名対象を明確に定義し、暗号方式や署名者に関するmetadataも変更検出の対象にする。
署名そのものはenvelopeに置き、署名対象に含めない。protected header（version・algorithm・signer fingerprint）とpayloadを署名し、自己参照するreceipt形式にしない。
実績あるJSON canonicalizationを用い、domain-separatedなcanonical payloadのバイト列全体を署名する。
金額・大きな整数・小数精度を丸めで壊さない。payload digestだけを署名して同等の安全性を無検討で主張しない。
CSPRNGで専用鍵を生成し、安定した署名者鍵として安全に保存する。毎リクエスト別鍵にしない。
private keyはサーバーのsecretまたはローカルのgitignoredファイルのみ。ブラウザ・GitHub・動画へ出さない。
公開APIはクライアントから渡された任意の証拠を信頼して署名するoracleにしない。証拠はサーバーが取得し、出所と分析の種別を区別する。

検証結果は少なくとも次を分ける:

Signature integrity: valid / invalid

Signer trust: matches pinned key / unknown / mismatch

Data freshness: observed time / stale / unknown

receiptに同梱された公開鍵でverifyできただけで“Trusted”にしない。
信頼済み鍵はreceiptとは別に与える。鍵のすり替えと、未知の署名者を明確に表示する。

Security statement:
“This receipt verifies the signed content against a specified public key. It does not prove that the data provider is honest, that the AI analysis is correct, or that Ethereum itself is quantum-resistant.”

以下をREADME・画面・発表で明確にする:

耐量子の対象はreceiptの署名。EthereumのEOA、コンセンサス、API通信、資金が自動的に耐量子になるわけではない。

署名付きの誤情報もあり得る。Graphデータの完全性・最新性・正しさの独立証明ではない。

issuedAtは署名者の主張であり、信頼できる時刻認証や歴史的存在証明ではない。

署名者の初回鍵配布、鍵保護、鍵更新は別の信頼問題。secret漏洩やJS side-channelを解決していない。

実際の量子攻撃やECDSA鍵の解読を実行したと主張しない。

未監査の研究・ハッカソンprototypeである。

6. Implementation and interface

構成は小さく保つ。TypeScript、React/Next.js等の手慣れた安定版、必要最小限の依存関係、Vitest、Playwrightを基本にする。
複雑なmonorepo、独自認証、大規模DB、決済、不要なマイクロサービスは導入しない。

推奨構成:

src/core: schema, Graph adapter, analysis, cryptography, verifier

src/app: web UI and bounded API routes

mcp: thin MCP wrapper

scripts: checks, live smoke test, verifier build, recording, rendering

tests: unit, integration, E2E

video: Remotion composition and original recording assets

submission: submission package and evidence

docs: architecture, threat model, provenance, human review

必須画面はExplore / Receipt / Verifyの3つでよい。
メイン画面は左に問いと市場、右に根拠、下にreceiptの検証結果。中心の1操作が迷わずわかること。
英語、デスクトップ中心、390px幅でも操作可能。キーボード操作、ローディング、空状態、エラー、タイムアウト、再実行を用意する。
濃いgraphite、ivory、控えめなmint等の統一した少色構成。読みやすい本文と少量のmonospace。過剰なネオン、粒子、巨大な装飾でごまかさない。
実データの項目から根拠へのリンクを設ける。動かないボタン、架空の数値、未実装の成功通知は禁止。

Tamper Labでは原本を保存したままコピーの数値や分析文を変更し、同じ署名で実際にverifyを再実行する。
別鍵での再署名テストは“Test signer”と明示する。これは量子攻撃の実演ではない。

独立したオフライン検証器を作る。CLIを必須、可能なら依存を同梱した単一HTMLも出力する。
検証にAPI、LLM、CDN、Graph接続を必要としない。ブラウザ版はネットワーク無効状態でも検証できることをテストする。

7. GitHub, deployment, and verification

GitHubの認証確認後、新規Public repoを作成し、実装の節目ごとに意味のあるコミットをpushする。
タイムスタンプや開発履歴を改ざんしない。最終日に巨大なsingle commitだけを作らない。
LICENSE、lockfile、.gitignore、.env.example、CI、READMEを用意する。
公開前と最終時にsecret scanを行う。失敗を黙殺するCI、通っていないテストをpassedと記すことは禁止。
動画など大きなbinaryはgitに無理に入れず、ローカル提出フォルダや許可されたrelease assetsに置く。

既存の認証済みデプロイ先を優先し、新規プロジェクトとして公開する。Vercel等の既存無料枠で足りる構成にする。
審査員にdeployment protectionやログインが要求されないURLを確認する。
初期版も早期にデプロイし、完成までローカルだけで進めない。
本番環境からGraphクエリ・AI分析・署名・ダウンロード・検証が通るか確認する。
認証/APIキー/ネットワーク制約で不可能なら、その一点を明示し、ユーザーが行う最小操作を示す。公開したふりをしない。

Must-pass tests:

正しいreceiptがWebとCLIでverifyされる。

数値、分析文、chain、deployment、query、block、署名の改変が検出される。

別鍵による再署名がpinned signerの検査で弾かれる。

未知の署名者がTrusted扱いにならない。

key order/Unicode/数値表現のcanonicalizationを確認する。

不正JSON、不正base64、不明version、巨大入力で安全に失敗する。

Graphのtimeout、空結果、schema不一致、LLM不正出力で成功を装わない。

ゼロ除算、単位違い、丸め誤差、出典のない数値を検出する。

API secretsと署名secretがclient bundle/receipt/logに出ない。

ネットワークを切っても既存receiptを検証できる。

実際のMCPクライアントからツールを呼べる。

公開URLのfresh browserで主要フローが通る。

clean clone相当の環境でinstall、typecheck、test、buildを実行する。
実際に実行したコマンド・結果・commit SHA・時刻をsubmission/evidence/へ残す。
署名時間、検証時間、receiptサイズは測定できた実測値だけを掲載する。

8. Human contribution and demo production

本人の実質的貢献が必要という公式ガイドの条件を軽視しない。
このGoal自体もAI支援による仕様として保存し、ユーザー本人が書いた仕様だと偽らない。

早期に短いhuman review packetを提示する:

このプロジェクトで保護する対象と保護しない対象。

署名者の鍵をどう信頼するかという設計上の選択。

receipt原本・改変版・別鍵版を本人が操作する手動テスト手順。
ユーザー本人に判断・操作・問題点の指摘を依頼し、実際の返答と修正だけをHUMAN_CONTRIBUTIONS.mdに記録する。
AI_USAGE.mdに生成・補助したファイル、ツール、設計・テスト支援、動画編集支援を明記する。
人間の貢献が未実施なら未実施と表示する。確認ボタンだけで自動的に参加規定を満たすと保証しない。

Video requirements:

実行時の公式規定を確認。確認できたETHOnlineガイドに合わせ、2〜4分、目標約3分、1920x1080、30fps、H.264 MP4、実際の本人ナレーション。

AI voiceover、TTS、本人の音声を合成し直すvoice cloning、音楽と文字だけの代替動画は使わない。

ナレーションは英語で、本人が読みやすい短文にする。目安300〜340語。難しい語を詰め込まない。

初期版のフローが動いた時点で台本と録音手順を渡す。最後まで録音依頼を待たない。

ユーザーのMacのマイク等で録音し、video/input/narration.wav等の指定場所へ保存してもらう。録音開始の許可なしにマイクを使わない。

字幕は本人の実際の音声に合わせる。ノイズ低減・音量調整・無音編集はよいが、声の内容を生成で置き換えない。

約180秒の構成:
0:00–0:15 問題と価値。“An AI answer is not an audit trail.”
0:15–0:55 実アプリでGraphのライブデータ取得。取得元・ブロックを見せる。
0:55–1:25 根拠に基づくAI分析とMCPの実ツール呼び出し。
1:25–2:05 receiptダウンロード、独立した署名検証、改ざん検出。
2:05–2:30 別鍵へのすり替えを検出。IntegrityとTrustの違い。
2:30–2:50 アーキテクチャ、ML-DSAの役割、正しさを保証しない範囲。
2:50–3:00 GitHub、公開デモ、締め。

実際の動作画面を動画の主役にする。目安70%以上を実アプリ・実MCP・実検証の記録にする。
Remotionは導入・締め・拡大・図解・字幕・場面転換に使い、動かない機能を動くように描かない。
レート制限等の待ち時間は編集で除去してよいが、処理速度を偽る高速化をしない。
動画制作基盤で30分以上詰まったら、実画面収録とffmpeg編集へ切り替える。
本人音声がない間はpreview-without-narration.mp4と台本まで完成させ、提出用完成版と呼ばない。

納品:

submission/demo-final.mp4: 本人音声が入り、規定と再生確認を満たした場合のみ。

submission/demo-subtitles.srt

submission/narration-script.md

submission/youtube-title.txt

submission/youtube-description.md

video/内の編集ソースと再レンダリング手順

YouTube title base:
QWitness | Post-Quantum Evidence for AI Agents | ETHOnline 2026

YouTube description:
英語で、実装済み機能、The Graphの実際の使用法、ML-DSA-65の役割、実在するLive demo/GitHubリンク、検証の制限を書く。
URL、ベンチマーク、受賞、監査、mainnet運用、世界初を捏造しない。
チャプターは完成した動画の実際のタイムコードから生成する。
YouTubeのアップロードと公開範囲設定はユーザーが行う。

ffprobe等で尺、解像度、codec、音声trackを検査し、冒頭・中盤・末尾を実際に再生確認する。

9. Submission package

submission/へ以下を用意する:

requirements.md: 最新公式条件、確認日時、未確認事項。

submission.md: フォーム項目に対応する英語のtitle、short description、description、how it is made、challenges、what is new、links。

sponsor-the-graph.md: 実在endpoint/deployment、利用コードの場所、MCP実行例、ライブデータが不可欠な理由、再利用方法。

architecture.svgまたはPNG: 実装と一致する図。

screenshots/: 実アプリの高品質画像3枚程度。

evidence/: 実テスト、ライブクエリ、公開URL確認、MCP実行の証拠。

judge-guide.md: 1分で開始できる操作、正常系、改変テスト、オフライン検証。

pitch-and-qa.md: 英語の短い説明と想定質問。特に「署名はデータの真実性を証明するのか」「なぜPQCか」「何を人間が行ったか」に正直に答える。

final-checklist.md: 確認済みと未完了を区別した提出チェックリスト。

READMEに動作動画、実在する公開URL、導入手順、実測値、脅威モデル、AI利用開示、既存ライブラリと今回の新規実装の区別を含める。
URL未確定なら内部draftでは未確定と書いてよいが、完成版に偽URLや未解決placeholderを残さない。
最終Submit前のpreviewで、英語の主張と実装、repo、動画が一致していることを確認する。

10. Time budget and scope cuts

時間予算は実行開始から最大16時間、または公式締切までの残り時間のうち短い方。
最後の2時間は本人のYouTubeアップロード・HD処理・応募フォーム入力・提出確認のために確保する。
主催者ダッシュボードでこれより短い残り時間が分かったら、すべて前倒しする。

目安:
T+0〜0.5h: 公式条件、認証、repo作成、最初のcommit、必要な人手の依頼。
T+0.5〜2h: Graphのライブ接続、ML-DSAの署名・検証、receipt schema、初期公開URL。
T+2〜6h: WebとMCPの主要フロー、AI分析、正常系の端から端までの実行。
T+6〜9h: 改ざん/署名者すり替え/オフライン検証、本人レビュー、英語台本と録音依頼。
T+9〜11.5h: UI品質、実画面収録、動画初稿、READMEと提出文面。
T+11.5〜14h: 本人音声の合成、動画QA、clean build、公開デモQA、最終push、提出パッケージ完成。
T+14〜16h: ユーザーのアップロードと応募。新機能を追加しない。

遅れたら削る順番:

凝った演出・追加アニメーション。

追加市場・追加チェーン・追加スポンサー。

自由入力チャットの拡張。固定例題でも本物のLLM/MCPを動かす。

削ってはいけない:
ライブGraph統合、実際のML-DSA署名と検証、署名者信頼の区別、改ざんデモ、再現可能なコード、本人の関与、規定に合う動画、公開URLの検証、提出準備。
外部依存の失敗で満たせないものは未達として報告する。安全性や事実を削って完成扱いにしない。

11. Working style and final report

計画を提示しただけ、雛形だけ、UIだけ、TODOだけで終了しない。
独立タスクを並列化できるなら行うが、core/schemaの責任者を1つにし、統合作業を後回しにしない。
進捗は「動くもの・テストしたもの・ブロッカー・残り時間」で短く報告する。
コンテキストが切れても再開できるようSTATUS.mdとNEXT_ACTIONS.mdに事実と次の操作を記録する。
通常の実装判断は自律的に進める。ユーザー操作が必要な認証・実質的レビュー・録音・最終提出だけを早期に具体的に依頼する。

最終報告には必ず以下を含める:

実在するGitHub URL、commit SHA、公開デモURL。

実際に実行したチェックと結果。

動画の実ファイルパス、尺、解像度、本人音声の有無。

英語YouTubeタイトル・概要。

英語応募文面の場所と対象スポンサー。

未達要件、残るユーザー操作、提出までの残り時間。

「提出準備完了」と「実際に提出済み」を区別し、提出確認画面がないのに提出済みと言わない。
これから環境確認と最初の実装を開始してください。