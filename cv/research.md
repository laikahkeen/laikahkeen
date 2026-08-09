# CV research — primary sources

Gathered 2026-08-09 to check the assumptions behind `cv/index.html`. Every claim
below is cited. Where the evidence is weak or absent, that is stated rather than
smoothed over.

## Bottom line

1. **Two-column layouts are a documented parsing failure mode.** Greenhouse — an
   actual ATS vendor, not a resume-tool blog — lists "resumes with a columned
   layout" among the causes of an unsuccessful parse. Our CV is a two-column CSS
   grid. This is the single highest-impact finding.
2. **Body font should be 10–12pt.** Ours is 8.7pt — well under the floor.
3. **Margins should be no smaller than 0.5" (12.7mm).** Ours are 11mm × 12mm —
   under it on both axes.
4. **One page is correct** for under 10 years of experience. The trim was right;
   the way it was paid for (shrinking type and margins past the floor) was not.
5. **Bullets: no more than two lines each.** Several of ours run three to five.
6. **Formula: Action Verb + Context + Result (metric/outcome/impact).** Several of
   our bullets open with a noun phrase instead of a verb.
7. **Experience first, education last** for anyone past new-grad. Ours does this.
8. **The "recruiters spend 7.4 seconds" figure is weak evidence** — n=30, run by a
   job board, never peer-reviewed. Don't design around it.

---

## 1. Do two-column layouts break ATS parsers?

**Confidence: high, for Greenhouse specifically.**

Greenhouse's own support documentation on unsuccessful resume parses lists these
causes verbatim:

- "Resumes with a columned layout"
- "Complex resumes with tables, headers, and footers"
- "Resumes with the name and contact information in the header, footer, or text box"
- "Resumes that include graphics, photos, or word art"
- "Resumes without clear sections and differing formats throughout each section"

Source: <https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse>

Greenhouse elsewhere notes that "resume parsing results can vary based on resume
format and order of words", and that the parser "uses standard resume structure to
interpret the content."

Source: <https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads>

**What could not be verified.** Lever's "Understanding Resume Parsing" article is
JavaScript-rendered and returned only a CSS error shell on fetch; Workday's admin
guide was not retrieved. So this finding is documented for **Greenhouse only** —
it should not be stated as "all ATS systems reject two columns."

**A methodological note that matters.** A two-column PDF whose text extracts in
*some* order is not thereby proven safe. Our own `pdftotext` output interleaves the
columns — `PROFILE` is immediately followed by `SKILLS`, then the profile prose,
then the sidebar's language list. Extraction succeeding is not the same as
extraction preserving reading order, and "I ran pdftotext and got text" is not
evidence of ATS compatibility.

**Search-result quality warning.** A plain web search on this question returns
almost exclusively resume-builder vendors (enhancv, atsverification, resumemate,
loopcv, neuracv, resumeoptimizerpro, applyarc…). Every one sells a product whose
value proposition depends on the answer being scary. Their "2026 tests" do not
publish methodology. They were disregarded.

## 2. One page or two?

**Confidence: high for the under-10-years case.**

CMU School of Computer Science, Graduate Resume Guide (2023): *"Students with less
than 10 years of experience should have a one-page resume."*

Source: <https://www.cmu.edu/career/documents/sample-resumes-cover-letters/scs_graduate_resume_guide_2023.pdf>

At ~4 years, one page is right. **Caveat:** this is a *student* career-center
guide. It is not aimed at experienced industry hires, and its section ordering
(education first) is explicitly student-oriented — see §5.

## 3. Typography

**Confidence: high.**

CMU SCS guide, Formatting: *"Use one, easy to read font for the body of the
resume. The size of the font should be 10-12, your name may be larger. Use
formatting, such as bold, underline and italics for emphasis. Margins should be no
smaller than 0.5" and should be consistent throughout the document."*

Source: as above.

Our CV: **8.7pt body, 11mm (0.43") vertical and 12mm (0.47") horizontal margins.**
Both under the stated floor. These were set to win a page-count argument, which
inverts the priority — legibility is the constraint, page count is the outcome.

