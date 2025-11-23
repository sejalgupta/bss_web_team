import { addPropertyControls, ControlType } from "framer"

export default function Lesson({ lesson }) {
    // Return early if no lesson data
    if (!lesson) {
        return (
            <div className="p-4 rounded-xl shadow-lg bg-white">
                <p className="text-gray-500">No lesson data available</p>
            </div>
        )
    }

    return (
        <div className="p-4 rounded-xl shadow-lg bg-white">
            <h2 className="text-xl font-bold">{lesson.title}</h2>
            <p className="text-gray-600">
                {lesson.target_audience} • {lesson.level}
            </p>

            {lesson.learning_objectives &&
                lesson.learning_objectives.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Learning Objectives:</h3>
                        <ul className="list-disc list-inside">
                            {lesson.learning_objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </div>
                )}

            {lesson.teaching_activities &&
                lesson.teaching_activities.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Teaching Activities:</h3>
                        <ul className="list-disc list-inside">
                            {lesson.teaching_activities.map((act, i) => (
                                <li key={i}>{act}</li>
                            ))}
                        </ul>
                    </div>
                )}

            {lesson.application && (
                <div className="mt-4">
                    <h3 className="font-semibold">Application:</h3>
                    <p>{lesson.application}</p>
                </div>
            )}

            {lesson.assessment && (
                <div className="mt-4">
                    <h3 className="font-semibold">Assessment:</h3>
                    <p>{lesson.assessment}</p>
                </div>
            )}

            {lesson.refs && lesson.refs.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">References:</h3>
                    <ul className="list-disc list-inside">
                        {lesson.refs.map((ref, i) => (
                            <li key={i}>{ref}</li>
                        ))}
                    </ul>
                </div>
            )}

            {lesson.upload_time && (
                <p className="mt-6 text-sm text-gray-500">
                    Uploaded on: {new Date(lesson.upload_time).toLocaleString()}
                </p>
            )}
        </div>
    )
}

// Add Framer property controls for standalone testing
addPropertyControls(Lesson, {
    lesson: {
        type: ControlType.Object,
        title: "Lesson Data",
        defaultValue: {
            title: "Sample Lesson",
            target_audience: "Students",
            level: "High",
            learning_objectives: ["Objective 1", "Objective 2"],
            teaching_activities: ["Activity 1", "Activity 2"],
            application: "Sample application text",
            assessment: "Sample assessment text",
            refs: ["Reference 1", "Reference 2"],
            upload_time: new Date().toISOString(),
        },
        hidden: true, // Hide in production, show for testing
    },
})
