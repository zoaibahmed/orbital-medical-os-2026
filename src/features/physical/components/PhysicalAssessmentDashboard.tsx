import { useState } from 'react'
import type { PhysicalAssessment } from '../../../domain/contracts'
import { MeasurementTile } from '../../../ui/medical/MeasurementTile'
import { MedicalPanel } from '../../../ui/medical/MedicalPanel'
import { SANS_DRAFT_QUESTIONS } from '../sansQuestions'

type Answers = Record<string, boolean | null>

/** Collects answers locally. Nothing is saved, scored or diagnosed here. Remount per crew with key={crewId}. */
export function PhysicalAssessmentDashboard({ assessment, onSymptomsChange, section='all' }: { assessment: PhysicalAssessment; onSymptomsChange?: (symptoms: PhysicalAssessment['symptoms']) => void; section?:'all'|'vision'|'physical' }) {
  const [answers, setAnswers] = useState<Answers>(() => Object.fromEntries(assessment.symptoms.map(s => [s.questionId, s.answer])))
  const activeAnswers = onSymptomsChange ? Object.fromEntries(assessment.symptoms.map(s => [s.questionId, s.answer])) : answers

  function update(next: Answers) {
    setAnswers(next)
    onSymptomsChange?.(SANS_DRAFT_QUESTIONS.map(q => ({ questionId: q.id, answer: next[q.id] ?? null })))
  }
  const answered = SANS_DRAFT_QUESTIONS.filter(q => typeof activeAnswers[q.id] === 'boolean').length
  const reported = SANS_DRAFT_QUESTIONS.filter(q => activeAnswers[q.id] === true).length
  const choice = 'sans-answer-label'

  return <div className="grid gap-5">
    {section!=='physical'&&<MedicalPanel title="Vision check (SANS)" aside={<span className="text-sm text-[var(--os-muted)]">Draft questionnaire {assessment.questionnaireVersion}</span>}>
      <p className="!mt-0 max-w-prose text-sm text-[var(--os-muted)]">Did you notice any of these in the last 7 days? This is a self-check. It does not score or diagnose.</p>
      <div className="grid gap-3">
        {SANS_DRAFT_QUESTIONS.map(q => <fieldset key={q.id} className="sans-question">
          <legend>{q.text}</legend>
          <div className="sans-answers">
            {([['Yes', true], ['No', false], ['Unsure', null]] as const).map(([label, value]) => <label key={label} className="sans-answer" data-selected={activeAnswers[q.id]===value}>
              <input type="radio" name={`${assessment.crewId}-${q.id}`} className="peer" checked={activeAnswers[q.id] === value} onChange={() => update({ ...activeAnswers, [q.id]: value })} />
              <span className={choice}>{label}</span>
            </label>)}
          </div>
        </fieldset>)}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p role="status" className="!m-0 font-semibold">{`${answered} of ${SANS_DRAFT_QUESTIONS.length} answered · ${reported} reported`}</p>
        {answered > 0 && <button type="button" className="text-sm underline underline-offset-4" onClick={() => update({})}>Start over</button>}
      </div>
      <p className="operation-note">The counter includes Yes/No answers. Unsure is saved as unknown; it does not create a score.</p>
      {reported > 0 && <p className="!mb-0 text-sm text-[var(--os-warning)]">You reported symptoms. Share them with the flight surgeon.</p>}
    </MedicalPanel>}

    {section!=='vision'&&<MedicalPanel title="Bone and muscle" aside={<span className="text-sm text-[var(--os-muted)]">Supplied values</span>}>
      <div className="grid gap-3 sm:grid-cols-2">
        <MeasurementTile label="Bone density change" measurement={assessment.boneDensityChange} />
        <MeasurementTile label="Muscle mass change" measurement={assessment.muscleMassChange} />
      </div>
      <p>Recorded exercise: {assessment.exerciseMinutes === null ? 'Unavailable' : `${assessment.exerciseMinutes} min`}. {section==='physical'?'Open the Exercise tab to record a session.':'Use the exercise form to record a session.'}</p>
    </MedicalPanel>}
  </div>
}
