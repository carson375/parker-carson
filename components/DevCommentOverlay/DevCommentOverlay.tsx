import React, { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/router'

export interface DevComment {
  id: string
  url: string
  path: string
  selector: string
  tagName: string
  elementText: string
  classes: string
  comment: string
  timestamp: string
}

interface HoverState {
  rect: DOMRect
  tagName: string
  textSnippet: string
  selector: string
  classes: string
}

export default function DevCommentOverlay() {
  const router = useRouter()
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [comments, setComments] = useState<DevComment[]>([])
  const [hoverState, setHoverState] = useState<HoverState | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<HoverState | null>(null)
  const [commentText, setCommentText] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hoveredElementRef = useRef<HTMLElement | null>(null)

  // Strictly enforce localhost only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      setIsLocalhost(
        hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname === '[::1]'
      )
    }
  }, [])

  // Fetch existing comments on mount and route change
  const fetchComments = useCallback(async () => {
    if (!isLocalhost) return
    try {
      const res = await fetch('/api/dev-comment')
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch {
      // Ignore network errors in dev overlay
    }
  }, [isLocalhost])

  useEffect(() => {
    fetchComments()
  }, [fetchComments, router.asPath])

  // Focus textarea when target is selected
  useEffect(() => {
    if (selectedTarget && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [selectedTarget])

  // Generate a clean selector description for the element
  const getElementSelector = (el: HTMLElement): string => {
    if (el.id) return `#${el.id}`
    const testId = el.getAttribute('data-testid')
    if (testId) return `[data-testid="${testId}"]`

    const tag = el.tagName.toLowerCase()
    const classList = Array.from(el.classList)
      .filter(c => !c.startsWith('dev-comment-') && !c.includes('hover:'))
      .slice(0, 2)
      .join('.')

    return classList ? `${tag}.${classList}` : tag
  }

  // Hover and click listeners for Comment Mode
  useEffect(() => {
    if (!isActive) {
      setHoverState(null)
      hoveredElementRef.current = null
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (selectedTarget) return

      const target = e.target as HTMLElement | null
      if (!target) return

      // Ignore our own overlay elements
      if (target.closest('#dev-comment-root')) {
        setHoverState(null)
        hoveredElementRef.current = null
        return
      }

      hoveredElementRef.current = target
      const rect = target.getBoundingClientRect()
      const text = (target.textContent || '').trim().slice(0, 60)

      setHoverState({
        rect,
        tagName: target.tagName.toLowerCase(),
        textSnippet: text ? `"${text}${text.length >= 60 ? '...' : ''}"` : '',
        selector: getElementSelector(target),
        classes: target.className.toString().slice(0, 80),
      })
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Don't intercept clicks inside the comment widget
      if (target.closest('#dev-comment-root')) return

      e.preventDefault()
      e.stopPropagation()

      const rect = target.getBoundingClientRect()
      const text = (target.textContent || '').trim().slice(0, 80)

      setSelectedTarget({
        rect,
        tagName: target.tagName.toLowerCase(),
        textSnippet: text ? `"${text}"` : '',
        selector: getElementSelector(target),
        classes: target.className.toString(),
      })
      setHoverState(null)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedTarget) {
          setSelectedTarget(null)
          setCommentText('')
        } else {
          setIsActive(false)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('click', handleClick, true)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, selectedTarget])

  const handleSaveComment = async () => {
    if (!selectedTarget || !commentText.trim()) return

    setIsSubmitting(true)
    try {
      const payload = {
        url: window.location.href,
        path: router.asPath,
        selector: selectedTarget.selector,
        tagName: selectedTarget.tagName,
        elementText: selectedTarget.textSnippet,
        classes: selectedTarget.classes,
        comment: commentText.trim(),
      }

      const res = await fetch('/api/dev-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setCommentText('')
        setSelectedTarget(null)
        await fetchComments()
      }
    } catch {
      // Ignore network errors in dev overlay
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/dev-comment?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== id))
      }
    } catch {
      // Ignore network errors in dev overlay
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Clear all feedback comments?')) return
    try {
      const res = await fetch('/api/dev-comment', { method: 'DELETE' })
      if (res.ok) {
        setComments([])
      }
    } catch {
      // Ignore network errors in dev overlay
    }
  }

  const handleCopySummary = () => {
    const pageComments = comments.filter(c => c.path === router.asPath)
    const listToCopy = pageComments.length > 0 ? pageComments : comments

    if (listToCopy.length === 0) return

    const summary = [
      `### Visual Feedback for \`${router.asPath}\``,
      ...listToCopy.map(
        (c, idx) =>
          `${idx + 1}. **Element**: \`<${c.tagName}>\` (\`${c.selector}\`)\n   - Context: ${c.elementText || 'N/A'}\n   - **Comment**: "${c.comment}"`
      ),
    ].join('\n\n')

    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentPageComments = comments.filter(c => c.path === router.asPath)

  // Double lock: strictly return nothing in production or non-localhost
  if (process.env.NODE_ENV !== 'development' || !isLocalhost) {
    return null
  }

  return (
    <div id='dev-comment-root' className='font-sans'>
      {/* Visual Hover Bounding Box */}
      {isActive && hoverState && !selectedTarget && (
        <div
          className='pointer-events-none fixed z-[10008] transition-all duration-75 border-2 border-sky-500 bg-sky-500/15 rounded'
          style={{
            top: `${hoverState.rect.top}px`,
            left: `${hoverState.rect.left}px`,
            width: `${hoverState.rect.width}px`,
            height: `${hoverState.rect.height}px`,
          }}
        >
          <div className='absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-600 text-white text-[11px] font-mono shadow-md whitespace-nowrap overflow-hidden max-w-xs'>
            <span>&lt;{hoverState.selector}&gt;</span>
            {hoverState.textSnippet && (
              <span className='opacity-80 truncate'>
                {hoverState.textSnippet}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Selected Element Active Border */}
      {selectedTarget && (
        <div
          className='pointer-events-none fixed z-[10008] border-2 border-amber-500 bg-amber-500/10 rounded ring-4 ring-amber-500/30'
          style={{
            top: `${selectedTarget.rect.top}px`,
            left: `${selectedTarget.rect.left}px`,
            width: `${selectedTarget.rect.width}px`,
            height: `${selectedTarget.rect.height}px`,
          }}
        />
      )}

      {/* Top Banner when in Comment Mode */}
      {isActive && !selectedTarget && (
        <div className='fixed top-4 left-1/2 -translate-x-1/2 z-[10010] bg-gray-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700 text-xs font-medium animate-in fade-in slide-in-from-top-2'>
          <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse' />
          <span>
            <strong>Comment Mode Active:</strong> Click any element to add a
            note
          </span>
          <button
            onClick={() => setIsActive(false)}
            className='ml-2 text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-[11px]'
          >
            Esc to exit
          </button>
        </div>
      )}

      {/* Comment Input Modal */}
      {selectedTarget && (
        <div className='fixed inset-0 z-[10015] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 max-w-md w-full shadow-2xl space-y-4'>
            <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3'>
              <div>
                <h3 className='font-semibold text-sm'>Add Feedback Comment</h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5'>
                  &lt;{selectedTarget.selector}&gt;
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTarget(null)
                  setCommentText('')
                }}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none p-1'
              >
                &times;
              </button>
            </div>

            {selectedTarget.textSnippet && (
              <div className='bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 truncate'>
                <span className='font-medium text-gray-400 mr-1'>Text:</span>
                {selectedTarget.textSnippet}
              </div>
            )}

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                What should Antigravity update here?
              </label>
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSaveComment()
                  }
                }}
                placeholder='e.g. Increase font size, change score background to green, make map height 400px...'
                rows={3}
                className='w-full text-xs p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none'
              />
              <p className='text-[10px] text-gray-400 text-right'>
                Press ⌘+Enter to save
              </p>
            </div>

            <div className='flex justify-end gap-2 pt-1'>
              <button
                type='button'
                onClick={() => {
                  setSelectedTarget(null)
                  setCommentText('')
                }}
                className='px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={!commentText.trim() || isSubmitting}
                onClick={handleSaveComment}
                className='px-4 py-1.5 rounded-lg text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 transition-colors shadow-sm'
              >
                {isSubmitting ? 'Saving...' : 'Save Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Control Dock (Bottom Right) */}
      <div className='fixed bottom-5 right-5 z-[10010] flex items-center gap-2'>
        {/* Toggle Comment Mode Button */}
        <button
          onClick={() => {
            setIsActive(!isActive)
            setSelectedTarget(null)
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-medium text-xs shadow-xl transition-all border ${
            isActive
              ? 'bg-sky-600 text-white border-sky-400 ring-4 ring-sky-500/20'
              : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isActive
                ? 'bg-emerald-300 animate-pulse'
                : 'bg-gray-400 dark:bg-gray-500'
            }`}
          />
          <span>{isActive ? 'Exit Comment Mode' : 'Comment Mode'}</span>
        </button>

        {/* Saved Comments Drawer Trigger */}
        {comments.length > 0 && (
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className='relative flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold'
            title='View saved comments'
          >
            💬
            <span className='absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold'>
              {comments.length}
            </span>
          </button>
        )}
      </div>

      {/* Drawer: List of Comments */}
      {isDrawerOpen && (
        <div className='fixed bottom-16 right-5 z-[10010] w-80 max-h-[480px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-4 flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-2'>
          <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2'>
            <div className='flex items-center gap-2'>
              <h4 className='font-semibold text-xs'>
                Comments ({comments.length})
              </h4>
              {currentPageComments.length > 0 && (
                <span className='text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded'>
                  {currentPageComments.length} on this page
                </span>
              )}
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm'
            >
              &times;
            </button>
          </div>

          <div className='overflow-y-auto max-h-[320px] space-y-2.5 pr-1'>
            {comments.map((item, idx) => (
              <div
                key={item.id}
                className='p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs space-y-1'
              >
                <div className='flex items-center justify-between text-[10px] text-gray-400 font-mono'>
                  <span className='truncate max-w-[170px]'>
                    #{idx + 1} &lt;{item.selector}&gt;
                  </span>
                  <button
                    onClick={() => handleDeleteComment(item.id)}
                    className='text-red-500 hover:text-red-600 px-1'
                    title='Delete comment'
                  >
                    Delete
                  </button>
                </div>
                <p className='text-xs text-gray-800 dark:text-gray-200 font-medium'>
                  {item.comment}
                </p>
                {item.elementText && (
                  <p className='text-[10px] text-gray-500 truncate'>
                    Context: {item.elementText}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className='pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2'>
            <button
              onClick={handleClearAll}
              className='text-[11px] text-gray-500 hover:text-red-500'
            >
              Clear All
            </button>
            <button
              onClick={handleCopySummary}
              className='px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium shadow-sm transition-colors'
            >
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