## 4. Bullet points

**Confidence: high.**

CMU SCS guide, Bullet Points:

- *"Begin sentences with action verbs (past tense unless it's a current activity/project)"*
- *"Try to write one phrase per line when possible, but no more than two lines per bullet point."*
- *"Use this formula: Action Verb + Context (tell the what) + Result (Metrics, Outcome, and/or Impact)"*
- *"bullet points do not require periods"* (consistent punctuation is what matters)

Source: as above.

Gergely Orosz (ex-Uber EM, *The Tech Resume Inside Out*) is reported as advising
"lead with results, not responsibilities." His book's specifics sit behind
thetechresume.com and were not directly verifiable; the blog landing page carries
no detailed guidance.

Source: <https://blog.pragmaticengineer.com/resume/>

**On the "XYZ formula."** Widely attributed to Google/Laszlo Bock as
"Accomplished X as measured by Y by doing Z." CMU's Action Verb + Context + Result
is the same shape from a citable source. **No official Google page stating the XYZ
wording was located** — treat the attribution as unverified folklore even though
the underlying advice is well supported.

## 5. What to include and cut

**Confidence: medium — this is the thinnest evidence base.**

CMU SCS guide, Sections:

- **Required:** Contact Information, Education, Experience and/or Projects, Skills
- **Optional:** Activities, Honors, Publications, Conferences, Objective
- **Do NOT include:** photo; personal information (birth date, marital status,
  height, weight, identity/passport numbers)
- Education "should appear as the first section of a graduate resume" — **this is
  student-specific**; Orosz's guidance is that experience comes first and
  education last unless you are a new graduate.
- GPA/QPA is listed as *optional* information under Education.

Source: CMU SCS guide, as above.

**Notably absent from the required list: a Profile/Summary section.** Only
"Objective" appears, and only as optional. No primary source was found either
supporting *or* condemning a summary block for experienced hires. Common
practitioner advice favours a short one; the evidence base for it is thin, and it
should be treated as a judgement call, not a rule.

**"References available on request"** — no primary source was found recommending
it. It is space spent to convey a default assumption.

**Spoken languages** — no primary-source guidance found either way. Plausibly
relevant for a multilingual market like Malaysia; that is a judgement call, not an
evidenced one.

## 6. Folklore — widely repeated, no primary source found

- **"Recruiters spend 7.4 seconds on a resume."** Traces to a 2018 study by
  Ladders, Inc. — a job board. Sample size **30 recruiters**; selection method
  unpublished; never peer-reviewed; the primary PDF now returns HTTP 403. The
  2012 predecessor claimed 6 seconds. Treat as marketing, not science.
  Sources: <https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/>,
  <https://www.prnewswire.com/news-releases/ladders-updates-popular-recruiter-eye-tracking-study-with-new-key-insights-on-how-job-seekers-can-improve-their-resumes-300744217.html>
- **"75% of resumes are rejected by ATS before a human sees them."** Endlessly
  repeated; no primary source located. Greenhouse's documentation describes
  parsing *into a profile*, not auto-rejection.
- **"The XYZ formula is Google's official advice."** See §4 — the advice is sound,
  the attribution is unverified.
- **ATS-vendor "2026 column tests"** published by resume-builder companies. No
  published methodology, and a direct commercial interest in the result.

## What this means for `cv/index.html`

| Finding | Current CV | Action |
|---|---|---|
| Columned layout impairs parsing (Greenhouse) | two-column CSS grid | **Restructure to single column** |
| Font 10–12pt | 8.7pt | Raise to ≥10pt |
| Margins ≥ 0.5" / 12.7mm | 11mm × 12mm | Raise to ≥12.7mm |
| Bullets ≤ 2 lines | several at 3–5 | Rewrite long bullets |
| Action Verb + Context + Result | several start with nouns | Re-lead with verbs |
| One page under 10 yrs | one page | Keep — but it must survive the three changes above |
| Experience first, education last | already correct | Keep |

The first three changes all *consume* vertical space while the page budget stays
at one page. Content must come down further to absorb them — the layout cannot be
made to pay for it a second time.
