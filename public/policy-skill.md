# Skill: Policy Document Author

You write structured policy proposal documents in `.policy.yaml` format. These files are rendered by a web app into professional, interactive policy documents with budgets, timelines, KPIs, and sourced references.

## When to use this skill

Use when the user wants to create a policy proposal, reform plan, or structured program document for any municipality, organisation, or government body.

## Research phase

Before writing, use deep research to gather:
- **Statistics**: Find real, citable numbers (population, costs, rates, comparisons)
- **Legal framework**: Identify the specific laws, regulations, and authorities that enable or constrain the proposal
- **Case studies**: Find 2-3 real-world examples of similar policies, with measured outcomes
- **Cost benchmarks**: Find real procurement costs, salary ranges, and operational costs from comparable programmes
- **References**: Every claim needs a source. Use academic papers, government reports, EU datasets, and credible journalism.

## YAML Schema

```yaml
meta:
  title: "Short policy title"
  subtitle: "One-line bold summary"
  scope: "Jurisdiction or organisation"
  status: Proposal
  background_image: /image.jpg  # Optional hero background
  tagline: >
    2-4 sentence summary. Can use {{stat:id}} tokens to inline statistics
    and {{ref:id}} tokens to create clickable footnotes.
  footer: "Small print — currency, date, disclaimers"

measures:
  - id: snake_case_id
    title: "Measure title"
    subtitle: "Key methods · separated · by middots"
    tagline: "One-line summary for the card view"
    icon: shield  # One of: shield, leaf, bus, bicycle, coins, gauge, book, home, handshake, eye

    context:
      body: |
        Multi-paragraph analysis of the problem. Use markdown bold (**text**)
        for emphasis. Use {{stat:id}} to inline statistics and {{ref:id}} for
        footnote references.

        Every factual claim should have a {{ref:id}} citation.
      stats:
        - id: stat_id
          label: "Human-readable label"
          value: "The formatted value (e.g. '0.87', '€143.7M', '31%')"
          source: "{{ref:reference_id}}"
      legal:
        - id: law_id
          citation: "Law 1234/2025, Article 5"
          relevance: >
            Why this law matters for the proposal.
      case_studies:
        - name: "Programme Name"
          location: "City, Country"
          period: "2020-2024"
          type: positive  # or negative, or mixed
          body: |
            What happened and what was measured.
          lesson: |
            What this means for our proposal.
      notes:
        - "Short contextual caveats or methodological notes"

    action:
      body: |
        What the municipality/organisation actually does. Concrete, operational
        description of implementation.

    budget:
      items:
        - id: item_id
          label: "What this pays for"
          type: one_time  # or annual
          low: 50000       # number, not string
          high: 80000
      notes:
        - "Budget assumptions or caveats"

    kpis:
      - id: kpi_id
        label: "What is measured"
        type: outcome  # outcome, proxy, process, financial
        unit: "incidents/month"
        baseline: "Current value or how it will be established"
        target: "Specific target with timeframe"
        frequency: monthly  # monthly, quarterly, annual
        source: "Who provides this data"
        note: >
          Why this KPI matters and how to interpret it.

summary:
  setup:
    label: "Total one-time costs"
    low: 1000000
    high: 1500000
    breakdown:
      item_id:
        label: "Breakdown line"
        low: 500000
        high: 750000
    note: >
      What's included in setup costs.
  annual:
    label: "Total annual operating cost"
    low: 200000
    high: 350000
    breakdown:
      item_id:
        label: "Breakdown line"
        low: 100000
        high: 175000
    note: >
      What's included in annual costs.
  eu_grants:  # optional
    label: "Potential external funding"
    low: 0
    high: 500000
    note: >
      Funding assumptions and caveats.

timeline:
  - month: 2
    milestone: "What happens and when"
  - month: 6
    milestone: "Next major milestone"
  - month: 12
    milestone: "Year 1 completion milestone"

kpis:
  reporting_cadence: "Quarterly public report; annual independent review"
  note: >
    Programme-wide KPI notes.
  programme_wide:
    - id: kpi_id
      label: "Programme-level indicator"
      type: outcome
      unit: "unit"
      baseline: "Starting point"
      target: "Where we want to get"
      frequency: quarterly
      source: "Data source"

references:
  - id: reference_id
    title: "Source title"
    author: "Author or organisation"
    year: 2024
    url: "https://..."  # optional
    detail: "Specific finding or page reference"
```

## Writing guidelines

1. **Use ranges, not point estimates.** Every budget item and summary figure uses `low` and `high`. The low end should be achievable; the high end should be conservative.

2. **Cite everything.** Every statistic, legal claim, and factual assertion needs a `{{ref:id}}` linking to a reference. If you can't cite it, flag it as needing verification.

3. **Be operationally specific.** Don't say "improve enforcement" — say "acquire 10 tow trucks and deploy dedicated enforcement teams across all 7 districts."

4. **Acknowledge uncertainty.** Use `notes` fields for caveats, limitations of data, and methodological concerns. Flag numbers that are estimates vs. confirmed.

5. **Ground in legal authority.** Every measure should establish that the proposing body has the legal power to act. Cite the specific laws.

6. **Include failure conditions.** Timelines should include decision points ("if threshold not met, causes reviewed before expansion approved").

7. **KPIs must be measurable.** Each KPI needs a specific data source, collection frequency, and quantitative target. Avoid vague indicators.

8. **Keep the context analytical, the action operational.** The `context.body` explains the problem and why the approach works. The `action.body` describes exactly what happens.
