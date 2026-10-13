import type { CaseStudy } from '../types/index.ts';

// Long-form write-ups behind the project cards. A project does not need one; the
// card and /work/<slug> both degrade to the short narrative fields in projects.ts.
//
// Standing rule for anything written here: every claim must survive being checked
// against the repo it describes. The keen-ops evidence base, with file:line for
// each fact, is in docs/keen-ops-evidence.md. Where the code and a flattering
// sentence disagree, the code wins — see the "Where it broke" section, which
// exists because the original card copy claimed more than the code supported
// (issue #17).
export const caseStudies: CaseStudy[] = [
  {
    slug: 'keen-ops',
    standfirst:
      'A life OS I use every day, built on one event table and a contract that every write must know how to undo itself. The interesting part is not the contract — it is the hole I left in it, and what the hole cost.',
    diagram: 'event-flow',
    diagramCaption:
      'Capture, execution and reversal. The inverse is computed before the forward op runs, not reconstructed afterwards.',
    sections: [
      {
        heading: 'The problem was joins, not storage',
        body: [
          'Everything worth tracking across a life was already being tracked — in about ten apps that each did one slice well and none of which could see the others. A reading app knows what I finished. A finance app knows what I spent. Neither can answer what I actually do in a week.',
          'The apps were not the problem. The absence of a shared substrate was. So the design starts from one table and works outwards, rather than from features and works in.',
        ],
      },
      {
        heading: 'One table, and every row knows where it came from',
        body: [
          'A single events table holds health, reading and finance. Beyond the obvious columns, each row records how it came to exist: the raw text I sent, which surface it arrived through, which parser read it, and how confident that parser was.',
          'That provenance is what makes a bad parse fixable later. Without it, a row the model guessed wrong is indistinguishable from a row I entered deliberately, and the only honest response to a suspect entry is to distrust the whole store.',
        ],
      },
      {
        heading: 'Every operation computes its own inverse, before it runs',
        body: [
          'Writes go through an operation type with two required halves: do the thing, and describe how to undo it. The inverse is captured from live database state before the forward operation executes — not derived afterwards from a diff — and both directions are stored on the batch.',
          'Ordering is the whole trick. An inverse computed after the fact can only see what changed, which is not always enough to restore what was there. One operation rewrites a document section list; its inverse deliberately snapshots the entire prior list rather than the fields it touched, because a field-level inverse could never put back a section that the forward pass removed.',
          'This is more expensive than a diff and it is the reason correction is cheap. I can be careless at capture time because nothing at capture time is final.',
        ],
      },
      {
        heading: 'Where it broke, and what that cost',
        body: [
          'The contract holds for writes that go through the operations executor. For a while, two paths did not.',
          'Importing a statement rewrites the document structure whatever else it does. Two cases returned early — an empty statement, and a re-import where every line deduplicated — so they booked no rows and skipped the executor. They still changed the document. No batch was recorded, so that change had no inverse.',
          'A missing undo would have been the mild version. What actually happened is worse: with an untracked mutation in between, the next undo reached past it to an older batch and reversed something else entirely. That lost data on 22 April 2026. The failure was not that a no-op could not be undone; it was that a no-op made the next real undo dangerous.',
          'The fix is structural rather than local. Any mutation that happens outside the executor now records a batch whose forward half is a descriptive no-op that is never replayed, and whose inverse is real. That closes the class, not the instance — the invariant is no longer "writes record an inverse" but "anything that changes the document records one".',
        ],
      },
      {
        heading: 'One writer, on purpose',
        body: [
          'The store is SQLite with the connection pool capped at a single connection, in write-ahead logging mode with a busy timeout. Capping the pool is not a performance concession; it is what makes the ordering of batches meaningful, because two concurrent writers can interleave a forward operation and an inverse.',
          'That invariant is also why the MCP server runs inside the same process as the capture bot rather than as its own service. Tool calls are not a second writer reaching into the database — they are another caller of the same executor, subject to the same contract. Splitting it out would be tidier on a diagram and would quietly reintroduce the problem the single connection exists to prevent.',
        ],
      },
      {
        heading: 'What it does not do yet',
        body: [
          'The shared store is what would make a question spanning two domains answerable. Nothing built on it asks one yet — the tooling so far is finance, and the cross-domain query that motivated the whole design remains a property of the schema rather than a feature I can show you.',
          'I would rather say that than imply otherwise. The store earns its shape from the reversibility work, which is real; the join I wanted is still an argument for the design, not evidence of it.',
        ],
      },
    ],
  },
];

export function caseStudyFor(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
