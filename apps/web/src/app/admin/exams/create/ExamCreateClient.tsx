'use client'

import { useState } from 'react'
import Link from 'next/link'

const SAMPLE_PAYLOAD = `{
  "sections": [
    {
      "order": 1,
      "title": "Passage 1",
      "content_html": "<p>Add your passage HTML here.</p>",
      "content_markdown": null,
      "mapping": {}
    }
  ],
  "questions": []
}`

export function ExamCreateClient() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [payloadJson, setPayloadJson] = useState(SAMPLE_PAYLOAD)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    let parsed: { sections: unknown[]; questions: unknown[] }
    try {
      parsed = JSON.parse(payloadJson) as { sections: unknown[]; questions: unknown[] }
    } catch {
      setMessage({ type: 'err', text: 'Invalid JSON in sections/questions payload.' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description: description || undefined,
          sections: parsed.sections,
          questions: parsed.questions,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({
          type: 'err',
          text: typeof body.error === 'string' ? body.error : 'Could not create exam.',
        })
        return
      }
      setMessage({
        type: 'ok',
        text: `Draft exam created: ${body.exam?.slug ?? title}. You can manage it from Manage Exams.`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="exam-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g. Academic Reading Practice 2"
        />
      </div>

      <div>
        <label htmlFor="exam-desc" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="exam-desc"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="exam-payload" className="block text-sm font-medium text-gray-700">
          Sections & questions (JSON)
        </label>
        <p className="mt-1 text-xs text-gray-500 mb-2">
          The API expects <code className="bg-gray-100 px-1 rounded">sections</code> and{' '}
          <code className="bg-gray-100 px-1 rounded">questions</code> arrays. Question authoring UI will expand here;
          for now edit JSON or import from seed files.
        </p>
        <textarea
          id="exam-payload"
          rows={16}
          value={payloadJson}
          onChange={(e) => setPayloadJson(e.target.value)}
          className="font-mono text-sm block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create draft exam'}
        </button>
        <Link
          href="/admin/exams"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
