# Database Design

## Overview

The schema is organized around four core domains:

- **Users & social** — accounts, profiles, and the follow graph
- **Sims** — character sheets, importable via mod or entered manually
- **Challenges** — player-created challenge definitions and tracked runs
- **Posts** — user-initiated content optionally tied to a Sim or challenge run

All features must be accessible via the web app. The mod bridge is an additional client that calls the same API endpoints — nothing is exclusive to it.

---

## Stretch Goals (out of scope for v1)

- `households` table and Sim family tree
- In-game life event prompts posted via mod

---

## Tables

### users
Registered accounts.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| username | VARCHAR(50) | unique, not null |
| email | VARCHAR(255) | unique, not null |
| password_hash | VARCHAR(255) | not null |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| bio | TEXT | |
| profile_picture_url | TEXT | stored in Cloudflare R2 |
| created_at | TIMESTAMPTZ | not null, default now() |

---

### user_follows
Tracks which users follow which other users. Powers the social feed.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| follower_id | BIGINT FK → users | not null |
| followee_id | BIGINT FK → users | not null |
| created_at | TIMESTAMPTZ | not null, default now() |

Unique constraint on (follower_id, followee_id).

---

### sims
Sim character sheets. Can be created manually via the web app or imported via the mod bridge.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users | not null |
| challenge_run_id | BIGINT FK → challenge_runs | nullable — active run this Sim belongs to |
| name | VARCHAR(100) | not null |
| age_stage | VARCHAR(50) | e.g. child, teen, young adult, adult, elder |
| gender | VARCHAR(50) | |
| pronouns | VARCHAR(50) | |
| occult | VARCHAR(50) | nullable — e.g. vampire, mermaid, werewolf, spellcaster |
| aspiration | VARCHAR(100) | |
| career | VARCHAR(100) | |
| career_level | INT | |
| traits | JSONB | array of trait names |
| bonus_trait | VARCHAR(100) | |
| skills | JSONB | map of skill name → level, e.g. {"painting": 7, "cooking": 3} |
| is_alive | BOOLEAN | not null, default true |
| death_type | VARCHAR(100) | nullable |
| bio | TEXT | |
| picture_url | TEXT | stored in Cloudflare R2 |
| is_public | BOOLEAN | not null, default false |
| imported_from_game | BOOLEAN | not null, default false |
| created_at | TIMESTAMPTZ | not null, default now() |
| updated_at | TIMESTAMPTZ | not null, default now() |

---

### challenges
Player-created challenge definitions. A challenge defines the rules, succession laws, and generation goals that players follow during a run.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| creator_id | BIGINT FK → users | not null |
| title | VARCHAR(255) | not null |
| logo | VARCHAR(100) | logo identifier |
| difficulty | VARCHAR(20) | easy, normal, or extreme |
| description | TEXT | |
| succession_laws | JSONB | see structure below |
| is_public | BOOLEAN | not null, default false |
| created_at | TIMESTAMPTZ | not null, default now() |
| updated_at | TIMESTAMPTZ | not null, default now() |

**succession_laws JSONB structure:**
```json
{
  "inheritance": { "law": "matriarchy", "strict": true },
  "bloodline":   { "law": "traditional", "strict": false },
  "heir":        { "law": "exemplar", "strict": false, "exemplar_trait": "creative" },
  "occult":      { "law": "tolerant", "strict": false, "occult": "vampire" }
}
```

---

### challenge_tags
Tags associated with a challenge. Stored separately to allow filtering and search.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| challenge_id | BIGINT FK → challenges | not null |
| tag | VARCHAR(100) | not null |

---

### challenge_packs
Expansion and game packs required by a challenge.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| challenge_id | BIGINT FK → challenges | not null |
| pack_id | VARCHAR(10) | not null — e.g. EP01, GP03 |

---

### generations
The ordered generation goals defined within a challenge. A challenge can have up to 12 generations.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| challenge_id | BIGINT FK → challenges | not null |
| number | INT | not null — generation order (1–12) |
| title | VARCHAR(255) | |
| color | VARCHAR(7) | hex color code |
| description | TEXT | |

---

### generation_requirements
Required tasks a player must complete within a generation.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| generation_id | BIGINT FK → generations | not null |
| display_order | INT | not null |
| body | TEXT | not null |

---

### generation_milestones
Optional goals a player can accomplish within a generation.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| generation_id | BIGINT FK → generations | not null |
| display_order | INT | not null |
| body | TEXT | not null |

---

### challenge_runs
A user's active or completed playthrough of a challenge definition.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users | not null |
| challenge_id | BIGINT FK → challenges | not null |
| active_sim_id | BIGINT FK → sims | nullable — the currently active Sim |
| status | VARCHAR(20) | active, completed, or abandoned |
| started_at | TIMESTAMPTZ | not null, default now() |
| ended_at | TIMESTAMPTZ | nullable |

