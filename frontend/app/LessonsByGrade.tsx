import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import Lesson from "./Lesson.tsx"
import { supabaseConfig } from "./config.ts"

export default function LessonsByGrade(props) {
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get grade level from props (can be overridden in Framer)
    const gradeLevel = props.gradeLevel || props.grade

    // Environment variables for Framer
    const SUPABASE_URL = supabaseConfig.url
    const SUPABASE_ANON_KEY = supabaseConfig.anonKey

    useEffect(() => {
        async function fetchLessons() {
            // Validate required config
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                setError("Missing Supabase configuration")
                setLoading(false)
                return
            }

            if (!gradeLevel) {
                setError("No grade level specified")
                setLoading(false)
                return
            }

            try {
                // Map page names to exact database values
                const gradeMappings = {
                    high: "High",
                    middle: "Middle",
                    elementary: "Elementary",
                    High: "High",
                    Middle: "Middle",
                    Elementary: "Elementary",
                }

                const mappedGrade = gradeMappings[gradeLevel] || gradeLevel

                // Build the query with grade filter
                const url = `${SUPABASE_URL}/rest/v1/lessons?target_audience=eq.${mappedGrade}&order=upload_time.desc`

                const res = await fetch(url, {
                    headers: {
                        apikey: SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json",
                        Prefer: "return=minimal",
                    },
                })

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.statusText}`)
                }

                const data = await res.json()
                setLessons(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchLessons()
    }, [gradeLevel, SUPABASE_URL, SUPABASE_ANON_KEY])

    if (loading) return <div className="p-4">Loading lessons...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>
    if (!lessons || lessons.length === 0) {
        return <div className="p-4">No lessons found for {gradeLevel}</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-4">
                {gradeLevel} School Lessons ({lessons.length})
            </h1>

            {lessons.map((lesson, index) => (
                <Lesson key={lesson.id || index} lesson={lesson} />
            ))}
        </div>
    )
}

// Add Framer property controls
addPropertyControls(LessonsByGrade, {
    gradeLevel: {
        type: ControlType.Enum,
        title: "Grade Level",
        options: ["High", "Middle", "Elementary"],
        defaultValue: "High",
        description: "Select the grade level to filter lessons",
    },
})
