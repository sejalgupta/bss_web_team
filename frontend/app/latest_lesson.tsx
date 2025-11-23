import { useEffect, useState } from "react"

export default function LatestLesson() {
    const [lesson, setLesson] = useState(null)

    useEffect(() => {
        async function fetchLesson() {
            const res = await fetch(
                "https://cycfjdvszpctjxoosspf.supabase.co/rest/v1/lessons?order=upload_time.desc&limit=1",
                {
                    headers: {
                        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y2ZqZHZzenBjdGp4b29zc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc2NzUsImV4cCI6MjA3NDY2MzY3NX0.9VBTKLLkoaDx3Z6g7iyohsjmJHAK6xCzrE7cX1E8ftk",
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y2ZqZHZzenBjdGp4b29zc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc2NzUsImV4cCI6MjA3NDY2MzY3NX0.9VBTKLLkoaDx3Z6g7iyohsjmJHAK6xCzrE7cX1E8ftk",
                    },
                }
            )
            const data = await res.json()
            setLesson(data[0])
        }
        fetchLesson()
    }, [])

    if (!lesson) return <div>Loading...</div>

    return (
        <div className="p-4 rounded-xl shadow-lg bg-white">
            <h2 className="text-xl font-bold">{lesson.title}</h2>
            <p className="text-gray-600">
                {lesson.target_audience} • {lesson.level}
            </p>

            <div className="mt-4">
                <h3 className="font-semibold">Learning Objectives:</h3>
                <ul className="list-disc list-inside">
                    {lesson.learning_objectives?.map((obj, i) => (
                        <li key={i}>{obj}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Teaching Activities:</h3>
                <ul className="list-disc list-inside">
                    {lesson.teaching_activities?.map((act, i) => (
                        <li key={i}>{act}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Application:</h3>
                <p>{lesson.application}</p>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Assessment:</h3>
                <p>{lesson.assessment}</p>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">References:</h3>
                <ul className="list-disc list-inside">
                    {lesson.refs?.map((ref, i) => <li key={i}>{ref}</li>)}
                </ul>
            </div>

            <p className="mt-6 text-sm text-gray-500">
                Uploaded on: {new Date(lesson.upload_time).toLocaleString()}
            </p>
        </div>
    )
}