---

### challenge_run_sims
Tracks the full lineage of Sims across generations within a run. When a Sim dies or completes their generation, their heir becomes the new active Sim.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| run_id | BIGINT FK → challenge_runs | not null |
| sim_id | BIGINT FK → sims | not null |
| generation_number | INT | not null — which generation this Sim represents |
| status | VARCHAR(20) | active, retired, or deceased |
| joined_at | TIMESTAMPTZ | not null, default now() |
| ended_at | TIMESTAMPTZ | nullable |

---

### posts
User-initiated content. Can optionally be tied to a Sim, a challenge run, and a specific generation. Supports multiple photos.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| user_id | BIGINT FK → users | not null |
| sim_id | BIGINT FK → sims | nullable |
| run_id | BIGINT FK → challenge_runs | nullable |
| generation_id | BIGINT FK → generations | nullable |
| title | VARCHAR(255) | |
| body | TEXT | |
| is_public | BOOLEAN | not null, default false |
| created_at | TIMESTAMPTZ | not null, default now() |
| updated_at | TIMESTAMPTZ | not null, default now() |

---

### post_photos
Photos attached to a post. Ordered by display_order.

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| post_id | BIGINT FK → posts | not null |
| photo_url | TEXT | not null — stored in Cloudflare R2 |
| display_order | INT | not null |

---

## Indexes

Indexes are organized by the query patterns they support.

### users
| Index | Columns | Reason |
|---|---|---|
| unique | email | login lookup |
| unique | username | profile lookup |

### user_follows
| Index | Columns | Reason |
|---|---|---|
| unique | (follower_id, followee_id) | prevent duplicate follows |
| index | follower_id | "who am I following" queries |
| index | followee_id | "who follows me" queries and feed queries |

### sims
| Index | Columns | Reason |
|---|---|---|
| index | user_id | "show all my Sims" |
| index | challenge_run_id | "Sims in this run" |

### challenges
| Index | Columns | Reason |
|---|---|---|
| index | creator_id | "challenges I created" |
| index | is_public | browsing public challenges |

### challenge_tags
| Index | Columns | Reason |
|---|---|---|
| index | tag | filtering/searching challenges by tag |
| index | challenge_id | "tags on this challenge" |

### challenge_packs
| Index | Columns | Reason |
|---|---|---|
| index | pack_id | filtering challenges by required pack |
| index | challenge_id | "packs required by this challenge" |

### generations
| Index | Columns | Reason |
|---|---|---|
| index | challenge_id | "generations in this challenge" |

### generation_requirements / generation_milestones
| Index | Columns | Reason |
|---|---|---|
| index | generation_id | "requirements/milestones for this generation" |

### challenge_runs
| Index | Columns | Reason |
|---|---|---|
| index | user_id | "my runs" |
| index | challenge_id | "all runs of this challenge" |

### challenge_run_sims
| Index | Columns | Reason |
|---|---|---|
| index | run_id | "Sims in this run" |
| index | sim_id | "runs this Sim has been part of" |

### posts
| Index | Columns | Reason |
|---|---|---|
| index | user_id | "my posts" |
| index | sim_id | "posts about this Sim" |
| index | run_id | "posts in this challenge run" |
| index | (is_public, created_at) | public feed ordered by recency |

### post_photos
| Index | Columns | Reason |
|---|---|---|
| index | post_id | "photos on this post" |

---

## Design Decisions

### JSONB fields
Three fields use JSONB rather than normalized relational tables:

- **sims.traits** — a flat array of trait names. Traits are display values read together and never queried individually, so a join table adds complexity without benefit.
- **sims.skills** — a map of skill name → level. Same reasoning as traits; skills are always read as a set on the character sheet.
- **challenges.succession_laws** — a fixed-shape object with four law categories. The structure is always present and complete, making JSONB cleaner than 10+ columns or a separate table.

### Normalized tables for filterable data
**challenge_tags** and **challenge_packs** are separate tables rather than JSONB arrays because challenges need to be filtered and searched by tag and by required pack. JSONB arrays cannot be efficiently indexed for this use case.

### challenge_run_sims
Rather than a single `sim_id` on `challenge_runs`, a join table tracks the full Sim lineage across generations. This preserves history — which Sims played which generations, in what order, and how their run ended — without overwriting data as heirs succeed one another. `challenge_runs.active_sim_id` is kept as a convenience pointer to the current active Sim.

### Key query patterns
These are the queries the index strategy is designed to support efficiently:

1. **Social feed** — posts from followed users, ordered by `created_at`
2. **Public challenge browsing** — filter by tag, required pack, and difficulty
3. **User profile** — all public posts, Sims, and challenge runs for a given user
4. **Challenge run timeline** — all posts tied to a specific run, ordered by `created_at`
